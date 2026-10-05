import { Navigate, Route, Routes } from "react-router-dom"
import { ProtectedRoute } from "@/app/ProtectedRoute"
import NotFoundPage from "@/app/NotFoundPage"
import { PortalLayout } from "@/components/layout/PortalLayout"
import LoginPage from "@/features/auth/LoginPage"
import DashboardPage from "@/features/dashboard/DashboardPage"
import ApplicationsListPage from "@/features/applications/pages/ApplicationsListPage"
import ApplicationBuilderPage from "@/features/applications/pages/ApplicationBuilderPage"
import SubmissionsPage from "@/features/submissions/pages/SubmissionsPage"
import ReviewPage from "@/features/submissions/pages/ReviewPage"
import PublicApplicationPage from "@/features/public-form/PublicApplicationPage"

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/apply/:publicToken" element={<PublicApplicationPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<PortalLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/applications" element={<ApplicationsListPage />} />
          <Route path="/applications/:id" element={<ApplicationBuilderPage />} />
          <Route path="/submissions" element={<SubmissionsPage />} />
          <Route path="/submissions/:id/review" element={<ReviewPage />} />
        </Route>
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
