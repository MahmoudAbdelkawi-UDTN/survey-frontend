import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { categoricalColors, chartAxis, chartGrid } from "@/lib/chartColors"
import { ChartTooltip } from "@/features/dashboard/components/ChartTooltip"
import type { ScoreBucketDto } from "@/types/api"

export function ScoreDistributionChart({ data }: { data: ScoreBucketDto[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} vertical={false} />
        <XAxis
          dataKey="bucketLabel"
          tick={{ fontSize: 11, fill: chartAxis }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: chartAxis }} tickLine={false} axisLine={false} width={28} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey="count" name="Submissions" fill={categoricalColors[2]} radius={[4, 4, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ResponsiveContainer>
  )
}
