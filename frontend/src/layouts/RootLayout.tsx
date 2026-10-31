import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Activity, ShieldCheck } from "lucide-react";

export const RootLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {/* Primary Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm shadow-sky-600/30">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Queue<span className="text-sky-600">Free</span>
                </span>
                <span className="hidden text-xs text-slate-500 sm:inline-block sm:ml-2 font-medium">
                  SKIP THE LINE. SAVE YOUR TIME.
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Phase 1 Scaffolding Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-sky-600 flex items-center justify-center text-white text-xs font-bold">
                Q
              </div>
              <p className="text-sm text-slate-600">
                <strong className="font-semibold text-slate-800">QueueFree</strong> —
                Smarter queues. Faster care. Better healthcare experiences.
              </p>
            </div>
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} QueueFree Health Platform. Architecture Phase 1.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
