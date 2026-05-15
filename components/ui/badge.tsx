import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "critical" | "warning" | "info" | "success" | "default";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  critical: "bg-accent-red/10 text-accent-red border-accent-red/20",
  warning: "bg-accent-amber/10 text-accent-amber border-accent-amber/20",
  info: "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
  success: "bg-accent-green/10 text-accent-green border-accent-green/20",
  default: "bg-white/5 text-text-secondary border-white/10",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full border",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
