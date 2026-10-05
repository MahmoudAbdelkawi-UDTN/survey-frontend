import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { categoricalColors, chartAxis, chartGrid } from "@/lib/chartColors"
import { ChartTooltip } from "@/features/dashboard/components/ChartTooltip"
import type { ApplicationPerformanceDto } from "@/types/api"

export function ApplicationPerformanceChart({ data }: { data: ApplicationPerformanceDto[] }) {
  const chartData = data.map((d) => ({
    name: d.applicationName.length > 16 ? `${d.applicationName.slice(0, 16)}…` : d.applicationName,
    Submissions: d.submissionsCount,
    Reviewed: d.reviewedCount,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: chartAxis }} tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: chartAxis }} tickLine={false} axisLine={false} width={28} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)" }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Submissions" fill={categoricalColors[0]} radius={[4, 4, 0, 0]} maxBarSize={28} />
        <Bar dataKey="Reviewed" fill={categoricalColors[1]} radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  )
}
