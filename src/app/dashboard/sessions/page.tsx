import { redirect } from "next/navigation"
import Link from "next/link"
import { CalendarCheck, Trash2, ChevronRight, Flame } from "lucide-react"

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

export default async function SessionsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const accent = SECTION_ACCENTS.sessions

  const [sessions, clients] = await Promise.all([
    prisma.session.findMany({
      where: { coachId: user.id },
      orderBy: { date: "desc" },
      include: {
        client: { select: { firstName: true, lastName: true } },
        _count: { select: { exercises: true } },
      },
    }),
    prisma.client.findMany({
      where: { coachId: user.id, isActive: true },
      orderBy: { firstName: "asc" },
      select: { id: true, firstName: true, lastName: true },
    }),
  ])

  // Group sessions by relative date
  const grouped = sessions.reduce(
    (acc, session) => {
      const key = formatDateGroup(session.date)
      ;(acc[key] ??= []).push(session)
      return acc
    },
    {} as Record<string, typeof sessions>
  )

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.bgSoft}`}>
            <CalendarCheck className={`h-5 w-5 ${accent.icon}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Séances</h1>
            <p className="text-sm text-zinc-500">
              {sessions.length} séance{sessions.length !== 1 ? "s" : ""} enregistrée{sessions.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <SessionSheet clients={clients} />
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-zinc-200 bg-white py-20 text-center">
          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${accent.bgSoft}`}>
            <CalendarCheck className={`h-6 w-6 ${accent.icon}`} />
          </div>
          <p className="text-sm font-medium text-zinc-700">Aucune séance</p>
          <p className="mt-1 text-xs text-zinc-500">
            Enregistrez votre première séance pour commencer le suivi.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                {group}
              </p>
              <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
                {items.map((session) => (
                  <div
                    key={session.id}
                    className="group flex items-center gap-3 px-4 py-3 hover:bg-zinc-50/50"
                  >
                    <Link
                      href={`/dashboard/sessions/${session.id}`}
                      className="flex flex-1 items-center gap-3"
                    >
                      <ClientAvatar
                        firstName={session.client.firstName}
                        lastName={session.client.lastName}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-zinc-900">
                          {session.client.firstName} {session.client.lastName}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {new Date(session.date).toLocaleDateString("fr-FR", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                          {session.duration ? ` · ${session.duration} min` : ""}
                          {session._count.exercises > 0 &&
                            ` · ${session._count.exercises} exercice${session._count.exercises !== 1 ? "s" : ""}`}
                        </p>
                      </div>
                      {session.rpe && (
                        <div className={`flex items-center gap-1 rounded-md ${accent.badge} px-2 py-0.5 text-xs font-medium`}>
                          <Flame className="h-3 w-3" />
                          RPE {session.rpe}
                        </div>
                      )}
                      <ChevronRight className="h-4 w-4 text-zinc-300 transition-colors group-hover:text-emerald-500" />
                    </Link>
                    <form action={deleteSession.bind(null, session.id)}>
                      <button
                        type="submit"
                        className="rounded p-1.5 text-zinc-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
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
