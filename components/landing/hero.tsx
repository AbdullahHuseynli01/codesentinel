"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  GithubLogo,
  Robot,
  Sparkle,
  Star,
  Terminal,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

const avatars = ["AL", "SC", "MK", "CN", "PP"];

const terminalLines = [
  { number: "18", code: "- const token = request.headers.authorization", tone: "rose" },
  { number: "19", code: "+ const token = await vault.read('github.token')", tone: "emerald" },
  { number: "24", code: "- db.query(`SELECT * FROM users WHERE id = ${id}`)", tone: "rose" },
  { number: "25", code: "+ db.query('SELECT * FROM users WHERE id = ?', [id])", tone: "cyan" },
];

function AnimatedTerminal() {
  return (
    <div
      className="premium-card scanlines relative overflow-hidden rounded-[var(--radius-xl)] p-0 shadow-[0_0_80px_rgba(59,130,246,0.12)]"
      data-cursor-card
      data-tilt
    >
      <div className="flex h-11 items-center gap-2 border-b border-border bg-bg-elevated/80 px-4">
        <span className="traffic-dot traffic-red" />
        <span className="traffic-dot traffic-amber" />
        <span className="traffic-dot traffic-green" />
        <span className="ml-2 flex items-center gap-2 truncate font-code text-xs text-text-muted">
          <Terminal size={14} weight="bold" />
          reviewing PR #142 - feature/auth-refactor
        </span>
      </div>

      <div className="space-y-1 p-5 font-code text-[13px] leading-6">
        <motion.div
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-primary/20 bg-accent-primary/10 px-3 py-1 text-xs text-accent-primary"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.35 }}
        >
          <Robot size={14} weight="bold" />
          Sentinel pass running
        </motion.div>

        {terminalLines.map((line, index) => (
          <motion.div
            key={line.number}
            className="terminal-row grid grid-cols-[2.5rem_1fr] gap-3 rounded-[var(--radius-sm)] px-2 text-text-secondary"
            initial={{ opacity: 0, width: "0%" }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{
              delay: 0.65 + index * 0.32,
              duration: 0.45,
              ease: "easeOut",
            }}
          >
            <span className="select-none text-right text-text-muted">
              {line.number}
            </span>
            <span className={`terminal-code terminal-code-${line.tone}`}>
              {line.code}
            </span>
          </motion.div>
        ))}

        <motion.div
          className="mt-5 rounded-[var(--radius-md)] border border-accent-rose/25 bg-accent-rose/10 p-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.15, duration: 0.35, ease: "easeOut" }}
        >
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-accent-rose">
            Critical
          </div>
          <p className="text-sm leading-relaxed text-text-secondary">
            Hardcoded authorization flow replaced with secret-backed retrieval.
            The query path now uses parameters, closing an injection vector.
          </p>
        </motion.div>

        <motion.div
          className="mt-3 rounded-[var(--radius-md)] border border-accent-cyan/20 bg-accent-primary/10 p-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.55, duration: 0.35, ease: "easeOut" }}
        >
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-accent-cyan">
            Info
          </div>
          <p className="text-sm leading-relaxed text-text-secondary">
            Suggested patch is safe to apply. Estimated review time: 4.2s.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      <div className="absolute inset-0 hero-mesh opacity-80" />
      <div className="absolute inset-0 dot-grid opacity-50" />
      <div className="ambient-shape right-[8%] top-[16%] h-[320px] w-[320px] bg-accent-primary/10" />
      <div className="ambient-shape bottom-[8%] left-[6%] h-[220px] w-[220px] bg-accent-cyan/10 [animation-delay:1.3s]" />
      <div className="ambient-shape bottom-[22%] right-[32%] h-[160px] w-[160px] bg-accent-violet/10 [animation-delay:2.4s]" />

      <div className="relative z-10 mx-auto grid w-full max-w-[var(--max-width-full)] items-center gap-12 px-6 py-20 lg:grid-cols-[1.18fr_0.82fr] lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-accent-primary/30 bg-bg-glass px-3 py-1.5 text-xs font-bold text-accent-primary shadow-[var(--shadow-sm)] backdrop-blur">
            <Sparkle size={14} weight="fill" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald shadow-[var(--shadow-glow-emerald)]" />
            Now in Public Beta
          </div>

          <h1 className="max-w-4xl font-display text-[var(--text-hero)] font-extrabold leading-[0.95] tracking-[-0.03em] text-text-primary">
            Code Review.
            <br />
            <span className="text-gradient">Reinvented.</span>
          </h1>

          <p className="mt-6 max-w-[520px] text-lg leading-[1.7] text-text-secondary">
            CodeSentinel reads every pull request like a meticulous staff
            engineer: security context, performance tradeoffs, quality trends,
            and precise fixes before the merge button ever warms up.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/login">
              <Button size="lg">
                <GithubLogo size={20} weight="regular" />
                Start Free - Connect GitHub
              </Button>
            </Link>
            <a href="#how-it-works" data-magnetic>
              <Button variant="ghost" size="lg" className="group">
                Watch Demo
                <ArrowRight
                  size={18}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-1"
                />
              </Button>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div className="flex -space-x-3">
              {avatars.map((avatar, index) => (
                <div
                  key={avatar}
                  className={`avatar-dot avatar-dot-${index + 1}`}
                  data-magnetic
                >
                  {avatar}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-accent-amber">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={14} weight="fill" />
                ))}
              </div>
              <p className="mt-1 text-sm font-medium text-text-secondary">
                Join 1,200+ developers
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatedTerminal />
        </motion.div>
      </div>
    </section>
  );
}
