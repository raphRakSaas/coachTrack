import { redirect } from "next/navigation"
import Link from "next/link"
import {
  UserSearch,
  Trash2,
  ArrowRight,
  Plus,
  Mail,
  Phone,
  CheckCircle2,
} from "lucide-react"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { SECTION_ACCENTS } from "@/lib/colors"
import { ProspectStatus } from "@prisma/client"
import { ClientAvatar } from "@/components/ui/client-avatar"
import { Badge } from "@/components/ui/badge"
import { ProspectSheet } from "@/components/dashboard/prospects/prospect-sheet"
import {
  deleteProspect,
  convertProspectToClient,
  advanceProspectStatus,
} from "./actions"

const STATUS_CONFIG: Record<
  ProspectStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  NEW: {
    label: "Nouveau",
    color: "text-zinc-700",
    bg: "bg-zinc-100",
    border: "border-zinc-200",
  },
  CONTACTED: {
    label: "Contacté",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  HOT: {
    label: "Chaud",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  COLD: {
    label: "Froid",
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
  },
  CONVERTED: {
    label: "Converti",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  LOST: {
    label: "Perdu",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
}

const PIPELINE_STATUSES: ProspectStatus[] = [
  "NEW",
  "CONTACTED",
  "HOT",
  "COLD",
  "CONVERTED",
  "LOST",
]

export default async function ProspectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const filterStatus =
    status && PIPELINE_STATUSES.includes(status as ProspectStatus)
      ? (status as ProspectStatus)
      : null

  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const accent = SECTION_ACCENTS.prospects

  const allProspects = await prisma.client.findMany({
    where: { coachId: user.id, isProspect: true },
    orderBy: [{ prospectStatus: "asc" }, { createdAt: "desc" }],
  })

  const prospects = filterStatus
    ? allProspects.filter((p) => p.prospectStatus === filterStatus)
    : allProspects.filter((p) => p.prospectStatus !== "CONVERTED" && p.prospectStatus !== "LOST")

  const countsByStatus = PIPELINE_STATUSES.reduce(
    (acc, s) => {
      acc[s] = allProspects.filter((p) => p.prospectStatus === s).length
      return acc
    },
    {} as Record<ProspectStatus, number>
  )

  const activeCount = allProspects.filter(
    (p) => p.prospectStatus !== "CONVERTED" && p.prospectStatus !== "LOST"
  ).length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.bgSoft}`}
          >
            <UserSearch className={`h-5 w-5 ${accent.icon}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Prospects</h1>
            <p className="text-sm text-zinc-500">
              {activeCount} prospect{activeCount !== 1 ? "s" : ""} actif
              {activeCount !== 1 ? "s" : ""}
              {" · "}
              {countsByStatus.CONVERTED} converti
              {countsByStatus.CONVERTED !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <ProspectSheet />
      </div>

      {/* Pipeline / filtres */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/dashboard/prospects"
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
            !filterStatus
              ? "border-orange-200 bg-orange-50 text-orange-700"
              : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300"
          }`}
        >
          En cours
          <span
            className={`rounded-full px-1.5 text-xs font-bold ${!filterStatus ? "bg-orange-100 text-orange-700" : "bg-zinc-100 text-zinc-500"}`}
          >
            {activeCount}
          </span>
        </Link>
        {PIPELINE_STATUSES.map((s) => {
          const cfg = STATUS_CONFIG[s]
          const isActive = filterStatus === s
          return (
            <Link
              key={s}
              href={`/dashboard/prospects?status=${s}`}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                isActive
                  ? `${cfg.border} ${cfg.bg} ${cfg.color}`
                  : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300"
              }`}
            >
              {cfg.label}
              <span
                className={`rounded-full px-1.5 text-xs font-bold ${isActive ? `${cfg.bg} ${cfg.color}` : "bg-zinc-100 text-zinc-500"}`}
              >
                {countsByStatus[s]}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Empty state */}
      {prospects.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-zinc-200 bg-white py-20 text-center">
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${accent.bgSoft}`}
          >
            <UserSearch className={`h-6 w-6 ${accent.icon}`} />
          </div>
          <p className="text-sm font-medium text-zinc-700">
            {filterStatus ? `Aucun prospect "${STATUS_CONFIG[filterStatus].label}"` : "Aucun prospect"}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Ajoutez un prospect pour commencer votre pipeline commercial.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {prospects.map((prospect) => {
            const statusCfg = prospect.prospectStatus
              ? STATUS_CONFIG[prospect.prospectStatus]
              : STATUS_CONFIG.NEW
            return (
              <div
                key={prospect.id}
                className="group relative flex flex-col gap-0 rounded-xl border border-zinc-200 bg-white transition-all hover:border-orange-200 hover:shadow-sm"
              >
                {/* Top */}
                <div className="flex items-start gap-3 p-4">
                  <ClientAvatar
                    firstName={prospect.firstName}
                    lastName={prospect.lastName}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-zinc-900">
                        {prospect.firstName} {prospect.lastName}
                      </p>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusCfg.border} ${statusCfg.bg} ${statusCfg.color}`}
                      >
                        {statusCfg.label}
                      </span>
                    </div>
                    {prospect.email && (
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-zinc-400">
                        <Mail className="h-3 w-3 shrink-0" />
                        {prospect.email}
                      </p>
                    )}
                    {prospect.phone && (
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-zinc-400">
                        <Phone className="h-3 w-3 shrink-0" />
                        {prospect.phoneCountryCode} {prospect.phone}
                      </p>
                    )}
                    {prospect.prospectSource && (
                      <p className="mt-1 text-[10px] text-zinc-400">
                        Source : {prospect.prospectSource}
                      </p>
                    )}
                  </div>
                </div>

                {prospect.prospectNotes && (
                  <div className="border-t border-zinc-100 px-4 py-2">
                    <p className="line-clamp-2 text-xs text-zinc-500">
                      {prospect.prospectNotes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-2.5">
                  <div className="flex items-center gap-1">
                    {/* Status change buttons */}
                    {prospect.prospectStatus !== "CONVERTED" &&
                      prospect.prospectStatus !== "LOST" && (
                        <form
                          action={advanceProspectStatus.bind(null, prospect.id)}
                        >
                          <button
                            type="submit"
                            className="flex items-center gap-1 rounded px-2 py-1 text-[10px] font-medium text-zinc-500 transition-all hover:bg-zinc-100"
                          >
                            <ArrowRight className="h-3 w-3" />
                            Avancer
                          </button>
                        </form>
                      )}

                    {prospect.prospectStatus !== "CONVERTED" && (
                      <form action={convertProspectToClient.bind(null, prospect.id)}>
                        <button
                          type="submit"
                          className="flex items-center gap-1 rounded px-2 py-1 text-[10px] font-medium text-emerald-600 transition-all hover:bg-emerald-50"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Convertir
                        </button>
                      </form>
                    )}
                  </div>

                  <form action={deleteProspect.bind(null, prospect.id)}>
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
            )
          })}
        </div>
      )}
    </div>
  )
}
