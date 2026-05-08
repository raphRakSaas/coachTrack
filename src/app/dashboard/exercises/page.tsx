import { redirect } from "next/navigation"
import { Dumbbell, Trash2 } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { MUSCLE_GROUPS } from "@/lib/constants"
import { SECTION_ACCENTS } from "@/lib/colors"
import { Badge } from "@/components/ui/badge"
import { ExerciseSheet } from "@/components/dashboard/exercises/exercise-sheet"
import { EditExerciseSheet } from "@/components/dashboard/exercises/edit-exercise-sheet"
import { SearchInput } from "@/components/dashboard/search-input"
import { deleteExercise } from "./actions"

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const accent = SECTION_ACCENTS.exercises

  const exercises = await prisma.exercise.findMany({
    where: {
      OR: [{ isGlobal: true }, { coachId: user.id }],
      ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    },
    orderBy: [{ muscleGroup: "asc" }, { name: "asc" }],
  })

  const customCount = exercises.filter((e) => !e.isGlobal).length
  const grouped = exercises.reduce(
    (acc, ex) => {
      ;(acc[ex.muscleGroup] ??= []).push(ex)
      return acc
    },
    {} as Record<string, typeof exercises>
  )

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.bgSoft}`}>
            <Dumbbell className={`h-5 w-5 ${accent.icon}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Exercices</h1>
            <p className="text-sm text-zinc-500">
              {exercises.length} exercice{exercises.length !== 1 ? "s" : ""}
              {customCount > 0 && ` · ${customCount} personnalisé${customCount !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SearchInput placeholder="Rechercher un exercice..." />
          <ExerciseSheet />
        </div>
      </div>

      {exercises.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-zinc-200 bg-white py-20 text-center">
          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${accent.bgSoft}`}>
            <Dumbbell className={`h-6 w-6 ${accent.icon}`} />
          </div>
          <p className="text-sm font-medium text-zinc-700">Aucun exercice</p>
          <p className="mt-1 text-xs text-zinc-500">
            Ajoutez votre premier exercice ou exécutez le seed des exercices globaux.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <div className="mb-2 flex items-baseline gap-2">
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                  {MUSCLE_GROUPS[group as keyof typeof MUSCLE_GROUPS]}
                </p>
                <span className="text-xs text-zinc-400">{items.length}</span>
              </div>
              <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
                {items.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="group flex items-center justify-between px-4 py-3 hover:bg-zinc-50/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-zinc-900">
                        {exercise.name}
                      </p>
                      {exercise.description && (
                        <p className="mt-0.5 truncate text-xs text-zinc-500">
                          {exercise.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {exercise.isGlobal ? (
                        <Badge variant="secondary" className="text-xs">
                          Global
                        </Badge>
                      ) : (
                        <>
                          <EditExerciseSheet exercise={exercise} />
                          <form action={deleteExercise.bind(null, exercise.id)}>
                            <button
                              type="submit"
                              className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-red-500"
                              aria-label="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </form>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
