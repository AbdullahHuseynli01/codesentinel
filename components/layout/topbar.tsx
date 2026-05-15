"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Command,
  FileCode,
  Gear,
  GitBranch,
  House,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/repositories": "Repositories",
  "/reviews": "Reviews",
  "/settings": "Settings",
};

const searchItems = [
  { label: "Dashboard overview", href: "/dashboard", icon: House, type: "Page" },
  { label: "Repositories", href: "/repositories", icon: GitBranch, type: "Page" },
  { label: "All reviews", href: "/reviews", icon: FileCode, type: "Page" },
  { label: "Settings", href: "/settings", icon: Gear, type: "Page" },
];

interface TopbarProps {
  user: {
    username: string;
    avatarUrl?: string | null;
  };
}

export function Topbar({ user }: TopbarProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const title =
    Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1] ||
    "Dashboard";

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return searchItems;

    return searchItems.filter((item) =>
      item.label.toLowerCase().includes(normalized)
    );
  }, [query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isCommandK = (event.metaKey || event.ctrlKey) && event.key === "k";

      if (isCommandK) {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (event.key === "Escape") setSearchOpen(false);

      if (!searchOpen) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % Math.max(results.length, 1));
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex(
          (index) => (index - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1)
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [results.length, searchOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between border-b border-border bg-bg-glass px-8 backdrop-blur-[20px]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">
            Control Center
          </p>
          <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden h-10 items-center gap-3 rounded-[var(--radius-md)] border border-border bg-bg-elevated px-3 text-sm font-semibold text-text-secondary hover:text-text-primary sm:flex"
            onClick={() => setSearchOpen(true)}
          >
            <MagnifyingGlass size={18} weight="regular" />
            Search
            <kbd className="ml-8 rounded border border-border bg-bg-base px-1.5 py-0.5 font-code text-[10px] text-text-muted">
              CMD K
            </kbd>
          </button>
          <ThemeToggle compact />
          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-[var(--radius-md)] border border-border bg-bg-elevated text-text-muted hover:text-text-primary"
            aria-label="Notifications"
          >
            <Bell size={19} weight="regular" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent-primary shadow-[var(--shadow-glow)]" />
          </button>
          <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-bg-elevated px-2 py-1.5">
            <div className="avatar-dot avatar-dot-2 h-7 w-7 text-[10px]">
              {user.username[0]?.toUpperCase() || "U"}
            </div>
            <span className="hidden text-sm font-semibold text-text-secondary md:block">
              {user.username}
            </span>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-50 grid place-items-start bg-black/40 px-4 pt-[12vh] backdrop-blur">
          <div
            className="absolute inset-0"
            onClick={() => setSearchOpen(false)}
            aria-hidden="true"
          />
          <div className="relative mx-auto w-full max-w-[640px] overflow-hidden rounded-[var(--radius-xl)] border border-border bg-bg-glass shadow-[var(--shadow-lg)] backdrop-blur-[24px]">
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <Command size={20} weight="bold" className="text-accent-primary" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                autoFocus
                placeholder="Search repositories, reviews, settings..."
                className="w-full bg-transparent text-base text-text-primary placeholder:text-text-muted focus:outline-none"
              />
            </div>
            <div className="max-h-[360px] overflow-y-auto p-2">
              {results.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-[var(--radius-md)] px-4 py-3",
                    index === activeIndex
                      ? "bg-bg-highlight text-text-primary"
                      : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                  )}
                  onClick={() => setSearchOpen(false)}
                >
                  <item.icon size={20} weight="duotone" className="text-accent-primary" />
                  <span className="flex-1 text-sm font-semibold">
                    {item.label}
                  </span>
                  <span className="text-xs text-text-muted">{item.type}</span>
                </Link>
              ))}
              {results.length === 0 && (
                <div className="px-4 py-10 text-center text-sm text-text-muted">
                  Nothing found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
