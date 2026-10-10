import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import staffApi, { tokenStore } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, if we have a token, confirm who we are.
  useEffect(() => {
    let active = true;
    if (!tokenStore.access) {
      setLoading(false);
      return;
    }
    staffApi
      .get('/auth/me/')
      .then((res) => active && setUser(res.data))
      .catch(() => {
        tokenStore.clear();
        if (active) setUser(null);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await staffApi.post('/auth/token/', { username, password });
    tokenStore.set({ access: res.data.access, refresh: res.data.refresh });
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const res = await staffApi.post('/auth/register/', payload);
    tokenStore.set({ access: res.data.access, refresh: res.data.refresh });
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(async () => {
    const refresh = tokenStore.refresh;
    try {
      if (refresh) await staffApi.post('/auth/logout/', { refresh });
    } catch (e) {
      /* ignore — we clear locally regardless */
    }
    tokenStore.clear();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isOffice: user?.role === 'office',
    isTechnician: user?.role === 'technician',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
