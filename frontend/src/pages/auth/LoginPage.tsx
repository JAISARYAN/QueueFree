import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input, PasswordInput, Button, AlertBanner } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { getDashboardPathForRole } from "@/routes/roleNavigation";
import { LogIn } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Return to intended page if redirected by ProtectedRoute
  const fromLocation = (location.state as { from?: Location })?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const loggedUser = await login({
        email: email.trim().toLowerCase(),
        password,
      });

      addToast({
        type: "success",
        title: "Signed In Successfully",
        message: `Welcome back, ${loggedUser.first_name || loggedUser.email}!`,
      });

      const destination = fromLocation || getDashboardPathForRole(loggedUser.role);
      navigate(destination, { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Invalid email or password. Please verify credentials.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
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

      {error && (
        <AlertBanner
          type="error"
          title="Authentication Failed"
          message={error}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
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
              setError("Please contact your hospital administrator for password recovery assistance.");
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
          isLoading={isSubmitting}
          leftIcon={<LogIn className="h-4 w-4" />}
        >
          Sign In
        </Button>
      </form>

      <div className="pt-4 border-t border-slate-100 dark:border-navy-800 text-center text-xs text-slate-500">
        <span>Need to create a new patient account? </span>
        <Link
          to="/auth/register"
          className="font-semibold text-teal-600 hover:underline dark:text-teal-400"
        >
          Register Patient Account
        </Link>
      </div>
    </div>
  );
};
