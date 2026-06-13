"use client"

import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { ClientListPanel } from "@/components/dashboard/clients/client-list-panel"
import type { Prisma } from "@prisma/client"

type ClientRow = Prisma.ClientGetPayload<{
  include: {
    _count: { select: { sessions: true } }
    sessions: { select: { date: true } }
  }
}>

function isClientDetailPath(pathname: string) {
  return /^\/dashboard\/clients\/[^/]+/.test(pathname)
}

export function ClientsLayoutShell({
  clients,
  children,
}: {
  clients: ClientRow[]
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const showDetail = isClientDetailPath(pathname)

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <ClientListPanel
        clients={clients}
        className={showDetail ? "hidden md:flex" : undefined}
      />
      <div
        className={cn(
          "min-w-0 flex-1 overflow-y-auto bg-background",
          !showDetail && "hidden md:block"
        )}
      >
        {children}
      </div>
    </div>
  )
}
