"use client"

import Link from "next/link"
import {
  Trash2,
  Flame,
  Plus,
  Pencil,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Dumbbell,
  Scale,
  StickyNote,
  CalendarDays,
  ClipboardList,
  TrendingDown,
  TrendingUp,
  Minus,
  Activity,
  Folder,
  FolderPlus,
  Share2,
} from "lucide-react"
import { useTransition, useState, useRef, useMemo } from "react"
import type { Prisma } from "@prisma/client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ClientAvatar } from "@/components/ui/client-avatar"
import { Badge } from "@/components/ui/badge"
import { MeasurementSheet } from "./measurement-sheet"
import { EditClientSheet } from "./edit-client-sheet"
import { WeightChart } from "@/components/charts/weight-chart"
import { BodyPainMap } from "@/components/dashboard/clients/body-pain-map"
import {
  deleteMeasurement,
  createClientNote,
  updateClientNote,
  deleteClientNote,
  createTrackingItem,
  deleteTrackingItem,
  toggleActiveClient,
} from "@/app/dashboard/clients/[id]/actions"
import { SECTION_ACCENTS } from "@/lib/colors"
import {
  FITNESS_LEVEL_LABELS,
  GOAL_TYPE_LABELS,
  GENDER_LABELS,
} from "@/lib/constants"

// ─── Types ───────────────────────────────────────────────────────────────────

type ClientWithRelations = Prisma.ClientGetPayload<{
  include: {
    measurements: true
    sessions: { include: { _count: { select: { exercises: true } } } }
    programs: { include: { _count: { select: { workoutDays: true } } } }
    clientNotes: true
    trackingItems: true
    painNotes: { select: { regionKey: true, note: true } }
    nutritionDayLogs: true
  }
}>

// ─── Constants ───────────────────────────────────────────────────────────────

const ACTIVITY_LEVEL_LABELS: Record<string, string> = {
  SEDENTARY: "Sédentaire",
  LIGHT: "Légère",
  MODERATE: "Modérée",
  ACTIVE: "Active",
  VERY_ACTIVE: "Très active",
}

const BODY_TYPE_LABELS: Record<string, string> = {
  ECTOMORPH: "Ectomorphe",
  MESOMORPH: "Mésomorphe",
  ENDOMORPH: "Endomorphe",
}

const DIETARY_LABELS: Record<string, string> = {
  STANDARD: "Standard",
  VEGETARIAN: "Végétarien",
  VEGAN: "Végétalien",
  GLUTEN_FREE: "Sans gluten",
  LACTOSE_FREE: "Sans lactose",
}

const TRACKING_TYPE_LABELS: Record<string, string> = {
  BILAN: "Bilan",
  HABITUDE: "Habitude",
  QUESTIONNAIRE: "Questionnaire",
  MESURE: "Mesure",
}

