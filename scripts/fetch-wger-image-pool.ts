import { writeFile } from "node:fs/promises"

type WgerExerciseImage = {
  id: number
  image: string
}

type WgerPaginated<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

async function fetchJson<T>(url: string): Promise<T> {
  const abortController = new AbortController()
  const timeout = setTimeout(() => abortController.abort(), 30_000)
  const response = await fetch(url, {
    headers: { "user-agent": "coachtrack-seed/1.0 (wger image pool)" },
    signal: abortController.signal,
  }).finally(() => clearTimeout(timeout))

  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`)
  return (await response.json()) as T
}

async function main() {
  const urls: string[] = []
  let nextUrl: string | null =
    "https://wger.de/api/v2/exerciseimage/?limit=50&offset=0"

  while (nextUrl) {
    const page: WgerPaginated<WgerExerciseImage> =
      await fetchJson<WgerPaginated<WgerExerciseImage>>(nextUrl)
    for (const item of page.results) {
      if (item.image && !urls.includes(item.image)) urls.push(item.image)
    }
    nextUrl = page.next
  }

  await writeFile(
    "prisma/wger-image-pool.json",
    JSON.stringify({ source: "wger exerciseimage", urls }, null, 2),
    "utf-8"
  )

  console.log(`✓ Pool écrit: prisma/wger-image-pool.json`)
  console.log(`✓ URLs: ${urls.length}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

