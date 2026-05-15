import Link from "next/link";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 dot-grid opacity-30" />

      <div className="relative z-10 text-center px-6">
        <ShieldCheck size={48} weight="duotone" className="text-accent-blue mx-auto mb-6" />
        <h1 className="text-6xl font-bold font-display text-text-primary mb-2">
          404
        </h1>
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Page not found
        </h2>
        <p className="text-text-secondary max-w-md mx-auto mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Check the URL or navigate back to safety.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/">
            <Button variant="secondary">Go Home</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
