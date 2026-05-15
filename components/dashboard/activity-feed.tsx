"use client";

import {
  CheckCircle,
  FileCode,
  GitBranch,
  WarningCircle,
} from "@phosphor-icons/react";
import { cn, formatRelativeTime } from "@/lib/utils";

interface ActivityEvent {
  id: string;
  type: "review_completed" | "repo_connected" | "critical_found" | "review_passed";
  title: string;
  description: string;
  timestamp: Date | string;
}

const eventConfig = {
  review_completed: { icon: FileCode, color: "text-accent-primary", bg: "bg-accent-primary/10" },
  repo_connected: { icon: GitBranch, color: "text-accent-emerald", bg: "bg-accent-emerald/10" },
  critical_found: { icon: WarningCircle, color: "text-accent-rose", bg: "bg-accent-rose/10" },
  review_passed: { icon: CheckCircle, color: "text-accent-emerald", bg: "bg-accent-emerald/10" },
};

interface ActivityFeedProps {
  events: ActivityEvent[];
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-border py-12 text-center">
        <p className="text-sm text-text-muted">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-1">
      <div className="absolute bottom-4 left-7 top-4 w-px bg-border" />
      {events.map((event, index) => {
        const config = eventConfig[event.type];
        const Icon = config.icon;

        return (
          <div
            key={event.id}
            className="relative flex items-start gap-3 rounded-[var(--radius-md)] p-3 transition-colors hover:bg-bg-elevated/70"
          >
            <div
              className={cn(
                "z-10 grid h-8 w-8 shrink-0 place-items-center rounded-[var(--radius)] border border-border",
                config.bg,
                index === 0 && "animate-pulse"
              )}
            >
              <Icon size={17} weight="duotone" className={config.color} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-text-primary">
                {event.title}
              </p>
              <p className="mt-0.5 truncate text-xs text-text-muted">
                {event.description}
              </p>
            </div>
            <span className="shrink-0 text-xs text-text-muted">
              {formatRelativeTime(event.timestamp)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
