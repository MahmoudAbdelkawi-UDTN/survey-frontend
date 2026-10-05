import { FileStack, Plus } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { EmptyState } from "@/components/common/EmptyState"
import { ErrorState } from "@/components/common/ErrorState"
import { usePageHeader } from "@/components/layout/usePageHeader"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useApplications } from "@/features/applications/hooks"
import { ApplicationCard } from "@/features/applications/components/ApplicationCard"
import { ApplicationFormDialog } from "@/features/applications/components/ApplicationFormDialog"

export default function ApplicationsListPage() {
  usePageHeader("Applications", [{ label: "Applications" }])
  const { data, isLoading, isError, refetch } = useApplications()
  const [createOpen, setCreateOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Create and manage application forms, their sections, and questions.
        </p>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          New application
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      )}

      {isError && <ErrorState onRetry={() => refetch()} />}

      {!isLoading && !isError && data && data.length === 0 && (
        <EmptyState
          icon={FileStack}
          title="No applications yet"
          description="Create your first application to start building sections and questions."
          action={
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" />
              New application
            </Button>
          }
        />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}

      <ApplicationFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(id) => navigate(`/applications/${id}`)}
      />
    </div>
  )
}
