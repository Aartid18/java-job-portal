import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi } from '../lib/authApi';
import { getErrorMessage } from '../lib/api';
import { tokenStorage } from '../lib/tokenStorage';
import type { AuthResponse, User } from '../types/auth';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setSessionFromAuth: (data: AuthResponse, rememberMe: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => tokenStorage.getUser());
  const [loading, setLoading] = useState(true);

  const setSessionFromAuth = useCallback((data: AuthResponse, rememberMe: boolean) => {
    tokenStorage.setSession(data.accessToken, data.refreshToken, data.user, rememberMe);
    setUser(data.user);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!tokenStorage.getAccess()) {
      setUser(null);
      return;
    }
    const { data } = await authApi.me();
    tokenStorage.updateUser(data);
    setUser(data);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (tokenStorage.getAccess()) {
          await refreshUser();
        }
      } catch {
        tokenStorage.clear();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean) => {
      const { data } = await authApi.login({ email, password, rememberMe });
      setSessionFromAuth(data, rememberMe);
      return data.user;
    },
    [setSessionFromAuth]
  );

  const logout = useCallback(async () => {
    const refresh = tokenStorage.getRefresh();
    try {
      if (refresh) await authApi.logout(refresh);
    } catch {
      // ignore network errors on logout
    } finally {
      tokenStorage.clear();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      refreshUser,
      setSessionFromAuth,
    }),
    [user, loading, login, logout, refreshUser, setSessionFromAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { getErrorMessage };
