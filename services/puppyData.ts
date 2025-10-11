import {
  DrinkHistoryDTO,
  GoalDTO,
  IAdvice,
  IPuppyInfo,
  IsRecorded,
  RecentGoal,
} from '@/types/models/puppy';
import { axiosInstance } from '.';

export const PuppyDataAPI = {
  renamePuppy: async (
    puppyName: string,
  ): Promise<ApiResponse<{ puppyName: string }>> => {
    const response = await axiosInstance.post('/puppy-name', {
      puppyName: puppyName,
    });
    return response.data;
  },

  renameUser: async (
    userName: string,
  ): Promise<ApiResponse<{ myName: string }>> => {
    const response = await axiosInstance.post('/my-name', {
      myName: userName,
    });
    return response.data;
  },

  advicePuppy: async (): Promise<ApiResponse<IAdvice>> => {
    const response = await axiosInstance.get('/advice');
    return response.data;
  },

  fetchPuppyInfo: async (): Promise<ApiResponse<IPuppyInfo>> => {
    const response = await axiosInstance.get('/main');
    return response.data;
  },

  fetchIsRecorded: async (): Promise<ApiResponse<IsRecorded>> => {
    const response = await axiosInstance.get('/drink-history/status');
    return response.data;
  },

  fetchRecentGoal: async (): Promise<ApiResponse<RecentGoal>> => {
    const response = await axiosInstance.get('/goals');
    return response.data;
  },

  fetchGoal30daysPassed: async (): Promise<ApiResponse<boolean>> => {
    const response = await axiosInstance.get('/goals/check-30days');
    return response.data;
  },

  createDrinkHistory: async (
    drinkHistory: DrinkHistoryDTO,
  ): Promise<ApiResponse<DrinkHistoryDTO>> => {
    const response = await axiosInstance.post('/drink-history', {
      drinkHistory,
    });
    return response.data;
  },

  createGoal: async (goal: GoalDTO): Promise<ApiResponse<{ goal: number }>> => {
    const response = await axiosInstance.post('/goals', goal);
    return response.data;
  },
};
