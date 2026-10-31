import React from "react";
import {
  LayoutDashboard,
  Network,
  UserCog,
  Sliders,
  Timer,
  TrendingUp,
  ShieldAlert,
  Building2,
} from "lucide-react";
import { DashboardShell, type NavItem } from "./DashboardShell";

export const HospitalAdminDashboardLayout: React.FC = () => {
  const navItems: NavItem[] = [
    {
      label: "Hospital Overview",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      label: "Clinical Departments",
      href: "/admin/departments",
      icon: <Network className="h-4 w-4" />,
    },
    {
      label: "Doctor Rosters & Staff",
      href: "/admin/doctors",
      icon: <UserCog className="h-4 w-4" />,
    },
    {
      label: "OPD Slot Quota Rules",
      href: "/admin/quotas",
      icon: <Sliders className="h-4 w-4" />,
    },
    {
      label: "Queue Buffer Policies",
      href: "/admin/policies",
      icon: <Timer className="h-4 w-4" />,
    },
    {
      label: "Wait-Time Analytics",
      href: "/admin/analytics",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      label: "Facility Audit Logs",
      href: "/admin/audit",
      icon: <ShieldAlert className="h-4 w-4" />,
    },
    {
      label: "Facility Settings",
      href: "/admin/settings",
      icon: <Building2 className="h-4 w-4" />,
    },
  ];

  return (
    <DashboardShell
      roleTitle="Hospital Operations Portal"
      roleBadge="Hospital Administrator"
      roleBadgeVariant="primary"
      navItems={navItems}
      userDisplayName="Meera Deshmukh"
      userEmail="meera.admin@apollo.queuefree.health"
      hospitalName="Apollo Multispecialty Hospital (Branch #01)"
    />
  );
};
