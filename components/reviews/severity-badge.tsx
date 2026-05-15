import { Badge } from "@/components/ui/badge";

interface SeverityBadgeProps {
  severity: string;
  count?: number;
}

const severityMap: Record<string, { variant: "critical" | "warning" | "info"; label: string }> = {
  CRITICAL: { variant: "critical", label: "Critical" },
  WARNING: { variant: "warning", label: "Warning" },
  INFO: { variant: "info", label: "Info" },
};

export function SeverityBadge({ severity, count }: SeverityBadgeProps) {
  const config = severityMap[severity] || { variant: "default" as const, label: severity };

  return (
    <Badge variant={config.variant}>
      {config.label}
      {count !== undefined && count > 0 && ` (${count})`}
    </Badge>
  );
}
