import { auth } from "@clerk/nextjs/server"

import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  const { userId } = await auth()
  const appUser = await getCurrentUser()

  return Response.json({
    clerkUserId: userId ?? null,
    appUserId: appUser?.id ?? null,
    appClerkId: appUser?.clerkId ?? null,
    appEmail: appUser?.email ?? null,
  })
}

