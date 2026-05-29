import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import {
  ensureSystemDemoCoachReady,
  getDemoCoachClerkId,
  isDemoCoachClerkId,
} from "@/lib/demo-account"

export async function POST(request: Request) {
  const demoClerkId = getDemoCoachClerkId()
  if (!demoClerkId) {
    return NextResponse.json(
      {
        error:
          "La démo n'est pas configurée. Ajoutez DEMO_COACH_CLERK_ID dans les variables d'environnement Vercel.",
      },
      { status: 503 },
    )
  }

  const { userId: currentClerkId } = await auth()
  if (currentClerkId && !isDemoCoachClerkId(currentClerkId)) {
    return NextResponse.json(
      {
        error: "signed_in",
        message:
          "Vous êtes déjà connecté avec un autre compte. Déconnectez-vous pour lancer la démo.",
      },
      { status: 409 },
    )
  }

  try {
    await ensureSystemDemoCoachReady()

    const client = await clerkClient()
    const signInToken = await client.signInTokens.createSignInToken({
      userId: demoClerkId,
      expiresInSeconds: 300,
    })

    const requestUrl = new URL(request.url)
    const signInUrl = new URL("/sign-in", requestUrl.origin)
    signInUrl.searchParams.set("__clerk_ticket", signInToken.token)

    return NextResponse.json({ url: signInUrl.toString() })
  } catch (error) {
    console.error("[demo/start]", error)
    return NextResponse.json(
      { error: "Impossible de démarrer la démo pour le moment." },
      { status: 500 },
    )
  }
}
