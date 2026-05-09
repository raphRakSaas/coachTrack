"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const STORAGE_KEY = "revo_cookie_consent_v1"

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  function persistChoice(value: string) {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* navigateur bloque le stockage */
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] border-t px-4 py-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:px-8"
      style={{
        background: "var(--m-bg-card, var(--background))",
        borderColor: "var(--m-border, var(--border))",
        color: "var(--m-text, var(--foreground))",
      }}
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm md:max-w-3xl">
          <p id="cookie-banner-title" className="font-semibold">
            Cookies et données locales
          </p>
          <p
            id="cookie-banner-desc"
            className="mt-1 leading-relaxed opacity-90"
            style={{ color: "var(--m-text-muted)" }}
          >
            Nous utilisons des cookies strictement nécessaires à la sécurité et
            à la connexion (dont authentification Clerk). Aucun cookie
            publicitaire n&apos;est activé par défaut sur cette version du site.
            Pour en savoir plus :{" "}
            <Link
              href="/confidentialite#cookies"
              className="font-medium text-violet-600 underline underline-offset-2"
            >
              politique de confidentialité
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-wrap gap-2 md:justify-end">
          <button
            type="button"
            className="rounded-lg border px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              borderColor: "var(--m-border)",
              color: "var(--m-text-muted)",
            }}
            onClick={() => persistChoice("essential")}
          >
            Nécessaires uniquement
          </button>
          <button
            type="button"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              background:
                "linear-gradient(135deg, var(--m-accent, #8b5cf6), var(--m-accent, #8b5cf6))",
            }}
            onClick={() => persistChoice("all")}
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  )
}
