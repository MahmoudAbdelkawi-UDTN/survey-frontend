import { zodResolver } from "@hookform/resolvers/zod"
import { ClipboardCheck, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FieldError } from "@/components/form/FieldError"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { extractErrorMessage } from "@/lib/apiClient"
import { useLogin } from "@/features/auth/hooks"

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const loginMutation = useLogin()

  const onSubmit = (values: FormValues) => {
    loginMutation.mutate(values)
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ClipboardCheck className="size-5" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Application Review</h1>
          <p className="text-sm text-muted-foreground">Sign in to the reviewer portal</p>
        </div>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div>
                <Label htmlFor="email" className="mb-1.5">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@applicationreview.dev"
                  {...register("email")}
                />
                <FieldError message={errors.email?.message} />
              </div>

              <div>
                <Label htmlFor="password" className="mb-1.5">
                  Password
                </Label>
                <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
                <FieldError message={errors.password?.message} />
              </div>

              {loginMutation.isError && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {extractErrorMessage(loginMutation.error, "Invalid email or password.")}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending && <Loader2 className="size-4 animate-spin" />}
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
