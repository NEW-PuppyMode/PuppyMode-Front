import type { GoalStatus, ReportResultDTO } from '@/services/reportData';
import { delay, http, HttpResponse } from 'msw';

/**
 * 캘린더 상단 목표 달성 칩 시나리오: 월마다 /report의 goalStatus를 다르게 줘서
 * 네 가지 상태를 월만 바꿔 가며 확인한다. 지난 달 결과는 새 계정으로 재현이 어렵다.
 *
 * 켜는 법: .env에 EXPO_PUBLIC_MOCK_SCENARIO=calendarAchievement (mocks/handlers.ts 참고)
 * - 이번 달: IN_PROGRESS (목표 15번 · 달성 확률 28%)
 * - 지난 달: ACHIEVED (10/15번 마심)
 * - 두 달 전: FAILED (16/15번 마심)
 * - 세 달 전: NO_GOAL (칩 숨김)
 *
 * 월 선택 모달에서 위 달들을 고를 수 있게 /goals/months도 함께 가로챈다.
 * 나머지 요청은 진짜 서버로 간다.
 */

const toYearMonth = (offset: number) => {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const reports: Record<
  number,
  Pick<ReportResultDTO, 'goal' | 'drinkDays' | 'achievementRate' | 'goalStatus'>
> = {
  0: { goal: 15, drinkDays: 6, achievementRate: 28, goalStatus: 'IN_PROGRESS' },
  [-1]: {
    goal: 15,
    drinkDays: 10,
    achievementRate: 100,
    goalStatus: 'ACHIEVED',
  },
  [-2]: { goal: 15, drinkDays: 16, achievementRate: 0, goalStatus: 'FAILED' },
  [-3]: { goal: 0, drinkDays: 0, achievementRate: 0, goalStatus: 'NO_GOAL' },
};

export const calendarAchievementHandlers = [
  http.get('*/goals/months', async () => {
    await delay(300);
    const result = [-3, -2, -1, 0].map(toYearMonth);
    console.log('[MSW] /goals/months →', result);
    return HttpResponse.json({
      isSuccess: true,
      code: 'COMMON200',
      message: '성공입니다.',
      result,
    });
  }),

  http.get('*/report', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const yearMonth = `${url.searchParams.get('year')}-${String(url.searchParams.get('month')).padStart(2, '0')}`;
    const offset = [0, -1, -2, -3].find((o) => toYearMonth(o) === yearMonth);
    const base =
      offset === undefined
        ? {
            goal: 0,
            drinkDays: 0,
            achievementRate: 0,
            goalStatus: 'NO_GOAL' as GoalStatus,
          }
        : reports[offset];
    const result: ReportResultDTO = {
      ...base,
      drinkRecordCount: base.drinkDays,
      scoldedCount: 0,
    };
    console.log('[MSW] /report', yearMonth, '→', result.goalStatus);
    return HttpResponse.json({
      isSuccess: true,
      code: 'COMMON200',
      message: '성공입니다.',
      result,
    });
  }),
];
