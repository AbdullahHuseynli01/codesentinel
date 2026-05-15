"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "gradient-blue text-white shadow-[var(--shadow-glow)] hover:brightness-110",
  secondary:
    "bg-bg-elevated text-text-primary border border-border hover:bg-bg-highlight hover:border-border-strong shadow-[var(--shadow-sm)]",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-elevated/70",
  danger:
    "bg-accent-red/10 text-accent-red border border-accent-red/20 hover:bg-accent-red/20 shadow-[var(--shadow-glow-rose)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-[var(--radius)] gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-[var(--radius-md)] gap-2",
  lg: "px-7 py-3.5 text-base rounded-[var(--radius-md)] gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold tracking-[0.01em] transition-all duration-200 cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:border-accent-primary focus-visible:shadow-[0_0_0_3px_var(--accent-primary-dim)]",
          "active:scale-[0.97]",
          "disabled:opacity-50 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || loading}
        data-magnetic={variant === "primary" ? true : undefined}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
export type { ButtonProps };
