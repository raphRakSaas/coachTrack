import { auth, clerkClient } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

/** Suppression définitive du compte applicatif et du compte Clerk (RGPD droit à l’effacement). */
export async function DELETE(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new Response(JSON.stringify({ error: "Non authentifié." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  let confirmToken: string | undefined
  try {
    const json = (await request.json()) as { confirm?: string }
    confirmToken = json.confirm
  } catch {
    return new Response(
      JSON.stringify({ error: "Corps de requête JSON attendu." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  if (confirmToken !== "SUPPRIMER_MON_COMPTE_REVO") {
    return new Response(
      JSON.stringify({
        error:
          "Confirmation incorrecte. Envoyez exactement le jeton indiqué dans l’interface.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  const appUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  })

  try {
    if (appUser) {
      await prisma.user.delete({ where: { id: appUser.id } })
    }
    const clerk = await clerkClient()
    await clerk.users.deleteUser(userId)
  } catch (cause) {
    console.error("[account/delete]", cause)
    return new Response(
      JSON.stringify({
        error:
          "La suppression n’a pas pu être menée à bien. Contactez le support si le problème persiste.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }

  return new Response(null, { status: 204 })
}
