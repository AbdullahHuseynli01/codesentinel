"use client";

import { motion } from "framer-motion";
import { Quotes, Star } from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Staff Engineer",
    company: "Stripe",
    avatar: "SC",
    quote:
      "CodeSentinel caught a SQL injection vulnerability in a PR that three human reviewers missed. It paid for itself on day one.",
  },
  {
    name: "Marcus Johnson",
    role: "Engineering Lead",
    company: "Vercel",
    avatar: "MJ",
    quote:
      "The comments read like they came from someone who actually understood the repo. That changed how our team talks about AI review.",
  },
  {
    name: "Priya Patel",
    role: "Senior Developer",
    company: "Shopify",
    avatar: "PP",
    quote:
      "I review more than twenty PRs a week. CodeSentinel handles the tedious risk checks so I can stay focused on architecture.",
  },
  {
    name: "Noah Kim",
    role: "Platform Lead",
    company: "Linear",
    avatar: "NK",
    quote:
      "The trend view exposed a performance regression pattern we had normalized. Fixing it became obvious once we could see it.",
  },
];

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden py-[var(--space-20)]"
    >
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg-void to-transparent" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg-void to-transparent" />

      <div className="mx-auto max-w-[var(--max-width-full)] px-6">
        <div className="mb-14 max-w-[720px]">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-accent-primary">
            Field notes
          </p>
          <h2 className="text-3xl font-semibold text-text-primary md:text-5xl">
            Developers notice when review tools have taste.
          </h2>
        </div>

        <motion.div
          className="testimonial-track flex gap-5 overflow-x-auto pb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <Card
              key={`${testimonial.name}-${index}`}
              className={cn(
                "min-w-[310px] max-w-[360px] flex-none p-7",
                index % 2 === 0 ? "-rotate-1" : "rotate-1",
                index % 3 === 0 && "md:mt-8"
              )}
              hover
            >
              <Quotes size={28} weight="duotone" className="text-accent-primary" />
              <div className="mt-5 flex items-center gap-1 text-accent-amber">
                {Array.from({ length: 5 }).map((_, star) => (
                  <Star key={star} size={14} weight="fill" />
                ))}
              </div>
              <p className="mt-5 text-sm leading-relaxed text-text-secondary">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-7 flex items-center gap-3">
                <div className={`avatar-dot avatar-dot-${(index % 5) + 1}`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
