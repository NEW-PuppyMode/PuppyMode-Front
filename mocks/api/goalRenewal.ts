import type { MeResult } from '@/services/auth';
import type { GoalStatus, ReportResultDTO } from '@/services/reportData';
import type { GoalDTO, IPuppyInfo } from '@/types/models/puppy';
import { delay, http, HttpResponse } from 'msw';

/**
 * 목표 갱신 시나리오: 온보딩을 모두 마친 기존 사용자가 다음 달을 맞아
 * 이번 달 목표가 없는 상태.
 *
 * 켜는 법: .env에 EXPO_PUBLIC_MOCK_SCENARIO=goalRenewal (mocks/handlers.ts 참고)
 * 지난 달 리포트까지 보려면 goalRenewalAchieved / goalRenewalFailed
 *
 * 서버에 계정 상태를 만드는 게 아니라, 로그인한 계정의 응답을 앱 안에서 가로채
 * 이 상태인 것처럼 보이게 한다. 여기서 다루지 않는 요청은 진짜 서버로 간다.
 *
 * 응답은 앱의 실제 타입(MeResult, IPuppyInfo)으로 만든다. 서버 스펙이 바뀌어
 * 앱 타입을 고치면 여기서 컴파일 에러가 나서, 목이 조용히 낡아가는 걸 막는다.
 */

// 목표를 저장했는지. JS를 다시 불러오면(Metro에서 r) 처음 값으로 돌아간다.
let isGoalSet = false;

export const goalRenewalHandlers = [
  // 앱 진입: 검사·온보딩·튜토리얼을 모두 마친 사용자 → app/index.tsx가 홈으로 보낸다.
  http.get('*/auth/me', () => {
    const result: MeResult = {
      tutorialShown: true,
      onboardingCompleted: true,
      isPuppyTestCompleted: true,
      isOnboarded: true,
    };
    console.log('[MSW] /auth/me → 온보딩 완료 사용자');
    return HttpResponse.json({
      isSuccess: true,
      code: 'AUTH_ME200',
      message: '사용자 정보 조회 성공',
      result,
    });
  }),

  // 홈 데이터: 이름은 다 지었지만 이번 달 목표가 없음 → app/home.tsx가 /goal로 보낸다.
  // 목표를 저장한 뒤에는 isGoal이 true가 되어 홈에 머문다.
  http.get('*/main', async () => {
    await delay(300);
    const result: IPuppyInfo = {
      puppyLevel: 15,
      puppyLevelName: '눈송이 비숑',
      puppyLevelPercent: 40,
      puppyImageUrl: '',
      didRecordYesterday: false,
      didRecordToday: false,
      isPuppyName: true,
      isMyName: true,
      isGoal: isGoalSet,
      currentPuppyName: '멍뭉이',
      isOnboarded: true,
    };
    console.log('[MSW] /main → isGoal:', isGoalSet);
    return HttpResponse.json({
      isSuccess: true,
      code: '200',
      message: 'success',
      result,
    });
  }),

  // 목표 저장: 진짜 계정에 목표가 생기지 않도록 서버로 보내지 않는다.
  // 성공으로 응답하고 isGoal을 true로 바꿔서, 홈으로 돌아갔을 때 다시 튕기지 않는지 볼 수 있게 한다.
  http.post('*/goals', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as GoalDTO;
    isGoalSet = true;
    console.log(
      '[MSW] POST /goals → 목표',
      body.goal,
      '회 저장 (isNew:',
      body.isNew,
      ')',
    );
    return HttpResponse.json({
      isSuccess: true,
      code: 'GOAL200',
      message: 'success',
      result: { goal: body.goal },
    });
  }),
];

/**
 * 목표 갱신 화면 앞에 붙는 지난 달 리포트용 /report.
 * 지난 달 결과는 새 계정으로 재현이 어려워서 시나리오마다 goalStatus를 정해 준다.
 * - ACHIEVED: 15번 목표 중 10번 마심 → 리포트(달성) → 목표 설정
 * - FAILED: 15번 목표 중 16번 마심 → 리포트(실패) → 목표 설정
 * - NO_GOAL: 리포트 없이 목표 설정만
 *
 * 지난 달이 아닌 요청(캘린더 등)은 진짜 서버로 보낸다.
 */
const lastMonthReports: Record<
  GoalStatus,
  Pick<ReportResultDTO, 'goal' | 'drinkDays'>
> = {
  ACHIEVED: { goal: 15, drinkDays: 10 },
  FAILED: { goal: 15, drinkDays: 16 },
  NO_GOAL: { goal: 0, drinkDays: 0 },
  IN_PROGRESS: { goal: 15, drinkDays: 6 },
};

export const goalRenewalReportHandler = (goalStatus: GoalStatus) =>
  http.get('*/report', async ({ request }) => {
    const lastMonth = new Date();
    lastMonth.setDate(1);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const url = new URL(request.url);
    const isLastMonth =
      Number(url.searchParams.get('year')) === lastMonth.getFullYear() &&
      Number(url.searchParams.get('month')) === lastMonth.getMonth() + 1;
    if (!isLastMonth) return;

    await delay(300);
    const base = lastMonthReports[goalStatus];
    const result: ReportResultDTO = {
      ...base,
      drinkRecordCount: base.drinkDays,
      achievementRate: goalStatus === 'ACHIEVED' ? 100 : 0,
      scoldedCount: 0,
      goalStatus,
    };
    console.log('[MSW] /report 지난 달 →', goalStatus);
    return HttpResponse.json({
      isSuccess: true,
      code: 'COMMON200',
      message: '성공입니다.',
      result,
    });
  });
