import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return new Response(JSON.stringify({ error: "Non authentifié." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      subscription: true,
      exercises: true,
      measurements: true,
      clients: {
        include: {
          measurements: true,
          programs: {
            include: {
              workoutDays: {
                include: {
                  exercises: { include: { exercise: true } },
                },
              },
            },
          },
          sessions: {
            include: {
              exercises: {
                include: { exercise: true, sets: true },
              },
            },
          },
        },
      },
      sessions: {
        include: {
          client: {
            select: { id: true, firstName: true, lastName: true },
          },
          exercises: {
            include: { exercise: true, sets: true },
          },
        },
      },
      programs: {
        include: {
          client: {
            select: { id: true, firstName: true, lastName: true },
          },
          workoutDays: {
            include: {
              exercises: { include: { exercise: true } },
            },
          },
        },
      },
    },
  })

  if (!user) {
    return new Response(JSON.stringify({ error: "Compte introuvable." }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    formatVersion: 1,
    user,
  }

  const body = JSON.stringify(payload, null, 2)
  const filename = `revo-export-${user.id.slice(0, 8)}.json`

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  })
}
