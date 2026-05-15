import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/dashboard/score-ring";
import { formatRelativeTime } from "@/lib/utils";
import { LANGUAGE_COLORS } from "@/lib/constants";

interface ReviewListItemProps {
  id: string;
  prTitle: string;
  prNumber: number;
  repoName: string;
  status: string;
  overallScore: number | null;
  createdAt: Date | string;
  issueCount: number;
  criticalCount: number;
  warningCount: number;
  language?: string | null;
}

export function ReviewListItem({
  id,
  prTitle,
  prNumber,
  repoName,
  status,
  overallScore,
  createdAt,
  issueCount,
  criticalCount,
  warningCount,
  language,
}: ReviewListItemProps) {
  const statusVariant =
    status === "COMPLETED"
      ? overallScore && overallScore >= 70
        ? "success"
        : "warning"
      : status === "FAILED"
        ? "critical"
        : "default";

  return (
    <Link
      href={`/reviews/${id}`}
      className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.03] transition-colors group"
    >
      <div className="shrink-0">
        {overallScore !== null ? (
          <ScoreRing score={overallScore} size={48} strokeWidth={4} showLabel={false} />
        ) : (
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
            <span className="text-xs text-text-muted">--</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent-blue transition-colors">
            {prTitle}
          </p>
          <span className="text-xs text-text-muted shrink-0">#{prNumber}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-text-muted">{repoName}</span>
          {language && (
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: LANGUAGE_COLORS[language] || "#6B7280" }}
              />
              {language}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {criticalCount > 0 && (
          <Badge variant="critical">{criticalCount} critical</Badge>
        )}
        {warningCount > 0 && (
          <Badge variant="warning">{warningCount} warnings</Badge>
        )}
        {issueCount === 0 && status === "COMPLETED" && (
          <Badge variant="success">Clean</Badge>
        )}
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <Badge variant={statusVariant}>
          {status === "COMPLETED" && overallScore !== null
            ? `${overallScore}/100`
            : status.toLowerCase().replace("_", " ")}
        </Badge>
        <span className="text-xs text-text-muted">
          {formatRelativeTime(createdAt)}
        </span>
      </div>
    </Link>
  );
}
