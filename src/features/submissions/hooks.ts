import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as api from "@/features/submissions/api"
import type { ReviewAnswerInput, SubmissionsFilterParams } from "@/types/api"

export const submissionsKeys = {
  list: (params: SubmissionsFilterParams) => ["submissions", params] as const,
  review: (id: string) => ["submissions", id, "review"] as const,
}

export function useSubmissions(params: SubmissionsFilterParams) {
  return useQuery({
    queryKey: submissionsKeys.list(params),
    queryFn: () => api.getSubmissions(params),
    placeholderData: (previous) => previous,
  })
}

export function useSubmissionForReview(id: string | undefined) {
  return useQuery({
    queryKey: submissionsKeys.review(id ?? ""),
    queryFn: () => api.getSubmissionForReview(id as string),
    enabled: !!id,
  })
}

export function useStartReview(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.startReview(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: submissionsKeys.review(id) }),
  })
}

export function useSaveReview(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (answers: ReviewAnswerInput[]) => api.saveReview(id, answers),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: submissionsKeys.review(id) }),
  })
}

export function useCompleteReview(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.completeReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionsKeys.review(id) })
      queryClient.invalidateQueries({ queryKey: ["submissions"] })
    },
  })
}
