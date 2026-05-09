"use client"

import Link from "next/link"
import { useRef, useTransition } from "react"
import {
  ArrowLeft,
  Plus,
  Trash2,
  MapPin,
  Target,
  Layers,
  ClipboardList,
} from "lucide-react"
import { MuscleGroup } from "@prisma/client"
import type { Prisma } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  addExerciseToSession,
  removeExerciseFromSession,
  addSetToExercise,
  removeSet,
} from "@/app/dashboard/sessions/[id]/actions"
import { EditSessionSheet } from "./edit-session-sheet"
import { ClientAvatar } from "@/components/ui/client-avatar"
import { MUSCLE_GROUPS } from "@/lib/constants"
import { SECTION_ACCENTS } from "@/lib/colors"

type SessionWithRelations = Prisma.SessionGetPayload<{
  include: {
    client: { select: { id: true; firstName: true; lastName: true } }
    exercises: {
      include: {
        exercise: { select: { id: true; name: true; muscleGroup: true } }
        sets: true
      }
    }
  }
}>

type Exercise = { id: string; name: string; muscleGroup: MuscleGroup }

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-foreground">{value}</p>
    </div>
  )
}

export function SessionDetail({
  session,
  exercises,
}: {
  session: SessionWithRelations
  exercises: Exercise[]
}) {
  const [isPending, startTransition] = useTransition()
  const addSetFormRefs = useRef<Record<string, HTMLFormElement | null>>({})

  const totalSetsRecorded = session.exercises.reduce(
    (sum, sessionExercise) => sum + sessionExercise.sets.length,
    0
  )

  function handleAddExercise(exerciseId: string | null) {
    if (!exerciseId) return
    startTransition(async () => {
      await addExerciseToSession(session.id, exerciseId)
    })
  }

  function handleRemoveExercise(sessionExerciseId: string) {
    startTransition(async () => {
      await removeExerciseFromSession(sessionExerciseId, session.id)
    })
  }

  function handleAddSet(sessionExerciseId: string, formData: FormData) {
    startTransition(async () => {
      await addSetToExercise(sessionExerciseId, session.id, formData)
      addSetFormRefs.current[sessionExerciseId]?.reset()
    })
  }

  function handleRemoveSet(setId: string) {
    startTransition(async () => {
      await removeSet(setId, session.id)
    })
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/dashboard/clients/${session.client.id}`}
          className="mb-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {session.client.firstName} {session.client.lastName}
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <ClientAvatar
              firstName={session.client.firstName}
              lastName={session.client.lastName}
              size="lg"
              ring
            />
            <div className="min-w-0">
              <h1 className="text-2xl font-bold capitalize text-foreground">
                {new Date(session.date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                <span
                  className={SECTION_ACCENTS.sessions.text + " font-medium"}
                >
                  {session.client.firstName} {session.client.lastName}
                </span>
                {session.duration != null ? (
                  <> · {session.duration} min</>
                ) : (
                  <span> · Durée non renseignée</span>
                )}
              </p>
              {(session.location || session.sessionFocus) && (
                <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
                  {session.location && (
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>{session.location}</span>
                    </p>
                  )}
                  {session.sessionFocus && (
                    <p className="flex items-center gap-2">
                      <Target className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>{session.sessionFocus}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <EditSessionSheet session={session} />
        </div>
      </div>

      {/* Stats row — toujours visible pour repères visuels */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <StatBadge
          label="RPE"
          value={session.rpe != null ? `${session.rpe}/10` : "—"}
        />
        <StatBadge
          label="Humeur"
          value={session.mood != null ? `${session.mood}/5` : "—"}
        />
        <StatBadge
          label="Énergie"
          value={session.energy != null ? `${session.energy}/5` : "—"}
        />
      </div>

      {/* Synthèse charge */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm">
        <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
          <Layers className="h-4 w-4 text-muted-foreground" />
          {session.exercises.length} exercice
          {session.exercises.length !== 1 ? "s" : ""}
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">
          {totalSetsRecorded} série{totalSetsRecorded !== 1 ? "s" : ""}{" "}
          enregistrée{totalSetsRecorded !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Notes */}
      <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm">
        <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <ClipboardList className="h-3.5 w-3.5" />
          Notes de séance
        </p>
        {session.notes ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {session.notes}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucune note pour le moment. Utilisez « Modifier » pour compléter le
            compte rendu (objectifs, ressenti, consignes…).
          </p>
        )}
      </div>

      {/* Exercises */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          Exercices ({session.exercises.length})
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {session.exercises.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center">
            <p className="text-sm font-medium text-foreground">
              Aucun exercice enregistré
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ajoutez des exercices ci-dessous pour suivre séries, reps et
              charges.
            </p>
          </div>
        )}
        {session.exercises.map((se) => (
          <div
            key={se.id}
            className="rounded-xl border border-border bg-card shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="min-w-0 pr-2">
                <p className="text-sm font-medium text-foreground">
                  {se.exercise.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {MUSCLE_GROUPS[se.exercise.muscleGroup]}
                </p>
                {se.notes && (
                  <p className="mt-2 text-xs leading-snug text-muted-foreground">
                    {se.notes}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveExercise(se.id)}
                disabled={isPending}
                className="shrink-0 rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Sets */}
            {se.sets.length > 0 && (
              <div className="px-4 py-2">
                <div className="mb-1 grid grid-cols-3 gap-2 text-xs font-semibold text-muted-foreground">
                  <span>Série</span>
                  <span>Reps</span>
                  <span>Charge</span>
                </div>
                <div className="flex flex-col gap-1">
                  {se.sets.map((set) => (
                    <div
                      key={set.id}
                      className="grid grid-cols-3 items-center gap-2"
                    >
                      <span className="text-sm font-medium text-foreground">
                        #{set.setNumber}
                      </span>
                      <span className="text-sm text-foreground">
                        {set.reps ?? "—"}
                      </span>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-foreground">
                          {set.weight != null ? `${set.weight} kg` : "—"}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSet(set.id)}
                          disabled={isPending}
                          className="rounded p-1 text-muted-foreground hover:text-destructive disabled:opacity-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add set form */}
            <form
              ref={(el) => {
                addSetFormRefs.current[se.id] = el
              }}
              action={(formData) => handleAddSet(se.id, formData)}
              className="flex flex-wrap items-end gap-2 border-t border-border px-4 py-3"
            >
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Reps</Label>
                <Input
                  name="reps"
                  type="number"
                  min={1}
                  placeholder="10"
                  className="h-8 w-20 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Charge (kg)</Label>
                <Input
                  name="weight"
                  type="number"
                  min={0}
                  step="0.5"
                  placeholder="—"
                  className="h-8 w-24 text-xs"
                />
              </div>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={isPending}
                className="h-8"
              >
                <Plus className="h-3.5 w-3.5" />
                Série
              </Button>
            </form>
          </div>
        ))}

        {/* Add exercise selector */}
        <Select onValueChange={handleAddExercise}>
          <SelectTrigger className="w-full border-dashed">
            <SelectValue placeholder="Ajouter un exercice..." />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(MUSCLE_GROUPS) as [MuscleGroup, string][]).map(
              ([group, groupLabel]) => {
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
              }
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
