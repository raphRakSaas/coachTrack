import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Users,
  CalendarCheck,
  TrendingUp,
  Plus,
  ArrowRight,
  Activity,
  ClipboardList,
} from "lucide-react"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { SECTION_ACCENTS } from "@/lib/colors"
import { buttonVariants } from "@/components/ui/button"
import { ClientAvatar } from "@/components/ui/client-avatar"
import { SessionsSparkline } from "@/components/charts/sessions-sparkline"
import { StatisticsCard, type StatisticItem } from "@/components/dashboard/overview/statistics-card"
import { AnalyticsCard } from "@/components/dashboard/overview/analytics-card"
import { Sessions30dChart } from "@/components/charts/sessions-30d-chart"
import { Sessions6mBarChart } from "@/components/charts/sessions-6m-bar-chart"
import { SessionsWeekdayDonut } from "@/components/charts/sessions-weekday-donut"

function startOfDay(d = new Date()) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function startOfWeek() {
  const d = startOfDay()
  const diff = d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1)
  d.setDate(diff)
  return d
}

function startOfMonth() {
  const d = startOfDay()
  d.setDate(1)
  return d
}

function startOfPreviousWeek() {
  const d = startOfWeek()
  d.setDate(d.getDate() - 7)
  return d
}

function startOfPreviousMonth() {
  const d = startOfMonth()
  d.setMonth(d.getMonth() - 1)
  return d
}

function startOfMonthsAgo(monthsAgo: number) {
  const d = startOfMonth()
  d.setMonth(d.getMonth() - monthsAgo)
  return d
}

