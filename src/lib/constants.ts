import { MuscleGroup } from "@prisma/client"

export const MUSCLE_GROUPS: Record<MuscleGroup, string> = {
  CHEST: "Pectoraux",
  BACK: "Dos",
  SHOULDERS: "Épaules",
  BICEPS: "Biceps",
  TRICEPS: "Triceps",
  LEGS: "Jambes",
  GLUTES: "Fessiers",
  ABS: "Abdominaux",
  CARDIO: "Cardio",
  FULL_BODY: "Corps entier",
}
