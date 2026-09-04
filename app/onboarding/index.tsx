import { PrimaryButton } from '@/components/common/buttons/PrimaryButton';
import { TextInput } from '@/components/common/Inputs/TextInput';
import { GoalCounter } from '@/components/page/onboarding/GoalCounter';
import { OnboardingLayout } from '@/components/page/onboarding/OnboardingLayout';
import { useCreateGoalMutation } from '@/hooks/mutations/useCreateGoalMutation';
import { useRenamePuppyMutation } from '@/hooks/mutations/useRenamePuppyMutation';
import { useRenameUserMutation } from '@/hooks/mutations/useRenameUserMutation';
import { useCompleteOnboarding } from '@/hooks/onboarding/useCompleteOnboarding';
import { usePuppyInfoQuery } from '@/hooks/queries/usePuppyInfoQuery';
import { logButtonTap } from '@/utils/analytics';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';

type StepKey = 'puppyName' | 'userName' | 'goal';

// 항상 이 순서로 노출하되, 아직 안 한 단계만 필터링해서 보여준다.
const STEP_ORDER: StepKey[] = ['puppyName', 'userName', 'goal'];

/**
 * 온보딩 화면 (한 화면).
 * 진입 시점의 완료 여부(isPuppyName / isMyName / isGoal)를 보고
 * 아직 안 한 단계만 순서대로 보여준다. 진행 점도 그 개수만큼만 표시.
 * 마지막 단계 완료 시 (iOS 알림 권한 요청 후) 홈으로 이동한다.
 */
export default function Onboarding() {
  const { data: puppyInfo } = usePuppyInfoQuery();
  const createGoalMutation = useCreateGoalMutation();
  const renamePuppyMutation = useRenamePuppyMutation();
  const renameUserMutation = useRenameUserMutation();
  const { complete } = useCompleteOnboarding();

  // 진입 시점의 미완료 단계만 한 번 고정한다.
  // (단계 완료 → puppyInfo 갱신으로 목록이 도중에 바뀌는 것을 방지)
  const [steps, setSteps] = useState<StepKey[] | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const initedRef = useRef(false);

  const [dogName, setDogName] = useState('');
  const [userName, setUserName] = useState('');
  const [count, setCount] = useState(10);

  useEffect(() => {
    if (!puppyInfo || initedRef.current) return;
    initedRef.current = true;

    const needed = STEP_ORDER.filter((key) => {
      if (key === 'puppyName') return !puppyInfo.isPuppyName;
      if (key === 'userName') return !puppyInfo.isMyName;
      return !puppyInfo.isGoal;
    });

    if (needed.length === 0) {
      // 이미 모두 완료된 상태로 진입한 경우 → 홈으로
      complete();
      return;
    }
    setSteps(needed);
  }, [puppyInfo, complete]);

  // 필요한 단계가 확정되기 전에는 렌더하지 않는다.
  if (!steps || steps.length === 0) return null;

  const currentKey = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const nextTitle = isLast ? '시작하기' : '다음으로';

  const goNext = async () => {
    if (isLast) {
      await complete();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const handlePuppyName = async () => {
    const trimmed = dogName.trim();
    if (!trimmed) return;
    logButtonTap('onboarding_puppy_name_next');
    try {
      await renamePuppyMutation.mutateAsync(trimmed);
      await goNext();
    } catch (error) {
      console.log('온보딩 강아지 이름 설정 실패:', error);
      Alert.alert('잠시 후 다시 시도해주세요', '이름 저장에 실패했어요.');
    }
  };

  const handleUserName = async () => {
    const trimmed = userName.trim();
    if (!trimmed) return;
    logButtonTap('onboarding_user_name_next');
    try {
      await renameUserMutation.mutateAsync(trimmed);
      await goNext();
    } catch (error) {
      console.log('온보딩 사용자 이름 설정 실패:', error);
      Alert.alert('잠시 후 다시 시도해주세요', '이름 저장에 실패했어요.');
    }
  };

  const handleGoal = async () => {
    logButtonTap('onboarding_goal_next');
    try {
      await createGoalMutation.mutateAsync({ goal: count, isNew: true });
      await goNext();
    } catch (error) {
      console.log('온보딩 목표 설정 실패:', error);
      Alert.alert('잠시 후 다시 시도해주세요', '목표 저장에 실패했어요.');
    }
  };

  const titleByKey: Record<StepKey, ReactNode> = {
    puppyName: (
      <>
        내 강아지에게{'\n'}
        <Text style={styles.highlight}>이름</Text>을 지어주세요!
      </>
    ),
    userName: (
      <>
        <Text style={styles.highlight}>내 이름</Text>을 강아지에게{'\n'}
        알려주세요!
      </>
    ),
    goal: (
      <>
        이번 달 <Text style={styles.highlight}>나의 목표</Text>로{'\n'}
        정해봐요!
      </>
    ),
  };

  const subtitleByKey: Record<StepKey, string> = {
    puppyName: '이름을 지어주면 강아지와 더 친해질 수 있어요.',
    userName: '이름을 알려주면 강아지와 더 친해질 수 있어요.',
    goal: '목표는 언제든지 바꿀 수 있습니다.',
  };

  const bubbleByKey: Record<StepKey, string> = {
    puppyName: '주인님, 저에게 어울리는\n이름을 지어주세요!',
    userName: '주인님!\n앞으로는 어떻게 불러드릴까요?',
    goal: '이번 달에 지키고 싶은\n새로운 목표를 알려주세요!\n오늘부터 한 달 동안 지킬 거예요!',
  };

  return (
    <OnboardingLayout
      step={stepIndex + 1}
      totalSteps={steps.length}
      breed={puppyInfo?.puppyLevelName ?? ''}
      title={titleByKey[currentKey]}
      subtitle={subtitleByKey[currentKey]}
      bubbleText={bubbleByKey[currentKey]}
    >
      {currentKey === 'puppyName' ? (
        <>
          <TextInput
            placeholder='이름을 입력해주세요.'
            value={dogName}
            onChangeText={setDogName}
            returnKeyType='done'
            onSubmitEditing={handlePuppyName}
          />
          <PrimaryButton
            title={nextTitle}
            onPress={handlePuppyName}
            disabled={!dogName.trim() || renamePuppyMutation.isPending}
          />
        </>
      ) : currentKey === 'userName' ? (
        <>
          <TextInput
            placeholder='이름을 입력해주세요.'
            value={userName}
            onChangeText={setUserName}
            returnKeyType='done'
            onSubmitEditing={handleUserName}
          />
          <PrimaryButton
            title={nextTitle}
            onPress={handleUserName}
            disabled={!userName.trim() || renameUserMutation.isPending}
          />
        </>
      ) : (
        <>
          <GoalCounter value={count} onChange={setCount} />
          <PrimaryButton
            title={nextTitle}
            onPress={handleGoal}
            disabled={createGoalMutation.isPending}
          />
        </>
      )}
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  highlight: {
    color: '#0FD380',
  },
});
