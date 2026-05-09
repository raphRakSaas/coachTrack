"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, UserPlus, Filter } from "lucide-react"
import type { Prisma } from "@prisma/client"

import { ClientAvatar } from "@/components/ui/client-avatar"
import { Badge } from "@/components/ui/badge"
import { ClientSheet } from "./client-sheet"

type ClientRow = Prisma.ClientGetPayload<{
  include: {
    _count: { select: { sessions: true } }
    sessions: { select: { date: true } }
  }
}>

type FilterType = "all" | "active" | "inactive"

export function ClientListPanel({ clients }: { clients: ClientRow[] }) {
  const pathname = usePathname()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FilterType>("active")

  const filtered = useMemo(() => {
    return clients
      .filter((c) => {
        if (filter === "active") return c.isActive
        if (filter === "inactive") return !c.isActive
        return true
      })
      .filter((c) => {
        if (!search) return true
        const q = search.toLowerCase()
        return (
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          (c.email ?? "").toLowerCase().includes(q)
        )
      })
  }, [clients, search, filter])

  const activeCount = clients.filter((c) => c.isActive).length

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-zinc-200 bg-white">
      {/* Header */}
      <div className="border-b border-zinc-100 px-3 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">
            {activeCount} actif{activeCount !== 1 ? "s" : ""}
          </span>
          <ClientSheet />
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-1.5 pl-8 pr-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-zinc-100">
        {(
          [
            { value: "all", label: "Tous" },
            { value: "active", label: "Actifs" },
            { value: "inactive", label: "Inactifs" },
          ] as { value: FilterType; label: string }[]
        ).map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`flex-1 py-1.5 text-[11px] font-medium transition-colors ${
              filter === tab.value
                ? "border-b-2 border-blue-600 text-blue-700"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Client list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center px-3 py-10 text-center">
            <p className="text-xs text-zinc-400">
              {search ? "Aucun résultat" : "Aucun client"}
            </p>
          </div>
        ) : (
          <ul className="py-1">
            {filtered.map((client) => {
              const isActive =
                pathname === `/dashboard/clients/${client.id}` ||
                pathname.startsWith(`/dashboard/clients/${client.id}/`)
              const lastSession = client.sessions[0]?.date ?? null

              return (
                <li key={client.id}>
                  <Link
                    href={`/dashboard/clients/${client.id}`}
                    className={`flex items-center gap-2.5 px-3 py-2.5 transition-colors ${
                      isActive
                        ? "bg-blue-50"
                        : "hover:bg-zinc-50"
                    }`}
                  >
                    <ClientAvatar
                      firstName={client.firstName}
                      lastName={client.lastName}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <p
                          className={`truncate text-xs font-semibold ${
                            isActive ? "text-blue-700" : "text-zinc-900"
                          }`}
                        >
                          {client.firstName} {client.lastName}
                        </p>
                        {client.isDemo && (
                          <Badge
                            variant="secondary"
                            className="border border-amber-200 bg-amber-50 px-1 py-0 text-[9px] text-amber-800"
                          >
                            Démo
                          </Badge>
                        )}
                      </div>
                      <p className="truncate text-[10px] text-zinc-400">
                        {client._count.sessions} séance
                        {client._count.sessions !== 1 ? "s" : ""}
                        {lastSession &&
                          ` · ${new Date(lastSession).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`}
                      </p>
                    </div>
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        client.isActive ? "bg-emerald-500" : "bg-zinc-300"
                      }`}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </aside>
  )
}
