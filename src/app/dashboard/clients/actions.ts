"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function createClient(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.client.create({
    data: {
      coachId: user.id,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      goal: (formData.get("goal") as string) || null,
      notes: (formData.get("notes") as string) || null,
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
