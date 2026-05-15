import { redirect } from "next/navigation";
import { FileCode } from "@phosphor-icons/react/dist/ssr";
import { getCurrentUser, getUserReviews } from "@/lib/dal";
import { ReviewListItem } from "@/components/reviews/review-list-item";
import { Card } from "@/components/ui/card";

export default async function ReviewsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const reviews = await getUserReviews(user.id, 50);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold font-display text-text-primary">
          All Reviews
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          View all AI-powered code reviews across your repositories.
        </p>
      </div>

      <Card>
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
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileCode size={40} weight="duotone" className="text-text-muted mb-4" />
            <h3 className="text-lg font-semibold text-text-primary font-display">
              No reviews yet
            </h3>
            <p className="text-sm text-text-secondary mt-2 max-w-sm">
              Reviews will appear here once you open a pull request on a
              connected repository.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
