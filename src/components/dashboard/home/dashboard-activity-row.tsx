import Link from "next/link"
import { ArrowUpRight, CalendarCheck } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { SECTION_ACCENTS } from "@/lib/colors"
import { buttonVariants } from "@/components/ui/button"
import { ClientAvatar } from "@/components/ui/client-avatar"
import { Sessions30dChart } from "@/components/charts/sessions-30d-chart"
import { cn } from "@/lib/utils"
import { getCoachId, startOfDay } from "@/components/dashboard/home/dashboard-date-utils"

export async function DashboardActivityRow() {
  const user = await getCoachId()

  const [recentSessions, sessionsLast30Days] = await Promise.all([
    prisma.session.findMany({
      where: { coachId: user.id },
      take: 6,
      orderBy: { date: "desc" },
      include: { client: { select: { firstName: true, lastName: true } } },
    }),
    prisma.session.findMany({
      where: {
        coachId: user.id,
        date: { gte: new Date(new Date().setDate(new Date().getDate() - 29)) },
      },
      select: { date: true },
    }),
  ])

  const today = startOfDay()
  const start30 = new Date(today)
  start30.setDate(today.getDate() - 29)
  const sessions30 = []

  for (let dayIndex = 0; dayIndex < 30; dayIndex++) {
    const dayDate = new Date(start30)
    dayDate.setDate(start30.getDate() + dayIndex)
    const dayKey = dayDate.toISOString().split("T")[0]
    sessions30.push({
      dateLabel: dayDate.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      }),
      count: sessionsLast30Days.filter(
        (session) =>
          new Date(session.date).toISOString().split("T")[0] === dayKey
      ).length,
    })
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border bg-card p-5 opacity-0 revo-fade-up anim-delay-300",
          "lg:col-span-2"
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            background: `radial-gradient(ellipse at top right, ${SECTION_ACCENTS.sessions.hex}, transparent 55%)`,
          }}
        />
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Activité (30 derniers jours)
            </h2>
            <p className="text-[11px] text-muted-foreground">
              {sessionsLast30Days.length} séance
              {sessionsLast30Days.length !== 1 ? "s" : ""}
            </p>
          </div>
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{
              background: `${SECTION_ACCENTS.sessions.hex}15`,
              color: SECTION_ACCENTS.sessions.hex,
            }}
          >
            30j
          </span>
        </div>
        <Sessions30dChart data={sessions30} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 opacity-0 revo-fade-up anim-delay-400">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Séances récentes
          </h2>
          <Link
            href="/dashboard/sessions"
            className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Tout voir
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {recentSessions.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <CalendarCheck className="mb-3 h-9 w-9 text-muted-foreground/25" />
            <p className="text-sm font-medium text-muted-foreground">
              Aucune séance
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground/70">
              Ajoutez un client pour commencer.
            </p>
            <Link
              href="/dashboard/clients"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-4 text-xs"
              )}
            >
              Ajouter un client
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-1">
            {recentSessions.map((session) => (
              <li key={session.id}>
                <Link
                  href={`/dashboard/sessions/${session.id}`}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/50"
                >
                  <ClientAvatar
                    firstName={session.client.firstName}
                    lastName={session.client.lastName}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {session.client.firstName} {session.client.lastName}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(session.date).toLocaleDateString("fr-FR", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  {session.duration && (
                    <span className="shrink-0 rounded-lg bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                      {session.duration}′
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
