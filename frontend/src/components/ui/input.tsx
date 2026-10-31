import * as React from "react";
import { cn } from "@/utils/cn";
import { AlertCircle } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-navy-900 dark:text-slate-200"
          >
            {label}
            {required && <span className="ml-1 text-rose-500">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 flex items-center text-slate-400 dark:text-slate-500">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={type}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "flex h-10 w-full rounded-xl border bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-slate-400 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 dark:bg-navy-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-navy-950",
              leftIcon ? "pl-10" : "pl-3",
              rightIcon || error ? "pr-10" : "pr-3",
              error
                ? "border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
                : "border-slate-300 hover:border-slate-400 focus-visible:border-teal-500 focus-visible:ring-teal-500/20 dark:border-navy-700 dark:hover:border-navy-600",
              className
            )}
            {...props}
          />

          {rightIcon && !error && (
            <div className="pointer-events-none absolute right-3 flex items-center text-slate-400 dark:text-slate-500">
              {rightIcon}
            </div>
          )}

          {error && (
            <div className="pointer-events-none absolute right-3 flex items-center text-rose-500">
              <AlertCircle className="h-4 w-4" />
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            className="text-xs font-medium text-rose-600 dark:text-rose-400"
            role="alert"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p
            id={helperId}
            className="text-xs text-slate-500 dark:text-slate-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
