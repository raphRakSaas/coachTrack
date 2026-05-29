"use client"

import { useAuth, useClerk } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

type LaunchStep = "preparing" | "connecting" | "error"

const STEP_LABELS: Record<Exclude<LaunchStep, "error">, string> = {
  preparing: "Préparation de l'espace démo…",
  connecting: "Connexion sécurisée…",
}

export function DemoLaunchClient() {
  const router = useRouter()
  const { isLoaded, isSignedIn, userId } = useAuth()
  const { signOut } = useClerk()
  const hasStarted = useRef(false)
  const [step, setStep] = useState<LaunchStep>("preparing")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (hasStarted.current) return
    if (!isLoaded) return

    if (isSignedIn && userId) {
      router.replace("/dashboard")
      return
    }

    hasStarted.current = true

    const launchDemo = async () => {
      try {
        setStep("preparing")

        const requestToken = async () => {
          const response = await fetch("/api/demo/start", { method: "POST" })
          const payload = (await response.json()) as {
            token?: string
            error?: string
            message?: string
          }
          return { response, payload }
        }

        let { response, payload } = await requestToken()

        if (response.status === 409 && payload.error === "signed_in") {
          await signOut()
          ;({ response, payload } = await requestToken())
        }

        if (!response.ok || !payload.token) {
          setStep("error")
          setErrorMessage(payload.message ?? payload.error ?? "La démo est indisponible.")
          return
        }

        setStep("connecting")

        const signInUrl = new URL("/sign-in", window.location.origin)
        signInUrl.searchParams.set("__clerk_ticket", payload.token)
        window.location.assign(signInUrl.toString())
      } catch (error) {
        console.error("[demo/launch]", error)
        setStep("error")
        setErrorMessage("Erreur réseau ou session expirée. Relancez la démo.")
      }
    }

    void launchDemo()
  }, [isLoaded, isSignedIn, router, signOut, userId])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-orange-50/80 to-white px-6">
      <div className="w-full max-w-sm text-center">
        <div className="relative mx-auto mb-8 h-28 w-28">
          <div className="absolute inset-0 animate-ping rounded-full bg-orange-200/40" />
          <div className="relative flex h-full w-full items-center justify-center rounded-full bg-white shadow-lg shadow-orange-200/50">
            <Image
              src="/revo-mascot-coach.png"
              alt=""
              width={88}
              height={88}
              className="revo-demo-bounce h-20 w-20 object-contain"
              priority
            />
          </div>
        </div>

        <h1 className="font-[family-name:var(--font-display)] text-xl font-bold text-slate-900">
          {step === "error" ? "Impossible de lancer la démo" : "Lancement de la démo Revo"}
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          {step === "error" ? errorMessage : STEP_LABELS[step]}
        </p>

        {step !== "error" && (
          <div className="mx-auto mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-orange-100">
            <div className="revo-demo-progress h-full w-1/2 rounded-full bg-orange-500" />
          </div>
        )}

        {step === "error" && (
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/demo/launch"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white"
            >
              Réessayer
            </Link>
            <Link href="/demo" className="text-sm font-medium text-slate-500 hover:text-orange-600">
              Retour
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
