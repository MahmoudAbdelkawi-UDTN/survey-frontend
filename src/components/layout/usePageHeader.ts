import { useEffect } from "react"
import { usePageHeaderStore, type Breadcrumb } from "@/store/pageHeaderStore"

export function usePageHeader(title: string, breadcrumbs: Breadcrumb[] = []) {
  const setHeader = usePageHeaderStore((s) => s.setHeader)

  useEffect(() => {
    setHeader(title, breadcrumbs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, JSON.stringify(breadcrumbs)])
}
