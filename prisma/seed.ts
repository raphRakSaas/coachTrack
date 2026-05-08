import { PrismaClient, MuscleGroup } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"
import ws from "ws"
import { config } from "dotenv"

config({ path: ".env.local" })

neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

type Seed = {
  name: string
  muscleGroup: MuscleGroup
  description?: string
}

const EXERCISES: Seed[] = [
  // Pectoraux
  { name: "Développé couché", muscleGroup: "CHEST", description: "Développé couché à la barre, prise large." },
  { name: "Développé couché incliné", muscleGroup: "CHEST", description: "Banc incliné à 30-45°." },
  { name: "Développé décliné", muscleGroup: "CHEST" },
  { name: "Développé haltères", muscleGroup: "CHEST", description: "Plus d'amplitude qu'avec une barre." },
  { name: "Pompes", muscleGroup: "CHEST", description: "Au poids du corps, mains à largeur d'épaules." },
  { name: "Pompes inclinées", muscleGroup: "CHEST" },
  { name: "Écarté haltères", muscleGroup: "CHEST" },
  { name: "Écarté à la poulie", muscleGroup: "CHEST" },
  { name: "Pec deck", muscleGroup: "CHEST" },

  // Dos
  { name: "Tractions", muscleGroup: "BACK", description: "Prise pronation, large." },
  { name: "Tractions supination", muscleGroup: "BACK", description: "Travaille aussi les biceps." },
  { name: "Tirage horizontal", muscleGroup: "BACK" },
  { name: "Tirage vertical", muscleGroup: "BACK", description: "À la poulie haute." },
  { name: "Rowing barre", muscleGroup: "BACK", description: "Buste penché, dos plat." },
  { name: "Rowing haltère un bras", muscleGroup: "BACK" },
  { name: "Rowing T-bar", muscleGroup: "BACK" },
  { name: "Soulevé de terre", muscleGroup: "BACK", description: "Mouvement polyarticulaire majeur." },
  { name: "Tirage à la poulie basse", muscleGroup: "BACK" },
  { name: "Pull-over", muscleGroup: "BACK" },

  // Épaules
  { name: "Développé militaire", muscleGroup: "SHOULDERS", description: "Barre debout ou assis." },
  { name: "Développé haltères assis", muscleGroup: "SHOULDERS" },
  { name: "Élévations latérales", muscleGroup: "SHOULDERS", description: "Avec haltères, légère flexion des coudes." },
  { name: "Élévations frontales", muscleGroup: "SHOULDERS" },
  { name: "Oiseau", muscleGroup: "SHOULDERS", description: "Buste penché, travaille les deltoïdes postérieurs." },
  { name: "Face pull", muscleGroup: "SHOULDERS" },
  { name: "Shrugs", muscleGroup: "SHOULDERS", description: "Travaille les trapèzes." },

  // Biceps
  { name: "Curl barre", muscleGroup: "BICEPS" },
  { name: "Curl haltères", muscleGroup: "BICEPS", description: "Alterné ou simultané." },
  { name: "Curl marteau", muscleGroup: "BICEPS", description: "Travaille aussi le brachial." },
  { name: "Curl pupitre", muscleGroup: "BICEPS" },
  { name: "Curl à la poulie", muscleGroup: "BICEPS" },
  { name: "Curl concentré", muscleGroup: "BICEPS" },

  // Triceps
  { name: "Dips", muscleGroup: "TRICEPS", description: "Aux barres parallèles." },
  { name: "Extensions à la poulie", muscleGroup: "TRICEPS", description: "Pushdown corde ou barre." },
  { name: "Extensions au-dessus de la tête", muscleGroup: "TRICEPS" },
  { name: "Développé couché prise serrée", muscleGroup: "TRICEPS" },
  { name: "Kickback", muscleGroup: "TRICEPS" },
  { name: "Skull crusher", muscleGroup: "TRICEPS", description: "Aussi appelé Tate press, à la barre EZ." },

  // Jambes
  { name: "Squat", muscleGroup: "LEGS", description: "Mouvement roi, dos droit, descente complète." },
  { name: "Front squat", muscleGroup: "LEGS", description: "Barre devant, plus exigeant pour les quadriceps." },
  { name: "Squat bulgare", muscleGroup: "LEGS" },
  { name: "Soulevé de terre roumain", muscleGroup: "LEGS", description: "Cible les ischio-jambiers." },
  { name: "Presse à cuisses", muscleGroup: "LEGS" },
  { name: "Fentes", muscleGroup: "LEGS", description: "Avant ou marchées." },
  { name: "Extensions de jambes", muscleGroup: "LEGS" },
  { name: "Leg curl", muscleGroup: "LEGS", description: "Allongé ou assis." },
  { name: "Mollets debout", muscleGroup: "LEGS" },
  { name: "Mollets assis", muscleGroup: "LEGS" },

  // Fessiers
  { name: "Hip thrust", muscleGroup: "GLUTES", description: "Excellent isolé pour fessiers." },
  { name: "Glute bridge", muscleGroup: "GLUTES" },
  { name: "Kickback à la poulie", muscleGroup: "GLUTES" },
  { name: "Sumo squat", muscleGroup: "GLUTES" },
  { name: "Step up", muscleGroup: "GLUTES" },

  // Abdominaux
  { name: "Crunch", muscleGroup: "ABS" },
  { name: "Planche", muscleGroup: "ABS", description: "Gainage isométrique." },
  { name: "Planche latérale", muscleGroup: "ABS" },
  { name: "Russian twist", muscleGroup: "ABS", description: "Cible les obliques." },
  { name: "Relevés de jambes suspendu", muscleGroup: "ABS" },
  { name: "Mountain climber", muscleGroup: "ABS" },
  { name: "Hollow hold", muscleGroup: "ABS" },
  { name: "Roue abdominale", muscleGroup: "ABS" },

  // Cardio
  { name: "Course à pied", muscleGroup: "CARDIO" },
  { name: "Vélo", muscleGroup: "CARDIO" },
  { name: "Rameur", muscleGroup: "CARDIO", description: "Cardio + dos + jambes." },
  { name: "Corde à sauter", muscleGroup: "CARDIO" },
  { name: "Vélo elliptique", muscleGroup: "CARDIO" },
  { name: "Tapis incliné", muscleGroup: "CARDIO" },
  { name: "Sprint", muscleGroup: "CARDIO" },

  // Corps entier
  { name: "Burpees", muscleGroup: "FULL_BODY" },
  { name: "Kettlebell swing", muscleGroup: "FULL_BODY" },
  { name: "Thrusters", muscleGroup: "FULL_BODY", description: "Front squat suivi d'un développé." },
  { name: "Clean and press", muscleGroup: "FULL_BODY" },
  { name: "Turkish get-up", muscleGroup: "FULL_BODY" },
  { name: "Farmer's walk", muscleGroup: "FULL_BODY" },
  { name: "Wall ball", muscleGroup: "FULL_BODY" },
  { name: "Snatch", muscleGroup: "FULL_BODY", description: "Mouvement haltérophilie." },
]

async function main() {
  console.log(`Seeding ${EXERCISES.length} exercices globaux...`)

  let created = 0
  let skipped = 0

  for (const ex of EXERCISES) {
    const existing = await prisma.exercise.findFirst({
      where: { name: ex.name, isGlobal: true },
    })
    if (existing) {
      skipped++
      continue
    }
    await prisma.exercise.create({
      data: {
        name: ex.name,
        muscleGroup: ex.muscleGroup,
        description: ex.description ?? null,
        isGlobal: true,
        coachId: null,
      },
    })
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
