import Link from "next/link"
import { Activity, ArrowUpRight } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { SECTION_ACCENTS } from "@/lib/colors"
import { ClientAvatar } from "@/components/ui/client-avatar"
import { SessionsSparkline } from "@/components/charts/sessions-sparkline"
import { cn } from "@/lib/utils"
import { getCoachId } from "@/components/dashboard/home/dashboard-date-utils"

export async function DashboardPulseRow() {
  const user = await getCoachId()

  const last14 = new Date()
  last14.setDate(last14.getDate() - 13)
  last14.setHours(0, 0, 0, 0)

  const [sessionsForSparkline, topClients] = await Promise.all([
    prisma.session.findMany({
      where: { coachId: user.id, date: { gte: last14 } },
      select: { date: true },
    }),
    prisma.client.findMany({
      where: { coachId: user.id, isActive: true },
      take: 5,
      orderBy: { sessions: { _count: "desc" } },
      include: { _count: { select: { sessions: true } } },
    }),
  ])

  const buckets = []
  for (let dayIndex = 0; dayIndex < 14; dayIndex++) {
    const dayDate = new Date(last14)
    dayDate.setDate(last14.getDate() + dayIndex)
    const dayKey = dayDate.toISOString().split("T")[0]
    buckets.push({
      day: dayDate.toLocaleDateString("fr-FR", { weekday: "short" }),
      count: sessionsForSparkline.filter(
        (session) =>
          new Date(session.date).toISOString().split("T")[0] === dayKey
      ).length,
    })
  }

  return (
    <div className="grid grid-cols-1 gap-5 pb-4 lg:grid-cols-3">
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border bg-card p-5 opacity-0 revo-fade-up anim-delay-500",
          "lg:col-span-2"
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: `${SECTION_ACCENTS.sessions.hex}18` }}
            >
              <Activity
                className="h-3.5 w-3.5"
                style={{ color: SECTION_ACCENTS.sessions.hex }}
              />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Pouls d&apos;activité
              </h2>
              <p className="text-[11px] text-muted-foreground">14 derniers jours</p>
            </div>
          </div>
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{
              background: `${SECTION_ACCENTS.sessions.hex}15`,
              color: SECTION_ACCENTS.sessions.hex,
            }}
          >
            {sessionsForSparkline.length} séance
            {sessionsForSparkline.length !== 1 ? "s" : ""}
          </span>
        </div>
        <SessionsSparkline data={buckets} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 opacity-0 revo-fade-up anim-delay-600">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Top clients</h2>
          <Link
            href="/dashboard/clients"
            className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Tous
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {topClients.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            Aucun client actif
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {topClients.map((client, index) => (
              <li key={client.id}>
                <Link
                  href={`/dashboard/clients/${client.id}`}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted/50"
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                    style={
                      index === 0
                        ? { background: "#f59e0b20", color: "#f59e0b" }
                        : index === 1
                          ? { background: "#94a3b820", color: "#94a3b8" }
                          : { background: "#78716c20", color: "#78716c" }
                    }
                  >
                    {index + 1}
                  </span>
                  <ClientAvatar
                    firstName={client.firstName}
                    lastName={client.lastName}
                    size="sm"
                  />
                  <span className="flex-1 truncate text-sm font-medium text-foreground">
                    {client.firstName} {client.lastName}
                  </span>
                  <span
                    className="shrink-0 rounded-lg px-2 py-0.5 text-[11px] font-bold tabular-nums"
                    style={{
                      background: `${SECTION_ACCENTS.clients.hex}12`,
                      color: SECTION_ACCENTS.clients.hex,
                    }}
                  >
                    {client._count.sessions}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
