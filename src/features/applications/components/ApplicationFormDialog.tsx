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
import { useCreateApplication, useUpdateApplication } from "@/features/applications/hooks"
import type { ApplicationDetailDto, ApplicationListItemDto } from "@/types/api"

const schema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name is too long"),
  description: z.string().max(2000, "Description is too long").optional(),
})

type FormValues = z.infer<typeof schema>

interface ApplicationFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application?: ApplicationListItemDto | ApplicationDetailDto
  onCreated?: (id: string) => void
}

export function ApplicationFormDialog({ open, onOpenChange, application, onCreated }: ApplicationFormDialogProps) {
  const isEdit = !!application
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (open) {
      reset({ name: application?.name ?? "", description: application?.description ?? "" })
    }
  }, [open, application, reset])

  const createMutation = useCreateApplication()
  const updateMutation = useUpdateApplication(application?.id ?? "")
  const isPending = createMutation.isPending || updateMutation.isPending

  const onSubmit = (values: FormValues) => {
    const input = { name: values.name, description: values.description?.trim() || null }

    if (isEdit && application) {
      updateMutation.mutate(input, {
        onSuccess: () => {
          toast.success("Application updated")
          onOpenChange(false)
        },
        onError: (err) => toast.error(extractErrorMessage(err)),
      })
    } else {
      createMutation.mutate(input, {
        onSuccess: (id) => {
          toast.success("Application created")
          onOpenChange(false)
          onCreated?.(id)
        },
        onError: (err) => toast.error(extractErrorMessage(err)),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit application" : "New application"}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the name and description shown to applicants."
                : "Give your application a name. You can add sections and questions next."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="app-name" className="mb-1.5">
                Name
              </Label>
              <Input id="app-name" placeholder="e.g. Startup Accelerator Program" {...register("name")} />
              <FieldError message={errors.name?.message} />
            </div>
            <div>
              <Label htmlFor="app-description" className="mb-1.5">
                Description
              </Label>
              <Textarea
                id="app-description"
                rows={3}
                placeholder="A short description applicants will see"
                {...register("description")}
              />
              <FieldError message={errors.description?.message} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
