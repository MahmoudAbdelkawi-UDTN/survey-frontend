import { zodResolver } from "@hookform/resolvers/zod"
import { GripVertical, Loader2, Plus, Trash2 } from "lucide-react"
import { useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { FieldError } from "@/components/form/FieldError"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { extractErrorMessage } from "@/lib/apiClient"
import { useCreateQuestion, useUpdateQuestion } from "@/features/applications/hooks"
import { QuestionType, type QuestionDto } from "@/types/api"

const optionSchema = z.object({
  id: z.string().nullable(),
  text: z.string().min(1, "Option text is required").max(300),
})

const schema = z
  .object({
    questionText: z.string().min(1, "Question text is required").max(1000),
    questionType: z.nativeEnum(QuestionType),
    weight: z.coerce.number().int().min(1, "Min 1").max(10, "Max 10"),
    isActive: z.boolean(),
    options: z.array(optionSchema),
  })
  .refine((data) => data.questionType !== QuestionType.MultiChoice || data.options.length >= 2, {
    message: "MultiChoice questions need at least two options",
    path: ["options"],
  })

type FormValues = z.infer<typeof schema>

interface QuestionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  applicationId: string
  sectionId: string
  question?: QuestionDto
}

export function QuestionFormDialog({ open, onOpenChange, applicationId, sectionId, question }: QuestionFormDialogProps) {
  const isEdit = !!question

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { questionType: QuestionType.Text, weight: 1, isActive: true, options: [] },
  })

  const { fields, append, remove } = useFieldArray({ control, name: "options" })
  const questionType = watch("questionType")

  useEffect(() => {
    if (open) {
      reset({
        questionText: question?.questionText ?? "",
        questionType: question?.questionType ?? QuestionType.Text,
        weight: question?.weight ?? 1,
        isActive: question?.isActive ?? true,
        options: question?.options?.map((o) => ({ id: o.id, text: o.text })) ?? [],
      })
    }
  }, [open, question, reset])

  const createMutation = useCreateQuestion(applicationId)
  const updateMutation = useUpdateQuestion(applicationId)
  const isPending = createMutation.isPending || updateMutation.isPending

  const onSubmit = (values: FormValues) => {
    const options = values.questionType === QuestionType.MultiChoice
      ? values.options.map((o, index) => ({ id: o.id, text: o.text, order: index }))
      : []

    if (isEdit && question) {
      updateMutation.mutate(
        { id: question.id, input: { questionText: values.questionText, questionType: values.questionType, weight: values.weight, isActive: values.isActive, options } },
        {
          onSuccess: () => {
            toast.success("Question updated")
            onOpenChange(false)
          },
          onError: (err) => toast.error(extractErrorMessage(err)),
        }
      )
    } else {
      createMutation.mutate(
        { sectionId, input: { questionText: values.questionText, questionType: values.questionType, weight: values.weight, options } },
        {
          onSuccess: () => {
            toast.success("Question added")
            onOpenChange(false)
          },
          onError: (err) => toast.error(extractErrorMessage(err)),
        }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit question" : "New question"}</DialogTitle>
            <DialogDescription>
              Text questions collect free-form answers. MultiChoice questions let applicants pick one option.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] space-y-4 overflow-y-auto py-4 pr-1">
            <div>
              <Label htmlFor="question-text" className="mb-1.5">
                Question text
              </Label>
              <Textarea id="question-text" rows={2} {...register("questionText")} />
              <FieldError message={errors.questionText?.message} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5">Question type</Label>
                <Select
                  items={{ [String(QuestionType.Text)]: "Text", [String(QuestionType.MultiChoice)]: "MultiChoice" }}
                  value={String(watch("questionType"))}
                  onValueChange={(value) => {
                    const nextType = Number(value) as QuestionType
                    reset((prev) => ({
                      ...prev,
                      questionType: nextType,
                      options: nextType === QuestionType.MultiChoice && prev.options.length === 0
                        ? [{ id: null, text: "" }, { id: null, text: "" }]
                        : prev.options,
                    }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={String(QuestionType.Text)}>Text</SelectItem>
                    <SelectItem value={String(QuestionType.MultiChoice)}>MultiChoice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="question-weight" className="mb-1.5">
                  Weight (1-10)
                </Label>
                <Input id="question-weight" type="number" min={1} max={10} {...register("weight")} />
                <FieldError message={errors.weight?.message} />
              </div>
            </div>

            {isEdit && (
              <div>
                <Label className="mb-1.5">Status</Label>
                <RadioGroup
                  value={watch("isActive") ? "active" : "inactive"}
                  onValueChange={(value) => reset((prev) => ({ ...prev, isActive: value === "active" }))}
                  className="flex gap-4"
                >
                  <label className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value="active" /> Active
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value="inactive" /> Inactive
                  </label>
                </RadioGroup>
              </div>
            )}

            {questionType === QuestionType.MultiChoice && (
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <Label>Options</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => append({ id: null, text: "" })}
                  >
                    <Plus className="size-3.5" />
                    Add option
                  </Button>
                </div>
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <GripVertical className="size-4 shrink-0 text-muted-foreground" />
                      <Input placeholder={`Option ${index + 1}`} {...register(`options.${index}.text` as const)} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 2}
                      >
                        <Trash2 className="size-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
                <FieldError message={errors.options?.message ?? errors.options?.root?.message} />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? "Save changes" : "Add question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
