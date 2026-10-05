import { Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface StepperNavProps {
  steps: string[]
  currentStep: number
}

export function StepperNav({ steps, currentStep }: StepperNavProps) {
  const progressPercent = ((currentStep + 1) / steps.length) * 100

  return (
    <div>
      <div className="mb-2 flex items-center justify-between sm:hidden">
        <span className="text-sm font-medium">{steps[currentStep]}</span>
        <span className="text-xs text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>
      <Progress value={progressPercent} className="h-1.5 sm:hidden" />

      <ol className="hidden items-center sm:flex">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          return (
            <li key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary text-primary",
                    !isCompleted && !isCurrent && "border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="size-4" /> : index + 1}
                </div>
                <span
                  className={cn(
                    "max-w-20 truncate text-center text-[11px] font-medium",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn("mx-2 h-0.5 flex-1 rounded-full", isCompleted ? "bg-primary" : "bg-border")} />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
