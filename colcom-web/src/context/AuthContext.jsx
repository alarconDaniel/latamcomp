import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/auth.api.js';
import { getStoredAuth, setStoredAuth } from '../api/client.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth());
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    const nextAuth = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    };
    setStoredAuth(nextAuth);
    setAuth(nextAuth);
    return nextAuth;
  }, []);

  const logout = useCallback(async () => {
    const current = getStoredAuth();
    setStoredAuth(null);
    setAuth(null);
    if (current?.refreshToken) {
      try {
        await authApi.logout(current.refreshToken);
      } catch {
        /* Session is already cleared locally. */
      }
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!getStoredAuth()?.accessToken) return null;
    setLoading(true);
    try {
      const data = await authApi.me();
      const current = getStoredAuth();
      const nextAuth = { ...current, user: data.user };
      setStoredAuth(nextAuth);
      setAuth(nextAuth);
      return data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const onExpired = () => {
      setStoredAuth(null);
      setAuth(null);
    };
    window.addEventListener('colcom:auth-expired', onExpired);
    return () => window.removeEventListener('colcom:auth-expired', onExpired);
  }, []);

  const value = useMemo(() => ({
    user: auth?.user || null,
    accessToken: auth?.accessToken || null,
    refreshToken: auth?.refreshToken || null,
    isAuthenticated: Boolean(auth?.accessToken),
    loading,
    login,
    logout,
    refreshProfile,
  }), [auth, loading, login, logout, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
