import type { ReactNode } from "react"
import { BarChart3 } from "lucide-react"
import { EmptyState } from "@/components/common/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"

interface ChartCardProps {
  title: string
  description?: string
  isLoading?: boolean
  isEmpty?: boolean
  children: ReactNode
}

export function ChartCard({ title, description, isLoading, isEmpty, children }: ChartCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-lg" />
      ) : isEmpty ? (
        <div className="flex h-64 items-center justify-center">
          <EmptyState icon={BarChart3} title="Not enough data yet" description="Check back once there's more activity." />
        </div>
      ) : (
        <div className="h-64 w-full">{children}</div>
      )}
    </div>
  )
}
