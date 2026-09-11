import { delay, http, HttpResponse } from 'msw';

/**
 * 캘린더 월 선택 모달 시나리오: 목표를 설정한 월 목록(/goals/months)만 바꿔서
 * 월·연도 비활성화를 확인한다. 새 계정은 이번 달 하나뿐이라 서버로는 재현이 어렵다.
 *
 * 켜는 법: .env에 EXPO_PUBLIC_MOCK_SCENARIO=calendarMonths (mocks/handlers.ts 참고)
 * - calendarMonths: 여러 해에 걸쳐 중간중간 빈 달이 있는 목록
 * - calendarMonthsEmpty: 목표 이력이 없음 → 모든 월·연도 화살표가 막힌다
 * - calendarMonthsError: 조회 실패 → 제한 없이 모든 월이 열린다
 *
 * /goals/months만 가로채고 나머지 요청은 진짜 서버로 간다.
 */

const goalMonths = [
  '2025-11',
  '2025-12',
  '2026-02',
  '2026-03',
  '2026-05',
  '2026-09',
];

const respondWith = (result: string[]) =>
  http.get('*/goals/months', async () => {
    await delay(300);
    console.log('[MSW] /goals/months →', result);
    return HttpResponse.json({
      isSuccess: true,
      code: 'COMMON200',
      message: '성공입니다.',
      result,
    });
  });

export const calendarMonthsHandlers = [respondWith(goalMonths)];

export const calendarMonthsEmptyHandlers = [respondWith([])];

export const calendarMonthsErrorHandlers = [
  http.get('*/goals/months', async () => {
    await delay(300);
    console.log('[MSW] /goals/months → 500');
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
