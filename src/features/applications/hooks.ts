import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as api from "@/features/applications/api"

export const applicationsKeys = {
  all: ["applications"] as const,
  detail: (id: string) => ["applications", id] as const,
}

export function useApplications() {
  return useQuery({ queryKey: applicationsKeys.all, queryFn: api.getApplications })
}

export function useApplication(id: string | undefined) {
  return useQuery({
    queryKey: applicationsKeys.detail(id ?? ""),
    queryFn: () => api.getApplication(id as string),
    enabled: !!id,
  })
}

function useInvalidateApplication(id?: string) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: applicationsKeys.all })
    if (id) queryClient.invalidateQueries({ queryKey: applicationsKeys.detail(id) })
  }
}

export function useCreateApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.createApplication,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: applicationsKeys.all }),
  })
}

export function useUpdateApplication(id: string) {
  const invalidate = useInvalidateApplication(id)
  return useMutation({
    mutationFn: (input: api.ApplicationInput) => api.updateApplication(id, input),
    onSuccess: invalidate,
  })
}

export function useSetApplicationActive(id: string) {
  const invalidate = useInvalidateApplication(id)
  return useMutation({
    mutationFn: (isActive: boolean) => api.setApplicationActive(id, isActive),
    onSuccess: invalidate,
  })
}

export function useDeleteApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.deleteApplication,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: applicationsKeys.all }),
  })
}

export function useCreateSection(applicationId: string) {
  const invalidate = useInvalidateApplication(applicationId)
  return useMutation({
    mutationFn: (input: api.SectionInput) => api.createSection(applicationId, input),
    onSuccess: invalidate,
  })
}

export function useUpdateSection(applicationId: string) {
  const invalidate = useInvalidateApplication(applicationId)
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: api.SectionInput & { isActive: boolean } }) =>
      api.updateSection(id, input),
    onSuccess: invalidate,
  })
}

export function useDeleteSection(applicationId: string) {
  const invalidate = useInvalidateApplication(applicationId)
  return useMutation({
    mutationFn: (id: string) => api.deleteSection(id),
    onSuccess: invalidate,
  })
}

export function useReorderSections(applicationId: string) {
  const invalidate = useInvalidateApplication(applicationId)
  return useMutation({
    mutationFn: (orderedSectionIds: string[]) => api.reorderSections(applicationId, orderedSectionIds),
    onSuccess: invalidate,
  })
}

export function useCreateQuestion(applicationId: string) {
  const invalidate = useInvalidateApplication(applicationId)
  return useMutation({
    mutationFn: ({ sectionId, input }: { sectionId: string; input: api.QuestionInput }) =>
      api.createQuestion(sectionId, input),
    onSuccess: invalidate,
  })
}

export function useUpdateQuestion(applicationId: string) {
  const invalidate = useInvalidateApplication(applicationId)
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: api.QuestionInput & { isActive: boolean } }) =>
      api.updateQuestion(id, input),
    onSuccess: invalidate,
  })
}

export function useDeleteQuestion(applicationId: string) {
  const invalidate = useInvalidateApplication(applicationId)
  return useMutation({
    mutationFn: (id: string) => api.deleteQuestion(id),
    onSuccess: invalidate,
  })
}

export function useReorderQuestions(applicationId: string) {
  const invalidate = useInvalidateApplication(applicationId)
  return useMutation({
    mutationFn: ({ sectionId, orderedQuestionIds }: { sectionId: string; orderedQuestionIds: string[] }) =>
      api.reorderQuestions(sectionId, orderedQuestionIds),
    onSuccess: invalidate,
  })
}
