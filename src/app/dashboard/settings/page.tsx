import { redirect } from "next/navigation"
import { Settings as SettingsIcon, ExternalLink } from "lucide-react"

import { getCurrentUser } from "@/lib/auth"
import { SECTION_ACCENTS } from "@/lib/colors"
import { SettingsForm } from "@/components/dashboard/settings/settings-form"

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const accent = SECTION_ACCENTS.settings

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.bgSoft}`}
        >
          <SettingsIcon className={`h-5 w-5 ${accent.icon}`} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Paramètres</h1>
          <p className="text-sm text-zinc-500">
            Gérez votre profil de coach et vos informations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-1 text-base font-semibold text-zinc-900">
              Profil de coach
            </h2>
            <p className="mb-5 text-sm text-zinc-500">
              Ces informations apparaissent dans votre dashboard.
            </p>
            <SettingsForm
              defaults={{
                name: user.name,
                specialty: user.specialty,
                bio: user.bio,
                yearsExperience: user.yearsExperience,
              }}
            />
          </div>
        </div>

        {/* Side info */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-zinc-900">
              Compte
            </h3>
            <dl className="flex flex-col gap-2 text-sm">
              <div>
                <dt className="text-xs text-zinc-500">Email</dt>
                <dd className="font-medium text-zinc-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Membre depuis</dt>
                <dd className="font-medium text-zinc-900">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                    month: "long",
                    year: "numeric",
                  })}
                </dd>
              </div>
            </dl>
            <a
              href="https://accounts.clerk.com"
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-900"
            >
              Gérer email & mot de passe
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
            <p className="text-xs leading-relaxed text-zinc-500">
              💡 Plus votre profil est complet, plus votre dashboard est
              personnalisé. Pensez à ajouter votre spécialité et votre
              expérience.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
