import { axiosInstance } from '.';

// 그 달의 목표 진행 상태. 이번 달은 IN_PROGRESS, 지난 달은 ACHIEVED/FAILED로 끝난다.
export type GoalStatus = 'IN_PROGRESS' | 'ACHIEVED' | 'FAILED' | 'NO_GOAL';

export type ReportResultDTO = {
  goal: number;
  drinkRecordCount: number;
  drinkDays: number;
  // 지금까지의 달성률이 아니라, 기록과 남은 날짜로 계산한 목표 달성 예측 확률(0~100)
  achievementRate: number;
  scoldedCount: number;
  goalStatus: GoalStatus;
};

type ReportResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ReportResultDTO;
};

export const ReportApi = {
  lookupReport: async (year: number, month: number) => {
    const response = await axiosInstance.get<ReportResponse>('/report', {
      params: { year, month }, // ✅ 쿼리 파라미터 추가
    });
    if (!response.data?.isSuccess) {
      throw new Error(response.data?.message || '리포트 조회 실패');
    }
    return response.data.result; // ← result 객체 반환
  },
};
