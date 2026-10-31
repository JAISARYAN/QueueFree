import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, PasswordInput, Button, AlertBanner } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { UserPlus } from "lucide-react";

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError("Passwords do not match. Please verify both password fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters in length.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone_number: phoneNumber.trim(),
        password,
        password_confirm: passwordConfirm,
      });

      addToast({
        type: "success",
        title: "Welcome to QueueFree!",
        message: "Your patient account has been created successfully.",
      });

      navigate("/patient/dashboard", { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to register account.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 dark:text-white">
          Create Patient Account
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Book appointments, track real-time OPD queues, and avoid waiting rooms.
        </p>
      </div>

      {error && (
        <AlertBanner
          type="error"
          title="Registration Error"
          message={error}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            placeholder="e.g. Rahul"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            label="Last Name"
            placeholder="e.g. Verma"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="rahul.verma@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Mobile Phone Number"
          type="tel"
          placeholder="+91 98765 43210"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          helperText="Used for real-time queue position SMS and WhatsApp alerts."
          required
        />

        <PasswordInput
          label="Password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="Repeat your password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
        />

        <div className="text-xs text-slate-500 dark:text-slate-400">
          By signing up, you agree to QueueFree&apos;s Terms of Service and Patient Privacy Policy.
        </div>

        <Button
          type="submit"
          variant="teal"
          className="w-full mt-2"
          isLoading={isSubmitting}
          leftIcon={<UserPlus className="h-4 w-4" />}
        >
          Create Patient Account
        </Button>
      </form>

      <div className="pt-4 border-t border-slate-100 dark:border-navy-800 text-center text-xs text-slate-500">
        <span>Already have an account? </span>
        <Link
          to="/auth/login"
          className="font-semibold text-teal-600 hover:underline dark:text-teal-400"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};
