import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input, PasswordInput, Button, AlertBanner } from "@/components/ui";
import { LogIn } from "lucide-react";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(
      "Phase 2 establishes the visual UI design system and layout foundation. Authentication endpoints and session management will be implemented in Phase 3."
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 dark:text-white">
          Sign in to QueueFree
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Access your patient portal, doctor console, or hospital administrative desk.
        </p>
      </div>

      {notice && (
        <AlertBanner
          type="info"
          title="Phase 2 Visual Foundation"
          message={notice}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address or Staff ID"
          type="email"
          placeholder="name@hospital.org"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span>Remember this device</span>
          </label>
          <a
            href="#forgot-password"
            onClick={(e) => {
              e.preventDefault();
              setNotice("Password recovery workflows will be activated in Phase 3.");
            }}
            className="font-medium text-teal-600 hover:underline dark:text-teal-400"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          variant="teal"
          className="w-full mt-2"
          leftIcon={<LogIn className="h-4 w-4" />}
        >
          Sign In
        </Button>
      </form>

      <div className="pt-4 border-t border-slate-100 dark:border-navy-800 text-center text-xs text-slate-500">
        <span>Need to create a new patient account? </span>
        <Link
          to="/"
          className="font-semibold text-teal-600 hover:underline dark:text-teal-400"
        >
          Return to Overview
        </Link>
      </div>
    </div>
  );
};