const TRACKING_TYPE_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  BILAN: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  HABITUDE: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  QUESTIONNAIRE: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  MESURE: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function InfoField({
  label,
  value,
}: {
  label: string
  value: string | number | null | undefined
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">
        {value ?? <span className="text-muted-foreground">Non renseigné</span>}
      </p>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ClientDetail({ client }: { client: ClientWithRelations }) {
  const [isPending, startTransition] = useTransition()
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [newNoteOpen, setNewNoteOpen] = useState(false)
  const [showTrackingForm, setShowTrackingForm] = useState(false)
  const [calendarWeekOffset, setCalendarWeekOffset] = useState(0)
  const newNoteRef = useRef<HTMLTextAreaElement>(null)
  const editNoteRef = useRef<HTMLTextAreaElement>(null)

  // ── Computed values ───────────────────────────────────────────────────────

  const age = client.birthDate
    ? Math.floor(
        (Date.now() - new Date(client.birthDate).getTime()) /
          (365.25 * 24 * 3600 * 1000)
      )
    : null

  const weightData = client.measurements
    .filter((m) => m.weight !== null)
    .map((m) => ({ date: m.date, weight: m.weight as number }))

  const latestWeight = weightData[0]?.weight ?? null

  const bmi =
    latestWeight && client.height
      ? Math.round((latestWeight / ((client.height / 100) ** 2)) * 10) / 10
      : null

  const sessions30d = (() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 29)
    cutoff.setHours(0, 0, 0, 0)
    return client.sessions.filter((s) => new Date(s.date) >= cutoff).length
  })()

  const weightDelta = (() => {
    const sorted = [...client.measurements]
      .filter((m) => m.weight !== null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    if (sorted.length < 2) return null
    const first = sorted[0]?.weight ?? null
    const last = sorted[sorted.length - 1]?.weight ?? null
    if (first === null || last === null) return null
    return Math.round((last - first) * 10) / 10
  })()

  const activeProgramsCount = client.programs.filter((p) => p.isActive).length

  const WeightTrendIcon =
    weightDelta === null || weightDelta === 0
      ? Minus
      : weightDelta > 0
        ? TrendingUp
        : TrendingDown

  const weightTrendColor =
    weightDelta === null || weightDelta === 0
      ? "text-muted-foreground"
      : weightDelta > 0
        ? "text-rose-500"
        : "text-emerald-500"

  const nutritionLast7Days = useMemo(() => {
    if (!client.nutritionDayLogs?.length) return []
    return [...client.nutritionDayLogs]
      .sort(
        (logA, logB) =>
          new Date(logB.date).getTime() - new Date(logA.date).getTime()
      )
      .slice(0, 7)
  }, [client.nutritionDayLogs])

  // ── Calendar (client-specific) ────────────────────────────────────────────

  const getMonday = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    d.setDate(d.getDate() - day + (day === 0 ? -6 : 1))
    d.setHours(0, 0, 0, 0)
    return d
  }

  const calWeekStart = (() => {
    const base = getMonday(new Date())
    base.setDate(base.getDate() + calendarWeekOffset * 7)
    return base
  })()

  const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
  const calDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(calWeekStart)
    date.setDate(calWeekStart.getDate() + i)
    const key = date.toISOString().split("T")[0]!
    const daySessions = client.sessions.filter(
      (s) => new Date(s.date).toISOString().split("T")[0] === key
    )
    return { date, key, sessions: daySessions, isToday: key === new Date().toISOString().split("T")[0] }
  })

  const calWeekLabel = (() => {
    const end = new Date(calWeekStart)
    end.setDate(end.getDate() + 6)
    const months = [
      "jan.",
      "fév.",
      "mars",
      "avr.",
      "mai",
      "juin",
      "juil.",
      "août",
      "sep.",
      "oct.",
      "nov.",
      "déc.",
    ]
    if (calWeekStart.getMonth() === end.getMonth()) {
      return `${calWeekStart.getDate()} – ${end.getDate()} ${months[calWeekStart.getMonth()]} ${calWeekStart.getFullYear()}`
    }
    return `${calWeekStart.getDate()} ${months[calWeekStart.getMonth()]} – ${end.getDate()} ${months[end.getMonth()]} ${calWeekStart.getFullYear()}`
  })()

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleDeleteMeasurement(id: string) {
    startTransition(async () => {
      await deleteMeasurement(id, client.id)
    })
  }

  function handleToggleActive() {
    startTransition(async () => {
      await toggleActiveClient(client.id, !client.isActive)
    })
  }

  function handleDeleteNote(id: string) {
    startTransition(async () => {
      await deleteClientNote(id, client.id)
    })
  }

  function handleDeleteTracking(id: string) {
    startTransition(async () => {
      await deleteTrackingItem(id, client.id)
    })
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full flex-col">
      {/* ── Sticky header ── */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ClientAvatar
              firstName={client.firstName}
              lastName={client.lastName}
              size="lg"
              ring
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">
                  {client.firstName} {client.lastName}
                </h1>
                {client.isDemo && (
                  <Badge
                    variant="secondary"
                    className="border border-amber-200 bg-amber-50 text-amber-900"
                  >
                    Démo
                  </Badge>
                )}
                <button
                  onClick={handleToggleActive}
                  disabled={isPending || client.isDemo}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                    client.isActive ? "bg-emerald-500" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full bg-card shadow transition-transform ${
                      client.isActive ? "translate-x-4" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-xs font-medium text-muted-foreground">
                  {client.isActive ? "Actif" : "Inactif"}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                <span className={SECTION_ACCENTS.clients.text + " font-medium"}>
                  {FITNESS_LEVEL_LABELS[client.fitnessLevel]}
                </span>
                {age ? ` · ${age} ans` : ""}
                {client.goalType && ` · ${GOAL_TYPE_LABELS[client.goalType]}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <EditClientSheet client={client} />
          </div>
        </div>
      </div>

      {client.isDemo &&
        (client.sessions.length < 10 ||
          client.nutritionDayLogs.length < 5 ||
          client.trackingItems.length < 5) && (
          <div className="border-b border-amber-500/35 bg-amber-500/10 px-6 py-3 dark:bg-amber-500/15">
            <div className="text-sm text-amber-950 dark:text-amber-50">
              <p>
                <span className="font-semibold">
                  Exemple incomplet pour ce client fictif.
                </span>{" "}
                Assurez-vous d’avoir sélectionné le client avec le badge « Démo
                » dans la liste (et pas un autre homonyme), puis actualisez la
                page.
              </p>
              <p className="mt-1.5 text-xs text-amber-900/85 dark:text-amber-100/75">
                Si rien ne change après actualisation, réessayez plus tard ou
                contactez le support.
              </p>
              {process.env.NODE_ENV === "development" && (
                <p className="mt-2 rounded-md border border-amber-800/20 bg-amber-100/50 px-2 py-1.5 font-mono text-[11px] text-amber-950 dark:border-amber-400/25 dark:bg-amber-950/40 dark:text-amber-100">
                  Développement : à la racine du projet,{" "}
                  <code className="rounded bg-amber-200/80 px-1 dark:bg-amber-900/80">
                    npx tsx scripts/backfill-demo-clients.ts
                  </code>{" "}
                  puis rechargez.
                </p>
              )}
            </div>
          </div>
        )}

      {/* ── Tabs ── */}
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="apercu" className="h-full">
          <div className="sticky top-0 z-10 border-b border-border bg-card px-6">
            <TabsList className="h-auto rounded-none bg-transparent p-0">
              {[
                { value: "apercu", label: "Vue d'ensemble" },
                { value: "informations", label: "Informations" },
                { value: "calendrier", label: "Calendrier" },
                { value: "sport", label: "Sport" },
                { value: "nutrition", label: "Nutrition" },
                { value: "suivi", label: "Suivi" },
                { value: "partage", label: "Partage" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 data-[state=active]:shadow-none"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* ════════════════════════════════════
              VUE D'ENSEMBLE
          ════════════════════════════════════ */}
          <TabsContent value="apercu" className="px-6 py-6">
            {/* KPI row */}
            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-semibold text-muted-foreground">
                  Séances (30 j)
                </p>
                <p className="mt-1.5 text-3xl font-bold text-foreground">
                  {sessions30d}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {client.sessions.length} au total
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-semibold text-muted-foreground">Poids</p>
                <p className="mt-1.5 text-3xl font-bold text-foreground">
                  {latestWeight ? `${latestWeight} kg` : "—"}
                </p>
                <p
                  className={`mt-0.5 flex items-center gap-0.5 text-xs ${weightTrendColor}`}
                >
                  <WeightTrendIcon className="h-3 w-3" />
                  {weightDelta === null
                    ? "Aucune mesure"
                    : `${weightDelta > 0 ? "+" : ""}${weightDelta} kg`}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-semibold text-muted-foreground">
                  Programmes
                </p>
                <p className="mt-1.5 text-3xl font-bold text-foreground">
                  {activeProgramsCount}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {client.programs.length} au total
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-semibold text-muted-foreground">IMC</p>
                <p className="mt-1.5 text-3xl font-bold text-foreground">
                  {bmi ?? "—"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {bmi
                    ? bmi < 18.5
                      ? "Insuffisance pondérale"
                      : bmi < 25
                        ? "Corpulence normale"
                        : bmi < 30
                          ? "Surpoids"
                          : "Obésité"
                    : "Taille / poids manquants"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Activités récentes */}
              <div className="rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <CalendarDays className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm font-semibold text-foreground">
                    Activités clients
                  </p>
                </div>
                {client.sessions.length === 0 ? (
                  <p className="px-4 py-10 text-center text-xs text-muted-foreground">
                    Aucune séance enregistrée
                  </p>
                ) : (
                  <div className="divide-y divide-border">
                    {client.sessions.slice(0, 14).map((s) => (
                      <Link
                        key={s.id}
                        href={`/dashboard/sessions/${s.id}`}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/60"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {new Date(s.date).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {s.duration ? `${s.duration} min` : ""}
                            {s._count.exercises > 0 &&
                              ` · ${s._count.exercises} ex.`}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-emerald-50 text-[10px] text-emerald-700"
                        >
                          Séance
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <BodyPainMap
                clientId={client.id}
                isDemo={client.isDemo}
                painNotes={client.painNotes}
              />
            </div>

            {/* Notes coach — pleine largeur */}
            <div className="mt-6 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <StickyNote className="h-4 w-4 text-amber-500" />
                  <p className="text-sm font-semibold text-foreground">Notes</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNewNoteOpen(true)}
                  className="flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
                >
                  <Plus className="h-3 w-3" />
                  Ajouter
                </button>
              </div>

              {newNoteOpen && (
                <form
                  action={async (fd) => {
                    await createClientNote(client.id, fd)
                    setNewNoteOpen(false)
                  }}
                  className="border-b border-border px-4 py-3"
                >
                  <textarea
                    ref={newNoteRef}
                    name="content"
                    autoFocus
                    rows={3}
                    placeholder="Écrire une note..."
                    className="w-full resize-none rounded-lg border border-border bg-muted/50 p-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                    required
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      type="submit"
                      className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      <Check className="h-3 w-3" />
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewNoteOpen(false)}
                      className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/60"
                    >
                      <X className="h-3 w-3" />
                      Annuler
                    </button>
                  </div>
                </form>
              )}

              <div className="max-h-96 overflow-y-auto divide-y divide-border">
                {client.clientNotes.length === 0 ? (
                  <p className="px-4 py-8 text-center text-xs text-muted-foreground">
                    Aucune note. Cliquez sur &quot;Ajouter&quot; pour commencer.
                  </p>
                ) : (
                  client.clientNotes.map((note) => (
                    <div key={note.id} className="group px-4 py-3">
                      {editingNoteId === note.id ? (
                        <form
                          action={async (fd) => {
                            await updateClientNote(note.id, client.id, fd)
                            setEditingNoteId(null)
                          }}
                        >
                          <textarea
                            ref={editNoteRef}
                            name="content"
                            defaultValue={note.content}
                            autoFocus
                            rows={3}
                            className="w-full resize-none rounded-lg border border-border bg-muted/50 p-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                            required
                          />
                          <div className="mt-2 flex gap-2">
                            <button
                              type="submit"
                              className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white"
                            >
                              <Check className="h-3 w-3" />
                              Sauvegarder
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingNoteId(null)}
                              className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground"
                            >
                              <X className="h-3 w-3" />
                              Annuler
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <p className="mb-1 text-[11px] text-muted-foreground">
                            {new Date(note.createdAt).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </p>
                          <p className="whitespace-pre-wrap text-sm text-foreground">
                            {note.content}
                          </p>
                          <div className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => setEditingNoteId(note.id)}
                              className="flex items-center gap-1 rounded px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                              <Pencil className="h-3 w-3" />
                              Modifier
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteNote(note.id)}
                              disabled={isPending}
                              className="flex items-center gap-1 rounded px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                              Supprimer
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Weight chart (if measurements exist) */}
            {weightData.length > 1 && (
              <div className="mt-6 rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-semibold text-foreground">
                    Évolution du poids
                  </p>
                </div>
                <WeightChart data={weightData} />
              </div>
            )}
          </TabsContent>

          {/* ════════════════════════════════════
              INFORMATIONS
          ════════════════════════════════════ */}
          <TabsContent value="informations" className="px-6 py-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

              {/* Identité */}
              <div className="rounded-xl border border-border bg-card p-5">
                <SectionTitle>Identité</SectionTitle>
                <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
                  <ClientAvatar
                    firstName={client.firstName}
                    lastName={client.lastName}
                    size="lg"
                  />
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <InfoField label="Prénom" value={client.firstName} />
                    <InfoField label="Nom" value={client.lastName} />
                    <InfoField label="Email" value={client.email} />
                    <InfoField
                      label="Téléphone"
                      value={
                        client.phone
                          ? `${client.phoneCountryCode ?? ""} ${client.phone}`.trim()
                          : null
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InfoField
                    label="Genre"
                    value={client.gender ? GENDER_LABELS[client.gender] : null}
                  />
                  <InfoField label="Âge" value={age ? `${age} ans` : null} />
                  <InfoField
                    label="Date de naissance"
                    value={
                      client.birthDate
                        ? new Date(client.birthDate).toLocaleDateString("fr-FR")
                        : null
                    }
                  />
                  <InfoField
                    label="Taille"
                    value={client.height ? `${client.height} cm` : null}
                  />
                  <InfoField
                    label="Poids"
                    value={latestWeight ? `${latestWeight} kg` : null}
                  />
                  <InfoField label="IMC" value={bmi ? `${bmi} kg/m²` : null} />
                </div>
              </div>

              {/* Profil sportif + Style de vie */}
              <div className="rounded-xl border border-border bg-card p-5">
                <SectionTitle>Profil sportif</SectionTitle>
                <div className="mb-5 grid grid-cols-2 gap-3">
                  <InfoField
                    label="Niveau sportif"
                    value={FITNESS_LEVEL_LABELS[client.fitnessLevel]}
                  />
                  <InfoField
                    label="Séances / semaine"
                    value={client.weeklyFrequency}
                  />
                  <InfoField
                    label="Niveau d'activité"
                    value={
                      client.activityLevel
                        ? ACTIVITY_LEVEL_LABELS[client.activityLevel]
                        : null
                    }
                  />
                  <InfoField
                    label="Type de corps"
                    value={
                      client.bodyType ? BODY_TYPE_LABELS[client.bodyType] : null
                    }
                  />
                </div>
                <SectionTitle>Objectifs</SectionTitle>
                <div className="grid grid-cols-2 gap-3">
                  <InfoField
                    label="Type d'objectif"
                    value={
                      client.goalType
                        ? GOAL_TYPE_LABELS[client.goalType]
                        : null
                    }
                  />
                  <InfoField
                    label="Poids cible"
                    value={
                      client.goalTargetWeight
                        ? `${client.goalTargetWeight} kg`
                        : null
                    }
                  />
                  <InfoField
                    label="Poids de départ"
                    value={
                      client.weightStart ? `${client.weightStart} kg` : null
                    }
                  />
                  <InfoField
                    label="Perte hebdomadaire"
                    value={
                      client.goalWeeklyLoss
                        ? `-${client.goalWeeklyLoss} kg / sem.`
                        : null
                    }
                  />
                  <InfoField
                    label="Début du coaching"
                    value={
                      client.coachingStartDate
                        ? new Date(client.coachingStartDate).toLocaleDateString(
                            "fr-FR"
                          )
                        : null
                    }
                  />
                  <InfoField
                    label="Échéance"
                    value={
                      client.goalDeadline
                        ? new Date(client.goalDeadline).toLocaleDateString(
                            "fr-FR"
                          )
                        : null
                    }
                  />
                </div>
              </div>

              {/* Nutrition */}
              <div className="rounded-xl border border-border bg-card p-5">
                <SectionTitle>Nutrition</SectionTitle>
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <InfoField
                    label="Calories journalières"
                    value={
                      client.dailyCaloriesGoal
                        ? `${client.dailyCaloriesGoal} kcal`
                        : null
                    }
                  />
                  <InfoField
                    label="Hydratation journalière"
                    value={
                      client.dailyWaterGoal
                        ? `${client.dailyWaterGoal} L`
                        : null
                    }
                  />
                  <InfoField
                    label="Préférences alimentaires"
                    value={
                      client.dietaryPreferences
                        ? DIETARY_LABELS[client.dietaryPreferences]
                        : null
                    }
                  />
                  <InfoField
                    label="TCA"
                    value={
                      client.hasTCA ? "Oui (signalé)" : "Non"
                    }
                  />
                </div>

                {/* Macros distribution */}
                {client.dailyCaloriesGoal && (
                  <>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Répartition des macros
                    </p>
                    <div className="mb-3 flex gap-2">
                      {[
                        {
                          label: "Glucides",
                          pct: client.macrosCarbsPct ?? 50,
                          color: "#3b82f6",
                        },
                        {
                          label: "Protéines",
                          pct: client.macrosProteinsPct ?? 20,
                          color: "#22c55e",
                        },
                        {
                          label: "Lipides",
                          pct: client.macrosFatsPct ?? 30,
                          color: "#f59e0b",
                        },
                      ].map((macro) => {
                        const kcal = Math.round(
                          ((macro.pct / 100) *
                            (client.dailyCaloriesGoal ?? 2000)) /
                            (macro.label === "Lipides" ? 9 : 4)
                        )
                        return (
                          <div
                            key={macro.label}
                            className="flex-1 rounded-lg border border-border p-2.5 text-center"
                          >
                            <div className="mb-1 h-1.5 w-full rounded-full bg-muted">
                              <div
                                className="h-1.5 rounded-full"
                                style={{
                                  width: `${macro.pct}%`,
                                  backgroundColor: macro.color,
                                }}
                              />
                            </div>
                            <p className="text-xs font-bold text-foreground">
                              {macro.pct}%
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {kcal} g
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {macro.label}
                            </p>
                          </div>
                        )
                      })}
                    </div>

                    {/* Meal distribution */}
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Calories par repas
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          label: "Petit-déjeuner",
                          pct: client.mealBreakfastPct ?? 25,
                        },
                        { label: "Déjeuner", pct: client.mealLunchPct ?? 40 },
                        { label: "Dîner", pct: client.mealDinnerPct ?? 30 },
                        { label: "Collation", pct: client.mealSnackPct ?? 5 },
                      ].map((meal) => {
                        const kcal = Math.round(
                          ((meal.pct / 100) * (client.dailyCaloriesGoal ?? 2000))
                        )
                        return (
                          <div
                            key={meal.label}
                            className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                          >
                            <p className="text-xs text-foreground">{meal.label}</p>
                            <p className="text-xs font-semibold text-foreground">
                              {kcal} kcal
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Coordonnées */}
              <div className="rounded-xl border border-border bg-card p-5">
                <SectionTitle>Coordonnées</SectionTitle>
                <div className="mb-5 grid grid-cols-2 gap-3">
                  <InfoField label="Entreprise" value={client.company} />
                  <InfoField label="Pays" value={client.country} />
                  <div className="col-span-2">
                    <InfoField label="Adresse" value={client.address} />
                  </div>
                  <InfoField label="Code postal" value={client.postalCode} />
                  <InfoField label="Ville" value={client.city} />
                </div>

                <SectionTitle>Réseaux sociaux</SectionTitle>
                <div className="grid grid-cols-2 gap-3">
                  <InfoField label="LinkedIn" value={client.linkedin} />
                  <InfoField label="Instagram" value={client.instagram} />
                  <InfoField label="Facebook" value={client.facebook} />
                  <InfoField label="X (Twitter)" value={client.twitter} />
                </div>
              </div>

              {/* Médical */}
              {(client.injuries || client.medicalNotes) && (
                <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
                  <SectionTitle>Médical</SectionTitle>
                  <div className="grid grid-cols-2 gap-4">
                    {client.injuries && (
                      <InfoField label="Blessures" value={client.injuries} />
                    )}
                    {client.medicalNotes && (
                      <InfoField
                        label="Notes médicales"
                        value={client.medicalNotes}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ════════════════════════════════════
              CALENDRIER
          ════════════════════════════════════ */}
          <TabsContent value="calendrier" className="px-6 py-6">
            {/* Week navigation */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCalendarWeekOffset((n) => n - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted/60"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-foreground">
                  {calWeekLabel}
                </span>
                <button
                  onClick={() => setCalendarWeekOffset((n) => n + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted/60"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => setCalendarWeekOffset(0)}
                className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/60"
              >
                Aujourd&apos;hui
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-border">
                {calDays.map(({ date, isToday }, idx) => (
                  <div
                    key={idx}
                    className={`border-r border-border px-2 py-3 text-center last:border-r-0 ${isToday ? "bg-blue-50" : ""}`}
                  >
                    <p
                      className={`text-[11px] font-semibold uppercase tracking-wide ${isToday ? "text-blue-600" : "text-muted-foreground"}`}
                    >
                      {WEEKDAY_LABELS[idx]}
                    </p>
                    <p
                      className={`mt-0.5 text-base font-bold ${isToday ? "text-blue-700" : "text-foreground"}`}
                    >
                      {date.getDate()}
                    </p>
                  </div>
                ))}
              </div>
              {/* Events */}
              <div className="grid grid-cols-7 divide-x divide-border">
                {calDays.map(({ sessions: daySessions, isToday }, idx) => (
                  <div
                    key={idx}
                    className={`min-h-32 p-2 ${isToday ? "bg-blue-50/30" : ""}`}
                  >
                    {daySessions.map((s) => (
                      <Link
                        key={s.id}
                        href={`/dashboard/sessions/${s.id}`}
                        className="mb-1 block rounded-lg bg-emerald-50 border border-emerald-200 p-1.5 transition-all hover:shadow-sm"
                      >
                        <p className="truncate text-[11px] font-semibold text-emerald-700">
                          Séance
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {s.duration ? `${s.duration} min` : ""}
                          {s.rpe ? ` · RPE ${s.rpe}` : ""}
                        </p>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ════════════════════════════════════
              SPORT
          ════════════════════════════════════ */}
          <TabsContent value="sport" className="px-6 py-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Programmes */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-violet-600" />
                    <h2 className="text-sm font-semibold text-foreground">
                      Programmes ({client.programs.length})
                    </h2>
                  </div>
                  <Link
                    href="/dashboard/programs/new"
                    className="flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/60"
                  >
                    <Plus className="h-3 w-3" />
                    Nouveau
                  </Link>
                </div>
                {client.programs.length === 0 ? (
                  <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card py-10 text-center">
                    <p className="text-xs text-muted-foreground">Aucun programme</p>
                    <Link
                      href="/dashboard/programs/new"
                      className="mt-2 text-xs font-medium text-violet-600 hover:underline"
                    >
                      Créer un programme
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {client.programs.map((p) => (
                      <Link
                        key={p.id}
                        href={`/dashboard/programs/${p.id}`}
                        className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 hover:border-violet-200 hover:shadow-sm"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">
                              {p.name}
                            </p>
                            {p.isActive ? (
                              <Badge className="bg-emerald-50 text-[10px] text-emerald-700">
                                Actif
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="text-[10px]"
                              >
                                Inactif
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {p._count.workoutDays} jour
                            {p._count.workoutDays !== 1 ? "s" : ""} · Depuis{" "}
                            {new Date(p.startDate).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Séances */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-emerald-600" />
                    <h2 className="text-sm font-semibold text-foreground">
                      Séances ({client.sessions.length})
                    </h2>
                  </div>
                </div>
                {client.sessions.length === 0 ? (
                  <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card py-10 text-center">
                    <p className="text-xs text-muted-foreground">Aucune séance</p>
                  </div>
                ) : (
                  <div className="max-h-[520px] overflow-y-auto">
                    <div className="flex flex-col gap-2">
                      {client.sessions.map((s) => (
                        <Link
                          key={s.id}
                          href={`/dashboard/sessions/${s.id}`}
                          className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 hover:border-emerald-200 hover:shadow-sm"
                        >
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {new Date(s.date).toLocaleDateString("fr-FR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                              })}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {s.duration ? `${s.duration} min` : ""}
                              {s.rpe ? ` · RPE ${s.rpe}` : ""}
                              {s._count.exercises > 0 &&
                                ` · ${s._count.exercises} exercice${s._count.exercises !== 1 ? "s" : ""}`}
                            </p>
                          </div>
                          {s.rpe && (
                            <div className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              <Flame className="h-3 w-3" />
                              {s.rpe}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Measurements */}
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-blue-600" />
                  <h2 className="text-sm font-semibold text-foreground">
                    Mesures corporelles ({client.measurements.length})
                  </h2>
                </div>
                <MeasurementSheet
                  clientId={client.id}
                  hasRecordedSensitiveConsent={Boolean(
                    client.sensitiveDataConsentAt
                  )}
                />
              </div>

              {weightData.length > 0 && (
                <div className="mb-4 rounded-xl border border-border bg-card p-4">
                  <p className="mb-2 text-sm font-medium text-foreground">
                    Courbe de poids
                  </p>
                  <WeightChart data={weightData} />
                </div>
              )}

              {client.measurements.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-border bg-card">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        {[
                          "Date",
                          "Poids",
                          "MG %",
                          "MM kg",
                          "Taille",
                          "Hanches",
                          "",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-xs font-semibold text-muted-foreground"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {client.measurements.map((m) => (
                        <tr key={m.id} className="hover:bg-muted/60">
                          <td className="px-4 py-3 font-medium text-foreground">
                            {new Date(m.date).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="px-4 py-3 text-foreground">
                            {m.weight ? `${m.weight} kg` : "—"}
                          </td>
                          <td className="px-4 py-3 text-foreground">
                            {m.bodyFat ? `${m.bodyFat}%` : "—"}
                          </td>
                          <td className="px-4 py-3 text-foreground">
                            {m.muscleMass ? `${m.muscleMass} kg` : "—"}
                          </td>
                          <td className="px-4 py-3 text-foreground">
                            {m.waist ? `${m.waist} cm` : "—"}
                          </td>
                          <td className="px-4 py-3 text-foreground">
                            {m.hips ? `${m.hips} cm` : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDeleteMeasurement(m.id)}
                              disabled={isPending}
                              className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-red-500 disabled:opacity-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ════════════════════════════════════
              NUTRITION
          ════════════════════════════════════ */}
          <TabsContent value="nutrition" className="px-6 py-6">
            {!client.dailyCaloriesGoal ? (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
                <Droplets className="mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm font-medium text-foreground">
                  Aucun objectif nutritionnel défini
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Renseignez les objectifs caloriques dans l&apos;onglet
                  Informations.
                </p>
                <button className="mt-4 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/60">
                  Définir les objectifs
                </button>
              </div>
            ) : (
              <>
                {/* Summary cards */}
                <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Objectif calories
                    </p>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                      {client.dailyCaloriesGoal}
                    </p>
                    <p className="text-xs text-muted-foreground">kcal / jour</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Glucides
                    </p>
                    <p className="mt-2 text-3xl font-bold text-blue-700">
                      {Math.round(
                        (((client.macrosCarbsPct ?? 50) / 100) *
                          client.dailyCaloriesGoal) /
                          4
                      )}{" "}
                      g
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {client.macrosCarbsPct ?? 50}% des calories
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Protéines
                    </p>
                    <p className="mt-2 text-3xl font-bold text-emerald-700">
                      {Math.round(
                        (((client.macrosProteinsPct ?? 20) / 100) *
                          client.dailyCaloriesGoal) /
                          4
                      )}{" "}
                      g
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {client.macrosProteinsPct ?? 20}% des calories
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Lipides
                    </p>
                    <p className="mt-2 text-3xl font-bold text-amber-700">
                      {Math.round(
                        (((client.macrosFatsPct ?? 30) / 100) *
                          client.dailyCaloriesGoal) /
                          9
                      )}{" "}
                      g
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {client.macrosFatsPct ?? 30}% des calories
                    </p>
                  </div>
                </div>

                {/* Macro bars */}
                <div className="mb-6 rounded-xl border border-border bg-card p-5">
                  <p className="mb-4 text-sm font-semibold text-foreground">
                    Répartition des macronutriments
                  </p>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Glucides",
                        pct: client.macrosCarbsPct ?? 50,
                        color: "bg-blue-500",
                        recommen: "45–65% recommandé",
                      },
                      {
                        label: "Protéines",
                        pct: client.macrosProteinsPct ?? 20,
                        color: "bg-emerald-500",
                        recommen: "10–35% recommandé",
                      },
                      {
                        label: "Lipides",
                        pct: client.macrosFatsPct ?? 30,
                        color: "bg-amber-500",
                        recommen: "20–35% recommandé",
                      },
                    ].map((macro) => (
                      <div key={macro.label}>
                        <div className="mb-1 flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">
                            {macro.label}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {macro.recommen}
                            </span>
                            <span className="text-sm font-bold text-foreground">
                              {macro.pct}%
                            </span>
                          </div>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-muted">
                          <div
                            className={`h-2.5 rounded-full ${macro.color}`}
                            style={{ width: `${macro.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meal distribution */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="mb-4 text-sm font-semibold text-foreground">
                    Calories par repas
                  </p>
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                      {
                        label: "Petit-déjeuner",
                        pct: client.mealBreakfastPct ?? 25,
                        recommen: "25% recommandé",
                      },
                      {
                        label: "Déjeuner",
                        pct: client.mealLunchPct ?? 40,
                        recommen: "40% recommandé",
                      },
                      {
                        label: "Dîner",
                        pct: client.mealDinnerPct ?? 30,
                        recommen: "30% recommandé",
                      },
                      {
                        label: "Collation",
                        pct: client.mealSnackPct ?? 5,
                        recommen: "5% recommandé",
                      },
                    ].map((meal) => {
                      const kcal = Math.round(
                        ((meal.pct / 100) * client.dailyCaloriesGoal!)
                      )
                      return (
                        <div
                          key={meal.label}
                          className="rounded-xl border border-border bg-muted/50 p-3 text-center"
                        >
                          <p className="text-xs font-semibold text-foreground">
                            {meal.label}
                          </p>
                          <p className="mt-2 text-xl font-bold text-foreground">
                            {meal.pct}%
                          </p>
                          <p className="text-sm font-medium text-muted-foreground">
                            {kcal} kcal / jour
                          </p>
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            {meal.recommen}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Journal nutrition récent */}
                {nutritionLast7Days.length > 0 && (
                  <div className="mb-6 rounded-xl border border-border bg-card p-5">
                    <p className="mb-4 text-sm font-semibold text-foreground">
                      Aperçu des jours enregistrés (les plus récents)
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-7">
                      {nutritionLast7Days.map((log) => {
                        const dateLabel = new Date(log.date).toLocaleDateString(
                          "fr-FR",
                          {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          }
                        )
                        const goal = client.dailyCaloriesGoal ?? 2000
                        const pct = Math.min(
                          Math.round((log.caloriesConsumed / goal) * 100),
                          100
                        )
                        return (
                          <div
                            key={log.id}
                            className="flex flex-col rounded-lg border border-border bg-muted/30 p-3 text-center"
                          >
                            <p className="text-[10px] font-medium uppercase text-muted-foreground">
                              {dateLabel}
                            </p>
                            <p className="mt-1 text-lg font-bold text-foreground">
                              {log.caloriesConsumed}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              kcal · {pct}% objectif
                            </p>
                            <div className="mt-2 space-y-0.5 text-[10px] text-muted-foreground">
                              <p>P {Math.round(log.proteinG ?? 0)} g</p>
                              <p>G {Math.round(log.carbsG ?? 0)} g</p>
                              <p>L {Math.round(log.fatG ?? 0)} g</p>
                              {log.waterL != null && (
                                <p className="text-sky-600 dark:text-sky-400">
                                  Eau {log.waterL.toFixed(1)} L
                                </p>
                              )}
                            </div>
                            {(log.breakfastKcal != null ||
                              log.lunchKcal != null) && (
                              <div className="mt-2 border-t border-border pt-2 text-[9px] leading-tight text-muted-foreground">
                                <p>P.Dej {log.breakfastKcal ?? "—"}</p>
                                <p>Dej {log.lunchKcal ?? "—"}</p>
                                <p>Dîn {log.dinnerKcal ?? "—"}</p>
                                <p>Coll {log.snackKcal ?? "—"}</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Hydration */}
                {client.dailyWaterGoal && (
                  <div className="mt-4 flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 dark:bg-sky-400/20">
                      <Droplets className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Hydratation journalière
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Objectif : {client.dailyWaterGoal} L / jour
                      </p>
                    </div>
                    <div className="ml-auto text-2xl font-bold text-sky-600">
                      {client.dailyWaterGoal} L
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* ════════════════════════════════════
              SUIVI
          ════════════════════════════════════ */}
          <TabsContent value="suivi" className="px-6 py-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                Suivis en cours
              </h2>
              <button
                onClick={() => setShowTrackingForm(true)}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </button>
            </div>

            {/* New tracking item form */}
            {showTrackingForm && (
              <div className="mb-4 rounded-xl border border-border bg-card p-4">
                <p className="mb-3 text-sm font-semibold text-foreground">
                  Nouveau suivi
                </p>
                <form
                  action={async (fd) => {
                    await createTrackingItem(client.id, fd)
                    setShowTrackingForm(false)
                  }}
                  className="flex flex-col gap-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-foreground">
                        Type
                      </label>
                      <select
                        name="type"
                        required
                        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                      >
                        <option value="BILAN">Bilan</option>
                        <option value="HABITUDE">Habitude</option>
                        <option value="QUESTIONNAIRE">Questionnaire</option>
                        <option value="MESURE">Mesure</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-foreground">
                        Fréquence
                      </label>
                      <select
                        name="frequency"
                        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                      >
                        <option value="">Non définie</option>
                        <option value="daily">Quotidienne</option>
                        <option value="weekly">Hebdomadaire</option>
                        <option value="monthly">Mensuelle</option>
                        <option value="once">Une fois</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-foreground">
                      Nom *
                    </label>
                    <input
                      name="name"
                      required
                      placeholder="Bilan de forme, Boire 2L d'eau..."
                      className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-foreground">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={2}
                      className="w-full resize-none rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Créer
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTrackingForm(false)}
                      className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/60"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Filter tabs */}
            <div className="mb-4 flex gap-2">
              {(["BILAN", "HABITUDE", "QUESTIONNAIRE", "MESURE"] as const).map(
                (type) => {
                  const count = client.trackingItems.filter(
                    (t) => t.type === type
                  ).length
                  const colors = TRACKING_TYPE_COLORS[type]
                  return (
                    <div
                      key={type}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${colors.border} ${colors.bg} ${colors.text}`}
                    >
                      {TRACKING_TYPE_LABELS[type]}
                      <span className="font-bold">{count}</span>
                    </div>
                  )
                }
              )}
            </div>

            {client.trackingItems.length === 0 ? (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
                <Activity className="mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm font-medium text-foreground">
                  Aucun suivi configuré
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ajoutez des bilans, habitudes ou questionnaires pour ce
                  client.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {client.trackingItems.map((item) => {
                  const colors = TRACKING_TYPE_COLORS[item.type]
                  const freqLabels: Record<string, string> = {
                    daily: "Quotidienne",
                    weekly: "Hebdomadaire",
                    monthly: "Mensuelle",
                    once: "Une fois",
                  }
                  return (
                    <div
                      key={item.id}
                      className="group flex items-start justify-between rounded-xl border border-border bg-card px-4 py-3"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${colors.border} ${colors.bg} ${colors.text}`}
                        >
                          {TRACKING_TYPE_LABELS[item.type]}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {item.name}
                          </p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {item.frequency
                              ? freqLabels[item.frequency] ?? item.frequency
                              : "Fréquence non définie"}
                            {item.lastAnsweredAt &&
                              ` · Dernière réponse : ${new Date(item.lastAnsweredAt).toLocaleDateString("fr-FR")}`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTracking(item.id)}
                        disabled={isPending}
                        className="mt-0.5 rounded p-1.5 text-muted-foreground/40 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* ════════════════════════════════════
              PARTAGE
          ════════════════════════════════════ */}
          <TabsContent value="partage" className="px-6 py-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-base font-semibold text-foreground">
                  Partage
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/60">
                  <FolderPlus className="h-4 w-4" />
                  Nouveau dossier
                </button>
                <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  Ajouter
                </button>
              </div>
            </div>

            <div className="mb-3 flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  placeholder="Rechercher un fichier ou dossier..."
                  className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                />
              </div>
              <button className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/60">
                Tous
              </button>
            </div>

            <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
              <Folder className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-foreground">
                Aucun fichier ou dossier partagé avec ce client
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Partagez des fichiers depuis le Drive pour qu&apos;ils
                apparaissent ici.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
