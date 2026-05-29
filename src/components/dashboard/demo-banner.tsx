import Link from "next/link"
import { Sparkles, X } from "lucide-react"

export function DemoBanner() {
  return (
    <div className="border-b border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-2 text-sm text-orange-950">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" aria-hidden />
          <p>
            <span className="font-semibold">Mode démo</span>
            {" — "}
            Vous explorez Revo avec des données fictives (client « Marie Démo »). Aucune donnée réelle n&apos;est utilisée.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/sign-up"
            className="inline-flex h-9 items-center rounded-lg bg-orange-600 px-4 text-xs font-semibold text-white transition hover:bg-orange-700"
          >
            Créer mon compte gratuit
          </Link>
          <Link
            href="/demo"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-orange-200 bg-white text-orange-700 transition hover:bg-orange-100"
            aria-label="Quitter la démo"
          >
            <X className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
