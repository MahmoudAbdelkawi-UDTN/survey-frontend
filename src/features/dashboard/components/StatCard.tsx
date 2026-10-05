import type { LucideIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  isLoading?: boolean
}

export function StatCard({ label, value, icon: Icon, isLoading }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <Icon className="size-3.5 text-muted-foreground" />
      </div>
      {isLoading ? (
        <Skeleton className="mt-2 h-7 w-16" />
      ) : (
        <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      )}
    </div>
  )
}
