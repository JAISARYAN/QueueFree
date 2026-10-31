import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Clock,
  Building2,
  Users,
  CalendarCheck,
  Server,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { apiClient } from "@/services/api/client";
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
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold uppercase tracking-wider mb-6"
        >
          <Activity className="h-4 w-4 text-sky-600" />
          QueueFree Healthcare Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto"
        >
          SKIP THE LINE. <span className="text-sky-600">SAVE YOUR TIME.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Smarter queues. Faster care. Better healthcare experiences. Unified
          multi-hospital OPD appointment and intelligent queue management.
        </motion.p>
      </section>

      {/* Backend & Environment Live Diagnostic Card */}
      <section className="my-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Server className="h-5 w-5 text-sky-600" />
                Backend System & Database Diagnostic
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Verifies REST API handshake and database connectivity via{" "}
                <code className="text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded font-mono text-xs">
                  /api/v1/health/
                </code>
              </p>
            </div>

            <button
              onClick={fetchHealthStatus}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              />
              Refresh Check
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* API Status */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                API Service Liveness
              </span>
              <div className="mt-2 flex items-center gap-2">
                {loading ? (
                  <span className="text-sm font-medium text-slate-500">
                    Checking...
                  </span>
                ) : health ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-bold text-slate-900">
                      {health.service} ({health.version})
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <span className="text-sm font-medium text-amber-700">
                      Unreachable ({error || "Offline"})
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Overall Health */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                System Status
              </span>
              <div className="mt-2 flex items-center gap-2">
                {loading ? (
                  <span className="text-sm font-medium text-slate-500">
                    Checking...
                  </span>
                ) : health ? (
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                      health.status === "healthy"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {health.status}
                  </span>
                ) : (
                  <span className="text-sm text-slate-400">Offline</span>
                )}
              </div>
            </div>

            {/* Database Engine */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
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
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        health.checks.database.status === "connected"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {health.checks.database.status}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1 font-mono">
                      {health.checks.database.engine.replace(
                        "django.db.backends.",
                        ""
                      )}{" "}
                      @ {health.checks.database.host}:
                      {health.checks.database.port}
                    </p>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">No telemetry</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholder Personas & Scope Overview */}
      <section className="my-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Multi-Stakeholder Healthcare Architecture
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Role-governed portals connecting clinical operations and patient care
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 hover:border-sky-300 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">
              Patient Portal
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Find specialists, book advance OPD slots, track real-time queue
              tokens, and receive automated delay alerts.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 hover:border-sky-300 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">
              Doctor Console
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Live consultation queues, call-next token sequences, session pause/break
              controls, and availability roster scheduling.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 hover:border-sky-300 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">
              Reception Desk
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Arriving patient check-in, walk-in token issuance, emergency triage
              prioritization, and fee verification.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 hover:border-sky-300 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">
              Hospital Admin
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Department catalog, doctor quota caps, OPD shift rules, wait-time
              analytics, and operational compliance audit trails.
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Highlights */}
      <section className="my-12 rounded-2xl bg-slate-900 text-white p-8 sm:p-10">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
            Phase 1 Foundation Complete
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2">
            Engineered for Production Resilience
          </h2>
          <p className="text-slate-300 mt-3 text-sm leading-relaxed">
            QueueFree employs a decoupled React + Vite SPA on the frontend and a
            modular Django REST Framework monolith backed by PostgreSQL 17 on the
            backend, ready for future real-time Django Channels and Redis queue
            telemetry.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              <ArrowRight className="h-3.5 w-3.5 text-sky-400" />
              <span>Strict TypeScript</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              <ArrowRight className="h-3.5 w-3.5 text-sky-400" />
              <span>Tailwind CSS</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              <ArrowRight className="h-3.5 w-3.5 text-sky-400" />
              <span>OpenAPI 3.0 / Swagger</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              <ArrowRight className="h-3.5 w-3.5 text-sky-400" />
              <span>Zero Hardcoded Secrets</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
