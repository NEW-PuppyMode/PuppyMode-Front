import { KEYS } from '@/constants/storage';
import { loginAPI } from '@/services/auth';
import { reissueAccessToken } from '@/services/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

import 'react-native-gesture-handler';
import 'react-native-reanimated';

type AuthState = 'checking' | 'authenticated' | 'onboarding' | 'unauthenticated';

function toAuthResult(isOnboarded: boolean): 'authenticated' | 'onboarding' {
  return isOnboarded ? 'authenticated' : 'onboarding';
}

async function resolveAuthState(): Promise<'authenticated' | 'onboarding'> {
  try {
    const meData = await loginAPI.me();

    if (meData.isSuccess) {
      return toAuthResult(meData.result.isOnboarded);
    }

    // HTTP 200이지만 isSuccess: false → 수동 재발급 후 재시도
    await reissueAccessToken();
    const meAfterReissue = await loginAPI.me();

    if (!meAfterReissue.isSuccess) {
      throw new Error('재발급 후에도 인증 실패');
    }

    return toAuthResult(meAfterReissue.result.isOnboarded);
  } catch (error) {
    // HTTP 401 → 토큰 만료 → 재발급 후 재시도
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      await reissueAccessToken();
      const meAfterReissue = await loginAPI.me();

      if (!meAfterReissue.isSuccess) {
        throw new Error('재발급 후에도 인증 실패');
      }

      return toAuthResult(meAfterReissue.result.isOnboarded);
    }

    throw error;
  }
}

export default function Index() {
  const [authState, setAuthState] = useState<AuthState>('checking');

  useEffect(() => {
    let isMounted = true;

    async function bootstrapAuth() {
      try {
        const [accessToken, refreshToken] = await Promise.all([
          AsyncStorage.getItem(KEYS.ACCESS_TOKEN),
          AsyncStorage.getItem(KEYS.REFRESH_TOKEN),
        ]);

        // access, refresh 둘 다 없으면 바로 로그인
        if (!accessToken && !refreshToken) {
          if (isMounted) setAuthState('unauthenticated');
          return;
        }

        // /auth/me로 토큰 유효성 확인 + 온보딩 여부 판단
        // HTTP 401 → 재발급 후 재시도, isSuccess: false → 수동 재발급
        const state = await resolveAuthState();

        if (isMounted) setAuthState(state);
      } catch {
        await AsyncStorage.multiRemove([
          KEYS.ACCESS_TOKEN,
          KEYS.REFRESH_TOKEN,
          KEYS.PROVIDER,
        ]);
        if (isMounted) setAuthState('unauthenticated');
      }
    }

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (authState === 'checking') {
    return null; // 추후에 여기 로딩 화면 넣기
  }

  if (authState === 'authenticated') {
    return <Redirect href='/home' />;
  }

  if (authState === 'onboarding') {
    return <Redirect href='/test/start' />;
  }

  return <Redirect href='/signin' />;
}