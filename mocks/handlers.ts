// import { calendarHandlers } from './api/calendar';
// import { onboardHandlers } from './api/onboard';
import { calendarAchievementHandlers } from './api/calendarAchievement';
import {
  calendarMonthsEmptyHandlers,
  calendarMonthsErrorHandlers,
  calendarMonthsHandlers,
} from './api/calendarMonths';
import {
  goalRenewalHandlers,
  goalRenewalReportHandler,
} from './api/goalRenewal';
import { puppyHandlers } from './api/puppy';

/**
 * 특정 상황을 재현하는 목 묶음. .env의 EXPO_PUBLIC_MOCK_SCENARIO로 고른다.
 * 코드를 주석으로 켰다 껐다 하지 않게 env로 뺐다. 켠 채로 커밋할 일이 없고,
 * 다른 사람도 .env만 바꾸면 같은 상황을 볼 수 있다.
 *
 * - goalRenewal: 온보딩을 마친 사용자의 월간 목표 갱신 (mocks/api/goalRenewal.ts)
 *   지난 달 목표가 없어서 리포트 없이 목표 설정만 나온다.
 * - goalRenewalAchieved / goalRenewalFailed: 위와 같고, 지난 달 목표를 달성/실패해서
 *   목표 설정 앞에 지난 달 리포트가 붙는다.
 * - calendarMonths / calendarMonthsEmpty / calendarMonthsError:
 *   캘린더 월 선택 모달의 월·연도 비활성화 (mocks/api/calendarMonths.ts)
 * - calendarAchievement: 캘린더 상단 목표 달성 칩의 월별 상태 (mocks/api/calendarAchievement.ts)
 */
const scenarios = {
  goalRenewal: [...goalRenewalHandlers, goalRenewalReportHandler('NO_GOAL')],
  goalRenewalAchieved: [
    ...goalRenewalHandlers,
    goalRenewalReportHandler('ACHIEVED'),
  ],
  goalRenewalFailed: [
    ...goalRenewalHandlers,
    goalRenewalReportHandler('FAILED'),
  ],
  calendarMonths: calendarMonthsHandlers,
  calendarMonthsEmpty: calendarMonthsEmptyHandlers,
  calendarMonthsError: calendarMonthsErrorHandlers,
  calendarAchievement: calendarAchievementHandlers,
};

const scenario = process.env.EXPO_PUBLIC_MOCK_SCENARIO as
  | keyof typeof scenarios
  | undefined;

// 같은 요청을 여러 핸들러가 다루면 앞에 있는 것이 이긴다.
// 시나리오를 앞에 둬야 puppyHandlers의 /main보다 먼저 쓰인다.
export const handlers = [
  ...(scenario ? (scenarios[scenario] ?? []) : []),
  ...puppyHandlers,
];
