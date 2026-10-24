import { PrimaryButton } from '@/components/common/buttons/PrimaryButton';
import { MonthlyReportStats } from '@/components/page/goal/MonthlyReportStats';
import { YesterdayDrinkChoice } from '@/components/page/goal/YesterdayDrinkChoice';
import { GoalCounter } from '@/components/page/onboarding/GoalCounter';
import { OnboardingLayout } from '@/components/page/onboarding/OnboardingLayout';
import { useCreateDrinkHistoryMutation } from '@/hooks/mutations/useCreateDrinkHistoryMutation';
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

type ReportMonth = { year: number; month: number };

const getLastDay = ({ year, month }: ReportMonth) =>
  new Date(year, month, 0).getDate();

// 리포트 기준 달의 마지막 날이 어제인지. 홈에서는 어제까지만 기록할 수 있어서,
// 이 날을 비워 둔 채 리포트를 받으면 오늘이 지나 기록할 길이 없다. 또 리포트를 본
// 뒤에 홈에서 어제를 기록하면 이미 본 달성/실패가 뒤집힐 수 있다. 그래서 리포트
// 앞에서 먼저 기록받는다. 8월 목표 후 10월에 들어온 경우처럼 마지막 날이 어제가
// 아니면 해당하지 않는다.
const isLastDayYesterday = (reportMonth: ReportMonth) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    yesterday.getFullYear() === reportMonth.year &&
    yesterday.getMonth() + 1 === reportMonth.month &&
    yesterday.getDate() === getLastDay(reportMonth)
  );
};

