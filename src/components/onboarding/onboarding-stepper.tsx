"use client"

import Image from "next/image"
import { useEffect, useState, useTransition } from "react"
import { useTheme } from "next-themes"
import { ChevronRight, ChevronLeft, Check } from "lucide-react"

import { RevoWordmark } from "@/components/auth/revo-wordmark"
import { ThemeToggle } from "@/components/marketing/theme-toggle"

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
import {
  saveCoachProfile,
  createOnboardingClient,
  finishOnboarding,
} from "@/app/onboarding/actions"

type Step = 1 | 2 | 3

const STEPS: { n: Step; label: string }[] = [
  { n: 1, label: "Profil" },
  { n: 2, label: "Client" },
  { n: 3, label: "Terminé" },
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

export function OnboardingStepper({
  initialCoachFirstName = "",
  initialCoachLastName = "",
}: {
  initialCoachFirstName?: string
  initialCoachLastName?: string
}) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState<Step>(1)
  const [isPending, startTransition] = useTransition()

  useEffect(() => setMounted(true), [])
  const logoTone =
    mounted && resolvedTheme === "dark" ? "dark" : "light"

  const [coachFirstName, setCoachFirstName] = useState(initialCoachFirstName)
  const [coachLastName, setCoachLastName] = useState(initialCoachLastName)
  const [specialty, setSpecialty] = useState<string>("")

  const [clientFirstName, setClientFirstName] = useState("")
  const [clientLastName, setClientLastName] = useState("")
  const [createdClientId, setCreatedClientId] = useState<string | null>(null)

  function handleSaveProfile() {
    const fd = new FormData()
    fd.set("coachFirstName", coachFirstName.trim())
    fd.set("coachLastName", coachLastName.trim())
    fd.set("specialty", specialty)
    startTransition(async () => {
      await saveCoachProfile(fd)
      setStep(2)
    })
  }

  function handleCreateClient() {
    const fd = new FormData()
    fd.set("firstName", clientFirstName.trim())
    fd.set("lastName", clientLastName.trim())
    startTransition(async () => {
      const result = await createOnboardingClient(fd)
      setCreatedClientId(result.clientId)
      setStep(3)
    })
  }

  function handleSkipClient() {
    setCreatedClientId(null)
    setStep(3)
  }

  function handleFinish() {
    startTransition(async () => {
      await finishOnboarding()
    })
  }

  const profileStepValid =
    coachFirstName.trim().length > 0 &&
    coachLastName.trim().length > 0 &&
    specialty.trim().length > 0

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]">
        <aside className="relative min-h-[38vh] overflow-hidden border-b border-zinc-200 lg:min-h-screen lg:border-b-0 lg:border-r lg:border-zinc-200 dark:border-zinc-800 dark:lg:border-zinc-800">
          <Image
            src="/hero-bg.jpg"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 56vw"
            className="object-cover object-center"
            priority
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent lg:from-black/35 lg:via-black/5"
            aria-hidden
          />
        </aside>

        <main className="flex max-h-[100dvh] flex-col overflow-y-auto overscroll-y-contain bg-zinc-50 px-4 py-8 dark:bg-zinc-950 sm:px-8 lg:min-h-screen lg:px-12 lg:py-10">
          <header className="mx-auto mb-6 flex w-full max-w-md shrink-0 items-center justify-between gap-4">
            <RevoWordmark href="/" tone={logoTone} size="md" />
            <ThemeToggle />
          </header>

          <div className="mx-auto w-full max-w-md flex-1 pb-8">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
              {STEPS.find((entry) => entry.n === step)?.label ?? ""}
            </p>

            <div className="mb-6 flex items-center gap-1 sm:gap-1.5">
              {STEPS.map(({ n }, stepIndex) => (
                <div key={n} className="flex flex-1 items-center gap-1 sm:gap-1.5">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all sm:h-8 sm:w-8 sm:text-xs ${
                      step >= n
                        ? "bg-indigo-600 text-white dark:bg-indigo-500"
                        : "bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
                    }`}
                  >
                    {step > n ? <Check className="h-3.5 w-3.5" /> : n}
                  </div>
                  {stepIndex < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 min-w-[6px] flex-1 rounded-full transition-all ${
                        step > n
                          ? "bg-indigo-600 dark:bg-indigo-500"
                          : "bg-zinc-200 dark:bg-zinc-700"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">
              {step === 1 && (
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    Votre profil
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Prérempli si vous vous êtes connecté avec Google ou Apple.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="coachFirstName">Prénom</Label>
                      <Input
                        id="coachFirstName"
                        placeholder="Alex"
                        value={coachFirstName}
                        onChange={(e) => setCoachFirstName(e.target.value)}
                        autoComplete="given-name"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="coachLastName">Nom</Label>
                      <Input
                        id="coachLastName"
                        placeholder="Martin"
                        value={coachLastName}
                        onChange={(e) => setCoachLastName(e.target.value)}
                        autoComplete="family-name"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-2">
                    <Label htmlFor="specialty">Spécialité</Label>
                    <Select
                      value={specialty}
                      onValueChange={(v) => setSpecialty(v ?? "")}
                    >
                      <SelectTrigger id="specialty" className="w-full">
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

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isPending || !profileStepValid}
                    >
                      Continuer
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    Premier client
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Prénom et nom — le reste depuis la fiche client.
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="clientFirstName">Prénom</Label>
                      <Input
                        id="clientFirstName"
                        placeholder="Jean"
                        value={clientFirstName}
                        onChange={(e) => setClientFirstName(e.target.value)}
                        autoComplete="given-name"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="clientLastName">Nom</Label>
                      <Input
                        id="clientLastName"
                        placeholder="Dupont"
                        value={clientLastName}
                        onChange={(e) => setClientLastName(e.target.value)}
                        autoComplete="family-name"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      <ChevronLeft className="h-4 w-4" />
                      Retour
                    </Button>
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-zinc-500 dark:text-zinc-400"
                        onClick={handleSkipClient}
                      >
                        Plus tard
                      </Button>
                      <Button
                        onClick={handleCreateClient}
                        disabled={
                          isPending ||
                          !clientFirstName.trim() ||
                          !clientLastName.trim()
                        }
                      >
                        Enregistrer
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200/80 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/40">
                    <Check
                      className="h-7 w-7 text-emerald-600 dark:text-emerald-400"
                      strokeWidth={2.5}
                    />
                  </div>
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    C&apos;est prêt
                  </h2>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {createdClientId
                      ? `${clientFirstName} ${clientLastName} est dans vos clients.`
                      : "Ajoutez un client quand vous voulez depuis le menu."}
                  </p>
                  <Button
                    onClick={handleFinish}
                    size="lg"
                    disabled={isPending}
                    className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                  >
                    Ouvrir le tableau de bord
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {step < 3 && (
              <button
                type="button"
                onClick={handleFinish}
                disabled={isPending}
                className="mx-auto mt-4 block w-full text-center text-[11px] text-zinc-400 transition-colors hover:text-zinc-600 disabled:opacity-50 dark:text-zinc-500 dark:hover:text-zinc-300"
              >
                Ignorer et aller au tableau de bord
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
