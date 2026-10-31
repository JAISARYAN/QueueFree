import * as React from "react";
import { cn } from "@/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "primary"
    | "teal"
    | "mint"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "outline";
  size?: "sm" | "md";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "teal",
  size = "md",
  dot = false,
  children,
  ...props
}) => {
  const variantStyles = {
    primary:
      "bg-navy-900 text-white border-transparent dark:bg-navy-800 dark:text-slate-100",
    teal: "bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-800/80",
    mint: "bg-mint-100 text-teal-950 border-mint-200 font-semibold dark:bg-teal-900 dark:text-mint-100 dark:border-teal-700",
    secondary:
      "bg-slate-100 text-slate-800 border-slate-200 dark:bg-navy-800 dark:text-slate-300 dark:border-navy-700",
    success:
      "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60",
    warning:
      "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60",
    error:
      "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60",
    info: "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/60",
    outline:
      "bg-transparent text-navy-900 border-slate-300 dark:text-slate-200 dark:border-navy-700",
  };

  const dotColors = {
    primary: "bg-navy-400",
    teal: "bg-teal-500",
    mint: "bg-teal-600",
    secondary: "bg-slate-400",
    success: "bg-emerald-500 animate-pulse",
    warning: "bg-amber-500",
    error: "bg-rose-500",
    info: "bg-sky-500",
    outline: "bg-slate-500",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-0.5 text-xs gap-1.5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center font-medium rounded-full border transition-colors select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </div>
  );
};
