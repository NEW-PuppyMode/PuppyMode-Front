import { PrimaryButton } from '@/components/common/buttons/PrimaryButton';
import { TextInput } from '@/components/common/Inputs/TextInput';
import { ControlButton } from '@/components/page/home/ControlButton';
import { OnboardingLayout } from '@/components/page/onboarding/OnboardingLayout';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCreateGoalMutation } from '@/hooks/mutations/useCreateGoalMutation';
import { useRenamePuppyMutation } from '@/hooks/mutations/useRenamePuppyMutation';
import { useRenameUserMutation } from '@/hooks/mutations/useRenameUserMutation';
import { useCompleteOnboarding } from '@/hooks/onboarding/useCompleteOnboarding';
import { logButtonTap } from '@/utils/analytics';
import { maxDaysInMonth } from '@/utils/dateUtils';
import { useLocalSearchParams } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

type Step = 1 | 2 | 3;

/**
 * 온보딩 화면 (한 화면, 3단계).
 * step 1: 강아지 이름 짓기
 * step 2: 내 이름 알려주기
 * step 3: 이번 달 목표(음주 허용 횟수) 설정 → (iOS 알림 권한 요청) → 홈
 * 배경 · 강아지 · 진행 점은 유지되고 타이틀 · 말풍선 · 하단 영역만 바뀐다.
 */
export default function Onboarding() {
  const { breed } = useLocalSearchParams<{ breed?: string }>();
  const createGoalMutation = useCreateGoalMutation();
  const renamePuppyMutation = useRenamePuppyMutation();
  const renameUserMutation = useRenameUserMutation();
  const { complete } = useCompleteOnboarding();

  const [step, setStep] = useState<Step>(1);
  const [dogName, setDogName] = useState('');
  const [userName, setUserName] = useState('');
  const [count, setCount] = useState(10);

  // step 1 → 2 : 강아지 이름 저장 성공 시에만 내 이름 단계로
  const handleDogNameNext = async () => {
    const trimmed = dogName.trim();
    if (!trimmed) return;
    logButtonTap('onboarding_puppy_name_next');
    try {
      await renamePuppyMutation.mutateAsync(trimmed);
      setStep(2);
    } catch (error) {
      console.log('온보딩 강아지 이름 설정 실패:', error);
      Alert.alert('잠시 후 다시 시도해주세요', '이름 저장에 실패했어요.');
    }
  };

  // step 2 → 3 : 내 이름 저장 성공 시에만 목표 단계로
  const handleUserNameNext = async () => {
    const trimmed = userName.trim();
    if (!trimmed) return;
    logButtonTap('onboarding_user_name_next');
    try {
      await renameUserMutation.mutateAsync(trimmed);
      setStep(3);
    } catch (error) {
      console.log('온보딩 사용자 이름 설정 실패:', error);
      Alert.alert('잠시 후 다시 시도해주세요', '이름 저장에 실패했어요.');
    }
  };

  // step 3 : 목표 저장 성공 시에만 알림 권한 요청 → 홈 이동
  const handleGoalNext = async () => {
    logButtonTap('onboarding_goal_next');
    try {
      await createGoalMutation.mutateAsync({ goal: count, isNew: true });
      await complete();
    } catch (error) {
      console.log('온보딩 목표 설정 실패:', error);
      Alert.alert('잠시 후 다시 시도해주세요', '목표 저장에 실패했어요.');
    }
  };

  const titleByStep: Record<Step, ReactNode> = {
    1: (
      <>
        내 강아지에게{'\n'}
        <Text style={styles.highlight}>이름</Text>을 지어주세요!
      </>
    ),
    2: (
      <>
        <Text style={styles.highlight}>내 이름</Text>을 강아지에게{'\n'}
        알려주세요!
      </>
    ),
    3: (
      <>
        이번 달 <Text style={styles.highlight}>나의 목표</Text>로{'\n'}
        정해봐요!
      </>
    ),
  };

  const subtitleByStep: Record<Step, string> = {
    1: '이름을 지어주면 강아지와 더 친해질 수 있어요.',
    2: '이름을 알려주면 강아지와 더 친해질 수 있어요.',
    3: '목표는 언제든지 바꿀 수 있습니다.',
  };

  const bubbleByStep: Record<Step, string> = {
    1: '주인님, 저에게 어울리는\n이름을 지어주세요!',
    2: '주인님!\n앞으로는 어떻게 불러드릴까요?',
    3: '이번 달에 지키고 싶은\n새로운 목표를 알려주세요!\n오늘부터 한 달 동안 지킬 거예요!',
  };

  return (
    <OnboardingLayout
      step={step}
      breed={breed}
      title={titleByStep[step]}
      subtitle={subtitleByStep[step]}
      bubbleText={bubbleByStep[step]}
    >
      {step === 1 ? (
        <>
          <TextInput
            placeholder='이름을 입력해주세요.'
            value={dogName}
            onChangeText={setDogName}
            returnKeyType='done'
            onSubmitEditing={handleDogNameNext}
          />
          <PrimaryButton
            title='다음으로'
            onPress={handleDogNameNext}
            disabled={!dogName.trim() || renamePuppyMutation.isPending}
          />
        </>
      ) : step === 2 ? (
        <>
          <TextInput
            placeholder='이름을 입력해주세요.'
            value={userName}
            onChangeText={setUserName}
            returnKeyType='done'
            onSubmitEditing={handleUserNameNext}
          />
          <PrimaryButton
            title='다음으로'
            onPress={handleUserNameNext}
            disabled={!userName.trim() || renameUserMutation.isPending}
          />
        </>
      ) : (
        <>
          <View style={styles.counterRow}>
            <ControlButton
              label='-'
              onPress={() => setCount((n) => Math.max(1, n - 1))}
            />
            <ThemedView className='px-5 py-3 mx-1 bg-green-100 shadow-sm rounded-2xl'>
              <ThemedText
                style={{ color: '#21D08A', fontWeight: '600', fontSize: 16 }}
                className='text-green-500'
              >
                {count}번
              </ThemedText>
            </ThemedView>
            <ControlButton
              label='+'
              onPress={() => setCount((n) => Math.min(maxDaysInMonth, n + 1))}
            />
          </View>
          <PrimaryButton
            title='시작하기'
            onPress={handleGoalNext}
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
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
