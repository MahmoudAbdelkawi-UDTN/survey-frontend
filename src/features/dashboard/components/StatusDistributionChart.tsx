import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { statusColors } from "@/lib/chartColors"
import { ChartTooltip } from "@/features/dashboard/components/ChartTooltip"
import { SubmissionStatus, type StatusCountDto } from "@/types/api"

const statusMeta: Record<SubmissionStatus, { label: string; color: string }> = {
  [SubmissionStatus.Draft]: { label: "Draft", color: statusColors.draft },
  [SubmissionStatus.Submitted]: { label: "Submitted", color: statusColors.submitted },
  [SubmissionStatus.UnderReview]: { label: "Under Review", color: statusColors.underReview },
  [SubmissionStatus.Reviewed]: { label: "Reviewed", color: statusColors.reviewed },
}

export function StatusDistributionChart({ data }: { data: StatusCountDto[] }) {
  const chartData = data.map((d) => ({
    name: statusMeta[d.status].label,
    value: d.count,
    color: statusMeta[d.status].color,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip content={<ChartTooltip />} />
        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke="var(--card)" strokeWidth={2} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

export function StatusDistributionLegend({ data }: { data: StatusCountDto[] }) {
  return (
    <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
      {data.map((d) => (
        <div key={d.status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-2 rounded-full" style={{ backgroundColor: statusMeta[d.status].color }} />
          {statusMeta[d.status].label} ({d.count})
        </div>
      ))}
    </div>
  )
}
