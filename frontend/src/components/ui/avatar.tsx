import * as React from "react";
import { cn } from "@/utils/cn";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy" | "away";
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  name,
  size = "md",
  status,
  className,
  ...props
}) => {
  const [imageError, setImageError] = React.useState(false);

  const getInitials = (text?: string): string => {
    if (!text) return "QF";
    const parts = text.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sizeMap = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const statusSizeMap = {
    xs: "h-1.5 w-1.5 ring-1",
    sm: "h-2 w-2 ring-1",
    md: "h-2.5 w-2.5 ring-2",
    lg: "h-3 w-3 ring-2",
    xl: "h-4 w-4 ring-2",
  };

  const statusColors = {
    online: "bg-emerald-500",
    busy: "bg-rose-500",
    away: "bg-amber-500",
    offline: "bg-slate-400",
  };

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 select-none items-center justify-center rounded-full bg-slate-100 font-semibold text-navy-900 border border-slate-200 overflow-hidden dark:bg-navy-800 dark:border-navy-700 dark:text-slate-100",
        sizeMap[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-white dark:ring-navy-900",
            statusSizeMap[size],
            statusColors[status]
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
