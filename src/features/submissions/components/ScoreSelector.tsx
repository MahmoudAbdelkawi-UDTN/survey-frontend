import { cn } from "@/lib/utils"

const scores = [0, 1, 2, 3, 4, 5]

export function ScoreSelector({
  value,
  onChange,
}: {
  value: number | null
  onChange: (score: number) => void
}) {
  return (
    <div className="flex gap-1.5">
      {scores.map((score) => (
        <button
          key={score}
          type="button"
          onClick={() => onChange(score)}
          className={cn(
            "flex size-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors",
            value === score
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
          )}
        >
          {score}
        </button>
      ))}
    </div>
  )
}
