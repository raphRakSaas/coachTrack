"use client"

import { useRef, useState, useTransition } from "react"
import { MuscleGroup } from "@prisma/client"
import { Copy, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MUSCLE_GROUPS } from "@/lib/constants"
import { getExerciseImageUrl } from "@/lib/exercise-images"
import { updateExercise } from "@/app/dashboard/exercises/actions"
import {
  deleteExerciseAndRedirect,
  duplicateExerciseToMyLibrary,
} from "@/app/dashboard/exercises/[id]/actions"

type ExerciseDetailInput = {
  id: string
  isGlobal: boolean
  name: string
  muscleGroup: MuscleGroup
  description: string | null
  imageUrl: string | null
}

export function ExerciseDetail({ exercise }: { exercise: ExerciseDetailInput }) {
  const [isPending, startTransition] = useTransition()
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>(exercise.muscleGroup)
  const [imageUrl, setImageUrl] = useState<string>(exercise.imageUrl ?? "")
  const formRef = useRef<HTMLFormElement>(null)

  const resolvedImageUrl = getExerciseImageUrl({
    imageUrl: imageUrl || null,
    muscleGroup,
  })

  function handleSubmit(formData: FormData) {
    formData.set("muscleGroup", muscleGroup)
    formData.set("imageUrl", imageUrl)

    startTransition(async () => {
      await updateExercise(exercise.id, formData)
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Aperçu
        </p>
        <div className="mt-3 overflow-hidden rounded-xl ring-1 ring-border">
          <img
            src={resolvedImageUrl}
            alt={exercise.name}
            className="aspect-video w-full object-cover"
            width={900}
            height={506}
          />
        </div>
        <div className="mt-4 space-y-1">
          <p className="text-sm font-semibold text-foreground">{exercise.name}</p>
          <p className="text-xs text-muted-foreground">{MUSCLE_GROUPS[muscleGroup]}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Détails</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {exercise.isGlobal
                ? "Cet exercice est global et ne peut pas être modifié."
                : "Modifiez le nom, la description et l'image."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {exercise.isGlobal ? (
              <form action={duplicateExerciseToMyLibrary.bind(null, exercise.id)}>
                <Button type="submit" variant="secondary" size="sm">
                  <Copy className="h-4 w-4" />
                  Dupliquer
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

        <form
          ref={formRef}
          action={handleSubmit}
          className="mt-6 flex flex-col gap-4"
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
              rows={4}
              disabled={exercise.isGlobal}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="imageUrl">Image (URL)</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://..."
              inputMode="url"
              disabled={exercise.isGlobal}
            />
          </div>

          {!exercise.isGlobal && (
            <Button type="submit" disabled={isPending} className="mt-2 w-full">
              {isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          )}
        </form>
      </div>
    </div>
  )
}

