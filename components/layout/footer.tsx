import { ArrowRight, GithubLogo, XLogo } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Workflow", href: "#how-it-works" },
    { label: "Reviews", href: "/reviews" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Changelog", href: "#" },
    { label: "Security", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "DPA", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-bg-surface/70">
      <div className="mx-auto max-w-[var(--max-width-full)] px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr_1fr]">
          <div>
            <Logo className="mb-5" />
            <p className="max-w-sm text-sm leading-relaxed text-text-secondary">
              CodeSentinel is the review layer for teams that care about secure,
              readable, durable software.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                className="grid h-10 w-10 place-items-center rounded-[var(--radius)] border border-border bg-bg-elevated text-text-muted hover:text-text-primary"
                aria-label="GitHub"
              >
                <GithubLogo size={19} weight="regular" />
              </a>
              <a
                href="#"
                className="grid h-10 w-10 place-items-center rounded-[var(--radius)] border border-border bg-bg-elevated text-text-muted hover:text-text-primary"
                aria-label="X"
              >
                <XLogo size={18} weight="regular" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-sm font-bold text-text-primary">
                  {category}
                </h4>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-text-muted hover:text-text-primary"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-sm font-bold text-text-primary">
              Review intelligence, monthly
            </h4>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Product notes, security patterns, and practical review craft.
            </p>
            <form className="mt-5 flex overflow-hidden rounded-[var(--radius-md)] border border-border bg-bg-base shadow-[var(--shadow-sm)]">
              <input
                type="email"
                placeholder="you@company.com"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                aria-label="Email"
              />
              <button
                type="submit"
                className="grid w-12 place-items-center bg-accent-primary text-white"
                aria-label="Subscribe"
              >
                <ArrowRight size={18} weight="bold" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} CodeSentinel. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <ThemeToggle compact />
            <p className="text-xs font-semibold text-text-muted">
              Made with obsession
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
