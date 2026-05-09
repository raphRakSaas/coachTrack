import { redirect } from "next/navigation"
import Link from "next/link"
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { SECTION_ACCENTS } from "@/lib/colors"
import { avatarColor } from "@/lib/colors"
import { buttonVariants } from "@/components/ui/button"

const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
const MONTH_LABELS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
]

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function isoDate(date: Date): string {
  return date.toISOString().split("T")[0]!
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string; view?: string }>
}) {
  const { week } = await searchParams

  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const accent = SECTION_ACCENTS.calendar

  // Determine the reference date
  const refDate = week ? new Date(week) : new Date()
  const weekStart = getMonday(refDate)
  const weekEnd = addDays(weekStart, 6)

  const prevWeekStart = addDays(weekStart, -7)
  const nextWeekStart = addDays(weekStart, 7)

  // Fetch sessions for the current week
  const sessions = await prisma.session.findMany({
    where: {
      coachId: user.id,
      date: {
        gte: weekStart,
        lte: new Date(weekEnd.getTime() + 86399999),
      },
    },
    orderBy: { date: "asc" },
    include: {
      client: { select: { firstName: true, lastName: true } },
      _count: { select: { exercises: true } },
    },
  })

  // Build day columns
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i)
    const dateKey = isoDate(date)
    const daySessions = sessions.filter(
      (s) => isoDate(new Date(s.date)) === dateKey
    )
    const today = isoDate(new Date()) === dateKey
    return { date, dateKey, sessions: daySessions, isToday: today }
  })

  const weekLabel = (() => {
    if (weekStart.getMonth() === weekEnd.getMonth()) {
      return `${weekStart.getDate()} – ${weekEnd.getDate()} ${MONTH_LABELS[weekStart.getMonth()]} ${weekStart.getFullYear()}`
    }
    return `${weekStart.getDate()} ${MONTH_LABELS[weekStart.getMonth()]} – ${weekEnd.getDate()} ${MONTH_LABELS[weekEnd.getMonth()]} ${weekStart.getFullYear()}`
  })()

  const totalThisWeek = sessions.length

  return (
    <div className="flex h-full flex-col p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.bgSoft}`}
          >
            <CalendarDays className={`h-5 w-5 ${accent.icon}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Calendrier</h1>
            <p className="text-sm text-muted-foreground">
              {totalThisWeek} séance{totalThisWeek !== 1 ? "s" : ""} cette
              semaine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/calendar?week=${isoDate(new Date())}`}
            className={
              buttonVariants({ variant: "outline", size: "sm" }) +
              " text-xs font-medium"
            }
          >
            Aujourd&apos;hui
          </Link>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card shadow-sm">
            <Link
              href={`/dashboard/calendar?week=${isoDate(prevWeekStart)}`}
              className="flex h-8 w-8 items-center justify-center rounded-l-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <span className="px-3 text-sm font-medium text-foreground">
              {weekLabel}
            </span>
            <Link
              href={`/dashboard/calendar?week=${isoDate(nextWeekStart)}`}
              className="flex h-8 w-8 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <Link
            href="/dashboard/sessions"
            className={buttonVariants({ size: "sm" }) + " gap-1"}
          >
            <Plus className="h-3.5 w-3.5" />
            Séance
          </Link>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/20">
          {days.map(({ date, isToday }, idx) => (
            <div
              key={idx}
              className={`border-r border-border px-3 py-3 text-center last:border-r-0 ${
                isToday ? accent.activeBg : ""
              }`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-wide ${
                  isToday ? accent.activeText : "text-muted-foreground"
                }`}
              >
                {WEEKDAY_LABELS[idx]}
              </p>
              <p
                className={`mt-1 text-lg font-bold ${
                  isToday ? accent.activeText : "text-foreground"
                }`}
              >
                {date.getDate()}
              </p>
            </div>
          ))}
        </div>

        {/* Events */}
        <div className="grid grid-cols-7 divide-x divide-border">
          {days.map(({ sessions: daySessions, isToday }, idx) => (
            <div
              key={idx}
              className={`min-h-[320px] p-2 ${
                isToday
                  ? "bg-teal-500/[0.06] dark:bg-teal-400/[0.10]"
                  : ""
              }`}
            >
              {daySessions.length === 0 ? (
                <div className="flex h-full items-start justify-center pt-6">
                  <p className="text-xs text-muted-foreground/60">—</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {daySessions.map((session) => {
                    const colors = avatarColor(
                      `${session.client.firstName}${session.client.lastName}`
                    )
                    return (
                      <Link
                        key={session.id}
                        href={`/dashboard/sessions/${session.id}`}
                        className={`group rounded-lg border border-border/80 p-2 transition-all hover:border-primary/40 hover:shadow-md ${colors.ring} ${colors.bg} hover:brightness-[1.02] dark:hover:brightness-110`}
                      >
                        <p
                          className={`truncate text-xs font-semibold ${colors.text}`}
                        >
                          {session.client.firstName}{" "}
                          {session.client.lastName[0]}.
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {session.duration
                            ? `${session.duration} min`
                            : "Durée inconnue"}
                          {session._count.exercises > 0 &&
                            ` · ${session._count.exercises} ex.`}
                        </p>
                        {session.rpe != null && (
                          <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                            RPE {session.rpe}
                          </p>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Weekly summary */}
      {sessions.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {days
            .filter((d) => d.sessions.length > 0)
            .map(({ date, sessions: daySessions }) => (
              <div
                key={isoDate(date)}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground shadow-sm"
              >
                <span className="font-semibold text-foreground">
                  {WEEKDAY_LABELS[
                    date.getDay() === 0 ? 6 : date.getDay() - 1
                  ] ?? ""}{" "}
                  {date.getDate()}
                </span>
                {daySessions.map((s) => (
                  <span key={s.id} className="text-muted-foreground">
                    {s.client.firstName} {s.client.lastName[0]}.
                  </span>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
