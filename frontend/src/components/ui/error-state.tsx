import * as React from "react";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/utils/cn";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message,
  onRetry,
  onGoBack,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/40 p-8 text-center dark:border-rose-900/60 dark:bg-rose-950/20",
        className
      )}
      role="alert"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-rose-600 shadow-healthcare border border-rose-200 dark:bg-navy-900 dark:border-rose-900 dark:text-rose-400">
        <AlertCircle className="h-7 w-7" />
      </div>

      <h3 className="mt-4 text-base font-bold text-navy-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-1.5 max-w-md text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        {message}
      </p>

      {(onRetry || onGoBack) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              onClick={onRetry}
            >
              Retry
            </Button>
          )}
          {onGoBack && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
              onClick={onGoBack}
            >
              Go Back
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export const AlertBanner: React.FC<{
  type?: "error" | "warning" | "info" | "success";
  title?: string;
  message: string;
  className?: string;
}> = ({ type = "error", title, message, className }) => {
  const styles = {
    error:
      "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200",
    warning:
      "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200",
    info: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-200",
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 text-xs leading-relaxed",
        styles[type],
        className
      )}
      role="alert"
    >
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-current" />
      <div>
        {title && <h5 className="font-bold">{title}</h5>}
        <p className={title ? "mt-0.5" : ""}>{message}</p>
      </div>
    </div>
  );
};
