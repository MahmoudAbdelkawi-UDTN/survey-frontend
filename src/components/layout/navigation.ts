import { FileStack, LayoutDashboard, ListChecks } from "lucide-react"

export const navigationItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/applications", label: "Applications", icon: FileStack },
  { to: "/submissions", label: "Submissions", icon: ListChecks },
]
