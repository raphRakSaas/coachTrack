import { redirect, notFound } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { ExerciseDetail } from "@/components/dashboard/exercises/exercise-detail"

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const exercise = await prisma.exercise.findFirst({
    where: {
      id,
      OR: [{ isGlobal: true }, { coachId: user.id }],
    },
    include: {
      _count: {
        select: {
          programExercises: true,
          sessionExercises: true,
        },
      },
      sourceExercise: {
        select: { id: true, name: true },
      },
    },
  })

  if (!exercise) notFound()

  return (
    <div className="p-8">
      <ExerciseDetail
        exercise={{
          id: exercise.id,
          isGlobal: exercise.isGlobal,
          name: exercise.name,
          muscleGroup: exercise.muscleGroup,
          description: exercise.description,
          imageUrl: exercise.imageUrl,
          programUses: exercise._count.programExercises,
          sessionUses: exercise._count.sessionExercises,
          sourceExercise: exercise.sourceExercise,
        }}
      />
    </div>
  )
}
