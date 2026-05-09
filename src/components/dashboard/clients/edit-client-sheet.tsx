"use client"

import { useRef, useState, useTransition } from "react"
import { Pencil } from "lucide-react"
import {
  FitnessLevel,
  GoalType,
  Gender,
  ActivityLevel,
  BodyType,
  DietaryPreferences,
} from "@prisma/client"

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

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  SEDENTARY: "Sédentaire",
  LIGHT: "Légère",
  MODERATE: "Modérée",
  ACTIVE: "Active",
  VERY_ACTIVE: "Très active",
}

const BODY_TYPE_LABELS: Record<BodyType, string> = {
  ECTOMORPH: "Ectomorphe",
  MESOMORPH: "Mésomorphe",
  ENDOMORPH: "Endomorphe",
}

const DIETARY_LABELS: Record<DietaryPreferences, string> = {
  STANDARD: "Standard",
  VEGETARIAN: "Végétarien",
  VEGAN: "Végétalien",
  GLUTEN_FREE: "Sans gluten",
  LACTOSE_FREE: "Sans lactose",
}

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
  activityLevel: ActivityLevel | null
  bodyType: BodyType | null
  dietaryPreferences: DietaryPreferences | null
  hasTCA: boolean
  goalType: GoalType | null
  goal: string | null
  goalTargetWeight: number | null
  goalDeadline: Date | string | null
  coachingStartDate: Date | string | null
  weightStart: number | null
  goalWeeklyLoss: number | null
  dailyCaloriesGoal: number | null
  dailyWaterGoal: number | null
  mealBreakfastPct: number | null
  mealLunchPct: number | null
  mealDinnerPct: number | null
  mealSnackPct: number | null
  macrosCarbsPct: number | null
  macrosProteinsPct: number | null
  macrosFatsPct: number | null
  company: string | null
  address: string | null
  postalCode: string | null
  city: string | null
  country: string | null
  linkedin: string | null
  instagram: string | null
  facebook: string | null
  twitter: string | null
  injuries: string | null
  medicalNotes: string | null
  sensitiveDataConsentAt: Date | string | null
  isActive: boolean
  notes: string | null
}

function isoDate(d: Date | string | null) {
  if (!d) return ""
  return new Date(d).toISOString().split("T")[0]!
}

