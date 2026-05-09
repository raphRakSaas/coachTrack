"use client"

import Link from "next/link"
import { useRef, useState, useTransition } from "react"
import { MuscleGroup } from "@prisma/client"
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  Copy,
  Layers,
  Library,
  Trash2,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MUSCLE_GROUPS } from "@/lib/constants"
import { SECTION_ACCENTS } from "@/lib/colors"
import { getExerciseImageUrl } from "@/lib/exercise-images"
import { updateExercise } from "@/app/dashboard/exercises/actions"
import {
  deleteExerciseAndRedirect,
  duplicateExerciseToMyLibrary,
} from "@/app/dashboard/exercises/[id]/actions"
import { cn } from "@/lib/utils"

type ExerciseDetailInput = {
  id: string
  isGlobal: boolean
  name: string
  muscleGroup: MuscleGroup
  description: string | null
  imageUrl: string | null
  programUses: number
  sessionUses: number
  sourceExercise: { id: string; name: string } | null
}

export function ExerciseDetail({ exercise }: { exercise: ExerciseDetailInput }) {
  const accent = SECTION_ACCENTS.exercises
  const [isPending, startTransition] = useTransition()
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>(exercise.muscleGroup)
  const [imageUrl, setImageUrl] = useState<string>(exercise.imageUrl ?? "")
  const formRef = useRef<HTMLFormElement>(null)

  const resolvedImageUrl = getExerciseImageUrl({
    imageUrl: imageUrl || null,
    muscleGroup,
  })

  const usageTotal = exercise.programUses + exercise.sessionUses

  function handleSubmit(formData: FormData) {
    formData.set("muscleGroup", muscleGroup)
    formData.set("imageUrl", imageUrl)

    startTransition(async () => {
      await updateExercise(exercise.id, formData)
    })
  }

  return (
    <div className="space-y-8">
      {/* Entête */}
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-3">
          <Link
            href="/dashboard/exercises"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Bibliothèque
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {exercise.name}
            </h1>
            <Badge variant="secondary" className="font-normal">
              {MUSCLE_GROUPS[muscleGroup]}
            </Badge>
            {exercise.isGlobal ? (
              <Badge className="border-amber-200/80 bg-amber-500/15 font-normal text-amber-950 dark:border-amber-800 dark:bg-amber-950/45 dark:text-amber-200">
                <Library className="mr-1 h-3 w-3" />
                Catalogue
              </Badge>
            ) : (
              <Badge className="border-blue-200/80 bg-blue-500/12 font-normal text-blue-950 dark:border-blue-800 dark:bg-blue-950/45 dark:text-blue-200">
                <User className="mr-1 h-3 w-3" />
                Personnalisé
              </Badge>
            )}
          </div>
          {exercise.sourceExercise && (
            <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>Adapté depuis le catalogue :</span>
              <Link
                href={`/dashboard/exercises/${exercise.sourceExercise.id}`}
                className={cn(
                  "font-medium text-amber-700 underline-offset-4 hover:underline",
                  "dark:text-amber-400"
                )}
              >
                {exercise.sourceExercise.name}
              </Link>
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {exercise.isGlobal ? (
            <form action={duplicateExerciseToMyLibrary.bind(null, exercise.id)}>
              <Button type="submit" variant="secondary" size="sm">
                <Copy className="h-4 w-4" />
                Dupliquer dans ma bibliothèque
              </Button>
            </form>
          ) : (
            <form action={deleteExerciseAndRedirect.bind(null, exercise.id)}>
              <Button type="submit" variant="destructive" size="sm">
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Visuel + indicateurs */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-4">
          <div
            className={cn(
              "overflow-hidden rounded-2xl ring-1 shadow-sm",
              accent.border,
              "ring-border"
            )}
          >
            <img
              src={resolvedImageUrl}
              alt=""
              className="aspect-video w-full object-cover"
              width={1100}
              height={619}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div
              className={`rounded-xl border border-border bg-card p-4 ${accent.bgSoft}`}
            >
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <ClipboardList className={`h-4 w-4 ${accent.icon}`} />
                Programmes
              </div>
              <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">
                {exercise.programUses}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                Fiches où cet exercice est prescrit
              </p>
            </div>
            <div
              className={`rounded-xl border border-border bg-card p-4 ${accent.bgSoft}`}
            >
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Layers className={`h-4 w-4 ${accent.icon}`} />
                Séances
              </div>
              <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">
                {exercise.sessionUses}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                Séances réalisées avec ce mouvement
              </p>
            </div>
            <div
              className={`rounded-xl border border-border bg-card p-4 ${accent.bgSoft}`}
            >
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <BookOpen className={`h-4 w-4 ${accent.icon}`} />
                Total
              </div>
              <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">
                {usageTotal}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                Utilisations combinées
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/25 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Consignes & technique
            </p>
            {exercise.description ? (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {exercise.description}
              </p>
            ) : (
              <p className="mt-3 text-sm italic text-muted-foreground">
                Aucune description dans le catalogue. Vous pouvez dupliquer
                l&apos;exercice pour ajouter vos propres consignes.
              </p>
            )}
          </div>
        </div>

        {/* Formulaire */}
        <div className="rounded-xl border border-border bg-card p-5 lg:sticky lg:top-8">
          <div className="mb-5">
            <p className="text-sm font-semibold text-foreground">
              {exercise.isGlobal ? "Catalogue (lecture seule)" : "Modifier"}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {exercise.isGlobal
                ? "Les exercices globaux sont partagés par tous les coachs. Dupliquez pour créer une variante modifiable."
                : "Nom, groupe musculaire, description et image — comme dans vos programmes et séances."}
            </p>
          </div>

          <form
            ref={formRef}
            action={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                name="name"
                defaultValue={exercise.name}
                disabled={exercise.isGlobal}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Groupe musculaire</Label>
              <Select
                value={muscleGroup}
                onValueChange={(value) =>
                  value && setMuscleGroup(value as MuscleGroup)
                }
                disabled={exercise.isGlobal}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>{MUSCLE_GROUPS[muscleGroup]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(MUSCLE_GROUPS) as [MuscleGroup, string][]).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={exercise.description ?? ""}
                rows={5}
                disabled={exercise.isGlobal}
                placeholder="Placement, amplitude, respiration, erreurs fréquentes…"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="imageUrl">Image (URL)</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://…"
                inputMode="url"
                disabled={exercise.isGlobal}
              />
            </div>

            {!exercise.isGlobal && (
              <Button type="submit" disabled={isPending} className="mt-1 w-full">
                {isPending ? "Enregistrement…" : "Enregistrer les modifications"}
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
