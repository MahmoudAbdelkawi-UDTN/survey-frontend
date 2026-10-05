import { useQuery } from "@tanstack/react-query"
import { ClipboardCheck, Loader2 } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { ErrorState } from "@/components/common/ErrorState"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getPublicApplication,
  getSubmissionByToken,
  saveSubmissionAnswers,
  startSubmission,
  submitSubmission,
} from "@/features/public-form/api"
import {
  clearStoredSubmissionToken,
  getStoredSubmissionToken,
  setStoredSubmissionToken,
} from "@/features/public-form/useSubmissionToken"
import { IntroScreen } from "@/features/public-form/components/IntroScreen"
import { MultiChoiceQuestionField } from "@/features/public-form/components/MultiChoiceQuestionField"
import { ReviewStep } from "@/features/public-form/components/ReviewStep"
import { StepperNav } from "@/features/public-form/components/StepperNav"
import { SuccessScreen } from "@/features/public-form/components/SuccessScreen"
import { TextQuestionField } from "@/features/public-form/components/TextQuestionField"
import { QuestionType, SubmissionStatus, type AnswerInput } from "@/types/api"

interface AnswerMap {
  [questionId: string]: { answerText: string; selectedOptionIds: string[] }
}

export default function PublicApplicationPage() {
  const { publicToken = "" } = useParams<{ publicToken: string }>()

  const {
    data: application,
    isLoading: applicationLoading,
    isError: applicationError,
  } = useQuery({
    queryKey: ["public", "application", publicToken],
    queryFn: () => getPublicApplication(publicToken),
    enabled: !!publicToken,
  })

  const [submissionToken, setSubmissionToken] = useState<string | null>(() => getStoredSubmissionToken(publicToken))
  const [isStarting, setIsStarting] = useState(false)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [justSubmitted, setJustSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hydratedRef = useRef(false)

  const {
    data: submissionState,
    isLoading: submissionLoading,
    isError: submissionError,
  } = useQuery({
    queryKey: ["public", "submission", submissionToken],
    queryFn: () => getSubmissionByToken(submissionToken as string),
    enabled: !!submissionToken,
    retry: false,
  })

  useEffect(() => {
    if (submissionError && submissionToken) {
      clearStoredSubmissionToken(publicToken)
      setSubmissionToken(null)
    }
  }, [submissionError, submissionToken, publicToken])

  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    if (submissionState && !hydratedRef.current) {
      hydratedRef.current = true
      const initial: AnswerMap = {}
      for (const answer of submissionState.answers) {
        initial[answer.questionId] = {
          answerText: answer.answerText ?? "",
          selectedOptionIds: answer.selectedOptionIds,
        }
      }
      setAnswers(initial)
      setHasHydrated(true)
    }
  }, [submissionState])

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scheduleSave = (next: AnswerMap) => {
    if (!submissionToken) return
    setSaveStatus("saving")
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const payload: AnswerInput[] = Object.entries(next).map(([questionId, value]) => ({
        questionId,
        answerText: value.answerText || null,
        selectedOptionIds: value.selectedOptionIds,
      }))
      saveSubmissionAnswers(submissionToken, payload)
        .then(() => setSaveStatus("saved"))
        .catch(() => setSaveStatus("idle"))
    }, 700)
  }

  const setTextAnswer = (questionId: string, text: string) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: { answerText: text, selectedOptionIds: [] } }
      scheduleSave(next)
      return next
    })
  }

  const toggleOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: { answerText: "", selectedOptionIds: [optionId] } }
      scheduleSave(next)
      return next
    })
  }

  const handleStart = async () => {
    setIsStarting(true)
    try {
      const result = await startSubmission(publicToken)
      setStoredSubmissionToken(publicToken, result.submissionToken)
      setSubmissionToken(result.submissionToken)
      hydratedRef.current = true
      setHasHydrated(true)
      setAnswers({})
    } catch {
      toast.error("We couldn't start your application. Please try again.")
    } finally {
      setIsStarting(false)
    }
  }

  const handleSubmit = async () => {
    if (!submissionToken) return
    setIsSubmitting(true)
    try {
      await submitSubmission(submissionToken)
      setJustSubmitted(true)
    } catch {
      toast.error("We couldn't submit your application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = useMemo(
    () => [...(application?.sections.map((s) => s.name) ?? []), "Review & Submit"],
    [application]
  )

  const isSectionComplete = (sectionIndex: number) => {
    const section = application?.sections[sectionIndex]
    if (!section) return true
    return section.questions.every((q) => {
      const answer = answers[q.id]
      if (q.questionType === QuestionType.Text) return !!answer?.answerText?.trim()
      return (answer?.selectedOptionIds.length ?? 0) > 0
    })
  }

  if (applicationLoading) {
    return (
      <PublicShell>
        <Skeleton className="h-64 w-full rounded-xl" />
      </PublicShell>
    )
  }

  if (applicationError || !application) {
    return (
      <PublicShell>
        <ErrorState message="This application link is invalid or no longer available." />
      </PublicShell>
    )
  }

  const isLocked = justSubmitted || (submissionState && submissionState.status !== SubmissionStatus.Draft)

  if (isLocked) {
    return (
      <PublicShell>
        <SuccessScreen applicationName={application.name} />
      </PublicShell>
    )
  }

  if (!submissionToken) {
    return (
      <PublicShell>
        <IntroScreen application={application} onStart={handleStart} isStarting={isStarting} />
      </PublicShell>
    )
  }

  if (submissionLoading && !hasHydrated) {
    return (
      <PublicShell>
        <Skeleton className="h-64 w-full rounded-xl" />
      </PublicShell>
    )
  }

  const isReviewStep = currentStep === application.sections.length
  const currentSection = !isReviewStep ? application.sections[currentStep] : null

  return (
    <PublicShell>
      <div className="space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-semibold tracking-tight">{application.name}</h1>
          {application.description && (
            <p className="mx-auto max-w-xl text-sm text-muted-foreground">{application.description}</p>
          )}
        </div>

        <StepperNav steps={steps} currentStep={currentStep} />

        <div className="min-h-72 rounded-xl border border-border bg-card p-5 sm:p-6">
          {isReviewStep ? (
            <ReviewStep application={application} answers={answers} onEditSection={setCurrentStep} />
          ) : (
            currentSection && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold">{currentSection.name}</h2>
                  {currentSection.description && (
                    <p className="text-sm text-muted-foreground">{currentSection.description}</p>
                  )}
                </div>
                <div className="space-y-6">
                  {currentSection.questions.map((question) =>
                    question.questionType === QuestionType.Text ? (
                      <TextQuestionField
                        key={question.id}
                        question={question}
                        value={answers[question.id]?.answerText ?? ""}
                        onChange={(value) => setTextAnswer(question.id, value)}
                      />
                    ) : (
                      <MultiChoiceQuestionField
                        key={question.id}
                        question={question}
                        selectedOptionIds={answers[question.id]?.selectedOptionIds ?? []}
                        onChange={(optionId) => toggleOption(question.id, optionId)}
                      />
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {saveStatus === "saving" && "Saving…"}
            {saveStatus === "saved" && "Saved"}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            >
              Previous
            </Button>
            {isReviewStep ? (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                Submit application
              </Button>
            ) : (
              <Button
                disabled={!isSectionComplete(currentStep)}
                onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </PublicShell>
  )
}

function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-muted/30 px-4 py-8 sm:py-12">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ClipboardCheck className="size-3.5" />
          </div>
          Application Review
        </div>
        {children}
      </div>
    </div>
  )
}
