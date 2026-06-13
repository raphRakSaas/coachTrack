import { prisma } from "@/lib/prisma"
import { SECTION_ACCENTS } from "@/lib/colors"
import { Sessions6mBarChart } from "@/components/charts/sessions-6m-bar-chart"
import { SessionsWeekdayDonut } from "@/components/charts/sessions-weekday-donut"
import { cn } from "@/lib/utils"
import {
  getCoachId,
  startOfMonthsAgo,
} from "@/components/dashboard/home/dashboard-date-utils"

export async function DashboardTrendRow() {
  const user = await getCoachId()

  const [sessionsLast30Days, sessionsLast6Months] = await Promise.all([
    prisma.session.findMany({
      where: {
        coachId: user.id,
        date: { gte: new Date(new Date().setDate(new Date().getDate() - 29)) },
      },
      select: { date: true },
    }),
    prisma.session.findMany({
      where: { coachId: user.id, date: { gte: startOfMonthsAgo(5) } },
      select: { date: true },
    }),
  ])

  const monthBuckets = []
  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const monthStart = startOfMonthsAgo(monthOffset)
    const nextMonth = startOfMonthsAgo(monthOffset - 1)
    const count = sessionsLast6Months.filter((session) => {
      const sessionDate = new Date(session.date)
      return sessionDate >= monthStart && sessionDate < nextMonth
    }).length
    monthBuckets.push({
      monthLabel: monthStart.toLocaleDateString("fr-FR", { month: "short" }),
      count,
    })
  }

  const weekdayOrder = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."]
  const weekdayBuckets: Record<string, number> = Object.fromEntries(
    weekdayOrder.map((label) => [label, 0])
  )
  for (const session of sessionsLast30Days) {
    const label = new Date(session.date).toLocaleDateString("fr-FR", {
      weekday: "short",
    })
    if (label in weekdayBuckets) weekdayBuckets[label] += 1
  }
  const weekdayData = weekdayOrder.map((label) => ({
    label,
    count: weekdayBuckets[label] ?? 0,
  }))

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border bg-card p-5 opacity-0 revo-fade-up anim-delay-400",
          "lg:col-span-2"
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            background: `radial-gradient(ellipse at bottom left, ${SECTION_ACCENTS.dashboard.hex}, transparent 55%)`,
          }}
        />
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Tendance (6 derniers mois)
            </h2>
            <p className="text-[11px] text-muted-foreground">Séances par mois</p>
          </div>
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{
              background: `${SECTION_ACCENTS.dashboard.hex}15`,
              color: SECTION_ACCENTS.dashboard.hex,
            }}
          >
            6 mois
          </span>
        </div>
        <Sessions6mBarChart data={monthBuckets} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 opacity-0 revo-fade-up anim-delay-500">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-foreground">Jours favoris</h2>
          <p className="text-[11px] text-muted-foreground">
            Répartition (30 derniers jours)
          </p>
        </div>
        <SessionsWeekdayDonut data={weekdayData} />
      </div>
    </div>
  )
}
