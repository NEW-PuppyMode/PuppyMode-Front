import { KEYS } from '@/constants/storage';
import { useMeQuery } from '@/hooks/queries/useMeQuery';
import { clearTokens, NoRefreshTokenError } from '@/services/index';
import { resolveNextRoute } from '@/utils/authRoute';
import { describeToken, logAuthEvent } from '@/utils/tokenDebug';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

import 'react-native-gesture-handler';
import 'react-native-reanimated';

export default function Index() {
  const [hasTokens, setHasTokens] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.multiGet([KEYS.ACCESS_TOKEN, KEYS.REFRESH_TOKEN]).then(
      ([[, access], [, refresh]]) => {
        logAuthEvent('bootstrap', {
          access: describeToken(access),
          refresh: describeToken(refresh),
        });
        setHasTokens(!!(access || refresh));
      },
    );
  }, []);

  const { data, isError, isPending, error } = useMeQuery(hasTokens === true);

  useEffect(() => {
    if (!isError || !error) return;
    const isNetworkError = axios.isAxiosError(error) && !error.response;
    const status = axios.isAxiosError(error)
      ? error.response?.status
      : undefined;

    // 인증이 거부된 경우(401/403)나 refresh token이 없는 경우만 토큰을 지운다.
    // 배포 중 일시적 5xx 등에서는 토큰을 남겨 다음 실행 때 복구되게 한다.
    const isAuthRejected =
      status === 401 || status === 403 || error instanceof NoRefreshTokenError;

    logAuthEvent('bootstrap:me-failed', {
      status,
      body: axios.isAxiosError(error) ? error.response?.data : String(error),
      isNetworkError,
      willClearTokens: isAuthRejected,
    });

    if (isAuthRejected) {
      void clearTokens('bootstrap-auth-rejected', { status });
    }
  }, [isError, error]);

  if (hasTokens === null || (hasTokens && isPending)) return null;

  if (isError || hasTokens === false) return <Redirect href='/signin' />;

  // enabled 상태에서 pending도 error도 아니면 data는 항상 있다.
  if (!data) return null;

  // 어디로 갈지는 resolveNextRoute 한 곳에서만 정한다. (utils/authRoute.ts)
  return <Redirect href={resolveNextRoute(data)} />;
}
