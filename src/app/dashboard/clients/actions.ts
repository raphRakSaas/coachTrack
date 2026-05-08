"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { FitnessLevel, GoalType, Gender } from "@prisma/client"

export async function createClient(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const parse = (key: string) => (formData.get(key) as string) || null

  await prisma.client.create({
    data: {
      coachId: user.id,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: parse("email"),
      phone: parse("phone"),
      phoneCountryCode: (formData.get("phoneCountryCode") as string) || "+33",
      gender: (parse("gender") as Gender) || null,
      birthDate: parse("birthDate") ? new Date(parse("birthDate")!) : null,
      height: parse("height") ? parseFloat(parse("height")!) : null,
      fitnessLevel:
        (formData.get("fitnessLevel") as FitnessLevel) || FitnessLevel.BEGINNER,
      weeklyFrequency: parse("weeklyFrequency")
        ? parseInt(parse("weeklyFrequency")!)
        : null,
      goalType: (parse("goalType") as GoalType) || null,
      goal: parse("goal"),
    },
  })

  revalidatePath("/dashboard/clients")
}

export async function deleteClient(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.client.delete({ where: { id, coachId: user.id } })

  revalidatePath("/dashboard/clients")
}