export function EditClientSheet({ client }: { client: ClientInput }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [gender, setGender] = useState<string>(client.gender ?? "")
  const [fitnessLevel, setFitnessLevel] = useState<string>(client.fitnessLevel)
  const [activityLevel, setActivityLevel] = useState<string>(
    client.activityLevel ?? ""
  )
  const [bodyType, setBodyType] = useState<string>(client.bodyType ?? "")
  const [dietaryPreferences, setDietaryPreferences] = useState<string>(
    client.dietaryPreferences ?? ""
  )
  const [goalType, setGoalType] = useState<string>(client.goalType ?? "")
  const [countryCode, setCountryCode] = useState<string>(
    client.phoneCountryCode ?? "+33"
  )
  const [isActive, setIsActive] = useState(client.isActive)
  const [hasTCA, setHasTCA] = useState(client.hasTCA)

  function handleSubmit(formData: FormData) {
    setFormError(null)
    if (gender) formData.set("gender", gender)
    formData.set("fitnessLevel", fitnessLevel)
    if (activityLevel) formData.set("activityLevel", activityLevel)
    if (bodyType) formData.set("bodyType", bodyType)
    if (dietaryPreferences) formData.set("dietaryPreferences", dietaryPreferences)
    if (goalType) formData.set("goalType", goalType)
    formData.set("phoneCountryCode", countryCode)
    formData.set("isActive", isActive ? "true" : "false")
    formData.set("hasTCA", hasTCA ? "true" : "false")

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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="sm" />}>
        <Pencil className="h-4 w-4" />
        Modifier
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>
            Modifier {client.firstName} {client.lastName}
          </SheetTitle>
        </SheetHeader>
        <form
          ref={formRef}
          action={handleSubmit}
          className="flex flex-col gap-5 px-4 py-2"
        >
          {/* ── Identité ── */}
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Identité
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-firstName">Prénom *</Label>
              <Input
                id="edit-firstName"
                name="firstName"
                defaultValue={client.firstName}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-lastName">Nom *</Label>
              <Input
                id="edit-lastName"
                name="lastName"
                defaultValue={client.lastName}
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Genre</Label>
            <Select value={gender} onValueChange={(v) => setGender(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Non précisé">
                  {gender ? GENDER_LABELS[gender] : undefined}
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
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-birthDate">Date de naissance</Label>
              <Input
                id="edit-birthDate"
                name="birthDate"
                type="date"
                defaultValue={isoDate(client.birthDate)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-height">Taille (cm)</Label>
              <Input
                id="edit-height"
                name="height"
                type="number"
                min={100}
                max={250}
                defaultValue={client.height ?? ""}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
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
                    {COUNTRY_CODES.find((c) => c.code === countryCode)?.label ??
                      countryCode}
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

          {/* ── Statut ── */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isActive ? "bg-emerald-500" : "bg-zinc-300"}`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-4" : "translate-x-1"}`}
              />
            </button>
            <Label>{isActive ? "Client actif" : "Client inactif"}</Label>
          </div>

          {/* ── Profil sportif ── */}
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Profil sportif
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Niveau sportif</Label>
              <Select
                value={fitnessLevel}
                onValueChange={(v) => setFitnessLevel(v ?? "BEGINNER")}
              >
                <SelectTrigger>
                  <SelectValue>
                    {FITNESS_LEVEL_LABELS[fitnessLevel]}
                  </SelectValue>
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
              <Label htmlFor="edit-weeklyFrequency">Séances / semaine</Label>
              <Input
                id="edit-weeklyFrequency"
                name="weeklyFrequency"
                type="number"
                min={1}
                max={14}
                defaultValue={client.weeklyFrequency ?? ""}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Niveau d&apos;activité</Label>
              <Select
                value={activityLevel}
                onValueChange={(v) => setActivityLevel(v ?? "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Non précisé">
                    {activityLevel
                      ? ACTIVITY_LABELS[activityLevel as ActivityLevel]
                      : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map(
                    (l) => (
                      <SelectItem key={l} value={l}>
                        {ACTIVITY_LABELS[l]}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Type de corps</Label>
              <Select
                value={bodyType}
                onValueChange={(v) => setBodyType(v ?? "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Non précisé">
                    {bodyType
                      ? BODY_TYPE_LABELS[bodyType as BodyType]
                      : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(BODY_TYPE_LABELS) as BodyType[]).map((b) => (
                    <SelectItem key={b} value={b}>
                      {BODY_TYPE_LABELS[b]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ── Objectifs ── */}
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Objectifs
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Type d&apos;objectif</Label>
              <Select
                value={goalType}
                onValueChange={(v) => setGoalType(v ?? "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir">
                    {goalType ? GOAL_TYPE_LABELS[goalType] : undefined}
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
              <Label htmlFor="edit-goalTargetWeight">Poids cible (kg)</Label>
              <Input
                id="edit-goalTargetWeight"
                name="goalTargetWeight"
                type="number"
                step="0.1"
                defaultValue={client.goalTargetWeight ?? ""}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-weightStart">Poids de départ (kg)</Label>
              <Input
                id="edit-weightStart"
                name="weightStart"
                type="number"
                step="0.1"
                defaultValue={client.weightStart ?? ""}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-goalWeeklyLoss">Perte hebdo. (kg/sem)</Label>
              <Input
                id="edit-goalWeeklyLoss"
                name="goalWeeklyLoss"
                type="number"
                step="0.1"
                min="0"
                defaultValue={client.goalWeeklyLoss ?? ""}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-coachingStartDate">Début coaching</Label>
              <Input
                id="edit-coachingStartDate"
                name="coachingStartDate"
                type="date"
                defaultValue={isoDate(client.coachingStartDate)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-goalDeadline">Échéance</Label>
              <Input
                id="edit-goalDeadline"
                name="goalDeadline"
                type="date"
                defaultValue={isoDate(client.goalDeadline)}
              />
            </div>
          </div>

          {/* ── Nutrition ── */}
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Nutrition
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-dailyCaloriesGoal">
                Calories journalières (kcal)
              </Label>
              <Input
                id="edit-dailyCaloriesGoal"
                name="dailyCaloriesGoal"
                type="number"
                min={0}
                defaultValue={client.dailyCaloriesGoal ?? ""}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-dailyWaterGoal">Hydratation (L/jour)</Label>
              <Input
                id="edit-dailyWaterGoal"
                name="dailyWaterGoal"
                type="number"
                step="0.1"
                min={0}
                defaultValue={client.dailyWaterGoal ?? ""}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Préférences alimentaires</Label>
              <Select
                value={dietaryPreferences}
                onValueChange={(v) => setDietaryPreferences(v ?? "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Standard">
                    {dietaryPreferences
                      ? DIETARY_LABELS[dietaryPreferences as DietaryPreferences]
                      : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(DIETARY_LABELS) as DietaryPreferences[]).map(
                    (d) => (
                      <SelectItem key={d} value={d}>
                        {DIETARY_LABELS[d]}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <button
                type="button"
                onClick={() => setHasTCA(!hasTCA)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${hasTCA ? "bg-rose-500" : "bg-zinc-300"}`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${hasTCA ? "translate-x-4" : "translate-x-1"}`}
                />
              </button>
              <Label>TCA (troubles alimentaires)</Label>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400">
            Macronutriments (% — doit totaler 100%)
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-macrosCarbsPct">Glucides %</Label>
              <Input
                id="edit-macrosCarbsPct"
                name="macrosCarbsPct"
                type="number"
                min={0}
                max={100}
                defaultValue={client.macrosCarbsPct ?? 50}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-macrosProteinsPct">Protéines %</Label>
              <Input
                id="edit-macrosProteinsPct"
                name="macrosProteinsPct"
                type="number"
                min={0}
                max={100}
                defaultValue={client.macrosProteinsPct ?? 20}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-macrosFatsPct">Lipides %</Label>
              <Input
                id="edit-macrosFatsPct"
                name="macrosFatsPct"
                type="number"
                min={0}
                max={100}
                defaultValue={client.macrosFatsPct ?? 30}
              />
            </div>
          </div>

          <p className="text-[11px] text-zinc-400">Calories par repas (%)</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                id: "mealBreakfastPct",
                label: "Petit-déjeuner",
                def: client.mealBreakfastPct ?? 25,
              },
              {
                id: "mealLunchPct",
                label: "Déjeuner",
                def: client.mealLunchPct ?? 40,
              },
              {
                id: "mealDinnerPct",
                label: "Dîner",
                def: client.mealDinnerPct ?? 30,
              },
              {
                id: "mealSnackPct",
                label: "Collation",
                def: client.mealSnackPct ?? 5,
              },
            ].map((meal) => (
              <div key={meal.id} className="flex flex-col gap-1.5">
                <Label htmlFor={`edit-${meal.id}`}>{meal.label} %</Label>
                <Input
                  id={`edit-${meal.id}`}
                  name={meal.id}
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={meal.def}
                />
              </div>
            ))}
          </div>

          {/* ── Coordonnées ── */}
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Coordonnées
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="edit-company">Entreprise</Label>
              <Input
                id="edit-company"
                name="company"
                defaultValue={client.company ?? ""}
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="edit-address">Adresse</Label>
              <Input
                id="edit-address"
                name="address"
                defaultValue={client.address ?? ""}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-postalCode">Code postal</Label>
              <Input
                id="edit-postalCode"
                name="postalCode"
                defaultValue={client.postalCode ?? ""}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-city">Ville</Label>
              <Input
                id="edit-city"
                name="city"
                defaultValue={client.city ?? ""}
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="edit-country">Pays</Label>
              <Input
                id="edit-country"
                name="country"
                defaultValue={client.country ?? "France"}
              />
            </div>
          </div>

          {/* ── Réseaux sociaux ── */}
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Réseaux sociaux
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "linkedin", label: "LinkedIn", def: client.linkedin },
              { id: "instagram", label: "Instagram", def: client.instagram },
              { id: "facebook", label: "Facebook", def: client.facebook },
              { id: "twitter", label: "X (Twitter)", def: client.twitter },
            ].map((social) => (
              <div key={social.id} className="flex flex-col gap-1.5">
                <Label htmlFor={`edit-${social.id}`}>{social.label}</Label>
                <Input
                  id={`edit-${social.id}`}
                  name={social.id}
                  placeholder={`@${social.id}`}
                  defaultValue={social.def ?? ""}
                />
              </div>
            ))}
          </div>

          {/* ── Notes ── */}
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Notes générales
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-notes">Notes coach</Label>
            <Textarea
              id="edit-notes"
              name="notes"
              rows={3}
              defaultValue={client.notes ?? ""}
            />
          </div>

          {/* ── Médical ── */}
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Médical (optionnel)
          </p>
          {consentRecordedAt ? (
            <p className="text-xs text-emerald-600">
              ✓ Consentement enregistré le {consentRecordedAt}
            </p>
          ) : (
            <p className="text-xs leading-relaxed text-zinc-500">
              Ne renseignez ces champs que si nécessaire et avec un fondement
              légal (voir politique de confidentialité).
            </p>
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-injuries">Blessures</Label>
            <Textarea
              id="edit-injuries"
              name="injuries"
              rows={2}
              defaultValue={client.injuries ?? ""}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-medicalNotes">Notes médicales</Label>
            <Textarea
              id="edit-medicalNotes"
              name="medicalNotes"
              rows={2}
              defaultValue={client.medicalNotes ?? ""}
            />
          </div>
          {!consentRecordedAt && (
            <label className="flex cursor-pointer items-start gap-2 text-xs leading-snug text-zinc-700">
              <input
                type="checkbox"
                name="sensitiveDataConsent"
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              <span>
                Je confirme disposer d&apos;un fondement légal pour traiter
                les données sensibles ci-dessus.
              </span>
            </label>
          )}

          {formError && (
            <p className="text-xs font-medium text-red-600">{formError}</p>
          )}

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
