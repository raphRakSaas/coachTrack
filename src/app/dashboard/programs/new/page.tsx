import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { ProgramStepper } from "@/components/dashboard/programs/program-stepper"

export default async function NewProgramPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const [clients, exercises] = await Promise.all([
    prisma.client.findMany({
      where: { coachId: user.id, isActive: true },
      orderBy: { firstName: "asc" },
      select: { id: true, firstName: true, lastName: true },
    }),
    prisma.exercise.findMany({
      where: { OR: [{ isGlobal: true }, { coachId: user.id }] },
      orderBy: [{ muscleGroup: "asc" }, { name: "asc" }],
      select: { id: true, name: true, muscleGroup: true },
    }),
  ])

  if (clients.length === 0) redirect("/dashboard/clients")

  return <ProgramStepper clients={clients} exercises={exercises} />
}
