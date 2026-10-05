import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthUser {
  email: string
  fullName: string
}

interface AuthState {
  token: string | null
  expiresAt: string | null
  user: AuthUser | null
  isAuthenticated: () => boolean
  setSession: (token: string, expiresAt: string, user: AuthUser) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      expiresAt: null,
      user: null,
      isAuthenticated: () => {
        const { token, expiresAt } = get()
        if (!token || !expiresAt) return false
        return new Date(expiresAt).getTime() > Date.now()
      },
      setSession: (token, expiresAt, user) => set({ token, expiresAt, user }),
      clearSession: () => set({ token: null, expiresAt: null, user: null }),
    }),
    { name: "application-review-auth" }
  )
)
