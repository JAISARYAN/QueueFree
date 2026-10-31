import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  close: () => void;
}

const DropdownContext = React.createContext<DropdownContextType | undefined>(
  undefined
);

export const Dropdown: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <DropdownContext.Provider
      value={{ isOpen, setIsOpen, close: () => setIsOpen(false) }}
    >
      <div ref={containerRef} className={cn("relative inline-block", className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownTrigger: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error("DropdownTrigger must be used inside Dropdown");

  return (
    <div
      onClick={() => context.setIsOpen(!context.isOpen)}
      className={cn("cursor-pointer select-none", className)}
      role="button"
      tabIndex={0}
      aria-haspopup="true"
      aria-expanded={context.isOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          context.setIsOpen(!context.isOpen);
        }
      }}
    >
      {children}
    </div>
  );
};

export const DropdownMenu: React.FC<{
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}> = ({ children, align = "right", className }) => {
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error("DropdownMenu must be used inside Dropdown");

  return (
    <AnimatePresence>
      {context.isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.96 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn(
            "absolute z-50 mt-2 min-w-[12rem] rounded-xl border border-slate-200 bg-white p-1.5 shadow-healthcare-lg dark:border-navy-800 dark:bg-navy-900",
            align === "right" ? "right-0" : "left-0",
            className
          )}
          role="menu"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const DropdownItem: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  destructive?: boolean;
  disabled?: boolean;
  className?: string;
}> = ({ children, onClick, icon, destructive = false, disabled = false, className }) => {
  const context = React.useContext(DropdownContext);

  const handleClick = () => {
    if (disabled) return;
    if (onClick) onClick();
    if (context) context.close();
  };

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-40",
        destructive
          ? "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
          : "text-slate-700 hover:bg-slate-100 hover:text-navy-900 dark:text-slate-200 dark:hover:bg-navy-800 dark:hover:text-white",
        className
      )}
    >
      {icon && <span className="h-4 w-4 shrink-0 text-current">{icon}</span>}
      <span className="flex-1 text-left">{children}</span>
    </button>
  );
};

export const DropdownSeparator: React.FC = () => (
  <div className="my-1 h-px bg-slate-100 dark:bg-navy-800" role="separator" />
);
