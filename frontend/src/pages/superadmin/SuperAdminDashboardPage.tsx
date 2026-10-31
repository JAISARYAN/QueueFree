import React from "react";
import { Link } from "react-router-dom";
import {
  Building,
  ArrowRight,
  Layers,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const SuperAdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-white">
            QueueFree Global Platform Console
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Multi-tenant hospital network oversight, system health, and cross-organization telemetry
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning">SuperAdmin Operator</Badge>
          <Badge variant="teal" dot>All Systems Operational</Badge>
        </div>
      </div>

      {/* Global Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Connected Hospital Tenants
            </span>
            <div className="mt-2 text-3xl font-extrabold text-navy-900 dark:text-white">
              8
            </div>
            <p className="mt-1 text-xs text-teal-600 dark:text-teal-400 font-medium">
              Across 3 major healthcare networks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Global Daily Tokens Issued
            </span>
            <div className="mt-2 text-3xl font-extrabold text-navy-900 dark:text-white">
              1,420
            </div>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              OPD shifts active across India
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              API Gateway Latency (p95)
            </span>
            <div className="mt-2 text-3xl font-extrabold text-teal-600 dark:text-teal-400">
              42 ms
            </div>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Optimal throughput (&lt; 150ms target)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active WebSocket Channels
            </span>
            <div className="mt-2 text-3xl font-extrabold text-navy-900 dark:text-white">
              Phase 5
            </div>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              Scheduled Redis integration
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverable>
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400 flex items-center justify-center mb-2">
              <Building className="h-5 w-5" />
            </div>
            <CardTitle>Onboard Hospital Tenant</CardTitle>
            <CardDescription>
              Deploy new hospital organizations and configure integration connectors
            </CardDescription>
          </CardHeader>
        </Card>

        <Card hoverable>
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-navy-50 text-navy-800 dark:bg-navy-900 dark:text-slate-300 flex items-center justify-center mb-2">
              <Layers className="h-5 w-5" />
            </div>
            <CardTitle>SMS & Payment Gateways</CardTitle>
            <CardDescription>
              Configure WhatsApp Business API, Twilio, and Razorpay/Stripe webhooks
            </CardDescription>
          </CardHeader>
        </Card>

        <Card hoverable>
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 dark:bg-navy-800 dark:text-slate-300 flex items-center justify-center mb-2">
              <Sparkles className="h-5 w-5" />
            </div>
            <CardTitle>UI Design System</CardTitle>
            <CardDescription>
              View the complete healthcare UI design system and component gallery
            </CardDescription>
            <div className="pt-2">
              <Link to="/design-system" className="text-xs font-semibold text-teal-600 dark:text-teal-400 inline-flex items-center gap-1">
                Open Showcase <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};
