"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function createSession(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const parseInt_ = (key: string) => {
    const v = formData.get(key) as string
    return v ? parseInt(v) : null
  }

  const optionalText = (key: string) => {
    const raw = (formData.get(key) as string)?.trim()
    return raw ? raw : null
  }

  await prisma.session.create({
    data: {
      coachId: user.id,
      clientId: formData.get("clientId") as string,
      date: new Date(formData.get("date") as string),
      duration: parseInt_("duration"),
      notes: (formData.get("notes") as string) || null,
      rpe: parseInt_("rpe"),
      mood: parseInt_("mood"),
      energy: parseInt_("energy"),
      location: optionalText("location"),
      sessionFocus: optionalText("sessionFocus"),
    },
  })

  revalidatePath("/dashboard/sessions")
}

export async function updateSession(id: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const parseInt_ = (key: string) => {
    const v = formData.get(key) as string
    return v ? parseInt(v) : null
  }

  const optionalText = (key: string) => {
    const raw = (formData.get(key) as string)?.trim()
    return raw ? raw : null
  }

  await prisma.session.update({
    where: { id, coachId: user.id },
    data: {
      date: new Date(formData.get("date") as string),
      duration: parseInt_("duration"),
      notes: (formData.get("notes") as string) || null,
      rpe: parseInt_("rpe"),
      mood: parseInt_("mood"),
      energy: parseInt_("energy"),
      location: optionalText("location"),
      sessionFocus: optionalText("sessionFocus"),
    },
  })

  revalidatePath("/dashboard/sessions")
  revalidatePath(`/dashboard/sessions/${id}`)
}

export async function deleteSession(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.session.delete({ where: { id, coachId: user.id } })

  revalidatePath("/dashboard/sessions")
}
