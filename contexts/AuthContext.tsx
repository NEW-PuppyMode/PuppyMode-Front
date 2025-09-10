import { KakaoLoginResult, loginAPI } from '@/services/auth';
import { login as kakaoLoginSDK } from '@react-native-seoul/kakao-login';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type AuthContextValue = {
  isLoggedIn: boolean;
  userInfo: KakaoLoginResult['userInfo'] | null;
  login: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<KakaoLoginResult['userInfo'] | null>(
    null,
  );

  const login = useCallback(async () => {
    // 1. 카카오 SDK 로그인
    console.log('AuthContext.login 실행 직전');
    const { accessToken, refreshToken } = await kakaoLoginSDK();
    console.log('제발', accessToken, refreshToken);
    // 2. 백엔드 API 호출
    const result: KakaoLoginResult = await loginAPI.kakaoLogin(
      accessToken,
      refreshToken,
    );
    console.log('제발제발', result);
    // 3. 인증 상태 업데이트
    setUserInfo(result.userInfo);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    // 서버 로그아웃 요청(Optional)
    loginAPI.logout().catch(console.error);

    // 로컬 상태 초기화
    setUserInfo(null);
    setIsLoggedIn(false);
  }, []);

  const value = useMemo(
    () => ({ isLoggedIn, userInfo, login, logout }),
    [isLoggedIn, userInfo, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
