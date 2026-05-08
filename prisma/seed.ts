import { PrismaClient, MuscleGroup } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"
import ws from "ws"
import { config } from "dotenv"
import { readFile } from "node:fs/promises"

config({ path: ".env.local" })

neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

type Seed = {
  name: string
  muscleGroup: MuscleGroup
  description?: string
  imageUrl?: string
}

async function loadExerciseImageMap() {
  const raw = await readFile("prisma/exercise-image-map.json", "utf-8")
  const json = JSON.parse(raw) as { images?: Record<string, string> }
  return json.images ?? {}
}

async function loadWgerImagePool() {
  const raw = await readFile("prisma/wger-image-pool.json", "utf-8")
  const json = JSON.parse(raw) as { urls?: string[] }
  return Array.isArray(json.urls) ? json.urls : []
}

function stableHashToInt(input: string) {
  let hash = 0
  for (let idx = 0; idx < input.length; idx++) {
    hash = (hash << 5) - hash + input.charCodeAt(idx)
    hash |= 0
  }
  return Math.abs(hash)
}

function buildUniqueImageUrlResolver(input: {
  imageMap: Record<string, string>
  wgerImagePool: string[]
  exercises: Seed[]
}) {
  const used = new Set<string>()
  const resolvedByName = new Map<string, string | null>()

  for (const exercise of input.exercises) {
    const explicitUrl = exercise.imageUrl ?? input.imageMap[exercise.name] ?? null
    if (explicitUrl && !used.has(explicitUrl)) {
      used.add(explicitUrl)
      resolvedByName.set(exercise.name, explicitUrl)
      continue
    }

    // Deterministic unique fallback: pick from the pool with linear probing.
    const pool = input.wgerImagePool
    if (!pool.length) {
      resolvedByName.set(exercise.name, explicitUrl)
      continue
    }

    const startIndex = stableHashToInt(`${exercise.name}-${exercise.muscleGroup}`) % pool.length
    let picked: string | null = null

    for (let step = 0; step < pool.length; step++) {
      const candidate = pool[(startIndex + step) % pool.length]
      if (!candidate) continue
      if (used.has(candidate)) continue
      picked = candidate
      break
    }

    if (picked) used.add(picked)
    resolvedByName.set(exercise.name, picked ?? explicitUrl)
  }

  return (exerciseName: string) => resolvedByName.get(exerciseName) ?? null
}

