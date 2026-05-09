import { redirect } from "next/navigation"
import Link from "next/link"
import { Dumbbell } from "lucide-react"
import type { MuscleGroup } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { MUSCLE_GROUPS } from "@/lib/constants"
import { SECTION_ACCENTS } from "@/lib/colors"
import { ExerciseSheet } from "@/components/dashboard/exercises/exercise-sheet"
import { ExerciseLibraryCard } from "@/components/dashboard/exercises/exercise-library-card"
import { SearchInput } from "@/components/dashboard/search-input"
import { cn } from "@/lib/utils"

const MUSCLE_ORDER = Object.keys(MUSCLE_GROUPS) as MuscleGroup[]

type Scope = "all" | "catalog" | "mine"

function parseScope(value: string | undefined): Scope {
  if (value === "catalog" || value === "mine") return value
  return "all"
}

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; group?: string; scope?: string }>
}) {
  const { q, group: groupParam, scope: scopeParam } = await searchParams
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const accent = SECTION_ACCENTS.exercises
  const scope = parseScope(scopeParam)

  const groupFilter: MuscleGroup | null =
    groupParam &&
    MUSCLE_ORDER.includes(groupParam as MuscleGroup)
      ? (groupParam as MuscleGroup)
      : null

  const scopeWhere =
    scope === "catalog"
      ? { isGlobal: true }
      : scope === "mine"
        ? { coachId: user.id }
        : { OR: [{ isGlobal: true }, { coachId: user.id }] }

  const exercises = await prisma.exercise.findMany({
    where: {
      AND: [
        scopeWhere,
        ...(groupFilter ? [{ muscleGroup: groupFilter }] : []),
        ...(q
          ? [{ name: { contains: q, mode: "insensitive" as const } }]
          : []),
      ],
    },
    orderBy: [{ muscleGroup: "asc" }, { name: "asc" }],
    include: {
      _count: {
        select: {
          programExercises: true,
          sessionExercises: true,
        },
      },
    },
  })

  const catalogueTotal = await prisma.exercise.count({
    where: { isGlobal: true },
  })
  const mineTotal = await prisma.exercise.count({
    where: { coachId: user.id },
  })

  const customInResults = exercises.filter((row) => !row.isGlobal).length

  const grouped = exercises.reduce(
    (acc, ex) => {
      ;(acc[ex.muscleGroup] ??= []).push(ex)
      return acc
    },
    {} as Record<MuscleGroup, typeof exercises>
  )

  const sections: [MuscleGroup, typeof exercises][] = groupFilter
    ? [[groupFilter, exercises]]
    : MUSCLE_ORDER.map((key) => [key, grouped[key] ?? []] as [MuscleGroup, typeof exercises]).filter(
        ([, items]) => items.length > 0
      )

  function buildHref(opts: {
    q?: string | null
    group?: MuscleGroup | null
    scope?: Scope | null
  }) {
    const params = new URLSearchParams()
    const resolvedQ = opts.q !== undefined ? opts.q : q
    const resolvedGroup =
      opts.group !== undefined ? opts.group : groupFilter
    const resolvedScope = opts.scope !== undefined ? opts.scope : scope

    if (resolvedQ) params.set("q", resolvedQ)
    if (resolvedGroup) params.set("group", resolvedGroup)
    if (resolvedScope && resolvedScope !== "all")
      params.set("scope", resolvedScope)

    const qs = params.toString()
    return `/dashboard/exercises${qs ? `?${qs}` : ""}`
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent.bgSoft}`}
          >
            <Dumbbell className={`h-5 w-5 ${accent.icon}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Bibliothèque d&apos;exercices
            </h1>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Catalogue officiel et vos mouvements personnalisés. Filtrez par
              zone musculaire, voyez où chaque exercice est utilisé (programmes
              et séances).
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span
                className={`rounded-md border px-2 py-1 ${accent.badge}`}
              >
                {exercises.length} résultat{exercises.length !== 1 ? "s" : ""}
              </span>
              {scope === "all" && customInResults > 0 && (
                <span className="rounded-md border border-border bg-muted/50 px-2 py-1">
                  dont {customInResults} personnalisé
                  {customInResults !== 1 ? "s" : ""}
                </span>
              )}
              <span className="rounded-md border border-border px-2 py-1">
                Catalogue · {catalogueTotal} exercices
              </span>
              <span className="rounded-md border border-border px-2 py-1">
                Mes créations · {mineTotal}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:shrink-0">
          <SearchInput placeholder="Rechercher par nom…" />
          <ExerciseSheet />
        </div>
      </div>

      {/* Filtres origine */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Origine</span>
        {(
          [
            ["all", "Tout afficher"],
            ["catalog", "Catalogue uniquement"],
            ["mine", "Mes exercices"],
          ] as const
        ).map(([value, label]) => {
          const active = scope === value
          return (
            <Link
              key={value}
              href={buildHref({ scope: value })}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "border-amber-500/40 bg-amber-500/12 text-amber-950 dark:bg-amber-950/35 dark:text-amber-100"
                  : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
              )}
            >
              {label}
            </Link>
          )
        })}
      </div>

      {/* Filtres groupe musculaire */}
      <div className="mb-8 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs font-medium text-muted-foreground">
          Muscle
        </span>
        <Link
          href={buildHref({ group: null })}
          className={cn(
            "rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
            !groupFilter
              ? "border-amber-500/40 bg-amber-500/12 text-amber-950 dark:bg-amber-950/35 dark:text-amber-100"
              : "border-transparent bg-muted/60 text-muted-foreground hover:bg-muted"
          )}
        >
          Tous
        </Link>
        {MUSCLE_ORDER.map((muscleKey) => {
          const active = groupFilter === muscleKey
          const count = exercises.filter((e) => e.muscleGroup === muscleKey).length
          return (
            <Link
              key={muscleKey}
              href={buildHref({ group: muscleKey })}
              className={cn(
                "rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
                active
                  ? "border-amber-500/40 bg-amber-500/12 text-amber-950 dark:bg-amber-950/35 dark:text-amber-100"
                  : "border-transparent bg-muted/40 text-muted-foreground hover:bg-muted/70"
              )}
            >
              {MUSCLE_GROUPS[muscleKey]}
              {!groupFilter && count > 0 && (
                <span className="ml-1 opacity-70">({count})</span>
              )}
            </Link>
          )
        })}
      </div>

      {exercises.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card py-20 text-center">
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${accent.bgSoft}`}
          >
            <Dumbbell className={`h-6 w-6 ${accent.icon}`} />
          </div>
          <p className="text-sm font-medium text-foreground">
            Aucun exercice ne correspond
          </p>
          <p className="mt-1 max-w-md text-xs text-muted-foreground">
            Élargissez les filtres ou lancez{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
              npx prisma db seed
            </code>{" "}
            pour importer le catalogue global.
          </p>
          <Link
            href="/dashboard/exercises"
            className="mt-4 text-xs font-medium text-amber-700 underline-offset-4 hover:underline dark:text-amber-400"
          >
            Réinitialiser les filtres
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {sections.map(([groupKey, items]) => {
            if (!items?.length) return null
            return (
              <section key={groupKey}>
                <div className="mb-3 flex items-baseline gap-2 border-b border-border pb-2">
                  <h2 className="text-sm font-semibold text-foreground">
                    {MUSCLE_GROUPS[groupKey]}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {items.length} exercice{items.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {items.map((exercise) => (
                    <ExerciseLibraryCard
                      key={exercise.id}
                      href={`/dashboard/exercises/${exercise.id}`}
                      name={exercise.name}
                      description={exercise.description}
                      muscleGroup={exercise.muscleGroup}
                      imageUrl={exercise.imageUrl}
                      isGlobal={exercise.isGlobal}
                      programCount={exercise._count.programExercises}
                      sessionCount={exercise._count.sessionExercises}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
