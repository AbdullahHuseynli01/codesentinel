import { ArrowRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-accent-blue/[0.08] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <div className="text-center mb-8">
          <Logo className="mb-6 justify-center" />
          <h1 className="text-2xl font-bold font-display text-text-primary">
            Welcome back
          </h1>
          <p className="text-text-secondary mt-2 text-sm">
            Sign in with GitHub to start reviewing your code with AI.
          </p>
        </div>

        <div className="glass-strong rounded-2xl p-8">
          <a href="/api/auth/github">
            <Button size="lg" className="w-full">
              <GithubLogo size={20} weight="regular" />
              Sign in with GitHub
              <ArrowRight size={16} weight="bold" />
            </Button>
          </a>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
              Repository and pull request access only
            </div>
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
              No access to your private code content
            </div>
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
              Revoke access anytime from GitHub settings
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          By signing in, you agree to our{" "}
          <a href="#" className="text-text-secondary hover:text-text-primary underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-text-secondary hover:text-text-primary underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
