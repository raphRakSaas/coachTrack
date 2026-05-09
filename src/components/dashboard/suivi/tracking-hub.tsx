"use client"

import Link from "next/link"
import { useMemo, useRef, useState, useTransition } from "react"
import {
  Activity,
  ExternalLink,
  Pencil,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react"
import type { TrackingItemType } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  createTrackingItem,
  deleteTrackingItem,
  updateTrackingItem,
} from "@/app/dashboard/clients/[id]/actions"
import { cn } from "@/lib/utils"

export type TrackingHubRow = {
  id: string
  clientId: string
  type: TrackingItemType
  name: string
  description: string | null
  frequency: string | null
  isActive: boolean
  lastAnsweredAt: Date | null
  updatedAt: Date
  client: { id: string; firstName: string; lastName: string }
}

type ClientOption = { id: string; firstName: string; lastName: string }

const TYPE_LABELS: Record<TrackingItemType, string> = {
  BILAN: "Bilan",
  HABITUDE: "Habitude",
  QUESTIONNAIRE: "Questionnaire",
  MESURE: "Mesure",
}

const TYPE_STYLE: Record<
  TrackingItemType,
  { badge: string; border: string }
> = {
  BILAN: {
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-950/55 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
  },
  HABITUDE: {
    badge:
      "bg-violet-100 text-violet-800 dark:bg-violet-950/55 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-800",
  },
  QUESTIONNAIRE: {
    badge:
      "bg-orange-100 text-orange-800 dark:bg-orange-950/55 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
  },
  MESURE: {
    badge:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/55 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
  },
}

const FREQ_LABELS: Record<string, string> = {
  daily: "Quotidienne",
  weekly: "Hebdomadaire",
  monthly: "Mensuelle",
  once: "Une fois",
}

