"use client"

import { useState } from "react"
import { useClerk } from "@clerk/nextjs"
import { Download, Trash2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const DELETE_CONFIRMATION = "SUPPRIMER_MON_COMPTE_REVO"

export function PrivacyDataCard() {
  const { signOut } = useClerk()
  const [exportLoading, setExportLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deletePhrase, setDeletePhrase] = useState("")

  async function handleExport() {
    setExportLoading(true)
    setExportError(null)
    try {
      const response = await fetch("/api/me/data-export", {
        method: "GET",
        credentials: "same-origin",
      })
      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(
          typeof err.error === "string" ? err.error : "Export impossible."
        )
      }
      const blob = await response.blob()
      const disposition = response.headers.get("Content-Disposition")
      const match = disposition?.match(/filename="([^"]+)"/)
      const filename = match?.[1] ?? "revo-export.json"
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = filename
      anchor.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setExportError(
        err instanceof Error ? err.message : "L'export a échoué."
      )
    } finally {
      setExportLoading(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleteError(null)
    if (deletePhrase !== DELETE_CONFIRMATION) {
      setDeleteError(
        `Recopiez exactement : ${DELETE_CONFIRMATION}`
      )
      return
    }
    setDeleteLoading(true)
    try {
      const response = await fetch("/api/me/account", {
        method: "DELETE",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: deletePhrase }),
      })
      if (!response.ok && response.status !== 204) {
        const err = await response.json().catch(() => ({}))
        throw new Error(
          typeof err.error === "string"
            ? err.error
            : "Suppression impossible pour le moment."
        )
      }
      await signOut({ redirectUrl: "/" })
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "La suppression a échoué."
      )
      setDeleteLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-1 text-base font-semibold text-foreground">
        Données personnelles (RGPD)
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Exercice des droits d&apos;accès (export) et d&apos;effacement (suppression
        du compte). Les données de vos clients sont effacées en cascade avec
        votre compte coach ; pour les personnes concernées qui vous contactent
        directement, répondez dans le cadre de votre propre responsabilité de
        traitement.
      </p>

      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-border bg-muted p-4">
          <p className="text-sm font-medium text-foreground">
            Exporter mes données
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Fichier JSON structuré (compte, clients, séances, programmes, etc.).
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 gap-2"
            disabled={exportLoading}
            onClick={() => void handleExport()}
          >
            {exportLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Télécharger l&apos;export
          </Button>
        </div>

        <div className="rounded-lg border border-destructive/35 bg-destructive/10 p-4 dark:bg-destructive/15">
          <p className="text-sm font-medium text-destructive">
            Supprimer définitivement mon compte
          </p>
          <p className="mt-1 text-xs text-destructive/90">
            Cette action supprime toutes vos données dans Revo et ferme votre
            compte Clerk. Elle est irréversible.
          </p>
          <div className="mt-3 space-y-2">
            <Label
              htmlFor="delete-confirm"
              className="text-xs font-normal text-destructive"
            >
              Saisissez : {DELETE_CONFIRMATION}
            </Label>
            <Input
              id="delete-confirm"
              value={deletePhrase}
              onChange={(e) => setDeletePhrase(e.target.value)}
              className="border-destructive/30 bg-card text-sm text-foreground"
              autoComplete="off"
              disabled={deleteLoading}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="mt-3 gap-2"
            disabled={deleteLoading}
            onClick={() => void handleDeleteAccount()}
          >
            {deleteLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Supprimer mon compte
          </Button>
        </div>
      </div>

      {exportError ? (
        <p className="mt-4 text-xs font-medium text-red-600">{exportError}</p>
      ) : null}
      {deleteError ? (
        <p className="mt-4 text-xs font-medium text-red-600">{deleteError}</p>
      ) : null}
    </div>
  )
}
