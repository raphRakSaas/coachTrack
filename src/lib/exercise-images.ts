import { MuscleGroup } from "@prisma/client"

const DEFAULT_EXERCISE_IMAGE_URL =
  "https://images.pexels.com/photos/3888342/pexels-photo-3888342.jpeg"

const FALLBACK_IMAGE_BY_MUSCLE_GROUP: Record<MuscleGroup, string> = {
  CHEST: "https://images.pexels.com/photos/4853659/pexels-photo-4853659.jpeg",
  BACK: "https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg",
  SHOULDERS: "https://images.pexels.com/photos/8846521/pexels-photo-8846521.jpeg",
  BICEPS: "https://images.pexels.com/photos/3838389/pexels-photo-3838389.jpeg",
  TRICEPS: "https://images.pexels.com/photos/1638336/pexels-photo-1638336.jpeg",
  LEGS: "https://images.pexels.com/photos/4720776/pexels-photo-4720776.jpeg",
  GLUTES: "https://images.pexels.com/photos/2247179/pexels-photo-2247179.jpeg",
  ABS: "https://images.pexels.com/photos/8070393/pexels-photo-8070393.jpeg",
  CARDIO: "https://images.pexels.com/photos/6339603/pexels-photo-6339603.jpeg",
  FULL_BODY: "https://images.pexels.com/photos/14252286/pexels-photo-14252286.jpeg",
}

export function getExerciseImageUrl(input: {
  imageUrl: string | null
  muscleGroup: MuscleGroup
}) {
  if (input.imageUrl) return input.imageUrl

  return FALLBACK_IMAGE_BY_MUSCLE_GROUP[input.muscleGroup] ?? DEFAULT_EXERCISE_IMAGE_URL
}

