export interface IPuppyInfo {
  puppyLevel: number;
  puppyLevelName: string;
  puppyLevelPercent: number;
  puppyImageUrl: string;
  didRecordYesterday: boolean;
  didRecordToday: boolean;
  isPuppyName: boolean;
  isMyName: boolean;
  isGoal: boolean;
  currentPuppyName?: string;
  currentMyName?: string;
  isOnboarded: boolean;
}

export interface IsRecorded {
  yesterdayRecorded: boolean;
  todayRecorded: boolean;
}

// GET /goals 응답.
export interface RecentGoal {
  // 현재 달의 목표 횟수로 추정(정확한 내용은 확인 필요). 지난 달(리포트 기준 달) 목표가 아니다. 신규 회원은 null.
  // 지난 달 목표 횟수가 필요하면 /report?year&month의 goal을 쓴다. (app/goal)
  monthlyGoalCount: number;
  monthlyActualCount: number;
  isGoalExceeded: boolean;
  goalSetAt: string;
  // 가장 최근에 목표를 설정한 연도·월. 목표를 세운 적 없는 신규 사용자는 null
  latestGoalYear: number | null;
  latestGoalMonth: number | null;
}

export interface IAdvice {
  advice: string;
}

export interface DrinkHistoryDTO {
  drinkDate: string;
  isDrink: boolean;
}

export interface GoalDTO {
  isNew: boolean;
  goal: number;
}
