import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
} from "lucide-react";
import { ToastContext, type ToastItem } from "./ToastContext";
import { cn } from "@/utils/cn";

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({
      type,
      title,
      message,
      duration = 4000,
    }: Omit<ToastItem, "id">): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const toast = {
    success: (message: string, title?: string, duration?: number) =>
      addToast({ type: "success", title, message, duration }),
    error: (message: string, title?: string, duration?: number) =>
      addToast({ type: "error", title, message, duration }),
    warning: (message: string, title?: string, duration?: number) =>
      addToast({ type: "warning", title, message, duration }),
    info: (message: string, title?: string, duration?: number) =>
      addToast({ type: "info", title, message, duration }),
  };

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />,
    info: <Info className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-navy-900",
    error: "border-rose-200 dark:border-rose-800/80 bg-white dark:bg-navy-900",
    warning: "border-amber-200 dark:border-amber-800/80 bg-white dark:bg-navy-900",
    info: "border-sky-200 dark:border-sky-800/80 bg-white dark:bg-navy-900",
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, toast }}>
      {children}

      {/* Floating Toast Container */}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2"
        aria-live="polite"
        role="region"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2 }}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-healthcare-lg",
                borders[t.type]
              )}
            >
              {icons[t.type]}
              <div className="flex-1">
                {t.title && (
                  <h4 className="text-xs font-bold text-navy-900 dark:text-white leading-tight">
                    {t.title}
                  </h4>
                )}
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  {t.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="rounded p-1 text-slate-400 hover:text-navy-900 dark:hover:text-white"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
