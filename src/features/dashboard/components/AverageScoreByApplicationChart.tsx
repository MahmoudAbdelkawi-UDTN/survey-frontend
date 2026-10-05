import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { categoricalColors, chartAxis, chartGrid } from "@/lib/chartColors"
import { ChartTooltip } from "@/features/dashboard/components/ChartTooltip"
import type { ApplicationScoreDto } from "@/types/api"

export function AverageScoreByApplicationChart({ data }: { data: ApplicationScoreDto[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: chartAxis }}
          tickLine={false}
          axisLine={false}
          unit="%"
        />
        <YAxis
          type="category"
          dataKey="applicationName"
          width={120}
          tick={{ fontSize: 11, fill: chartAxis }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: string) => (value.length > 18 ? `${value.slice(0, 18)}…` : value)}
        />
        <Tooltip content={<ChartTooltip valueFormatter={(v) => `${v}%`} />} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey="averageScore" name="Average score" fill={categoricalColors[0]} radius={[0, 4, 4, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  )
}
