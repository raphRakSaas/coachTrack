import { MuscleGroup } from "@prisma/client"
import { writeFile } from "node:fs/promises"

type ExerciseSeed = {
  name: string
  muscleGroup: MuscleGroup
  search: string
}

type WgerExerciseInfo = {
  id: number
  name: string
  exercise: number
}

type WgerImage = {
  id: number
  image: string
  is_main: boolean
  exercise_base?: number
  exercise?: number
}

async function fetchJson<T>(url: string): Promise<T> {
  const abortController = new AbortController()
  const timeout = setTimeout(() => abortController.abort(), 10_000)
  const response = await fetch(url, {
    headers: { "user-agent": "coachtrack-seed/1.0 (wger image map)" },
    signal: abortController.signal,
  }).finally(() => clearTimeout(timeout))
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`)
  }
  return (await response.json()) as T
}

async function findWgerExerciseBaseId(searchTerm: string) {
  const url =
    `https://wger.de/api/v2/exercise-translation/?limit=10&language=2&name_search=` +
    encodeURIComponent(searchTerm)
  const json = await fetchJson<any>(url)
  const results = (json?.results ?? []) as any[]
  if (!results.length) return null

  return results
    .map((item) => ({
      id: item.id,
      name: item.name,
      exercise: item.exercise,
    }))
    .filter((item) => typeof item.exercise === "number") as WgerExerciseInfo[]
}

async function findWgerImageUrl(exerciseId: number) {
  // Prefer main images, then fallback to first.
  const url = `https://wger.de/api/v2/exerciseimage/?limit=50&exercise=${exerciseId}`
  const json = await fetchJson<any>(url)
  const results = (json?.results ?? []) as WgerImage[]
  if (!results.length) return null

  const main = results.find((img) => img.is_main && img.image) ?? results[0]
  return main?.image ?? null
}

