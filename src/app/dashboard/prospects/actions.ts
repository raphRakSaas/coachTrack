"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { ProspectStatus, FitnessLevel } from "@prisma/client"

export async function createProspect(formData: FormData) {
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
      phoneCountryCode: parse("phoneCountryCode") ?? "+33",
      notes: parse("notes"),
      prospectNotes: parse("prospectNotes"),
      prospectSource: parse("prospectSource"),
      fitnessLevel: FitnessLevel.BEGINNER,
      isProspect: true,
      isActive: false,
      prospectStatus: ProspectStatus.NEW,
    },
  })

  revalidatePath("/dashboard/prospects")
}

export async function updateProspectStatus(
  id: string,
  status: ProspectStatus
) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.client.update({
    where: { id, coachId: user.id },
    data: { prospectStatus: status },
  })

  revalidatePath("/dashboard/prospects")
}

export async function advanceProspectStatus(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const prospect = await prisma.client.findFirst({
    where: { id, coachId: user.id },
    select: { prospectStatus: true },
  })
  if (!prospect) throw new Error("Prospect introuvable")

  const nextStatus: Partial<Record<ProspectStatus, ProspectStatus>> = {
    NEW: "CONTACTED",
    CONTACTED: "HOT",
    HOT: "CONVERTED",
    COLD: "HOT",
  }
  const next = nextStatus[prospect.prospectStatus ?? "NEW"]
  if (!next) return

  await prisma.client.update({
    where: { id, coachId: user.id },
    data: { prospectStatus: next },
  })

  revalidatePath("/dashboard/prospects")
}

export async function convertProspectToClient(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.client.update({
    where: { id, coachId: user.id },
    data: {
      isProspect: false,
      isActive: true,
      prospectStatus: ProspectStatus.CONVERTED,
    },
  })

  revalidatePath("/dashboard/prospects")
  revalidatePath("/dashboard/clients")
}

export async function deleteProspect(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.client.delete({
    where: { id, coachId: user.id },
  })

  revalidatePath("/dashboard/prospects")
}
