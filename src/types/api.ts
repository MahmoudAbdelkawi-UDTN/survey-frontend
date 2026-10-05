export const QuestionType = {
  Text: 1,
  MultiChoice: 2,
} as const
export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType]

export const SubmissionStatus = {
  Draft: 1,
  Submitted: 2,
  UnderReview: 3,
  Reviewed: 4,
} as const
export type SubmissionStatus = (typeof SubmissionStatus)[keyof typeof SubmissionStatus]

export interface QuestionOptionDto {
  id: string
  text: string
  order: number
}

export interface QuestionDto {
  id: string
  questionText: string
  questionType: QuestionType
  weight: number
  order: number
  isActive: boolean
  options: QuestionOptionDto[]
}

export interface SectionDto {
  id: string
  name: string
  description: string | null
  isActive: boolean
  order: number
  questions: QuestionDto[]
}

export interface ApplicationListItemDto {
  id: string
  name: string
  description: string | null
  isActive: boolean
  publicToken: string
  sectionsCount: number
  questionsCount: number
  submissionsCount: number
  createdAt: string
}

export interface ApplicationDetailDto {
  id: string
  name: string
  description: string | null
  isActive: boolean
  publicToken: string
  createdAt: string
  updatedAt: string | null
  sections: SectionDto[]
}

export interface QuestionOptionInput {
  id: string | null
  text: string
  order: number
}


export interface PublicQuestionOptionDto {
  id: string
  text: string
  order: number
}

export interface PublicQuestionDto {
  id: string
  questionText: string
  questionType: QuestionType
  order: number
  options: PublicQuestionOptionDto[]
}

export interface PublicSectionDto {
  id: string
  name: string
  description: string | null
  order: number
  questions: PublicQuestionDto[]
}

export interface PublicApplicationDto {
  id: string
  name: string
  description: string | null
  isActive: boolean
  sections: PublicSectionDto[]
}

export interface SubmissionAnswerStateDto {
  questionId: string
  answerText: string | null
  selectedOptionIds: string[]
}

export interface StartSubmissionResultDto {
  submissionToken: string
}

export interface SubmissionStateDto {
  submissionToken: string
  applicationPublicToken: string
  status: SubmissionStatus
  startedAt: string
  lastSavedAt: string | null
  submittedAt: string | null
  answers: SubmissionAnswerStateDto[]
}

export interface AnswerInput {
  questionId: string
  answerText: string | null
  selectedOptionIds: string[]
}


export interface SubmissionListItemDto {
  id: string
  applicationId: string
  applicationName: string
  status: SubmissionStatus
  startedAt: string
  submittedAt: string | null
  reviewedAt: string | null
  finalScore: number | null
}

export interface PagedSubmissions {
  items: SubmissionListItemDto[]
  pageNumber: number
  pageSize: number
  totalPages: number
  totalCount: number
}

export interface ReviewQuestionDto {
  questionId: string
  questionText: string
  questionType: QuestionType
  weight: number
  order: number
  answerId: string | null
  answerText: string | null
  selectedOptionTexts: string[]
  score: number | null
  reviewerNote: string | null
}

export interface ReviewSectionDto {
  id: string
  name: string
  description: string | null
  order: number
  questions: ReviewQuestionDto[]
}

export interface SubmissionForReviewDto {
  id: string
  applicationName: string
  applicationDescription: string | null
  status: SubmissionStatus
  startedAt: string
  submittedAt: string | null
  reviewedAt: string | null
  finalScore: number | null
  sections: ReviewSectionDto[]
}

export interface ReviewAnswerInput {
  questionId: string
  score: number | null
  reviewerNote: string | null
}

export interface SubmissionsFilterParams {
  search?: string
  applicationId?: string
  status?: SubmissionStatus
  startedFrom?: string
  startedTo?: string
  submittedFrom?: string
  submittedTo?: string
  reviewedFrom?: string
  reviewedTo?: string
  minScore?: number
  maxScore?: number
  isReviewed?: boolean
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  sortDescending?: boolean
}


export interface DashboardStatsDto {
  totalApplications: number
  activeApplications: number
  totalSections: number
  totalQuestions: number
  totalSubmissions: number
  draftSubmissions: number
  submittedSubmissions: number
  underReviewSubmissions: number
  reviewedSubmissions: number
  pendingReviews: number
  averageFinalScore: number | null
  highestFinalScore: number | null
  lowestFinalScore: number | null
  submissionsToday: number
  submissionsThisWeek: number
  submissionsThisMonth: number
}

export interface TimeSeriesPointDto {
  date: string
  count: number
}

export interface StatusCountDto {
  status: SubmissionStatus
  count: number
}

export interface ApplicationScoreDto {
  applicationName: string
  averageScore: number
}

export interface ScoreBucketDto {
  bucketLabel: string
  count: number
}

export interface ApplicationPerformanceDto {
  applicationName: string
  submissionsCount: number
  reviewedCount: number
  averageScore: number | null
}

export interface DashboardChartsDto {
  submissionActivity: TimeSeriesPointDto[]
  statusDistribution: StatusCountDto[]
  averageScoreByApplication: ApplicationScoreDto[]
  reviewActivity: TimeSeriesPointDto[]
  scoreDistribution: ScoreBucketDto[]
  applicationPerformance: ApplicationPerformanceDto[]
}


export interface LoginResultDto {
  token: string
  expiresAt: string
  email: string
  fullName: string
}
