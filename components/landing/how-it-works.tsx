"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Brain, GitBranch, RocketLaunch } from "@phosphor-icons/react";

const steps = [
  {
    icon: GitBranch,
    title: "Connect GitHub",
    description:
      "Authenticate, choose repositories, and let webhooks carry the review context.",
    step: "01",
  },
  {
    icon: Brain,
    title: "Open a Pull Request",
    description:
      "CodeSentinel analyzes the diff, repository patterns, and risky surfaces in parallel.",
    step: "02",
  },
  {
    icon: RocketLaunch,
    title: "Receive Your Review",
    description:
      "Inline comments, category scores, and patch suggestions arrive before momentum is lost.",
    step: "03",
  },
];

const stats = [
  { value: 1200, suffix: "+", label: "Developers" },
  { value: 48000, suffix: "+", label: "PRs Reviewed" },
  { value: 127000, suffix: "+", label: "Issues Caught" },
  { value: 30, prefix: "< ", suffix: "s", label: "Review Time" },
];

function CountUp({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frameId = 0;
    let startTime = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const animate = (time: number) => {
          if (!startTime) startTime = time;
          const progress = Math.min((time - startTime) / 1200, 1);
          const eased = 1 - (1 - progress) ** 3;
          setDisplay(Math.round(value * eased));

          if (progress < 1) frameId = requestAnimationFrame(animate);
        };

        frameId = requestAnimationFrame(animate);
        observer.disconnect();
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}
      {new Intl.NumberFormat("en-US").format(display)}
      {suffix}
    </span>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-[var(--space-20)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-[var(--max-width-full)] px-6">
        <div className="mx-auto mb-16 max-w-[720px] text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-accent-primary">
            Workflow
          </p>
          <h2 className="text-3xl font-semibold text-text-primary md:text-5xl">
            Three steps, one calmer review loop.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-text-secondary">
            No ceremony. No extra dashboard tab to babysit. The system wakes up
            when your team opens a pull request.
          </p>
        </div>

        <div className="relative">
          <motion.svg
            className="pointer-events-none absolute left-[14%] top-16 hidden h-24 w-[72%] md:block"
            viewBox="0 0 900 120"
            fill="none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.path
              d="M10 70 C 210 10, 300 120, 450 62 S 700 18, 890 68"
              stroke="url(#flowGradient)"
              strokeWidth="2"
              strokeDasharray="8 10"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="flowGradient" x1="0" x2="900" y1="0" y2="0">
                <stop stopColor="var(--accent-primary)" />
                <stop offset="0.5" stopColor="var(--accent-cyan)" />
                <stop offset="1" stopColor="var(--accent-violet)" />
              </linearGradient>
            </defs>
          </motion.svg>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                className="premium-card relative overflow-hidden p-7 text-center"
                data-cursor-card
                data-tilt
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  delay: index * 0.2,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                <span className="absolute -top-6 left-6 font-display text-8xl font-bold text-text-primary/10">
                  {step.step}
                </span>
                <div className="relative z-10 mx-auto mb-6 grid h-20 w-20 place-items-center rounded-[var(--radius-lg)] border border-border bg-accent-primary/10 text-accent-primary shadow-[var(--shadow-glow)]">
                  <step.icon size={36} weight="duotone" />
                </div>
                <h3 className="relative z-10 text-xl font-semibold text-text-primary">
                  {step.title}
                </h3>
                <p className="relative z-10 mt-3 text-sm leading-relaxed text-text-secondary">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid overflow-hidden rounded-[var(--radius-xl)] border border-border bg-bg-glass shadow-[var(--shadow-md)] backdrop-blur md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-b border-border p-8 text-center md:border-b-0 md:border-r last:border-r-0"
            >
              <div className="font-display text-3xl font-bold text-text-primary md:text-4xl">
                <CountUp
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-text-secondary">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
