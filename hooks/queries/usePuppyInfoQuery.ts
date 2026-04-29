import { PuppyDataAPI } from '@/services/puppyData';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';

export const PUPPY_QUERY_KEYS = {
  puppyInfo: QUERY_KEYS.puppyInfo,
};

export const usePuppyInfoQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.puppyInfo,
    queryFn: async () => {
      const data = await PuppyDataAPI.fetchPuppyInfo();
      return data.result;
    },
    staleTime: 1000 * 60 * 5,
  });
};
