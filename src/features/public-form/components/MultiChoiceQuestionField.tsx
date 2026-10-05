import { Check } from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { PublicQuestionDto } from "@/types/api"

interface MultiChoiceQuestionFieldProps {
  question: PublicQuestionDto
  selectedOptionIds: string[]
  onChange: (optionId: string) => void
}

export function MultiChoiceQuestionField({ question, selectedOptionIds, onChange }: MultiChoiceQuestionFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium leading-relaxed">{question.questionText}</Label>
      <div className="grid gap-2 sm:grid-cols-2">
        {question.options.map((option) => {
          const isSelected = selectedOptionIds.includes(option.id)
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={cn(
                "flex items-center justify-between gap-2 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                isSelected
                  ? "border-primary bg-primary/5 font-medium text-foreground"
                  : "border-border bg-background text-foreground hover:border-primary/40"
              )}
            >
              {option.text}
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border",
                  isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border"
                )}
              >
                {isSelected && <Check className="size-3.5" />}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
