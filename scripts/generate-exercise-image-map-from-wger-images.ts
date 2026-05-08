import { MuscleGroup } from "@prisma/client"
import { writeFile } from "node:fs/promises"

type SeedExercise = {
  name: string
  muscleGroup: MuscleGroup
  searchEn: string
}

type WgerExerciseImage = {
  id: number
  exercise: number
  image: string
  is_main: boolean
}

type WgerPaginated<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

type WgerExerciseTranslation = {
  id: number
  name: string
  exercise: number
  language: number
}

async function fetchJson<T>(url: string): Promise<T> {
  const abortController = new AbortController()
  const timeout = setTimeout(() => abortController.abort(), 12_000)
  const response = await fetch(url, {
    headers: { "user-agent": "coachtrack-seed/1.0 (image-map generator)" },
    signal: abortController.signal,
  }).finally(() => clearTimeout(timeout))

  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`)
  return (await response.json()) as T
}

async function fetchAllExerciseImages() {
  const exerciseIdToMainImageUrl = new Map<number, string>()
  const exerciseIdToAnyImageUrl = new Map<number, string>()

  let nextUrl: string | null =
    "https://wger.de/api/v2/exerciseimage/?limit=200&offset=0"

  while (nextUrl) {
    const page: WgerPaginated<WgerExerciseImage> =
      await fetchJson<WgerPaginated<WgerExerciseImage>>(nextUrl)
    for (const item of page.results) {
      if (!exerciseIdToAnyImageUrl.has(item.exercise)) {
        exerciseIdToAnyImageUrl.set(item.exercise, item.image)
      }
      if (item.is_main) {
        exerciseIdToMainImageUrl.set(item.exercise, item.image)
      }
    }
    nextUrl = page.next
  }

  const exerciseIdToImageUrl = new Map<number, string>()
  for (const [exerciseId, anyUrl] of exerciseIdToAnyImageUrl.entries()) {
    exerciseIdToImageUrl.set(
      exerciseId,
      exerciseIdToMainImageUrl.get(exerciseId) ?? anyUrl
    )
  }

  return exerciseIdToImageUrl
}

async function findImageForSearchTerm(input: {
  searchEn: string
  exerciseIdToImageUrl: Map<number, string>
  usedImageUrls: Set<string>
}) {
  // Use the translation endpoint (English = 2) and pick first result that has an image.
  const url =
    "https://wger.de/api/v2/exercise-translation/?" +
    new URLSearchParams({
      limit: "50",
      language: "2",
      name_search: input.searchEn,
    }).toString()

  const page: WgerPaginated<WgerExerciseTranslation> =
    await fetchJson<WgerPaginated<WgerExerciseTranslation>>(url)
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim()

  const searchNormalized = normalize(input.searchEn)
  const searchTokens = new Set(searchNormalized.split(" ").filter(Boolean))

  const scoredCandidates = page.results
    .map((candidate) => {
      const imageUrl = input.exerciseIdToImageUrl.get(candidate.exercise) ?? null
      if (!imageUrl) return null

      const candidateNormalized = normalize(candidate.name)
      const candidateTokens = new Set(candidateNormalized.split(" ").filter(Boolean))
      let tokenMatches = 0
      for (const token of searchTokens) if (candidateTokens.has(token)) tokenMatches++

      // Higher is better. Prefer more token matches, then closer length.
      const score =
        tokenMatches * 10 - Math.abs(candidateNormalized.length - searchNormalized.length)

      return {
        candidate,
        imageUrl,
        score,
      }
    })
    .filter(Boolean) as {
    candidate: WgerExerciseTranslation
    imageUrl: string
    score: number
  }[]

  scoredCandidates.sort((a, b) => b.score - a.score)

  // Prefer an unused image URL for uniqueness.
  const preferred =
    scoredCandidates.find((c) => !input.usedImageUrls.has(c.imageUrl)) ??
    scoredCandidates[0]

  if (preferred) {
    return {
      imageUrl: preferred.imageUrl,
      matchedName: preferred.candidate.name,
      exerciseId: preferred.candidate.exercise,
      score: preferred.score,
      candidatesWithImages: scoredCandidates.length,
    }
  }

  return null
}

function getSeedExercises(): SeedExercise[] {
  return [
    // Pectoraux
    { name: "Développé couché", muscleGroup: "CHEST", searchEn: "bench press" },
    { name: "Développé couché incliné", muscleGroup: "CHEST", searchEn: "incline bench press" },
    { name: "Développé décliné", muscleGroup: "CHEST", searchEn: "decline bench press" },
    { name: "Développé haltères", muscleGroup: "CHEST", searchEn: "dumbbell bench press" },
    { name: "Pompes", muscleGroup: "CHEST", searchEn: "push up" },
    { name: "Pompes inclinées", muscleGroup: "CHEST", searchEn: "incline push up" },
    { name: "Écarté haltères", muscleGroup: "CHEST", searchEn: "dumbbell fly" },
    { name: "Écarté à la poulie", muscleGroup: "CHEST", searchEn: "cable fly" },
    { name: "Pec deck", muscleGroup: "CHEST", searchEn: "pec deck" },

    // Dos
    { name: "Tractions", muscleGroup: "BACK", searchEn: "pull up" },
    { name: "Tractions supination", muscleGroup: "BACK", searchEn: "chin up" },
    { name: "Tirage horizontal", muscleGroup: "BACK", searchEn: "seated row" },
    { name: "Tirage vertical", muscleGroup: "BACK", searchEn: "lat pulldown" },
    { name: "Rowing barre", muscleGroup: "BACK", searchEn: "barbell row" },
    { name: "Rowing haltère un bras", muscleGroup: "BACK", searchEn: "one arm dumbbell row" },
    { name: "Rowing T-bar", muscleGroup: "BACK", searchEn: "t bar row" },
    { name: "Soulevé de terre", muscleGroup: "BACK", searchEn: "deadlift" },
    { name: "Tirage à la poulie basse", muscleGroup: "BACK", searchEn: "cable row" },
    { name: "Pull-over", muscleGroup: "BACK", searchEn: "dumbbell pullover" },

    // Épaules
    { name: "Développé militaire", muscleGroup: "SHOULDERS", searchEn: "overhead press" },
    { name: "Développé haltères assis", muscleGroup: "SHOULDERS", searchEn: "seated dumbbell shoulder press" },
    { name: "Élévations latérales", muscleGroup: "SHOULDERS", searchEn: "lateral raise" },
    { name: "Élévations frontales", muscleGroup: "SHOULDERS", searchEn: "front raise" },
    { name: "Oiseau", muscleGroup: "SHOULDERS", searchEn: "rear delt fly" },
    { name: "Face pull", muscleGroup: "SHOULDERS", searchEn: "face pull" },
    { name: "Shrugs", muscleGroup: "SHOULDERS", searchEn: "shrug" },

    // Biceps
    { name: "Curl barre", muscleGroup: "BICEPS", searchEn: "barbell curl" },
    { name: "Curl haltères", muscleGroup: "BICEPS", searchEn: "dumbbell curl" },
    { name: "Curl marteau", muscleGroup: "BICEPS", searchEn: "hammer curl" },
    { name: "Curl pupitre", muscleGroup: "BICEPS", searchEn: "preacher curl" },
    { name: "Curl à la poulie", muscleGroup: "BICEPS", searchEn: "cable curl" },
    { name: "Curl concentré", muscleGroup: "BICEPS", searchEn: "concentration curl" },

    // Triceps
    { name: "Dips", muscleGroup: "TRICEPS", searchEn: "dips" },
    { name: "Extensions à la poulie", muscleGroup: "TRICEPS", searchEn: "triceps pushdown" },
    { name: "Extensions au-dessus de la tête", muscleGroup: "TRICEPS", searchEn: "overhead triceps extension" },
    { name: "Développé couché prise serrée", muscleGroup: "TRICEPS", searchEn: "close grip bench press" },
    { name: "Kickback", muscleGroup: "TRICEPS", searchEn: "triceps kickback" },
    { name: "Skull crusher", muscleGroup: "TRICEPS", searchEn: "skull crusher" },

    // Jambes
    { name: "Squat", muscleGroup: "LEGS", searchEn: "barbell squat" },
    { name: "Front squat", muscleGroup: "LEGS", searchEn: "front squat" },
    { name: "Squat bulgare", muscleGroup: "LEGS", searchEn: "bulgarian split squat" },
    { name: "Soulevé de terre roumain", muscleGroup: "LEGS", searchEn: "romanian deadlift" },
    { name: "Presse à cuisses", muscleGroup: "LEGS", searchEn: "leg press" },
    { name: "Fentes", muscleGroup: "LEGS", searchEn: "lunge" },
    { name: "Extensions de jambes", muscleGroup: "LEGS", searchEn: "leg extension" },
    { name: "Leg curl", muscleGroup: "LEGS", searchEn: "leg curl" },
    { name: "Mollets debout", muscleGroup: "LEGS", searchEn: "standing calf raise" },
    { name: "Mollets assis", muscleGroup: "LEGS", searchEn: "seated calf raise" },

    // Fessiers
    { name: "Hip thrust", muscleGroup: "GLUTES", searchEn: "hip thrust" },
    { name: "Glute bridge", muscleGroup: "GLUTES", searchEn: "glute bridge" },
    { name: "Kickback à la poulie", muscleGroup: "GLUTES", searchEn: "glute kickback" },
    { name: "Sumo squat", muscleGroup: "GLUTES", searchEn: "sumo squat" },
    { name: "Step up", muscleGroup: "GLUTES", searchEn: "step up" },

    // Abdominaux
    { name: "Crunch", muscleGroup: "ABS", searchEn: "crunch" },
    { name: "Planche", muscleGroup: "ABS", searchEn: "plank" },
    { name: "Planche latérale", muscleGroup: "ABS", searchEn: "side plank" },
    { name: "Russian twist", muscleGroup: "ABS", searchEn: "russian twist" },
    { name: "Relevés de jambes suspendu", muscleGroup: "ABS", searchEn: "hanging leg raise" },
    { name: "Mountain climber", muscleGroup: "ABS", searchEn: "mountain climber" },
    { name: "Hollow hold", muscleGroup: "ABS", searchEn: "hollow hold" },
    { name: "Roue abdominale", muscleGroup: "ABS", searchEn: "ab wheel" },

    // Cardio
    { name: "Course à pied", muscleGroup: "CARDIO", searchEn: "running" },
    { name: "Vélo", muscleGroup: "CARDIO", searchEn: "cycling" },
    { name: "Rameur", muscleGroup: "CARDIO", searchEn: "rowing machine" },
    { name: "Corde à sauter", muscleGroup: "CARDIO", searchEn: "jump rope" },
    { name: "Vélo elliptique", muscleGroup: "CARDIO", searchEn: "elliptical trainer" },
    { name: "Tapis incliné", muscleGroup: "CARDIO", searchEn: "treadmill incline" },
    { name: "Sprint", muscleGroup: "CARDIO", searchEn: "sprint" },

    // Corps entier
    { name: "Burpees", muscleGroup: "FULL_BODY", searchEn: "burpee" },
    { name: "Kettlebell swing", muscleGroup: "FULL_BODY", searchEn: "kettlebell swing" },
    { name: "Thrusters", muscleGroup: "FULL_BODY", searchEn: "thruster" },
    { name: "Clean and press", muscleGroup: "FULL_BODY", searchEn: "clean and press" },
    { name: "Turkish get-up", muscleGroup: "FULL_BODY", searchEn: "turkish get up" },
    { name: "Farmer's walk", muscleGroup: "FULL_BODY", searchEn: "farmers walk" },
    { name: "Wall ball", muscleGroup: "FULL_BODY", searchEn: "wall ball" },
    { name: "Snatch", muscleGroup: "FULL_BODY", searchEn: "snatch" },
  ]
}

async function main() {
  const exerciseIdToImageUrl = await fetchAllExerciseImages()
  const exercises = getSeedExercises()

  const images: Record<string, string> = {}
  const missing: string[] = []
  const debug: Record<string, unknown> = {}
  const usedImageUrls = new Set<string>()

  for (const exercise of exercises) {
    process.stdout.write(`- ${exercise.name}… `)
    const match = await findImageForSearchTerm({
      searchEn: exercise.searchEn,
      exerciseIdToImageUrl,
      usedImageUrls,
    })
    if (!match?.imageUrl) {
      process.stdout.write("missing\n")
      missing.push(exercise.name)
      continue
    }

    images[exercise.name] = match.imageUrl
    usedImageUrls.add(match.imageUrl)
    debug[exercise.name] = match
    process.stdout.write("ok\n")
    await new Promise((r) => setTimeout(r, 50))
  }

  await writeFile(
    "prisma/exercise-image-map.json",
    JSON.stringify(
      { source: "wger (exerciseimage index)", images, missing },
      null,
      2
    ),
    "utf-8"
  )

  await writeFile(
    "prisma/exercise-image-map.debug.json",
    JSON.stringify(debug, null, 2),
    "utf-8"
  )

  console.log(`✓ Mapping écrit: prisma/exercise-image-map.json`)
  console.log(`✓ Images trouvées: ${Object.keys(images).length}`)
  console.log(`! Manquants: ${missing.length}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

