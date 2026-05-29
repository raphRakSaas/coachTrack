/**
 * Prépare le compte coach démo partagé (Clerk + base Neon).
 *
 * Résout ou crée automatiquement demo@revo.app dans Clerk si DEMO_COACH_CLERK_ID
 * n'est pas encore défini, puis affiche les lignes à ajouter dans .env.local.
 *
 *   npm run db:ensure-demo-coach
 */
import { config } from "dotenv"

config({ path: ".env.local" })

async function main() {
  const { prisma } = await import("../src/lib/prisma")
  const { ensureSystemDemoCoachReady } = await import("../src/lib/demo-account")
  const { resolveDemoCoachClerkIdForSetup } = await import("../src/lib/clerk-demo-setup")

  const resolved = await resolveDemoCoachClerkIdForSetup()
  const user = await ensureSystemDemoCoachReady(resolved.clerkId)

  const demoClient = await prisma.client.findFirst({
    where: { coachId: user.id, isDemo: true },
    select: { id: true, firstName: true, lastName: true },
  })

  console.log("Coach démo prêt :", {
    userId: user.id,
    clerkId: user.clerkId,
    email: user.email,
    demoClient: demoClient
      ? `${demoClient.firstName} ${demoClient.lastName} (${demoClient.id})`
      : "aucun",
    clerkSource: resolved.source,
  })

  if (resolved.source !== "env") {
    console.log("\nAjoutez ces lignes dans .env.local et sur Vercel :\n")
    console.log(`DEMO_COACH_CLERK_ID=${resolved.clerkId}`)
    console.log(`DEMO_COACH_EMAIL=${resolved.email}`)
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
  .finally(async () => {
    const { prisma } = await import("../src/lib/prisma")
    await prisma.$disconnect()
  })
