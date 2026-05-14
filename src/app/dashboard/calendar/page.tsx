import { redirect } from "next/navigation"
import Link from "next/link"
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { SECTION_ACCENTS } from "@/lib/colors"
import { buttonVariants } from "@/components/ui/button"
import { CalendarWeekTimeGrid } from "@/components/dashboard/calendar/calendar-week-time-grid"
import {
  buildSessionsByDayKey,
  CalendarMonthGrid,
} from "@/components/dashboard/calendar/calendar-month-grid"
import {
  addDays,
  addMonths,
  getMonday,
  getMonthGridCells,
  localDateKey,
  parseLocalDateParam,
  startOfMonth,
  endOfMonth,
} from "@/lib/calendar-utils"

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

function calendarHref(view: "week" | "month", date: Date) {
  return `/dashboard/calendar?view=${view}&date=${localDateKey(date)}`
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string; date?: string; view?: string }>
}) {
  const params = await searchParams
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const accent = SECTION_ACCENTS.calendar
  const view: "week" | "month" =
    params.view === "month" ? "month" : "week"

  const anchorDate = parseLocalDateParam(params.date ?? params.week)

  if (view === "week") {
    const weekStart = getMonday(anchorDate)
    const weekEnd = addDays(weekStart, 6)

    const prevWeekStart = addDays(weekStart, -7)
    const nextWeekStart = addDays(weekStart, 7)

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

    const todayKey = localDateKey(new Date())
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = addDays(weekStart, index)
      const dateKey = localDateKey(date)
      const daySessions = sessions.filter(
        (sessionRow) => localDateKey(new Date(sessionRow.date)) === dateKey
      )
      return {
        date,
        dateKey,
        isToday: dateKey === todayKey,
        sessions: daySessions.map((sessionRow) => ({
          id: sessionRow.id,
          date: new Date(sessionRow.date),
          duration: sessionRow.duration,
          exercisesCount: sessionRow._count.exercises,
          client: sessionRow.client,
        })),
      }
    })

    const weekLabel = (() => {
      if (weekStart.getMonth() === weekEnd.getMonth()) {
        return `${weekStart.getDate()} – ${weekEnd.getDate()} ${MONTH_LABELS[weekStart.getMonth()]} ${weekStart.getFullYear()}`
      }
      return `${weekStart.getDate()} ${MONTH_LABELS[weekStart.getMonth()]} – ${weekEnd.getDate()} ${MONTH_LABELS[weekEnd.getMonth()]} ${weekStart.getFullYear()}`
    })()

    const totalThisWeek = sessions.length

    const toggleMonthDate = startOfMonth(anchorDate)

    return (
      <div className="flex min-h-0 flex-1 flex-col p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
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

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border border-border bg-muted/30 p-0.5">
              <Link
                href={calendarHref("week", weekStart)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${accent.bgSoft} ${accent.activeText} shadow-sm`}
              >
                Semaine
              </Link>
              <Link
                href={calendarHref("month", toggleMonthDate)}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Mois
              </Link>
            </div>

            <Link
              href={calendarHref("week", new Date())}
              className={
                buttonVariants({ variant: "outline", size: "sm" }) +
                " text-xs font-medium"
              }
            >
              Aujourd&apos;hui
            </Link>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-card shadow-sm">
              <Link
                href={calendarHref("week", prevWeekStart)}
                className="flex h-8 w-8 items-center justify-center rounded-l-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
              <span className="px-3 text-sm font-medium text-foreground">
                {weekLabel}
              </span>
              <Link
                href={calendarHref("week", nextWeekStart)}
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

        <div className="flex min-h-[520px] flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex shrink-0 border-b border-border bg-muted/20">
            <div
              className="w-12 shrink-0 border-r border-border bg-muted/10"
              aria-hidden
            />
            <div className="grid min-w-0 flex-1 grid-cols-7">
              {days.map(({ date, isToday }, index) => (
                <div
                  key={index}
                  className={`border-r border-border px-3 py-3 text-center last:border-r-0 ${
                    isToday ? accent.activeBg : ""
                  }`}
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      isToday ? accent.activeText : "text-muted-foreground"
                    }`}
                  >
                    {WEEKDAY_LABELS[index]}
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
          </div>

          <CalendarWeekTimeGrid
            days={days.map(({ dateKey, isToday, sessions: daySessions }) => ({
              dateKey,
              isToday,
              sessions: daySessions,
            }))}
          />
        </div>

        {sessions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {days
              .filter((dayItem) => dayItem.sessions.length > 0)
              .map(({ date, sessions: daySessions }) => (
                <div
                  key={localDateKey(date)}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground shadow-sm"
                >
                  <span className="font-semibold text-foreground">
                    {WEEKDAY_LABELS[
                      date.getDay() === 0 ? 6 : date.getDay() - 1
                    ] ?? ""}{" "}
                    {date.getDate()}
                  </span>
                  {daySessions.map((sessionRow) => (
                    <span key={sessionRow.id} className="text-muted-foreground">
                      {sessionRow.client.firstName}{" "}
                      {sessionRow.client.lastName[0]}.
                    </span>
                  ))}
                </div>
              ))}
          </div>
        )}
      </div>
    )
  }

  const monthStart = startOfMonth(anchorDate)
  const monthEnd = endOfMonth(anchorDate)
  const prevMonthStart = addMonths(monthStart, -1)
  const nextMonthStart = addMonths(monthStart, 1)

  const sessions = await prisma.session.findMany({
    where: {
      coachId: user.id,
      date: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
    orderBy: { date: "asc" },
    include: {
      client: { select: { firstName: true, lastName: true } },
    },
  })

  const monthCells = getMonthGridCells(monthStart)
  const sessionsForMonth = sessions.map((sessionRow) => ({
    id: sessionRow.id,
    date: new Date(sessionRow.date),
    duration: sessionRow.duration,
    client: sessionRow.client,
  }))
  const sessionsByDay = buildSessionsByDayKey(sessionsForMonth)
  const todayKey = localDateKey(new Date())

  const monthTitleRaw = monthStart.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  })
  const monthTitle =
    monthTitleRaw.charAt(0).toUpperCase() + monthTitleRaw.slice(1)

  const totalThisMonth = sessions.length
  const toggleWeekDate = getMonday(anchorDate)

  return (
    <div className="flex min-h-0 flex-1 flex-col p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.bgSoft}`}
          >
            <CalendarDays className={`h-5 w-5 ${accent.icon}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Calendrier</h1>
            <p className="text-sm text-muted-foreground">
              {totalThisMonth} séance{totalThisMonth !== 1 ? "s" : ""} en{" "}
              {monthTitleRaw}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-border bg-muted/30 p-0.5">
            <Link
              href={calendarHref("week", toggleWeekDate)}
              className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Semaine
            </Link>
            <Link
              href={calendarHref("month", monthStart)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${accent.bgSoft} ${accent.activeText} shadow-sm`}
            >
              Mois
            </Link>
          </div>

          <Link
            href={calendarHref("month", new Date())}
            className={
              buttonVariants({ variant: "outline", size: "sm" }) +
              " text-xs font-medium"
            }
          >
            Aujourd&apos;hui
          </Link>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card shadow-sm">
            <Link
              href={calendarHref("month", prevMonthStart)}
              className="flex h-8 w-8 items-center justify-center rounded-l-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <span className="min-w-[10rem] px-3 text-center text-sm font-medium capitalize text-foreground">
              {monthTitle}
            </span>
            <Link
              href={calendarHref("month", nextMonthStart)}
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

      <div className="flex min-h-[520px] flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="grid shrink-0 grid-cols-7 border-b border-border bg-muted/20">
          {WEEKDAY_LABELS.map((weekdayLabel) => (
            <div
              key={weekdayLabel}
              className="border-r border-border px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground last:border-r-0"
            >
              {weekdayLabel}
            </div>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          <CalendarMonthGrid
            cells={monthCells}
            sessionsByDay={sessionsByDay}
            accent={accent}
            todayKey={todayKey}
          />
        </div>
      </div>
    </div>
  )
}
