"use client"

import { useState, useTransition } from "react"

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
import { updateCoachProfile } from "@/app/dashboard/settings/actions"

const SPECIALTIES = [
  "Musculation",
  "Cross-training",
  "Préparation physique",
  "Perte de poids",
  "Nutrition",
  "Pilates",
  "Yoga",
  "Cardio / endurance",
  "Rééducation",
  "Sport sénior",
]

type Defaults = {
  name: string | null
  specialty: string | null
  bio: string | null
  yearsExperience: number | null
}

export function SettingsForm({ defaults }: { defaults: Defaults }) {
  const [isPending, startTransition] = useTransition()
  const [specialty, setSpecialty] = useState<string>(defaults.specialty ?? "")
  const [saved, setSaved] = useState(false)

  function handleSubmit(formData: FormData) {
    if (specialty) formData.set("specialty", specialty)
    startTransition(async () => {
      await updateCoachProfile(formData)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nom complet</Label>
        <Input
          id="name"
          name="name"
          defaultValue={defaults.name ?? ""}
          placeholder="Marc Dupont"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Spécialité</Label>
          <Select
            value={specialty}
            onValueChange={(v) => setSpecialty(v ?? "")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir">
                {specialty || undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SPECIALTIES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="yearsExperience">Années d&apos;expérience</Label>
          <Input
            id="yearsExperience"
            name="yearsExperience"
            type="number"
            min={0}
            max={60}
            defaultValue={defaults.yearsExperience ?? ""}
            placeholder="5"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={defaults.bio ?? ""}
          rows={4}
          placeholder="Présentez-vous en quelques lignes..."
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {saved && (
          <span className="text-sm font-medium text-emerald-600">
            ✓ Enregistré
          </span>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  )
}
