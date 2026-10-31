import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  Building2,
  Users,
  Server,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Stethoscope,
  Ticket,
} from "lucide-react";
import { apiClient } from "@/services/api/client";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "@/components/ui";
import type { HealthCheckResponse } from "@/types";

export const HomePage: React.FC = () => {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getHealth();
      setHealth(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to connect to backend API."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero Section */}
      <section className="text-center py-10 sm:py-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-900 dark:bg-teal-950/80 dark:border-teal-800 dark:text-teal-300 text-xs font-semibold mb-6 shadow-xs"
        >
          <Activity className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          QueueFree Healthcare Technology Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-navy-900 dark:text-white max-w-4xl mx-auto"
        >
          SKIP THE LINE. <br />
          <span className="text-teal-600 dark:text-teal-400">SAVE YOUR TIME.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Smarter queues. Faster care. Better healthcare experiences. Unified
          multi-hospital OPD appointment and intelligent queue management.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/design-system">
            <Button
              variant="teal"
              size="lg"
              leftIcon={<Sparkles className="h-4 w-4" />}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Explore UI Design System
            </Button>
          </Link>
          <Link to="/patient/dashboard">
            <Button variant="outline" size="lg">
              Open Patient Portal
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Backend & Environment Live Diagnostic Card */}
      <section>
        <Card className="border-slate-200 dark:border-navy-800 shadow-healthcare">
          <CardHeader className="border-b border-slate-100 dark:border-navy-800 pb-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  Backend System & Observability Diagnostic
                </CardTitle>
                <CardDescription>
                  Verifies REST API handshake and database connectivity via{" "}
                  <code className="text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-1.5 py-0.5 rounded font-mono text-xs">
                    /api/v1/health/
                  </code>
                </CardDescription>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchHealthStatus}
                disabled={loading}
                leftIcon={
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
                  />
                }
              >
                Refresh Telemetry
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* API Status */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 dark:border-navy-800 dark:bg-navy-950/60">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  API Service Liveness
                </span>
                <div className="mt-2 flex items-center gap-2">
                  {loading ? (
                    <span className="text-sm font-medium text-slate-500">
                      Checking...
                    </span>
                  ) : health ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      <span className="text-sm font-bold text-navy-900 dark:text-white">
                        {health.service} ({health.version})
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                      <span className="text-sm font-medium text-amber-700">
                        Unreachable ({error || "Offline"})
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Overall Health */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 dark:border-navy-800 dark:bg-navy-950/60">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  System Health State
                </span>
                <div className="mt-2 flex items-center gap-2">
                  {loading ? (
                    <span className="text-sm font-medium text-slate-500">
                      Checking...
                    </span>
                  ) : health ? (
                    <Badge
                      variant={health.status === "healthy" ? "success" : "warning"}
                      size="md"
                      dot
                    >
                      {health.status.toUpperCase()}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">OFFLINE</Badge>
                  )}
                </div>
              </div>

              {/* Database Engine */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 dark:border-navy-800 dark:bg-navy-950/60">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-slate-500" />
                  PostgreSQL Status
                </span>
                <div className="mt-2">
                  {loading ? (
                    <span className="text-sm font-medium text-slate-500">
                      Inspecting...
                    </span>
                  ) : health?.checks?.database ? (
                    <div>
                      <Badge
                        variant={
                          health.checks.database.status === "connected"
                            ? "success"
                            : "error"
                        }
                        size="sm"
                        dot
                      >
                        {health.checks.database.status}
                      </Badge>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono truncate">
                        {health.checks.database.engine.replace(
                          "django.db.backends.",
                          ""
                        )}{" "}
                        @ {health.checks.database.host}:{health.checks.database.port}
                      </p>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">No telemetry</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Stakeholder Personas & Scope Overview */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white tracking-tight">
            Role-Governed Healthcare Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Tailored consoles for every tier of the hospital outpatient ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/patient/dashboard"
            className="group block rounded-2xl border border-slate-200/80 bg-white p-6 shadow-healthcare hover:-translate-y-1 hover:border-teal-500 transition-all dark:border-navy-800 dark:bg-navy-900"
          >
            <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-navy-900 dark:text-white text-base">
              Patient Portal
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Find specialists, reserve OPD slots, track live queue positions, and arrive just-in-time.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-teal-600 dark:text-teal-400 gap-1">
              <span>Enter Portal</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          <Link
            to="/doctor/dashboard"
            className="group block rounded-2xl border border-slate-200/80 bg-white p-6 shadow-healthcare hover:-translate-y-1 hover:border-teal-500 transition-all dark:border-navy-800 dark:bg-navy-900"
          >
            <div className="h-12 w-12 rounded-xl bg-navy-50 text-navy-900 dark:bg-navy-800 dark:text-slate-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Stethoscope className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-navy-900 dark:text-white text-base">
              Doctor Console
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Conduct consultations, call next patient tokens, manage shift quotas, and report clinic delays.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-teal-600 dark:text-teal-400 gap-1">
              <span>Enter Console</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          <Link
            to="/receptionist/dashboard"
            className="group block rounded-2xl border border-slate-200/80 bg-white p-6 shadow-healthcare hover:-translate-y-1 hover:border-teal-500 transition-all dark:border-navy-800 dark:bg-navy-900"
          >
            <div className="h-12 w-12 rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Ticket className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-navy-900 dark:text-white text-base">
              Reception Desk
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Arriving patient check-in, walk-in token issuance, priority triage, and waiting hall TV board.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-teal-600 dark:text-teal-400 gap-1">
              <span>Enter Desk</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          <Link
            to="/admin/dashboard"
            className="group block rounded-2xl border border-slate-200/80 bg-white p-6 shadow-healthcare hover:-translate-y-1 hover:border-teal-500 transition-all dark:border-navy-800 dark:bg-navy-900"
          >
            <div className="h-12 w-12 rounded-xl bg-slate-100 text-slate-800 dark:bg-navy-800 dark:text-slate-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-navy-900 dark:text-white text-base">
              Hospital Admin
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Clinical departments, doctor rostering, quota rules, wait-time analytics, and compliance audits.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-teal-600 dark:text-teal-400 gap-1">
              <span>Enter Admin</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};
