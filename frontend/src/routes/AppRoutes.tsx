import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { PatientDashboardLayout } from "@/layouts/PatientDashboardLayout";
import { DoctorDashboardLayout } from "@/layouts/DoctorDashboardLayout";
import { ReceptionistDashboardLayout } from "@/layouts/ReceptionistDashboardLayout";
import { HospitalAdminDashboardLayout } from "@/layouts/HospitalAdminDashboardLayout";
import { SuperAdminDashboardLayout } from "@/layouts/SuperAdminDashboardLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

import { HomePage } from "@/pages/public/HomePage";
import { DesignSystemPage } from "@/pages/public/DesignSystemPage";
import { NotFoundPage } from "@/pages/public/NotFoundPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { PatientDashboardPage } from "@/pages/patient/PatientDashboardPage";
import { HospitalDirectoryPage } from "@/pages/patient/HospitalDirectoryPage";
import { DoctorDashboardPage } from "@/pages/doctor/DoctorDashboardPage";
import { ReceptionistDashboardPage } from "@/pages/receptionist/ReceptionistDashboardPage";
import { HospitalAdminDashboardPage } from "@/pages/admin/HospitalAdminDashboardPage";
import { SuperAdminDashboardPage } from "@/pages/superadmin/SuperAdminDashboardPage";

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
        </Route>

        {/* Shorthand Auth Redirects */}
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route path="/register" element={<Navigate to="/auth/register" replace />} />

        {/* Authentication Pages */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route index element={<Navigate to="/auth/login" replace />} />
        </Route>

        {/* Protected Patient Portal */}
        <Route
          element={<ProtectedRoute allowedRoles={["PATIENT", "SUPERADMIN"]} />}
        >
          <Route path="/patient" element={<PatientDashboardLayout />}>
            <Route path="dashboard" element={<PatientDashboardPage />} />
            <Route path="hospitals" element={<HospitalDirectoryPage />} />
            <Route index element={<Navigate to="/patient/dashboard" replace />} />
          </Route>
        </Route>

        {/* Protected Doctor Clinical Console */}
        <Route
          element={<ProtectedRoute allowedRoles={["DOCTOR", "SUPERADMIN"]} />}
        >
          <Route path="/doctor" element={<DoctorDashboardLayout />}>
            <Route path="dashboard" element={<DoctorDashboardPage />} />
            <Route index element={<Navigate to="/doctor/dashboard" replace />} />
          </Route>
        </Route>

        {/* Protected Receptionist Desk */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["RECEPTIONIST", "SUPERADMIN"]} />
          }
        >
          <Route path="/receptionist" element={<ReceptionistDashboardLayout />}>
            <Route path="dashboard" element={<ReceptionistDashboardPage />} />
            <Route
              index
              element={<Navigate to="/receptionist/dashboard" replace />}
            />
          </Route>
        </Route>

        {/* Protected Hospital Admin Dashboard */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["HOSPITAL_ADMIN", "SUPERADMIN"]} />
          }
        >
          <Route path="/admin" element={<HospitalAdminDashboardLayout />}>
            <Route path="dashboard" element={<HospitalAdminDashboardPage />} />
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        </Route>

        {/* Protected Platform SuperAdmin Console */}
        <Route element={<ProtectedRoute allowedRoles={["SUPERADMIN"]} />}>
          <Route path="/superadmin" element={<SuperAdminDashboardLayout />}>
            <Route path="dashboard" element={<SuperAdminDashboardPage />} />
            <Route
              index
              element={<Navigate to="/superadmin/dashboard" replace />}
            />
          </Route>
        </Route>

        {/* 404 Fallback */}
        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
