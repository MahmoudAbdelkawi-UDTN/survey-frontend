import { ArrowLeft, Copy, ExternalLink, FileStack, Pencil, Plus } from "lucide-react"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"
import { ActiveBadge } from "@/components/common/StatusBadge"
import { EmptyState } from "@/components/common/EmptyState"
import { ErrorState } from "@/components/common/ErrorState"
import { usePageHeader } from "@/components/layout/usePageHeader"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { extractErrorMessage } from "@/lib/apiClient"
import { useApplication, useReorderSections, useSetApplicationActive } from "@/features/applications/hooks"
import { ApplicationFormDialog } from "@/features/applications/components/ApplicationFormDialog"
import { SectionCard } from "@/features/applications/components/SectionCard"
import { SectionFormDialog } from "@/features/applications/components/SectionFormDialog"

export default function ApplicationBuilderPage() {
  const { id } = useParams<{ id: string }>()
  const { data: application, isLoading, isError, refetch } = useApplication(id)

  usePageHeader(application?.name ?? "Application builder", [
    { label: "Applications", href: "/applications" },
    { label: application?.name ?? "Builder" },
  ])

  const [editOpen, setEditOpen] = useState(false)
  const [addSectionOpen, setAddSectionOpen] = useState(false)
  const setActiveMutation = useSetApplicationActive(id ?? "")
  const reorderSectionsMutation = useReorderSections(id ?? "")

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    )
  }

  if (isError || !application) {
    return <ErrorState message="We couldn't load this application." onRetry={() => refetch()} />
  }

  const publicUrl = `${window.location.origin}/apply/${application.publicToken}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(publicUrl)
    toast.success("Public link copied to clipboard")
  }

  const moveSection = (index: number, direction: "up" | "down") => {
    const ids = application.sections.map((s) => s.id)
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= ids.length) return
    ;[ids[index], ids[targetIndex]] = [ids[targetIndex], ids[index]]
    reorderSectionsMutation.mutate(ids, { onError: (err) => toast.error(extractErrorMessage(err)) })
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        render={<Link to="/applications" />}
        nativeButton={false}
        className="-ml-2 text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to applications
      </Button>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">{application.name}</h2>
              <ActiveBadge isActive={application.isActive} />
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {application.description || "No description provided."}
            </p>
            <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
              <span className="truncate">{publicUrl}</span>
              <Button variant="ghost" size="icon-xs" onClick={copyLink}>
                <Copy className="size-3" />
              </Button>
              <a href={publicUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5">
              <span className="text-xs font-medium text-muted-foreground">Accepting submissions</span>
              <Switch
                checked={application.isActive}
                onCheckedChange={(checked) => setActiveMutation.mutate(checked)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              <Pencil className="size-4" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">Sections</h3>
        <Button size="sm" onClick={() => setAddSectionOpen(true)}>
          <Plus className="size-4" />
          Add section
        </Button>
      </div>

      {application.sections.length === 0 ? (
        <EmptyState
          icon={FileStack}
          title="No sections yet"
          description="Sections define each step of your public application form. Add your first one to get started."
          action={
            <Button size="sm" onClick={() => setAddSectionOpen(true)}>
              <Plus className="size-4" />
              Add section
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {application.sections.map((section, index) => (
            <SectionCard
              key={section.id}
              applicationId={application.id}
              section={section}
              index={index}
              canMoveUp={index > 0}
              canMoveDown={index < application.sections.length - 1}
              onMove={(direction) => moveSection(index, direction)}
            />
          ))}
        </div>
      )}

      <ApplicationFormDialog open={editOpen} onOpenChange={setEditOpen} application={application} />
      <SectionFormDialog open={addSectionOpen} onOpenChange={setAddSectionOpen} applicationId={application.id} />
    </div>
  )
}
