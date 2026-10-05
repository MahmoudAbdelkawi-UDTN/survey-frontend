import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
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
import { Textarea } from "@/components/ui/textarea"
import { extractErrorMessage } from "@/lib/apiClient"
import { useCreateSection, useUpdateSection } from "@/features/applications/hooks"
import type { SectionDto } from "@/types/api"

const schema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(2000).optional(),
})

type FormValues = z.infer<typeof schema>

interface SectionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  applicationId: string
  section?: SectionDto
}

export function SectionFormDialog({ open, onOpenChange, applicationId, section }: SectionFormDialogProps) {
  const isEdit = !!section
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (open) {
      reset({ name: section?.name ?? "", description: section?.description ?? "" })
    }
  }, [open, section, reset])

  const createMutation = useCreateSection(applicationId)
  const updateMutation = useUpdateSection(applicationId)
  const isPending = createMutation.isPending || updateMutation.isPending

  const onSubmit = (values: FormValues) => {
    const description = values.description?.trim() || null

    if (isEdit && section) {
      updateMutation.mutate(
        { id: section.id, input: { name: values.name, description, isActive: section.isActive } },
        {
          onSuccess: () => {
            toast.success("Section updated")
            onOpenChange(false)
          },
          onError: (err) => toast.error(extractErrorMessage(err)),
        }
      )
    } else {
      createMutation.mutate(
        { name: values.name, description },
        {
          onSuccess: () => {
            toast.success("Section added")
            onOpenChange(false)
          },
          onError: (err) => toast.error(extractErrorMessage(err)),
        }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit section" : "New section"}</DialogTitle>
            <DialogDescription>Each section is one step in the public application form.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="section-name" className="mb-1.5">
                Name
              </Label>
              <Input id="section-name" placeholder="e.g. Team" {...register("name")} />
              <FieldError message={errors.name?.message} />
            </div>
            <div>
              <Label htmlFor="section-description" className="mb-1.5">
                Description
              </Label>
              <Textarea id="section-description" rows={2} {...register("description")} />
              <FieldError message={errors.description?.message} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? "Save changes" : "Add section"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
