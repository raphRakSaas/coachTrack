import crypto from "node:crypto"

import { getCurrentUser } from "@/lib/auth"

function sha1Hex(input: string) {
  return crypto.createHash("sha1").update(input).digest("hex")
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) {
    return new Response("Missing Cloudinary env vars", { status: 500 })
  }

  // Never trust client-provided folder/publicId: enforce tenant isolation.
  const folder = `coachtrack/exercises/${user.id}`
  const publicId = crypto.randomUUID()

  // Cloudinary signed upload signature is a SHA-1 of the sorted parameters + api_secret.
  // We only sign the parameters we actually send.
  const timestamp = Math.floor(Date.now() / 1000)
  const toSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
  const signature = sha1Hex(toSign)

  return Response.json({
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder,
    publicId,
  })
}

