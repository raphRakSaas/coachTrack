"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import {
  FitnessLevel,
  GoalType,
  Gender,
  ActivityLevel,
  BodyType,
  DietaryPreferences,
  TrackingItemType,
} from "@prisma/client"
import {
  formHasMedicalNotesFields,
  isMeasurementConsentChecked,
  isSensitiveDataConsentChecked,
} from "@/lib/sensitive-data-consent"

export async function updateClient(id: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const parse = (key: string) => (formData.get(key) as string) || null
  const parseFloat_ = (key: string) => {
    const v = formData.get(key) as string
    return v ? parseFloat(v) : null
  }
  const parseInt_ = (key: string) => {
    const v = formData.get(key) as string
    return v ? parseInt(v) : null
  }

  const existing = await prisma.client.findFirst({
    where: { id, coachId: user.id },
    select: { sensitiveDataConsentAt: true },
  })
  if (!existing) throw new Error("Client introuvable")

  const incomingMedical = formHasMedicalNotesFields(formData)
  if (
    incomingMedical &&
    !existing.sensitiveDataConsentAt &&
    !isSensitiveDataConsentChecked(formData)
  ) {
    throw new Error(
      "Pour enregistrer des informations médicales, cochez la confirmation relative au fondement légal (voir politique de confidentialité)."
    )
  }

  let sensitiveDataConsentAt = existing.sensitiveDataConsentAt
  if (
    incomingMedical &&
    !existing.sensitiveDataConsentAt &&
    isSensitiveDataConsentChecked(formData)
  ) {
    sensitiveDataConsentAt = new Date()
  }

  await prisma.client.update({
    where: { id, coachId: user.id },
    data: {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: parse("email"),
      phone: parse("phone"),
      phoneCountryCode: parse("phoneCountryCode") ?? "+33",
      gender: (parse("gender") as Gender) || null,
      birthDate: parse("birthDate") ? new Date(parse("birthDate")!) : null,
      height: parseFloat_("height"),
      fitnessLevel:
        (formData.get("fitnessLevel") as FitnessLevel) || FitnessLevel.BEGINNER,
      weeklyFrequency: parseInt_("weeklyFrequency"),
      activityLevel: (parse("activityLevel") as ActivityLevel) || null,
      bodyType: (parse("bodyType") as BodyType) || null,
      dietaryPreferences: (parse("dietaryPreferences") as DietaryPreferences) || null,
      hasTCA: formData.get("hasTCA") === "true",
      goalType: (parse("goalType") as GoalType) || null,
      goal: parse("goal"),
      goalTargetWeight: parseFloat_("goalTargetWeight"),
      goalDeadline: parse("goalDeadline") ? new Date(parse("goalDeadline")!) : null,
      coachingStartDate: parse("coachingStartDate") ? new Date(parse("coachingStartDate")!) : null,
      weightStart: parseFloat_("weightStart"),
      goalWeeklyLoss: parseFloat_("goalWeeklyLoss"),
      // Nutrition
      dailyCaloriesGoal: parseInt_("dailyCaloriesGoal"),
      dailyWaterGoal: parseFloat_("dailyWaterGoal"),
      mealBreakfastPct: parseInt_("mealBreakfastPct"),
      mealLunchPct: parseInt_("mealLunchPct"),
      mealDinnerPct: parseInt_("mealDinnerPct"),
      mealSnackPct: parseInt_("mealSnackPct"),
      macrosCarbsPct: parseInt_("macrosCarbsPct"),
      macrosProteinsPct: parseInt_("macrosProteinsPct"),
      macrosFatsPct: parseInt_("macrosFatsPct"),
      // Coordonnées
      company: parse("company"),
      address: parse("address"),
      postalCode: parse("postalCode"),
      city: parse("city"),
      country: parse("country"),
      // Réseaux sociaux
      linkedin: parse("linkedin"),
      instagram: parse("instagram"),
      facebook: parse("facebook"),
      twitter: parse("twitter"),
      // Médical
      injuries: parse("injuries"),
      medicalNotes: parse("medicalNotes"),
      contractStart: parse("contractStart")
        ? new Date(parse("contractStart")!)
        : null,
      hourlyRate: parseFloat_("hourlyRate"),
      notes: parse("notes"),
      isActive: formData.get("isActive") !== "false",
      sensitiveDataConsentAt,
    },
  })

  revalidatePath(`/dashboard/clients/${id}`)
}

