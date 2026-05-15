import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  compact?: boolean;
  href?: string;
  className?: string;
}

export function Logo({ compact, href = "/", className }: LogoProps) {
  const content = (
    <>
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius)] border border-border bg-bg-elevated shadow-[var(--shadow-sm)]">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className="h-6 w-6 text-accent-primary"
          aria-hidden="true"
        >
          <path
            d="M16 3.4 26 7.2v7.5c0 6.2-4 11.7-10 13.9-6-2.2-10-7.7-10-13.9V7.2l10-3.8Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="m11.2 16.1 3.1 3.1 6.7-7.1"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.3"
          />
        </svg>
        <span className="absolute inset-0 rounded-[var(--radius)] shadow-[var(--shadow-glow)] opacity-40" />
      </span>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-[-0.02em] text-text-primary">
          CodeSentinel
        </span>
      )}
    </>
  );

  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-3", className)}
      data-magnetic
    >
      {content}
    </Link>
  );
}
