"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function deleteExerciseAndRedirect(exerciseId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.exercise.delete({
    where: { id: exerciseId, coachId: user.id },
  })

  revalidatePath("/dashboard/exercises")
  redirect("/dashboard/exercises")
}

export async function duplicateExerciseToMyLibrary(sourceExerciseId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const source = await prisma.exercise.findFirst({
    where: { id: sourceExerciseId, isGlobal: true },
  })
  if (!source) throw new Error("Exercise not found")

  const created = await (prisma.exercise.create as any)({
    data: {
      coachId: user.id,
      isGlobal: false,
      sourceExerciseId: source.id,
      name: source.name,
      muscleGroup: source.muscleGroup,
      description: source.description,
      imageUrl: (source as any).imageUrl ?? null,
      imagePublicId: null,
    },
  })

  revalidatePath("/dashboard/exercises")
  redirect(`/dashboard/exercises/${created.id}`)
}

