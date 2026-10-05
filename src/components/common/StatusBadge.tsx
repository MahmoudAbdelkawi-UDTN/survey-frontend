import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { SubmissionStatus } from "@/types/api"

const statusConfig: Record<SubmissionStatus, { label: string; className: string }> = {
  [SubmissionStatus.Draft]: {
    label: "Draft",
    className: "bg-muted text-muted-foreground border-transparent",
  },
  [SubmissionStatus.Submitted]: {
    label: "Submitted",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  [SubmissionStatus.UnderReview]: {
    label: "Under Review",
    className: "bg-warning/15 text-[color-mix(in_oklch,var(--warning),black_25%)] border-warning/30 dark:text-warning",
  },
  [SubmissionStatus.Reviewed]: {
    label: "Reviewed",
    className: "bg-success/10 text-success border-success/25",
  },
}

export function StatusBadge({ status, className }: { status: SubmissionStatus; className?: string }) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}

export function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        isActive
          ? "bg-success/10 text-success border-success/25"
          : "bg-muted text-muted-foreground border-transparent"
      )}
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  )
}
