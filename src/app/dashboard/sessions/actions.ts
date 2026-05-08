"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function createSession(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const durationStr = formData.get("duration") as string

  await prisma.session.create({
    data: {
      coachId: user.id,
      clientId: formData.get("clientId") as string,
      date: new Date(formData.get("date") as string),
      duration: durationStr ? parseInt(durationStr) : null,
      notes: (formData.get("notes") as string) || null,
    },
  })

  revalidatePath("/dashboard/sessions")
}

export async function deleteSession(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.session.delete({ where: { id, coachId: user.id } })

  revalidatePath("/dashboard/sessions")
}
