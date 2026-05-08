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

