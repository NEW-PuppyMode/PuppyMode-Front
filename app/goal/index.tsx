import { PrimaryButton } from '@/components/common/buttons/PrimaryButton';
import { MonthlyReportStats } from '@/components/page/goal/MonthlyReportStats';
import { GoalCounter } from '@/components/page/onboarding/GoalCounter';
import { OnboardingLayout } from '@/components/page/onboarding/OnboardingLayout';
import { useCreateGoalMutation } from '@/hooks/mutations/useCreateGoalMutation';
import { QUERY_KEYS } from '@/hooks/queries/queryKeys';
import { usePuppyInfoQuery } from '@/hooks/queries/usePuppyInfoQuery';
import { useRecentGoalQuery } from '@/hooks/queries/useRecentGoalQuery';
import { useReportQuery } from '@/hooks/queries/useReportQuery';
import { ReportResultDTO } from '@/services/reportData';
import { RecentGoal } from '@/types/models/puppy';
import { logEvent } from '@/utils/analytics';
import { maxDaysInMonth } from '@/utils/dateUtils';
import { hideSplash } from '@/utils/splash';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, View } from 'react-native';

// 리포트 스텝의 강아지 말풍선. 지난 달 목표를 달성했는지에 따라 다르다.
const REPORT_BUBBLE = {
  ACHIEVED: '이번 달 목표를 지켰어\n정말 잘했어! 앞으로도 잘해보자!!',
  FAILED: '이번 달 목표 달성 실패했어..\n다음 달엔 같이 힘내자!',
};

// 리포트를 보여줄 달. 달력상 지난 달이 아니라 가장 최근에 목표를 세운 달이다.
// 8월에 목표를 세우고 9월을 건너뛴 채 10월에 들어오면 8월 리포트를 보여준다.
// 목표를 세운 적이 없거나 그 달이 이번 달이면 보여줄 리포트가 없다.
const getReportMonth = (recentGoal: RecentGoal | null | undefined) => {
  const year = recentGoal?.latestGoalYear;
  const month = recentGoal?.latestGoalMonth;
  if (!year || !month) return null;

  const now = new Date();
  if (year === now.getFullYear() && month === now.getMonth() + 1) return null;

  return { year, month };
};

// 목표 설정 스텝의 처음 값. 리포트 기준 달의 목표가 있으면 그 값으로 시작한다.
// /goals의 monthlyGoalCount는 현재 달 목표라 쓰지 않는다. (types/models/puppy.ts)
// 31번이던 목표를 30일인 달에 이어 쓰면 카운터 범위(이번 달 일수)를 넘으므로 맞춘다.
const DEFAULT_GOAL = 10;
const getInitialGoal = (report: ReportResultDTO | undefined) => {
  const lastGoal = report?.goal;
  if (!lastGoal || lastGoal < 1) return DEFAULT_GOAL;
  return Math.min(lastGoal, maxDaysInMonth);
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
 * 가장 최근에 목표를 세운 달(/goals)의 목표를 달성했거나 실패했으면 목표 설정 앞에
 * 그 달의 리포트 스텝을 보여준다. 그 달 목표가 없었거나 /goals·리포트를 못 불러오면
 * 목표 설정만 나온다.
 */
export default function GoalRenewal() {
  const { data: puppyInfo, isPending: isPuppyInfoPending } =
    usePuppyInfoQuery();
  const createGoalMutation = useCreateGoalMutation();
  const queryClient = useQueryClient();

  const { data: recentGoal, isPending: isRecentGoalPending } =
    useRecentGoalQuery();

  // 스텝 구성은 진입 시점의 /goals로 한 번만 정한다. 목표를 저장하면 홈으로 가기 전에
  // /goals를 다시 받는데, 그때는 최근 목표 달이 이번 달이 되어 리포트 스텝이 사라지고
  // 진행 점 개수와 말풍선이 바뀌어 보인다. undefined는 아직 정하지 않았다는 뜻이다.
  const [reportMonth, setReportMonth] = useState<
    ReturnType<typeof getReportMonth> | undefined
  >(undefined);
  useEffect(() => {
    if (reportMonth !== undefined || isRecentGoalPending) return;
    setReportMonth(getReportMonth(recentGoal));
  }, [reportMonth, isRecentGoalPending, recentGoal]);

  const { data: report, isPending: isReportPending } = useReportQuery(
    reportMonth?.year ?? 0,
    reportMonth?.month ?? 0,
    !!reportMonth,
  );

  // 목표 카운터는 사용자가 바꾸기 전까지 리포트 기준 달의 목표를 보여준다.
  // 화면은 리포트를 받을 때까지 대기하므로 기본값이 먼저 보였다가 바뀌지 않는다.
  // 리포트가 없거나 못 불러오면 기본값.
  const [editedCount, setCount] = useState<number | null>(null);
  const count = editedCount ?? getInitialGoal(report);

  // 앱 진입 시 홈에서 바로 넘어온 경우 스플래시를 여기서 내린다.
  // 대기 중에도 배경이 깔려 있어 흰 화면이 보이지 않는다. (utils/splash.ts)
  useEffect(() => {
    hideSplash();
  }, []);

  const [isReportDone, setIsReportDone] = useState(false);

  const reportStatus =
    reportMonth &&
    (report?.goalStatus === 'ACHIEVED' || report?.goalStatus === 'FAILED')
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
  // 리포트 조회는 조회할 달이 정해져야 켜지므로(꺼진 동안 isPending이 true로 남는다)
  // 조회할 달부터 정하고, 조회할 달이 있을 때만 리포트를 기다린다.
  // 강아지 외형(성장 단계)은 마운트 시 레벨로 정해지고 이후 단계 변화는 반영되지 않으므로
  // (EvolvingPuppy) /main도 함께 기다린다. 홈에서 오면 캐시가 있어 바로 지나간다.
  if (
    reportMonth === undefined ||
    (reportMonth && isReportPending) ||
    isPuppyInfoPending
  ) {
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

  if (reportMonth && report && reportStatus && !isReportDone) {
    return (
      <OnboardingLayout
        step={1}
        totalSteps={totalSteps}
        breed={breed}
        level={level}
        title={
          <>
            {reportMonth.month}월 리포트가{'\n'}
            <Text style={styles.highlight}>도착</Text>했어요!
          </>
        }
        subtitle='지난 한 달, 나는 이렇게 보냈어요.'
        bubbleText={REPORT_BUBBLE[reportStatus]}
      >
        <View style={styles.inputSlot}>
          <MonthlyReportStats
            month={reportMonth.month}
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
          이번 달 <Text style={styles.highlight}>최대 몇 번</Text>까지{'\n'}
          마실 건가요?
        </>
      }
      subtitle='목표는 매달 새로 정할 수 있어요.'
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
