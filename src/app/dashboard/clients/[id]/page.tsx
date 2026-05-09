import { notFound, redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { ClientDetail } from "@/components/dashboard/clients/client-detail"

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const client = await prisma.client.findUnique({
    where: { id, coachId: user.id },
    include: {
      measurements: { orderBy: { date: "desc" } },
      sessions: {
        orderBy: { date: "desc" },
        take: 50,
        include: {
          _count: { select: { exercises: true } },
        },
      },
      programs: {
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { workoutDays: true } },
        },
      },
      clientNotes: { orderBy: { createdAt: "desc" } },
      trackingItems: { orderBy: { createdAt: "asc" } },
    },
  })

  if (!client) notFound()

  return <ClientDetail client={client} />
}
