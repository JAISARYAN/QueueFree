import React, { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "@/services/api/auth";
import { apiClient } from "@/services/api/client";
import type {
  AuthTokens,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from "@/types";

const ACCESS_TOKEN_KEY = "queuefree_access_token";
const REFRESH_TOKEN_KEY = "queuefree_refresh_token";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    apiClient.setAuthToken(null);
    setTokens(null);
    setUser(null);
  }, []);

  const saveTokens = useCallback((newTokens: AuthTokens) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, newTokens.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, newTokens.refresh);
    apiClient.setAuthToken(newTokens.access);
    setTokens(newTokens);
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      clearAuth();
      return false;
    }

    try {
      const res = await authService.refreshToken(refreshToken);
      const newTokens: AuthTokens = {
        access: res.access,
        refresh: res.refresh || refreshToken,
      };
      saveTokens(newTokens);
      const currentUser = await authService.getMe();
      setUser(currentUser);
      return true;
    } catch {
      clearAuth();
      return false;
    }
  }, [clearAuth, saveTokens]);

  const initAuth = useCallback(async () => {
    const access = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!access || !refresh) {
      clearAuth();
      setIsLoading(false);
      return;
    }

    apiClient.setAuthToken(access);
    setTokens({ access, refresh });

    try {
      const profile = await authService.getMe();
      setUser(profile);
    } catch {
      // Access token may have expired, attempt silent token refresh
      const refreshed = await refreshSession();
      if (!refreshed) {
        clearAuth();
      }
    } finally {
      setIsLoading(false);
    }
  }, [clearAuth, refreshSession]);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (credentials: LoginCredentials): Promise<AuthUser> => {
    const res = await authService.login(credentials);
    const newTokens: AuthTokens = {
      access: res.access,
      refresh: res.refresh,
    };
    saveTokens(newTokens);
    setUser(res.user);
    return res.user;
  };

  const register = async (credentials: RegisterCredentials): Promise<AuthUser> => {
    const res = await authService.register(credentials);
    saveTokens(res.tokens);
    setUser(res.user);
    return res.user;
  };

  const logout = async (): Promise<void> => {
    const refreshToken = tokens?.refresh || localStorage.getItem(REFRESH_TOKEN_KEY);
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      clearAuth();
    }
  };

  const updateUser = async (data: Partial<AuthUser>): Promise<AuthUser> => {
    const updated = await authService.updateMe(data);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
