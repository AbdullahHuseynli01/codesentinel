"use client";

import { type CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  ChartLineUp,
  FileCode,
  GitBranch,
  WarningCircle,
} from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatsIcon = "reviews" | "issues" | "score" | "repos";

interface StatsCardProps {
  icon: StatsIcon;
  label: string;
  value: string | number;
  trend?: { value: number; label: string };
  color?: string;
}

const sparkline = "M2 28 C 12 18, 18 26, 28 16 S 42 10, 54 18 S 66 23, 78 8";
const icons = {
  reviews: FileCode,
  issues: WarningCircle,
  score: ChartLineUp,
  repos: GitBranch,
};

export function StatsCard({
  icon,
  label,
  value,
  trend,
  color = "var(--accent-primary)",
}: StatsCardProps) {
  const Icon = icons[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card
        className="relative min-h-[168px] overflow-hidden p-6"
        style={{ "--stat-color": color } as CSSProperties}
      >
        <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--stat-color)_6%,transparent)]" />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-text-muted">{label}</p>
            <p className="mt-2 font-display text-4xl font-bold text-text-primary">
              {value}
            </p>
            {trend && (
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-bold",
                    trend.value >= 0
                      ? "bg-accent-emerald/10 text-accent-emerald"
                      : "bg-accent-rose/10 text-accent-rose"
                  )}
                >
                  {trend.value >= 0 ? "+" : ""}
                  {trend.value}
                </span>
                <span className="text-xs text-text-muted">{trend.label}</span>
              </div>
            )}
          </div>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--radius-md)] border border-border bg-bg-elevated text-[var(--stat-color)]">
            <Icon size={28} weight="duotone" />
          </div>
        </div>
        <svg className="absolute bottom-4 left-5 right-5 h-10 w-[calc(100%-40px)] text-[var(--stat-color)]" viewBox="0 0 80 34" fill="none" aria-hidden="true">
          <path
            d={sparkline}
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            opacity="0.72"
          />
        </svg>
      </Card>
    </motion.div>
  );
}
