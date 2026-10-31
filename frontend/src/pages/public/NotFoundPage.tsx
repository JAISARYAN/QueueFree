import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="text-sm font-semibold uppercase tracking-wider text-sky-600">
        404 Not Found
      </span>
      <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
        Page does not exist
      </h1>
      <p className="mt-4 max-w-md text-sm text-slate-600">
        The requested URL was not found on QueueFree. Please return to the homepage
        or contact your hospital administrator.
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 transition-colors"
        >
          <Home className="h-4 w-4" />
          Back to Overview
        </Link>
      </div>
    </div>
  );
};
