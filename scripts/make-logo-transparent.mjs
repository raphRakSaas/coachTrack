import sharp from "sharp"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

// Génère `public/revoLogo-mark.png` : le logo source `revoLogo.png` est déjà
// transparent mais entouré d'un large halo lumineux qui rend le « R » petit et
// peu lisible. On recadre donc sur la boîte englobante des pixels réellement
// lumineux (le corps du logo) avec une légère marge, pour obtenir un
// pictogramme dense et net, utilisable sur fond clair comme sombre.
const scriptDir = dirname(fileURLToPath(import.meta.url))
const publicDir = join(scriptDir, "..", "public")
const sourcePath = join(publicDir, "revoLogo.png")
const markPath = join(publicDir, "revoLogo-mark.png")

const { data, info } = await sharp(sourcePath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const brightThreshold = 170
let minX = info.width
let minY = info.height
let maxX = 0
let maxY = 0

for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const offset = (y * info.width + x) * info.channels
    const luminance = Math.max(data[offset], data[offset + 1], data[offset + 2])
    if (luminance >= brightThreshold) {
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
}

const paddingRatio = 0.12
const boxWidth = maxX - minX
const boxHeight = maxY - minY
const padX = Math.round(boxWidth * paddingRatio)
const padY = Math.round(boxHeight * paddingRatio)

const cropLeft = Math.max(0, minX - padX)
const cropTop = Math.max(0, minY - padY)
const cropWidth = Math.min(info.width - cropLeft, boxWidth + padX * 2)
const cropHeight = Math.min(info.height - cropTop, boxHeight + padY * 2)

await sharp(sourcePath)
  .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
  .png()
  .toFile(markPath)

const markMeta = await sharp(markPath).metadata()
console.log(`OK -> ${markPath} (${markMeta.width}x${markMeta.height})`)
