import { createContext } from "react";
import type {
  AuthTokens,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from "@/types";

export interface AuthContextType {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  register: (credentials: RegisterCredentials) => Promise<AuthUser>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<AuthUser>) => Promise<AuthUser>;
  refreshSession: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
