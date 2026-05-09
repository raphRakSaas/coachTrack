import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { ClientListPanel } from "@/components/dashboard/clients/client-list-panel"

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
    <div className="flex h-full min-h-0 overflow-hidden">
      <ClientListPanel clients={clients} />
      <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}
