import type { UserRole } from "@/types";

export const getDashboardPathForRole = (role?: UserRole): string => {
  switch (role) {
    case "PATIENT":
      return "/patient/dashboard";
    case "DOCTOR":
      return "/doctor/dashboard";
    case "RECEPTIONIST":
      return "/receptionist/dashboard";
    case "HOSPITAL_ADMIN":
      return "/admin/dashboard";
    case "SUPERADMIN":
      return "/superadmin/dashboard";
    default:
      return "/auth/login";
  }
};
