"use client"

import Link from "next/link"
import { useRef, useState, useTransition } from "react"
import {
  Droplets,
  ExternalLink,
  Flame,
  Pencil,
  Plus,
  Trash2,
  UtensilsCrossed,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  deleteNutritionDayLog,
  upsertNutritionDayLog,
} from "@/app/dashboard/clients/[id]/actions"

export type NutritionHubRow = {
  id: string
  clientId: string
  date: Date
  caloriesConsumed: number
  proteinG: number | null
  carbsG: number | null
  fatG: number | null
  waterL: number | null
  breakfastKcal: number | null
  lunchKcal: number | null
  dinnerKcal: number | null
  snackKcal: number | null
  client: {
    id: string
    firstName: string
    lastName: string
    dailyCaloriesGoal: number | null
  }
}

type ClientOption = {
  id: string
  firstName: string
  lastName: string
  dailyCaloriesGoal: number | null
}

type Accent = {
  bgSoft: string
  icon: string
  badge: string
}

function formatDayInput(value: Date): string {
  const date = new Date(value)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function formatNum(value: number | null | undefined, suffix = ""): string {
  if (value === null || value === undefined) return "—"
  return `${Number.isInteger(value) ? value : value.toFixed(1)}${suffix}`
}

export function NutritionHub({
  rows,
  clients,
  accent,
  stats,
}: {
  rows: NutritionHubRow[]
  clients: ClientOption[]
  accent: Accent
  stats: {
    entriesCount: number
    avgCaloriesLast7Days: number | null
    periodDays: number
  }
}) {
  const [isPending, startTransition] = useTransition()
  const [createOpen, setCreateOpen] = useState(false)
  const [editRow, setEditRow] = useState<NutritionHubRow | null>(null)
  const createFormRef = useRef<HTMLFormElement>(null)
  const [newClientId, setNewClientId] = useState("")
  const todayStr = formatDayInput(new Date())

  const selectedNewClient = clients.find((c) => c.id === newClientId)

  function handleDelete(row: NutritionHubRow) {
    if (
      !confirm(
        `Supprimer l’entrée du ${new Date(row.date).toLocaleDateString("fr-FR")} pour ${row.client.firstName} ${row.client.lastName} ?`
      )
    )
      return
    startTransition(async () => {
      await deleteNutritionDayLog(row.id, row.clientId)
    })
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div
          className={`rounded-xl border border-border bg-card p-4 ${accent.bgSoft}`}
        >
          <p className="text-xs font-medium text-muted-foreground">
            Entrées ({stats.periodDays} jours)
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {stats.entriesCount}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Moyenne kcal / jour (7 jours)
          </p>
          <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-foreground">
            <Flame className={`h-6 w-6 ${accent.icon}`} />
            {stats.avgCaloriesLast7Days !== null
              ? `${stats.avgCaloriesLast7Days} kcal`
              : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Rappel
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Une ligne par client et par jour civil. Modifier une date existante
            met à jour l’entrée ; un nouveau jour crée ou fusionne via la date.
          </p>
        </div>
      </div>

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
            Nouvelle entrée
          </SheetTrigger>
          <SheetContent className="overflow-y-auto sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Nouveau jour nutrition</SheetTitle>
            </SheetHeader>
            <form
              ref={createFormRef}
              action={async (formData) => {
                if (!newClientId) return
                await upsertNutritionDayLog(newClientId, formData)
                setCreateOpen(false)
                setNewClientId("")
                createFormRef.current?.reset()
              }}
              className="flex flex-col gap-3 px-4 py-2"
            >
              <div className="flex flex-col gap-1.5">
                <Label>Client *</Label>
                <Select
                  value={newClientId}
                  onValueChange={(value) => setNewClientId(value ?? "")}
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
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="n-date">Date *</Label>
                <Input
                  id="n-date"
                  name="date"
                  type="date"
                  required
                  defaultValue={todayStr}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="n-cal">Calories totales (kcal) *</Label>
                <Input
                  id="n-cal"
                  name="caloriesConsumed"
                  type="number"
                  min={0}
                  required
                  placeholder="1800"
                />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Macronutriments (optionnel)
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="n-p" className="text-xs">
                    Prot. (g)
                  </Label>
                  <Input id="n-p" name="proteinG" type="number" min={0} step="0.1" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="n-c" className="text-xs">
                    Gluc. (g)
                  </Label>
                  <Input id="n-c" name="carbsG" type="number" min={0} step="0.1" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="n-f" className="text-xs">
                    Lip. (g)
                  </Label>
                  <Input id="n-f" name="fatG" type="number" min={0} step="0.1" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="n-water">Eau (L)</Label>
                <Input
                  id="n-water"
                  name="waterL"
                  type="number"
                  min={0}
                  step="0.1"
                  placeholder="2.0"
                />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Calories par repas (optionnel)
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(
                  [
                    ["breakfastKcal", "Petit-déj."],
                    ["lunchKcal", "Déjeuner"],
                    ["dinnerKcal", "Dîner"],
                    ["snackKcal", "Collation"],
                  ] as const
                ).map(([field, label]) => (
                  <div key={field} className="flex flex-col gap-1">
                    <Label htmlFor={field} className="text-xs">
                      {label}
                    </Label>
                    <Input id={field} name={field} type="number" min={0} />
                  </div>
                ))}
              </div>
              <SheetFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={!newClientId || isPending}>
                  Enregistrer
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <UtensilsCrossed className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-foreground">
            Aucune entrée nutrition pour ces filtres
          </p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Ajoutez un jour avec calories et macros, ou élargissez la période /
            le client.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">kcal</th>
                <th className="px-4 py-3">P / G / L</th>
                <th className="px-4 py-3">Eau</th>
                <th className="px-4 py-3 hidden lg:table-cell">Repas</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => {
                const goal = row.client.dailyCaloriesGoal
                const pct =
                  goal && goal > 0
                    ? Math.min(
                        Math.round((row.caloriesConsumed / goal) * 100),
                        999
                      )
                    : null
                return (
                  <tr key={row.id} className="bg-card hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                      {new Date(row.date).toLocaleDateString("fr-FR", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/clients/${row.client.id}`}
                        className="inline-flex items-center gap-1 font-medium text-foreground hover:underline"
                      >
                        {row.client.firstName} {row.client.lastName}
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">{row.caloriesConsumed}</span>
                      {pct !== null && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({pct}% obj.)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatNum(row.proteinG, " g")} ·{" "}
                      {formatNum(row.carbsG, " g")} · {formatNum(row.fatG, " g")}
                    </td>
                    <td className="px-4 py-3">
                      {row.waterL != null ? (
                        <span className="inline-flex items-center gap-1 text-sky-700 dark:text-sky-400">
                          <Droplets className="h-3.5 w-3.5" />
                          {row.waterL.toFixed(1)} L
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="hidden px-4 py-3 text-[11px] text-muted-foreground lg:table-cell">
                      P {row.breakfastKcal ?? "—"} · Déj {row.lunchKcal ?? "—"} ·
                      Dîn {row.dinnerKcal ?? "—"} · C {row.snackKcal ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditRow(row)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-red-600"
                        disabled={isPending}
                        onClick={() => handleDelete(row)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Sheet
        open={editRow !== null}
        onOpenChange={(open) => !open && setEditRow(null)}
      >
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          {editRow && (
            <>
              <SheetHeader>
                <SheetTitle>Modifier l’entrée nutrition</SheetTitle>
              </SheetHeader>
              <form
                action={async (formData) => {
                  await upsertNutritionDayLog(editRow.clientId, formData)
                  setEditRow(null)
                }}
                className="flex flex-col gap-3 px-4 py-2"
              >
                <input type="hidden" name="id" value={editRow.id} />
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="e-date">Date *</Label>
                  <Input
                    id="e-date"
                    name="date"
                    type="date"
                    required
                    defaultValue={formatDayInput(editRow.date)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="e-cal">Calories totales (kcal) *</Label>
                  <Input
                    id="e-cal"
                    name="caloriesConsumed"
                    type="number"
                    min={0}
                    required
                    defaultValue={editRow.caloriesConsumed}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs">Prot. (g)</Label>
                    <Input
                      name="proteinG"
                      type="number"
                      min={0}
                      step="0.1"
                      defaultValue={editRow.proteinG ?? ""}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs">Gluc. (g)</Label>
                    <Input
                      name="carbsG"
                      type="number"
                      min={0}
                      step="0.1"
                      defaultValue={editRow.carbsG ?? ""}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs">Lip. (g)</Label>
                    <Input
                      name="fatG"
                      type="number"
                      min={0}
                      step="0.1"
                      defaultValue={editRow.fatG ?? ""}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Eau (L)</Label>
                  <Input
                    name="waterL"
                    type="number"
                    min={0}
                    step="0.1"
                    defaultValue={editRow.waterL ?? ""}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs">Petit-déj.</Label>
                    <Input
                      name="breakfastKcal"
                      type="number"
                      min={0}
                      defaultValue={editRow.breakfastKcal ?? ""}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs">Déjeuner</Label>
                    <Input
                      name="lunchKcal"
                      type="number"
                      min={0}
                      defaultValue={editRow.lunchKcal ?? ""}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs">Dîner</Label>
                    <Input
                      name="dinnerKcal"
                      type="number"
                      min={0}
                      defaultValue={editRow.dinnerKcal ?? ""}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs">Collation</Label>
                    <Input
                      name="snackKcal"
                      type="number"
                      min={0}
                      defaultValue={editRow.snackKcal ?? ""}
                    />
                  </div>
                </div>
                <SheetFooter className="gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditRow(null)}
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
