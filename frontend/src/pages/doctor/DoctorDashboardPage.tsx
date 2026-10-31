import React from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Pause,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const DoctorDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Clinician Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-white">
            Dr. Priya Nambiar, MD
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cardiology OPD Clinic — Room 304, Main Hospital Block
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="teal" dot>
            Clinic Session Active
          </Badge>
          <Button variant="outline" size="sm" leftIcon={<Pause className="h-3.5 w-3.5" />}>
            Pause Clinic
          </Button>
        </div>
      </div>

      {/* Real-time Consultation Queue Controller */}
      <Card className="border-teal-300 dark:border-teal-800 shadow-healthcare-md">
        <CardHeader className="border-b border-slate-100 dark:border-navy-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle>Active Queue Sequence Controller</CardTitle>
              <CardDescription>
                Call tokens in order or adjust consultation state machine
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="mint">Morning OPD Shift</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200/80 dark:bg-teal-950/40 dark:border-teal-800/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                Current Token In Consultation
              </span>
              <div className="mt-2 text-4xl font-extrabold text-navy-900 dark:text-white">
                CARD-011
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                Patient: <strong className="font-semibold">Vikram Malhotra</strong> (UHID: QF-1029)
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="teal" size="sm" leftIcon={<UserCheck className="h-3.5 w-3.5" />}>
                  Complete Consultation
                </Button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 dark:bg-navy-900 dark:border-navy-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Next Up In Queue
              </span>
              <div className="mt-2 text-4xl font-extrabold text-slate-700 dark:text-slate-200">
                CARD-012
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Waiting at Reception Desk • Checked-In
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="primary" size="sm" leftIcon={<Play className="h-3.5 w-3.5" />}>
                  Call Next Patient
                </Button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 dark:bg-navy-900 dark:border-navy-800 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  OPD Session Telemetry
                </span>
                <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Completed Consultations:</span>
                    <strong className="font-bold text-navy-900 dark:text-white">10</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Waiting in Hall:</span>
                    <strong className="font-bold text-teal-600 dark:text-teal-400">14</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Consultation Velocity:</span>
                    <strong className="font-bold text-navy-900 dark:text-white">14.2 mins</strong>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800">
                <Link to="/design-system" className="text-xs text-teal-600 dark:text-teal-400 font-semibold inline-flex items-center gap-1">
                  Design System Components <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
