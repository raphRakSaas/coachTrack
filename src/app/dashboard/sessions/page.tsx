import { redirect } from "next/navigation"
import { CalendarCheck, Trash2 } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { SessionSheet } from "@/components/dashboard/sessions/session-sheet"
import { deleteSession } from "./actions"

export default async function SessionsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const [sessions, clients] = await Promise.all([
    prisma.session.findMany({
      where: { coachId: user.id },
      orderBy: { date: "desc" },
      include: {
        client: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.client.findMany({
      where: { coachId: user.id, isActive: true },
      orderBy: { firstName: "asc" },
      select: { id: true, firstName: true, lastName: true },
    }),
  ])

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Séances</h1>
          <p className="text-sm text-zinc-500">
            {sessions.length} séance{sessions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <SessionSheet clients={clients} />
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <CalendarCheck className="mb-3 h-10 w-10 text-zinc-300" />
          <p className="text-sm font-medium text-zinc-500">Aucune séance</p>
          <p className="mt-1 text-xs text-zinc-400">
            Enregistrez votre première séance.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  {session.client.firstName} {session.client.lastName}
                </p>
                <p className="text-xs text-zinc-500">
                  {new Date(session.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {session.duration ? ` · ${session.duration} min` : ""}
                </p>
              </div>
              <form action={deleteSession.bind(null, session.id)}>
                <button
                  type="submit"
                  className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
