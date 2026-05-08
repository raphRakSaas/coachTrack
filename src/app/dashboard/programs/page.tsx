import { redirect } from "next/navigation"
import Link from "next/link"
import { ClipboardList, Plus, Trash2 } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { SECTION_ACCENTS } from "@/lib/colors"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClientAvatar } from "@/components/ui/client-avatar"
import { deleteProgram } from "./actions"

export default async function ProgramsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const accent = SECTION_ACCENTS.programs

  const programs = await prisma.program.findMany({
    where: { coachId: user.id },
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    include: {
      client: { select: { firstName: true, lastName: true } },
      _count: { select: { workoutDays: true } },
    },
  })

  const activeCount = programs.filter((p) => p.isActive).length

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.bgSoft}`}>
            <ClipboardList className={`h-5 w-5 ${accent.icon}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Programmes</h1>
            <p className="text-sm text-zinc-500">
              {activeCount} actif{activeCount !== 1 ? "s" : ""}
              {programs.length > activeCount &&
                ` · ${programs.length - activeCount} archivé${programs.length - activeCount !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <Link href="/dashboard/programs/new" className={buttonVariants()}>
          <Plus className="h-4 w-4" />
          Nouveau programme
        </Link>
      </div>

      {programs.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-zinc-200 bg-white py-20 text-center">
          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${accent.bgSoft}`}>
            <ClipboardList className={`h-6 w-6 ${accent.icon}`} />
          </div>
          <p className="text-sm font-medium text-zinc-700">Aucun programme</p>
          <p className="mt-1 text-xs text-zinc-500">
            Créez un programme d&apos;entraînement personnalisé pour un client.
          </p>
          <Link
            href="/dashboard/programs/new"
            className={buttonVariants({ variant: "outline", size: "sm" }) + " mt-4"}
          >
            Créer un programme
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {programs.map((program) => (
            <div
              key={program.id}
              className="group rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-violet-200 hover:shadow-sm"
            >
              <Link
                href={`/dashboard/programs/${program.id}`}
                className="mb-3 flex items-start justify-between gap-2"
              >
                <div className="flex items-center gap-3">
                  <ClientAvatar
                    firstName={program.client.firstName}
                    lastName={program.client.lastName}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      {program.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {program.client.firstName} {program.client.lastName}
                    </p>
                  </div>
                </div>
                {!program.isActive && (
                  <Badge variant="secondary" className="text-[10px]">
                    Archivé
                  </Badge>
                )}
              </Link>
              <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className={`rounded-md ${accent.badge} px-2 py-0.5 font-medium`}>
                    {program._count.workoutDays} jour
                    {program._count.workoutDays !== 1 ? "s" : ""}
                  </span>
                  <span>
                    Début {new Date(program.startDate).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <form action={deleteProgram.bind(null, program.id)}>
                  <button
                    type="submit"
                    className="rounded p-1.5 text-zinc-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
