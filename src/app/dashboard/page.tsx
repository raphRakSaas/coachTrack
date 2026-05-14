import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  CalendarCheck,
  Plus,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { SECTION_ACCENTS } from "@/lib/colors"
import { buttonVariants } from "@/components/ui/button"
import { ClientAvatar } from "@/components/ui/client-avatar"
import { SessionsSparkline } from "@/components/charts/sessions-sparkline"
import { Sessions30dChart } from "@/components/charts/sessions-30d-chart"
import { Sessions6mBarChart } from "@/components/charts/sessions-6m-bar-chart"
import { SessionsWeekdayDonut } from "@/components/charts/sessions-weekday-donut"
import { cn } from "@/lib/utils"

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
      take: 5,
      orderBy: { sessions: { _count: "desc" } },
      include: { _count: { select: { sessions: true } } },
    }),
    prisma.program.count({ where: { coachId: user.id, isActive: true } }),
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

  // 14-day sparkline buckets
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

  // 30-day daily buckets
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

  // 6-month buckets
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

  // Weekday buckets
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

  const firstName = user.name?.split(" ")[0] ?? null
  const greeting = greetingByHour()

  const percent = (current: number, previous: number) => {
    if (previous <= 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  const weekDelta = percent(sessionsThisWeek, sessionsPreviousWeek)
  const monthDelta = percent(sessionsThisMonth, sessionsPreviousMonth)

  const currentDateLabel = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-full space-y-0">

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      {/* Full-bleed dark section — fond noir matche le bg du PNG mascotte */}
      <section
        className="relative -mx-6 -mt-0 flex items-end justify-between overflow-hidden px-8 pb-0 pt-8"
        style={{ background: "#080a0e", minHeight: 200 }}
      >
        {/* Accent line verte lime subtile en haut — signe de vie, pas déco */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 0%, #84cc16 30%, transparent 80%)" }}
        />

        {/* Contenu gauche */}
        <div className="relative z-10 flex flex-col gap-5 pb-8">
          <div>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/25">
              {currentDateLabel}
            </p>
            <h1 className="text-[2.6rem] font-black leading-none tracking-tight text-white">
              {greeting}
              {firstName && (
                <>
                  ,{" "}
                  <span className="text-[#a3e635]">{firstName}</span>
                </>
              )}
            </h1>
            <p className="mt-3 text-sm text-white/40">
              {activeClients > 0
                ? `${activeClients} client${activeClients > 1 ? "s" : ""} actif${activeClients > 1 ? "s" : ""} · ${sessionsThisMonth} séance${sessionsThisMonth > 1 ? "s" : ""} ce mois`
                : "Bienvenue — ajoutez votre premier client pour commencer."}
            </p>
          </div>

          <Link
            href="/dashboard/sessions"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#a3e635] px-5 py-2.5 text-sm font-bold text-black transition-all hover:bg-[#bef264] active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Nouvelle séance
          </Link>
        </div>

        {/* Mascotte — fond noir PNG intègre naturellement */}
        <div className="relative hidden shrink-0 self-end md:block">
          <Image
            src="/revo-mascot-coach.png"
            alt="CoachTrack mascot"
            width={200}
            height={200}
            className="revo-float h-48 w-auto object-contain"
            priority
            style={{
              filter: "drop-shadow(0 0 40px rgba(163, 230, 53, 0.18))",
            }}
          />
        </div>
      </section>

      {/* ─── Metrics strip ────────────────────────────────────────────── */}
      {/* Pas de cards — juste des chiffres sur fond page avec séparateurs */}
      <div className="border-b border-border">
        <div className="grid grid-cols-2 divide-x divide-border lg:grid-cols-4">
          {(
            [
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
                trend: weekDelta as number | null,
                href: "/dashboard/sessions",
                accent: SECTION_ACCENTS.sessions.hex,
                delay: "anim-delay-200",
              },
              {
                label: "Programmes actifs",
                value: activeProgramsCount,
                trend: null as number | null,
                href: "/dashboard/programs",
                accent: SECTION_ACCENTS.programs.hex,
                delay: "anim-delay-300",
              },
              {
                label: "Séances ce mois",
                value: sessionsThisMonth,
                trend: monthDelta as number | null,
                href: "/dashboard/sessions",
                accent: SECTION_ACCENTS.dashboard.hex,
                delay: "anim-delay-400",
              },
            ]
          ).map((m) => (
            <Link
              key={m.label}
              href={m.href}
              className={cn(
                "group flex flex-col gap-1 px-6 py-6 transition-colors hover:bg-muted/40 opacity-0 revo-fade-up",
                m.delay
              )}
            >
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tabular-nums tracking-tight text-foreground">
                  {m.value.toLocaleString("fr-FR")}
                </span>
                {m.trend !== null && (
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      m.trend >= 0 ? "text-emerald-500" : "text-red-500"
                    )}
                  >
                    {m.trend >= 0 ? (
                      <ArrowUpRight className="inline h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="inline h-3 w-3" />
                    )}
                    {Math.abs(m.trend)}%
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground/70">
                {m.label}
              </span>
              {/* Ligne accent couleur section au survol */}
              <div
                className="mt-1 h-0.5 w-0 rounded-full transition-all duration-300 group-hover:w-8"
                style={{ background: m.accent }}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Espacement pour le reste du contenu */}
      <div className="space-y-5 px-6 pt-5 pb-6">

      {/* ─── Row 1: 30d chart + recent sessions ───────────────────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* 30-day line chart */}
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
                {sessionsLast30Days.length} séance{sessionsLast30Days.length !== 1 ? "s" : ""}
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

        {/* Recent sessions */}
        <div className="opacity-0 revo-fade-up anim-delay-400 rounded-2xl border border-border bg-card p-5">
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
              {recentSessions.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/dashboard/sessions/${s.id}`}
                    className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <ClientAvatar
                      firstName={s.client.firstName}
                      lastName={s.client.lastName}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {s.client.firstName} {s.client.lastName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(s.date).toLocaleDateString("fr-FR", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                    {s.duration && (
                      <span className="shrink-0 rounded-lg bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        {s.duration}′
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ─── Row 2: 6m bar chart + weekday donut ─────────────────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* 6-month bar */}
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
              <p className="text-[11px] text-muted-foreground">
                Séances par mois
              </p>
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

        {/* Weekday donut */}
        <div className="opacity-0 revo-fade-up anim-delay-500 rounded-2xl border border-border bg-card p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-foreground">
              Jours favoris
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Répartition (30 derniers jours)
            </p>
          </div>
          <SessionsWeekdayDonut data={weekdayData} />
        </div>
      </div>

      {/* ─── Row 3: 14d sparkline + top clients ──────────────────────── */}
      <div className="grid grid-cols-1 gap-5 pb-4 lg:grid-cols-3">
        {/* 14-day sparkline */}
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
                  Pouls d'activité
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  14 derniers jours
                </p>
              </div>
            </div>
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{
                background: `${SECTION_ACCENTS.sessions.hex}15`,
                color: SECTION_ACCENTS.sessions.hex,
              }}
            >
              {sessionsForSparkline.length} séance{sessionsForSparkline.length !== 1 ? "s" : ""}
            </span>
          </div>
          <SessionsSparkline data={buckets} />
        </div>

        {/* Top clients */}
        <div className="opacity-0 revo-fade-up anim-delay-600 rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Top clients
            </h2>
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
              {topClients.map((c, i) => (
                <li key={c.id}>
                  <Link
                    href={`/dashboard/clients/${c.id}`}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted/50"
                  >
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                      style={
                        i === 0
                          ? { background: "#f59e0b20", color: "#f59e0b" }
                          : i === 1
                          ? { background: "#94a3b820", color: "#94a3b8" }
                          : { background: "#78716c20", color: "#78716c" }
                      }
                    >
                      {i + 1}
                    </span>
                    <ClientAvatar
                      firstName={c.firstName}
                      lastName={c.lastName}
                      size="sm"
                    />
                    <span className="flex-1 truncate text-sm font-medium text-foreground">
                      {c.firstName} {c.lastName}
                    </span>
                    <span
                      className="shrink-0 rounded-lg px-2 py-0.5 text-[11px] font-bold tabular-nums"
                      style={{
                        background: `${SECTION_ACCENTS.clients.hex}12`,
                        color: SECTION_ACCENTS.clients.hex,
                      }}
                    >
                      {c._count.sessions}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
