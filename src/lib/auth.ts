import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function getCurrentUser() {
  const { userId } = await auth()
  if (!userId) return null

  let user = await prisma.user.findUnique({ where: { clerkId: userId } })

  if (!user) {
    const clerkUser = await currentUser()
    if (!clerkUser) return null

    const email = clerkUser.emailAddresses[0]?.emailAddress ?? ""
    const name =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      null

    user = await prisma.user.upsert({
      where: { clerkId: userId },
      create: { clerkId: userId, email, name },
      update: {},
    })
  }

  return user
}