export async function addMeasurement(clientId: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const clientRow = await prisma.client.findFirst({
    where: { id: clientId, coachId: user.id },
    select: { sensitiveDataConsentAt: true },
  })
  if (!clientRow) throw new Error("Client introuvable")

  if (
    !clientRow.sensitiveDataConsentAt &&
    !isMeasurementConsentChecked(formData)
  ) {
    throw new Error(
      "Pour enregistrer des mensurations, confirmez disposer d'une base légale pour ces données (voir politique de confidentialité)."
    )
  }

  const parseF = (key: string) => {
    const v = formData.get(key) as string
    return v ? parseFloat(v) : null
  }

  const dateStr = formData.get("date") as string

  await prisma.$transaction(async (tx) => {
    await tx.bodyMeasurement.create({
      data: {
        clientId,
        coachId: user.id,
        date: dateStr ? new Date(dateStr) : new Date(),
        weight: parseF("weight"),
        bodyFat: parseF("bodyFat"),
        muscleMass: parseF("muscleMass"),
        waist: parseF("waist"),
        hips: parseF("hips"),
        chest: parseF("chest"),
        leftArm: parseF("leftArm"),
        rightArm: parseF("rightArm"),
        leftThigh: parseF("leftThigh"),
        rightThigh: parseF("rightThigh"),
        notes: (formData.get("notes") as string) || null,
      },
    })

    if (!clientRow.sensitiveDataConsentAt) {
      await tx.client.update({
        where: { id: clientId },
        data: { sensitiveDataConsentAt: new Date() },
      })
    }
  })

  revalidatePath(`/dashboard/clients/${clientId}`)
}

export async function deleteMeasurement(id: string, clientId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.bodyMeasurement.delete({
    where: { id, coachId: user.id },
  })

  revalidatePath(`/dashboard/clients/${clientId}`)
}

// ─── NOTES ───────────────────────────────────────────────────────────────────

export async function createClientNote(clientId: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const content = formData.get("content") as string
  if (!content?.trim()) throw new Error("Le contenu est requis")

  await prisma.clientNote.create({
    data: { clientId, coachId: user.id, content: content.trim() },
  })

  revalidatePath(`/dashboard/clients/${clientId}`)
}

export async function updateClientNote(
  id: string,
  clientId: string,
  formData: FormData
) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const content = formData.get("content") as string
  if (!content?.trim()) throw new Error("Le contenu est requis")

  await prisma.clientNote.update({
    where: { id, coachId: user.id },
    data: { content: content.trim() },
  })

  revalidatePath(`/dashboard/clients/${clientId}`)
}

export async function deleteClientNote(id: string, clientId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.clientNote.delete({ where: { id, coachId: user.id } })
  revalidatePath(`/dashboard/clients/${clientId}`)
}

// ─── SUIVI ────────────────────────────────────────────────────────────────────

const DASH_SUIVI = "/dashboard/suivi"
const DASH_NUTRITION = "/dashboard/nutrition"

function revalidateTrackingPaths(clientId: string) {
  revalidatePath(`/dashboard/clients/${clientId}`)
  revalidatePath(DASH_SUIVI)
}

function revalidateNutritionPaths(clientId: string) {
  revalidatePath(`/dashboard/clients/${clientId}`)
  revalidatePath(DASH_NUTRITION)
}

export async function createTrackingItem(
  clientId: string,
  formData: FormData
) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const name = (formData.get("name") as string)?.trim()
  if (!name) throw new Error("Le nom est requis")

  await prisma.trackingItem.create({
    data: {
      clientId,
      coachId: user.id,
      type: formData.get("type") as TrackingItemType,
      name,
      description: (formData.get("description") as string)?.trim() || null,
      frequency: (formData.get("frequency") as string) || null,
    },
  })

  revalidateTrackingPaths(clientId)
}

export async function updateTrackingItem(
  id: string,
  clientId: string,
  formData: FormData
) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const name = (formData.get("name") as string)?.trim()
  if (!name) throw new Error("Le nom est requis")

  const lastAnsweredRaw = formData.get("lastAnsweredAt") as string | null
  const lastAnsweredAt =
    lastAnsweredRaw && lastAnsweredRaw.trim() !== ""
      ? new Date(lastAnsweredRaw)
      : null

  await prisma.trackingItem.update({
    where: { id, coachId: user.id },
    data: {
      type: formData.get("type") as TrackingItemType,
      name,
      description: (formData.get("description") as string)?.trim() || null,
      frequency: (formData.get("frequency") as string) || null,
      isActive: formData.get("isActive") === "true",
      lastAnsweredAt,
    },
  })

  revalidateTrackingPaths(clientId)
}

export async function deleteTrackingItem(id: string, clientId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.trackingItem.delete({ where: { id, coachId: user.id } })
  revalidateTrackingPaths(clientId)
}

// ─── JOURNAL NUTRITION ────────────────────────────────────────────────────────

function parseOptionalInt(formData: FormData, key: string): number | null {
  const v = formData.get(key)
  if (v === null || v === "") return null
  const n = parseInt(String(v), 10)
  return Number.isFinite(n) ? n : null
}

