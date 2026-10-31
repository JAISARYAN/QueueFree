/**
 * QueueFree Core System Interfaces & Data Types
 */

export * from "./auth";

export type UserRole =
  | "PATIENT"
  | "DOCTOR"
  | "RECEPTIONIST"
  | "HOSPITAL_ADMIN"
  | "SUPERADMIN";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  hospitalId?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field?: string; issue: string }>;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface HealthCheckResponse {
  status: "healthy" | "degraded" | "unhealthy";
  service: string;
  version: string;
  timestamp: string;
  checks: {
    database: {
      status: "connected" | "disconnected" | "error";
      engine: string;
      name: string;
      host: string;
      port: string;
      error?: string | null;
    };
    cache: {
      status: string;
      provider: string;
    };
  };
}

export interface Hospital {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
}

export interface Department {
  id: string;
  hospitalId: string;
  name: string;
  code: string;
  floorLocation?: string;
  isActive: boolean;
}

export interface Doctor {
  id: string;
  userId: string;
  hospitalId: string;
  departmentId: string;
  fullName: string;
  specialization: string;
  roomNumber?: string;
  defaultConsultationMinutes: number;
  maxDailyPatients: number;
  isActive: boolean;
}

export type TokenState =
  | "ISSUED"
  | "CHECKED_IN"
  | "WAITING"
  | "CALLED"
  | "IN_CONSULTATION"
  | "COMPLETED"
  | "NO_SHOW"
  | "CANCELLED";

export interface QueueToken {
  id: string;
  tokenDisplay: string;
  sequenceNumber: number;
  state: TokenState;
  tokenType: "SCHEDULED" | "WALK_IN" | "EMERGENCY_TRIAGE";
  estimatedCallTime?: string;
  actualCallTime?: string;
  consultationStartTime?: string;
  consultationEndTime?: string;
}
