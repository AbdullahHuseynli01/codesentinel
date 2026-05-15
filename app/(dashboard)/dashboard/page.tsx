import { redirect } from "next/navigation";
import { FileCode } from "@phosphor-icons/react/dist/ssr";
import { getCurrentUser, getDashboardStats, getUserReviews } from "@/lib/dal";

type Review = Awaited<ReturnType<typeof getUserReviews>>[number];
import { StatsCard } from "@/components/dashboard/stats-card";
import { ScoreChart } from "@/components/dashboard/score-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { ReviewListItem } from "@/components/reviews/review-list-item";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [stats, reviews] = await Promise.all([
    getDashboardStats(user.id),
    getUserReviews(user.id, 5),
  ]);

  const chartData = reviews
    .filter((r: Review) => r.overallScore !== null)
    .map((r: Review) => ({
      date: new Date(r.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: r.overallScore!,
    }))
    .reverse();

  const activityEvents = reviews.slice(0, 5).map((r: Review) => ({
    id: r.id,
    type: (r.status === "COMPLETED"
      ? r.overallScore && r.overallScore >= 70
        ? "review_passed"
        : "review_completed"
      : "review_completed") as "review_completed" | "review_passed",
    title: `${r.prTitle}`,
    description: `${r.repository.name} #${r.prNumber}`,
    timestamp: r.createdAt,
  }));

  const topIssues = [
    {
      label: "Critical security",
      value: stats.criticalIssues,
      track: "bg-accent-rose/20",
      bar: "bg-accent-rose",
    },
    {
      label: "Warnings",
      value: Math.max(stats.totalIssues - stats.criticalIssues, 0),
      track: "bg-accent-amber/20",
      bar: "bg-accent-amber",
    },
    {
      label: "Clean reviews",
      value: reviews.filter((r: Review) => r._count.issues === 0).length,
      track: "bg-accent-emerald/20",
      bar: "bg-accent-emerald",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon="reviews"
          label="Total Reviews"
          value={stats.totalReviews}
          trend={{ value: stats.reviewsThisWeek, label: "this week" }}
          color="var(--accent-primary)"
        />
        <StatsCard
          icon="issues"
          label="Issues Found"
          value={stats.totalIssues}
          trend={{ value: stats.criticalIssues, label: "critical" }}
          color="var(--accent-amber)"
        />
        <StatsCard
          icon="score"
          label="Average Score"
          value={stats.averageScore > 0 ? `${stats.averageScore}%` : "--"}
          color="var(--accent-emerald)"
        />
        <StatsCard
          icon="repos"
          label="Repos Connected"
          value={stats.reposConnected}
          color="var(--accent-cyan)"
        />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            {reviews.length > 0 ? (
              <div className="space-y-1">
                {reviews.map((review) => {
                  const criticalCount = review.issues.filter(
                    (i) => i.severity === "CRITICAL"
                  ).length;
                  const warningCount = review.issues.filter(
                    (i) => i.severity === "WARNING"
                  ).length;

                  return (
                    <ReviewListItem
                      key={review.id}
                      id={review.id}
                      prTitle={review.prTitle}
                      prNumber={review.prNumber}
                      repoName={review.repository.name}
                      status={review.status}
                      overallScore={review.overallScore}
                      createdAt={review.createdAt}
                      issueCount={review._count.issues}
                      criticalCount={criticalCount}
                      warningCount={warningCount}
                      language={review.repository.language}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileCode className="h-8 w-8 text-text-muted mx-auto mb-3" />
                <p className="text-sm text-text-muted">
                  No reviews yet. Connect a repository to get started.
                </p>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Score Trend</CardTitle>
            </CardHeader>
            <ScoreChart data={chartData} />
          </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
            </CardHeader>
            <ActivityFeed events={activityEvents} />
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Top Issues</CardTitle>
            </CardHeader>
            <div className="grid gap-3 sm:grid-cols-3">
              {topIssues.map((issue) => (
                <div
                  key={issue.label}
                  className="rounded-[var(--radius-md)] border border-border bg-bg-elevated p-4"
                >
                  <p className="font-display text-3xl font-bold text-text-primary">
                    {issue.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-text-secondary">
                    {issue.label}
                  </p>
                  <div className={`mt-4 h-1.5 rounded-full ${issue.track}`}>
                    <div className={`h-full w-2/3 rounded-full ${issue.bar}`} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
