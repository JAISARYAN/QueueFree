import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Activity,
  Calendar,
  Clock,
  Building2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const PatientDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const patientName = user?.first_name || "Patient";

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-white">
            Welcome, {patientName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track your real-time outpatient queue status and booked consultations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="teal" dot>
            Live Queue Sync Active
          </Badge>
        </div>
      </div>

      {/* Active Live Token Card */}
      <Card className="border-teal-300 dark:border-teal-800 bg-gradient-to-br from-white to-teal-50/30 dark:from-navy-900 dark:to-teal-950/20 shadow-healthcare-md">
        <CardHeader className="border-b border-teal-100 dark:border-navy-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Active OPD Queue Token</CardTitle>
                <CardDescription>
                  Apollo Multispecialty Hospital — Cardiology Department
                </CardDescription>
              </div>
            </div>
            <Badge variant="mint" size="md" dot>
              Waiting Hall Sequence
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="p-4 rounded-xl bg-white dark:bg-navy-950/80 border border-slate-200/80 dark:border-navy-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Your Token Number
              </span>
              <div className="mt-1 text-3xl font-extrabold text-navy-900 dark:text-teal-400">
                CARD-014
              </div>
              <span className="text-[11px] text-teal-700 dark:text-teal-300 font-semibold">
                Room 304, 3rd Floor
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-navy-950/80 border border-slate-200/80 dark:border-navy-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Now In Consultation
              </span>
              <div className="mt-1 text-3xl font-extrabold text-slate-700 dark:text-slate-200">
                CARD-011
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                3 patients ahead of you
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-navy-950/80 border border-slate-200/80 dark:border-navy-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center md:justify-start gap-1">
                <Clock className="h-3.5 w-3.5 text-teal-600" />
                Estimated Call Time
              </span>
              <div className="mt-1 text-3xl font-extrabold text-teal-600 dark:text-teal-300">
                10:45 AM
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Estimated wait: ~18 mins
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-navy-950/80 border border-slate-200/80 dark:border-navy-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Consultant Clinician
              </span>
              <div className="mt-1 text-base font-bold text-navy-900 dark:text-white truncate">
                Dr. Priya Nambiar
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                MD, DM (Cardiology)
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-teal-50/70 border border-teal-200/60 dark:bg-teal-950/30 dark:border-teal-800/40">
            <div className="flex items-center gap-2.5 text-xs text-teal-900 dark:text-teal-200">
              <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0" />
              <span>
                Please arrive at the clinic door 10 minutes before your estimated call time.
              </span>
            </div>
            <Link to="/design-system">
              <Button variant="teal" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                View Design System
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card hoverable>
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400 flex items-center justify-center mb-2">
              <Calendar className="h-5 w-5" />
            </div>
            <CardTitle>Book OPD Slot</CardTitle>
            <CardDescription>
              Schedule advance consultation appointments across hospital networks
            </CardDescription>
          </CardHeader>
        </Card>

        <Card hoverable>
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-navy-50 text-navy-800 dark:bg-navy-900 dark:text-slate-300 flex items-center justify-center mb-2">
              <Building2 className="h-5 w-5" />
            </div>
            <CardTitle>Hospital Directory</CardTitle>
            <CardDescription>
              Browse connected partner facilities, departments, and doctors
            </CardDescription>
          </CardHeader>
        </Card>

        <Card hoverable>
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 dark:bg-navy-800 dark:text-slate-300 flex items-center justify-center mb-2">
              <AlertCircle className="h-5 w-5" />
            </div>
            <CardTitle>Delay & Roster Alerts</CardTitle>
            <CardDescription>
              Automated notifications for doctor delays, session breaks, or schedule updates
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};
