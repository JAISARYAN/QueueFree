import React from "react";
import {
  Stethoscope,
  ListOrdered,
  Users,
  Clock,
  CalendarCheck,
  Timer,
  BarChart3,
  UserCheck,
} from "lucide-react";
import { DashboardShell, type NavItem } from "./DashboardShell";

export const DoctorDashboardLayout: React.FC = () => {
  const navItems: NavItem[] = [
    {
      label: "Active OPD Clinic",
      href: "/doctor/dashboard",
      icon: <Stethoscope className="h-4 w-4" />,
      badge: "In Session",
    },
    {
      label: "Queue Sequence",
      href: "/doctor/queue",
      icon: <ListOrdered className="h-4 w-4" />,
    },
    {
      label: "Consultation History",
      href: "/doctor/consultations",
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: "Shift & Slot Quotas",
      href: "/doctor/schedule",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      label: "Roster Availability",
      href: "/doctor/roster",
      icon: <CalendarCheck className="h-4 w-4" />,
    },
    {
      label: "Report OPD Delay",
      href: "/doctor/delays",
      icon: <Timer className="h-4 w-4" />,
    },
    {
      label: "Clinical Throughput",
      href: "/doctor/analytics",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      label: "Doctor Profile",
      href: "/doctor/profile",
      icon: <UserCheck className="h-4 w-4" />,
    },
  ];

  return (
    <DashboardShell
      roleTitle="Doctor Clinical Console"
      roleBadge="Consultant Cardiologist"
      roleBadgeVariant="teal"
      navItems={navItems}
      userDisplayName="Dr. Priya Nambiar, MD"
      userEmail="dr.priya@apollo.queuefree.health"
      hospitalName="Apollo Hospital — Room 304, Cardiology"
    />
  );
};
