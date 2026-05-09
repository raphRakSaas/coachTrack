import {
  ActivityLevel,
  BodyType,
  DietaryPreferences,
  FitnessLevel,
  Gender,
  GoalType,
  Prisma,
  TrackingItemType,
} from "@prisma/client"
import { prisma } from "@/lib/prisma"

/** Identité affichée pour le client fictif (données d’exemple, pas une personne réelle). */
export const DEMO_CLIENT_PROFILE = {
  firstName: "Marie",
  lastName: "Dupont",
  notes:
    "Client fictif pour explorer Revo avec des exemples complets : profil, nutrition, suivi, séances et mesures.",
} as const

/** Email et téléphone factices (aucune utilisation réelle). */
const DEMO_CONTACT = {
  email: "marie.dupont.demo@example.com",
  phone: "612345678",
  phoneCountryCode: "+33",
} as const

function daysAgo(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(12, 0, 0, 0)
  return date
}

/** ~28 séances étalées sur ~3 mois (données fictives). */
function buildDemoSessions(): {
  daysAgo: number
  duration: number
  rpe: number
  mood: number
  energy: number
  notes: string
}[] {
  const templates = [
    "Full body — accent dos et posture.",
    "Mobilité hanche + gainage.",
    "Jambes — squat et fentes guidées.",
    "Haut du corps — tirages et rowing.",
    "Cardio modéré + étirements.",
    "Hip hinge + renforcement fessiers.",
    "Volume modéré, focus technique.",
    "Circuit léger fin de semaine.",
    "Récupération active — mobilité thoracique.",
    "Split tirage / poussée.",
    "Marche inclinée + core.",
    "Conditionnement léger métabolique.",
  ]
  const offsets = [
    2, 4, 7, 9, 11, 14, 16, 18, 21, 23, 25, 28, 31, 34, 37, 40, 43, 46, 49,
    52, 56, 60, 65, 70, 76, 82, 88, 95,
  ]
  return offsets.map((daysAgo, index) => ({
    daysAgo,
    duration: 40 + (index % 6) * 3,
    rpe: 5 + (index % 5),
    mood: 3 + (index % 3),
    energy: 3 + (index % 3),
    notes: templates[index % templates.length]!,
  }))
}

/** Jour civil stable pour `@db.Date` (midi UTC). */
function calendarDateDaysAgo(days: number): Date {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() - days)
  date.setUTCHours(12, 0, 0, 0)
  return date
}

function demoNutritionDayLogs(
  clientId: string,
  coachId: string
): Prisma.NutritionDayLogCreateManyInput[] {
  const rows: Prisma.NutritionDayLogCreateManyInput[] = []
  for (let index = 0; index < 21; index++) {
    const breakfast = 380 + (index * 17) % 140
    const lunch = 620 + (index * 23) % 220
    const dinner = 520 + (index * 31) % 180
    const snack = 90 + (index * 11) % 80
    const caloriesConsumed = breakfast + lunch + dinner + snack
    const proteinG = 62 + (index % 18)
    const carbsG = 130 + (index % 40)
    const fatG = 52 + (index % 15)
    const waterL = 1.6 + (index % 10) * 0.09
    rows.push({
      clientId,
      coachId,
      date: calendarDateDaysAgo(index),
      caloriesConsumed,
      proteinG,
      carbsG,
      fatG,
      waterL,
      breakfastKcal: breakfast,
      lunchKcal: lunch,
      dinnerKcal: dinner,
      snackKcal: snack,
    })
  }
  return rows
}

