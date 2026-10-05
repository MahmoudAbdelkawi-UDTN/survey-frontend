import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"
import { ErrorState } from "@/components/common/ErrorState"
import { StatusBadge } from "@/components/common/StatusBadge"
import { usePageHeader } from "@/components/layout/usePageHeader"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { extractErrorMessage } from "@/lib/apiClient"
import { formatDateTime, formatScore } from "@/lib/format"
import {
  useCompleteReview,
  useSaveReview,
  useStartReview,
  useSubmissionForReview,
} from "@/features/submissions/hooks"
import { ReviewQuestionCard } from "@/features/submissions/components/ReviewQuestionCard"
import { SubmissionStatus, type ReviewAnswerInput } from "@/types/api"

type AnswerState = Record<string, { score: number | null; reviewerNote: string }>

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>()
  const submissionId = id ?? ""

  const { data: submission, isLoading, isError, refetch } = useSubmissionForReview(submissionId)
  const startReviewMutation = useStartReview(submissionId)
  const saveReviewMutation = useSaveReview(submissionId)
  const completeReviewMutation = useCompleteReview(submissionId)

  usePageHeader(submission ? `Review · ${submission.applicationName}` : "Review", [
    { label: "Submissions", href: "/submissions" },
    { label: "Review" },
  ])

  const startedReviewRef = useRef(false)
  useEffect(() => {
    if (submission?.status === SubmissionStatus.Submitted && !startedReviewRef.current) {
      startedReviewRef.current = true
      startReviewMutation.mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submission?.status])

  const [answers, setAnswers] = useState<AnswerState>({})
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const hydratedRef = useRef(false)

  useEffect(() => {
    if (submission && !hydratedRef.current) {
      hydratedRef.current = true
      const initial: AnswerState = {}
      for (const section of submission.sections) {
        for (const question of section.questions) {
          initial[question.questionId] = { score: question.score, reviewerNote: question.reviewerNote ?? "" }
        }
      }
      setAnswers(initial)
    }
  }, [submission])

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scheduleSave = (next: AnswerState) => {
    setSaveStatus("saving")
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const payload: ReviewAnswerInput[] = Object.entries(next).map(([questionId, value]) => ({
        questionId,
        score: value.score,
        reviewerNote: value.reviewerNote.trim() || null,
      }))
      saveReviewMutation.mutate(payload, {
        onSuccess: () => setSaveStatus("saved"),
        onError: (err) => {
          setSaveStatus("idle")
          toast.error(extractErrorMessage(err))
        },
      })
    }, 800)
  }

  const updateAnswer = (questionId: string, patch: Partial<{ score: number | null; reviewerNote: string }>) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: { ...prev[questionId], ...patch } }
      scheduleSave(next)
      return next
    })
  }

  const allQuestions = useMemo(() => submission?.sections.flatMap((s) => s.questions) ?? [], [submission])
  const missingScoreCount = allQuestions.filter((q) => answers[q.questionId]?.score === null || answers[q.questionId]?.score === undefined).length

  const isUnderReview = submission?.status === SubmissionStatus.UnderReview
  const isReviewed = submission?.status === SubmissionStatus.Reviewed

  const handleCompleteReview = () => {
    completeReviewMutation.mutate(undefined, {
      onSuccess: () => toast.success("Review completed"),
      onError: (err) => toast.error(extractErrorMessage(err)),
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    )
  }

  if (isError || !submission) {
    return <ErrorState message="We couldn't load this submission." onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-6 pb-20">
      <Button
        variant="ghost"
        size="sm"
        render={<Link to="/submissions" />}
        nativeButton={false}
        className="-ml-2 text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to submissions
      </Button>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">{submission.applicationName}</h2>
              <StatusBadge status={submission.status} />
            </div>
            {submission.applicationDescription && (
              <p className="max-w-2xl text-sm text-muted-foreground">{submission.applicationDescription}</p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
              <span>Submitted {formatDateTime(submission.submittedAt)}</span>
              {submission.reviewedAt && <span>Reviewed {formatDateTime(submission.reviewedAt)}</span>}
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs font-medium text-muted-foreground">Final score</p>
            <p className="text-3xl font-bold tabular-nums">{formatScore(submission.finalScore)}</p>
          </div>
        </div>
      </div>

      {submission.status === SubmissionStatus.Draft && (
        <ErrorState message="This submission is still a draft and hasn't been submitted for review yet." />
      )}

      {(isUnderReview || isReviewed || startReviewMutation.isPending) && (
        <div className="space-y-6">
          {submission.sections.map((section) => (
            <div key={section.id} className="space-y-3">
              <div>
                <h3 className="font-semibold">{section.name}</h3>
                {section.description && <p className="text-sm text-muted-foreground">{section.description}</p>}
              </div>
              <div className="space-y-3">
                {section.questions.map((question) => (
                  <ReviewQuestionCard
                    key={question.questionId}
                    question={question}
                    score={answers[question.questionId]?.score ?? null}
                    reviewerNote={answers[question.questionId]?.reviewerNote ?? ""}
                    onScoreChange={(score) => {
                      if (!isUnderReview) return
                      updateAnswer(question.questionId, { score })
                    }}
                    onNoteChange={(note) => {
                      if (!isUnderReview) return
                      updateAnswer(question.questionId, { reviewerNote: note })
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isUnderReview && (
        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
            <p className="text-sm text-muted-foreground">
              {saveStatus === "saving" && "Saving…"}
              {saveStatus === "saved" && "All changes saved"}
              {missingScoreCount > 0 && (
                <span className="ml-2">
                  {missingScoreCount} question{missingScoreCount === 1 ? "" : "s"} still need a score
                </span>
              )}
            </p>
            <Button onClick={handleCompleteReview} disabled={missingScoreCount > 0 || completeReviewMutation.isPending}>
              {completeReviewMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="size-4" />
              )}
              Complete review
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
