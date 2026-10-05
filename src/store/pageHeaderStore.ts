import { create } from "zustand"

export interface Breadcrumb {
  label: string
  href?: string
}

interface PageHeaderState {
  title: string
  breadcrumbs: Breadcrumb[]
  setHeader: (title: string, breadcrumbs?: Breadcrumb[]) => void
}

export const usePageHeaderStore = create<PageHeaderState>((set) => ({
  title: "",
  breadcrumbs: [],
  setHeader: (title, breadcrumbs = []) => set({ title, breadcrumbs }),
}))
