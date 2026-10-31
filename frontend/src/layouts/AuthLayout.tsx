import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { ShieldCheck, Clock, CheckCircle2, ArrowLeft } from "lucide-react";

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-navy-950 text-navy-900 dark:text-slate-100">
      {/* Left Brand Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 p-12 text-white flex-col justify-between overflow-hidden border-r border-navy-800">
        {/* Subtle decorative background pulse */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-mint-200/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Logo size="lg" />
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-950/60 border border-teal-500/30 px-3.5 py-1.5 text-xs font-semibold text-teal-300">
            <ShieldCheck className="h-4 w-4 text-teal-400" />
            <span>Healthcare Trust & Data Security</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            SKIP THE LINE. <br />
            <span className="text-teal-400">SAVE YOUR TIME.</span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            QueueFree transforms the outpatient experience with intelligent,
            live queue updates. Reduce hospital waiting room crowding by up to 75%
            and consult doctors right on time.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
              <span>Multi-hospital OPD slot reservation with live token tracking</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Clock className="h-4 w-4 text-teal-400 shrink-0" />
              <span>Dynamic consultation delay prediction algorithms</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <ShieldCheck className="h-4 w-4 text-teal-400 shrink-0" />
              <span>HIPAA & DISHA compliance with immutable audit logging</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-navy-800/80">
          <p>&copy; {new Date().getFullYear()} QueueFree Health Platform</p>
          <span className="font-medium text-teal-400">Version 1.0 (Phase 2 UI)</span>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-navy-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Overview</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="mx-auto w-full max-w-md py-8">
          <div className="lg:hidden mb-8 text-center">
            <Logo size="md" />
          </div>
          <Outlet />
        </div>

        <div className="text-center text-xs text-slate-400">
          <p>
            Secure, encrypted healthcare communication. Need assistance?{" "}
            <a
              href="mailto:support@queuefree.health"
              className="text-teal-600 hover:underline font-medium dark:text-teal-400"
            >
              Contact Hospital Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
