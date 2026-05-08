"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { FitnessLevel, GoalType, Gender } from "@prisma/client"

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
      goalType: (parse("goalType") as GoalType) || null,
      goal: parse("goal"),
      goalTargetWeight: parseFloat_("goalTargetWeight"),
      goalDeadline: parse("goalDeadline") ? new Date(parse("goalDeadline")!) : null,
      injuries: parse("injuries"),
      medicalNotes: parse("medicalNotes"),
      contractStart: parse("contractStart")
        ? new Date(parse("contractStart")!)
        : null,
      hourlyRate: parseFloat_("hourlyRate"),
      notes: parse("notes"),
      isActive: formData.get("isActive") !== "false",
    },
  })

  revalidatePath(`/dashboard/clients/${id}`)
}

export async function addMeasurement(clientId: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const parseF = (key: string) => {
    const v = formData.get(key) as string
    return v ? parseFloat(v) : null
  }

  const dateStr = formData.get("date") as string

  await prisma.bodyMeasurement.create({
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
