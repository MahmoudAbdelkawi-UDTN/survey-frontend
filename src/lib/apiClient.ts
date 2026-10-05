import axios from "axios"
import { useAuthStore } from "@/store/authStore"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5080",
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession()
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export interface ApiValidationError {
  identifier: string
  errorMessage: string
}

export function extractErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (data?.errors && typeof data.errors === "object") {
      const firstKey = Object.keys(data.errors)[0]
      const firstMessage = data.errors[firstKey]?.[0]
      if (firstMessage) return firstMessage
    }
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors[0]
    }
    if (typeof data?.detail === "string" && data.detail.length < 300) return data.detail
    if (typeof data?.title === "string") return data.title
  }
  return fallback
}
