import { versionAPI } from '@/services/version';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';

export const useVersionCheckQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.versionCheck,
    queryFn: versionAPI.check,
    retry: false,
    staleTime: Infinity,
  });
};
