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
