"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

type ExerciseEntry = {
  exerciseId: string
  sets: number
  reps: string
  weight: number | null
  restTime: number | null
  order: number
}

type WorkoutDayInput = {
  dayNumber: number
  name: string
  exercises: ExerciseEntry[]
}

export async function createProgram(data: {
  clientId: string
  name: string
  description: string
  startDate: string
  days: WorkoutDayInput[]
}) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.$transaction(async (tx) => {
    const program = await tx.program.create({
      data: {
        coachId: user.id,
        clientId: data.clientId,
        name: data.name,
        description: data.description || null,
        startDate: new Date(data.startDate),
      },
    })

    for (const day of data.days) {
      const workoutDay = await tx.workoutDay.create({
        data: {
          programId: program.id,
          dayNumber: day.dayNumber,
          name: day.name,
        },
      })

      for (const exercise of day.exercises) {
        await tx.programExercise.create({
          data: {
            workoutDayId: workoutDay.id,
            exerciseId: exercise.exerciseId,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            restTime: exercise.restTime,
            order: exercise.order,
          },
        })
      }
    }
  })

  revalidatePath("/dashboard/programs")
}

export async function deleteProgram(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  await prisma.program.delete({ where: { id, coachId: user.id } })

  revalidatePath("/dashboard/programs")
}
