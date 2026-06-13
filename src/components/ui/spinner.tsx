import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

export function Spinner({
  className,
  label = "Chargement…",
}: {
  className?: string
  label?: string
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  )
}
