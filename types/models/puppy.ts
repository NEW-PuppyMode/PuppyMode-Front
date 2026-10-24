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

export interface RecentGoal {
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
