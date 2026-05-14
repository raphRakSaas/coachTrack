import Link from "next/link"

import { avatarColor } from "@/lib/colors"
import type { SECTION_ACCENTS } from "@/lib/colors"
import type { MonthGridCell } from "@/lib/calendar-utils"
import { localDateKey } from "@/lib/calendar-utils"

type SessionForMonth = {
  id: string
  date: Date
  duration: number | null
  client: { firstName: string; lastName: string }
}

type CalendarAccent = (typeof SECTION_ACCENTS)["calendar"]

export function CalendarMonthGrid({
  cells,
  sessionsByDay,
  accent,
  todayKey,
}: {
  cells: MonthGridCell[]
  sessionsByDay: Map<string, SessionForMonth[]>
  accent: CalendarAccent
  todayKey: string
}) {
  return (
    <div className="grid min-h-[420px] flex-1 grid-cols-7 grid-rows-6 gap-px bg-border p-px">
      {cells.map((cell) => {
        const daySessions = sessionsByDay.get(cell.dateKey) ?? []
        const isTodayCell = cell.dateKey === todayKey
        return (
          <div
            key={cell.dateKey}
            className={`flex min-h-[72px] flex-col bg-card p-1.5 ${
              !cell.inMonth ? "opacity-45" : ""
            } ${isTodayCell ? accent.activeBg : ""}`}
          >
            <div className="flex items-center justify-between gap-1">
              <span
                className={`text-xs font-semibold tabular-nums ${
                  isTodayCell
                    ? accent.activeText
                    : cell.inMonth
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {cell.date.getDate()}
              </span>
              {daySessions.length > 0 && (
                <span className="text-[10px] font-medium text-muted-foreground">
                  {daySessions.length}
                </span>
              )}
            </div>
            <div className="mt-1 flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
              {daySessions.slice(0, 3).map((session) => {
                const colors = avatarColor(
                  `${session.client.firstName}${session.client.lastName}`
                )
                return (
                  <Link
                    key={session.id}
                    href={`/dashboard/sessions/${session.id}`}
                    className={`truncate rounded border border-border/70 px-1 py-0.5 text-[10px] font-medium leading-tight transition-colors hover:border-primary/40 ${colors.bg} ${colors.text}`}
                  >
                    {session.client.firstName} {session.client.lastName[0]}.
                  </Link>
                )
              })}
              {daySessions.length > 3 && (
                <span className="text-[10px] text-muted-foreground">
                  +{daySessions.length - 3} autre
                  {daySessions.length - 3 > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function buildSessionsByDayKey(
  sessions: SessionForMonth[]
): Map<string, SessionForMonth[]> {
  const map = new Map<string, SessionForMonth[]>()
  for (const session of sessions) {
    const key = localDateKey(new Date(session.date))
    const list = map.get(key) ?? []
    list.push(session)
    map.set(key, list)
  }
  for (const [, list] of map) {
    list.sort((sessionA, sessionB) => sessionA.date.getTime() - sessionB.date.getTime())
  }
  return map
}
