import Link from "next/link"
import { Clock, Dumbbell } from "lucide-react"

import { avatarColor } from "@/lib/colors"
import type { SECTION_ACCENTS } from "@/lib/colors"
import { cn } from "@/lib/utils"

const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

type SessionForAgenda = {
  id: string
  date: Date
  duration: number | null
  exercisesCount: number
  client: { firstName: string; lastName: string }
}

type WeekDayAgenda = {
  date: Date
  dateKey: string
  isToday: boolean
  sessions: SessionForAgenda[]
}

type CalendarAccent = (typeof SECTION_ACCENTS)["calendar"]

export function CalendarWeekAgenda({
  days,
  accent,
}: {
  days: WeekDayAgenda[]
  accent: CalendarAccent
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      {days.map(({ date, dateKey, isToday, sessions }) => {
        const weekdayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1
        const weekdayLabel = WEEKDAY_LABELS[weekdayIndex] ?? ""

        return (
          <section key={dateKey} className="border-b border-border last:border-b-0">
            <header
              className={cn(
                "sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-sm",
                isToday && accent.activeBg
              )}
            >
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl border border-border bg-background",
                  isToday && "border-transparent bg-teal-600 text-white dark:bg-teal-500"
                )}
              >
                <span
                  className={cn(
                    "text-[10px] font-semibold uppercase leading-none",
                    isToday ? "text-white/90" : "text-muted-foreground"
                  )}
                >
                  {weekdayLabel}
                </span>
                <span
                  className={cn(
                    "mt-0.5 text-lg font-bold leading-none",
                    isToday ? "text-white" : "text-foreground"
                  )}
                >
                  {date.getDate()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-semibold capitalize text-foreground",
                    isToday && accent.activeText
                  )}
                >
                  {date.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {sessions.length === 0
                    ? "Aucune séance"
                    : `${sessions.length} séance${sessions.length > 1 ? "s" : ""}`}
                </p>
              </div>
            </header>

            {sessions.length === 0 ? (
              <p className="px-4 py-5 text-sm text-muted-foreground">
                Journée libre
              </p>
            ) : (
              <ul className="space-y-2 px-4 py-3">
                {sessions.map((session) => {
                  const colors = avatarColor(
                    `${session.client.firstName}${session.client.lastName}`
                  )
                  const sessionTime = new Date(session.date).toLocaleTimeString(
                    "fr-FR",
                    { hour: "2-digit", minute: "2-digit" }
                  )

                  return (
                    <li key={session.id}>
                      <Link
                        href={`/dashboard/sessions/${session.id}`}
                        className={cn(
                          "flex gap-3 rounded-xl border border-border bg-card p-3 shadow-sm transition-colors hover:border-primary/40 hover:bg-muted/30",
                          colors.ring
                        )}
                      >
                        <div className="flex min-w-[3.25rem] shrink-0 flex-col items-center justify-center rounded-lg bg-muted/50 px-2 py-1.5">
                          <Clock className="mb-1 h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs font-semibold tabular-nums text-foreground">
                            {sessionTime}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={cn("font-semibold text-foreground", colors.text)}>
                            {session.client.firstName} {session.client.lastName}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                            {session.duration != null && (
                              <span>{session.duration} min</span>
                            )}
                            {session.exercisesCount > 0 && (
                              <span className="inline-flex items-center gap-1">
                                <Dumbbell className="h-3 w-3" />
                                {session.exercisesCount} exercice
                                {session.exercisesCount > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        )
      })}
    </div>
  )
}
