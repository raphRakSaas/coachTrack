"use client"

import { useRef, useState, useTransition } from "react"
import { Pencil } from "lucide-react"
import { MuscleGroup } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { updateExercise } from "@/app/dashboard/exercises/actions"
import { MUSCLE_GROUPS } from "@/lib/constants"

type ExerciseInput = {
  id: string
  name: string
  muscleGroup: MuscleGroup
  description: string | null
}

export function EditExerciseSheet({ exercise }: { exercise: ExerciseInput }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>(
    exercise.muscleGroup
  )
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(formData: FormData) {
    formData.set("muscleGroup", muscleGroup)
    startTransition(async () => {
      await updateExercise(exercise.id, formData)
      setOpen(false)
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button
            type="button"
            className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Modifier"
          />
        }
      >
        <Pencil className="h-4 w-4" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Modifier l&apos;exercice</SheetTitle>
        </SheetHeader>
        <form
          ref={formRef}
          action={handleSubmit}
          className="flex flex-col gap-4 px-4 py-2"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              name="name"
              defaultValue={exercise.name}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Groupe musculaire</Label>
            <Select
              value={muscleGroup}
              onValueChange={(v) => v && setMuscleGroup(v as MuscleGroup)}
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
              rows={3}
            />
          </div>
          <SheetFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Enregistrement..." : "Mettre à jour"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
