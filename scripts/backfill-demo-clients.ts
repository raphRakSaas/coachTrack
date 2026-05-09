/**
 * Rattrapage : crée le client « Marie Dupont » (démo) pour chaque coach
 * déjà inscrit avant le webhook. À lancer une fois en local / prod :
 *
 *   npx tsx scripts/backfill-demo-clients.ts
 */
import { config } from "dotenv"

config({ path: ".env.local" })

async function main() {
  const { ensureDemoClientsForAllCoaches } = await import(
    "../src/lib/demo-client"
  )
  const { prisma } = await import("../src/lib/prisma")
  try {
    const result = await ensureDemoClientsForAllCoaches()
    console.log(
      `Coaches : ${result.coaches} · Clients démo créés cette fois : ${result.created}`
    )
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
