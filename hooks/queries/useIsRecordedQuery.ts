import { PuppyDataAPI } from '@/services/puppyData';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';

export const useIsRecordedQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.isRecorded,
    queryFn: async () => {
      const data = await PuppyDataAPI.fetchIsRecorded();
      return data.result ?? null;
    },
  });
};
