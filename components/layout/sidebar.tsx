"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CaretDown,
  FileCode,
  Gear,
  GitBranch,
  House,
  RocketLaunch,
  SignOut,
} from "@phosphor-icons/react";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: House },
  { label: "Repositories", href: "/repositories", icon: GitBranch },
  { label: "Reviews", href: "/reviews", icon: FileCode },
  { label: "Settings", href: "/settings", icon: Gear },
];

interface SidebarProps {
  user: {
    username: string;
    avatarUrl?: string | null;
    plan: string;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed bottom-0 left-0 top-0 z-40 flex w-[260px] flex-col border-r border-border bg-bg-glass shadow-[var(--shadow-md)] backdrop-blur-[20px] max-lg:w-[72px]">
      <div className="flex h-16 items-center px-4 max-lg:justify-center">
        <Logo compact={false} className="max-lg:[&>span:last-child]:hidden" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex h-12 items-center gap-3 rounded-[var(--radius-md)] px-4 text-sm font-semibold transition-all",
                "max-lg:justify-center max-lg:px-0",
                isActive
                  ? "bg-bg-highlight text-accent-primary"
                  : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
              )}
              title={item.label}
            >
              <span
                className={cn(
                  "absolute left-0 h-6 w-0.5 rounded-full bg-accent-primary opacity-0 transition-opacity",
                  isActive && "opacity-100"
                )}
              />
              <item.icon
                size={24}
                weight={isActive ? "duotone" : "regular"}
                className="shrink-0 transition-transform group-hover:scale-110 group-hover:-rotate-3"
              />
              <span className="max-lg:hidden">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 px-3 pb-4">
        <div className="rounded-[var(--radius-lg)] border border-border bg-accent-primary/10 p-4 max-lg:hidden">
          <div className="mb-3 flex items-center justify-between">
            <Badge variant="info" className="pro-shimmer border-0 text-white">
              {user.plan}
            </Badge>
            <RocketLaunch size={20} weight="duotone" className="text-accent-primary" />
          </div>
          <p className="text-xs leading-relaxed text-text-secondary">
            Upgrade for unlimited private repository reviews and team scoring.
          </p>
          <Button size="sm" className="mt-4 w-full">
            Upgrade
          </Button>
        </div>

        <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-3 max-lg:justify-center">
          <div className="avatar-dot avatar-dot-1 h-9 w-9 text-xs">
            {user.username[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1 max-lg:hidden">
            <p className="truncate text-sm font-semibold text-text-primary">
              {user.username}
            </p>
            <p className="text-xs text-text-muted">Control Center</p>
          </div>
          <CaretDown size={16} weight="bold" className="text-text-muted max-lg:hidden" />
        </div>

        <a
          href="/api/auth/logout"
          className="flex h-11 items-center gap-3 rounded-[var(--radius-md)] px-4 text-sm font-semibold text-text-muted hover:bg-accent-rose/10 hover:text-accent-rose max-lg:justify-center max-lg:px-0"
          title="Sign Out"
        >
          <SignOut size={20} weight="regular" />
          <span className="max-lg:hidden">Sign Out</span>
        </a>
      </div>
    </aside>
  );
}
