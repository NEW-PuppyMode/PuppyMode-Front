import type { MeResult } from '@/services/auth';
import type { GoalDTO, IPuppyInfo } from '@/types/models/puppy';
import { delay, http, HttpResponse } from 'msw';

/**
 * 최초 온보딩 시나리오: 강아지 유형 검사만 마치고 이름·목표를 아직 정하지 않은 사용자.
 * 강아지 이름 → 내 이름 → 목표 설정을 모두 거친 뒤 홈으로 간다.
 *
 * 켜는 법: .env에 EXPO_PUBLIC_MOCK_SCENARIO=onboarding (mocks/handlers.ts 참고)
 *
 * 이름·목표 저장은 진짜 서버로 보내지 않고 여기서 상태만 바꾼다. 실제 계정의 이름과
 * 목표는 바뀌지 않는다. JS를 다시 불러오면(Metro에서 r) 처음 상태로 돌아간다.
 * 튜토리얼은 본 것으로 두어 온보딩을 마치면 바로 홈으로 간다. (hooks/onboarding/useCompleteOnboarding.ts)
 */

let puppyName: string | null = null;
let myName: string | null = null;
let isGoalSet = false;

export const onboardingHandlers = [
  // 앱 진입: 검사는 마쳤고 온보딩은 안 함 → utils/authRoute.ts가 /onboarding으로 보낸다.
  http.get('*/auth/me', () => {
    const result: MeResult = {
      tutorialShown: true,
      onboardingCompleted: false,
      isPuppyTestCompleted: true,
      isOnboarded: true,
      userId: '12345',
    };
    console.log('[MSW] /auth/me → 온보딩 전 사용자');
    return HttpResponse.json({
      isSuccess: true,
      code: 'AUTH_ME200',
      message: '사용자 정보 조회 성공',
      result,
    });
  }),

  // 온보딩은 진입 시점의 이름·목표 여부로 보여줄 단계를 정한다. (app/onboarding)
  http.get('*/main', async () => {
    await delay(300);
    const result: IPuppyInfo = {
      puppyLevel: 1,
      puppyLevelName: '눈송이 비숑',
      puppyLevelPercent: 0,
      puppyImageUrl: '',
      didRecordYesterday: false,
      didRecordToday: false,
      isPuppyName: puppyName !== null,
      isMyName: myName !== null,
      isGoal: isGoalSet,
      currentPuppyName: puppyName ?? undefined,
      currentMyName: myName ?? undefined,
      isOnboarded: true,
    };
    console.log('[MSW] /main →', {
      isPuppyName: result.isPuppyName,
      isMyName: result.isMyName,
      isGoal: result.isGoal,
    });
    return HttpResponse.json({
      isSuccess: true,
      code: '200',
      message: 'success',
      result,
    });
  }),

  http.patch('*/puppy-name', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { puppyName: string };
    puppyName = body.puppyName;
    console.log('[MSW] PATCH /puppy-name →', puppyName);
    return HttpResponse.json({
      isSuccess: true,
      code: '200',
      message: 'success',
      result: {},
    });
  }),

  http.patch('*/user-name', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { myName: string };
    myName = body.myName;
    console.log('[MSW] PATCH /user-name →', myName);
    return HttpResponse.json({
      isSuccess: true,
      code: '200',
      message: 'success',
      result: {},
    });
  }),

  // 목표 저장 후에는 isGoal이 true가 되어, 홈으로 갔을 때 목표 갱신 화면으로 튕기지 않는다.
  http.post('*/goals', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as GoalDTO;
    isGoalSet = true;
    console.log('[MSW] POST /goals → 목표', body.goal, '회 저장');
    return HttpResponse.json({
      isSuccess: true,
      code: 'GOAL200',
      message: 'success',
      result: { goal: body.goal },
    });
  }),
];
