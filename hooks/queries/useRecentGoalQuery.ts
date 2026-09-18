import { PuppyDataAPI } from '@/services/puppyData';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';

// enabled는 로그인 전에 호출되지 않도록 막는 용도다. 기본값이 true라 기존 호출부는
// 그대로 동작한다.
export const useRecentGoalQuery = (enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.recentGoal,
    queryFn: async () => {
      const data = await PuppyDataAPI.fetchRecentGoal();
      return data.result ?? null;
    },
    enabled,
  });
};
