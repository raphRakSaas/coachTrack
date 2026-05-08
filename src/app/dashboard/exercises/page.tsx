import { redirect } from "next/navigation"
import { Dumbbell, Trash2 } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { MUSCLE_GROUPS } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { ExerciseSheet } from "@/components/dashboard/exercises/exercise-sheet"
import { deleteExercise } from "./actions"

export default async function ExercisesPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const exercises = await prisma.exercise.findMany({
    where: { OR: [{ isGlobal: true }, { coachId: user.id }] },
    orderBy: [{ muscleGroup: "asc" }, { name: "asc" }],
  })

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Exercices</h1>
          <p className="text-sm text-zinc-500">
            {exercises.length} exercice{exercises.length !== 1 ? "s" : ""}
          </p>
        </div>
        <ExerciseSheet />
      </div>

      {exercises.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Dumbbell className="mb-3 h-10 w-10 text-zinc-300" />
          <p className="text-sm font-medium text-zinc-500">Aucun exercice</p>
          <p className="mt-1 text-xs text-zinc-400">
            Ajoutez votre premier exercice.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  {exercise.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {MUSCLE_GROUPS[exercise.muscleGroup]}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {exercise.isGlobal ? (
                  <Badge variant="secondary">Global</Badge>
                ) : (
                  <form action={deleteExercise.bind(null, exercise.id)}>
                    <button
                      type="submit"
                      className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
