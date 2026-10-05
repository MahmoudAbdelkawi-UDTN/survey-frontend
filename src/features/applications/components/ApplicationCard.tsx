import {
  Copy,
  FileStack,
  HelpCircle,
  Inbox,
  MoreVertical,
  Pencil,
  Power,
  Trash2,
} from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { ActiveBadge } from "@/components/common/StatusBadge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { extractErrorMessage } from "@/lib/apiClient"
import { formatDate } from "@/lib/format"
import { useDeleteApplication, useSetApplicationActive } from "@/features/applications/hooks"
import { ApplicationFormDialog } from "@/features/applications/components/ApplicationFormDialog"
import type { ApplicationListItemDto } from "@/types/api"

export function ApplicationCard({ application }: { application: ApplicationListItemDto }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const setActiveMutation = useSetApplicationActive(application.id)
  const deleteMutation = useDeleteApplication()

  const publicUrl = `${window.location.origin}/apply/${application.publicToken}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(publicUrl)
    toast.success("Public link copied to clipboard")
  }

  return (
    <>
      <Card className="group flex flex-col gap-3 p-5 transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link to={`/applications/${application.id}`} className="line-clamp-1 font-semibold hover:underline">
              {application.name}
            </Link>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {application.description || "No description provided."}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" className="shrink-0" />}>
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="size-4" />
                Edit details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyLink}>
                <Copy className="size-4" />
                Copy public link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveMutation.mutate(!application.isActive)}>
                <Power className="size-4" />
                {application.isActive ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <ActiveBadge isActive={application.isActive} />
          <span className="text-xs text-muted-foreground">Created {formatDate(application.createdAt)}</span>
        </div>

        <div className="mt-1 grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-2.5 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-sm font-semibold">
              <FileStack className="size-3.5 text-muted-foreground" />
              {application.sectionsCount}
            </div>
            <p className="text-[11px] text-muted-foreground">Sections</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-sm font-semibold">
              <HelpCircle className="size-3.5 text-muted-foreground" />
              {application.questionsCount}
            </div>
            <p className="text-[11px] text-muted-foreground">Questions</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-sm font-semibold">
              <Inbox className="size-3.5 text-muted-foreground" />
              {application.submissionsCount}
            </div>
            <p className="text-[11px] text-muted-foreground">Submissions</p>
          </div>
        </div>

        <div className="mt-1 flex gap-2">
          <Button
            render={<Link to={`/applications/${application.id}`} />}
            nativeButton={false}
            size="sm"
            className="flex-1"
          >
            Open builder
          </Button>
          <Button size="sm" variant="outline" onClick={copyLink}>
            <Copy className="size-4" />
          </Button>
        </div>
      </Card>

      <ApplicationFormDialog open={editOpen} onOpenChange={setEditOpen} application={application} />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this application?"
        description="This will hide the application and its public link. Existing submissions are preserved for historical records."
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={() =>
          deleteMutation.mutate(application.id, {
            onSuccess: () => {
              toast.success("Application deleted")
              setDeleteOpen(false)
            },
            onError: (err) => toast.error(extractErrorMessage(err)),
          })
        }
      />
    </>
  )
}
