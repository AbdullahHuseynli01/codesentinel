"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GithubLogo, List, X } from "@phosphor-icons/react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Stories", href: "#testimonials" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 h-16 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-[var(--bg-glass)] shadow-[var(--shadow-sm)] backdrop-blur-[20px] backdrop-saturate-[180%]"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-full max-w-[var(--max-width-full)] items-center justify-between px-6">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-sm font-semibold text-text-secondary hover:text-text-primary"
            >
              {link.label}
              <span className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-accent-primary to-accent-cyan transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="secondary" size="sm">
              <GithubLogo size={18} weight="regular" />
              Sign in with GitHub
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-[var(--radius)] border border-border bg-bg-glass text-text-secondary md:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X size={20} weight="bold" />
          ) : (
            <List size={20} weight="bold" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="mx-4 rounded-[var(--radius-lg)] border border-border bg-[var(--bg-glass)] p-4 shadow-[var(--shadow-lg)] backdrop-blur-[20px] md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-[var(--radius)] px-3 py-2 text-sm font-semibold text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <ThemeToggle compact />
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button size="sm">
                <GithubLogo size={18} weight="regular" />
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
