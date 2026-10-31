import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import type { Theme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition-colors hover:bg-slate-100 hover:text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-navy-800 dark:bg-navy-900 dark:text-slate-200 dark:hover:bg-navy-800 dark:hover:text-white",
        className
      )}
      title={`Current theme: ${theme} (Click to switch)`}
      aria-label={`Current theme: ${theme}. Click to switch theme.`}
    >
      {theme === "system" ? (
        <Monitor className="h-4 w-4" />
      ) : resolvedTheme === "dark" ? (
        <Moon className="h-4 w-4 text-teal-400" />
      ) : (
        <Sun className="h-4 w-4 text-amber-500" />
      )}
    </button>
  );
};

export const ThemeSegmentedControl: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { theme, setTheme } = useTheme();

  const options: Array<{ value: Theme; label: string; icon: React.ReactNode }> = [
    { value: "light", label: "Light", icon: <Sun className="h-3.5 w-3.5" /> },
    { value: "dark", label: "Dark", icon: <Moon className="h-3.5 w-3.5" /> },
    { value: "system", label: "System", icon: <Monitor className="h-3.5 w-3.5" /> },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-navy-800 dark:bg-navy-950",
        className
      )}
      role="group"
      aria-label="Theme selection"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setTheme(opt.value)}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all select-none",
            theme === opt.value
              ? "bg-white text-navy-900 shadow-xs dark:bg-navy-800 dark:text-white"
              : "text-slate-600 hover:text-navy-900 dark:text-slate-400 dark:hover:text-slate-200"
          )}
        >
          {opt.icon}
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
};
