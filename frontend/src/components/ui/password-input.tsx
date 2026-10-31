import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input, type InputProps } from "./input";

export interface PasswordInputProps extends Omit<InputProps, "type" | "rightIcon"> {
  showLeftLockIcon?: boolean;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ showLeftLockIcon = true, leftIcon, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <Input
        {...props}
        ref={ref}
        type={showPassword ? "text" : "password"}
        leftIcon={leftIcon || (showLeftLockIcon ? <Lock className="h-4 w-4" /> : undefined)}
        rightIcon={
          <button
            type="button"
            onClick={toggleVisibility}
            className="pointer-events-auto rounded p-0.5 text-slate-400 hover:text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:hover:text-slate-200"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={0}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        }
      />
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
