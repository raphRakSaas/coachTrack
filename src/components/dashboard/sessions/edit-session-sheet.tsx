"use client"

import { useRef, useState, useTransition } from "react"
import { Pencil } from "lucide-react"

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
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { updateSession } from "@/app/dashboard/sessions/actions"

type SessionInput = {
  id: string
  date: Date | string
  duration: number | null
  notes: string | null
  rpe: number | null
  mood: number | null
  energy: number | null
}

const RPE_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1)
const MOOD_OPTIONS = [
  { value: 1, label: "1 – Épuisé" },
  { value: 2, label: "2 – Fatigué" },
  { value: 3, label: "3 – Neutre" },
  { value: 4, label: "4 – Bien" },
  { value: 5, label: "5 – Excellent" },
]

export function EditSessionSheet({ session }: { session: SessionInput }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const [rpe, setRpe] = useState(session.rpe ? String(session.rpe) : "")
  const [mood, setMood] = useState(session.mood ? String(session.mood) : "")
  const [energy, setEnergy] = useState(
    session.energy ? String(session.energy) : ""
  )

  const isoDate = new Date(session.date).toISOString().split("T")[0]

  function handleSubmit(formData: FormData) {
    if (rpe) formData.set("rpe", rpe)
    else formData.delete("rpe")
    if (mood) formData.set("mood", mood)
    else formData.delete("mood")
    if (energy) formData.set("energy", energy)
    else formData.delete("energy")

    startTransition(async () => {
      await updateSession(session.id, formData)
      setOpen(false)
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="sm" />}>
        <Pencil className="h-4 w-4" />
        Modifier
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Modifier la séance</SheetTitle>
        </SheetHeader>
        <form
          ref={formRef}
          action={handleSubmit}
          className="flex flex-col gap-4 px-4 py-2"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={isoDate}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="duration">Durée (min)</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              min={1}
              max={300}
              defaultValue={session.duration ?? ""}
            />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Ressenti
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>RPE (1-10)</Label>
              <Select value={rpe} onValueChange={(v) => setRpe(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="—">{rpe || undefined}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {RPE_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Humeur</Label>
              <Select value={mood} onValueChange={(v) => setMood(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="—">{mood || undefined}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {MOOD_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={String(o.value)}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Énergie</Label>
              <Select value={energy} onValueChange={(v) => setEnergy(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="—">
                    {energy || undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {MOOD_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={String(o.value)}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={session.notes ?? ""}
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
