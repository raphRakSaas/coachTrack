import { redirect } from "next/navigation"
import Link from "next/link"
import { CalendarCheck, Trash2, ChevronRight, Flame, Users } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { SECTION_ACCENTS } from "@/lib/colors"
import { ClientAvatar } from "@/components/ui/client-avatar"
import { SessionSheet } from "@/components/dashboard/sessions/session-sheet"
import { deleteSession } from "./actions"

function formatDateGroup(d: Date): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(d)
  date.setHours(0, 0, 0, 0)
  const diff = (today.getTime() - date.getTime()) / (24 * 3600 * 1000)
  if (diff === 0) return "Aujourd'hui"
  if (diff === 1) return "Hier"
  if (diff < 7) return "Cette semaine"
  if (diff < 14) return "La semaine dernière"
  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
}

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>
}) {
  const { clientId } = await searchParams
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const accent = SECTION_ACCENTS.sessions

  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))
  startOfWeek.setHours(0, 0, 0, 0)

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [sessions, clients, sessionsThisWeek, sessionsThisMonth] = await Promise.all([
    prisma.session.findMany({
      where: {
        coachId: user.id,
        ...(clientId ? { clientId } : {}),
      },
      orderBy: { date: "desc" },
      include: {
        client: { select: { id: true, firstName: true, lastName: true } },
        _count: { select: { exercises: true } },
      },
    }),
    prisma.client.findMany({
      where: { coachId: user.id, isActive: true },
      orderBy: { firstName: "asc" },
      select: { id: true, firstName: true, lastName: true },
    }),
    prisma.session.count({
      where: { coachId: user.id, date: { gte: startOfWeek } },
    }),
    prisma.session.count({
      where: { coachId: user.id, date: { gte: startOfMonth } },
    }),
  ])

  const grouped = sessions.reduce(
    (acc, session) => {
      const key = formatDateGroup(session.date)
      ;(acc[key] ??= []).push(session)
      return acc
    },
    {} as Record<string, typeof sessions>
  )

  const selectedClient = clientId
    ? clients.find((c) => c.id === clientId)
    : null

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.bgSoft}`}
          >
            <CalendarCheck className={`h-5 w-5 ${accent.icon}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Séances</h1>
            <p className="text-sm text-muted-foreground">
              {sessions.length} séance{sessions.length !== 1 ? "s" : ""}
              {selectedClient &&
                ` · ${selectedClient.firstName} ${selectedClient.lastName}`}
            </p>
          </div>
        </div>
        <SessionSheet clients={clients} />
      </div>

      {/* Stats + filtre */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-border bg-card px-4 py-3 text-center shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Cette semaine
            </p>
            <p className="mt-0.5 text-2xl font-bold text-foreground">
              {sessionsThisWeek}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card px-4 py-3 text-center shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Ce mois
            </p>
            <p className="mt-0.5 text-2xl font-bold text-foreground">
              {sessionsThisMonth}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card px-4 py-3 text-center shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Total
            </p>
            <p className="mt-0.5 text-2xl font-bold text-foreground">
              {sessions.length}
            </p>
          </div>
        </div>

        {/* Client filter */}
        <div className="ml-auto flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-1">
            <Link
              href="/dashboard/sessions"
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                !clientId
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                  : "border-border bg-card text-muted-foreground hover:border-emerald-500/30 hover:text-foreground"
              }`}
            >
              Tous
            </Link>
            {clients.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/sessions?clientId=${c.id}`}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                  clientId === c.id
                    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                    : "border-border bg-card text-muted-foreground hover:border-emerald-500/30 hover:text-foreground"
                }`}
              >
                {c.firstName} {c.lastName[0]}.
              </Link>
            ))}
          </div>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card py-20 text-center">
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${accent.bgSoft}`}
          >
            <CalendarCheck className={`h-6 w-6 ${accent.icon}`} />
          </div>
          <p className="text-sm font-medium text-foreground">Aucune séance</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {clientId
              ? "Ce client n'a pas encore de séances."
              : "Enregistrez votre première séance pour commencer le suivi."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {group}
              </p>
              <div className="divide-y divide-border rounded-xl border border-border bg-card shadow-sm">
                {items.map((session) => (
                  <div
                    key={session.id}
                    className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                  >
                    <Link
                      href={`/dashboard/sessions/${session.id}`}
                      className="flex min-w-0 flex-1 items-center gap-3"
                    >
                      <ClientAvatar
                        firstName={session.client.firstName}
                        lastName={session.client.lastName}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {session.client.firstName} {session.client.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(session.date).toLocaleDateString("fr-FR", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                          {session.duration != null
                            ? ` · ${session.duration} min`
                            : ""}
                          {session._count.exercises > 0 &&
                            ` · ${session._count.exercises} exercice${session._count.exercises !== 1 ? "s" : ""}`}
                          {(session.mood != null || session.energy != null) && (
                            <>
                              {" · "}
                              {session.mood != null && `Humeur ${session.mood}/5`}
                              {session.mood != null &&
                                session.energy != null &&
                                " · "}
                              {session.energy != null &&
                                `Énergie ${session.energy}/5`}
                            </>
                          )}
                        </p>
                        {session.sessionFocus && (
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {session.sessionFocus}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        {session.rpe != null && (
                          <div
                            className={`flex items-center gap-1 rounded-md ${accent.badge} px-2 py-0.5 text-xs font-medium`}
                          >
                            <Flame className="h-3 w-3" />
                            RPE {session.rpe}
                          </div>
                        )}
                        {session.location && (
                          <span className="max-w-[8rem] truncate text-[10px] text-muted-foreground">
                            {session.location}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-emerald-500" />
                    </Link>
                    <form action={deleteSession.bind(null, session.id)}>
                      <button
                        type="submit"
                        className="rounded p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
