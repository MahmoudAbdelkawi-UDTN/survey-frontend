import axios from "axios"
import type { AnswerInput, PublicApplicationDto, StartSubmissionResultDto, SubmissionStateDto } from "@/types/api"

const publicApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5080",
})

export async function getPublicApplication(publicToken: string) {
  const { data } = await publicApiClient.get<PublicApplicationDto>(`/api/public/applications/${publicToken}`)
  return data
}

export async function startSubmission(publicToken: string) {
  const { data } = await publicApiClient.post<StartSubmissionResultDto>(`/api/public/applications/${publicToken}/start`)
  return data
}

export async function getSubmissionByToken(submissionToken: string) {
  const { data } = await publicApiClient.get<SubmissionStateDto>(`/api/public/submissions/${submissionToken}`)
  return data
}

export async function saveSubmissionAnswers(submissionToken: string, answers: AnswerInput[]) {
  await publicApiClient.put(`/api/public/submissions/${submissionToken}/answers`, { answers })
}

export async function submitSubmission(submissionToken: string) {
  await publicApiClient.post(`/api/public/submissions/${submissionToken}/submit`)
}
