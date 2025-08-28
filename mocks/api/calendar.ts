// src/mocks/api/calendar.ts
import { delay, http, HttpResponse } from 'msw';
import { API_BASE_URL } from '../setting';


function buildMonthMock(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const rows: Array<{ date: string; isDrink: boolean }> = [];

  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const ds = `${yyyy}-${mm}-${dd}`;
    const weekday = d.getDay();

    rows.push({ date: ds, isDrink: weekday === 0 || weekday === 6 });
  }

  return rows;
}

export const calendarHandlers = [
  http.get(`*/calendar`, async ({ request }) => {
    await delay(400);

    const url = new URL(request.url);
    const year = parseInt(url.searchParams.get('year') ?? '');
    const month = parseInt(url.searchParams.get('month') ?? '');

    // year, month가 없으면 현재 월 기준
    const now = new Date();
    const targetYear = isNaN(year) ? now.getFullYear() : year;
    const targetMonth = isNaN(month) ? now.getMonth() + 1 : month;

    const data = buildMonthMock(targetYear, targetMonth);

    console.log('[MSW] HIT /calendar(native)', { year, month });
    return HttpResponse.json({
      isSuccess: true,
      code: '200',
      message: '캘린더 조회 성공',
      result: data,
    });
  }),
];
