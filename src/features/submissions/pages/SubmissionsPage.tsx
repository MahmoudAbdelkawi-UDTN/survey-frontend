import { useMemo, useState } from "react"
import { ErrorState } from "@/components/common/ErrorState"
import { PaginationControls } from "@/components/common/PaginationControls"
import { usePageHeader } from "@/components/layout/usePageHeader"
import { useDebouncedValue } from "@/lib/useDebouncedValue"
import { useSubmissions } from "@/features/submissions/hooks"
import {
  SubmissionsFilters,
  emptySubmissionsFilterState,
  type SubmissionsFilterState,
} from "@/features/submissions/components/SubmissionsFilters"
import { SubmissionsTable } from "@/features/submissions/components/SubmissionsTable"
import type { SubmissionsFilterParams } from "@/types/api"

export default function SubmissionsPage() {
  usePageHeader("Submissions", [{ label: "Submissions" }])

  const [filters, setFilters] = useState<SubmissionsFilterState>(emptySubmissionsFilterState)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [sortBy, setSortBy] = useState("startedAt")
  const [sortDescending, setSortDescending] = useState(true)

  const debouncedSearch = useDebouncedValue(filters.search)

  const params: SubmissionsFilterParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      applicationId: filters.applicationId !== "all" ? filters.applicationId : undefined,
      status: filters.status !== "all" ? (Number(filters.status) as SubmissionsFilterParams["status"]) : undefined,
      isReviewed: filters.isReviewed !== "all" ? filters.isReviewed === "true" : undefined,
      startedFrom: filters.startedFrom || undefined,
      startedTo: filters.startedTo || undefined,
      submittedFrom: filters.submittedFrom || undefined,
      submittedTo: filters.submittedTo || undefined,
      reviewedFrom: filters.reviewedFrom || undefined,
      reviewedTo: filters.reviewedTo || undefined,
      minScore: filters.minScore ? Number(filters.minScore) : undefined,
      maxScore: filters.maxScore ? Number(filters.maxScore) : undefined,
      pageNumber,
      pageSize,
      sortBy,
      sortDescending,
    }),
    [debouncedSearch, filters, pageNumber, pageSize, sortBy, sortDescending]
  )

  const { data, isLoading, isError, refetch, isPlaceholderData } = useSubmissions(params)

  const handleFiltersChange = (next: SubmissionsFilterState) => {
    setFilters(next)
    setPageNumber(1)
  }

  const handleSortChange = (nextSortBy: string, nextSortDescending: boolean) => {
    setSortBy(nextSortBy)
    setSortDescending(nextSortDescending)
    setPageNumber(1)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Review, filter, and search every application submission across all forms.
      </p>

      <SubmissionsFilters value={filters} onChange={handleFiltersChange} />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <div className={isPlaceholderData ? "opacity-60 transition-opacity" : undefined}>
          <SubmissionsTable
            data={data?.items ?? []}
            isLoading={isLoading}
            sortBy={sortBy}
            sortDescending={sortDescending}
            onSortChange={handleSortChange}
          />
        </div>
      )}

      {data && (
        <PaginationControls
          pageNumber={data.pageNumber}
          pageSize={data.pageSize}
          totalPages={data.totalPages}
          totalCount={data.totalCount}
          onPageChange={setPageNumber}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPageNumber(1)
          }}
        />
      )}
    </div>
  )
}
