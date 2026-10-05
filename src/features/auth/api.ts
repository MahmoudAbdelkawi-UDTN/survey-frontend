import { apiClient } from "@/lib/apiClient"
import type { LoginResultDto } from "@/types/api"

export async function login(email: string, password: string): Promise<LoginResultDto> {
  const { data } = await apiClient.post<LoginResultDto>("/api/auth/login", { email, password })
  return data
}