async function main() {
  const exercises: ExerciseSeed[] = [
    { name: "Développé couché", muscleGroup: "CHEST", search: "bench press" },
    { name: "Développé couché incliné", muscleGroup: "CHEST", search: "incline bench press" },
    { name: "Développé décliné", muscleGroup: "CHEST", search: "decline bench press" },
    { name: "Développé haltères", muscleGroup: "CHEST", search: "dumbbell bench press" },
    { name: "Pompes", muscleGroup: "CHEST", search: "push up" },
    { name: "Pompes inclinées", muscleGroup: "CHEST", search: "incline push up" },
    { name: "Écarté haltères", muscleGroup: "CHEST", search: "dumbbell fly" },
    { name: "Écarté à la poulie", muscleGroup: "CHEST", search: "cable fly" },
    { name: "Pec deck", muscleGroup: "CHEST", search: "pec deck" },

    { name: "Tractions", muscleGroup: "BACK", search: "pull up" },
    { name: "Tractions supination", muscleGroup: "BACK", search: "chin up" },
    { name: "Tirage horizontal", muscleGroup: "BACK", search: "seated row" },
    { name: "Tirage vertical", muscleGroup: "BACK", search: "lat pulldown" },
    { name: "Rowing barre", muscleGroup: "BACK", search: "barbell row" },
    { name: "Rowing haltère un bras", muscleGroup: "BACK", search: "one arm dumbbell row" },
    { name: "Rowing T-bar", muscleGroup: "BACK", search: "t bar row" },
    { name: "Soulevé de terre", muscleGroup: "BACK", search: "deadlift" },
    { name: "Tirage à la poulie basse", muscleGroup: "BACK", search: "cable row" },
    { name: "Pull-over", muscleGroup: "BACK", search: "dumbbell pullover" },

    { name: "Développé militaire", muscleGroup: "SHOULDERS", search: "overhead press" },
    { name: "Développé haltères assis", muscleGroup: "SHOULDERS", search: "seated dumbbell shoulder press" },
    { name: "Élévations latérales", muscleGroup: "SHOULDERS", search: "lateral raise" },
    { name: "Élévations frontales", muscleGroup: "SHOULDERS", search: "front raise" },
    { name: "Oiseau", muscleGroup: "SHOULDERS", search: "rear delt fly" },
    { name: "Face pull", muscleGroup: "SHOULDERS", search: "face pull" },
    { name: "Shrugs", muscleGroup: "SHOULDERS", search: "shrug" },

    { name: "Curl barre", muscleGroup: "BICEPS", search: "barbell curl" },
    { name: "Curl haltères", muscleGroup: "BICEPS", search: "dumbbell curl" },
    { name: "Curl marteau", muscleGroup: "BICEPS", search: "hammer curl" },
    { name: "Curl pupitre", muscleGroup: "BICEPS", search: "preacher curl" },
    { name: "Curl à la poulie", muscleGroup: "BICEPS", search: "cable curl" },
    { name: "Curl concentré", muscleGroup: "BICEPS", search: "concentration curl" },

    { name: "Dips", muscleGroup: "TRICEPS", search: "dips" },
    { name: "Extensions à la poulie", muscleGroup: "TRICEPS", search: "triceps pushdown" },
    { name: "Extensions au-dessus de la tête", muscleGroup: "TRICEPS", search: "overhead triceps extension" },
    { name: "Développé couché prise serrée", muscleGroup: "TRICEPS", search: "close grip bench press" },
    { name: "Kickback", muscleGroup: "TRICEPS", search: "triceps kickback" },
    { name: "Skull crusher", muscleGroup: "TRICEPS", search: "skull crusher" },

    { name: "Squat", muscleGroup: "LEGS", search: "barbell squat" },
    { name: "Front squat", muscleGroup: "LEGS", search: "front squat" },
    { name: "Squat bulgare", muscleGroup: "LEGS", search: "bulgarian split squat" },
    { name: "Soulevé de terre roumain", muscleGroup: "LEGS", search: "romanian deadlift" },
    { name: "Presse à cuisses", muscleGroup: "LEGS", search: "leg press" },
    { name: "Fentes", muscleGroup: "LEGS", search: "lunges" },
    { name: "Extensions de jambes", muscleGroup: "LEGS", search: "leg extension" },
    { name: "Leg curl", muscleGroup: "LEGS", search: "leg curl" },
    { name: "Mollets debout", muscleGroup: "LEGS", search: "standing calf raise" },
    { name: "Mollets assis", muscleGroup: "LEGS", search: "seated calf raise" },

    { name: "Hip thrust", muscleGroup: "GLUTES", search: "hip thrust" },
    { name: "Glute bridge", muscleGroup: "GLUTES", search: "glute bridge" },
    { name: "Kickback à la poulie", muscleGroup: "GLUTES", search: "glute kickback" },
    { name: "Sumo squat", muscleGroup: "GLUTES", search: "sumo squat" },
    { name: "Step up", muscleGroup: "GLUTES", search: "step up" },

    { name: "Crunch", muscleGroup: "ABS", search: "crunch" },
    { name: "Planche", muscleGroup: "ABS", search: "plank" },
    { name: "Planche latérale", muscleGroup: "ABS", search: "side plank" },
    { name: "Russian twist", muscleGroup: "ABS", search: "russian twist" },
    { name: "Relevés de jambes suspendu", muscleGroup: "ABS", search: "hanging leg raise" },
    { name: "Mountain climber", muscleGroup: "ABS", search: "mountain climber" },
    { name: "Hollow hold", muscleGroup: "ABS", search: "hollow hold" },
    { name: "Roue abdominale", muscleGroup: "ABS", search: "ab wheel rollout" },

    { name: "Course à pied", muscleGroup: "CARDIO", search: "running" },
    { name: "Vélo", muscleGroup: "CARDIO", search: "cycling" },
    { name: "Rameur", muscleGroup: "CARDIO", search: "rowing machine" },
    { name: "Corde à sauter", muscleGroup: "CARDIO", search: "jump rope" },
    { name: "Vélo elliptique", muscleGroup: "CARDIO", search: "elliptical trainer" },
    { name: "Tapis incliné", muscleGroup: "CARDIO", search: "treadmill incline" },
    { name: "Sprint", muscleGroup: "CARDIO", search: "sprint" },

    { name: "Burpees", muscleGroup: "FULL_BODY", search: "burpee" },
    { name: "Kettlebell swing", muscleGroup: "FULL_BODY", search: "kettlebell swing" },
    { name: "Thrusters", muscleGroup: "FULL_BODY", search: "thruster" },
    { name: "Clean and press", muscleGroup: "FULL_BODY", search: "clean and press" },
    { name: "Turkish get-up", muscleGroup: "FULL_BODY", search: "turkish get up" },
    { name: "Farmer's walk", muscleGroup: "FULL_BODY", search: "farmers walk" },
    { name: "Wall ball", muscleGroup: "FULL_BODY", search: "wall ball" },
    { name: "Snatch", muscleGroup: "FULL_BODY", search: "snatch" },
  ]

  const images: Record<string, string> = {}
  const missing: string[] = []
  const debug: Record<string, any> = {}

  for (const exercise of exercises) {
    try {
      process.stdout.write(`- ${exercise.name}… `)
      const candidates = await findWgerExerciseBaseId(exercise.search)
      if (!candidates?.length) {
        missing.push(exercise.name)
        process.stdout.write("no candidates\n")
        continue
      }

      let imageUrl: string | null = null
      let picked: WgerExerciseInfo | null = null

      for (const candidate of candidates) {
        imageUrl = await findWgerImageUrl(candidate.exercise)
        if (imageUrl) {
          picked = candidate
          break
        }
      }

      if (!imageUrl || !picked) {
        missing.push(exercise.name)
        debug[exercise.name] = { candidatesCount: candidates.length }
        process.stdout.write("no image\n")
        continue
      }

      images[exercise.name] = imageUrl
      debug[exercise.name] = { picked, imageUrl, candidatesCount: candidates.length }
      process.stdout.write("ok\n")
      await new Promise((r) => setTimeout(r, 50))
    } catch (error) {
      missing.push(exercise.name)
      debug[exercise.name] = { error: String(error) }
      process.stdout.write("error\n")
    }
  }

  await writeFile(
    "prisma/exercise-image-map.json",
    JSON.stringify({ source: "wger", images, missing }, null, 2),
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