const isFinishedReport = (
  report: ReportResultDTO | undefined,
): report is ReportResultDTO & { goalStatus: 'ACHIEVED' | 'FAILED' } =>
  report?.goalStatus === 'ACHIEVED' || report?.goalStatus === 'FAILED';

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
 * 목표 설정만 나온다. 그 달 마지막 날이 어제인데 기록이 없으면 리포트 앞에 어제 기록
 * 스텝을 넣는다. (isLastDayYesterday)
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

  const reportStatus =
    reportMonth && report && isFinishedReport(report)
      ? report.goalStatus
      : null;

  // 어제 기록 스텝을 넣을지도 진입 시점에 한 번만 정한다. 기록하면 /main의
  // didRecordYesterday가 true로 바뀌므로, 그때마다 다시 따지면 스텝이 사라진다.
  // 리포트 스텝이 없으면 기록할 이유도 없으니 넣지 않는다. undefined는 아직 정하지 않았다는 뜻이다.
  const [hasRecordStep, setHasRecordStep] = useState<boolean | undefined>(
    undefined,
  );
  const isEntryDataReady =
    reportMonth !== undefined &&
    !(reportMonth && isReportPending) &&
    !isPuppyInfoPending;
  useEffect(() => {
    if (hasRecordStep !== undefined || !isEntryDataReady) return;
    setHasRecordStep(
      !!reportMonth &&
        isFinishedReport(report) &&
        isLastDayYesterday(reportMonth) &&
        puppyInfo?.didRecordYesterday === false,
    );
  }, [hasRecordStep, isEntryDataReady, reportMonth, report, puppyInfo]);

  const createDrinkHistoryMutation = useCreateDrinkHistoryMutation();
  const [yesterdayDrink, setYesterdayDrink] = useState<boolean | null>(null);
  const [isRecordSaving, setIsRecordSaving] = useState(false);
  const [isRecordDone, setIsRecordDone] = useState(false);
  const [isReportDone, setIsReportDone] = useState(false);

  const currentStep =
    hasRecordStep && !isRecordDone
      ? 'record'
      : reportStatus && !isReportDone
        ? 'report'
        : 'goal';

  // 리포트 스텝이 처음 보일 때 한 번만 남긴다. goal_setup_completed(renewal)와
  // 이어 보면 리포트를 본 뒤 목표 설정까지 간 비율을 달성/실패별로 볼 수 있다.
  // 어제 기록 스텝이 앞에 있으면 기록으로 바뀐 결과를 남기도록 리포트가 실제로 보일 때 남긴다.
  const hasLoggedReportRef = useRef(false);
  useEffect(() => {
    if (hasRecordStep === undefined || currentStep !== 'report') return;
    if (!reportStatus || hasLoggedReportRef.current) return;
    hasLoggedReportRef.current = true;
    logEvent('monthly_report_viewed', { goal_status: reportStatus });
  }, [hasRecordStep, currentStep, reportStatus]);

  const handleRecordSubmit = async () => {
    if (yesterdayDrink === null || !reportMonth) return;
    setIsRecordSaving(true);
    try {
      // 누른 시각의 어제가 아니라 기준 달의 마지막 날로 기록한다. 화면을 띄워 둔 채
      // 자정을 넘기면 어제가 다음 달 1일로 바뀌기 때문이다.
      const month = String(reportMonth.month).padStart(2, '0');
      const day = String(getLastDay(reportMonth)).padStart(2, '0');
      await createDrinkHistoryMutation.mutateAsync({
        drinkDate: `${reportMonth.year}-${month}-${day}`,
        isDrink: yesterdayDrink,
        source: 'monthly_report',
        recordDay: 'yesterday',
      });

      // 기록으로 달성/실패가 바뀔 수 있으니 리포트를 다시 받은 뒤 넘어간다.
      // 뮤테이션이 이미 리포트 재요청을 시작했으므로 새로 보내지 않고 그 요청을 기다린다.
      await queryClient.refetchQueries(
        { queryKey: QUERY_KEYS.report(reportMonth.year, reportMonth.month) },
        { cancelRefetch: false },
      );

      setIsRecordDone(true);
    } catch (error) {
      console.log('어제 음주 기록 실패:', error);
      Alert.alert('잠시 후 다시 시도해주세요', '기록 저장에 실패했어요.');
    } finally {
      setIsRecordSaving(false);
    }
  };

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
  // 어제 기록 스텝 여부(hasRecordStep)는 이 데이터가 모두 온 뒤에 정해지므로 그것만 보면 된다.
  if (hasRecordStep === undefined) {
    return (
      <ImageBackground
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        source={require('@/assets/images/home_background.png')}
        style={styles.background}
        resizeMode='cover'
      />
    );
  }

  // 기록으로 달성/실패가 바뀌어도 리포트 스텝은 그대로 있으므로 진행 점 개수는 바뀌지 않는다.
  const totalSteps = (hasRecordStep ? 1 : 0) + (reportStatus ? 1 : 0) + 1;
  const breed = puppyInfo?.puppyLevelName ?? '';
  const level = puppyInfo?.puppyLevel ?? 1;

  if (currentStep === 'record' && reportMonth) {
    const lastDay = getLastDay(reportMonth);
    return (
      <OnboardingLayout
        step={1}
        totalSteps={totalSteps}
        breed={breed}
        level={level}
        title={
          <>
            {reportMonth.month}월의 마지막 날,{'\n'}
            <Text style={styles.highlight}>어제 술 마셨어요?</Text>
          </>
        }
        subtitle={`오늘이 지나면 ${reportMonth.month}월 ${lastDay}일은 기록할 수 없어요.`}
        bubbleText={`${reportMonth.month}월 마지막 날은 어땠어?\n알려주면 리포트 완성해줄게!`}
      >
        <YesterdayDrinkChoice
          value={yesterdayDrink}
          onChange={setYesterdayDrink}
          breed={breed}
          disabled={isRecordSaving}
        />
        <PrimaryButton
          title='다음으로'
          onPress={handleRecordSubmit}
          disabled={yesterdayDrink === null || isRecordSaving}
        />
      </OnboardingLayout>
    );
  }

  if (currentStep === 'report' && reportMonth && report && reportStatus) {
    return (
      <OnboardingLayout
        step={hasRecordStep ? 2 : 1}
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
