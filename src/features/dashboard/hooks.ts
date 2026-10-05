import { useQuery } from "@tanstack/react-query"
import { getDashboardCharts, getDashboardStats } from "@/features/dashboard/api"

export function useDashboardStats() {
  return useQuery({ queryKey: ["dashboard", "stats"], queryFn: getDashboardStats })
}

export function useDashboardCharts() {
  return useQuery({ queryKey: ["dashboard", "charts"], queryFn: getDashboardCharts })
}
