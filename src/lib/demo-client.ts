import { FitnessLevel, Gender, GoalType, Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"

/** Identité affichée pour le client fictif (données d’exemple, pas une personne réelle). */
export const DEMO_CLIENT_PROFILE = {
  firstName: "Marie",
  lastName: "Dupont",
  notes:
    "Client fictif pour explorer Revo avec des exemples. Les mesures et séances sont des données de démonstration.",
} as const

function daysAgo(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(12, 0, 0, 0)
  return date
}

/**
 * Crée le client démo pour un coach s’il n’existe pas déjà (idempotent).
 * Une ligne Client par coach ; même scénario pour tous les comptes.
 */
export async function ensureDemoClientForCoach(coachId: string): Promise<void> {
  const existing = await prisma.client.findFirst({
    where: { coachId, isDemo: true },
    select: { id: true },
  })
  if (existing) return

  const birth = new Date()
  birth.setFullYear(birth.getFullYear() - 32)

  await prisma.$transaction(async (tx) => {
    const client = await tx.client.create({
      data: {
        coachId,
        isDemo: true,
        firstName: DEMO_CLIENT_PROFILE.firstName,
        lastName: DEMO_CLIENT_PROFILE.lastName,
        email: null,
        phone: null,
        gender: Gender.FEMALE,
        birthDate: birth,
        height: 165,
        fitnessLevel: FitnessLevel.INTERMEDIATE,
        weeklyFrequency: 3,
        goalType: GoalType.WEIGHT_LOSS,
        goal: "Exemple d’objectif pour la démo — perte de poids et habitude sportive.",
        goalTargetWeight: 63,
        goalDeadline: null,
        injuries: null,
        medicalNotes: null,
        notes: DEMO_CLIENT_PROFILE.notes,
        isActive: true,
        contractStart: null,
        hourlyRate: null,
        sensitiveDataConsentAt: null,
      },
    })

    const weightPoints: Prisma.BodyMeasurementCreateManyInput[] = [
      { clientId: client.id, coachId, date: daysAgo(42), weight: 68 },
      { clientId: client.id, coachId, date: daysAgo(28), weight: 67 },
      { clientId: client.id, coachId, date: daysAgo(14), weight: 66 },
      { clientId: client.id, coachId, date: daysAgo(4), weight: 65.2 },
    ]
    await tx.bodyMeasurement.createMany({ data: weightPoints })

    await tx.session.createMany({
      data: [
        {
          coachId,
          clientId: client.id,
          date: daysAgo(10),
          duration: 50,
          notes: "Séance d’exemple (fictive).",
          rpe: 7,
          mood: 4,
          energy: 4,
        },
        {
          coachId,
          clientId: client.id,
          date: daysAgo(3),
          duration: 45,
          notes: "Deuxième séance de démonstration.",
          rpe: 6,
          mood: 5,
          energy: 4,
        },
      ],
    })
  })
}

/** Rattrapage : tous les coaches sans client démo. */
export async function ensureDemoClientsForAllCoaches(): Promise<{
  coaches: number
  created: number
}> {
  const coaches = await prisma.user.findMany({ select: { id: true } })
  let created = 0
  for (const { id } of coaches) {
    const hadDemo = await prisma.client.findFirst({
      where: { coachId: id, isDemo: true },
      select: { id: true },
    })
    await ensureDemoClientForCoach(id)
    if (!hadDemo) created++
  }
  return { coaches: coaches.length, created }
}
