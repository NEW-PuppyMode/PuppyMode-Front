// src/mocks/api/calendar.ts
import { delay, http, HttpResponse } from 'msw';

const calendarMockData = [
  { date: '2025-08-01', isDrink: true },
  { date: '2025-08-02', isDrink: false },
  { date: '2025-08-03', isDrink: true },
  { date: '2025-08-04', isDrink: true },
  { date: '2025-08-05', isDrink: true },
  // ... 원하는 만큼 넣기
];

export const calendarHandlers = [
  http.get('*/calendar', async ({ request }) => {
    await delay(400);

    const url = new URL(request.url);
    const year = parseInt(url.searchParams.get('year') ?? '');
    const month = parseInt(url.searchParams.get('month') ?? '');

    console.log('[MSW] HIT /calendar(native)', { year, month });

    // 👉 하드코딩된 mock 데이터 반환
    return HttpResponse.json({
      isSuccess: true,
      code: '200',
      message: '캘린더 조회 성공',
      result: calendarMockData,
    });
  }),
];
