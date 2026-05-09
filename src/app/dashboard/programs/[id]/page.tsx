import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, ClipboardList } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { SECTION_ACCENTS } from "@/lib/colors"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClientAvatar } from "@/components/ui/client-avatar"

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const program = await prisma.program.findFirst({
    where: { id, coachId: user.id },
    include: {
      client: { select: { id: true, firstName: true, lastName: true } },
      workoutDays: {
        orderBy: { dayNumber: "asc" },
        include: {
          exercises: {
            orderBy: { order: "asc" },
            include: { exercise: { select: { name: true, muscleGroup: true } } },
          },
        },
      },
    },
  })

  if (!program) notFound()

  const accent = SECTION_ACCENTS.programs

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/dashboard/programs"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Retour aux programmes
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.bgSoft}`}>
              <ClipboardList className={`h-5 w-5 ${accent.icon}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {program.name}
                </h1>
                {!program.isActive && (
                  <Badge variant="secondary" className="text-[10px]">
                    Archivé
                  </Badge>
                )}
              </div>
              <Link
                href={`/dashboard/clients/${program.client.id}`}
                className="mt-1 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ClientAvatar
                  firstName={program.client.firstName}
                  lastName={program.client.lastName}
                  size="xs"
                />
                {program.client.firstName} {program.client.lastName}
              </Link>
            </div>
          </div>

          <Link
            href="/dashboard/programs/new"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Nouveau programme
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Jours d&apos;entraînement
          </p>

          {program.workoutDays.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Aucun jour.</p>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              {program.workoutDays.map((day) => (
                <div
                  key={day.id}
                  className="rounded-xl border border-border bg-muted p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">
                      Jour {day.dayNumber} · {day.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {day.exercises.length} exercice
                      {day.exercises.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {day.exercises.length === 0 ? (
                    <p className="mt-3 text-xs text-muted-foreground">Aucun exercice.</p>
                  ) : (
                    <ul className="mt-3 divide-y divide-border rounded-lg border border-border/60 bg-card">
                      {day.exercises.map((programExercise) => (
                        <li
                          key={programExercise.id}
                          className="flex items-center justify-between gap-3 px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {programExercise.exercise.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {programExercise.sets} séries · {programExercise.reps} reps
                              {programExercise.restTime
                                ? ` · repos ${programExercise.restTime}s`
                                : ""}
                            </p>
                          </div>
                          <div className="text-right text-xs text-muted-foreground">
                            {programExercise.weight !== null
                              ? `${programExercise.weight} kg`
                              : "—"}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Résumé
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Début</span>
              <span className="font-medium text-foreground">
                {new Date(program.startDate).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Jours</span>
              <span className="font-medium text-foreground">
                {program.workoutDays.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Exercices</span>
              <span className="font-medium text-foreground">
                {program.workoutDays.reduce((acc, d) => acc + d.exercises.length, 0)}
              </span>
            </div>
          </div>

          {program.description && (
            <div className="mt-5 rounded-lg border border-border bg-muted p-3">
              <p className="text-xs font-semibold text-foreground">Notes</p>
              <p className="mt-1 text-xs text-muted-foreground">{program.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

