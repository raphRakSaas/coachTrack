"use client"

import { useClerk } from "@clerk/nextjs"
import { ArrowRight, Loader2, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

type DemoStartButtonProps = {
  className?: string
  size?: "default" | "large"
}

export function DemoStartButton({ className, size = "default" }: DemoStartButtonProps) {
  const router = useRouter()
  const { signOut } = useClerk()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleStartDemo = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const startDemo = async () => {
        const response = await fetch("/api/demo/start", { method: "POST" })
        const payload = (await response.json()) as {
          url?: string
          error?: string
          message?: string
        }
        return { response, payload }
      }

      let { response, payload } = await startDemo()

      if (response.status === 409 && payload.error === "signed_in") {
        await signOut()
        ;({ response, payload } = await startDemo())
      }

      if (!response.ok || !payload.url) {
        setErrorMessage(payload.message ?? payload.error ?? "La démo est indisponible.")
        setIsLoading(false)
        return
      }

      router.push(payload.url)
    } catch {
      setErrorMessage("Erreur réseau. Réessayez dans un instant.")
      setIsLoading(false)
    }
  }

  const isLarge = size === "large"

  return (
    <div className={cn("flex flex-col items-stretch gap-2", className)}>
      <button
        type="button"
        onClick={handleStartDemo}
        disabled={isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70",
          isLarge ? "h-14 px-8 text-base sm:text-lg" : "h-12 px-7 text-sm",
        )}
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          boxShadow: "0 8px 28px rgba(15,23,42,0.22)",
        }}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            Ouverture de la démo…
          </>
        ) : (
          <>
            <Play className="h-5 w-5 fill-current" aria-hidden />
            {isLarge ? "Lancer la démo interactive" : "Voir la démo"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </>
        )}
      </button>

      {errorMessage && (
        <p className="text-center text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
