export const QUERY_KEYS = {
  puppyInfo: ['puppyInfo'] as const,
  isRecorded: ['isRecorded'] as const,
  recentGoal: ['recentGoal'] as const,
  goal30daysPassed: ['goal30daysPassed'] as const,
  calendar: (year: number, month: number) => ['calendar', year, month] as const,
  report: (year: number, month: number) => ['report', year, month] as const,
};
