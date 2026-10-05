import { ListChecks, Type } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScoreSelector } from "@/features/submissions/components/ScoreSelector"
import { QuestionType, type ReviewQuestionDto } from "@/types/api"

interface ReviewQuestionCardProps {
  question: ReviewQuestionDto
  score: number | null
  reviewerNote: string
  onScoreChange: (score: number) => void
  onNoteChange: (note: string) => void
}

export function ReviewQuestionCard({ question, score, reviewerNote, onScoreChange, onNoteChange }: ReviewQuestionCardProps) {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1 text-xs font-normal">
              {question.questionType === QuestionType.Text ? <Type className="size-3" /> : <ListChecks className="size-3" />}
              {question.questionType === QuestionType.Text ? "Text" : "MultiChoice"}
            </Badge>
            <Badge variant="outline" className="text-xs font-normal">
              Weight {question.weight}
            </Badge>
          </div>
          <p className="text-sm font-medium">{question.questionText}</p>
        </div>
        <ScoreSelector value={score} onChange={onScoreChange} />
      </div>

      <div className="rounded-md bg-muted/50 p-3">
        <p className="mb-1 text-xs font-medium text-muted-foreground">Applicant's answer</p>
        {question.questionType === QuestionType.Text ? (
          <p className="whitespace-pre-wrap text-sm">{question.answerText || "No answer provided."}</p>
        ) : question.selectedOptionTexts.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {question.selectedOptionTexts.map((text) => (
              <span key={text} className="rounded-md bg-background px-2 py-1 text-sm">
                {text}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No option selected.</p>
        )}
      </div>

      <div>
        <Label className="mb-1.5 text-xs text-muted-foreground">Reviewer note (optional)</Label>
        <Textarea
          rows={2}
          placeholder="Add a note for this answer"
          value={reviewerNote}
          onChange={(e) => onNoteChange(e.target.value)}
        />
      </div>
    </div>
  )
}
