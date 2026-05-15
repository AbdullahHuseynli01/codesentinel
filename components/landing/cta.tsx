"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GithubLogo, ShieldCheck } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative py-[var(--space-20)]">
      <div className="mx-auto max-w-[var(--max-width-wide)] px-6">
        <motion.div
          className="premium-card relative overflow-hidden p-10 text-center md:p-16"
          data-cursor-card
          data-tilt
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="absolute left-1/2 top-0 h-[260px] w-[680px] -translate-x-1/2 rounded-full bg-accent-primary/10 blur-[100px]" />

          <div className="relative z-10 mx-auto mb-6 grid h-14 w-14 place-items-center rounded-[var(--radius-lg)] border border-border bg-accent-primary/10 text-accent-primary">
            <ShieldCheck size={30} weight="duotone" />
          </div>

          <h2 className="relative z-10 mx-auto max-w-2xl text-3xl font-semibold text-text-primary md:text-5xl">
            Ship code you are proud to defend.
          </h2>

          <p className="relative z-10 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">
            Connect GitHub and run the first Sentinel review in under a minute.
            Public repositories stay free.
          </p>

          <div className="relative z-10 mt-10 flex justify-center">
            <Link href="/login">
              <Button size="lg">
                <GithubLogo size={20} weight="regular" />
                Connect GitHub - It&apos;s Free
                <ArrowRight size={18} weight="bold" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
