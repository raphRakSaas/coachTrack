/**
 * Carte « Douleurs » — coordonnées SVG (vue Face / Dos).
 * Style proche d’une carte anatomique : silhouettes sombres, zones délimitées,
 * surlignage lime pour les notes enregistrées.
 */
export type BodyRegionSide = "front" | "back"

export type BodyRegionDef = {
  key: string
  label: string
  side: BodyRegionSide
  d: string
}

/** Silhouette de fond (non cliquable) — corps féminin stylisé, contours doux */
export const SILHOUETTE_FRONT =
  "M 80 22 C 88 22 94 28 96 36 L 98 44 C 102 48 106 52 108 58 L 110 72 C 112 84 108 96 104 108 L 102 128 C 100 152 98 176 96 200 L 94 232 C 92 256 90 272 88 288 L 84 304 L 76 304 L 72 288 L 70 260 L 68 228 L 66 200 L 64 176 L 62 152 L 60 128 L 58 108 C 54 96 50 84 52 72 L 54 58 C 56 52 60 48 64 44 L 66 36 C 68 28 74 22 80 22 Z"

export const SILHOUETTE_BACK =
  "M 80 22 C 88 22 94 28 96 36 L 98 46 C 102 50 106 54 108 60 L 110 74 C 112 88 110 100 106 112 L 104 132 C 102 156 100 180 98 204 L 96 236 C 94 260 92 276 90 292 L 86 304 L 74 304 L 70 292 L 68 264 L 66 236 L 64 204 L 62 180 L 60 156 L 58 132 L 56 112 C 52 100 50 88 52 74 L 54 60 C 56 54 60 50 64 46 L 66 36 C 68 28 74 22 80 22 Z M 96 24 C 98 18 102 14 108 16 C 112 18 114 24 112 30 L 108 38 Z"

/** Lignes de séparation musculaire (léger relief type schéma médical) */
export const MUSCLE_GUIDES_FRONT: string[] = [
  "M 80 46 L 80 112",
  "M 58 68 L 102 68",
  "M 62 96 L 98 96",
  "M 70 140 L 90 140",
]

export const MUSCLE_GUIDES_BACK: string[] = [
  "M 80 46 L 80 118",
  "M 54 72 L 106 72",
  "M 58 100 L 102 100",
  "M 66 138 L 94 138",
]

/** Vue avant — zones interactives (Bezier pour épouser la silhouette) */
export const BODY_REGIONS_FRONT: BodyRegionDef[] = [
  {
    key: "neck_front",
    label: "Cou & partie claviculaire",
    side: "front",
    d: "M 56 34 C 62 28 72 28 80 30 C 88 28 98 28 104 34 C 106 42 104 52 100 58 C 94 62 86 60 80 58 C 74 60 66 62 60 58 C 56 52 54 42 56 34 Z",
  },
  {
    key: "chest_front",
    label: "Pectoraux",
    side: "front",
    d: "M 54 58 C 58 54 72 56 80 58 C 88 56 102 54 106 58 C 108 68 106 82 102 92 C 94 96 86 94 80 92 C 74 94 66 96 58 92 C 54 82 52 68 54 58 Z",
  },
  {
    key: "shoulder_l_front",
    label: "Épaule gauche",
    side: "front",
    d: "M 46 52 C 50 48 56 50 58 56 L 56 84 C 52 82 48 76 46 68 Z",
  },
  {
    key: "shoulder_r_front",
    label: "Épaule droite",
    side: "front",
    d: "M 102 56 C 104 50 110 48 114 52 L 114 68 C 112 76 108 82 104 84 Z",
  },
  {
    key: "abs_front",
    label: "Abdominaux",
    side: "front",
    d: "M 58 92 C 66 88 94 88 102 92 C 104 108 102 124 98 138 C 88 142 72 142 62 138 C 58 124 56 108 58 92 Z",
  },
  {
    key: "quad_l_front",
    label: "Quadriceps gauche",
    side: "front",
    d: "M 62 142 C 68 140 74 142 76 148 L 74 248 C 70 252 64 252 60 248 Z",
  },
  {
    key: "quad_r_front",
    label: "Quadriceps droit",
    side: "front",
    d: "M 84 148 C 86 142 92 140 98 142 L 100 248 C 96 252 90 252 86 248 Z",
  },
]

/** Vue arrière */
export const BODY_REGIONS_BACK: BodyRegionDef[] = [
  {
    key: "traps_back",
    label: "Trapèzes & nuque",
    side: "back",
    d: "M 52 30 C 58 24 72 26 80 28 C 88 26 102 24 108 30 C 110 40 108 50 104 56 C 94 60 86 58 80 56 C 74 58 66 60 56 56 C 52 50 50 40 52 30 Z",
  },
  {
    key: "upper_back",
    label: "Milieu du dos",
    side: "back",
    d: "M 54 56 C 62 52 98 52 106 56 C 108 72 106 88 102 100 C 94 104 86 102 80 100 C 74 102 66 104 58 100 C 54 88 52 72 54 56 Z",
  },
  {
    key: "lumbar_back",
    label: "Région lombaire",
    side: "back",
    d: "M 58 100 C 66 96 94 96 102 100 C 104 118 102 132 98 144 C 88 148 72 148 62 144 C 58 132 56 118 58 100 Z",
  },
  {
    key: "glutes_back",
    label: "Fessiers",
    side: "back",
    d: "M 58 144 C 70 140 90 140 102 144 C 104 158 102 172 98 182 C 88 188 72 188 62 182 C 58 172 56 158 58 144 Z",
  },
  {
    key: "ham_l_back",
    label: "Ischio-jambier gauche",
    side: "back",
    d: "M 60 184 C 66 182 72 184 74 190 L 72 268 C 68 272 62 272 58 268 Z",
  },
  {
    key: "ham_r_back",
    label: "Ischio-jambier droit",
    side: "back",
    d: "M 86 190 C 88 184 94 182 100 184 L 102 268 C 98 272 92 272 88 268 Z",
  },
]

export const ALL_BODY_REGIONS = [...BODY_REGIONS_FRONT, ...BODY_REGIONS_BACK]

export function getRegionLabel(regionKey: string): string {
  return ALL_BODY_REGIONS.find((region) => region.key === regionKey)?.label ?? regionKey
}
