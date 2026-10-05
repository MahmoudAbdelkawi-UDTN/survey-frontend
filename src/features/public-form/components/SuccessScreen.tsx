import { PartyPopper } from "lucide-react"

export function SuccessScreen({ applicationName }: { applicationName: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
        <PartyPopper className="size-8" />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold">Application submitted</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Thank you for applying to {applicationName}. We've received your submission and our team will be in touch
          if there are any updates.
        </p>
      </div>
    </div>
  )
}
