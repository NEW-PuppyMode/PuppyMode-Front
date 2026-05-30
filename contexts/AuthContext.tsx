import { loginAPI } from '@/services/auth';
import { deleteFcmToken } from '@/utils/fcm';
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
    }
  }, []);

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
