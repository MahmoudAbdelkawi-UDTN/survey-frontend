import { apiClient } from "@/lib/apiClient"
import type { DashboardChartsDto, DashboardStatsDto } from "@/types/api"

export async function getDashboardStats() {
  const { data } = await apiClient.get<DashboardStatsDto>("/api/dashboard/stats")
  return data
}

export async function getDashboardCharts() {
  const { data } = await apiClient.get<DashboardChartsDto>("/api/dashboard/charts")
  return data
}
