import { PuppyDataAPI } from '@/services/puppyData';
import { useQuery } from '@tanstack/react-query';

export const PUPPY_QUERY_KEYS = {
  puppyInfo: ['puppyInfo'] as const,
};

export const usePuppyInfoQuery = () => {
  return useQuery({
    queryKey: PUPPY_QUERY_KEYS.puppyInfo,
    queryFn: async () => {
      const data = await PuppyDataAPI.fetchPuppyInfo();
      return data.result;
    },
    staleTime: 0,
    refetchOnMount: 'always',
  });
};
