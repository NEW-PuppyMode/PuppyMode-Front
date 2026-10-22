import { KEYS } from '@/constants/storage';
import { useMeQuery } from '@/hooks/queries/useMeQuery';
import { clearTokens, NoRefreshTokenError } from '@/services/index';
import { setAnalyticsUserId } from '@/utils/analytics';
import { resolveNextRoute } from '@/utils/authRoute';
import {
  describeToken,
  logAuthEvent,
  reportError,
  setCrashlyticsUser,
} from '@/utils/tokenDebug';
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
        // 업데이트 전부터 로그인돼 있던 사용자도 userId가 잡히도록 시작 시에도 등록
        setCrashlyticsUser(access);
        setHasTokens(!!(access || refresh));
      },
    );
  }, []);

  const { data, isError, isPending, error } = useMeQuery(hasTokens === true);

  // 서버 배포가 늦어 userId가 빠진 응답이면 기기 단위 집계를 그대로 둔다.
  const userId = data?.userId;
  useEffect(() => {
    if (userId) setAnalyticsUserId(userId);
  }, [userId]);

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
    } else {
      // 토큰은 남지만 사용자는 로그인 화면으로 가므로 "로그인이 풀렸다"로 보이는 경우다.
      // 토큰을 지우는 경우는 clearTokens가 이미 올리므로 여기서만 올린다.
      reportError(error, 'bootstrap', {
        network_error: isNetworkError ? '1' : '0',
      });
    }
  }, [isError, error]);

  if (hasTokens === null || (hasTokens && isPending)) return null;

  if (isError || hasTokens === false) return <Redirect href='/signin' />;

  // enabled 상태에서 pending도 error도 아니면 data는 항상 있다.
  if (!data) return null;

  // 어디로 갈지는 resolveNextRoute 한 곳에서만 정한다. (utils/authRoute.ts)
  return <Redirect href={resolveNextRoute(data)} />;
}
