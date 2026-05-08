"use server"

import { MuscleGroup } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function createExercise(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.exercise.create({
    data: {
      name: formData.get("name") as string,
      muscleGroup: formData.get("muscleGroup") as MuscleGroup,
      description: (formData.get("description") as string) || null,
      coachId: user.id,
    },
  })

  revalidatePath("/dashboard/exercises")
}

export async function deleteExercise(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.exercise.delete({ where: { id, coachId: user.id } })

  revalidatePath("/dashboard/exercises")
}
