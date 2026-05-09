"use server"

import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { FitnessLevel, GoalType } from "@prisma/client"

export async function saveCoachProfile(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const coachFirstName = String(formData.get("coachFirstName") ?? "").trim()
  const coachLastName = String(formData.get("coachLastName") ?? "").trim()
  const nameParts = [coachFirstName, coachLastName].filter(Boolean)
  const name = nameParts.length > 0 ? nameParts.join(" ") : null

  const specialty = (formData.get("specialty") as string) || null
  const bio = (formData.get("bio") as string) || null
  const yearsRaw = formData.get("yearsExperience") as string
  const yearsExperience = yearsRaw ? parseInt(yearsRaw) : null

  await prisma.user.update({
    where: { id: user.id },
    data: { name, specialty, bio, yearsExperience },
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
