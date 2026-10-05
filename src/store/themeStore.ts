import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "light" | "dark"

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
}

function systemPrefersDark(): boolean {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  } catch {
    return false
  }
}

const initialTheme: Theme = systemPrefersDark() ? "dark" : "light"
if (typeof document !== "undefined") {
  applyTheme(initialTheme)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: initialTheme,
      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark"
        applyTheme(next)
        set({ theme: next })
      },
    }),
    {
      name: "application-review-theme",
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme)
      },
    }
  )
)
