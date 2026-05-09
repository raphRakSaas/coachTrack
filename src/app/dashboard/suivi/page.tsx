import { redirect } from "next/navigation"
import Link from "next/link"
import { Activity, Users } from "lucide-react"
import type { TrackingItemType } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { SECTION_ACCENTS } from "@/lib/colors"
import { buttonVariants } from "@/components/ui/button"
import { TrackingHub } from "@/components/dashboard/suivi/tracking-hub"

type StatusFilter = "all" | "active" | "archived"

const TYPE_LABELS: Record<
  "BILAN" | "HABITUDE" | "QUESTIONNAIRE" | "MESURE",
  string
> = {
  BILAN: "Bilan",
  HABITUDE: "Habitude",
  QUESTIONNAIRE: "Questionnaire",
  MESURE: "Mesure",
}

export default async function SuiviPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string; type?: string; status?: string }>
}) {
  const { clientId, type: typeParam, status } = await searchParams
  const statusFilter: StatusFilter =
    status === "active"
      ? "active"
      : status === "archived"
        ? "archived"
        : "all"

  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const accent = SECTION_ACCENTS.tracking

  const typeKeys = Object.keys(TYPE_LABELS) as Array<keyof typeof TYPE_LABELS>
  const typeFilter: TrackingItemType | null =
    typeParam && typeKeys.includes(typeParam as keyof typeof TYPE_LABELS)
      ? (typeParam as TrackingItemType)
      : null

  const [allItems, clients] = await Promise.all([
    prisma.trackingItem.findMany({
      where: { coachId: user.id },
      orderBy: [{ isActive: "desc" }, { updatedAt: "desc" }],
      include: {
        client: { select: { id: true, firstName: true, lastName: true } },
      },
    }),
    prisma.client.findMany({
      where: { coachId: user.id, isActive: true },
      orderBy: { firstName: "asc" },
      select: { id: true, firstName: true, lastName: true },
    }),
  ])

  const activeCount = allItems.filter((item) => item.isActive).length
  const archivedCount = allItems.filter((item) => !item.isActive).length

  const items = allItems
    .filter((item) => (clientId ? item.clientId === clientId : true))
    .filter((item) => (typeFilter ? item.type === typeFilter : true))
    .filter((item) => {
      if (statusFilter === "active") return item.isActive
      if (statusFilter === "archived") return !item.isActive
      return true
    })

  function buildHref(opts: {
    status?: StatusFilter
    clientId?: string
    type?: string | null
  }) {
    const params = new URLSearchParams()
    const resolvedClientId =
      opts.clientId !== undefined ? opts.clientId : clientId
    const resolvedStatus =
      opts.status !== undefined ? opts.status : statusFilter
    const resolvedType =
      opts.type !== undefined ? opts.type : typeParam ?? undefined

    if (resolvedClientId) params.set("clientId", resolvedClientId)
    if (resolvedStatus && resolvedStatus !== "all")
      params.set("status", resolvedStatus)
    if (resolvedType) params.set("type", resolvedType)

    const queryString = params.toString()
    return `/dashboard/suivi${queryString ? `?${queryString}` : ""}`
  }

  const filterTabs = [
    { label: "Tous", value: "all" as StatusFilter, count: allItems.length },
    { label: "Actifs", value: "active" as StatusFilter, count: activeCount },
    {
      label: "Inactifs",
      value: "archived" as StatusFilter,
      count: archivedCount,
    },
  ]

  const selectedClient = clientId
    ? clients.find((c) => c.id === clientId)
    : null

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.bgSoft}`}
          >
            <Activity className={`h-5 w-5 ${accent.icon}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Suivi</h1>
            <p className="text-sm text-muted-foreground">
              Bilans, habitudes, questionnaires et mesures par client.
              {selectedClient &&
                ` · ${selectedClient.firstName} ${selectedClient.lastName}`}
              {typeFilter && ` · ${TYPE_LABELS[typeFilter as keyof typeof TYPE_LABELS]}`}
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/clients"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Voir les clients
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-muted p-1">
          {filterTabs.map((tab) => {
            const isActive = statusFilter === tab.value
            return (
              <Link
                key={tab.value}
                href={buildHref({ status: tab.value })}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                    isActive
                      ? "bg-rose-500/15 text-rose-900 dark:bg-rose-950/50 dark:text-rose-300"
                      : "bg-muted/80 text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              </Link>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Type :
          </span>
          <Link
            href={buildHref({ type: null })}
            className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
              !typeFilter
                ? "border-rose-500/35 bg-rose-500/10 text-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                : "border-border bg-card text-muted-foreground hover:border-muted-foreground/25"
            }`}
          >
            Tous
          </Link>
          {typeKeys.map((typeKey) => (
            <Link
              key={typeKey}
              href={buildHref({ type: typeKey })}
              className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
                typeFilter === typeKey
                  ? "border-rose-500/35 bg-rose-500/10 text-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                  : "border-border bg-card text-muted-foreground hover:border-muted-foreground/25"
              }`}
            >
              {TYPE_LABELS[typeKey]}
            </Link>
          ))}
        </div>

        {clients.length > 0 && (
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              <Link
                href={buildHref({ clientId: "" })}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                  !clientId
                    ? "border-rose-500/35 bg-rose-500/10 text-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                    : "border-border bg-card text-muted-foreground hover:border-muted-foreground/25"
                }`}
              >
                Tous
              </Link>
              {clients.slice(0, 8).map((c) => (
                <Link
                  key={c.id}
                  href={buildHref({ clientId: c.id })}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                    clientId === c.id
                      ? "border-rose-500/35 bg-rose-500/10 text-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                      : "border-border bg-card text-muted-foreground hover:border-muted-foreground/25"
                  }`}
                >
                  {c.firstName} {c.lastName[0]}.
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <TrackingHub
        items={items}
        clients={clients}
        accent={{
          bgSoft: accent.bgSoft,
          icon: accent.icon,
          badge: accent.badge,
        }}
      />
    </div>
  )
}
