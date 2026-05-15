"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CaretDown,
  Check,
  Copy,
  FileCode,
  Lightbulb,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface IssueCardProps {
  type: string;
  severity: string;
  title: string;
  description: string;
  file: string;
  line: number;
  suggestion?: string | null;
  codeSnippet?: string | null;
}

const severityVariant: Record<string, "critical" | "warning" | "info"> = {
  CRITICAL: "critical",
  WARNING: "warning",
  INFO: "info",
};

const severityClass: Record<string, string> = {
  CRITICAL: "bg-accent-rose",
  WARNING: "bg-accent-amber",
  INFO: "bg-accent-primary",
};

const typeLabels: Record<string, string> = {
  SECURITY: "Security",
  QUALITY: "Quality",
  PERFORMANCE: "Performance",
  BEST_PRACTICE: "Best Practice",
};

export function IssueCard({
  type,
  severity,
  title,
  description,
  file,
  line,
  suggestion,
  codeSnippet,
}: IssueCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyPath() {
    await navigator.clipboard.writeText(`${file}:${line}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card
      className={cn(
        "group overflow-hidden p-0",
        severity === "CRITICAL" && "animate-[pulseRose_2s_ease-in-out_infinite]"
      )}
      data-cursor-card
    >
      <div className={cn("absolute bottom-0 left-0 top-0 w-1", severityClass[severity])} />
      <div className="p-5">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="flex min-w-0 flex-1 items-start gap-4 text-left"
          >
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={severityVariant[severity] || "default"}>
              {severity}
            </Badge>
            <Badge variant="default">{typeLabels[type] || type}</Badge>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-text-primary">{title}</p>
            <div className="mt-2 flex items-center gap-2">
              <FileCode size={14} weight="bold" className="text-text-muted" />
              <span className="truncate font-code text-xs text-text-muted">
                {file}:{line}
              </span>
            </div>
          </div>

          <CaretDown
            size={18}
            weight="bold"
            className={cn(
              "mt-1 shrink-0 text-text-muted transition-transform",
              expanded && "rotate-180"
            )}
          />
          </button>

          <button
            type="button"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-[var(--radius-sm)] text-text-muted opacity-0 transition-opacity hover:bg-bg-elevated hover:text-accent-primary group-hover:opacity-100"
            onClick={() => void copyPath()}
            aria-label="Copy file path"
          >
            {copied ? (
              <Check size={14} weight="bold" className="text-accent-emerald" />
            ) : (
              <Copy size={14} weight="bold" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden border-t border-border"
          >
            <div className="space-y-4 p-5">
              <p className="text-sm leading-relaxed text-text-secondary">
                {description}
              </p>

              {codeSnippet && (
                <div className="code-block-dark overflow-x-auto rounded-[var(--radius-md)] border border-border p-4">
                  <pre className="whitespace-pre-wrap font-code text-xs leading-relaxed">
                    {codeSnippet}
                  </pre>
                </div>
              )}

              {suggestion && (
                <div className="rounded-[var(--radius-md)] border border-accent-primary/20 bg-accent-primary/10 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-accent-primary">
                    <Lightbulb size={16} weight="duotone" />
                    Suggestion
                  </div>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {suggestion}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
