import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight, Inbox } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { EmptyState } from "@/components/common/EmptyState"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { formatDateTime, formatScore, shortId } from "@/lib/format"
import type { SubmissionListItemDto } from "@/types/api"

interface SubmissionsTableProps {
  data: SubmissionListItemDto[]
  isLoading: boolean
  sortBy: string
  sortDescending: boolean
  onSortChange: (sortBy: string, sortDescending: boolean) => void
}

interface ColumnDef {
  id: string
  header: string
  sortable?: boolean
  cell: (row: SubmissionListItemDto) => React.ReactNode
}

const columns: ColumnDef[] = [
  { id: "reference", header: "Reference", cell: (row) => <span className="font-mono text-xs">{shortId(row.id)}</span> },
  { id: "applicationName", header: "Application", cell: (row) => <span className="font-medium">{row.applicationName}</span> },
  { id: "status", header: "Status", sortable: true, cell: (row) => <StatusBadge status={row.status} /> },
  { id: "startedAt", header: "Started", sortable: true, cell: (row) => formatDateTime(row.startedAt) },
  { id: "submittedAt", header: "Submitted", sortable: true, cell: (row) => formatDateTime(row.submittedAt) },
  { id: "reviewedAt", header: "Reviewed", sortable: true, cell: (row) => formatDateTime(row.reviewedAt) },
  {
    id: "finalScore",
    header: "Final score",
    sortable: true,
    cell: (row) => <span className="font-medium">{formatScore(row.finalScore)}</span>,
  },
]

export function SubmissionsTable({ data, isLoading, sortBy, sortDescending, onSortChange }: SubmissionsTableProps) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return <EmptyState icon={Inbox} title="No submissions found" description="Try adjusting your filters." />
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => {
              const isActive = sortBy === column.id
              return (
                <TableHead key={column.id}>
                  {column.sortable ? (
                    <button
                      type="button"
                      className={cn(
                        "flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground",
                        isActive && "text-foreground"
                      )}
                      onClick={() => onSortChange(column.id, isActive ? !sortDescending : true)}
                    >
                      {column.header}
                      {isActive ? (
                        sortDescending ? (
                          <ArrowDown className="size-3.5" />
                        ) : (
                          <ArrowUp className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 opacity-40" />
                      )}
                    </button>
                  ) : (
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {column.header}
                    </span>
                  )}
                </TableHead>
              )
            })}
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id} className="cursor-pointer" onClick={() => navigate(`/submissions/${row.id}/review`)}>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.cell(row)}</TableCell>
              ))}
              <TableCell className="w-8">
                <ChevronRight className="size-4 text-muted-foreground" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
