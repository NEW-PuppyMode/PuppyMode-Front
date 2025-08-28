import { axiosInstance } from '.';

export type CalendarDayDTO = {
  date: string; // 'YYYY-MM-DD'
  isDrink: boolean;
};

type CalendarResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: CalendarDayDTO[];
};

export const CalendarApi = {
  lookupCalendar: async (year: number, month: number) => {
    const response = await axiosInstance.get<CalendarResponse>('/calendar', {
      params: {
        year: year,
        month: month,
      },
    });
    if (!response.data?.isSuccess) {
      throw new Error(response.data?.message || '캘린더 조회 실패');
    }
    return response.data.result; // ← result 배열 반환
  },
};
