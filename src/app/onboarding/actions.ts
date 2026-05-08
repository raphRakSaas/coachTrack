"use server"

import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { FitnessLevel, GoalType } from "@prisma/client"

export async function saveCoachProfile(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const specialty = (formData.get("specialty") as string) || null
  const bio = (formData.get("bio") as string) || null
  const yearsRaw = formData.get("yearsExperience") as string
  const yearsExperience = yearsRaw ? parseInt(yearsRaw) : null

  await prisma.user.update({
    where: { id: user.id },
    data: { specialty, bio, yearsExperience },
  })
}

export async function createOnboardingClient(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = (formData.get("email") as string) || null
  const goalType = (formData.get("goalType") as GoalType) || null
  const fitnessLevel =
    (formData.get("fitnessLevel") as FitnessLevel) || FitnessLevel.BEGINNER

  const client = await prisma.client.create({
    data: { coachId: user.id, firstName, lastName, email, goalType, fitnessLevel },
  })

  return { clientId: client.id }
}

export async function logFirstSession(
  clientId: string,
  formData: FormData
) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const date = formData.get("date") as string
  const durationRaw = formData.get("duration") as string
  const duration = durationRaw ? parseInt(durationRaw) : null
  const notes = (formData.get("notes") as string) || null

  await prisma.session.create({
    data: {
      coachId: user.id,
      clientId,
      date: date ? new Date(date) : new Date(),
      duration,
      notes,
    },
  })
}

export async function finishOnboarding() {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.user.update({
    where: { id: user.id },
    data: { onboardingCompleted: true },
  })

  redirect("/dashboard")
}

// Legacy single-step (kept for back-compat, no longer used)
export async function completeOnboarding(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = (formData.get("email") as string) || null
  const goalType = (formData.get("goalType") as GoalType) || null
  const fitnessLevel =
    (formData.get("fitnessLevel") as FitnessLevel) || FitnessLevel.BEGINNER

  const client = await prisma.client.create({
    data: { coachId: user.id, firstName, lastName, email, goalType, fitnessLevel },
  })

  await prisma.user.update({
    where: { id: user.id },
    data: { onboardingCompleted: true },
  })

  redirect(`/dashboard/clients/${client.id}`)
}
