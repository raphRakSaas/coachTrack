import Link from "next/link"

import { avatarColor } from "@/lib/colors"

const GRID_START_HOUR = 6
const GRID_END_HOUR = 22
const HOUR_ROW_PX = 44

type SessionForGrid = {
  id: string
  date: Date
  duration: number | null
  exercisesCount: number
  client: { firstName: string; lastName: string }
}

type WeekDayColumn = {
  dateKey: string
  isToday: boolean
  sessions: SessionForGrid[]
}

function minutesFromDayStart(sessionDate: Date): number {
  return sessionDate.getHours() * 60 + sessionDate.getMinutes()
}

function sessionBlockLayout(
  session: SessionForGrid,
  totalGridMinutes: number,
  totalHeightPx: number
) {
  const sessionStart = new Date(session.date)
  const startMinutes = minutesFromDayStart(sessionStart)
  const spanStartMinutes = GRID_START_HOUR * 60
  const spanEndMinutes = GRID_END_HOUR * 60
  const plannedDuration = Math.max(session.duration ?? 60, 30)

  const sessionEndMinutes = startMinutes + plannedDuration
  let visibleStart = Math.max(startMinutes, spanStartMinutes)
  let visibleEnd = Math.min(sessionEndMinutes, spanEndMinutes)
  if (visibleEnd <= visibleStart) {
    if (sessionEndMinutes <= spanStartMinutes) {
      visibleStart = spanStartMinutes
      visibleEnd = spanStartMinutes + 30
    } else {
      visibleEnd = spanEndMinutes
      visibleStart = spanEndMinutes - 30
    }
  }
  const visibleDurationMinutes = Math.max(visibleEnd - visibleStart, 20)

  const topMinutes = Math.max(0, visibleStart - spanStartMinutes)
  const topPx = (topMinutes / totalGridMinutes) * totalHeightPx
  const heightPx = Math.max(
    28,
    (visibleDurationMinutes / totalGridMinutes) * totalHeightPx
  )
  return { topPx, heightPx }
}

export function CalendarWeekTimeGrid({ days }: { days: WeekDayColumn[] }) {
  const hourIndices = Array.from(
    { length: GRID_END_HOUR - GRID_START_HOUR },
    (_, index) => GRID_START_HOUR + index
  )
  const totalGridMinutes = (GRID_END_HOUR - GRID_START_HOUR) * 60
  const totalHeightPx = hourIndices.length * HOUR_ROW_PX

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 overflow-y-auto">
        <div className="w-12 shrink-0 border-r border-border bg-muted/10">
          {hourIndices.map((hour) => (
            <div
              key={hour}
              style={{ height: HOUR_ROW_PX }}
              className="box-border flex items-start justify-end border-b border-border/40 pr-1 pt-0.5 text-[11px] tabular-nums text-muted-foreground"
            >
              {String(hour).padStart(2, "0")}:00
            </div>
          ))}
        </div>

        <div className="grid min-h-0 min-w-0 flex-1 grid-cols-7">
          {days.map((dayColumn) => (
            <div
              key={dayColumn.dateKey}
              className={`relative border-r border-border last:border-r-0 ${
                dayColumn.isToday
                  ? "bg-teal-500/[0.04] dark:bg-teal-400/[0.08]"
                  : "bg-card"
              }`}
            >
              <div
                className="relative"
                style={{ height: totalHeightPx }}
              >
                {hourIndices.map((hour) => (
                  <div
                    key={hour}
                    style={{ height: HOUR_ROW_PX }}
                    className="box-border border-b border-dashed border-border/35"
                  />
                ))}

                {dayColumn.sessions.map((session) => {
                  const colors = avatarColor(
                    `${session.client.firstName}${session.client.lastName}`
                  )
                  const { topPx, heightPx } = sessionBlockLayout(
                    session,
                    totalGridMinutes,
                    totalHeightPx
                  )
                  return (
                    <Link
                      key={session.id}
                      href={`/dashboard/sessions/${session.id}`}
                      style={{ top: topPx, height: heightPx }}
                      className={`absolute left-1 right-1 z-[1] overflow-hidden rounded-md border border-border/80 px-1.5 py-1 text-left shadow-sm transition-all hover:z-[2] hover:border-primary/40 hover:shadow-md ${colors.ring} ${colors.bg} hover:brightness-[1.02] dark:hover:brightness-110`}
                    >
                      <p
                        className={`truncate text-[11px] font-semibold leading-tight ${colors.text}`}
                      >
                        {session.client.firstName}{" "}
                        {session.client.lastName[0]}.
                      </p>
                      <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                        {new Date(session.date).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {session.duration != null
                          ? ` · ${session.duration} min`
                          : ""}
                        {session.exercisesCount > 0
                          ? ` · ${session.exercisesCount} ex.`
                          : ""}
                      </p>
                    </Link>
                  )
                })}
              </div>

              {dayColumn.sessions.length === 0 && (
                <div
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  style={{ minHeight: totalHeightPx }}
                >
                  <p className="text-center text-[11px] text-muted-foreground/70">
                    Aucune séance
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
