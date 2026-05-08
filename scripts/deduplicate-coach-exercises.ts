import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"
import ws from "ws"
import { config } from "dotenv"

config({ path: ".env.local" })
neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

type DuplicateRow = {
  coachId: string
  name: string
  count: number
}

async function main() {
  const duplicates = (await prisma.$queryRaw<
    DuplicateRow[]
  >`SELECT "coachId" as "coachId", "name" as "name", COUNT(*)::int as "count"
     FROM "Exercise"
     WHERE "coachId" IS NOT NULL
     GROUP BY "coachId", "name"
     HAVING COUNT(*) > 1`)

  if (!duplicates.length) {
    console.log("✓ Aucun doublon (coachId, name).")
    return
  }

  console.log(`⚠️  Doublons trouvés: ${duplicates.length}`)

  for (const duplicate of duplicates) {
    const rows = await prisma.exercise.findMany({
      where: { coachId: duplicate.coachId, name: duplicate.name, isGlobal: false },
      orderBy: { id: "asc" },
      select: { id: true, name: true },
    })

    // Keep the first as-is, rename subsequent.
    for (let idx = 1; idx < rows.length; idx++) {
      const row = rows[idx]
      if (!row) continue
      const newName = `${duplicate.name} (${idx + 1})`
      await prisma.exercise.update({
        where: { id: row.id },
        data: { name: newName },
      })
      console.log(`- Renommé: ${duplicate.name} -> ${newName}`)
    }
  }

  console.log("✓ Doublons corrigés.")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

