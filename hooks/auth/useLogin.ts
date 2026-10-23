import { KEYS } from '@/constants/storage';
import { useEnableNotifications } from '@/hooks/notifications/useEnableNotifications';
import { KakaoLoginResult, loginAPI } from '@/services/auth';
import { logEvent } from '@/utils/analytics';
import { reportError } from '@/utils/tokenDebug';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginWithKakaoAccount } from '@react-native-seoul/kakao-login';
import { useCallback, useState } from 'react';

export interface UseLoginReturn {
  isLoading: boolean;
  error: string | null;
  userInfo: KakaoLoginResult['userInfo'] | null;
  loginWithKakao: () => Promise<void>;
}

/**
 * 카카오 SDK는 취소를 포함한 모든 실패를 같은 코드("RNKakaoLogins")로 내보내므로
 * 메시지로만 취소를 구분할 수 있다. 사용자가 창을 닫은 건 에러로 올리지 않는다.
 *
 * - Android: "user cancelled."
 * - iOS: 래퍼가 localizedDescription만 넘겨 "...(KakaoSDKCommon.SdkError error 0.)"로 온다.
 *   error 0(ClientFailed)에는 취소 외에 앱 키 미설정 같은 클라이언트 오류도 섞여 있지만,
 *   이들은 설정 문제라 개발 중에 드러나므로 취소로 함께 취급한다.
 */
function isKakaoCancel(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return /cancel|SdkError error 0\b/i.test(message);
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
    // 카카오 SDK 단계와 우리 서버 단계 중 어디서 실패했는지 구분하기 위함
    let stage = 'kakao-sdk';
    try {
      const sdkResult = await loginWithKakaoAccount();
      stage = 'server';

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
      // 사용자가 창을 닫은 건 실패가 아니므로 알럿도 리포트도 남기지 않는다
      if (stage === 'kakao-sdk' && isKakaoCancel(err)) {
        console.log('[KAKAO] 로그인 취소:', err?.message);
        return;
      }

      console.error('[KAKAO] 로그인 에러:', err);
      reportError(err, 'login:kakao', { stage });
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
