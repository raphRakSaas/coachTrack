import Link from "next/link"
import { ClipboardList, Dumbbell, Layers } from "lucide-react"
import type { MuscleGroup } from "@prisma/client"

import { Badge } from "@/components/ui/badge"
import { MUSCLE_GROUPS } from "@/lib/constants"
import { getExerciseImageUrl } from "@/lib/exercise-images"
import { cn } from "@/lib/utils"

const GROUP_RING: Record<MuscleGroup, string> = {
  CHEST: "ring-rose-500/25 hover:ring-rose-500/40",
  BACK: "ring-sky-500/25 hover:ring-sky-500/40",
  SHOULDERS: "ring-violet-500/25 hover:ring-violet-500/40",
  BICEPS: "ring-emerald-500/25 hover:ring-emerald-500/40",
  TRICEPS: "ring-teal-500/25 hover:ring-teal-500/40",
  LEGS: "ring-amber-500/25 hover:ring-amber-500/40",
  GLUTES: "ring-orange-500/25 hover:ring-orange-500/40",
  ABS: "ring-cyan-500/25 hover:ring-cyan-500/40",
  CARDIO: "ring-red-500/25 hover:ring-red-500/40",
  FULL_BODY: "ring-indigo-500/25 hover:ring-indigo-500/40",
}

function truncate(text: string, max: number): string {
  const trimmed = text.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max).trim()}…`
}

export function ExerciseLibraryCard(props: {
  href: string
  name: string
  description: string | null
  muscleGroup: MuscleGroup
  imageUrl: string | null
  isGlobal: boolean
  programCount: number
  sessionCount: number
}) {
  const resolvedImageUrl = getExerciseImageUrl({
    imageUrl: props.imageUrl,
    muscleGroup: props.muscleGroup,
  })

  const usageTotal = props.programCount + props.sessionCount
  const descriptionPreview = props.description
    ? truncate(props.description, 140)
    : null

  return (
    <Link
      href={props.href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition-all",
        "hover:border-amber-300/60 hover:shadow-md dark:hover:border-amber-700/40",
        "ring-1 ring-transparent",
        GROUP_RING[props.muscleGroup]
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <img
          src={resolvedImageUrl}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          width={640}
          height={400}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent px-3 pb-2 pt-10">
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-white drop-shadow-sm">
            {props.name}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="text-[10px] font-medium">
            {MUSCLE_GROUPS[props.muscleGroup]}
          </Badge>
          {props.isGlobal ? (
            <Badge className="border-amber-200/80 bg-amber-500/15 text-[10px] font-medium text-amber-950 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
              Catalogue
            </Badge>
          ) : (
            <Badge className="border-blue-200/80 bg-blue-500/12 text-[10px] font-medium text-blue-950 dark:border-blue-800 dark:bg-blue-950/45 dark:text-blue-200">
              Personnalisé
            </Badge>
          )}
        </div>

        {descriptionPreview ? (
          <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
            {descriptionPreview}
          </p>
        ) : (
          <p className="text-xs italic text-muted-foreground/80">
            Pas de description — cliquez pour compléter.
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-2 text-[11px] text-muted-foreground">
          <span
            className="inline-flex items-center gap-1"
            title="Nombre de fois où l&apos;exercice apparaît dans vos programmes"
          >
            <ClipboardList className="h-3.5 w-3.5 opacity-70" />
            <span className="font-medium text-foreground">{props.programCount}</span>
            programme{props.programCount !== 1 ? "s" : ""}
          </span>
          <span
            className="inline-flex items-center gap-1"
            title="Nombre de fois enregistré dans des séances"
          >
            <Layers className="h-3.5 w-3.5 opacity-70" />
            <span className="font-medium text-foreground">{props.sessionCount}</span>
            séance{props.sessionCount !== 1 ? "s" : ""}
          </span>
          {usageTotal > 0 && (
            <span className="inline-flex items-center gap-1 text-amber-700/90 dark:text-amber-400/90">
              <Dumbbell className="h-3.5 w-3.5" />
              {usageTotal} utilisation{usageTotal !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
