"use client"

import { useRef, useState, useTransition } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { addMeasurement } from "@/app/dashboard/clients/[id]/actions"

export function MeasurementSheet({
  clientId,
  hasRecordedSensitiveConsent,
}: {
  clientId: string
  hasRecordedSensitiveConsent: boolean
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const today = new Date().toISOString().split("T")[0]

  function handleSubmit(formData: FormData) {
    setFormError(null)
    startTransition(async () => {
      try {
        await addMeasurement(clientId, formData)
        formRef.current?.reset()
        setOpen(false)
      } catch (err) {
        setFormError(
          err instanceof Error ? err.message : "Une erreur est survenue."
        )
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="sm" />}>
        <Plus className="h-4 w-4" />
        Ajouter une mesure
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Nouvelle mesure</SheetTitle>
        </SheetHeader>
        <form
          ref={formRef}
          action={handleSubmit}
          className="flex flex-col gap-4 px-4 py-2"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" defaultValue={today} />
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Les mensurations et le poids peuvent constituer des données
            personnelles sensibles. Ne les enregistrez qu&apos;avec un fondement
            légal adapté.{" "}
            <a
              href="/confidentialite"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-violet-600 underline underline-offset-2"
            >
              Politique de confidentialité
            </a>
          </p>
          {!hasRecordedSensitiveConsent ? (
            <label className="flex cursor-pointer items-start gap-2 text-xs leading-snug text-foreground">
              <input
                type="checkbox"
                name="measurementConsent"
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              <span>
                Je confirme disposer d&apos;un fondement légal pour enregistrer
                ces données sur ce client (obligatoire pour la première saisie).
              </span>
            </label>
          ) : (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
              Fondement légal déjà enregistré pour les données sensibles de ce
              client.
            </p>
          )}
          {formError ? (
            <p className="text-xs font-medium text-red-600">{formError}</p>
          ) : null}

          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Corps
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="weight">Poids (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                min={20}
                max={300}
                placeholder="70"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bodyFat">Masse grasse (%)</Label>
              <Input
                id="bodyFat"
                name="bodyFat"
                type="number"
                step="0.1"
                min={1}
                max={60}
                placeholder="15"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="muscleMass">Masse musculaire (kg)</Label>
              <Input
                id="muscleMass"
                name="muscleMass"
                type="number"
                step="0.1"
                placeholder="55"
              />
            </div>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Mensurations (cm)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="waist">Tour de taille</Label>
              <Input
                id="waist"
                name="waist"
                type="number"
                step="0.5"
                placeholder="80"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="hips">Tour de hanches</Label>
              <Input
                id="hips"
                name="hips"
                type="number"
                step="0.5"
                placeholder="90"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="chest">Tour de poitrine</Label>
              <Input
                id="chest"
                name="chest"
                type="number"
                step="0.5"
                placeholder="95"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="leftArm">Bras gauche</Label>
              <Input
                id="leftArm"
                name="leftArm"
                type="number"
                step="0.5"
                placeholder="32"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rightArm">Bras droit</Label>
              <Input
                id="rightArm"
                name="rightArm"
                type="number"
                step="0.5"
                placeholder="32"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="leftThigh">Cuisse gauche</Label>
              <Input
                id="leftThigh"
                name="leftThigh"
                type="number"
                step="0.5"
                placeholder="52"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rightThigh">Cuisse droite</Label>
              <Input
                id="rightThigh"
                name="rightThigh"
                type="number"
                step="0.5"
                placeholder="52"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" name="notes" placeholder="Observations..." />
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
