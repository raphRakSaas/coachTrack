import { MuscleGroup } from "@prisma/client"
import { writeFile } from "node:fs/promises"

type ExerciseSeed = {
  name: string
  muscleGroup: MuscleGroup
}

type ImageCandidate = {
  url: string
  licenseShortName?: string
  descriptionUrl?: string
}

// Wikimedia Commons API helper
async function searchCommonsImage(searchTerm: string): Promise<ImageCandidate | null> {
  const endpoint = "https://commons.wikimedia.org/w/api.php"
  const url =
    `${endpoint}?action=query&format=json&origin=*` +
    `&generator=search&gsrnamespace=6&gsrlimit=3&gsrsearch=${encodeURIComponent(
      `${searchTerm} exercise`
    )}` +
    `&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1000`

  const response = await fetch(url, {
    headers: {
      "user-agent": "coachtrack-seed/1.0 (generate exercise image map)",
    },
  })
  if (!response.ok) return null
  const json = (await response.json()) as any
  const pages = json?.query?.pages
  if (!pages) return null

  const pageValues = Object.values(pages) as any[]
  for (const page of pageValues) {
    const info = page?.imageinfo?.[0]
    const imageUrl: string | undefined = info?.thumburl ?? info?.url
    if (!imageUrl) continue

    const meta = info?.extmetadata ?? {}
    const licenseShortName = meta?.LicenseShortName?.value as string | undefined
    const descriptionUrl = meta?.LicenseUrl?.value as string | undefined

    return { url: imageUrl, licenseShortName, descriptionUrl }
  }

  return null
}

function buildSearchTerm(exercise: ExerciseSeed) {
  // Minimal translation/keywords to improve relevance.
  // You can refine this map over time if you want more “perfect” matches.
  const explicit: Record<string, string> = {
    "Développé couché": "bench press",
    "Développé couché incliné": "incline bench press",
    "Développé décliné": "decline bench press",
    "Développé haltères": "dumbbell bench press",
    Pompes: "push up",
    "Pompes inclinées": "incline push up",
    "Écarté haltères": "dumbbell fly",
    "Écarté à la poulie": "cable fly",
    "Pec deck": "pec deck",
    Tractions: "pull up",
    "Tractions supination": "chin up",
    "Tirage horizontal": "seated row",
    "Tirage vertical": "lat pulldown",
    "Rowing barre": "barbell row",
    "Rowing haltère un bras": "one arm dumbbell row",
    "Rowing T-bar": "t bar row",
    "Soulevé de terre": "deadlift",
    "Tirage à la poulie basse": "cable row",
    "Pull-over": "dumbbell pullover",
    "Développé militaire": "overhead press",
    "Développé haltères assis": "seated dumbbell shoulder press",
    "Élévations latérales": "lateral raise",
    "Élévations frontales": "front raise",
    Oiseau: "rear delt fly",
    "Face pull": "face pull",
    Shrugs: "shrug",
    "Curl barre": "barbell curl",
    "Curl haltères": "dumbbell curl",
    "Curl marteau": "hammer curl",
    "Curl pupitre": "preacher curl",
    "Curl à la poulie": "cable curl",
    "Curl concentré": "concentration curl",
    Dips: "dips exercise",
    "Extensions à la poulie": "triceps pushdown",
    "Extensions au-dessus de la tête": "overhead triceps extension",
    "Développé couché prise serrée": "close grip bench press",
    Kickback: "triceps kickback",
    "Skull crusher": "skull crushers",
    Squat: "barbell squat",
    "Front squat": "front squat",
    "Squat bulgare": "bulgarian split squat",
    "Soulevé de terre roumain": "romanian deadlift",
    "Presse à cuisses": "leg press",
    Fentes: "lunges",
    "Extensions de jambes": "leg extension",
    "Leg curl": "leg curl",
    "Mollets debout": "standing calf raise",
    "Mollets assis": "seated calf raise",
    "Hip thrust": "hip thrust",
    "Glute bridge": "glute bridge",
    "Kickback à la poulie": "glute kickback cable",
    "Sumo squat": "sumo squat",
    "Step up": "step up",
    Crunch: "crunch exercise",
    Planche: "plank exercise",
    "Planche latérale": "side plank",
    "Russian twist": "russian twist",
    "Relevés de jambes suspendu": "hanging leg raise",
    "Mountain climber": "mountain climber exercise",
    "Hollow hold": "hollow body hold",
    "Roue abdominale": "ab wheel rollout",
    "Course à pied": "running",
    Vélo: "cycling exercise",
    Rameur: "rowing machine",
    "Corde à sauter": "jump rope",
    "Vélo elliptique": "elliptical trainer",
    "Tapis incliné": "treadmill incline walk",
    Sprint: "sprint running",
    Burpees: "burpee",
    "Kettlebell swing": "kettlebell swing",
    Thrusters: "thruster exercise",
    "Clean and press": "clean and press",
    "Turkish get-up": "turkish get up",
    "Farmer's walk": "farmers walk",
    "Wall ball": "wall ball",
    Snatch: "snatch weightlifting",
  }

  return explicit[exercise.name] ?? exercise.name
}

