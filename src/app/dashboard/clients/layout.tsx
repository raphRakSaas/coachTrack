import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { ClientsLayoutShell } from "@/components/dashboard/clients/clients-layout-shell"

export default async function ClientsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const clients = await prisma.client.findMany({
    where: { coachId: user.id },
    orderBy: [{ isDemo: "desc" }, { isActive: "desc" }, { firstName: "asc" }],
    include: {
      _count: { select: { sessions: true } },
      sessions: {
        orderBy: { date: "desc" },
        take: 1,
        select: { date: true },
      },
    },
  })

  return (
    <ClientsLayoutShell clients={clients}>{children}</ClientsLayoutShell>
  )
}
