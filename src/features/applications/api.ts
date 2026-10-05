import { apiClient } from "@/lib/apiClient"
import type { ApplicationDetailDto, ApplicationListItemDto, QuestionOptionInput, QuestionType } from "@/types/api"

export async function getApplications() {
  const { data } = await apiClient.get<ApplicationListItemDto[]>("/api/applications")
  return data
}

export async function getApplication(id: string) {
  const { data } = await apiClient.get<ApplicationDetailDto>(`/api/applications/${id}`)
  return data
}

export interface ApplicationInput {
  name: string
  description: string | null
}

export async function createApplication(input: ApplicationInput) {
  const { data } = await apiClient.post<string>("/api/applications", input)
  return data
}

export async function updateApplication(id: string, input: ApplicationInput) {
  await apiClient.put(`/api/applications/${id}`, input)
}

export async function setApplicationActive(id: string, isActive: boolean) {
  await apiClient.patch(`/api/applications/${id}/active`, { isActive })
}

export async function deleteApplication(id: string) {
  await apiClient.delete(`/api/applications/${id}`)
}

export interface SectionInput {
  name: string
  description: string | null
}

export async function createSection(applicationId: string, input: SectionInput) {
  const { data } = await apiClient.post<string>(`/api/applications/${applicationId}/sections`, input)
  return data
}

export async function updateSection(id: string, input: SectionInput & { isActive: boolean }) {
  await apiClient.put(`/api/sections/${id}`, input)
}

export async function deleteSection(id: string) {
  await apiClient.delete(`/api/sections/${id}`)
}

export async function reorderSections(applicationId: string, orderedSectionIds: string[]) {
  await apiClient.put(`/api/applications/${applicationId}/sections/reorder`, { orderedSectionIds })
}

export interface QuestionInput {
  questionText: string
  questionType: QuestionType
  weight: number
  options: QuestionOptionInput[]
}

export async function createQuestion(sectionId: string, input: QuestionInput) {
  const { data } = await apiClient.post<string>(`/api/sections/${sectionId}/questions`, input)
  return data
}

export async function updateQuestion(id: string, input: QuestionInput & { isActive: boolean }) {
  await apiClient.put(`/api/questions/${id}`, input)
}

export async function deleteQuestion(id: string) {
  await apiClient.delete(`/api/questions/${id}`)
}

export async function reorderQuestions(sectionId: string, orderedQuestionIds: string[]) {
  await apiClient.put(`/api/sections/${sectionId}/questions/reorder`, { orderedQuestionIds })
}