function demoMeasurements(clientId: string, coachId: string): Prisma.BodyMeasurementCreateManyInput[] {
  const weights: { days: number; weight: number; bodyFat?: number; waist?: number }[] = [
    { days: 84, weight: 68.5, bodyFat: 28, waist: 82 },
    { days: 77, weight: 68.2, bodyFat: 27.8, waist: 81.5 },
    { days: 70, weight: 67.8, bodyFat: 27.5, waist: 81 },
    { days: 63, weight: 67.4, bodyFat: 27.2, waist: 80.5 },
    { days: 56, weight: 67.0, bodyFat: 27, waist: 80 },
    { days: 49, weight: 66.6, bodyFat: 26.7, waist: 79.5 },
    { days: 42, weight: 66.2, bodyFat: 26.4, waist: 79 },
    { days: 35, weight: 65.8, bodyFat: 26.1, waist: 78.5 },
    { days: 28, weight: 65.4, bodyFat: 25.8, waist: 78 },
    { days: 21, weight: 65.1, bodyFat: 25.5, waist: 77.5 },
    { days: 14, weight: 64.8, bodyFat: 25.2, waist: 77 },
    { days: 7, weight: 65.0, bodyFat: 25.0, waist: 76.8 },
    { days: 4, weight: 65.0, bodyFat: 24.9, waist: 76.5 },
  ]
  return weights.map((row) => ({
    clientId,
    coachId,
    date: daysAgo(row.days),
    weight: row.weight,
    bodyFat: row.bodyFat,
    waist: row.waist,
    muscleMass: null,
    hips: 98,
    chest: 88,
    notes: null,
  }))
}

function fullDemoClientUncheckedData(
  coachId: string
): Prisma.ClientUncheckedCreateInput {
  const birth = new Date()
  birth.setFullYear(birth.getFullYear() - 30)

  const coachingStart = daysAgo(56)
  const goalDeadline = daysAgo(-120)

  return {
    coachId,
    isDemo: true,
    isProspect: false,
    firstName: DEMO_CLIENT_PROFILE.firstName,
    lastName: DEMO_CLIENT_PROFILE.lastName,
    email: DEMO_CONTACT.email,
    phone: DEMO_CONTACT.phone,
    phoneCountryCode: DEMO_CONTACT.phoneCountryCode,
    gender: Gender.FEMALE,
    birthDate: birth,
    height: 165,
    fitnessLevel: FitnessLevel.BEGINNER,
    weeklyFrequency: 3,
    activityLevel: ActivityLevel.MODERATE,
    bodyType: BodyType.MESOMORPH,
    dietaryPreferences: DietaryPreferences.STANDARD,
    hasTCA: false,
    goalType: GoalType.WEIGHT_LOSS,
    goal:
      "Perte de poids progressive, meilleure énergie au quotidien et assiduité aux séances (données de démonstration).",
    goalTargetWeight: 63,
    goalDeadline,
    coachingStartDate: coachingStart,
    weightStart: 68,
    goalWeeklyLoss: 1,
    dailyCaloriesGoal: 2000,
    dailyWaterGoal: 2.5,
    mealBreakfastPct: 25,
    mealLunchPct: 40,
    mealDinnerPct: 30,
    mealSnackPct: 5,
    macrosCarbsPct: 50,
    macrosProteinsPct: 20,
    macrosFatsPct: 30,
    injuries:
      "Historique de tension lombaire légère : privilégier le contrôle du gainage et la mobilité (fictif, démo).",
    medicalNotes:
      "Aucun traitement en cours signalé pour la démo. Données sensibles : exemple uniquement.",
    sensitiveDataConsentAt: null,
    company: "Agence événementielle (fictif)",
    address: "12 rue de la République",
    postalCode: "75011",
    city: "Paris",
    country: "France",
    linkedin: "https://www.linkedin.com/in/example-demo-marie-dupont",
    instagram: "",
    facebook: "",
    twitter: "",
    language: "fr",
    timezone: "Europe/Paris",
    contractStart: coachingStart,
    hourlyRate: 55,
    notes: DEMO_CLIENT_PROFILE.notes,
    isActive: true,
  }
}

