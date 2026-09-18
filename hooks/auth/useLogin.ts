import { useEnableNotifications } from '@/hooks/notifications/useEnableNotifications';
import { KEYS } from '@/constants/storage';
import { KakaoLoginResult, loginAPI } from '@/services/auth';
import { logEvent } from '@/utils/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginWithKakaoAccount } from '@react-native-seoul/kakao-login';
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
  const { requestAndEnable } = useEnableNotifications();

  const loginWithKakao = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const sdkResult = await loginWithKakaoAccount();

      const { accessToken, refreshToken } = sdkResult;

      const result: KakaoLoginResult = await loginAPI.kakaoLogin(
        accessToken,
        refreshToken,
      );

      await AsyncStorage.setItem(KEYS.ACCESS_TOKEN, result.accessToken);

      // 자동 로그인은 이 훅을 타지 않으므로, 여기 도달했다면 사용자가 직접 로그인한 것이다.
      logEvent('login_completed', {
        provider: 'kakao',
        is_new_user: Boolean(result.userInfo?.isNewUser),
      });

      requestAndEnable();

      setUserInfo(result.userInfo);
    } catch (err: any) {
      console.error('[KAKAO] 로그인 에러:', err);
      setError(err.message ?? '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [requestAndEnable]);

  return {
    isLoading,
    error,
    userInfo,
    loginWithKakao,
  };
};
