import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?:
    | "primary"
    | "secondary"
    | "teal"
    | "outline"
    | "ghost"
    | "destructive"
    | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none active:translate-y-[0.5px]";

    const variantStyles = {
      primary:
        "bg-navy-900 text-white hover:bg-navy-800 focus-visible:ring-navy-700 shadow-healthcare dark:bg-teal-600 dark:hover:bg-teal-500 dark:text-navy-950 dark:font-semibold",
      teal: "bg-teal-600 text-white hover:bg-teal-700 focus-visible:ring-teal-500 shadow-healthcare dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-navy-950",
      secondary:
        "bg-slate-100 text-navy-900 hover:bg-slate-200 focus-visible:ring-slate-400 dark:bg-navy-800 dark:text-slate-100 dark:hover:bg-navy-700",
      outline:
        "border border-slate-300 bg-white text-navy-900 hover:bg-slate-50 focus-visible:ring-teal-500 dark:bg-navy-900/60 dark:border-navy-700 dark:text-slate-100 dark:hover:bg-navy-800",
      ghost:
        "text-slate-700 hover:bg-slate-100 hover:text-navy-900 focus-visible:ring-slate-400 dark:text-slate-300 dark:hover:bg-navy-800 dark:hover:text-white",
      destructive:
        "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500 shadow-healthcare",
      link: "text-teal-600 underline-offset-4 hover:underline p-0 h-auto font-semibold dark:text-teal-400",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
      icon: "h-10 w-10 p-0",
    };

    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-current" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
