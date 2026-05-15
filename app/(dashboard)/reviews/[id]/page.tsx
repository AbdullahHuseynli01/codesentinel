import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowSquareOut,
  CheckCircle,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import { getCurrentUser, getReviewDetail } from "@/lib/dal";
import { ScoreRing } from "@/components/dashboard/score-ring";
import { IssueCard } from "@/components/reviews/issue-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getScoreLabel } from "@/lib/utils";

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const review = await getReviewDetail(id, user.id);

  if (!review) notFound();

  const statusVariant =
    review.status === "COMPLETED"
      ? review.overallScore && review.overallScore >= 70
        ? "success"
        : "warning"
      : review.status === "FAILED"
        ? "critical"
        : ("default" as const);

  const criticalIssues = review.issues.filter((i) => i.severity === "CRITICAL");
  const warningIssues = review.issues.filter((i) => i.severity === "WARNING");
  const infoIssues = review.issues.filter((i) => i.severity === "INFO");

  return (
    <div className="space-y-6">
      <Link
        href="/reviews"
        className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-text-primary"
      >
        <ArrowLeft size={16} weight="bold" />
        Back to Reviews
      </Link>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant={statusVariant}>
                    {review.status === "COMPLETED"
                      ? getScoreLabel(review.overallScore || 0)
                      : review.status}
                  </Badge>
                  <Badge variant="default">
                    {review.repository.fullName} #{review.prNumber}
                  </Badge>
                </div>
                <h2 className="text-2xl font-semibold text-text-primary">
                  {review.prTitle}
                </h2>
                <p className="mt-2 text-sm text-text-muted">
                  {review.branch ? `${review.branch} - ` : ""}
                  Reviewed{" "}
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <a href={review.prUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm">
                  <ArrowSquareOut size={15} weight="bold" />
                  View on GitHub
                </Button>
              </a>
            </div>
          </Card>

          {review.summary && (
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <p className="text-sm leading-relaxed text-text-secondary">
                {review.summary}
              </p>
              {review.positiveHighlights.length > 0 && (
                <div className="mt-5 grid gap-2">
                  {review.positiveHighlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 rounded-[var(--radius-md)] border border-accent-emerald/15 bg-accent-emerald/10 p-3"
                    >
                      <CheckCircle
                        size={18}
                        weight="fill"
                        className="mt-0.5 shrink-0 text-accent-emerald"
                      />
                      <span className="text-sm text-text-secondary">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-text-primary">
                  Issues ({review.issues.length})
                </h3>
                <p className="mt-1 text-sm text-text-muted">
                  Severity, file context, code snippet, and suggested fix.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 rounded-full border border-border bg-bg-glass p-1">
                <Badge variant="critical">{criticalIssues.length} Critical</Badge>
                <Badge variant="warning">{warningIssues.length} Warning</Badge>
                <Badge variant="info">{infoIssues.length} Info</Badge>
              </div>
            </div>

            {review.issues.length > 0 ? (
              <div className="space-y-3">
                {review.issues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    type={issue.type}
                    severity={issue.severity}
                    title={issue.title}
                    description={issue.description}
                    file={issue.file}
                    line={issue.line}
                    suggestion={issue.suggestion}
                    codeSnippet={issue.codeSnippet}
                  />
                ))}
              </div>
            ) : (
              <Card className="py-14 text-center">
                <CheckCircle
                  size={64}
                  weight="duotone"
                  className="mx-auto mb-4 text-accent-emerald"
                />
                <h4 className="text-xl font-semibold text-text-primary">
                  No issues found. Clean code!
                </h4>
                <p className="mt-2 text-sm text-text-secondary">
                  Sentinel found no security, quality, or performance concerns
                  in this pull request.
                </p>
              </Card>
            )}
          </section>
        </div>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <Card className="overflow-hidden p-0">
            <div className="border-b border-border bg-accent-primary/10 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-accent-primary">
                    Review score
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Weighted across issue severity.
                  </p>
                </div>
                <ShieldCheck size={28} weight="duotone" className="text-accent-primary" />
              </div>
              <div className="flex justify-center">
                <ScoreRing
                  score={review.overallScore || 0}
                  size={140}
                  strokeWidth={8}
                />
              </div>
            </div>

            <div className="space-y-4 p-6">
              {[
                ["Security", review.securityScore || 0],
                ["Quality", review.qualityScore || 0],
                ["Performance", review.performanceScore || 0],
              ].map(([label, score]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-[var(--radius-md)] border border-border bg-bg-elevated p-3"
                >
                  <span className="text-sm font-semibold text-text-secondary">
                    {label}
                  </span>
                  <ScoreRing
                    score={Number(score)}
                    size={42}
                    strokeWidth={4}
                    showLabel={false}
                  />
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