function fullDemoClientUpdateData(): Prisma.ClientUpdateInput {
  const birth = new Date()
  birth.setFullYear(birth.getFullYear() - 30)
  const coachingStart = daysAgo(56)
  const goalDeadline = daysAgo(-120)

  return {
    firstName: DEMO_CLIENT_PROFILE.firstName,
    lastName: DEMO_CLIENT_PROFILE.lastName,
    email: DEMO_CONTACT.email,
    phone: DEMO_CONTACT.phone,
    phoneCountryCode: DEMO_CONTACT.phoneCountryCode,
    gender: Gender.FEMALE,
    birthDate: birth,
    height: 165,
    fitnessLevel: FitnessLevel.BEGINNER,
    weeklyFrequency: 3,
    activityLevel: ActivityLevel.MODERATE,
    bodyType: BodyType.MESOMORPH,
    dietaryPreferences: DietaryPreferences.STANDARD,
    hasTCA: false,
    goalType: GoalType.WEIGHT_LOSS,
    goal:
      "Perte de poids progressive, meilleure énergie au quotidien et assiduité aux séances (données de démonstration).",
    goalTargetWeight: 63,
    goalDeadline,
    coachingStartDate: coachingStart,
    weightStart: 68,
    goalWeeklyLoss: 1,
    dailyCaloriesGoal: 2000,
    dailyWaterGoal: 2.5,
    mealBreakfastPct: 25,
    mealLunchPct: 40,
    mealDinnerPct: 30,
    mealSnackPct: 5,
    macrosCarbsPct: 50,
    macrosProteinsPct: 20,
    macrosFatsPct: 30,
    injuries:
      "Historique de tension lombaire légère : privilégier le contrôle du gainage et la mobilité (fictif, démo).",
    medicalNotes:
      "Aucun traitement en cours signalé pour la démo. Données sensibles : exemple uniquement.",
    company: "Agence événementielle (fictif)",
    address: "12 rue de la République",
    postalCode: "75011",
    city: "Paris",
    country: "France",
    linkedin: "https://www.linkedin.com/in/example-demo-marie-dupont",
    instagram: "",
    facebook: "",
    twitter: "",
    language: "fr",
    timezone: "Europe/Paris",
    contractStart: coachingStart,
    hourlyRate: 55,
    notes: DEMO_CLIENT_PROFILE.notes,
    isActive: true,
  }
}

async function replaceDemoRelatedData(
  tx: Prisma.TransactionClient,
  clientId: string,
  coachId: string
) {
  await tx.session.deleteMany({ where: { clientId } })
  await tx.bodyMeasurement.deleteMany({ where: { clientId } })
  await tx.clientNote.deleteMany({ where: { clientId } })
  await tx.trackingItem.deleteMany({ where: { clientId } })
  await tx.clientPainNote.deleteMany({ where: { clientId } })
  await tx.nutritionDayLog.deleteMany({ where: { clientId } })

  await tx.bodyMeasurement.createMany({
    data: demoMeasurements(clientId, coachId),
  })

  const sessionRows = buildDemoSessions().map((session) => ({
    coachId,
    clientId,
    date: daysAgo(session.daysAgo),
    duration: session.duration,
    notes: session.notes,
    rpe: session.rpe,
    mood: session.mood,
    energy: session.energy,
  }))
  await tx.session.createMany({ data: sessionRows })

  await tx.nutritionDayLog.createMany({
    data: demoNutritionDayLogs(clientId, coachId),
  })

  const notes: Prisma.ClientNoteCreateManyInput[] = [
    {
      clientId,
      coachId,
      content:
        "Avant prochaine séance :\n• Vérifier la zone lombaire après les fentes.\n• Tirages verticaux : +5 kg sur la dernière série (bravo).\n• Ajouter 8 min de mobilité thoracique en échauffement.\n• Prévoir un mini-deload la semaine des vacances.",
    },
    {
      clientId,
      coachId,
      content:
        "Bilan S2 :\n• Présence : 5/6 séances.\n• Ressenti : douleur légère lombaire sur fentes.\n• Nutrition : ~80% du plan, envies de chocolat en fin de journée.\n• Poids : -0,8 kg.\n→ Focus S3 : pas plus de 2 séances jambes consécutives, hydratation ciblée.",
    },
    {
      clientId,
      coachId,
      content:
        "Appel découverte :\n• 30 ans, chargée de projet événementiel.\n• Emploi du temps dense : séances plutôt le midi ou le soir.\n• Objectif principal : perdre du gras sans sensation de sacrifice extrême.",
    },
  ]
  await tx.clientNote.createMany({ data: notes })

  const tracking: Prisma.TrackingItemCreateManyInput[] = [
    {
      clientId,
      coachId,
      type: TrackingItemType.BILAN,
      name: "Bilan de forme",
      description: "Questionnaire court : énergie, sommeil, douleurs (démo).",
      frequency: "once",
      isActive: true,
      lastAnsweredAt: daysAgo(28),
    },
    {
      clientId,
      coachId,
      type: TrackingItemType.QUESTIONNAIRE,
      name: "Questionnaire d’onboarding",
      description: "Préférences, contraintes horaires, matériel disponible.",
      frequency: "once",
      isActive: true,
      lastAnsweredAt: daysAgo(42),
    },
    {
      clientId,
      coachId,
      type: TrackingItemType.HABITUDE,
      name: "Boire 2 L d’eau",
      frequency: "daily",
      isActive: true,
      lastAnsweredAt: daysAgo(1),
    },
    {
      clientId,
      coachId,
      type: TrackingItemType.HABITUDE,
      name: "Marcher 8 000 pas",
      frequency: "daily",
      isActive: true,
      lastAnsweredAt: daysAgo(1),
    },
    {
      clientId,
      coachId,
      type: TrackingItemType.HABITUDE,
      name: "10 min de mobilité",
      frequency: "daily",
      isActive: true,
      lastAnsweredAt: daysAgo(2),
    },
    {
      clientId,
      coachId,
      type: TrackingItemType.MESURE,
      name: "Tour de taille hebdomadaire",
      description: "Même jour, même horaire, debout.",
      frequency: "weekly",
      isActive: true,
      lastAnsweredAt: daysAgo(5),
    },
    {
      clientId,
      coachId,
      type: TrackingItemType.BILAN,
      name: "Bilan nutrition — semaine type",
      description: "Photo des repas + sensation de satiété.",
      frequency: "weekly",
      isActive: true,
      lastAnsweredAt: daysAgo(10),
    },
    {
      clientId,
      coachId,
      type: TrackingItemType.QUESTIONNAIRE,
      name: "Qualité du sommeil (PSQI simplifié)",
      frequency: "monthly",
      isActive: true,
      lastAnsweredAt: daysAgo(20),
    },
    {
      clientId,
      coachId,
      type: TrackingItemType.HABITUDE,
      name: "30 g de protéines au petit-déjeuner",
      frequency: "daily",
      isActive: true,
      lastAnsweredAt: daysAgo(1),
    },
    {
      clientId,
      coachId,
      type: TrackingItemType.HABITUDE,
      name: "2 portions de légumes au déjeuner",
      frequency: "daily",
      isActive: true,
      lastAnsweredAt: daysAgo(1),
    },
    {
      clientId,
      coachId,
      type: TrackingItemType.HABITUDE,
      name: "Limite écrans après 21 h",
      frequency: "daily",
      isActive: true,
      lastAnsweredAt: daysAgo(3),
    },
    {
      clientId,
      coachId,
      type: TrackingItemType.MESURE,
      name: "Photos progression (mensuel)",
      description: "Face / profil / dos.",
      frequency: "monthly",
      isActive: true,
      lastAnsweredAt: daysAgo(30),
    },
  ]
  await tx.trackingItem.createMany({ data: tracking })
}

