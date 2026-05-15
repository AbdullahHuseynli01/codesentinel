import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Envelope,
  GitBranch,
  ShieldCheck,
  Trash,
} from "@phosphor-icons/react/dist/ssr";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-semibold font-display text-text-primary">
          Settings
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Manage your account and integration preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your GitHub account information</CardDescription>
        </CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-accent-blue/20 flex items-center justify-center text-2xl font-bold text-accent-blue">
            {user.username[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-lg font-semibold text-text-primary">{user.username}</p>
            {user.email && (
              <p className="text-sm text-text-secondary">{user.email}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="info">{user.plan}</Badge>
              <span className="text-xs text-text-muted">
                Joined {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>GitHub Integration</CardTitle>
          <CardDescription>Manage your GitHub connection</CardDescription>
        </CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <GitBranch size={20} weight="duotone" className="text-text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                Connected as @{user.username}
              </p>
              <p className="text-xs text-text-muted">
                Scopes: repo, read:user, user:email
              </p>
            </div>
          </div>
          <Badge variant="success">Connected</Badge>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what you want to be notified about</CardDescription>
        </CardHeader>
        <div className="space-y-4">
          {[
            { label: "Email on Critical Issues", description: "Get notified when a critical security or quality issue is found", icon: ShieldCheck },
            { label: "Weekly Digest", description: "Receive a summary of all reviews from the past week", icon: Envelope },
            { label: "New Review Complete", description: "Get notified when a pull request review is finished", icon: Bell },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mt-0.5">
                  <item.icon size={16} weight="duotone" className="text-text-muted" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{item.label}</p>
                  <p className="text-xs text-text-muted mt-0.5">{item.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-blue" />
              </label>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Review Preferences</CardTitle>
          <CardDescription>Customize how CodeSentinel reviews your code</CardDescription>
        </CardHeader>
        <div className="space-y-4">
          {[
            { label: "Security Analysis", description: "Check for OWASP Top 10 vulnerabilities and exposed secrets" },
            { label: "Code Quality", description: "Analyze complexity, duplication, and naming conventions" },
            { label: "Performance", description: "Detect N+1 queries, memory leaks, and inefficient patterns" },
            { label: "Best Practices", description: "Enforce language-specific standards and TypeScript types" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-text-primary">{item.label}</p>
                <p className="text-xs text-text-muted mt-0.5">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-blue" />
              </label>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-accent-red/20">
        <CardHeader>
          <CardTitle className="text-accent-red">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account</CardDescription>
        </CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-primary">Delete Account</p>
            <p className="text-xs text-text-muted mt-0.5">
              Permanently delete your account, all repositories, and review data.
            </p>
          </div>
          <Button variant="danger" size="sm">
            <Trash size={16} weight="bold" />
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
