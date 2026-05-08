import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"
import ws from "ws"
import { config } from "dotenv"

config({ path: ".env.local" })
neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const exercises = await prisma.exercise.findMany({
    orderBy: [{ muscleGroup: "asc" }, { name: "asc" }],
  })

  const totalCount = exercises.length
  const withImageUrlCount = exercises.filter((ex: any) => Boolean(ex.imageUrl))
    .length
  const globalCount = exercises.filter((ex) => ex.isGlobal).length
  const customCount = totalCount - globalCount

  console.log({ totalCount, globalCount, customCount, withImageUrlCount })

  const sample = exercises.slice(0, 12).map((ex: any) => ({
    name: ex.name,
    isGlobal: ex.isGlobal,
    muscleGroup: ex.muscleGroup,
    imageUrl: ex.imageUrl,
  }))
  console.log("sample:", sample)

  const nullImageExamples = exercises
    .filter((ex: any) => !ex.imageUrl)
    .slice(0, 12)
    .map((ex) => ({ name: ex.name, isGlobal: ex.isGlobal, muscleGroup: ex.muscleGroup }))
  console.log("nullImageExamples:", nullImageExamples)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

