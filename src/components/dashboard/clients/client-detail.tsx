"use client"

import Link from "next/link"
import { ArrowLeft, Trash2 } from "lucide-react"
import { useTransition } from "react"
import type { Prisma } from "@prisma/client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ClientAvatar } from "@/components/ui/client-avatar"
import { Badge } from "@/components/ui/badge"
import { MeasurementSheet } from "./measurement-sheet"
import { EditClientSheet } from "./edit-client-sheet"
import { WeightChart } from "@/components/charts/weight-chart"
import { deleteMeasurement } from "@/app/dashboard/clients/[id]/actions"
import { SECTION_ACCENTS } from "@/lib/colors"
import { SessionsSparkline } from "@/components/charts/sessions-sparkline"
import {
  FITNESS_LEVEL_LABELS,
  GOAL_TYPE_LABELS,
  GENDER_LABELS,
} from "@/lib/constants"

type ClientWithRelations = Prisma.ClientGetPayload<{
  include: {
    measurements: true
    sessions: true
    programs: {
      include: { _count: { select: { workoutDays: true } } }
    }
  }
}>

function Field({
  label,
  value,
}: {
  label: string
  value: string | number | null | undefined
}) {
  if (!value && value !== 0) return null
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="text-sm font-medium text-zinc-900">{value}</p>
    </div>
  )
}

