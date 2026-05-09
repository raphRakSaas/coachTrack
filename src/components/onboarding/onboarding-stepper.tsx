"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Users,
  CalendarCheck,
  PartyPopper,
  Check,
} from "lucide-react"
import { FitnessLevel, GoalType } from "@prisma/client"

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
  saveCoachProfile,
  createOnboardingClient,
  logFirstSession,
  finishOnboarding,
} from "@/app/onboarding/actions"
import { GOAL_TYPE_LABELS, FITNESS_LEVEL_LABELS } from "@/lib/constants"

type Step = 1 | 2 | 3 | 4 | 5

const STEPS: { n: Step; label: string }[] = [
  { n: 1, label: "Bienvenue" },
  { n: 2, label: "Votre profil" },
  { n: 3, label: "Premier client" },
  { n: 4, label: "Première séance" },
  { n: 5, label: "C'est parti" },
]

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

export function OnboardingStepper({ userName }: { userName: string | null }) {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [isPending, startTransition] = useTransition()
  const firstName = userName?.split(" ")[0] ?? null

  // Step 2 — coach profile
  const [specialty, setSpecialty] = useState<string>("")
  const [bio, setBio] = useState<string>("")
  const [yearsExperience, setYearsExperience] = useState<string>("")

  // Step 3 — first client
  const [clientFirstName, setClientFirstName] = useState("")
  const [clientLastName, setClientLastName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [fitnessLevel, setFitnessLevel] = useState("BEGINNER")
  const [goalType, setGoalType] = useState("")
  const [createdClientId, setCreatedClientId] = useState<string | null>(null)

  // Step 4 — first session
  const today = new Date().toISOString().split("T")[0]
  const [sessionDate, setSessionDate] = useState(today)
  const [sessionDuration, setSessionDuration] = useState("60")
  const [sessionNotes, setSessionNotes] = useState("")

  function handleSaveProfile() {
    const fd = new FormData()
    if (specialty) fd.set("specialty", specialty)
    if (bio) fd.set("bio", bio)
    if (yearsExperience) fd.set("yearsExperience", yearsExperience)
    startTransition(async () => {
      await saveCoachProfile(fd)
      setStep(3)
    })
  }

  function handleCreateClient() {
    const fd = new FormData()
    fd.set("firstName", clientFirstName)
    fd.set("lastName", clientLastName)
    if (clientEmail) fd.set("email", clientEmail)
    fd.set("fitnessLevel", fitnessLevel)
    if (goalType) fd.set("goalType", goalType)
    startTransition(async () => {
      const result = await createOnboardingClient(fd)
      setCreatedClientId(result.clientId)
      setStep(4)
    })
  }

  function handleCreateSession() {
    if (!createdClientId) return
    const fd = new FormData()
    fd.set("date", sessionDate)
    if (sessionDuration) fd.set("duration", sessionDuration)
    if (sessionNotes) fd.set("notes", sessionNotes)
    startTransition(async () => {
      await logFirstSession(createdClientId, fd)
      setStep(5)
    })
  }

  function handleFinish() {
    startTransition(async () => {
      await finishOnboarding()
    })
  }

  function handleSkipSession() {
    setStep(5)
  }

  const selectedLevel = FITNESS_LEVEL_LABELS[fitnessLevel]
  const selectedGoal = goalType ? GOAL_TYPE_LABELS[goalType] : undefined

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Progress */}
        <div className="mb-10 flex items-center gap-2">
          {STEPS.map(({ n, label }, i) => (
            <div key={n} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  step >= n
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-200 text-zinc-400"
                }`}
              >
                {step > n ? <Check className="h-3.5 w-3.5" /> : n}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 rounded-full transition-all ${
                    step > n ? "bg-indigo-600" : "bg-zinc-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          {/* Step 1 — Welcome */}
          {step === 1 && (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-2xl font-bold text-white shadow-lg shadow-indigo-500/25">
                <Sparkles className="h-7 w-7" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-zinc-900">
                Bienvenue sur Revo{firstName ? `, ${firstName}` : ""} !
              </h1>
              <p className="mb-8 text-sm text-zinc-500">
                On va configurer votre espace en moins de 2 minutes. Vous aurez
                déjà <span className="font-semibold text-indigo-600">76
                exercices</span> à votre disposition.
              </p>

              <div className="mb-8 grid grid-cols-3 gap-3 text-left">
                {[
                  {
                    icon: Users,
                    label: "Votre 1er client",
                    color: "bg-blue-50 text-blue-700",
                  },
                  {
                    icon: CalendarCheck,
                    label: "Sa 1ère séance",
                    color: "bg-emerald-50 text-emerald-700",
                  },
                  {
                    icon: PartyPopper,
                    label: "Vous êtes prêt",
                    color: "bg-violet-50 text-violet-700",
                  },
                ].map(({ icon: Icon, label, color }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-zinc-100 p-3 text-center"
                  >
                    <div
                      className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-medium text-zinc-700">{label}</p>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setStep(2)}
                size="lg"
                className="w-full"
              >
                C&apos;est parti
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2 — Coach profile */}
          {step === 2 && (
            <div>
              <h2 className="mb-1 text-xl font-bold text-zinc-900">
                Parlez-nous de vous
              </h2>
              <p className="mb-6 text-sm text-zinc-500">
                Ces infos personnaliseront votre espace. Vous pourrez les
                modifier plus tard dans Paramètres.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Spécialité principale</Label>
                  <Select
                    value={specialty}
                    onValueChange={(v) => setSpecialty(v ?? "")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choisir une spécialité">
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
                  <Label htmlFor="yearsExperience">
                    Années d&apos;expérience
                  </Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    min={0}
                    max={60}
                    placeholder="5"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="bio">Bio (optionnel)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Ex: Coach spécialisé en préparation physique sportive depuis 2018..."
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ChevronLeft className="h-4 w-4" />
                  Retour
                </Button>
                <Button onClick={handleSaveProfile} disabled={isPending}>
                  Continuer
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 — First client */}
          {step === 3 && (
            <div>
              <h2 className="mb-1 text-xl font-bold text-zinc-900">
                Votre premier client
              </h2>
              <p className="mb-6 text-sm text-zinc-500">
                Ajoutez les infos de base. Vous pourrez en ajouter plus depuis
                sa fiche.
              </p>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="clientFirstName">Prénom *</Label>
                    <Input
                      id="clientFirstName"
                      placeholder="Jean"
                      value={clientFirstName}
                      onChange={(e) => setClientFirstName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="clientLastName">Nom *</Label>
                    <Input
                      id="clientLastName"
                      placeholder="Dupont"
                      value={clientLastName}
                      onChange={(e) => setClientLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="jean@exemple.fr"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                  />
                </div>
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
                        {(
                          Object.keys(FITNESS_LEVEL_LABELS) as FitnessLevel[]
                        ).map((l) => (
                          <SelectItem key={l} value={l}>
                            {FITNESS_LEVEL_LABELS[l]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Objectif</Label>
                    <Select
                      value={goalType}
                      onValueChange={(v) => setGoalType(v ?? "")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir">
                          {selectedGoal}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(GOAL_TYPE_LABELS) as GoalType[]).map(
                          (g) => (
                            <SelectItem key={g} value={g}>
                              {GOAL_TYPE_LABELS[g]}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ChevronLeft className="h-4 w-4" />
                  Retour
                </Button>
                <Button
                  onClick={handleCreateClient}
                  disabled={
                    isPending || !clientFirstName.trim() || !clientLastName.trim()
                  }
                >
                  Créer le client
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4 — First session */}
          {step === 4 && (
            <div>
              <h2 className="mb-1 text-xl font-bold text-zinc-900">
                Sa première séance
              </h2>
              <p className="mb-6 text-sm text-zinc-500">
                Pour {clientFirstName} {clientLastName}. Vous pouvez la créer
                vide et la remplir plus tard.
              </p>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="sessionDate">Date</Label>
                    <Input
                      id="sessionDate"
                      type="date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="sessionDuration">Durée (min)</Label>
                    <Input
                      id="sessionDuration"
                      type="number"
                      min={1}
                      max={300}
                      value={sessionDuration}
                      onChange={(e) => setSessionDuration(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="sessionNotes">Notes (optionnel)</Label>
                  <Textarea
                    id="sessionNotes"
                    placeholder="Ex: Première évaluation, échauffement complet..."
                    rows={3}
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between gap-2">
                <Button variant="outline" onClick={handleSkipSession}>
                  Passer
                </Button>
                <Button onClick={handleCreateSession} disabled={isPending}>
                  Créer la séance
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 5 — Done */}
          {step === 5 && (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <PartyPopper className="h-7 w-7" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-zinc-900">
                Parfait, vous êtes prêt !
              </h2>
              <p className="mb-6 text-sm text-zinc-500">
                Votre espace est configuré. Voici ce que vous avez maintenant à
                votre disposition :
              </p>

              <ul className="mb-8 flex flex-col gap-2 text-left">
                {[
                  "76 exercices globaux pré-chargés",
                  createdClientId
                    ? `1 client créé : ${clientFirstName} ${clientLastName}`
                    : "Espace clients prêt",
                  "Suivi des séances avec RPE, humeur et énergie",
                  "Mesures corporelles avec graphiques d'évolution",
                  "Programmes d'entraînement personnalisés",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
                  >
                    <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>

              <Button
                onClick={handleFinish}
                size="lg"
                disabled={isPending}
                className="w-full"
              >
                Accéder à mon dashboard
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {step < 5 && (
          <button
            onClick={handleFinish}
            disabled={isPending}
            className="mx-auto mt-4 block text-xs text-zinc-400 hover:text-zinc-600 disabled:opacity-50"
          >
            Passer cette étape et aller au dashboard
          </button>
        )}
      </div>
    </div>
  )
}