/**
 * Données démo complètes : profil, mesures, séances, notes, suivis.
 * Idempotent : remplace les sous-ressources du client démo par le jeu canonique.
 */
export async function syncDemoClientFullSeed(clientId: string, coachId: string) {
  await prisma.$transaction(async (tx) => {
    await tx.client.update({
      where: { id: clientId },
      data: fullDemoClientUpdateData(),
    })
    await replaceDemoRelatedData(tx, clientId, coachId)
  })
}

/**
 * Crée le client démo pour un coach s’il n’existe pas, puis synchronise le jeu de données complet.
 */
export async function ensureDemoClientForCoach(coachId: string): Promise<void> {
  const existing = await prisma.client.findFirst({
    where: { coachId, isDemo: true },
    select: { id: true },
  })

  if (!existing) {
    const created = await prisma.client.create({
      data: fullDemoClientUncheckedData(coachId),
      select: { id: true },
    })
    await syncDemoClientFullSeed(created.id, coachId)
    return
  }

  await syncDemoClientFullSeed(existing.id, coachId)
}

/** Rattrapage : tous les coaches reçoivent / mettent à jour le client démo complet. */
export async function ensureDemoClientsForAllCoaches(): Promise<{
  coaches: number
  created: number
  synced: number
}> {
  const coaches = await prisma.user.findMany({ select: { id: true } })
  let created = 0
  let synced = 0
  for (const { id } of coaches) {
    const hadDemo = await prisma.client.findFirst({
      where: { coachId: id, isDemo: true },
      select: { id: true },
    })
    await ensureDemoClientForCoach(id)
    if (!hadDemo) created++
    else synced++
  }
  return { coaches: coaches.length, created, synced }
}
