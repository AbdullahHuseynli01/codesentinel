"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const tiers = [
  { key: "FREE" as const, cta: "Start Free" },
  { key: "PRO" as const, cta: "Get Pro" },
  { key: "TEAM" as const, cta: "Contact Sales" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

export function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="relative py-[var(--space-20)]">
      <div className="mx-auto max-w-[var(--max-width-full)] px-6">
        <div className="mx-auto mb-10 max-w-[720px] text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-accent-primary">
            Pricing
          </p>
          <h2 className="text-3xl font-semibold text-text-primary md:text-5xl">
            Start small. Keep the sharp edges covered.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-text-secondary">
            Plans are intentionally simple, with the Pro tier tuned for solo
            maintainers and small teams who live in pull requests.
          </p>
        </div>

        <div className="mb-14 flex justify-center">
          <div className="inline-flex items-center rounded-full border border-border bg-bg-glass p-1 shadow-[var(--shadow-sm)] backdrop-blur">
            <button
              type="button"
              className={cn(
                "rounded-full px-5 py-2 text-sm font-bold text-text-secondary",
                !annual && "bg-bg-elevated text-text-primary shadow-[var(--shadow-sm)]"
              )}
              onClick={() => setAnnual(false)}
            >
              Monthly
            </button>
            <button
              type="button"
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-text-secondary",
                annual && "bg-bg-elevated text-text-primary shadow-[var(--shadow-sm)]"
              )}
              onClick={() => setAnnual(true)}
            >
              Annual
              <span className="rounded-full bg-accent-emerald/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-accent-emerald">
                Save 16%
              </span>
            </button>
          </div>
        </div>

        <motion.div
          className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {tiers.map((tier) => {
            const plan = PLANS[tier.key];
            const isPopular = "popular" in plan && plan.popular;
            const price = annual
              ? Math.round(plan.price * 12 * 0.84)
              : plan.price;
            const period = annual && plan.price > 0 ? "/year" : "/month";

            return (
              <motion.div key={tier.key} variants={item}>
                <div
                  className={cn(
                    "premium-card relative flex h-full flex-col p-8",
                    isPopular && "border-accent-primary/40 shadow-[var(--shadow-glow)] md:-translate-y-3"
                  )}
                  data-cursor-card
                  data-tilt
                >
                  {isPopular && (
                    <div className="pro-shimmer absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full px-4 py-1 text-xs font-bold text-white shadow-[var(--shadow-glow)]">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-text-primary">
                      {plan.name}
                    </h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="font-display text-5xl font-bold text-text-primary">
                        ${price}
                      </span>
                      <span className="text-sm font-medium text-text-muted">
                        {period}
                      </span>
                    </div>
                  </div>

                  <ul className="mb-8 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-text-secondary"
                      >
                        <CheckCircle
                          size={17}
                          weight="fill"
                          className="mt-0.5 shrink-0 text-accent-emerald"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/login">
                    <Button
                      variant={isPopular ? "primary" : "secondary"}
                      className="w-full"
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