async function main() {
  // Keep in sync with prisma/seed.ts EXERCISES list (names only).
  const exercises: ExerciseSeed[] = [
    // Pectoraux
    { name: "Développé couché", muscleGroup: "CHEST" },
    { name: "Développé couché incliné", muscleGroup: "CHEST" },
    { name: "Développé décliné", muscleGroup: "CHEST" },
    { name: "Développé haltères", muscleGroup: "CHEST" },
    { name: "Pompes", muscleGroup: "CHEST" },
    { name: "Pompes inclinées", muscleGroup: "CHEST" },
    { name: "Écarté haltères", muscleGroup: "CHEST" },
    { name: "Écarté à la poulie", muscleGroup: "CHEST" },
    { name: "Pec deck", muscleGroup: "CHEST" },
    // Dos
    { name: "Tractions", muscleGroup: "BACK" },
    { name: "Tractions supination", muscleGroup: "BACK" },
    { name: "Tirage horizontal", muscleGroup: "BACK" },
    { name: "Tirage vertical", muscleGroup: "BACK" },
    { name: "Rowing barre", muscleGroup: "BACK" },
    { name: "Rowing haltère un bras", muscleGroup: "BACK" },
    { name: "Rowing T-bar", muscleGroup: "BACK" },
    { name: "Soulevé de terre", muscleGroup: "BACK" },
    { name: "Tirage à la poulie basse", muscleGroup: "BACK" },
    { name: "Pull-over", muscleGroup: "BACK" },
    // Épaules
    { name: "Développé militaire", muscleGroup: "SHOULDERS" },
    { name: "Développé haltères assis", muscleGroup: "SHOULDERS" },
    { name: "Élévations latérales", muscleGroup: "SHOULDERS" },
    { name: "Élévations frontales", muscleGroup: "SHOULDERS" },
    { name: "Oiseau", muscleGroup: "SHOULDERS" },
    { name: "Face pull", muscleGroup: "SHOULDERS" },
    { name: "Shrugs", muscleGroup: "SHOULDERS" },
    // Biceps
    { name: "Curl barre", muscleGroup: "BICEPS" },
    { name: "Curl haltères", muscleGroup: "BICEPS" },
    { name: "Curl marteau", muscleGroup: "BICEPS" },
    { name: "Curl pupitre", muscleGroup: "BICEPS" },
    { name: "Curl à la poulie", muscleGroup: "BICEPS" },
    { name: "Curl concentré", muscleGroup: "BICEPS" },
    // Triceps
    { name: "Dips", muscleGroup: "TRICEPS" },
    { name: "Extensions à la poulie", muscleGroup: "TRICEPS" },
    { name: "Extensions au-dessus de la tête", muscleGroup: "TRICEPS" },
    { name: "Développé couché prise serrée", muscleGroup: "TRICEPS" },
    { name: "Kickback", muscleGroup: "TRICEPS" },
    { name: "Skull crusher", muscleGroup: "TRICEPS" },
    // Jambes
    { name: "Squat", muscleGroup: "LEGS" },
    { name: "Front squat", muscleGroup: "LEGS" },
    { name: "Squat bulgare", muscleGroup: "LEGS" },
    { name: "Soulevé de terre roumain", muscleGroup: "LEGS" },
    { name: "Presse à cuisses", muscleGroup: "LEGS" },
    { name: "Fentes", muscleGroup: "LEGS" },
    { name: "Extensions de jambes", muscleGroup: "LEGS" },
    { name: "Leg curl", muscleGroup: "LEGS" },
    { name: "Mollets debout", muscleGroup: "LEGS" },
    { name: "Mollets assis", muscleGroup: "LEGS" },
    // Fessiers
    { name: "Hip thrust", muscleGroup: "GLUTES" },
    { name: "Glute bridge", muscleGroup: "GLUTES" },
    { name: "Kickback à la poulie", muscleGroup: "GLUTES" },
    { name: "Sumo squat", muscleGroup: "GLUTES" },
    { name: "Step up", muscleGroup: "GLUTES" },
    // Abdominaux
    { name: "Crunch", muscleGroup: "ABS" },
    { name: "Planche", muscleGroup: "ABS" },
    { name: "Planche latérale", muscleGroup: "ABS" },
    { name: "Russian twist", muscleGroup: "ABS" },
    { name: "Relevés de jambes suspendu", muscleGroup: "ABS" },
    { name: "Mountain climber", muscleGroup: "ABS" },
    { name: "Hollow hold", muscleGroup: "ABS" },
    { name: "Roue abdominale", muscleGroup: "ABS" },
    // Cardio
    { name: "Course à pied", muscleGroup: "CARDIO" },
    { name: "Vélo", muscleGroup: "CARDIO" },
    { name: "Rameur", muscleGroup: "CARDIO" },
    { name: "Corde à sauter", muscleGroup: "CARDIO" },
    { name: "Vélo elliptique", muscleGroup: "CARDIO" },
    { name: "Tapis incliné", muscleGroup: "CARDIO" },
    { name: "Sprint", muscleGroup: "CARDIO" },
    // Corps entier
    { name: "Burpees", muscleGroup: "FULL_BODY" },
    { name: "Kettlebell swing", muscleGroup: "FULL_BODY" },
    { name: "Thrusters", muscleGroup: "FULL_BODY" },
    { name: "Clean and press", muscleGroup: "FULL_BODY" },
    { name: "Turkish get-up", muscleGroup: "FULL_BODY" },
    { name: "Farmer's walk", muscleGroup: "FULL_BODY" },
    { name: "Wall ball", muscleGroup: "FULL_BODY" },
    { name: "Snatch", muscleGroup: "FULL_BODY" },
  ]

  const result: Record<string, string> = {}
  const missing: string[] = []

  for (const exercise of exercises) {
    const term = buildSearchTerm(exercise)
    const found = await searchCommonsImage(term)
    if (!found?.url) {
      missing.push(exercise.name)
      continue
    }
    result[exercise.name] = found.url
    // Light rate-limiting
    await new Promise((r) => setTimeout(r, 250))
  }

  await writeFile(
    "prisma/exercise-image-map.json",
    JSON.stringify({ images: result, missing }, null, 2),
    "utf-8"
  )

  console.log(`✓ Mapping écrit: prisma/exercise-image-map.json`)
  console.log(`✓ Images trouvées: ${Object.keys(result).length}`)
  console.log(`! Manquants: ${missing.length}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

