"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { FitnessLevel, GoalType, Gender } from "@prisma/client"
import {
  formHasMedicalNotesFields,
  isSensitiveDataConsentChecked,
} from "@/lib/sensitive-data-consent"

export async function createClient(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const parse = (key: string) => (formData.get(key) as string) || null

  const incomingMedical = formHasMedicalNotesFields(formData)
  if (incomingMedical && !isSensitiveDataConsentChecked(formData)) {
    throw new Error(
      "Pour enregistrer des informations médicales, cochez la confirmation relative au fondement légal (voir politique de confidentialité)."
    )
  }

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
      injuries: parse("injuries"),
      medicalNotes: parse("medicalNotes"),
      sensitiveDataConsentAt: incomingMedical ? new Date() : null,
    },
  })

  revalidatePath("/dashboard/clients")
}

export async function deleteClient(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const row = await prisma.client.findFirst({
    where: { id, coachId: user.id },
    select: { isDemo: true },
  })
  if (!row) return
  if (row.isDemo) {
    throw new Error(
      "Le client de démonstration ne peut pas être supprimé. Il est partagé comme exemple pour tous les comptes Revo."
    )
  }

  await prisma.client.delete({ where: { id, coachId: user.id } })

  revalidatePath("/dashboard/clients")
}
