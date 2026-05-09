import { redirect } from "next/navigation"
import { Dumbbell } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { MUSCLE_GROUPS } from "@/lib/constants"
import { SECTION_ACCENTS } from "@/lib/colors"
import { ExerciseSheet } from "@/components/dashboard/exercises/exercise-sheet"
import { ExerciseCard3d } from "@/components/dashboard/exercises/exercise-card-3d"
import { SearchInput } from "@/components/dashboard/search-input"

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
            <h1 className="text-2xl font-bold text-foreground">Exercices</h1>
            <p className="text-sm text-muted-foreground">
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
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card py-20 text-center">
          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${accent.bgSoft}`}>
            <Dumbbell className={`h-6 w-6 ${accent.icon}`} />
          </div>
          <p className="text-sm font-medium text-foreground">Aucun exercice</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Ajoutez votre premier exercice ou exécutez le seed des exercices globaux.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <div className="mb-2 flex items-baseline gap-2">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {MUSCLE_GROUPS[group as keyof typeof MUSCLE_GROUPS]}
                </p>
                <span className="text-xs text-muted-foreground">{items.length}</span>
              </div>
              <div className="overflow-hidden rounded-xl border border-border bg-card p-4">
                <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {items.map((exercise) => (
                    <ExerciseCard3d
                      key={exercise.id}
                      href={`/dashboard/exercises/${exercise.id}`}
                      name={exercise.name}
                      description={exercise.description}
                      muscleGroup={exercise.muscleGroup}
                      imageUrl={exercise.imageUrl}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
