import React from "react";
import {
  Server,
  Building,
  Users,
  Receipt,
  Layers,
  Lock,
  Sliders,
} from "lucide-react";
import { DashboardShell, type NavItem } from "./DashboardShell";

export const SuperAdminDashboardLayout: React.FC = () => {
  const navItems: NavItem[] = [
    {
      label: "Platform Telemetry",
      href: "/superadmin/dashboard",
      icon: <Server className="h-4 w-4" />,
      badge: "Global",
    },
    {
      label: "Hospital Organizations",
      href: "/superadmin/hospitals",
      icon: <Building className="h-4 w-4" />,
    },
    {
      label: "Global Accounts & RBAC",
      href: "/superadmin/users",
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: "Tenant Subscriptions",
      href: "/superadmin/billing",
      icon: <Receipt className="h-4 w-4" />,
    },
    {
      label: "SMS & Gateway Connectors",
      href: "/superadmin/gateways",
      icon: <Layers className="h-4 w-4" />,
    },
    {
      label: "Compliance & Security",
      href: "/superadmin/compliance",
      icon: <Lock className="h-4 w-4" />,
    },
    {
      label: "Feature Flags",
      href: "/superadmin/config",
      icon: <Sliders className="h-4 w-4" />,
    },
  ];

  return (
    <DashboardShell
      roleTitle="Platform SuperAdmin"
      roleBadge="Platform Operator"
      roleBadgeVariant="warning"
      navItems={navItems}
      userDisplayName="Platform Admin Team"
      userEmail="superadmin@queuefree.health"
      hospitalName="QueueFree Global Cloud Platform"
    />
  );
};
