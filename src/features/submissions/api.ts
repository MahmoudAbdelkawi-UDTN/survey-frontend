import { apiClient } from "@/lib/apiClient"
import type {
  PagedSubmissions,
  ReviewAnswerInput,
  SubmissionForReviewDto,
  SubmissionsFilterParams,
} from "@/types/api"

export async function getSubmissions(params: SubmissionsFilterParams) {
  const { data } = await apiClient.get<PagedSubmissions>("/api/submissions", { params })
  return data
}

export async function getSubmissionForReview(id: string) {
  const { data } = await apiClient.get<SubmissionForReviewDto>(`/api/submissions/${id}/review`)
  return data
}

export async function startReview(id: string) {
  await apiClient.post(`/api/submissions/${id}/start-review`)
}

export async function saveReview(id: string, answers: ReviewAnswerInput[]) {
  await apiClient.put(`/api/submissions/${id}/review`, { answers })
}

export async function completeReview(id: string) {
  await apiClient.post(`/api/submissions/${id}/complete-review`)
}
