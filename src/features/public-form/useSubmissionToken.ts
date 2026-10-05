function storageKey(publicToken: string) {
  return `application-review-submission-${publicToken}`
}

export function getStoredSubmissionToken(publicToken: string): string | null {
  try {
    return window.localStorage.getItem(storageKey(publicToken))
  } catch {
    return null
  }
}

export function setStoredSubmissionToken(publicToken: string, submissionToken: string) {
  try {
    window.localStorage.setItem(storageKey(publicToken), submissionToken)
  } catch {
    return
  }
}

export function clearStoredSubmissionToken(publicToken: string) {
  try {
    window.localStorage.removeItem(storageKey(publicToken))
  } catch {
    return
  }
}
