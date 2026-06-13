import { prisma } from "@/lib/prisma"
import { startOfMonth } from "@/components/dashboard/home/dashboard-date-utils"

export async function DashboardHeroSummary({ coachId }: { coachId: string }) {
  const [activeClients, sessionsThisMonth] = await Promise.all([
    prisma.client.count({ where: { coachId, isActive: true } }),
    prisma.session.count({
      where: { coachId, date: { gte: startOfMonth() } },
    }),
  ])

  return (
    <p className="mt-3 text-sm text-white/40">
      {activeClients > 0
        ? `${activeClients} client${activeClients > 1 ? "s" : ""} actif${activeClients > 1 ? "s" : ""} · ${sessionsThisMonth} séance${sessionsThisMonth > 1 ? "s" : ""} ce mois`
        : "Bienvenue — ajoutez votre premier client pour commencer."}
    </p>
  )
}
