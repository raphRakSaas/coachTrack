import { redirect } from "next/navigation"
import Link from "next/link"
import { Users, Trash2, ChevronRight } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { SECTION_ACCENTS } from "@/lib/colors"
import {
  FITNESS_LEVEL_LABELS,
  GOAL_TYPE_LABELS,
} from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { ClientAvatar } from "@/components/ui/client-avatar"
import { ClientSheet } from "@/components/dashboard/clients/client-sheet"
import { SearchInput } from "@/components/dashboard/search-input"
import { deleteClient } from "./actions"

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const accent = SECTION_ACCENTS.clients

  const clients = await prisma.client.findMany({
    where: {
      coachId: user.id,
      ...(q
        ? {
            OR: [
              { firstName: { contains: q, mode: "insensitive" } },
              { lastName: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ isActive: "desc" }, { firstName: "asc" }],
    include: {
      _count: { select: { sessions: true, programs: true } },
    },
  })

  const activeCount = clients.filter((c) => c.isActive).length

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.bgSoft}`}>
            <Users className={`h-5 w-5 ${accent.icon}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Clients</h1>
            <p className="text-sm text-zinc-500">
              {activeCount} actif{activeCount !== 1 ? "s" : ""}
              {clients.length > activeCount &&
                ` · ${clients.length - activeCount} inactif${clients.length - activeCount !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SearchInput placeholder="Rechercher un client..." />
          <ClientSheet />
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-zinc-200 bg-white py-20 text-center">
          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${accent.bgSoft}`}>
            <Users className={`h-6 w-6 ${accent.icon}`} />
          </div>
          <p className="text-sm font-medium text-zinc-700">Aucun client</p>
          <p className="mt-1 text-xs text-zinc-500">
            Ajoutez votre premier client pour commencer le suivi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <div
              key={client.id}
              className="group relative flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-sm"
            >
              <Link
                href={`/dashboard/clients/${client.id}`}
                className="flex items-start gap-3"
              >
                <ClientAvatar
                  firstName={client.firstName}
                  lastName={client.lastName}
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-zinc-900">
                      {client.firstName} {client.lastName}
                    </p>
                    {!client.isActive && (
                      <Badge variant="secondary" className="text-[10px]">
                        Inactif
                      </Badge>
                    )}
                  </div>
                  <p className="truncate text-xs text-zinc-500">
                    {FITNESS_LEVEL_LABELS[client.fitnessLevel]}
                    {client.goalType && ` · ${GOAL_TYPE_LABELS[client.goalType]}`}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-300 transition-colors group-hover:text-blue-500" />
              </Link>

              <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                <div className="flex gap-3 text-xs text-zinc-500">
                  <span>
                    <span className="font-semibold text-zinc-900">
                      {client._count.sessions}
                    </span>{" "}
                    séance{client._count.sessions !== 1 ? "s" : ""}
                  </span>
                  <span>
                    <span className="font-semibold text-zinc-900">
                      {client._count.programs}
                    </span>{" "}
                    prog.
                  </span>
                </div>
                <form action={deleteClient.bind(null, client.id)}>
                  <button
                    type="submit"
                    className="rounded p-1.5 text-zinc-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
