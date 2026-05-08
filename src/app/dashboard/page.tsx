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
    recentSessions,
    sessionsForSparkline,
    topClients,
    activeProgramsCount,
  ] = await Promise.all([
    prisma.client.count({ where: { coachId: user.id, isActive: true } }),
    prisma.session.count({
      where: { coachId: user.id, date: { gte: startOfWeek() } },
    }),
    prisma.session.count({
      where: { coachId: user.id, date: { gte: startOfMonth() } },
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {greetingByHour()}{firstName ? `, ${firstName}` : ""} 👋
          </h1>
          <p className="text-sm text-zinc-500">
            {sessionsThisWeek === 0
              ? "Aucune séance encore cette semaine."
              : `${sessionsThisWeek} séance${sessionsThisWeek !== 1 ? "s" : ""} cette semaine.`}
          </p>
        </div>
        <Link
          href="/dashboard/sessions"
          className={buttonVariants() + " gap-2"}
        >
          <Plus className="h-4 w-4" />
          Nouvelle séance
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href, accent }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent.bgSoft}`}
              >
                <Icon className={`h-4 w-4 ${accent.icon}`} />
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-300 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-500" />
            </div>
            <p className="text-3xl font-bold text-zinc-900">{value}</p>
            <p className="mt-0.5 text-xs text-zinc-500">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity sparkline */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-semibold text-zinc-900">
                Activité 14 jours
              </h2>
            </div>
            <p className="text-xs text-zinc-400">
              {sessionsForSparkline.length} séance{sessionsForSparkline.length !== 1 ? "s" : ""}
            </p>
          </div>
          <SessionsSparkline data={buckets} />
        </div>

        {/* Top clients */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900">
              Top clients
            </h2>
            <Link
              href="/dashboard/clients"
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900"
            >
              Tous
            </Link>
          </div>
          {topClients.length === 0 ? (
            <p className="py-6 text-center text-xs text-zinc-400">
              Aucun client actif
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {topClients.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/dashboard/clients/${c.id}`}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-zinc-50"
                  >
                    <ClientAvatar
                      firstName={c.firstName}
                      lastName={c.lastName}
                      size="sm"
                    />
                    <span className="flex-1 truncate text-sm font-medium text-zinc-900">
                      {c.firstName} {c.lastName}
                    </span>
                    <span className="text-xs font-semibold text-zinc-500">
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
      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">
            Séances récentes
          </h2>
          <Link
            href="/dashboard/sessions"
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900"
          >
            Tout voir →
          </Link>
        </div>
        {recentSessions.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <CalendarCheck className="mb-3 h-10 w-10 text-zinc-300" />
            <p className="text-sm font-medium text-zinc-500">
              Aucune séance enregistrée
            </p>
            <p className="mt-1 text-xs text-zinc-400">
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
          <ul className="divide-y divide-zinc-100">
            {recentSessions.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/dashboard/sessions/${s.id}`}
                  className="flex items-center gap-3 py-2.5 hover:bg-zinc-50/50"
                >
                  <ClientAvatar
                    firstName={s.client.firstName}
                    lastName={s.client.lastName}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-900">
                      {s.client.firstName} {s.client.lastName}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {new Date(s.date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                  {s.duration && (
                    <span className="text-xs font-medium text-zinc-400">
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