function greetingByHour() {
  const h = new Date().getHours()
  if (h < 12) return "Bonjour"
  if (h < 18) return "Bon après-midi"
  return "Bonsoir"
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const last14 = new Date()
  last14.setDate(last14.getDate() - 13)
  last14.setHours(0, 0, 0, 0)

  const [
    activeClients,
    sessionsThisWeek,
    sessionsThisMonth,
    sessionsPreviousWeek,
    sessionsPreviousMonth,
    recentSessions,
    sessionsForSparkline,
    topClients,
    activeProgramsCount,
    customExercisesCount,
    sessionsLast30Days,
    sessionsLast6Months,
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
    prisma.session.findMany({
      where: { coachId: user.id },
      take: 6,
      orderBy: { date: "desc" },
      include: { client: { select: { firstName: true, lastName: true } } },
    }),
    prisma.session.findMany({
      where: { coachId: user.id, date: { gte: last14 } },
      select: { date: true },
    }),
    prisma.client.findMany({
      where: { coachId: user.id, isActive: true },
      take: 4,
      orderBy: { sessions: { _count: "desc" } },
      include: { _count: { select: { sessions: true } } },
    }),
    prisma.program.count({ where: { coachId: user.id, isActive: true } }),
    prisma.exercise.count({ where: { coachId: user.id, isGlobal: false } }),
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

  // Build 14-day sparkline buckets
  const buckets: { day: string; count: number }[] = []
  for (let i = 0; i < 14; i++) {
    const d = new Date(last14)
    d.setDate(last14.getDate() + i)
    const key = d.toISOString().split("T")[0]
    buckets.push({
      day: d.toLocaleDateString("fr-FR", { weekday: "short" }),
      count: sessionsForSparkline.filter(
        (s) => new Date(s.date).toISOString().split("T")[0] === key
      ).length,
    })
  }

  const stats = [
    {
      label: "Clients actifs",
      value: activeClients,
      icon: Users,
      href: "/dashboard/clients",
      accent: SECTION_ACCENTS.clients,
    },
    {
      label: "Séances cette semaine",
      value: sessionsThisWeek,
      icon: CalendarCheck,
      href: "/dashboard/sessions",
      accent: SECTION_ACCENTS.sessions,
    },
    {
      label: "Programmes actifs",
      value: activeProgramsCount,
      icon: ClipboardList,
      href: "/dashboard/programs",
      accent: SECTION_ACCENTS.programs,
    },
    {
      label: "Total ce mois",
      value: sessionsThisMonth,
      icon: TrendingUp,
      href: "/dashboard/sessions",
      accent: SECTION_ACCENTS.dashboard,
    },
  ]

  const firstName = user.name?.split(" ")[0] ?? null
  const welcomeTitle = `${greetingByHour()}${firstName ? `, ${firstName}` : ""}`

  const percent = (current: number, previous: number) => {
    if (previous <= 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  const weekDelta = percent(sessionsThisWeek, sessionsPreviousWeek)
  const monthDelta = percent(sessionsThisMonth, sessionsPreviousMonth)

  const statisticsItems: StatisticItem[] = [
    {
      title: "Clients actifs",
      value: activeClients.toLocaleString("fr-FR"),
      statusLabel: "Cette semaine",
      statusValue: `${sessionsThisWeek.toLocaleString("fr-FR")} séances`,
      isPositive: sessionsThisWeek >= sessionsPreviousWeek,
      cardIcon: "solar:users-group-rounded-line-duotone",
      statusIcon:
        sessionsThisWeek >= sessionsPreviousWeek
          ? "solar:course-up-line-duotone"
          : "solar:course-down-line-duotone",
    },
    {
      title: "Séances",
      value: sessionsThisMonth.toLocaleString("fr-FR"),
      statusLabel: "Vs mois dernier",
      statusValue: `${monthDelta > 0 ? "+" : ""}${monthDelta}%`,
      isPositive: monthDelta >= 0,
      cardIcon: "solar:calendar-line-duotone",
      statusIcon:
        monthDelta >= 0
          ? "solar:course-up-line-duotone"
          : "solar:course-down-line-duotone",
    },
    {
      title: "Programmes",
      value: activeProgramsCount.toLocaleString("fr-FR"),
      statusLabel: "Actifs",
      statusValue: "en cours",
      isPositive: true,
      cardIcon: "solar:clipboard-check-line-duotone",
      statusIcon: "solar:course-up-line-duotone",
    },
    {
      title: "Exercices",
      value: customExercisesCount.toLocaleString("fr-FR"),
      statusLabel: "Personnalisés",
      statusValue: "bibliothèque",
      isPositive: true,
      cardIcon: "solar:dumbbell-large-line-duotone",
      statusIcon: "solar:course-up-line-duotone",
    },
  ]

  // Sessions 30 days (daily buckets)
  const today = startOfDay()
  const start30 = new Date(today)
  start30.setDate(today.getDate() - 29)
  const sessions30 = []
  for (let i = 0; i < 30; i++) {
    const d = new Date(start30)
    d.setDate(start30.getDate() + i)
    const key = d.toISOString().split("T")[0]
    sessions30.push({
      dateLabel: d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
      count: sessionsLast30Days.filter(
        (s) => new Date(s.date).toISOString().split("T")[0] === key
      ).length,
    })
  }

  // Sessions 6 months (month buckets)
  const monthBuckets: { monthLabel: string; count: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const monthStart = startOfMonthsAgo(i)
    const next = startOfMonthsAgo(i - 1)
    const count = sessionsLast6Months.filter((s) => {
      const date = new Date(s.date)
      return date >= monthStart && date < next
    }).length
    monthBuckets.push({
      monthLabel: monthStart.toLocaleDateString("fr-FR", { month: "short" }),
      count,
    })
  }

  // Sessions by weekday (last 30 days)
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
    <div className="p-8">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-28 left-1/4 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute top-24 right-1/4 h-72 w-72 rounded-full bg-emerald-200/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-200/25 blur-3xl" />
      </div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {welcomeTitle}
          </h1>
          <p className="text-sm text-muted-foreground">
            Tableau de bord · Suivi de votre activité
          </p>
        </div>
        <Link href="/dashboard/sessions" className={buttonVariants() + " gap-2"}>
          <Plus className="h-4 w-4" />
          Nouvelle séance
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalyticsCard
            title="Dashboard"
            description="Vérifiez vos statistiques clés"
            metrics={[
              {
                label: "Séances (semaine)",
                value: sessionsThisWeek.toLocaleString("fr-FR"),
                percentage: `${weekDelta > 0 ? "+" : ""}${weekDelta}%`,
                isPositive: weekDelta >= 0,
              },
              {
                label: "Séances (mois)",
                value: sessionsThisMonth.toLocaleString("fr-FR"),
                percentage: `${monthDelta > 0 ? "+" : ""}${monthDelta}%`,
                isPositive: monthDelta >= 0,
              },
            ]}
          />
        </div>
        <div className="grid gap-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Activité semaine
            </p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {sessionsThisWeek}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {weekDelta >= 0 ? "+" : ""}
              {weekDelta}% vs semaine dernière
            </p>
            <Link
              href="/dashboard/sessions"
              className={buttonVariants({ variant: "outline", size: "sm" }) + " mt-4 w-full"}
            >
              Voir les séances
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Programmes actifs
            </p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {activeProgramsCount}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Bibliothèque personnalisée: {customExercisesCount} exercices
            </p>
            <Link
              href="/dashboard/programs"
              className={buttonVariants({ variant: "outline", size: "sm" }) + " mt-4 w-full"}
            >
              Gérer les programmes
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <StatisticsCard items={statisticsItems} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Sessions (30 derniers jours)
            </h2>
            <p className="text-xs text-muted-foreground">
              {sessionsLast30Days.length} séance{sessionsLast30Days.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Sessions30dChart data={sessions30} />
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Répartition (jours)
            </h2>
          </div>
          <SessionsWeekdayDonut data={weekdayData} />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Sessions (6 mois)
          </h2>
        </div>
        <Sessions6mBarChart data={monthBuckets} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity sparkline */}
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-semibold text-foreground">
                Activité 14 jours
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              {sessionsForSparkline.length} séance{sessionsForSparkline.length !== 1 ? "s" : ""}
            </p>
          </div>
          <SessionsSparkline data={buckets} />
        </div>

        {/* Top clients */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Top clients
            </h2>
            <Link
              href="/dashboard/clients"
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Tous
            </Link>
          </div>
          {topClients.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              Aucun client actif
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {topClients.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/dashboard/clients/${c.id}`}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-muted/60"
                  >
                    <ClientAvatar
                      firstName={c.firstName}
                      lastName={c.lastName}
                      size="sm"
                    />
                    <span className="flex-1 truncate text-sm font-medium text-foreground">
                      {c.firstName} {c.lastName}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {c._count.sessions}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent sessions */}
      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Séances récentes
          </h2>
          <Link
            href="/dashboard/sessions"
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Tout voir →
          </Link>
        </div>
        {recentSessions.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <CalendarCheck className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              Aucune séance enregistrée
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Commencez par ajouter un client, puis créez sa première séance.
            </p>
            <Link
              href="/dashboard/clients"
              className={buttonVariants({ variant: "outline", size: "sm" }) + " mt-4"}
            >
              Ajouter un client
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recentSessions.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/dashboard/sessions/${s.id}`}
                  className="flex items-center gap-3 py-2.5 hover:bg-muted/60/50"
                >
                  <ClientAvatar
                    firstName={s.client.firstName}
                    lastName={s.client.lastName}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {s.client.firstName} {s.client.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(s.date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                  {s.duration && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {s.duration} min
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
