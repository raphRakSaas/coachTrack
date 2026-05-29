const DEFAULT_DEMO_EMAIL = "demo@revo.app"

type ClerkUserListItem = {
  id: string
  email_addresses?: Array<{ email_address: string }>
}

function getClerkSecretKey(): string {
  const secretKey = process.env.CLERK_SECRET_KEY?.trim()
  if (!secretKey) {
    throw new Error("CLERK_SECRET_KEY manquant dans .env.local")
  }
  return secretKey
}

function getDemoEmail(): string {
  return process.env.DEMO_COACH_EMAIL?.trim() || DEFAULT_DEMO_EMAIL
}

async function clerkRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`https://api.clerk.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getClerkSecretKey()}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Clerk API ${path} → ${response.status}: ${body}`)
  }

  return response.json() as Promise<T>
}

async function findClerkUserByEmail(email: string): Promise<string | null> {
  const users = await clerkRequest<ClerkUserListItem[]>(
    `/users?email_address=${encodeURIComponent(email)}&limit=1`,
  )
  return users[0]?.id ?? null
}

async function createDemoClerkUser(email: string): Promise<string> {
  const usernameBase = email.split("@")[0]?.replace(/[^a-zA-Z0-9_]/g, "") || "revodemo"
  const username = `${usernameBase}-demo`.slice(0, 32)

  const user = await clerkRequest<ClerkUserListItem>("/users", {
    method: "POST",
    body: JSON.stringify({
      email_address: [email],
      username,
      skip_password_requirement: true,
      skip_password_checks: true,
    }),
  })
  return user.id
}

/**
 * Résout l'ID Clerk du coach démo :
 * 1. DEMO_COACH_CLERK_ID si déjà défini
 * 2. recherche par email (DEMO_COACH_EMAIL ou demo@revo.app)
 * 3. création automatique du compte Clerk démo
 */
export async function resolveDemoCoachClerkIdForSetup(): Promise<{
  clerkId: string
  email: string
  source: "env" | "lookup" | "created"
}> {
  const configuredClerkId = process.env.DEMO_COACH_CLERK_ID?.trim()
  if (configuredClerkId) {
    return {
      clerkId: configuredClerkId,
      email: getDemoEmail(),
      source: "env",
    }
  }

  const email = getDemoEmail()
  const existingClerkId = await findClerkUserByEmail(email)
  if (existingClerkId) {
    return { clerkId: existingClerkId, email, source: "lookup" }
  }

  const createdClerkId = await createDemoClerkUser(email)
  return { clerkId: createdClerkId, email, source: "created" }
}