const EXERCISES: Seed[] = [
  // Pectoraux
  { name: "Développé couché", muscleGroup: "CHEST", description: "Développé couché à la barre, prise large." },
  { name: "Développé couché incliné", muscleGroup: "CHEST", description: "Banc incliné à 30-45°." },
  { name: "Développé décliné", muscleGroup: "CHEST", description: "Banc décliné, trajectoire contrôlée, épaules basses." },
  { name: "Développé haltères", muscleGroup: "CHEST", description: "Plus d'amplitude qu'avec une barre." },
  { name: "Pompes", muscleGroup: "CHEST", description: "Au poids du corps, mains à largeur d'épaules." },
  { name: "Pompes inclinées", muscleGroup: "CHEST", description: "Mains sur support, buste gainé, descente complète." },
  { name: "Écarté haltères", muscleGroup: "CHEST", description: "Bras semi-fléchis, ouverture contrôlée, étirement du pec." },
  { name: "Écarté à la poulie", muscleGroup: "CHEST", description: "Coudes légèrement fléchis, ramener les mains devant la poitrine." },
  { name: "Pec deck", muscleGroup: "CHEST", description: "Machine, omoplates serrées, amplitude confortable." },

  // Dos
  { name: "Tractions", muscleGroup: "BACK", description: "Prise pronation, large." },
  { name: "Tractions supination", muscleGroup: "BACK", description: "Travaille aussi les biceps." },
  { name: "Tirage horizontal", muscleGroup: "BACK", description: "Tirer les coudes vers l'arrière, poitrine sortie, dos neutre." },
  { name: "Tirage vertical", muscleGroup: "BACK", description: "À la poulie haute." },
  { name: "Rowing barre", muscleGroup: "BACK", description: "Buste penché, dos plat." },
  { name: "Rowing haltère un bras", muscleGroup: "BACK", description: "Appui stable, tirer le coude vers la hanche, contrôle du mouvement." },
  { name: "Rowing T-bar", muscleGroup: "BACK", description: "Hanche fixe, tirer vers le bas du sternum, ne pas arrondir le dos." },
  { name: "Soulevé de terre", muscleGroup: "BACK", description: "Mouvement polyarticulaire majeur." },
  { name: "Tirage à la poulie basse", muscleGroup: "BACK", description: "Tirage assis, dos droit, serrer les omoplates en fin de tirage." },
  { name: "Pull-over", muscleGroup: "BACK", description: "Bras presque tendus, ramener la barre/corde vers les hanches sans cambrer." },

  // Épaules
  { name: "Développé militaire", muscleGroup: "SHOULDERS", description: "Barre debout ou assis." },
  { name: "Développé haltères assis", muscleGroup: "SHOULDERS", description: "Monter au-dessus de la tête, trajectoire verticale, gainage." },
  { name: "Élévations latérales", muscleGroup: "SHOULDERS", description: "Avec haltères, légère flexion des coudes." },
  { name: "Élévations frontales", muscleGroup: "SHOULDERS", description: "Monter jusqu'à l'horizontale, mouvement contrôlé, pas d'élan." },
  { name: "Oiseau", muscleGroup: "SHOULDERS", description: "Buste penché, travaille les deltoïdes postérieurs." },
  { name: "Face pull", muscleGroup: "SHOULDERS", description: "Tirer la corde vers le visage, coudes hauts, rotation externe." },
  { name: "Shrugs", muscleGroup: "SHOULDERS", description: "Travaille les trapèzes." },

  // Biceps
  { name: "Curl barre", muscleGroup: "BICEPS", description: "Coudes fixés, monter sans balancer, descente lente." },
  { name: "Curl haltères", muscleGroup: "BICEPS", description: "Alterné ou simultané." },
  { name: "Curl marteau", muscleGroup: "BICEPS", description: "Travaille aussi le brachial." },
  { name: "Curl pupitre", muscleGroup: "BICEPS", description: "Bras sur pupitre, amplitude contrôlée, éviter l'hyperextension." },
  { name: "Curl à la poulie", muscleGroup: "BICEPS", description: "Tension continue, coudes serrés au corps, contrôle en bas." },
  { name: "Curl concentré", muscleGroup: "BICEPS", description: "Coude calé sur la cuisse, monter lentement, contraction en haut." },

  // Triceps
  { name: "Dips", muscleGroup: "TRICEPS", description: "Aux barres parallèles." },
  { name: "Extensions à la poulie", muscleGroup: "TRICEPS", description: "Pushdown corde ou barre." },
  { name: "Extensions au-dessus de la tête", muscleGroup: "TRICEPS", description: "Coudes pointés vers l'avant, extension complète sans cambrer." },
  { name: "Développé couché prise serrée", muscleGroup: "TRICEPS", description: "Prise serrée, coudes proches, descente contrôlée sur le bas du pec." },
  { name: "Kickback", muscleGroup: "TRICEPS", description: "Buste penché, bras collé au corps, extension arrière contrôlée." },
  { name: "Skull crusher", muscleGroup: "TRICEPS", description: "Aussi appelé Tate press, à la barre EZ." },

  // Jambes
  { name: "Squat", muscleGroup: "LEGS", description: "Mouvement roi, dos droit, descente complète." },
  { name: "Front squat", muscleGroup: "LEGS", description: "Barre devant, plus exigeant pour les quadriceps." },
  { name: "Squat bulgare", muscleGroup: "LEGS", description: "Pied arrière sur support, genou suit les orteils, buste stable." },
  { name: "Soulevé de terre roumain", muscleGroup: "LEGS", description: "Cible les ischio-jambiers." },
  { name: "Presse à cuisses", muscleGroup: "LEGS", description: "Pieds à plat, descendre sans décoller le bassin, pousser talons." },
  { name: "Fentes", muscleGroup: "LEGS", description: "Avant ou marchées." },
  { name: "Extensions de jambes", muscleGroup: "LEGS", description: "Extension contrôlée, pause en haut, ne pas jeter la charge." },
  { name: "Leg curl", muscleGroup: "LEGS", description: "Allongé ou assis." },
  { name: "Mollets debout", muscleGroup: "LEGS", description: "Monter sur la pointe, pause en haut, amplitude complète." },
  { name: "Mollets assis", muscleGroup: "LEGS", description: "Genoux fléchis, montée contrôlée, étirement en bas." },

  // Fessiers
  { name: "Hip thrust", muscleGroup: "GLUTES", description: "Excellent isolé pour fessiers." },
  { name: "Glute bridge", muscleGroup: "GLUTES", description: "Pieds au sol, monter les hanches, contraction forte en haut." },
  { name: "Kickback à la poulie", muscleGroup: "GLUTES", description: "Extension de hanche à la poulie, bassin stable, amplitude contrôlée." },
  { name: "Sumo squat", muscleGroup: "GLUTES", description: "Pieds larges, pointes ouvertes, pousser les genoux vers l'extérieur." },
  { name: "Step up", muscleGroup: "GLUTES", description: "Monter sur un banc, pousser avec la jambe d'appui, contrôle à la descente." },

  // Abdominaux
  { name: "Crunch", muscleGroup: "ABS", description: "Enrouler le haut du dos, menton rentré, éviter de tirer la nuque." },
  { name: "Planche", muscleGroup: "ABS", description: "Gainage isométrique." },
  { name: "Planche latérale", muscleGroup: "ABS", description: "Aligner épaules-hanches-chevilles, maintenir le bassin haut." },
  { name: "Russian twist", muscleGroup: "ABS", description: "Cible les obliques." },
  { name: "Relevés de jambes suspendu", muscleGroup: "ABS", description: "Gainage, monter les genoux/jambes sans balancer, contrôle en bas." },
  { name: "Mountain climber", muscleGroup: "ABS", description: "Position planche, ramener les genoux vite mais buste stable." },
  { name: "Hollow hold", muscleGroup: "ABS", description: "Bas du dos collé, bras/jambes tendus, maintenir la position." },
  { name: "Roue abdominale", muscleGroup: "ABS", description: "Rouler sans cambrer, gainage fort, revenir en contrôlant." },

  // Cardio
  { name: "Course à pied", muscleGroup: "CARDIO", description: "Allure régulière, posture haute, foulée légère." },
  { name: "Vélo", muscleGroup: "CARDIO", description: "Cadence fluide, dos neutre, intensité selon objectif." },
  { name: "Rameur", muscleGroup: "CARDIO", description: "Cardio + dos + jambes." },
  { name: "Corde à sauter", muscleGroup: "CARDIO", description: "Petits sauts, poignets actifs, rester sur l'avant du pied." },
  { name: "Vélo elliptique", muscleGroup: "CARDIO", description: "Mouvement complet, pousser/tirer les bras, rythme constant." },
  { name: "Tapis incliné", muscleGroup: "CARDIO", description: "Marche rapide en inclinaison, garder les hanches alignées." },
  { name: "Sprint", muscleGroup: "CARDIO", description: "Efforts courts, récupération complète, technique propre." },

  // Corps entier
  {
    name: "Burpees",
    muscleGroup: "FULL_BODY",
    description: "Squat + planche + saut, rythme constant, gainage.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Burpees.gif",
  },
  {
    name: "Kettlebell swing",
    muscleGroup: "FULL_BODY",
    description: "Charnière de hanche, dos neutre, puissance des hanches.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Maurice_Kettle_Bell_Swings.jpg",
  },
  {
    name: "Thrusters",
    muscleGroup: "FULL_BODY",
    description: "Front squat suivi d'un développé.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/e/e8/U.S._Army_2nd_Lt._Wesley_Gordon_with_the_1st_Air_Cavalry_Brigade_prepares_to_lift_a_barbell_over_his_head_while_doing_thrusters_during_the_CrossFit_Open_competition_at_Fort_Hood%2C_Texas%2C_April_5%2C_2013_130405-A-CJ112-306.jpg",
  },
  {
    name: "Clean and press",
    muscleGroup: "FULL_BODY",
    description: "Arracher la charge aux épaules puis pousser au-dessus de la tête.",
    // TODO: set a better dedicated image URL
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/Snatch2.gif",
  },
  {
    name: "Turkish get-up",
    muscleGroup: "FULL_BODY",
    description: "Montée contrôlée en étapes, bras verrouillé, stabilité du tronc.",
    // TODO: set a better dedicated image URL
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Maurice_Kettle_Bell_Swings.jpg",
  },
  {
    name: "Farmer's walk",
    muscleGroup: "FULL_BODY",
    description: "Marcher lourd, épaules basses, gainage, pas courts.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/USMC-111018-M-FY706-002.jpg",
  },
  {
    name: "Wall ball",
    muscleGroup: "FULL_BODY",
    description: "Squat puis lancer au mur, viser constant, réception souple.",
    // TODO: set a better dedicated image URL
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Burpees.gif",
  },
  {
    name: "Snatch",
    muscleGroup: "FULL_BODY",
    description: "Mouvement haltérophilie.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/Snatch2.gif",
  },
]

async function main() {
  console.log(`Seeding ${EXERCISES.length} exercices globaux...`)
  const imageMap = await loadExerciseImageMap()
  const wgerImagePool = await loadWgerImagePool()
  const resolveImageUrl = buildUniqueImageUrlResolver({
    imageMap,
    wgerImagePool,
    exercises: EXERCISES,
  })

  let created = 0
  let skipped = 0

  for (const ex of EXERCISES) {
    const existing = (await prisma.exercise.findFirst({
      where: { name: ex.name, isGlobal: true },
    })) as any
    const data = {
      name: ex.name,
      muscleGroup: ex.muscleGroup,
      description: ex.description ?? null,
      imageUrl: resolveImageUrl(ex.name),
      isGlobal: true,
      coachId: null,
    } as any

    if (existing) {
      await (prisma.exercise.update as any)({
        where: { id: existing.id },
        data: {
          description: existing.description ?? data.description,
          imageUrl: data.imageUrl,
        },
      })
      skipped++
      continue
    }

    await prisma.exercise.create({ data })
    created++
  }

  console.log(`✓ ${created} créés, ${skipped} déjà existants.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
