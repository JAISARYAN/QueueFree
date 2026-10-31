import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";

export interface LogoProps {
  variant?: "full" | "mark" | "text";
  size?: "sm" | "md" | "lg" | "xl";
  withTagline?: boolean;
  className?: string;
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "full",
  size = "md",
  withTagline = false,
  className,
  href = "/",
}) => {
  const sizeMap = {
    sm: { mark: "h-7 w-7", text: "text-lg", tagline: "text-[9px]" },
    md: { mark: "h-9 w-9", text: "text-xl", tagline: "text-[10px]" },
    lg: { mark: "h-11 w-11", text: "text-2xl", tagline: "text-xs" },
    xl: { mark: "h-14 w-14", text: "text-3xl", tagline: "text-sm" },
  };

  const currentSize = sizeMap[size];

  const Mark = (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-navy-800 to-navy-950 text-white shadow-healthcare border border-navy-700/40 select-none flex-shrink-0",
        currentSize.mark
      )}
      aria-hidden="true"
    >
      {/* Outer subtle speed arc */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-1"
      >
        <circle
          cx="16"
          cy="16"
          r="12"
          stroke="#334E68"
          strokeWidth="1.2"
          strokeDasharray="2 2"
          opacity="0.6"
        />
        {/* Clinical Cross */}
        <path
          d="M14 9H18V23H14V9Z"
          fill="#FFFFFF"
          className="transition-colors"
        />
        <path
          d="M9 14H23V18H9V14Z"
          fill="#FFFFFF"
          className="transition-colors"
        />
        {/* Dynamic Queue-forward Arc */}
        <path
          d="M16 4C22.6274 4 28 9.37258 28 16C28 22.6274 22.6274 28 16 28"
          stroke="url(#qfTealSvg)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="16" cy="4" r="1.5" fill="#CCFBF1" />
        <defs>
          <linearGradient id="qfTealSvg" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  const Typography = (
    <div className="flex flex-col">
      <span
        className={cn(
          "font-extrabold tracking-tight text-navy-900 dark:text-white leading-none",
          currentSize.text
        )}
      >
        Queue<span className="text-teal-600 dark:text-teal-400">Free</span>
      </span>
      {withTagline && (
        <span
          className={cn(
            "font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase mt-0.5 leading-none",
            currentSize.tagline
          )}
        >
          SKIP THE LINE. SAVE YOUR TIME.
        </span>
      )}
    </div>
  );

  const content = (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 transition-opacity hover:opacity-95",
        className
      )}
    >
      {variant !== "text" && Mark}
      {variant !== "mark" && Typography}
    </div>
  );

  if (href) {
    return (
      <Link to={href} aria-label="QueueFree Homepage">
        {content}
      </Link>
    );
  }

  return content;
};
