import Link from "next/link"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { SECTION_ACCENTS } from "@/lib/colors"
import { cn } from "@/lib/utils"
import {
  getCoachId,
  percentChange,
  startOfMonth,
  startOfPreviousMonth,
  startOfPreviousWeek,
  startOfWeek,
} from "@/components/dashboard/home/dashboard-date-utils"

export async function DashboardMetrics() {
  const user = await getCoachId()

  const [
    activeClients,
    sessionsThisWeek,
    sessionsThisMonth,
    sessionsPreviousWeek,
    sessionsPreviousMonth,
    activeProgramsCount,
  ] = await Promise.all([
    prisma.client.count({ where: { coachId: user.id, isActive: true } }),
    prisma.session.count({
      where: { coachId: user.id, date: { gte: startOfWeek() } },
    }),
    prisma.session.count({
      where: { coachId: user.id, date: { gte: startOfMonth() } },
    }),
    prisma.session.count({
      where: {
        coachId: user.id,
        date: { gte: startOfPreviousWeek(), lt: startOfWeek() },
      },
    }),
    prisma.session.count({
      where: {
        coachId: user.id,
        date: { gte: startOfPreviousMonth(), lt: startOfMonth() },
      },
    }),
    prisma.program.count({ where: { coachId: user.id, isActive: true } }),
  ])

  const weekDelta = percentChange(sessionsThisWeek, sessionsPreviousWeek)
  const monthDelta = percentChange(sessionsThisMonth, sessionsPreviousMonth)

  const metrics = [
    {
      label: "Clients actifs",
      value: activeClients,
      trend: null as number | null,
      href: "/dashboard/clients",
      accent: SECTION_ACCENTS.clients.hex,
      delay: "anim-delay-100",
    },
    {
      label: "Séances cette semaine",
      value: sessionsThisWeek,
      trend: weekDelta,
      href: "/dashboard/sessions",
      accent: SECTION_ACCENTS.sessions.hex,
      delay: "anim-delay-200",
    },
    {
      label: "Programmes actifs",
      value: activeProgramsCount,
      trend: null,
      href: "/dashboard/programs",
      accent: SECTION_ACCENTS.programs.hex,
      delay: "anim-delay-300",
    },
    {
      label: "Séances ce mois",
      value: sessionsThisMonth,
      trend: monthDelta,
      href: "/dashboard/sessions",
      accent: SECTION_ACCENTS.dashboard.hex,
      delay: "anim-delay-400",
    },
  ]

  return (
    <div className="border-b border-border">
      <div className="grid grid-cols-2 divide-x divide-border lg:grid-cols-4">
        {metrics.map((metric) => (
          <Link
            key={metric.label}
            href={metric.href}
            className={cn(
              "group flex flex-col gap-1 px-6 py-6 transition-colors hover:bg-muted/40 opacity-0 revo-fade-up",
              metric.delay
            )}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tabular-nums tracking-tight text-foreground">
                {metric.value.toLocaleString("fr-FR")}
              </span>
              {metric.trend !== null && (
                <span
                  className={cn(
                    "text-xs font-semibold",
                    metric.trend >= 0 ? "text-emerald-500" : "text-red-500"
                  )}
                >
                  {metric.trend >= 0 ? (
                    <ArrowUpRight className="inline h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="inline h-3 w-3" />
                  )}
                  {Math.abs(metric.trend)}%
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground/70">
              {metric.label}
            </span>
            <div
              className="mt-1 h-0.5 w-0 rounded-full transition-all duration-300 group-hover:w-8"
              style={{ background: metric.accent }}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
