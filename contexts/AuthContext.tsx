import { loginAPI } from '@/services/auth';
import { deleteFcmToken } from '@/utils/fcm';
import { useQueryClient } from '@tanstack/react-query';
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
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const queryClient = useQueryClient();

  const logout = useCallback(async () => {
    await deleteFcmToken();
    try {
      await loginAPI.logout();
    } catch (e: any) {
      if (e?.response?.status !== 401) {
        console.error('서버 로그아웃 실패:', e);
      }
    } finally {
      setIsLoggedIn(false);
      // 이전 계정의 데이터(음주 기록 여부, 캘린더 등)가 남지 않도록 캐시를 모두 비운다
      queryClient.clear();
    }
  }, [queryClient]);

  const value = useMemo(
    () => ({ isLoggedIn, logout }),
    [isLoggedIn, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