function parseOptionalFloat(formData: FormData, key: string): number | null {
  const v = formData.get(key)
  if (v === null || v === "") return null
  const n = parseFloat(String(v))
  return Number.isFinite(n) ? n : null
}

/** Jour civil stable (midi UTC), aligné sur le modèle Prisma. */
function nutritionDayFromInput(dateStr: string): Date {
  return new Date(`${dateStr}T12:00:00.000Z`)
}

export async function upsertNutritionDayLog(clientId: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const clientRow = await prisma.client.findFirst({
    where: { id: clientId, coachId: user.id },
    select: { id: true },
  })
  if (!clientRow) throw new Error("Client introuvable")

  const dateStr = formData.get("date") as string
  if (!dateStr) throw new Error("La date est requise")

  const caloriesConsumed = parseOptionalInt(formData, "caloriesConsumed")
  if (caloriesConsumed === null || caloriesConsumed < 0) {
    throw new Error("Les calories consommées sont requises (nombre positif ou nul).")
  }

  const payload = {
    caloriesConsumed,
    proteinG: parseOptionalFloat(formData, "proteinG"),
    carbsG: parseOptionalFloat(formData, "carbsG"),
    fatG: parseOptionalFloat(formData, "fatG"),
    waterL: parseOptionalFloat(formData, "waterL"),
    breakfastKcal: parseOptionalInt(formData, "breakfastKcal"),
    lunchKcal: parseOptionalInt(formData, "lunchKcal"),
    dinnerKcal: parseOptionalInt(formData, "dinnerKcal"),
    snackKcal: parseOptionalInt(formData, "snackKcal"),
  }

  const dayDate = nutritionDayFromInput(dateStr)
  const existingId = (formData.get("id") as string) || ""

  if (existingId) {
    const existing = await prisma.nutritionDayLog.findFirst({
      where: { id: existingId, coachId: user.id, clientId },
    })
    if (!existing) throw new Error("Entrée introuvable")

    const prevTime = existing.date.getTime()
    if (prevTime !== dayDate.getTime()) {
      const conflict = await prisma.nutritionDayLog.findUnique({
        where: { clientId_date: { clientId, date: dayDate } },
      })
      if (conflict && conflict.id !== existingId) {
        throw new Error(
          "Une entrée existe déjà pour ce jour. Supprimez-la ou choisissez une autre date."
        )
      }
      await prisma.nutritionDayLog.delete({ where: { id: existingId } })
      await prisma.nutritionDayLog.create({
        data: {
          clientId,
          coachId: user.id,
          date: dayDate,
          ...payload,
        },
      })
    } else {
      await prisma.nutritionDayLog.update({
        where: { id: existingId },
        data: payload,
      })
    }
  } else {
    await prisma.nutritionDayLog.upsert({
      where: { clientId_date: { clientId, date: dayDate } },
      create: {
        clientId,
        coachId: user.id,
        date: dayDate,
        ...payload,
      },
      update: payload,
    })
  }

  revalidateNutritionPaths(clientId)
}

export async function deleteNutritionDayLog(id: string, clientId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const row = await prisma.nutritionDayLog.findFirst({
    where: { id, coachId: user.id, clientId },
  })
  if (!row) throw new Error("Entrée introuvable")

  await prisma.nutritionDayLog.delete({ where: { id } })

  revalidateNutritionPaths(clientId)
}

export async function toggleActiveClient(id: string, isActive: boolean) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.client.update({
    where: { id, coachId: user.id },
    data: { isActive },
  })

  revalidatePath(`/dashboard/clients/${id}`)
  revalidatePath("/dashboard/clients")
}

// ─── CARTE DOULEURS (zones — données sensibles) ───────────────────────────────

export async function upsertClientPainNote(
  clientId: string,
  regionKey: string,
  note: string
) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const client = await prisma.client.findFirst({
    where: { id: clientId, coachId: user.id },
    select: { isDemo: true },
  })
  if (!client) throw new Error("Client introuvable")
  if (client.isDemo) {
    throw new Error(
      "La carte des douleurs ne peut pas être enregistrée pour le client de démonstration."
    )
  }

  const trimmed = note.trim()
  if (!trimmed) {
    await prisma.clientPainNote.deleteMany({
      where: { clientId, regionKey },
    })
  } else {
    await prisma.clientPainNote.upsert({
      where: {
        clientId_regionKey: { clientId, regionKey },
      },
      create: {
        clientId,
        coachId: user.id,
        regionKey,
        note: trimmed,
      },
      update: { note: trimmed },
    })
  }

  revalidatePath(`/dashboard/clients/${clientId}`)
}
