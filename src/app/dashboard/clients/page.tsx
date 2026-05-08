import { redirect } from "next/navigation"
import { Users, Trash2 } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import { ClientSheet } from "@/components/dashboard/clients/client-sheet"
import { deleteClient } from "./actions"

export default async function ClientsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const clients = await prisma.client.findMany({
    where: { coachId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { sessions: true } },
    },
  })

  const activeCount = clients.filter((c) => c.isActive).length

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Clients</h1>
          <p className="text-sm text-zinc-500">
            {activeCount} actif{activeCount !== 1 ? "s" : ""}
          </p>
        </div>
        <ClientSheet />
      </div>

      {clients.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Users className="mb-3 h-10 w-10 text-zinc-300" />
          <p className="text-sm font-medium text-zinc-500">Aucun client</p>
          <p className="mt-1 text-xs text-zinc-400">
            Ajoutez votre premier client pour commencer.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
          {clients.map((client) => (
            <div
              key={client.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-700">
                  {client.firstName[0]}
                  {client.lastName[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {client.firstName} {client.lastName}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {client._count.sessions} séance
                    {client._count.sessions !== 1 ? "s" : ""}
                    {client.email ? ` · ${client.email}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!client.isActive && (
                  <Badge variant="secondary">Inactif</Badge>
                )}
                <form action={deleteClient.bind(null, client.id)}>
                  <button
                    type="submit"
                    className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
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
