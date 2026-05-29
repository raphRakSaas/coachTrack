import type { User } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { refreshDemoClientForCoach } from "@/lib/demo-client"

/** Clerk user ID du coach démo partagé (variable d'environnement). */
export function getDemoCoachClerkId(): string | null {
  const clerkId = process.env.DEMO_COACH_CLERK_ID?.trim()
  return clerkId || null
}

export function isDemoCoachClerkId(clerkId: string | null | undefined): boolean {
  if (!clerkId) return false
  const demoClerkId = getDemoCoachClerkId()
  return Boolean(demoClerkId && demoClerkId === clerkId)
}

export function isSystemDemoCoach(user: Pick<User, "clerkId"> | null | undefined): boolean {
  if (!user) return false
  return isDemoCoachClerkId(user.clerkId)
}

/**
 * Chemin rapide pour /api/demo/start : vérifie le compte sans resynchroniser les données.
 */
export async function ensureSystemDemoCoachSession(clerkIdOverride?: string): Promise<User> {
  const clerkId = clerkIdOverride?.trim() || getDemoCoachClerkId()
  if (!clerkId) {
    throw new Error(
      "DEMO_COACH_CLERK_ID manquant. Lancez npm run db:ensure-demo-coach pour le créer automatiquement.",
    )
  }

  const demoEmail = process.env.DEMO_COACH_EMAIL?.trim() || "demo@revo.app"

  const user = await prisma.user.upsert({
    where: { clerkId },
    create: {
      clerkId,
      email: demoEmail,
      name: "Coach Démo",
      specialty: "Préparation physique & remise en forme",
      bio: "Compte de démonstration Revo — données fictives pour explorer l'application.",
      yearsExperience: 8,
      onboardingCompleted: true,
    },
    update: {
      onboardingCompleted: true,
    },
  })

  const demoClientExists = await prisma.client.findFirst({
    where: { coachId: user.id, isDemo: true },
    select: { id: true },
  })

  if (!demoClientExists) {
    await refreshDemoClientForCoach(user.id)
  }

  return user
}

/**
 * Prépare le compte coach démo en base (seed complet — scripts uniquement).
 */
export async function ensureSystemDemoCoachReady(clerkIdOverride?: string): Promise<User> {
  const user = await ensureSystemDemoCoachSession(clerkIdOverride)
  await refreshDemoClientForCoach(user.id)
  return user
}
