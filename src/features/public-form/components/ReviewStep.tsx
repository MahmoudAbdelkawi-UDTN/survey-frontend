import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QuestionType, type PublicApplicationDto } from "@/types/api"

interface AnswerMap {
  [questionId: string]: { answerText: string; selectedOptionIds: string[] }
}

interface ReviewStepProps {
  application: PublicApplicationDto
  answers: AnswerMap
  onEditSection: (sectionIndex: number) => void
}

export function ReviewStep({ application, answers, onEditSection }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Review your answers</h2>
        <p className="text-sm text-muted-foreground">Make sure everything looks right before submitting.</p>
      </div>

      {application.sections.map((section, sectionIndex) => (
        <div key={section.id} className="space-y-3 rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{section.name}</h3>
            <Button variant="ghost" size="sm" onClick={() => onEditSection(sectionIndex)}>
              <Pencil className="size-3.5" />
              Edit
            </Button>
          </div>
          <div className="space-y-3">
            {section.questions.map((question) => {
              const answer = answers[question.id]
              return (
                <div key={question.id} className="text-sm">
                  <p className="font-medium text-muted-foreground">{question.questionText}</p>
                  {question.questionType === QuestionType.Text ? (
                    <p className="mt-0.5 whitespace-pre-wrap">{answer?.answerText || "No answer provided"}</p>
                  ) : (
                    <p className="mt-0.5">
                      {question.options.find((o) => answer?.selectedOptionIds.includes(o.id))?.text ||
                        "No option selected"}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
