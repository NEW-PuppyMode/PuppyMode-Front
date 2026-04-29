import { PuppyDataAPI } from '@/services/puppyData';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';

export const useGoal30daysPassedQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.goal30daysPassed,
    queryFn: async () => {
      const data = await PuppyDataAPI.fetchGoal30daysPassed();
      return data.result ?? null;
    },
  });
};
