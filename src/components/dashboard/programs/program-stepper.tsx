"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Check, Plus, Trash2 } from "lucide-react"
import { MuscleGroup } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createProgram } from "@/app/dashboard/programs/actions"
import { MUSCLE_GROUPS } from "@/lib/constants"

type Client = { id: string; firstName: string; lastName: string }
type Exercise = { id: string; name: string; muscleGroup: MuscleGroup }

type ExerciseEntry = {
  exerciseId: string
  sets: number
  reps: string
  weight: number | null
  restTime: number | null
  order: number
}

type WorkoutDay = {
  uid: string
  dayNumber: number
  name: string
  exercises: ExerciseEntry[]
}

export function ProgramStepper({
  clients,
  exercises,
}: {
  clients: Client[]
  exercises: Exercise[]
}) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [isPending, startTransition] = useTransition()

  const today = new Date().toISOString().split("T")[0]

  const [clientId, setClientId] = useState(clients[0]?.id ?? "")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState(today)

  const [days, setDays] = useState<WorkoutDay[]>([
    { uid: crypto.randomUUID(), dayNumber: 1, name: "Jour 1", exercises: [] },
  ])

  // Day management
  function addDay() {
    setDays((prev) => [
      ...prev,
      {
        uid: crypto.randomUUID(),
        dayNumber: prev.length + 1,
        name: `Jour ${prev.length + 1}`,
        exercises: [],
      },
    ])
  }

  function removeDay(uid: string) {
    setDays((prev) =>
      prev
        .filter((d) => d.uid !== uid)
        .map((d, i) => ({ ...d, dayNumber: i + 1 }))
    )
  }

  function updateDayName(uid: string, name: string) {
    setDays((prev) => prev.map((d) => (d.uid === uid ? { ...d, name } : d)))
  }

  // Exercise management
  const [selectorKeys, setSelectorKeys] = useState<Record<string, number>>({})

  function addExercise(dayUid: string, exerciseId: string) {
    setDays((prev) =>
      prev.map((d) =>
        d.uid === dayUid
          ? {
              ...d,
              exercises: [
                ...d.exercises,
                {
                  exerciseId,
                  sets: 3,
                  reps: "10",
                  weight: null,
                  restTime: 90,
                  order: d.exercises.length,
                },
              ],
            }
          : d
      )
    )
    setSelectorKeys((prev) => ({ ...prev, [dayUid]: (prev[dayUid] ?? 0) + 1 }))
  }

  function removeExercise(dayUid: string, order: number) {
    setDays((prev) =>
      prev.map((d) =>
        d.uid === dayUid
          ? {
              ...d,
              exercises: d.exercises
                .filter((e) => e.order !== order)
                .map((e, i) => ({ ...e, order: i })),
            }
          : d
      )
    )
  }

  function updateExercise(
    dayUid: string,
    order: number,
    field: keyof ExerciseEntry,
    value: string | number | null
  ) {
    setDays((prev) =>
      prev.map((d) =>
        d.uid === dayUid
          ? {
              ...d,
              exercises: d.exercises.map((e) =>
                e.order === order ? { ...e, [field]: value } : e
              ),
            }
          : d
      )
    )
  }

  function handleSubmit() {
    startTransition(async () => {
      await createProgram({
        clientId,
        name,
        description,
        startDate,
        days: days.map(({ uid: _uid, ...d }) => d),
      })
      router.push("/dashboard/programs")
    })
  }

  const selectedClient = clients.find((c) => c.id === clientId)
  const totalExercises = days.reduce((acc, d) => acc + d.exercises.length, 0)
  const isStep1Valid = clientId && name && startDate

  const steps = ["Informations", "Jours", "Récapitulatif"] as const

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour
          </button>
          <h1 className="text-2xl font-bold text-zinc-900">
            Nouveau programme
          </h1>
        </div>

        {/* Step indicator */}
        <div className="mb-8 flex items-center gap-2">
          {steps.map((label, i) => {
            const s = (i + 1) as 1 | 2 | 3
            return (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    step >= s
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-200 text-zinc-500"
                  }`}
                >
                  {step > s ? <Check className="h-3.5 w-3.5" /> : s}
                </div>
                <span
                  className={`text-sm ${
                    step === s
                      ? "font-medium text-zinc-900"
                      : "text-zinc-400"
                  }`}
                >
                  {label}
                </span>
                {s < 3 && (
                  <ChevronRight className="h-4 w-4 text-zinc-300" />
                )}
              </div>
            )
          })}
        </div>

        {/* Step 1: Informations */}
        {step === 1 && (
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Client</Label>
                <Select value={clientId} onValueChange={(v) => setClientId(v ?? "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir un client">
                      {selectedClient
                        ? `${selectedClient.firstName} ${selectedClient.lastName}`
                        : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.firstName} {c.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Nom du programme</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Programme prise de masse"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>
                  Description{" "}
                  <span className="text-muted-foreground">(optionnel)</span>
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Objectifs, fréquence, notes..."
                  rows={3}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Date de début</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!isStep1Valid}>
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Jours */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            {days.map((day) => (
              <div
                key={day.uid}
                className="rounded-xl border border-zinc-200 bg-white p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <Input
                    value={day.name}
                    onChange={(e) => updateDayName(day.uid, e.target.value)}
                    className="font-medium"
                  />
                  {days.length > 1 && (
                    <button
                      onClick={() => removeDay(day.uid)}
                      className="shrink-0 rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {day.exercises.length > 0 && (
                  <div className="mb-4 flex flex-col gap-3">
                    {day.exercises.map((ex) => {
                      const info = exercises.find(
                        (e) => e.id === ex.exerciseId
                      )
                      return (
                        <div
                          key={ex.order}
                          className="rounded-lg border border-zinc-100 bg-zinc-50 p-3"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-sm font-medium text-zinc-900">
                              {info?.name}
                            </p>
                            <button
                              onClick={() =>
                                removeExercise(day.uid, ex.order)
                              }
                              className="rounded p-1 text-zinc-400 hover:text-red-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            <div className="flex flex-col gap-1">
                              <Label className="text-xs">Séries</Label>
                              <Input
                                type="number"
                                min={1}
                                value={ex.sets}
                                onChange={(e) =>
                                  updateExercise(
                                    day.uid,
                                    ex.order,
                                    "sets",
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="h-7 text-xs"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <Label className="text-xs">Reps</Label>
                              <Input
                                value={ex.reps}
                                onChange={(e) =>
                                  updateExercise(
                                    day.uid,
                                    ex.order,
                                    "reps",
                                    e.target.value
                                  )
                                }
                                placeholder="10"
                                className="h-7 text-xs"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <Label className="text-xs">Charge (kg)</Label>
                              <Input
                                type="number"
                                min={0}
                                value={ex.weight ?? ""}
                                onChange={(e) =>
                                  updateExercise(
                                    day.uid,
                                    ex.order,
                                    "weight",
                                    e.target.value
                                      ? parseFloat(e.target.value)
                                      : null
                                  )
                                }
                                placeholder="—"
                                className="h-7 text-xs"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <Label className="text-xs">Repos (s)</Label>
                              <Input
                                type="number"
                                min={0}
                                value={ex.restTime ?? ""}
                                onChange={(e) =>
                                  updateExercise(
                                    day.uid,
                                    ex.order,
                                    "restTime",
                                    e.target.value
                                      ? parseInt(e.target.value)
                                      : null
                                  )
                                }
                                placeholder="90"
                                className="h-7 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                <Select
                  key={selectorKeys[day.uid] ?? 0}
                  onValueChange={(exerciseId) =>
                    exerciseId && addExercise(day.uid, exerciseId as string)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Ajouter un exercice..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      Object.entries(MUSCLE_GROUPS) as [MuscleGroup, string][]
                    ).map(([group, groupLabel]) => {
                      const groupExercises = exercises.filter(
                        (e) => e.muscleGroup === group
                      )
                      if (groupExercises.length === 0) return null
                      return (
                        <SelectGroup key={group}>
                          <SelectLabel>{groupLabel}</SelectLabel>
                          {groupExercises.map((e) => (
                            <SelectItem key={e.id} value={e.id}>
                              {e.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            ))}

            <Button variant="outline" onClick={addDay} className="w-full">
              <Plus className="h-4 w-4" />
              Ajouter un jour
            </Button>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
              <Button onClick={() => setStep(3)}>
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Récapitulatif */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <h2 className="mb-4 text-base font-semibold text-zinc-900">
                Récapitulatif
              </h2>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Client</span>
                  <span className="font-medium">
                    {selectedClient?.firstName} {selectedClient?.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Programme</span>
                  <span className="font-medium">{name}</span>
                </div>
                {description && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Description</span>
                    <span className="max-w-xs text-right font-medium">
                      {description}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-zinc-500">Date de début</span>
                  <span className="font-medium">
                    {new Date(startDate).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="flex justify-between border-t border-zinc-100 pt-3">
                  <span className="text-zinc-500">Jours d'entraînement</span>
                  <span className="font-medium">{days.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Exercices au total</span>
                  <span className="font-medium">{totalExercises}</span>
                </div>
              </div>

              {days.map((day) => (
                <div key={day.uid} className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    {day.name}
                  </p>
                  {day.exercises.length === 0 ? (
                    <p className="text-xs text-zinc-400">Aucun exercice</p>
                  ) : (
                    <ul className="flex flex-col gap-1">
                      {day.exercises.map((ex) => {
                        const info = exercises.find(
                          (e) => e.id === ex.exerciseId
                        )
                        return (
                          <li
                            key={ex.order}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="text-zinc-700">{info?.name}</span>
                            <span className="text-zinc-400">
                              {ex.sets}×{ex.reps}
                              {ex.weight ? ` · ${ex.weight}kg` : ""}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
              <Button onClick={handleSubmit} disabled={isPending}>
                {isPending ? "Création..." : "Créer le programme"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
