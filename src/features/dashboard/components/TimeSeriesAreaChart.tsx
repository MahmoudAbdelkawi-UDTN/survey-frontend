import { format } from "date-fns"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { chartAxis, chartGrid } from "@/lib/chartColors"
import { ChartTooltip } from "@/features/dashboard/components/ChartTooltip"
import type { TimeSeriesPointDto } from "@/types/api"

interface TimeSeriesAreaChartProps {
  data: TimeSeriesPointDto[]
  color: string
  seriesName: string
  gradientId: string
}

export function TimeSeriesAreaChart({ data, color, seriesName, gradientId }: TimeSeriesAreaChartProps) {
  const chartData = data.map((d) => ({ date: format(new Date(d.date), "MMM d"), count: d.count }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.35} />
            <stop offset="95%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: chartAxis }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={24}
        />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: chartAxis }} tickLine={false} axisLine={false} width={28} />
        <Tooltip content={<ChartTooltip />} />
        <Area
          type="monotone"
          dataKey="count"
          name={seriesName}
          stroke={color}
          fill={`url(#${gradientId})`}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
