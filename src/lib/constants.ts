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

export const GENDER_LABELS: Record<string, string> = {
  MALE: "Homme",
  FEMALE: "Femme",
  OTHER: "Autre",
}

export const FITNESS_LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Débutant",
  INTERMEDIATE: "Intermédiaire",
  ADVANCED: "Avancé",
  ELITE: "Élite",
}

export const GOAL_TYPE_LABELS: Record<string, string> = {
  WEIGHT_LOSS: "Perte de poids",
  MUSCLE_GAIN: "Prise de masse",
  PERFORMANCE: "Performance",
  ENDURANCE: "Endurance",
  WELLBEING: "Bien-être",
  REHABILITATION: "Rééducation",
}

export const COUNTRY_CODES = [
  { code: "+33", label: "🇫🇷 +33" },
  { code: "+32", label: "🇧🇪 +32" },
  { code: "+41", label: "🇨🇭 +41" },
  { code: "+352", label: "🇱🇺 +352" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+49", label: "🇩🇪 +49" },
  { code: "+34", label: "🇪🇸 +34" },
  { code: "+39", label: "🇮🇹 +39" },
  { code: "+351", label: "🇵🇹 +351" },
  { code: "+212", label: "🇲🇦 +212" },
  { code: "+213", label: "🇩🇿 +213" },
  { code: "+216", label: "🇹🇳 +216" },
]

export const RPE_LABELS: Record<number, string> = {
  1: "1 – Très facile",
  2: "2 – Facile",
  3: "3 – Légèrement facile",
  4: "4 – Modéré",
  5: "5 – Challengeant",
  6: "6 – Dur",
  7: "7 – Très dur",
  8: "8 – Extrêmement dur",
  9: "9 – Max ou presque",
  10: "10 – Maximum absolu",
}

export const MOOD_LABELS: Record<number, string> = {
  1: "1 – Épuisé",
  2: "2 – Fatigué",
  3: "3 – Neutre",
  4: "4 – Bien",
  5: "5 – Excellent",
}
