import { ArrowDown, ArrowUp, ListChecks, Pencil, Trash2, Type } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { extractErrorMessage } from "@/lib/apiClient"
import { useDeleteQuestion } from "@/features/applications/hooks"
import { QuestionFormDialog } from "@/features/applications/components/QuestionFormDialog"
import { QuestionType, type QuestionDto } from "@/types/api"

interface QuestionRowProps {
  applicationId: string
  sectionId: string
  question: QuestionDto
  canMoveUp: boolean
  canMoveDown: boolean
  onMove: (direction: "up" | "down") => void
}

export function QuestionRow({ applicationId, sectionId, question, canMoveUp, canMoveDown, onMove }: QuestionRowProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const deleteMutation = useDeleteQuestion(applicationId)

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/70 bg-card p-3">
      <div className="flex flex-col gap-0.5 pt-0.5">
        <Button variant="ghost" size="icon-xs" disabled={!canMoveUp} onClick={() => onMove("up")}>
          <ArrowUp className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon-xs" disabled={!canMoveDown} onClick={() => onMove("down")}>
          <ArrowDown className="size-3.5" />
        </Button>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1 text-xs font-normal">
            {question.questionType === QuestionType.Text ? <Type className="size-3" /> : <ListChecks className="size-3" />}
            {question.questionType === QuestionType.Text ? "Text" : "MultiChoice"}
          </Badge>
          <Badge variant="outline" className="text-xs font-normal">
            Weight {question.weight}
          </Badge>
          {!question.isActive && (
            <Badge variant="outline" className="bg-muted text-xs font-normal text-muted-foreground">
              Inactive
            </Badge>
          )}
        </div>
        <p className="mt-1.5 text-sm">{question.questionText}</p>
        {question.questionType === QuestionType.MultiChoice && question.options.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {question.options.map((option) => (
              <span key={option.id} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {option.text}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex shrink-0 gap-1">
        <Button variant="ghost" size="icon-sm" onClick={() => setEditOpen(true)}>
          <Pencil className="size-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="size-4 text-muted-foreground" />
        </Button>
      </div>

      <QuestionFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        applicationId={applicationId}
        sectionId={sectionId}
        question={question}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this question?"
        description="This question will no longer appear on the public form. Past submitted answers are preserved."
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={() =>
          deleteMutation.mutate(question.id, {
            onSuccess: () => {
              toast.success("Question deleted")
              setDeleteOpen(false)
            },
            onError: (err) => toast.error(extractErrorMessage(err)),
          })
        }
      />
    </div>
  )
}
