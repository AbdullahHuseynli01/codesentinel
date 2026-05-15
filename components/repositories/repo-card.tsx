import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/dashboard/score-ring";
import { formatRelativeTime } from "@/lib/utils";
import { LANGUAGE_COLORS } from "@/lib/constants";
import { ArrowSquareOut, FileCode } from "@phosphor-icons/react/dist/ssr";

interface RepoCardProps {
  id: string;
  name: string;
  fullName: string;
  language?: string | null;
  description?: string | null;
  reviewCount: number;
  lastScore?: number | null;
  lastReviewDate?: Date | string | null;
  webhookActive: boolean;
}

export function RepoCard({
  id,
  name,
  fullName,
  language,
  description,
  reviewCount,
  lastScore,
  lastReviewDate,
  webhookActive,
}: RepoCardProps) {
  return (
    <Card hover className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-text-primary font-display truncate">
            {name}
          </h3>
          <p className="text-xs text-text-muted mt-0.5 truncate">{fullName}</p>
        </div>
        {lastScore !== null && lastScore !== undefined && (
          <ScoreRing score={lastScore} size={44} strokeWidth={3} showLabel={false} />
        )}
      </div>

      {description && (
        <p className="text-sm text-text-secondary line-clamp-2 mb-4">
          {description}
        </p>
      )}

      <div className="flex items-center gap-3 mb-4 mt-auto">
        {language && (
          <span className="flex items-center gap-1.5 text-xs text-text-muted">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: LANGUAGE_COLORS[language] || "#6B7280" }}
            />
            {language}
          </span>
        )}
        <span className="flex items-center gap-1 text-xs text-text-muted">
          <FileCode size={13} weight="bold" />
          {reviewCount} reviews
        </span>
        <Badge variant={webhookActive ? "success" : "default"} className="text-[10px]">
          {webhookActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      {lastReviewDate && (
        <p className="text-xs text-text-muted mb-4">
          Last reviewed {formatRelativeTime(lastReviewDate)}
        </p>
      )}

      <Link href={`/reviews?repo=${id}`}>
        <Button variant="secondary" size="sm" className="w-full">
          View Reviews
          <ArrowSquareOut size={13} weight="bold" />
        </Button>
      </Link>
    </Card>
  );
}
