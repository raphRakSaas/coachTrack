"use client"

import { useRef, useState, useTransition } from "react"
import { Plus } from "lucide-react"
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
import { createExercise } from "@/app/dashboard/exercises/actions"
import { MUSCLE_GROUPS } from "@/lib/constants"

export function ExerciseSheet() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>("CHEST")
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(formData: FormData) {
    formData.set("muscleGroup", muscleGroup)
    startTransition(async () => {
      await createExercise(formData)
      formRef.current?.reset()
      setMuscleGroup("CHEST")
      setOpen(false)
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button />}>
        <Plus />
        Ajouter un exercice
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Nouvel exercice</SheetTitle>
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
              placeholder="Développé couché"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Groupe musculaire</Label>
            <Select
              value={muscleGroup}
              onValueChange={(v) => setMuscleGroup(v as MuscleGroup)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
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
            <Label htmlFor="description">
              Description{" "}
              <span className="text-muted-foreground">(optionnel)</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Instructions ou conseils..."
              rows={3}
            />
          </div>
          <SheetFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
