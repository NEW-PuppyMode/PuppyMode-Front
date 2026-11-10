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

export type PuppyProgress = {
  level: number;
  percent: number;
};

// POST /goals/reward 결과. 목표 실패·기록 20일 미만·목표 없음이면 rewarded가 false이고 goalReward는 null.
export type GoalRewardResultDTO =
  | {
      rewarded: true;
      goalReward: { before: PuppyProgress; after: PuppyProgress };
    }
  | { rewarded: false; goalReward: null };

type GoalRewardResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: GoalRewardResultDTO;
};

export const ReportApi = {
  // 그 달 목표 달성 보상(경험치)을 받는다. 여러 번 불러도 한 번만 지급된다.
  rewardGoal: async (year: number, month: number) => {
    const response = await axiosInstance.post<GoalRewardResponse>(
      '/goals/reward',
      null,
      { params: { year, month } },
    );
    if (!response.data?.isSuccess) {
      throw new Error(response.data?.message || '목표 보상 지급 실패');
    }
    return response.data.result;
  },

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
