"use client"

import { useRef, useState, useTransition } from "react"
import { Plus } from "lucide-react"
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
import { createClient } from "@/app/dashboard/clients/actions"
import {
  GENDER_LABELS,
  FITNESS_LEVEL_LABELS,
  GOAL_TYPE_LABELS,
  COUNTRY_CODES,
} from "@/lib/constants"

export function ClientSheet() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [gender, setGender] = useState<string>("")
  const [fitnessLevel, setFitnessLevel] = useState<string>("BEGINNER")
  const [goalType, setGoalType] = useState<string>("")
  const [countryCode, setCountryCode] = useState<string>("+33")

  function handleSubmit(formData: FormData) {
    setFormError(null)
    if (gender) formData.set("gender", gender)
    formData.set("fitnessLevel", fitnessLevel)
    if (goalType) formData.set("goalType", goalType)
    formData.set("phoneCountryCode", countryCode)

    startTransition(async () => {
      try {
        await createClient(formData)
        formRef.current?.reset()
        setGender("")
        setFitnessLevel("BEGINNER")
        setGoalType("")
        setCountryCode("+33")
        setOpen(false)
      } catch (err) {
        setFormError(
          err instanceof Error ? err.message : "Une erreur est survenue."
        )
      }
    })
  }

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode)
  const selectedGender = gender ? GENDER_LABELS[gender] : undefined
  const selectedLevel = FITNESS_LEVEL_LABELS[fitnessLevel]
  const selectedGoal = goalType ? GOAL_TYPE_LABELS[goalType] : undefined

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button />}>
        <Plus />
        Ajouter un client
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Nouveau client</SheetTitle>
        </SheetHeader>
        <form
          ref={formRef}
          action={handleSubmit}
          className="flex flex-col gap-5 px-4 py-2"
        >
          {/* Identité */}
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Identité
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input id="firstName" name="firstName" placeholder="Jean" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastName">Nom *</Label>
              <Input id="lastName" name="lastName" placeholder="Dupont" required />
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
            <Input id="birthDate" name="birthDate" type="date" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="jean@exemple.fr" />
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
              <Input name="phone" type="tel" placeholder="06 12 34 56 78" />
            </div>
          </div>

          {/* Profil sportif */}
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
                placeholder="3"
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
              placeholder="175"
            />
          </div>

          {/* Objectifs */}
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Objectifs
          </p>
          <div className="flex flex-col gap-1.5">
            <Label>Type d'objectif</Label>
            <Select value={goalType} onValueChange={(v) => setGoalType(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir">
                  {selectedGoal}
                </SelectValue>
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
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="goal">Objectif détaillé</Label>
            <Textarea
              id="goal"
              name="goal"
              placeholder="Perdre 5 kg avant l'été..."
              rows={2}
            />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Médical (optionnel)
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Ne renseignez ces champs que si nécessaire et avec un fondement
            légal (voir{" "}
            <a
              href="/confidentialite"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-violet-600 underline underline-offset-2"
            >
              politique de confidentialité
            </a>
            ).
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="injuries">Blessures</Label>
            <Textarea id="injuries" name="injuries" rows={2} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="medicalNotes">Notes médicales</Label>
            <Textarea id="medicalNotes" name="medicalNotes" rows={2} />
          </div>
          <label className="flex cursor-pointer items-start gap-2 text-xs leading-snug text-foreground">
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
          {formError ? (
            <p className="text-xs font-medium text-red-600">{formError}</p>
          ) : null}

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
