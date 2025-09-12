import { KEYS } from '@/constants/storage';
import { KakaoLoginResult, loginAPI } from '@/services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as kakaoLoginSDK } from '@react-native-seoul/kakao-login';
import { useCallback, useState } from 'react';

export interface UseLoginReturn {
  isLoading: boolean;
  error: string | null;
  userInfo: KakaoLoginResult['userInfo'] | null;
  loginWithKakao: () => Promise<void>;
}

export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<KakaoLoginResult['userInfo'] | null>(
    null,
  );

  const loginWithKakao = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { accessToken, refreshToken } = await kakaoLoginSDK();

      const result: KakaoLoginResult = await loginAPI.kakaoLogin(
        accessToken,
        refreshToken,
      );

      await AsyncStorage.setItem(KEYS.ACCESS_TOKEN, result.accessToken);

      setUserInfo(result.userInfo);
    } catch (err: any) {
      console.error('로그인 에러:', err);
      setError(err.message ?? '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    userInfo,
    loginWithKakao,
  };
};
