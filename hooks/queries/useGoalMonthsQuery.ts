import { PuppyDataAPI } from '@/services/puppyData';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';

export const useGoalMonthsQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.goalMonths,
    queryFn: async () => {
      const data = await PuppyDataAPI.fetchGoalMonths();
      return data.result ?? [];
    },
  });
};
