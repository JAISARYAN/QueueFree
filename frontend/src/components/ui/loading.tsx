import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "teal" | "navy" | "white";
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "teal",
  className,
  ...props
}) => {
  const sizeMap = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-3",
  };

  const variantMap = {
    teal: "border-teal-200 border-t-teal-600 dark:border-teal-900 dark:border-t-teal-400",
    navy: "border-navy-200 border-t-navy-900 dark:border-navy-800 dark:border-t-white",
    white: "border-white/30 border-t-white",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full shrink-0",
        sizeMap[size],
        variantMap[variant],
        className
      )}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
};

export const PulseDots: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn("flex items-center space-x-1.5", className)}
      role="status"
      aria-label="Loading"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
          className="h-2 w-2 rounded-full bg-teal-600 dark:bg-teal-400"
        />
      ))}
    </div>
  );
};

/**
 * Healthcare Heartbeat (ECG) pulse animation indicating active system heartbeat
 */
export const HeartbeatLoader: React.FC<{
  label?: string;
  className?: string;
}> = ({ label = "Processing healthcare telemetry...", className }) => {
  return (
    <div
      className={cn("flex flex-col items-center justify-center p-6 text-center", className)}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex items-center justify-center h-12 w-28">
        <svg
          viewBox="0 0 100 40"
          className="w-full h-full stroke-teal-600 dark:stroke-teal-400 fill-none"
        >
          {/* Subtle background pulse path */}
          <path
            d="M0 20 L25 20 L30 10 L35 30 L40 5 L45 35 L50 20 L55 20 L60 16 L65 24 L70 20 L100 20"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-20"
          />
          {/* Animated drawing pulse line */}
          <motion.path
            d="M0 20 L25 20 L30 10 L35 30 L40 5 L45 35 L50 20 L55 20 L60 16 L65 24 L70 20 L100 20"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>
      {label && (
        <span className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </span>
      )}
    </div>
  );
};

export const LoadingOverlay: React.FC<{
  message?: string;
  className?: string;
}> = ({ message = "Loading...", className }) => (
  <div
    className={cn(
      "absolute inset-0 z-40 flex flex-col items-center justify-center rounded-2xl bg-white/80 backdrop-blur-xs p-4 dark:bg-navy-950/80",
      className
    )}
  >
    <Spinner size="lg" />
    {message && (
      <p className="mt-3 text-xs font-semibold text-navy-900 dark:text-slate-200">
        {message}
      </p>
    )}
  </div>
);
