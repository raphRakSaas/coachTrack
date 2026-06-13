"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="text-lg font-semibold text-foreground">
          Impossible de charger cette page
        </h2>
        <p className="text-sm text-muted-foreground">
          Une erreur est survenue lors du chargement des données. Réessayez ou
          revenez au tableau de bord.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button onClick={reset}>Réessayer</Button>
        <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
          Tableau de bord
        </Link>
      </div>
    </div>
  )
}
