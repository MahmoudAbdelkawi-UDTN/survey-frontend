import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { login } from "@/features/auth/api"
import { useAuthStore } from "@/store/authStore"

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
    onSuccess: (result) => {
      setSession(result.token, result.expiresAt, { email: result.email, fullName: result.fullName })
      navigate("/", { replace: true })
    },
  })
}
