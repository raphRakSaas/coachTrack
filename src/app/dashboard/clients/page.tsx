import { Users } from "lucide-react"

export default function ClientsIndexPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
        <Users className="h-8 w-8 text-blue-600" />
      </div>
      <h2 className="text-lg font-semibold text-zinc-900">
        Sélectionnez un client
      </h2>
      <p className="mt-1 max-w-xs text-sm text-zinc-500">
        Choisissez un client dans la liste pour voir son profil complet et
        gérer son suivi.
      </p>
    </div>
  )
}
