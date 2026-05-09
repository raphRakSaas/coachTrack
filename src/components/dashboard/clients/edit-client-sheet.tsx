"use client"

import { useRef, useState, useTransition } from "react"
import { Pencil } from "lucide-react"
import { FitnessLevel, GoalType, Gender } from "@prisma/client"

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
import { updateClient } from "@/app/dashboard/clients/[id]/actions"
import {
  GENDER_LABELS,
  FITNESS_LEVEL_LABELS,
  GOAL_TYPE_LABELS,
  COUNTRY_CODES,
} from "@/lib/constants"

type ClientInput = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  phoneCountryCode: string | null
  gender: Gender | null
  birthDate: Date | string | null
  height: number | null
  fitnessLevel: FitnessLevel
  weeklyFrequency: number | null
  goalType: GoalType | null
  goal: string | null
  goalTargetWeight: number | null
  goalDeadline: Date | string | null
  injuries: string | null
  medicalNotes: string | null
  sensitiveDataConsentAt: Date | string | null
  isActive: boolean
}

function isoDate(d: Date | string | null) {
  if (!d) return ""
  return new Date(d).toISOString().split("T")[0]
}

export function EditClientSheet({ client }: { client: ClientInput }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [gender, setGender] = useState<string>(client.gender ?? "")
  const [fitnessLevel, setFitnessLevel] = useState<string>(client.fitnessLevel)
  const [goalType, setGoalType] = useState<string>(client.goalType ?? "")
  const [countryCode, setCountryCode] = useState<string>(
    client.phoneCountryCode ?? "+33"
  )
  const [isActive, setIsActive] = useState(client.isActive)

  function handleSubmit(formData: FormData) {
    setFormError(null)
    if (gender) formData.set("gender", gender)
    formData.set("fitnessLevel", fitnessLevel)
    if (goalType) formData.set("goalType", goalType)
    formData.set("phoneCountryCode", countryCode)
    formData.set("isActive", isActive ? "true" : "false")

    startTransition(async () => {
      try {
        await updateClient(client.id, formData)
        setOpen(false)
      } catch (err) {
        setFormError(
          err instanceof Error ? err.message : "Une erreur est survenue."
        )
      }
    })
  }

  const consentRecordedAt = client.sensitiveDataConsentAt
    ? new Date(client.sensitiveDataConsentAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode)
  const selectedGender = gender ? GENDER_LABELS[gender] : undefined
  const selectedLevel = FITNESS_LEVEL_LABELS[fitnessLevel]
  const selectedGoal = goalType ? GOAL_TYPE_LABELS[goalType] : undefined

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="sm" />}>
        <Pencil className="h-4 w-4" />
        Modifier
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Modifier le client</SheetTitle>
        </SheetHeader>
        <form
          ref={formRef}
          action={handleSubmit}
          className="flex flex-col gap-5 px-4 py-2"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Identité
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                name="firstName"
                defaultValue={client.firstName}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                name="lastName"
                defaultValue={client.lastName}
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Genre</Label>
            <Select value={gender} onValueChange={(v) => setGender(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Non précisé">
                  {selectedGender}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(GENDER_LABELS) as Gender[]).map((g) => (
                  <SelectItem key={g} value={g}>
                    {GENDER_LABELS[g]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="birthDate">Date de naissance</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              defaultValue={isoDate(client.birthDate)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={client.email ?? ""}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Téléphone</Label>
            <div className="flex gap-2">
              <Select
                value={countryCode}
                onValueChange={(v) => setCountryCode(v ?? "+33")}
              >
                <SelectTrigger className="w-28 shrink-0">
                  <SelectValue>
                    {selectedCountry?.label ?? countryCode}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_CODES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                name="phone"
                type="tel"
                defaultValue={client.phone ?? ""}
              />
            </div>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Profil sportif
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Niveau</Label>
              <Select
                value={fitnessLevel}
                onValueChange={(v) => setFitnessLevel(v ?? "BEGINNER")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>{selectedLevel}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(FITNESS_LEVEL_LABELS) as FitnessLevel[]).map(
                    (l) => (
                      <SelectItem key={l} value={l}>
                        {FITNESS_LEVEL_LABELS[l]}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="weeklyFrequency">Séances / semaine</Label>
              <Input
                id="weeklyFrequency"
                name="weeklyFrequency"
                type="number"
                min={1}
                max={14}
                defaultValue={client.weeklyFrequency ?? ""}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="height">Taille (cm)</Label>
            <Input
              id="height"
              name="height"
              type="number"
              min={100}
              max={250}
              defaultValue={client.height ?? ""}
            />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Objectifs
          </p>
          <div className="flex flex-col gap-1.5">
            <Label>Type d&apos;objectif</Label>
            <Select
              value={goalType}
              onValueChange={(v) => setGoalType(v ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir">{selectedGoal}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(GOAL_TYPE_LABELS) as GoalType[]).map((g) => (
                  <SelectItem key={g} value={g}>
                    {GOAL_TYPE_LABELS[g]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="goalTargetWeight">Poids cible (kg)</Label>
              <Input
                id="goalTargetWeight"
                name="goalTargetWeight"
                type="number"
                step="0.1"
                defaultValue={client.goalTargetWeight ?? ""}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="goalDeadline">Échéance</Label>
              <Input
                id="goalDeadline"
                name="goalDeadline"
                type="date"
                defaultValue={isoDate(client.goalDeadline)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="goal">Objectif détaillé</Label>
            <Textarea
              id="goal"
              name="goal"
              defaultValue={client.goal ?? ""}
              rows={2}
            />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Médical
          </p>
          <p className="text-xs leading-relaxed text-zinc-500">
            Ces champs peuvent constituer des données de santé (RGPD). Ne les
            renseignez que si votre client en est informé et que vous disposez
            d&apos;un fondement légal (notamment consentement explicite si
            nécessaire). Voir la{" "}
            <a
              href="/confidentialite"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-violet-600 underline underline-offset-2"
            >
              politique de confidentialité
            </a>
            .
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="injuries">Blessures</Label>
            <Textarea
              id="injuries"
              name="injuries"
              defaultValue={client.injuries ?? ""}
              rows={2}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="medicalNotes">Notes médicales</Label>
            <Textarea
              id="medicalNotes"
              name="medicalNotes"
              defaultValue={client.medicalNotes ?? ""}
              rows={2}
            />
          </div>
          {consentRecordedAt ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
              Fondement légal pour les données sensibles enregistré le{" "}
              {consentRecordedAt}.
            </p>
          ) : (
            <label className="flex cursor-pointer items-start gap-2 text-xs leading-snug text-zinc-700">
              <input
                type="checkbox"
                name="sensitiveDataConsent"
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              <span>
                Je confirme disposer d&apos;un fondement légal pour traiter les
                données sensibles ci-dessus (obligatoire si ces champs sont
                renseignés).
              </span>
            </label>
          )}
          {formError ? (
            <p className="text-xs font-medium text-red-600">{formError}</p>
          ) : null}

          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4"
            />
            Client actif
          </label>

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
