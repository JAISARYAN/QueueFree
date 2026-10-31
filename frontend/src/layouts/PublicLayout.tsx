import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Activity, Shield, Sparkles } from "lucide-react";

export const PublicLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-navy-900 dark:bg-navy-950 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm dark:border-navy-800 dark:bg-navy-900/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Logo size="md" />

            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Link
                to="/"
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                Overview
              </Link>
              <Link
                to="/design-system"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60"
              >
                <Sparkles className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                UI Design System
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/auth/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/patient/dashboard">
              <Button variant="teal" size="sm">
                Patient Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 dark:border-navy-800 dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <Logo size="sm" withTagline />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                Unified multi-hospital OPD appointment and intelligent queue management
                platform. Connecting patients, clinicians, and hospital teams seamlessly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span>Enterprise Healthcare Grade</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span>Real-Time OPD Telemetry</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-navy-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
            <p>&copy; {new Date().getFullYear()} QueueFree. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">
              Smarter queues. Faster care. Better healthcare experiences.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
