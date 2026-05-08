import { notFound, redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { SessionDetail } from "@/components/dashboard/sessions/session-detail"

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const [session, exercises] = await Promise.all([
    prisma.session.findUnique({
      where: { id, coachId: user.id },
      include: {
        client: { select: { id: true, firstName: true, lastName: true } },
        exercises: {
          orderBy: { order: "asc" },
          include: {
            exercise: { select: { id: true, name: true, muscleGroup: true } },
            sets: { orderBy: { setNumber: "asc" } },
          },
        },
      },
    }),
    prisma.exercise.findMany({
      where: { OR: [{ isGlobal: true }, { coachId: user.id }] },
      orderBy: [{ muscleGroup: "asc" }, { name: "asc" }],
      select: { id: true, name: true, muscleGroup: true },
    }),
  ])

  if (!session) notFound()

  return <SessionDetail session={session} exercises={exercises} />
}
