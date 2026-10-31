import React from "react";
import { Link } from "react-router-dom";
import {
  Network,
  Timer,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const HospitalAdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-white">
            Hospital Operations Portal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Apollo Multispecialty Hospital — Facility Administration & Capacity Planning
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary">Facility Tenant Admin</Badge>
        </div>
      </div>

      {/* Hospital Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Departments
            </span>
            <div className="mt-2 text-3xl font-extrabold text-navy-900 dark:text-white">
              12
            </div>
            <p className="mt-1 text-xs text-teal-600 dark:text-teal-400 font-medium">
              Cardiology, ENT, Pediatrics...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Doctors on Roster Today
            </span>
            <div className="mt-2 text-3xl font-extrabold text-navy-900 dark:text-white">
              28
            </div>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              Across 34 clinical shift blocks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Online Quota Ratio
            </span>
            <div className="mt-2 text-3xl font-extrabold text-teal-600 dark:text-teal-400">
              70 : 30
            </div>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              Scheduled vs Walk-in buffer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Avg Patient Wait Time
            </span>
            <div className="mt-2 text-3xl font-extrabold text-navy-900 dark:text-white">
              18.4 m
            </div>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              ↓ 62% vs physical OPD lines
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverable>
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400 flex items-center justify-center mb-2">
              <Network className="h-5 w-5" />
            </div>
            <CardTitle>Department Catalog</CardTitle>
            <CardDescription>
              Configure specialty departments, rooms, and consultation quotas
            </CardDescription>
          </CardHeader>
        </Card>

        <Card hoverable>
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-navy-50 text-navy-800 dark:bg-navy-900 dark:text-slate-300 flex items-center justify-center mb-2">
              <Timer className="h-5 w-5" />
            </div>
            <CardTitle>Queue Buffer & Grace Rules</CardTitle>
            <CardDescription>
              Set late arrival forfeiture times and emergency priority policies
            </CardDescription>
          </CardHeader>
        </Card>

        <Card hoverable>
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 dark:bg-navy-800 dark:text-slate-300 flex items-center justify-center mb-2">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <CardTitle>Facility Audit Logs</CardTitle>
            <CardDescription>
              Inspect immutable tamper-evident logs for clinical compliance
            </CardDescription>
            <div className="pt-2">
              <Link to="/design-system" className="text-xs font-semibold text-teal-600 dark:text-teal-400 inline-flex items-center gap-1">
                Explore UI Design System <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};
