import { delay, http, HttpResponse } from 'msw';

/**
 * 홈 에러 화면 시나리오: 홈 데이터(/main) 조회 실패 → 에러 화면 → 다시 시도로 복구.
 *
 * 켜는 법: .env에 EXPO_PUBLIC_MOCK_SCENARIO=homeError (mocks/handlers.ts 참고)
 *
 * 처음 두 번(첫 요청 + React Query 자동 재시도 1회)만 500을 돌려줘 에러 화면을 띄우고,
 * 그 뒤 요청은 puppyHandlers의 /main으로 넘겨 "다시 시도"가 성공하는 것까지 확인한다.
 * 앱을 다시 실행하면 횟수가 초기화된다.
 */

const FAIL_COUNT = 2;
let requestCount = 0;

export const homeErrorHandlers = [
  http.get('*/main', async () => {
    requestCount += 1;
    if (requestCount > FAIL_COUNT) {
      console.log('[MSW] /main → 다음 핸들러로 통과');
      return;
    }

    await delay(300);
    console.log(`[MSW] /main → 500 (${requestCount}/${FAIL_COUNT})`);
    return HttpResponse.json(
      {
        isSuccess: false,
        code: 'COMMON500',
        message: '서버 에러, 관리자에게 문의 바랍니다.',
        result: null,
      },
      { status: 500 },
    );
  }),
];
