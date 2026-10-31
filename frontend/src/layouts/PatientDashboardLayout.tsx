import React from "react";
import {
  Activity,
  CalendarPlus,
  CalendarCheck,
  Building2,
  FileText,
  Users,
  Bell,
  Settings,
} from "lucide-react";
import { DashboardShell, type NavItem } from "./DashboardShell";

export const PatientDashboardLayout: React.FC = () => {
  const navItems: NavItem[] = [
    {
      label: "Live Queue Token",
      href: "/patient/dashboard",
      icon: <Activity className="h-4 w-4" />,
      badge: "Live",
    },
    {
      label: "Book OPD Appointment",
      href: "/patient/book",
      icon: <CalendarPlus className="h-4 w-4" />,
    },
    {
      label: "My Appointments",
      href: "/patient/appointments",
      icon: <CalendarCheck className="h-4 w-4" />,
    },
    {
      label: "Hospital Directory",
      href: "/patient/hospitals",
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      label: "Medical Records",
      href: "/patient/records",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      label: "Family Dependents",
      href: "/patient/dependents",
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: "Notifications",
      href: "/patient/notifications",
      icon: <Bell className="h-4 w-4" />,
    },
    {
      label: "Account Settings",
      href: "/patient/settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <DashboardShell
      roleTitle="Patient Portal"
      roleBadge="Patient / Guardian"
      roleBadgeVariant="teal"
      navItems={navItems}
      userDisplayName="Aarav Sharma"
      userEmail="aarav.patient@queuefree.health"
      hospitalName="Apollo Healthcare Network"
    />
  );
};
