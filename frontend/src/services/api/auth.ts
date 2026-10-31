import { apiClient } from "./client";
import type {
  AuthUser,
  ChangePasswordPayload,
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
  TokenRefreshResponse,
} from "@/types";

export const authService = {
  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("auth/login/", credentials);
  },

  /**
   * Register a new patient account
   */
  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>("auth/register/", credentials);
  },

  /**
   * Refresh the access token using a valid refresh token
   */
  async refreshToken(refresh: string): Promise<TokenRefreshResponse> {
    return apiClient.post<TokenRefreshResponse>("auth/token/refresh/", { refresh });
  },

  /**
   * Blacklist refresh token and invalidate active session
   */
  async logout(refresh: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>("auth/logout/", { refresh });
  },

  /**
   * Fetch current authenticated user profile
   */
  async getMe(): Promise<AuthUser> {
    return apiClient.get<AuthUser>("auth/me/");
  },

  /**
   * Update authenticated user profile
   */
  async updateMe(data: Partial<AuthUser>): Promise<AuthUser> {
    return apiClient.patch<AuthUser>("auth/me/", data);
  },

  /**
   * Update password for authenticated user
   */
  async changePassword(data: ChangePasswordPayload): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>("auth/change-password/", data);
  },
};
