interface ChartTooltipProps {
  active?: boolean
  label?: string
  payload?: { name: string; value: number | string; color?: string }[]
  valueFormatter?: (value: number | string) => string
}

export function ChartTooltip({ active, label, payload, valueFormatter }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      {label && <p className="mb-1 font-medium text-popover-foreground">{label}</p>}
      <div className="space-y-0.5">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-1.5">
            {entry.color && <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />}
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-popover-foreground">
              {valueFormatter ? valueFormatter(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
