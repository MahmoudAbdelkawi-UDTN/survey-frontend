import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { PublicQuestionDto } from "@/types/api"

interface TextQuestionFieldProps {
  question: PublicQuestionDto
  value: string
  onChange: (value: string) => void
}

export function TextQuestionField({ question, value, onChange }: TextQuestionFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={question.id} className="text-sm font-medium leading-relaxed">
        {question.questionText}
      </Label>
      <Textarea
        id={question.id}
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer here…"
      />
    </div>
  )
}
