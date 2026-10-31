import React from "react";
import { Link } from "react-router-dom";
import {
  UserCheck,
  Ticket,
  Search,
  ListFilter,
  MonitorPlay,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ReceptionistDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-white">
            OPD Front-Desk Console
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Intake desk for patient check-in, walk-in token issuance, and waiting hall display
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="info">Desk 01 — Main Block</Badge>
          <Button variant="teal" size="sm" leftIcon={<Ticket className="h-4 w-4" />}>
            Issue Walk-In Token
          </Button>
        </div>
      </div>

      {/* Patient Fast Check-In Card */}
      <Card>
        <CardHeader>
          <CardTitle>Rapid Patient Check-In & Verification</CardTitle>
          <CardDescription>
            Scan booking QR code or search patient by phone number or UHID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter Patient Phone Number or Booking Ref (e.g., BK-20261031-9872)"
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <Button variant="primary" leftIcon={<UserCheck className="h-4 w-4" />}>
              Verify & Check In
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Front-Desk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverable>
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400 flex items-center justify-center mb-2">
              <ListFilter className="h-5 w-5" />
            </div>
            <CardTitle>Queue Triage Board</CardTitle>
            <CardDescription>
              Reorder tokens for geriatric, pediatric, or emergency priorities
            </CardDescription>
          </CardHeader>
        </Card>

        <Card hoverable>
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-navy-50 text-navy-800 dark:bg-navy-900 dark:text-slate-300 flex items-center justify-center mb-2">
              <MonitorPlay className="h-5 w-5" />
            </div>
            <CardTitle>Waiting Hall TV Screen</CardTitle>
            <CardDescription>
              Launch full-screen high-contrast live token announcement board
            </CardDescription>
          </CardHeader>
        </Card>

        <Card hoverable>
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 dark:bg-navy-800 dark:text-slate-300 flex items-center justify-center mb-2">
              <Ticket className="h-5 w-5" />
            </div>
            <CardTitle>Design System Explorer</CardTitle>
            <CardDescription>
              Inspect all design system components, tokens, and theme states
            </CardDescription>
            <div className="pt-2">
              <Link to="/design-system" className="text-xs font-semibold text-teal-600 dark:text-teal-400 inline-flex items-center gap-1">
                Open UI Showcase <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};
