import { redirect } from "next/navigation"
import Link from "next/link"
import { ClipboardList, Plus, Trash2 } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { deleteProgram } from "./actions"

export default async function ProgramsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const programs = await prisma.program.findMany({
    where: { coachId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { firstName: true, lastName: true } },
      _count: { select: { workoutDays: true } },
    },
  })

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Programmes</h1>
          <p className="text-sm text-zinc-500">
            {programs.length} programme{programs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/dashboard/programs/new" className={buttonVariants()}>
          <Plus className="h-4 w-4" />
          Nouveau programme
        </Link>
      </div>

      {programs.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <ClipboardList className="mb-3 h-10 w-10 text-zinc-300" />
          <p className="text-sm font-medium text-zinc-500">Aucun programme</p>
          <p className="mt-1 text-xs text-zinc-400">
            Créez un programme d'entraînement pour un client.
          </p>
          <Link
            href="/dashboard/programs/new"
            className={buttonVariants({ variant: "outline", size: "sm" }) + " mt-4"}
          >
            Créer un programme
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
          {programs.map((program) => (
            <div
              key={program.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  {program.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {program.client.firstName} {program.client.lastName} ·{" "}
                  {program._count.workoutDays} jour
                  {program._count.workoutDays !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!program.isActive && (
                  <Badge variant="secondary">Inactif</Badge>
                )}
                <form action={deleteProgram.bind(null, program.id)}>
                  <button
                    type="submit"
                    className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
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
