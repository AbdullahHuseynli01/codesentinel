"use client";

import { motion } from "framer-motion";
import {
  Bell,
  ChartLineUp,
  Code,
  GitBranch,
  Lightning,
  ShieldCheck,
  Users,
} from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: ShieldCheck,
    title: "AI Review Engine",
    description:
      "Security, quality, and performance analysis with contextual patch suggestions, scored across every pull request.",
    className: "md:col-span-2 lg:col-span-6 lg:row-span-2",
    visual: "engine",
  },
  {
    icon: GitBranch,
    title: "GitHub Integration",
    description:
      "Webhook-native reviews with inline comments that land where your team already works.",
    className: "md:col-span-1 lg:col-span-3",
  },
  {
    icon: ChartLineUp,
    title: "Score Dashboard",
    description:
      "Trace code health over time by repository, team, category, and release window.",
    className: "md:col-span-1 lg:col-span-3",
  },
  {
    icon: Bell,
    title: "Instant Alerts",
    description: "Critical findings surface in seconds with severity-aware routing.",
    className: "lg:col-span-2",
  },
  {
    icon: Lightning,
    title: "Trend Tracking",
    description: "Spot regressions before they become habits.",
    className: "lg:col-span-2",
  },
  {
    icon: Users,
    title: "Team Support",
    description: "Shared standards without slowing down strong reviewers.",
    className: "lg:col-span-2",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function CodeVisual() {
  return (
    <div className="mt-8 rounded-[var(--radius-lg)] border border-border bg-bg-void p-4 font-code text-xs shadow-[var(--shadow-lg)]">
      <div className="mb-3 flex items-center gap-2 text-text-muted">
        <Code size={14} weight="bold" />
        sentinel.analysis.ts
      </div>
      <div className="space-y-1">
        <p className="text-text-muted">
          <span className="text-accent-cyan">if</span> (risk.score &gt;{" "}
          <span className="text-accent-amber">0.7</span>) {"{"}
        </p>
        <p className="pl-5 text-accent-rose">
          blockMerge(&quot;credential exposure&quot;);
        </p>
        <p className="pl-5 text-accent-emerald">
          suggestPatch(secretManager.replaceInlineToken);
        </p>
        <p className="text-text-muted">{"}"}</p>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-[var(--space-20)]">
      <div className="mx-auto max-w-[var(--max-width-full)] px-6">
        <div className="mb-16 max-w-[720px]">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-accent-primary">
            Intelligence layer
          </p>
          <h2 className="text-3xl font-semibold text-text-primary md:text-5xl">
            Built like a reviewer, tuned like a product system.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
            A bento of practical review intelligence: not more noise, just the
            issues that change what you ship.
          </p>
        </div>

        <motion.div
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className={cn("min-h-[240px]", feature.className)}
            >
              <Card hover className="group h-full p-7">
                <div className="relative z-10">
                  <div className="mb-6 grid h-12 w-12 place-items-center rounded-[var(--radius-md)] border border-border bg-accent-primary/10 text-accent-primary transition-transform group-hover:scale-105 group-hover:-rotate-3">
                    <feature.icon size={26} weight="duotone" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
                    {feature.description}
                  </p>
                  {feature.visual === "engine" && <CodeVisual />}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
