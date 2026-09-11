// import { calendarHandlers } from './api/calendar';
// import { onboardHandlers } from './api/onboard';
import { goalRenewalHandlers } from './api/goalRenewal';
import { puppyHandlers } from './api/puppy';

/**
 * 특정 상황을 재현하는 목 묶음. .env의 EXPO_PUBLIC_MOCK_SCENARIO로 고른다.
 * 코드를 주석으로 켰다 껐다 하지 않게 env로 뺐다. 켠 채로 커밋할 일이 없고,
 * 다른 사람도 .env만 바꾸면 같은 상황을 볼 수 있다.
 *
 * - goalRenewal: 온보딩을 마친 사용자의 월간 목표 갱신 (mocks/api/goalRenewal.ts)
 */
const scenarios = {
  goalRenewal: goalRenewalHandlers,
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
