import Link from "next/link"
import { Clock, Dumbbell } from "lucide-react"

import { avatarColor } from "@/lib/colors"
import type { SECTION_ACCENTS } from "@/lib/colors"
import { cn } from "@/lib/utils"
import { localDateKey } from "@/lib/calendar-utils"

type SessionForAgenda = {
  id: string
  date: Date
  duration: number | null
  client: { firstName: string; lastName: string }
}

type CalendarAccent = (typeof SECTION_ACCENTS)["calendar"]

export function CalendarMonthAgenda({
  sessions,
  accent,
  todayKey,
}: {
  sessions: SessionForAgenda[]
  accent: CalendarAccent
  todayKey: string
}) {
  const sessionsByDay = new Map<string, SessionForAgenda[]>()

  for (const session of sessions) {
    const dayKey = localDateKey(new Date(session.date))
    const daySessions = sessionsByDay.get(dayKey) ?? []
    daySessions.push(session)
    sessionsByDay.set(dayKey, daySessions)
  }

  for (const [, daySessions] of sessionsByDay) {
    daySessions.sort(
      (sessionA, sessionB) =>
        new Date(sessionA.date).getTime() - new Date(sessionB.date).getTime()
    )
  }

  const sortedDayKeys = [...sessionsByDay.keys()].sort()

  if (sortedDayKeys.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm font-medium text-foreground">Aucune séance ce mois</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Les séances planifiées apparaîtront ici sous forme de liste.
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      {sortedDayKeys.map((dayKey) => {
        const daySessions = sessionsByDay.get(dayKey) ?? []
        const dayDate = new Date(daySessions[0]!.date)
        dayDate.setHours(12, 0, 0, 0)
        const isToday = dayKey === todayKey

        return (
          <section key={dayKey} className="border-b border-border last:border-b-0">
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
                  {dayDate
                    .toLocaleDateString("fr-FR", { weekday: "short" })
                    .replace(".", "")}
                </span>
                <span
                  className={cn(
                    "mt-0.5 text-lg font-bold leading-none",
                    isToday ? "text-white" : "text-foreground"
                  )}
                >
                  {dayDate.getDate()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-semibold capitalize text-foreground",
                    isToday && accent.activeText
                  )}
                >
                  {dayDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {daySessions.length} séance{daySessions.length > 1 ? "s" : ""}
                </p>
              </div>
            </header>

            <ul className="space-y-2 px-4 py-3">
              {daySessions.map((session) => {
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
                        {session.duration != null && (
                          <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Dumbbell className="h-3 w-3" />
                            {session.duration} min
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
