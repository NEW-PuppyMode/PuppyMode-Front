import { PuppyDataAPI } from '@/services/puppyData';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';

export const useRecentGoalQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.recentGoal,
    queryFn: async () => {
      const data = await PuppyDataAPI.fetchRecentGoal();
      return data.result ?? null;
    },
  });
};
