import { KEYS } from '@/constants/storage';
import { PuppyDataAPI } from '@/services/puppyData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

import 'react-native-gesture-handler';
import 'react-native-reanimated';

type AuthState = 'checking' | 'authenticated' | 'unauthenticated';

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

        // 세션 검증
        // access token이 만료 시:
        // 401 -> interceptor -> reissue -> 원요청 재시도
        await PuppyDataAPI.fetchPuppyInfo();

        if (isMounted) {
          setAuthState('authenticated');
        }
      } catch (error) {
        await AsyncStorage.multiRemove([
          KEYS.ACCESS_TOKEN,
          KEYS.REFRESH_TOKEN,
          KEYS.PROVIDER,
        ]);

        if (isMounted) {
          setAuthState('unauthenticated');
        }
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

  return <Redirect href='/signin' />;
}