function toDatetimeLocal(value: Date | null): string {
  if (!value) return ""
  const date = new Date(value)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

type Accent = {
  bgSoft: string
  icon: string
  badge: string
}

export function TrackingHub({
  items,
  clients,
  accent,
}: {
  items: TrackingHubRow[]
  clients: ClientOption[]
  accent: Accent
}) {
  const [isPending, startTransition] = useTransition()
  const [createOpen, setCreateOpen] = useState(false)
  const [editItem, setEditItem] = useState<TrackingHubRow | null>(null)
  const createFormRef = useRef<HTMLFormElement>(null)
  const [newClientId, setNewClientId] = useState("")

  const selectedNewClient = clients.find((c) => c.id === newClientId)

  const summary = useMemo(() => {
    const active = items.filter((item) => item.isActive).length
    const byType = (["BILAN", "HABITUDE", "QUESTIONNAIRE", "MESURE"] as const).map(
      (typeKey) => ({
        typeKey,
        label: TYPE_LABELS[typeKey],
        count: items.filter((item) => item.type === typeKey).length,
      })
    )
    return { active, total: items.length, byType }
  }, [items])

  function handleDelete(item: TrackingHubRow) {
    if (
      !confirm(
        `Supprimer le suivi « ${item.name} » pour ${item.client.firstName} ${item.client.lastName} ?`
      )
    )
      return
    startTransition(async () => {
      await deleteTrackingItem(item.id, item.clientId)
    })
  }

  return (
    <div className="space-y-6">
      {/* Résumé */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className={`rounded-xl border border-border bg-card p-4 ${accent.bgSoft}`}
        >
          <p className="text-xs font-medium text-muted-foreground">
            Suivis affichés
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {summary.total}
          </p>
          <p className="text-xs text-muted-foreground">
            {summary.active} actif{summary.active !== 1 ? "s" : ""}
          </p>
        </div>
        {summary.byType.map((row) => (
          <div
            key={row.typeKey}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="text-xs font-medium text-muted-foreground">
              {row.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {row.count}
            </p>
          </div>
        ))}
      </div>

      {/* Création */}
      <div className="flex justify-end">
        <Sheet
          open={createOpen}
          onOpenChange={(open) => {
            setCreateOpen(open)
            if (!open) {
              setNewClientId("")
              createFormRef.current?.reset()
            }
          }}
        >
          <SheetTrigger render={<Button />}>
            <Plus className="h-4 w-4" />
            Nouveau suivi
          </SheetTrigger>
          <SheetContent className="overflow-y-auto sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Nouveau suivi</SheetTitle>
            </SheetHeader>
            <form
              ref={createFormRef}
              action={async (formData) => {
                if (!newClientId) return
                await createTrackingItem(newClientId, formData)
                setCreateOpen(false)
                setNewClientId("")
                createFormRef.current?.reset()
              }}
              className="flex flex-col gap-4 px-4 py-2"
            >
              <div className="flex flex-col gap-1.5">
                <Label>Client *</Label>
                <Select
                  value={newClientId}
                  onValueChange={(value) => setNewClientId(value ?? "")}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir un client">
                      {selectedNewClient
                        ? `${selectedNewClient.firstName} ${selectedNewClient.lastName}`
                        : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.firstName} {client.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="create-type">Type *</Label>
                  <select
                    id="create-type"
                    name="type"
                    required
                    className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                  >
                    <option value="BILAN">Bilan</option>
                    <option value="HABITUDE">Habitude</option>
                    <option value="QUESTIONNAIRE">Questionnaire</option>
                    <option value="MESURE">Mesure</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="create-frequency">Fréquence</Label>
                  <select
                    id="create-frequency"
                    name="frequency"
                    className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                  >
                    <option value="">Non définie</option>
                    <option value="daily">Quotidienne</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="monthly">Mensuelle</option>
                    <option value="once">Une fois</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="create-name">Nom *</Label>
                <Input
                  id="create-name"
                  name="name"
                  required
                  placeholder="Ex. Bilan de forme hebdo"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="create-description">Description</Label>
                <Textarea
                  id="create-description"
                  name="description"
                  rows={3}
                  placeholder="Consignes, critères de réussite…"
                />
              </div>
              <SheetFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={!newClientId || isPending}>
                  Créer
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Liste */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <Activity className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-foreground">
            Aucun suivi pour ces filtres
          </p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Créez un bilan, une habitude ou un questionnaire pour un client, ou
            élargissez les filtres ci-dessus.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => {
            const style = TYPE_STYLE[item.type]
            return (
              <div
                key={item.id}
                className={cn(
                  "group flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-start sm:justify-between",
                  style.border
                )}
              >
                <div className="flex flex-1 gap-3">
                  <span
                    className={cn(
                      "h-fit rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                      style.badge,
                      style.border
                    )}
                  >
                    {TYPE_LABELS[item.type]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {item.name}
                      </p>
                      {item.isActive ? (
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${accent.badge}`}
                        >
                          Actif
                        </span>
                      ) : (
                        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          Inactif
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <Link
                        href={`/dashboard/clients/${item.client.id}`}
                        className="inline-flex items-center gap-1 font-medium text-foreground hover:underline"
                      >
                        {item.client.firstName} {item.client.lastName}
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </Link>
                      <span>
                        {item.frequency
                          ? FREQ_LABELS[item.frequency] ?? item.frequency
                          : "Fréquence non définie"}
                      </span>
                      {item.lastAnsweredAt && (
                        <span>
                          Dernière réponse :{" "}
                          {new Date(item.lastAnsweredAt).toLocaleString("fr-FR")}
                        </span>
                      )}
                      <span className="text-[10px]">
                        MAJ{" "}
                        {new Date(item.updatedAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1 sm:flex-col sm:items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => setEditItem(item)}
                  >
                    <Pencil className="h-4 w-4" />
                    Modifier
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-red-600"
                    disabled={isPending}
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Édition */}
      <Sheet
        open={editItem !== null}
        onOpenChange={(open) => !open && setEditItem(null)}
      >
        <SheetContent className="overflow-y-auto sm:max-w-md">
          {editItem && (
            <>
              <SheetHeader>
                <SheetTitle>Modifier le suivi</SheetTitle>
              </SheetHeader>
              <form
                action={async (formData) => {
                  await updateTrackingItem(
                    editItem.id,
                    editItem.clientId,
                    formData
                  )
                  setEditItem(null)
                }}
                className="flex flex-col gap-4 px-4 py-2"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="edit-type">Type *</Label>
                    <select
                      id="edit-type"
                      name="type"
                      required
                      defaultValue={editItem.type}
                      className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                    >
                      <option value="BILAN">Bilan</option>
                      <option value="HABITUDE">Habitude</option>
                      <option value="QUESTIONNAIRE">Questionnaire</option>
                      <option value="MESURE">Mesure</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="edit-frequency">Fréquence</Label>
                    <select
                      id="edit-frequency"
                      name="frequency"
                      defaultValue={editItem.frequency ?? ""}
                      className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                    >
                      <option value="">Non définie</option>
                      <option value="daily">Quotidienne</option>
                      <option value="weekly">Hebdomadaire</option>
                      <option value="monthly">Mensuelle</option>
                      <option value="once">Une fois</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-name">Nom *</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    required
                    defaultValue={editItem.name}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    rows={3}
                    defaultValue={editItem.description ?? ""}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-last">Dernière réponse (optionnel)</Label>
                  <Input
                    id="edit-last"
                    name="lastAnsweredAt"
                    type="datetime-local"
                    defaultValue={toDatetimeLocal(editItem.lastAnsweredAt)}
                  />
                </div>
                <input
                  type="hidden"
                  name="isActive"
                  value={editItem.isActive ? "true" : "false"}
                />
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-sm font-medium text-foreground"
                    onClick={() =>
                      setEditItem({
                        ...editItem,
                        isActive: !editItem.isActive,
                      })
                    }
                  >
                    {editItem.isActive ? (
                      <ToggleRight className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                    )}
                    {editItem.isActive ? "Suivi actif" : "Suivi désactivé"}
                  </button>
                </div>
                <SheetFooter className="gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditItem(null)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    Enregistrer
                  </Button>
                </SheetFooter>
              </form>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
