"use client";

import { Button } from "@/components/ui/button";
import { WarningCircle } from "@phosphor-icons/react";

export default function DashboardError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-6">
        <WarningCircle size={32} weight="duotone" className="text-accent-amber" />
      </div>
      <h2 className="text-xl font-semibold font-display text-text-primary mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-text-secondary max-w-md mb-6">
        An unexpected error occurred while loading this page. Please try again
        or contact support if the issue persists.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
