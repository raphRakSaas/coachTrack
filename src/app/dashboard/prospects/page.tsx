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
    color: "text-foreground dark:text-zinc-200",
    bg: "bg-muted dark:bg-zinc-800/70",
    border: "border-border dark:border-zinc-600",
  },
  CONTACTED: {
    label: "Contacté",
    color: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-50 dark:bg-blue-950/45",
    border: "border-blue-200 dark:border-blue-800",
  },
  HOT: {
    label: "Chaud",
    color: "text-orange-700 dark:text-orange-300",
    bg: "bg-orange-50 dark:bg-orange-950/45",
    border: "border-orange-200 dark:border-orange-800",
  },
  COLD: {
    label: "Froid",
    color: "text-sky-700 dark:text-sky-300",
    bg: "bg-sky-50 dark:bg-sky-950/45",
    border: "border-sky-200 dark:border-sky-800",
  },
  CONVERTED: {
    label: "Converti",
    color: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-950/45",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  LOST: {
    label: "Perdu",
    color: "text-red-700 dark:text-red-300",
    bg: "bg-red-50 dark:bg-red-950/45",
    border: "border-red-200 dark:border-red-900",
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
            <h1 className="text-2xl font-bold text-foreground">Prospects</h1>
            <p className="text-sm text-muted-foreground">
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
              ? "border-orange-500/35 bg-orange-500/10 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300"
              : "border-border bg-card text-muted-foreground hover:border-muted-foreground/25"
          }`}
        >
          En cours
          <span
            className={`rounded-full px-1.5 text-xs font-bold ${!filterStatus ? "bg-orange-500/20 text-orange-800 dark:text-orange-300" : "bg-muted text-muted-foreground"}`}
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
                  : "border-border bg-card text-muted-foreground hover:border-muted-foreground/25"
              }`}
            >
              {cfg.label}
              <span
                className={`rounded-full px-1.5 text-xs font-bold ${isActive ? `${cfg.bg} ${cfg.color}` : "bg-muted text-muted-foreground"}`}
              >
                {countsByStatus[s]}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Empty state */}
      {prospects.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card py-20 text-center">
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${accent.bgSoft}`}
          >
            <UserSearch className={`h-6 w-6 ${accent.icon}`} />
          </div>
          <p className="text-sm font-medium text-foreground">
            {filterStatus ? `Aucun prospect "${STATUS_CONFIG[filterStatus].label}"` : "Aucun prospect"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
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
                className="group relative flex flex-col gap-0 rounded-xl border border-border bg-card transition-all hover:border-orange-500/35 hover:shadow-sm"
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
                      <p className="truncate text-sm font-semibold text-foreground">
                        {prospect.firstName} {prospect.lastName}
                      </p>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusCfg.border} ${statusCfg.bg} ${statusCfg.color}`}
                      >
                        {statusCfg.label}
                      </span>
                    </div>
                    {prospect.email && (
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                        <Mail className="h-3 w-3 shrink-0" />
                        {prospect.email}
                      </p>
                    )}
                    {prospect.phone && (
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                        <Phone className="h-3 w-3 shrink-0" />
                        {prospect.phoneCountryCode} {prospect.phone}
                      </p>
                    )}
                    {prospect.prospectSource && (
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        Source : {prospect.prospectSource}
                      </p>
                    )}
                  </div>
                </div>

                {prospect.prospectNotes && (
                  <div className="border-t border-border px-4 py-2">
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {prospect.prospectNotes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
                  <div className="flex items-center gap-1">
                    {/* Status change buttons */}
                    {prospect.prospectStatus !== "CONVERTED" &&
                      prospect.prospectStatus !== "LOST" && (
                        <form
                          action={advanceProspectStatus.bind(null, prospect.id)}
                        >
                          <button
                            type="submit"
                            className="flex items-center gap-1 rounded px-2 py-1 text-[10px] font-medium text-muted-foreground transition-all hover:bg-muted"
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
                          className="flex items-center gap-1 rounded px-2 py-1 text-[10px] font-medium text-emerald-600 transition-all hover:bg-emerald-500/15 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
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
                      className="rounded p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-red-500 group-hover:opacity-100"
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