export function ClientDetail({ client }: { client: ClientWithRelations }) {
  const [isPending, startTransition] = useTransition()

  function handleDeleteMeasurement(id: string) {
    startTransition(async () => {
      await deleteMeasurement(id, client.id)
    })
  }

  const age = client.birthDate
    ? Math.floor(
        (Date.now() - new Date(client.birthDate).getTime()) /
          (365.25 * 24 * 3600 * 1000)
      )
    : null

  const weightData = client.measurements
    .filter((m) => m.weight !== null)
    .map((m) => ({ date: m.date, weight: m.weight as number }))

  const lastSession = client.sessions[0] ?? null
  const sessions30d = (() => {
    const d = new Date()
    d.setDate(d.getDate() - 29)
    d.setHours(0, 0, 0, 0)
    return client.sessions.filter((s) => new Date(s.date) >= d).length
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

  // 14-day session buckets for sparkline (client)
  const sparklineBuckets = (() => {
    const start = new Date()
    start.setDate(start.getDate() - 13)
    start.setHours(0, 0, 0, 0)
    const buckets: { day: string; count: number }[] = []
    for (let i = 0; i < 14; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      const key = day.toISOString().split("T")[0]
      buckets.push({
        day: day.toLocaleDateString("fr-FR", { weekday: "short" }),
        count: client.sessions.filter(
          (s) => new Date(s.date).toISOString().split("T")[0] === key
        ).length,
      })
    }
    return buckets
  })()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/clients"
          className="mb-4 flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux clients
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <ClientAvatar
              firstName={client.firstName}
              lastName={client.lastName}
              size="lg"
              ring
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-zinc-900">
                  {client.firstName} {client.lastName}
                </h1>
                {!client.isActive && (
                  <Badge variant="secondary">Inactif</Badge>
                )}
              </div>
              <p className="mt-0.5 text-sm text-zinc-500">
                <span className={SECTION_ACCENTS.clients.text + " font-medium"}>
                  {FITNESS_LEVEL_LABELS[client.fitnessLevel]}
                </span>
                {age ? ` · ${age} ans` : ""}
                {client.goalType && ` · ${GOAL_TYPE_LABELS[client.goalType]}`}
              </p>
            </div>
          </div>
          <EditClientSheet client={client} />
        </div>
      </div>

      {/* Suivi overview */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-semibold text-zinc-500">Séances (30 jours)</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">{sessions30d}</p>
          <p className="mt-1 text-xs text-zinc-500">Activité récente du client</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-semibold text-zinc-500">Dernière séance</p>
          <p className="mt-2 text-sm font-semibold text-zinc-900">
            {lastSession
              ? new Date(lastSession.date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })
              : "—"}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {lastSession?.duration ? `${lastSession.duration} min` : "Aucune durée"}
            {lastSession?.rpe ? ` · RPE ${lastSession.rpe}` : ""}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-semibold text-zinc-500">Programmes</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">
            {client.programs.filter((p) => p.isActive).length}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {client.programs.length} au total
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-semibold text-zinc-500">Poids</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">
            {weightData[0]?.weight ? `${weightData[0].weight} kg` : "—"}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {weightDelta === null
              ? "Ajoutez des mesures pour voir l’évolution."
              : `${weightDelta > 0 ? "+" : ""}${weightDelta} kg depuis le début`}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-900">
            Activité 14 jours
          </p>
          <p className="text-xs text-zinc-400">
            {client.sessions.length} séance{client.sessions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <SessionsSparkline data={sparklineBuckets} />
      </div>

      <Tabs defaultValue="profil">
        <TabsList className="mb-6">
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="mesures">
            Mesures ({client.measurements.length})
          </TabsTrigger>
          <TabsTrigger value="seances">
            Séances ({client.sessions.length})
          </TabsTrigger>
          <TabsTrigger value="programmes">
            Programmes ({client.programs.length})
          </TabsTrigger>
        </TabsList>

        {/* ── Profil ── */}
        <TabsContent value="profil">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Identité
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Genre"
                  value={client.gender ? GENDER_LABELS[client.gender] : null}
                />
                <Field label="Âge" value={age ? `${age} ans` : null} />
                <Field
                  label="Date de naissance"
                  value={
                    client.birthDate
                      ? new Date(client.birthDate).toLocaleDateString("fr-FR")
                      : null
                  }
                />
                <Field label="Email" value={client.email} />
                <Field
                  label="Téléphone"
                  value={
                    client.phone
                      ? `${client.phoneCountryCode ?? ""} ${client.phone}`.trim()
                      : null
                  }
                />
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Profil sportif
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Niveau"
                  value={FITNESS_LEVEL_LABELS[client.fitnessLevel]}
                />
                <Field
                  label="Séances / semaine"
                  value={client.weeklyFrequency}
                />
                <Field
                  label="Taille"
                  value={client.height ? `${client.height} cm` : null}
                />
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Objectifs
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Type d'objectif"
                  value={
                    client.goalType ? GOAL_TYPE_LABELS[client.goalType] : null
                  }
                />
                <Field
                  label="Poids cible"
                  value={
                    client.goalTargetWeight
                      ? `${client.goalTargetWeight} kg`
                      : null
                  }
                />
                <Field
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
              {client.goal && (
                <p className="mt-3 text-sm text-zinc-700">{client.goal}</p>
              )}
            </div>

            {(client.injuries || client.medicalNotes) && (
              <div className="rounded-xl border border-zinc-200 bg-white p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Médical
                </p>
                <div className="flex flex-col gap-3">
                  {client.injuries && (
                    <div>
                      <p className="text-xs text-zinc-400">Blessures</p>
                      <p className="text-sm text-zinc-700">{client.injuries}</p>
                    </div>
                  )}
                  {client.medicalNotes && (
                    <div>
                      <p className="text-xs text-zinc-400">Notes médicales</p>
                      <p className="text-sm text-zinc-700">
                        {client.medicalNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Mesures ── */}
        <TabsContent value="mesures">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-900">
              Évolution corporelle
            </h2>
            <MeasurementSheet
              clientId={client.id}
              hasRecordedSensitiveConsent={Boolean(
                client.sensitiveDataConsentAt
              )}
            />
          </div>

          {weightData.length > 0 && (
            <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-5">
              <p className="mb-3 text-sm font-medium text-zinc-700">
                Poids (kg)
              </p>
              <WeightChart data={weightData} />
            </div>
          )}

          {client.measurements.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <p className="text-sm font-medium text-zinc-500">
                Aucune mesure enregistrée
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Ajoutez la première mesure pour commencer le suivi.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-zinc-500">
                      Date
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-zinc-500">
                      Poids
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-zinc-500">
                      MG %
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-zinc-500">
                      MM kg
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-zinc-500">
                      Taille
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-zinc-500">
                      Hanches
                    </th>
                    <th className="w-10 px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {client.measurements.map((m) => (
                    <tr key={m.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3 font-medium text-zinc-900">
                        {new Date(m.date).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3 text-zinc-700">
                        {m.weight ? `${m.weight} kg` : "—"}
                      </td>
                      <td className="px-4 py-3 text-zinc-700">
                        {m.bodyFat ? `${m.bodyFat}%` : "—"}
                      </td>
                      <td className="px-4 py-3 text-zinc-700">
                        {m.muscleMass ? `${m.muscleMass} kg` : "—"}
                      </td>
                      <td className="px-4 py-3 text-zinc-700">
                        {m.waist ? `${m.waist} cm` : "—"}
                      </td>
                      <td className="px-4 py-3 text-zinc-700">
                        {m.hips ? `${m.hips} cm` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDeleteMeasurement(m.id)}
                          disabled={isPending}
                          className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-red-500 disabled:opacity-50"
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
        </TabsContent>

        {/* ── Séances ── */}
        <TabsContent value="seances">
          {client.sessions.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <p className="text-sm font-medium text-zinc-500">
                Aucune séance enregistrée
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Créez une séance depuis l&apos;onglet Séances.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
              {client.sessions.map((s) => (
                <Link
                  key={s.id}
                  href={`/dashboard/sessions/${s.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-zinc-50"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {new Date(s.date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {s.duration ? `${s.duration} min` : ""}
                      {s.rpe ? ` · RPE ${s.rpe}` : ""}
                    </p>
                  </div>
                  {s.mood && (
                    <span className="text-xs font-medium text-zinc-400">
                      Humeur {s.mood}/5
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Programmes ── */}
        <TabsContent value="programmes">
          {client.programs.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <p className="text-sm font-medium text-zinc-500">
                Aucun programme
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Créez un programme depuis l&apos;onglet Programmes.
              </p>
              <Link
                href="/dashboard/programs/new"
                className="mt-4 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Créer un programme
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
              {client.programs.map((p) => (
                <Link
                  key={p.id}
                  href={`/dashboard/programs/${p.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-zinc-50"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {p.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {p._count.workoutDays} jour
                      {p._count.workoutDays !== 1 ? "s" : ""} ·{" "}
                      {new Date(p.startDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  {!p.isActive && (
                    <span className="text-xs text-zinc-400">Inactif</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
