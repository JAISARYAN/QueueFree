import React from "react";
import {
  UserCheck,
  Ticket,
  ListFilter,
  MonitorPlay,
  CreditCard,
  Users,
  AlertCircle,
} from "lucide-react";
import { DashboardShell, type NavItem } from "./DashboardShell";

export const ReceptionistDashboardLayout: React.FC = () => {
  const navItems: NavItem[] = [
    {
      label: "Patient Check-In Desk",
      href: "/receptionist/dashboard",
      icon: <UserCheck className="h-4 w-4" />,
      badge: "Intake",
    },
    {
      label: "Issue Walk-In Token",
      href: "/receptionist/walkin",
      icon: <Ticket className="h-4 w-4" />,
    },
    {
      label: "OPD Queue Triage",
      href: "/receptionist/triage",
      icon: <ListFilter className="h-4 w-4" />,
    },
    {
      label: "Waiting Hall Live Display",
      href: "/receptionist/display",
      icon: <MonitorPlay className="h-4 w-4" />,
    },
    {
      label: "Consultation Fee Desk",
      href: "/receptionist/billing",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      label: "Doctor Rosters",
      href: "/receptionist/doctors",
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: "Emergency Override",
      href: "/receptionist/priority",
      icon: <AlertCircle className="h-4 w-4" />,
    },
  ];

  return (
    <DashboardShell
      roleTitle="Reception & Intake Console"
      roleBadge="OPD Front-Desk Staff"
      roleBadgeVariant="info"
      navItems={navItems}
      userDisplayName="Sunil Verma"
      userEmail="sunil.reception@apollo.queuefree.health"
      hospitalName="Apollo Hospital — Main OPD Reception"
    />
  );
};
