"use client"

import { useMemo, useState, useTransition } from "react"
import {
  Zap,
  EyeOff,
  LayoutGrid,
  List,
  MoreVertical,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import {
  BODY_REGIONS_BACK,
  BODY_REGIONS_FRONT,
  getRegionLabel,
  MUSCLE_GUIDES_BACK,
  MUSCLE_GUIDES_FRONT,
  SILHOUETTE_BACK,
  SILHOUETTE_FRONT,
  type BodyRegionDef,
} from "@/lib/body-pain-regions"
import { upsertClientPainNote } from "@/app/dashboard/clients/[id]/actions"

/** Zones illustrées en vert pour le client démo (aucune persistance). */
export const DEMO_BODY_PAIN_PREVIEW: Record<string, string> = {
  neck_front:
    "Tension matinale au réveil — exemple visuel pour la démo (non enregistré).",
  traps_back:
    "Charge de bureau, épaules voûtées — exemple visuel (non enregistré).",
  lumbar_back:
    "Raideur en fin de journée assise — exemple visuel (non enregistré).",
}

type PainNoteRow = { regionKey: string; note: string }

type Props = {
  clientId: string
  isDemo: boolean
  painNotes: PainNoteRow[]
}

const LIME_ACTIVE = "fill-[#d4e157]/70 dark:fill-[#d4e157]/55"
const LIME_HOVER =
  "fill-[#d4e157]/85 dark:fill-[#d4e157]/70 stroke-[#9faa3c]/80"

export function BodyPainMap({ clientId, isDemo, painNotes }: Props) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [draftNote, setDraftNote] = useState("")
  const [layoutGrid, setLayoutGrid] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const dbMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const row of painNotes) {
      map.set(row.regionKey, row.note)
    }
    return map
  }, [painNotes])

  const previewMap = useMemo(() => {
    const map = new Map<string, string>()
    if (isDemo) {
      for (const [key, text] of Object.entries(DEMO_BODY_PAIN_PREVIEW)) {
        map.set(key, text)
      }
    }
    return map
  }, [isDemo])

  function hasStoredOrDemoNote(regionKey: string): boolean {
    if (dbMap.has(regionKey)) return true
    if (isDemo && previewMap.has(regionKey)) return true
    return false
  }

  function noteForRegion(regionKey: string): string {
    return (
      dbMap.get(regionKey) ??
      (isDemo ? previewMap.get(regionKey) ?? "" : "")
    )
  }

  const notesCount = useMemo(() => {
    if (isDemo) return Object.keys(DEMO_BODY_PAIN_PREVIEW).length
    return painNotes.filter((row) => row.note.trim().length > 0).length
  }, [isDemo, painNotes])

  function openRegion(regionKey: string) {
    setSelectedKey(regionKey)
    setDraftNote(noteForRegion(regionKey))
    setErrorMessage(null)
    setSheetOpen(true)
  }

  function handleSave() {
    if (!selectedKey || isDemo) return
    setErrorMessage(null)
    startTransition(async () => {
      try {
        await upsertClientPainNote(clientId, selectedKey, draftNote)
        setSheetOpen(false)
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Enregistrement impossible."
        )
      }
    })
  }

  function renderFigure(
    regions: BodyRegionDef[],
    title: string,
    silhouettePath: string,
    guides: string[]
  ) {
    return (
      <div className="flex w-full max-w-[200px] flex-col items-center gap-3 sm:max-w-none">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-100">
          {title}
        </p>
        <div
          className={cn(
            "relative w-full rounded-xl border border-zinc-700/70 bg-[#121212] p-4 shadow-inner",
            "ring-1 ring-white/5"
          )}
        >
          <svg
            viewBox="0 0 160 320"
            className={cn(
              "mx-auto h-[min(52vh,340px)] w-auto max-w-full touch-none drop-shadow-sm",
              layoutGrid ? "" : "scale-95"
            )}
            role="img"
            aria-label={`Schéma corporel ${title}`}
          >
            <title>{title}</title>
            {/* Silhouette */}
            <path
              d={silhouettePath}
              className="pointer-events-none fill-zinc-800/95 stroke-zinc-600/55"
              strokeWidth={0.65}
              vectorEffect="non-scaling-stroke"
            />
            {/* Guides musculaires */}
            {guides.map((guideD, index) => (
              <path
                key={`guide-${title}-${index}`}
                d={guideD}
                className="pointer-events-none fill-none stroke-zinc-500/35"
                strokeWidth={0.45}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {/* Zones interactives */}
            {regions.map((region) => {
              const hasNote = hasStoredOrDemoNote(region.key)
              const isHovered = hoveredKey === region.key
              return (
                <path
                  key={region.key}
                  d={region.d}
                  className={cn(
                    "cursor-pointer stroke-zinc-500/40 stroke-[0.35] transition-colors duration-150",
                    hasNote ? LIME_ACTIVE : "fill-zinc-700/55",
                    isHovered && LIME_HOVER
                  )}
                  vectorEffect="non-scaling-stroke"
                  onMouseEnter={() => setHoveredKey(region.key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  onClick={() => openRegion(region.key)}
                >
                  <title>{region.label}</title>
                </path>
              )
            })}
          </svg>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-zinc-950 to-zinc-900 shadow-lg ring-1 ring-white/5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/90 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <Zap className="h-4 w-4 text-zinc-100" />
            <p className="text-sm font-semibold tracking-tight text-zinc-50">
              Douleurs
            </p>
            <Badge
              variant="secondary"
              className="gap-1 border border-zinc-700 bg-zinc-900/90 text-[10px] font-medium text-zinc-400"
            >
              <EyeOff className="h-3 w-3" />
              Non partagé
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
              aria-label="Vue liste"
              onClick={() => setLayoutGrid(false)}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
              aria-label="Vue grille"
              onClick={() => setLayoutGrid(true)}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <span className="px-1 text-[11px] text-zinc-500">
              {notesCount} note{notesCount !== 1 ? "s" : ""}
            </span>
            <button
              type="button"
              className="rounded-md p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
              aria-label="Plus d’options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4 px-4 py-4">
          <p className="text-xs leading-relaxed text-zinc-400">
            Annotez les zones corporelles pour suivre les douleurs, tensions ou
            observations spécifiques de vos clients.
          </p>

          <div
            className={cn(
              "flex flex-col items-stretch gap-8 md:flex-row md:items-start md:justify-center",
              layoutGrid ? "md:gap-12" : "md:flex-col md:gap-10"
            )}
          >
            {renderFigure(
              BODY_REGIONS_FRONT,
              "Face",
              SILHOUETTE_FRONT,
              MUSCLE_GUIDES_FRONT
            )}
            {renderFigure(
              BODY_REGIONS_BACK,
              "Dos",
              SILHOUETTE_BACK,
              MUSCLE_GUIDES_BACK
            )}
          </div>

          <p className="text-center text-[11px] italic text-zinc-500">
            Survolez une zone pour voir son nom · Cliquez pour ajouter ou
            modifier une note
          </p>

          {isDemo && (
            <p className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-950 dark:text-amber-100">
              Client démo : illustration interactive ; les notes ne sont pas
              enregistrées en base.
            </p>
          )}
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {selectedKey ? getRegionLabel(selectedKey) : "Zone"}
            </SheetTitle>
            <SheetDescription>
              Décrivez la douleur, la tension ou l’observation pour cette zone.
              Données potentiellement sensibles — respectez le RGPD et votre
              politique de confidentialité.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-3 px-4">
            <div className="grid gap-2">
              <Label htmlFor="pain-note">Note</Label>
              <Textarea
                id="pain-note"
                value={draftNote}
                onChange={(event) => setDraftNote(event.target.value)}
                rows={6}
                disabled={isDemo || isPending}
                placeholder="Ex. raideur au réveil, IR insuffisant après séance jambes…"
                className="resize-none"
              />
            </div>
            {errorMessage && (
              <p className="text-xs font-medium text-destructive">{errorMessage}</p>
            )}
          </div>
          <SheetFooter className="flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSheetOpen(false)}
            >
              Fermer
            </Button>
            {!isDemo && (
              <Button type="button" disabled={isPending} onClick={handleSave}>
                {isPending ? "Enregistrement…" : "Enregistrer"}
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
