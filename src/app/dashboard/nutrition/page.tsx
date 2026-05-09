import { redirect } from "next/navigation"
import Link from "next/link"
import { UtensilsCrossed, Users } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { SECTION_ACCENTS } from "@/lib/colors"
import { buttonVariants } from "@/components/ui/button"
import { NutritionHub } from "@/components/dashboard/nutrition/nutrition-hub"

const PERIOD_DAYS = 120

export default async function NutritionPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>
}) {
  const { clientId } = await searchParams

  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const accent = SECTION_ACCENTS.nutrition

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - PERIOD_DAYS)
  cutoff.setHours(0, 0, 0, 0)

  const [clients, logs] = await Promise.all([
    prisma.client.findMany({
      where: { coachId: user.id, isActive: true },
      orderBy: { firstName: "asc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dailyCaloriesGoal: true,
      },
    }),
    prisma.nutritionDayLog.findMany({
      where: {
        coachId: user.id,
        date: { gte: cutoff },
        ...(clientId ? { clientId } : {}),
      },
      orderBy: { date: "desc" },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dailyCaloriesGoal: true,
          },
        },
      },
    }),
  ])

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  weekAgo.setHours(0, 0, 0, 0)

  const logsLast7 = logs.filter((log) => new Date(log.date) >= weekAgo)
  const avgCaloriesLast7Days =
    logsLast7.length > 0
      ? Math.round(
          logsLast7.reduce((sum, log) => sum + log.caloriesConsumed, 0) /
            logsLast7.length
        )
      : null

  function buildHref(opts: { clientId?: string }) {
    const params = new URLSearchParams()
    const resolvedClientId =
      opts.clientId !== undefined ? opts.clientId : clientId
    if (resolvedClientId) params.set("clientId", resolvedClientId)
    const queryString = params.toString()
    return `/dashboard/nutrition${queryString ? `?${queryString}` : ""}`
  }

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
            <UtensilsCrossed className={`h-5 w-5 ${accent.icon}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nutrition</h1>
            <p className="text-sm text-muted-foreground">
              Journal calorique et macros — {PERIOD_DAYS} derniers jours.
              {selectedClient &&
                ` · ${selectedClient.firstName} ${selectedClient.lastName}`}
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/clients"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Fiches clients
        </Link>
      </div>

      {clients.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            Client :
          </span>
          <div className="flex flex-wrap gap-1">
            <Link
              href={buildHref({ clientId: "" })}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                !clientId
                  ? "border-lime-500/35 bg-lime-500/10 text-lime-900 dark:bg-lime-950/40 dark:text-lime-200"
                  : "border-border bg-card text-muted-foreground hover:border-muted-foreground/25"
              }`}
            >
              Tous
            </Link>
            {clients.slice(0, 10).map((c) => (
              <Link
                key={c.id}
                href={buildHref({ clientId: c.id })}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                  clientId === c.id
                    ? "border-lime-500/35 bg-lime-500/10 text-lime-900 dark:bg-lime-950/40 dark:text-lime-200"
                    : "border-border bg-card text-muted-foreground hover:border-muted-foreground/25"
                }`}
              >
                {c.firstName} {c.lastName[0]}.
              </Link>
            ))}
          </div>
        </div>
      )}

      <NutritionHub
        rows={logs.map((log) => ({
          id: log.id,
          clientId: log.clientId,
          date: log.date,
          caloriesConsumed: log.caloriesConsumed,
          proteinG: log.proteinG,
          carbsG: log.carbsG,
          fatG: log.fatG,
          waterL: log.waterL,
          breakfastKcal: log.breakfastKcal,
          lunchKcal: log.lunchKcal,
          dinnerKcal: log.dinnerKcal,
          snackKcal: log.snackKcal,
          client: log.client,
        }))}
        clients={clients}
        accent={{
          bgSoft: accent.bgSoft,
          icon: accent.icon,
          badge: accent.badge,
        }}
        stats={{
          entriesCount: logs.length,
          avgCaloriesLast7Days,
          periodDays: PERIOD_DAYS,
        }}
      />
    </div>
  )
}
