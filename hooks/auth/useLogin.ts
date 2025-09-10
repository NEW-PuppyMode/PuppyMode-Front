import { KakaoLoginResult, loginAPI } from '@/services/auth';
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
    console.error('여긴가 ? 1?');
    try {
      // 1. 카카오 SDK 로그인
      console.error('여긴가 ? 2?');
      const { accessToken, refreshToken } = await kakaoLoginSDK();

      // 2. 백엔드 API 호출
      console.error('여긴가 ? 3?');
      const result: KakaoLoginResult = await loginAPI.kakaoLogin(
        accessToken,
        refreshToken,
      );

      // 3. 사용자 정보 저장
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
