import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PublicApplicationDto } from "@/types/api"

interface IntroScreenProps {
  application: PublicApplicationDto
  onStart: () => void
  isStarting: boolean
}

export function IntroScreen({ application, onStart, isStarting }: IntroScreenProps) {
  return (
    <div className="space-y-6 py-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{application.name}</h1>
        {application.description && (
          <p className="mx-auto max-w-xl text-sm text-muted-foreground">{application.description}</p>
        )}
      </div>

      {!application.isActive ? (
        <p className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
          This application is not currently accepting submissions. Please check back later.
        </p>
      ) : (
        <Button size="lg" onClick={onStart} disabled={isStarting}>
          {isStarting && <Loader2 className="size-4 animate-spin" />}
          Start application
        </Button>
      )}
    </div>
  )
}
