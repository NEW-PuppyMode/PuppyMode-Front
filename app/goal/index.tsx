import { PrimaryButton } from '@/components/common/buttons/PrimaryButton';
import { GoalCounter } from '@/components/page/onboarding/GoalCounter';
import { OnboardingLayout } from '@/components/page/onboarding/OnboardingLayout';
import { useCreateGoalMutation } from '@/hooks/mutations/useCreateGoalMutation';
import { QUERY_KEYS } from '@/hooks/queries/queryKeys';
import { usePuppyInfoQuery } from '@/hooks/queries/usePuppyInfoQuery';
import { logButtonTap } from '@/utils/analytics';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';

/**
 * 월간 목표 갱신 화면.
 *
 * 최초 온보딩(app/onboarding)과 화면 구성은 같지만 다른 흐름이다. 온보딩은 가입
 * 때 한 번뿐이고 끝나면 알림 권한 요청과 튜토리얼이 이어지는 반면, 이 화면은 목표
 * 주기가 끝날 때마다 돌아오고 끝나면 홈으로만 간다. 한 화면이 두 흐름을 겸하던
 * 동안에는 목표를 갱신할 때마다 iOS 알림 권한을 다시 묻는 문제가 있었다.
 *
 * 진입 판정은 홈이 /main의 isGoal로 한다. (app/home.tsx)
 * 지난 주기의 목표 달성 리포트가 이 앞에 스텝으로 붙을 예정이라, 그때는
 * totalSteps가 2가 되고 리포트를 볼 수 없는 경우에는 건너뛴다.
 */
export default function GoalRenewal() {
  const { data: puppyInfo } = usePuppyInfoQuery();
  const createGoalMutation = useCreateGoalMutation();
  const queryClient = useQueryClient();

  const [count, setCount] = useState(10);

  const handleSubmit = async () => {
    logButtonTap('goal_renewal_submit');
    try {
      await createGoalMutation.mutateAsync({ goal: count, isNew: true });

      // 홈은 isGoal로 이 화면 진입을 판정한다. 갱신된 /main을 받기 전에 돌아가면
      // 홈이 다시 여기로 보내므로, 재요청이 끝난 뒤에 이동한다.
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.puppyInfo });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recentGoal });

      router.replace('/home');
    } catch (error) {
      console.log('월간 목표 설정 실패:', error);
      Alert.alert('잠시 후 다시 시도해주세요', '목표 저장에 실패했어요.');
    }
  };

  return (
    <OnboardingLayout
      step={1}
      totalSteps={1}
      breed={puppyInfo?.puppyLevelName ?? ''}
      title={
        <>
          이번 달 <Text style={styles.highlight}>나의 목표</Text>로{'\n'}
          정해봐요!
        </>
      }
      subtitle='목표는 언제든지 바꿀 수 있습니다.'
      bubbleText={
        '이번 달에 지키고 싶은\n새로운 목표를 알려주세요!\n오늘부터 한 달 동안 지킬 거예요!'
      }
    >
      <GoalCounter value={count} onChange={setCount} />
      <PrimaryButton
        title='시작하기'
        onPress={handleSubmit}
        disabled={createGoalMutation.isPending}
      />
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  highlight: {
    color: '#0FD380',
  },
});
