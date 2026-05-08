"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function updateCoachProfile(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const name = (formData.get("name") as string) || null
  const specialty = (formData.get("specialty") as string) || null
  const bio = (formData.get("bio") as string) || null
  const yearsRaw = formData.get("yearsExperience") as string
  const yearsExperience = yearsRaw ? parseInt(yearsRaw) : null

  await prisma.user.update({
    where: { id: user.id },
    data: { name, specialty, bio, yearsExperience },
  })

  revalidatePath("/dashboard/settings")
  revalidatePath("/dashboard")
}
