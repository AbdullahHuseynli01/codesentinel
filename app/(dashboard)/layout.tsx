import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <Sidebar user={{ username: user.username, avatarUrl: user.avatarUrl, plan: user.plan }} />
      <div className="ml-[260px] flex min-h-screen flex-col max-lg:ml-[72px]">
        <Topbar user={{ username: user.username, avatarUrl: user.avatarUrl }} />
        <main className="mx-auto w-full max-w-[1280px] flex-1 p-[var(--space-8)]">
          {children}
        </main>
      </div>
    </div>
  );
}
