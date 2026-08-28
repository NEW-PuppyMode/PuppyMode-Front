import { KEYS } from '@/constants/storage';
import { useMeQuery } from '@/hooks/queries/useMeQuery';
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

    // 응답을 동반한 모든 에러(500/502/403 등)가 여기서 토큰을 지운다.
    // 배포 중 일시적 5xx가 영구 로그아웃으로 이어지는지 관측하기 위한 로그.
    logAuthEvent('bootstrap:me-failed', {
      status: axios.isAxiosError(error) ? error.response?.status : undefined,
      body: axios.isAxiosError(error) ? error.response?.data : String(error),
      isNetworkError,
      willClearTokens: !isNetworkError,
    });

    if (!isNetworkError) {
      AsyncStorage.multiRemove([
        KEYS.ACCESS_TOKEN,
        KEYS.REFRESH_TOKEN,
        KEYS.PROVIDER,
      ]);
    }
  }, [isError, error]);

  if (hasTokens === null || (hasTokens && isPending)) return null;

  if (isError || hasTokens === false) return <Redirect href='/signin' />;

  if (data?.isOnboarded) return <Redirect href='/home' />;
  return <Redirect href='/test/start' />;
}
