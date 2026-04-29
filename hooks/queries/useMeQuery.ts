import { loginAPI } from '@/services/auth';
import { reissueAccessToken } from '@/services/index';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { QUERY_KEYS } from './queryKeys';

async function fetchAuthState() {
  try {
    const meData = await loginAPI.me();
    if (meData.isSuccess) return meData.result;

    await reissueAccessToken();
    const meAfterReissue = await loginAPI.me();
    if (!meAfterReissue.isSuccess) throw new Error('재발급 후에도 인증 실패');
    return meAfterReissue.result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      await reissueAccessToken();
      const meAfterReissue = await loginAPI.me();
      if (!meAfterReissue.isSuccess) throw new Error('재발급 후에도 인증 실패');
      return meAfterReissue.result;
    }
    throw error;
  }
}

export const useMeQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: QUERY_KEYS.me,
    queryFn: fetchAuthState,
    enabled,
    retry: false,
    staleTime: Infinity,
  });
};
