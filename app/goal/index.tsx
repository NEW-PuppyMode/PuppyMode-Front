import { PrimaryButton } from '@/components/common/buttons/PrimaryButton';
import { MonthlyReportStats } from '@/components/page/goal/MonthlyReportStats';
import { GoalCounter } from '@/components/page/onboarding/GoalCounter';
import { OnboardingLayout } from '@/components/page/onboarding/OnboardingLayout';
import { useCreateGoalMutation } from '@/hooks/mutations/useCreateGoalMutation';
import { QUERY_KEYS } from '@/hooks/queries/queryKeys';
import { usePuppyInfoQuery } from '@/hooks/queries/usePuppyInfoQuery';
import { useReportQuery } from '@/hooks/queries/useReportQuery';
import { logEvent } from '@/utils/analytics';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, View } from 'react-native';

// 리포트 스텝의 강아지 말풍선. 지난 달 목표를 달성했는지에 따라 다르다.
const REPORT_BUBBLE = {
  ACHIEVED: '이번 달 목표를 지켰어\n정말 잘했어! 앞으로도 잘해보자!!',
  FAILED: '이번 달 목표 달성 실패했어..\n다음 달엔 같이 힘내자!',
};

const getLastMonth = () => {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
};

/**
 * 월간 목표 갱신 화면.
 *
 * 최초 온보딩(app/onboarding)과 화면 구성은 같지만 다른 흐름이다. 온보딩은 가입
 * 때 한 번뿐이고 끝나면 알림 권한 요청과 튜토리얼이 이어지는 반면, 이 화면은 목표
 * 주기가 끝날 때마다 돌아오고 끝나면 홈으로만 간다. 한 화면이 두 흐름을 겸하던
 * 동안에는 목표를 갱신할 때마다 iOS 알림 권한을 다시 묻는 문제가 있었다.
 *
 * 진입 판정은 홈이 /main의 isGoal로 한다. (app/home.tsx)
 * 지난 달 목표를 달성했거나 실패했으면 목표 설정 앞에 지난 달 리포트 스텝을
 * 보여준다. 지난 달 목표가 없었거나 리포트를 못 불러오면 목표 설정만 나온다.
 */
export default function GoalRenewal() {
  const { data: puppyInfo, isPending: isPuppyInfoPending } =
    usePuppyInfoQuery();
  const createGoalMutation = useCreateGoalMutation();
  const queryClient = useQueryClient();

  const [lastMonth] = useState(getLastMonth);
  const { data: report, isPending: isReportPending } = useReportQuery(
    lastMonth.year,
    lastMonth.month,
  );

  const [isReportDone, setIsReportDone] = useState(false);
  const [count, setCount] = useState(10);

  const reportStatus =
    report?.goalStatus === 'ACHIEVED' || report?.goalStatus === 'FAILED'
      ? report.goalStatus
      : null;

  // 리포트 스텝이 처음 보일 때 한 번만 남긴다. goal_setup_completed(renewal)와
  // 이어 보면 리포트를 본 뒤 목표 설정까지 간 비율을 달성/실패별로 볼 수 있다.
  const hasLoggedReportRef = useRef(false);
  useEffect(() => {
    if (!reportStatus || hasLoggedReportRef.current) return;
    hasLoggedReportRef.current = true;
    logEvent('monthly_report_viewed', { goal_status: reportStatus });
  }, [reportStatus]);

  const handleSubmit = async () => {
    try {
      await createGoalMutation.mutateAsync({
        goal: count,
        isNew: true,
        entryPoint: 'renewal',
      });

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

  // 리포트 유무로 스텝 수가 바뀌므로, 목표 설정이 먼저 보였다가 리포트로 바뀌지 않게 기다린다.
  // 그동안 빈 화면 대신 레이아웃과 같은 배경만 깔아 둔다. 타이틀·강아지 등을 먼저 띄우면
  // 진행 점 개수와 하단 버튼이 응답 뒤에 바뀌어 오히려 깜빡여 보인다.
  // 실패하면 isPending이 풀리고 report가 없어 목표 설정만 나온다.
  // 강아지 외형(성장 단계)은 마운트 시 레벨로 정해지고 이후 단계 변화는 반영되지 않으므로
  // (EvolvingPuppy) /main도 함께 기다린다. 홈에서 오면 캐시가 있어 바로 지나간다.
  if (isReportPending || isPuppyInfoPending) {
    return (
      <ImageBackground
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        source={require('@/assets/images/home_background.png')}
        style={styles.background}
        resizeMode='cover'
      />
    );
  }

  const totalSteps = reportStatus ? 2 : 1;
  const breed = puppyInfo?.puppyLevelName ?? '';
  const level = puppyInfo?.puppyLevel ?? 1;

  if (report && reportStatus && !isReportDone) {
    return (
      <OnboardingLayout
        step={1}
        totalSteps={totalSteps}
        breed={breed}
        level={level}
        title={
          <>
            {lastMonth.month}월 리포트가{'\n'}
            <Text style={styles.highlight}>도착</Text>했어요!
          </>
        }
        subtitle='지난 한 달, 나는 이렇게 보냈어요.'
        bubbleText={REPORT_BUBBLE[reportStatus]}
      >
        <View style={styles.inputSlot}>
          <MonthlyReportStats
            month={lastMonth.month}
            drinkDays={report.drinkDays}
            goal={report.goal}
          />
        </View>
        <PrimaryButton title='다음으로' onPress={() => setIsReportDone(true)} />
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout
      step={totalSteps}
      totalSteps={totalSteps}
      breed={breed}
      level={level}
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
      <View style={styles.inputSlot}>
        <GoalCounter value={count} onChange={setCount} />
      </View>
      <PrimaryButton
        title='시작하기'
        onPress={handleSubmit}
        disabled={createGoalMutation.isPending}
      />
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  highlight: {
    color: '#0FD380',
  },
  inputSlot: {
    height: 52,
    justifyContent: 'center',
  },
});
