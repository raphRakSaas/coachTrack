import { redirect } from "next/navigation"
import Link from "next/link"
import { ClipboardList, Plus, Trash2, Users } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { SECTION_ACCENTS } from "@/lib/colors"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClientAvatar } from "@/components/ui/client-avatar"
import { deleteProgram } from "./actions"

type StatusFilter = "all" | "active" | "archived"

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string; status?: string }>
}) {
  const { clientId, status } = await searchParams
  const statusFilter: StatusFilter =
    status === "active"
      ? "active"
      : status === "archived"
        ? "archived"
        : "all"

  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const accent = SECTION_ACCENTS.programs

  const [allPrograms, clients] = await Promise.all([
    prisma.program.findMany({
      where: { coachId: user.id },
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
      include: {
        client: { select: { id: true, firstName: true, lastName: true } },
        _count: { select: { workoutDays: true } },
      },
    }),
    prisma.client.findMany({
      where: { coachId: user.id, isActive: true },
      orderBy: { firstName: "asc" },
      select: { id: true, firstName: true, lastName: true },
    }),
  ])

  const activeCount = allPrograms.filter((p) => p.isActive).length
  const archivedCount = allPrograms.filter((p) => !p.isActive).length

  const programs = allPrograms
    .filter((p) => (clientId ? p.client.id === clientId : true))
    .filter((p) => {
      if (statusFilter === "active") return p.isActive
      if (statusFilter === "archived") return !p.isActive
      return true
    })

  const selectedClient = clientId
    ? clients.find((c) => c.id === clientId)
    : null

  function buildHref(opts: { status?: StatusFilter; clientId?: string }) {
    const params = new URLSearchParams()
    const resolvedClientId = opts.clientId !== undefined ? opts.clientId : clientId
    const resolvedStatus =
      opts.status !== undefined ? opts.status : statusFilter
    if (resolvedClientId) params.set("clientId", resolvedClientId)
    if (resolvedStatus && resolvedStatus !== "all")
      params.set("status", resolvedStatus)
    const qs = params.toString()
    return `/dashboard/programs${qs ? `?${qs}` : ""}`
  }

  const filterTabs = [
    { label: "Tous", value: "all" as StatusFilter, count: allPrograms.length },
    { label: "Actifs", value: "active" as StatusFilter, count: activeCount },
    {
      label: "Archivés",
      value: "archived" as StatusFilter,
      count: archivedCount,
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.bgSoft}`}
          >
            <ClipboardList className={`h-5 w-5 ${accent.icon}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Programmes</h1>
            <p className="text-sm text-muted-foreground">
              {activeCount} actif{activeCount !== 1 ? "s" : ""}
              {archivedCount > 0 &&
                ` · ${archivedCount} archivé${archivedCount !== 1 ? "s" : ""}`}
              {selectedClient &&
                ` · ${selectedClient.firstName} ${selectedClient.lastName}`}
            </p>
          </div>
        </div>
        <Link href="/dashboard/programs/new" className={buttonVariants()}>
          <Plus className="h-4 w-4" />
          Nouveau programme
        </Link>
      </div>

      {/* Filtres */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        {/* Statut */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-muted p-1">
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
                      ? "bg-violet-500/15 text-violet-900 dark:bg-violet-950/50 dark:text-violet-300"
                      : "bg-muted/80 text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Client filter */}
        {clients.length > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              <Link
                href={buildHref({ clientId: "" })}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                  !clientId
                    ? "border-violet-500/35 bg-violet-500/10 text-violet-900 dark:bg-violet-950/40 dark:text-violet-300"
                    : "border-border bg-card text-muted-foreground hover:border-muted-foreground/25"
                }`}
              >
                Tous
              </Link>
              {clients.slice(0, 5).map((c) => (
                <Link
                  key={c.id}
                  href={buildHref({ clientId: c.id })}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                    clientId === c.id
                      ? "border-violet-500/35 bg-violet-500/10 text-violet-900 dark:bg-violet-950/40 dark:text-violet-300"
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

      {programs.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card py-20 text-center">
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${accent.bgSoft}`}
          >
            <ClipboardList className={`h-6 w-6 ${accent.icon}`} />
          </div>
          <p className="text-sm font-medium text-foreground">Aucun programme</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {clientId
              ? "Ce client n'a pas encore de programme."
              : "Créez un programme d'entraînement personnalisé pour un client."}
          </p>
          <Link
            href="/dashboard/programs/new"
            className={
              buttonVariants({ variant: "outline", size: "sm" }) + " mt-4"
            }
          >
            Créer un programme
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {programs.map((program) => (
            <div
              key={program.id}
              className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-violet-500/35 hover:shadow-sm"
            >
              <Link
                href={`/dashboard/programs/${program.id}`}
                className="mb-3 flex items-start justify-between gap-2"
              >
                <div className="flex items-center gap-3">
                  <ClientAvatar
                    firstName={program.client.firstName}
                    lastName={program.client.lastName}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {program.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {program.client.firstName} {program.client.lastName}
                    </p>
                  </div>
                </div>
                {!program.isActive && (
                  <Badge variant="secondary" className="text-[10px]">
                    Archivé
                  </Badge>
                )}
              </Link>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className={`rounded-md ${accent.badge} px-2 py-0.5 font-medium`}
                  >
                    {program._count.workoutDays} jour
                    {program._count.workoutDays !== 1 ? "s" : ""}
                  </span>
                  <span>
                    Début{" "}
                    {new Date(program.startDate).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <form action={deleteProgram.bind(null, program.id)}>
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
          ))}
        </div>
      )}
    </div>
  )
}
