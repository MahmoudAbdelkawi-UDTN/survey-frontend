import { ArrowDown, ArrowUp, ChevronDown, Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { ActiveBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { extractErrorMessage } from "@/lib/apiClient"
import { useDeleteSection, useReorderQuestions } from "@/features/applications/hooks"
import { QuestionFormDialog } from "@/features/applications/components/QuestionFormDialog"
import { QuestionRow } from "@/features/applications/components/QuestionRow"
import { SectionFormDialog } from "@/features/applications/components/SectionFormDialog"
import type { SectionDto } from "@/types/api"

interface SectionCardProps {
  applicationId: string
  section: SectionDto
  index: number
  canMoveUp: boolean
  canMoveDown: boolean
  onMove: (direction: "up" | "down") => void
}

export function SectionCard({ applicationId, section, index, canMoveUp, canMoveDown, onMove }: SectionCardProps) {
  const [open, setOpen] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [addQuestionOpen, setAddQuestionOpen] = useState(false)

  const deleteMutation = useDeleteSection(applicationId)
  const reorderQuestionsMutation = useReorderQuestions(applicationId)

  const moveQuestion = (questionIndex: number, direction: "up" | "down") => {
    const ids = section.questions.map((q) => q.id)
    const targetIndex = direction === "up" ? questionIndex - 1 : questionIndex + 1
    if (targetIndex < 0 || targetIndex >= ids.length) return
    ;[ids[questionIndex], ids[targetIndex]] = [ids[targetIndex], ids[questionIndex]]
    reorderQuestionsMutation.mutate(
      { sectionId: section.id, orderedQuestionIds: ids },
      { onError: (err) => toast.error(extractErrorMessage(err)) }
    )
  }

  return (
    <Card className="overflow-hidden p-0">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-start gap-3 p-4">
          <div className="flex flex-col gap-0.5 pt-0.5">
            <Button variant="ghost" size="icon-xs" disabled={!canMoveUp} onClick={() => onMove("up")}>
              <ArrowUp className="size-3.5" />
            </Button>
            <Button variant="ghost" size="icon-xs" disabled={!canMoveDown} onClick={() => onMove("down")}>
              <ArrowDown className="size-3.5" />
            </Button>
          </div>

          <CollapsibleTrigger className="flex min-w-0 flex-1 items-start gap-2 text-left">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                  <h3 className="font-semibold">{section.name}</h3>
                  <ActiveBadge isActive={section.isActive} />
                  <span className="text-xs text-muted-foreground">
                    {section.questions.length} question{section.questions.length === 1 ? "" : "s"}
                  </span>
                </div>
                {section.description && <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>}
              </div>
              <ChevronDown className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
          </CollapsibleTrigger>

          <div className="flex shrink-0 gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => setEditOpen(true)}>
              <Pencil className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="size-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        <CollapsibleContent>
          <div className="space-y-2 border-t border-border/70 bg-muted/20 p-4">
            {section.questions.map((question, qIndex) => (
              <QuestionRow
                key={question.id}
                applicationId={applicationId}
                sectionId={section.id}
                question={question}
                canMoveUp={qIndex > 0}
                canMoveDown={qIndex < section.questions.length - 1}
                onMove={(direction) => moveQuestion(qIndex, direction)}
              />
            ))}

            <Button variant="outline" size="sm" className="w-full" onClick={() => setAddQuestionOpen(true)}>
              <Plus className="size-4" />
              Add question
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <SectionFormDialog open={editOpen} onOpenChange={setEditOpen} applicationId={applicationId} section={section} />

      <QuestionFormDialog
        open={addQuestionOpen}
        onOpenChange={setAddQuestionOpen}
        applicationId={applicationId}
        sectionId={section.id}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this section?"
        description="This section and its questions will no longer appear on the public form. Past submitted answers are preserved."
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={() =>
          deleteMutation.mutate(section.id, {
            onSuccess: () => {
              toast.success("Section deleted")
              setDeleteOpen(false)
            },
            onError: (err) => toast.error(extractErrorMessage(err)),
          })
        }
      />
    </Card>
  )
}
