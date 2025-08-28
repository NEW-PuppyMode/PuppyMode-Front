// hooks/useCalendarData.mock.ts
import { useState } from 'react';

type Row = { date: string; isDrink: boolean };

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// 월별 더미 데이터를 만들어주는 헬퍼
function buildMonthMock(y: number, m: number): Row[] {
  const daysInMonth = new Date(y, m, 0).getDate(); // m: 1~12
  const rows: Row[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    // 규칙 예시:
    // 1) 주말(토:6, 일:0)은 isDrink=true
    // 2) 평일은 3의 배수 날만 isDrink=false
    const weekday = new Date(ds).getDay();
    if (weekday === 0 || weekday === 6) {
      rows.push({ date: ds, isDrink: true }); // 주말 = 주황 점
    } else if (d % 3 === 0) {
      rows.push({ date: ds, isDrink: false }); // 평일 일부 = 초록 점
    }
    // 그 외 날짜는 응답에 포함하지 않아 회색으로 남게 됨
  }

  return rows;
}

export function useCalendarData() {
  const [isLoading, setIsLoading] = useState(false);

  const lookupCalendar = async (y: number, m: number): Promise<Row[]> => {
    setIsLoading(true);
    await delay(350); // 네트워크 지연 흉내
    const mock = buildMonthMock(y, m);
    setIsLoading(false);
    return mock;
  };

  return { lookupCalendar, isLoading };
}
