import { format, formatDistanceToNow } from "date-fns"

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—"
  return format(new Date(value), "MMM d, yyyy 'at' h:mm a")
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—"
  return format(new Date(value), "MMM d, yyyy")
}

export function formatRelative(value: string | null | undefined): string {
  if (!value) return "—"
  return formatDistanceToNow(new Date(value), { addSuffix: true })
}

export function formatScore(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—"
  return `${value.toFixed(0)}%`
}

export function shortId(id: string): string {
  return id.slice(0, 8).toUpperCase()
}
