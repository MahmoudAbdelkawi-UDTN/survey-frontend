import { FilterX, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApplications } from "@/features/applications/hooks"
import { SubmissionStatus } from "@/types/api"

export interface SubmissionsFilterState {
  search: string
  applicationId: string
  status: string
  isReviewed: string
  startedFrom: string
  startedTo: string
  submittedFrom: string
  submittedTo: string
  reviewedFrom: string
  reviewedTo: string
  minScore: string
  maxScore: string
}

export const emptySubmissionsFilterState: SubmissionsFilterState = {
  search: "",
  applicationId: "all",
  status: "all",
  isReviewed: "all",
  startedFrom: "",
  startedTo: "",
  submittedFrom: "",
  submittedTo: "",
  reviewedFrom: "",
  reviewedTo: "",
  minScore: "",
  maxScore: "",
}

const statusOptions = [
  { value: String(SubmissionStatus.Draft), label: "Draft" },
  { value: String(SubmissionStatus.Submitted), label: "Submitted" },
  { value: String(SubmissionStatus.UnderReview), label: "Under Review" },
  { value: String(SubmissionStatus.Reviewed), label: "Reviewed" },
]

interface SubmissionsFiltersProps {
  value: SubmissionsFilterState
  onChange: (value: SubmissionsFilterState) => void
}

export function SubmissionsFilters({ value, onChange }: SubmissionsFiltersProps) {
  const { data: applications } = useApplications()

  const set = <K extends keyof SubmissionsFilterState>(key: K, next: SubmissionsFilterState[K]) => {
    onChange({ ...value, [key]: next })
  }

  const hasActiveFilters = JSON.stringify(value) !== JSON.stringify(emptySubmissionsFilterState)

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-52 flex-1">
          <Label className="mb-1.5 text-xs text-muted-foreground">Search</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by application name"
              className="pl-8"
              value={value.search}
              onChange={(e) => set("search", e.target.value)}
            />
          </div>
        </div>

        <div className="w-48">
          <Label className="mb-1.5 text-xs text-muted-foreground">Application</Label>
          <Select
            items={{ all: "All applications", ...Object.fromEntries((applications ?? []).map((app) => [app.id, app.name])) }}
            value={value.applicationId}
            onValueChange={(v) => set("applicationId", v ?? "all")}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All applications</SelectItem>
              {applications?.map((app) => (
                <SelectItem key={app.id} value={app.id}>
                  {app.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-40">
          <Label className="mb-1.5 text-xs text-muted-foreground">Status</Label>
          <Select
            items={{ all: "All statuses", ...Object.fromEntries(statusOptions.map((opt) => [opt.value, opt.label])) }}
            value={value.status}
            onValueChange={(v) => set("status", v ?? "all")}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-40">
          <Label className="mb-1.5 text-xs text-muted-foreground">Reviewed</Label>
          <Select
            items={{ all: "Any", true: "Reviewed", false: "Not reviewed" }}
            value={value.isReviewed}
            onValueChange={(v) => set("isReviewed", v ?? "all")}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="true">Reviewed</SelectItem>
              <SelectItem value="false">Not reviewed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={() => onChange(emptySubmissionsFilterState)}>
            <FilterX className="size-4" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-border/70 pt-3 sm:grid-cols-4 lg:grid-cols-8">
        <DateField label="Started from" value={value.startedFrom} onChange={(v) => set("startedFrom", v)} />
        <DateField label="Started to" value={value.startedTo} onChange={(v) => set("startedTo", v)} />
        <DateField label="Submitted from" value={value.submittedFrom} onChange={(v) => set("submittedFrom", v)} />
        <DateField label="Submitted to" value={value.submittedTo} onChange={(v) => set("submittedTo", v)} />
        <DateField label="Reviewed from" value={value.reviewedFrom} onChange={(v) => set("reviewedFrom", v)} />
        <DateField label="Reviewed to" value={value.reviewedTo} onChange={(v) => set("reviewedTo", v)} />
        <div>
          <Label className="mb-1.5 text-xs text-muted-foreground">Min score %</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={value.minScore}
            onChange={(e) => set("minScore", e.target.value)}
          />
        </div>
        <div>
          <Label className="mb-1.5 text-xs text-muted-foreground">Max score %</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={value.maxScore}
            onChange={(e) => set("maxScore", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="mb-1.5 text-xs text-muted-foreground">{label}</Label>
      <Input type="date" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
