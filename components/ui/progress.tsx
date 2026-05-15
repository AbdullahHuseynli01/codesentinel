"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  indicatorClassName?: string;
}

export function Progress({ value, max = 100, className, indicatorClassName }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <ProgressPrimitive.Root
      value={value}
      max={max}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-white/5", className)}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-out",
          "bg-accent-blue",
          indicatorClassName
        )}
        style={{ width: `${percentage}%` }}
      />
    </ProgressPrimitive.Root>
  );
}
