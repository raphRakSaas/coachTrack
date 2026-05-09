import Link from "next/link"
import { redirect, notFound } from "next/navigation"
import { ChevronLeft, Dumbbell } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { SECTION_ACCENTS } from "@/lib/colors"
import { buttonVariants } from "@/components/ui/button"
import { ExerciseDetail } from "@/components/dashboard/exercises/exercise-detail"

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const exercise = await prisma.exercise.findFirst({
    where: {
      id,
      OR: [{ isGlobal: true }, { coachId: user.id }],
    },
  })

  if (!exercise) notFound()

  const accent = SECTION_ACCENTS.exercises

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.bgSoft}`}>
            <Dumbbell className={`h-5 w-5 ${accent.icon}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/exercises"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                <ChevronLeft className="h-4 w-4" />
                Retour
              </Link>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-foreground">
              {exercise.name}
            </h1>
          </div>
        </div>
      </div>

      <ExerciseDetail exercise={exercise} />
    </div>
  )
}

