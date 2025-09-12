import { axiosInstance } from '.';

export type ReportResultDTO = {
  goal: number;
  drinkRecordCount: number;
  drinkDays: number;
  achievementRate: number;
  scoldedCount: number;
};

type ReportResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ReportResultDTO;
};

export const ReportApi = {
  lookupReport: async () => {
    const response = await axiosInstance.get<ReportResponse>('/report');
    if (!response.data?.isSuccess) {
      throw new Error(response.data?.message || '리포트 조회 실패');
    }
    return response.data.result; // ← result 객체 반환
  },
};
