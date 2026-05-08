"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function addExerciseToSession(sessionId: string, exerciseId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const count = await prisma.sessionExercise.count({ where: { sessionId } })

  await prisma.sessionExercise.create({
    data: { sessionId, exerciseId, order: count },
  })

  revalidatePath(`/dashboard/sessions/${sessionId}`)
}

export async function removeExerciseFromSession(
  sessionExerciseId: string,
  sessionId: string
) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.sessionExercise.delete({ where: { id: sessionExerciseId } })

  revalidatePath(`/dashboard/sessions/${sessionId}`)
}

export async function addSetToExercise(
  sessionExerciseId: string,
  sessionId: string,
  formData: FormData
) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const count = await prisma.sessionSet.count({ where: { sessionExerciseId } })

  const repsStr = formData.get("reps") as string
  const weightStr = formData.get("weight") as string

  await prisma.sessionSet.create({
    data: {
      sessionExerciseId,
      setNumber: count + 1,
      reps: repsStr ? parseInt(repsStr) : null,
      weight: weightStr ? parseFloat(weightStr) : null,
      completed: true,
    },
  })

  revalidatePath(`/dashboard/sessions/${sessionId}`)
}

export async function removeSet(setId: string, sessionId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.sessionSet.delete({ where: { id: setId } })

  revalidatePath(`/dashboard/sessions/${sessionId}`)
}
