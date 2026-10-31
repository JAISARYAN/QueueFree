import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { PatientDashboardLayout } from "@/layouts/PatientDashboardLayout";
import { DoctorDashboardLayout } from "@/layouts/DoctorDashboardLayout";
import { ReceptionistDashboardLayout } from "@/layouts/ReceptionistDashboardLayout";
import { HospitalAdminDashboardLayout } from "@/layouts/HospitalAdminDashboardLayout";
import { SuperAdminDashboardLayout } from "@/layouts/SuperAdminDashboardLayout";

import { HomePage } from "@/pages/public/HomePage";
import { DesignSystemPage } from "@/pages/public/DesignSystemPage";
import { NotFoundPage } from "@/pages/public/NotFoundPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { PatientDashboardPage } from "@/pages/patient/PatientDashboardPage";
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

        {/* Authentication Pages */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route index element={<Navigate to="/auth/login" replace />} />
        </Route>

        {/* Patient Dashboard Layout */}
        <Route path="/patient" element={<PatientDashboardLayout />}>
          <Route path="dashboard" element={<PatientDashboardPage />} />
          <Route index element={<Navigate to="/patient/dashboard" replace />} />
        </Route>

        {/* Doctor Dashboard Layout */}
        <Route path="/doctor" element={<DoctorDashboardLayout />}>
          <Route path="dashboard" element={<DoctorDashboardPage />} />
          <Route index element={<Navigate to="/doctor/dashboard" replace />} />
        </Route>

        {/* Receptionist Dashboard Layout */}
        <Route path="/receptionist" element={<ReceptionistDashboardLayout />}>
          <Route path="dashboard" element={<ReceptionistDashboardPage />} />
          <Route index element={<Navigate to="/receptionist/dashboard" replace />} />
        </Route>

        {/* Hospital Admin Dashboard Layout */}
        <Route path="/admin" element={<HospitalAdminDashboardLayout />}>
          <Route path="dashboard" element={<HospitalAdminDashboardPage />} />
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* Platform SuperAdmin Dashboard Layout */}
        <Route path="/superadmin" element={<SuperAdminDashboardLayout />}>
          <Route path="dashboard" element={<SuperAdminDashboardPage />} />
          <Route index element={<Navigate to="/superadmin/dashboard" replace />} />
        </Route>

        {/* 404 Fallback */}
        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
