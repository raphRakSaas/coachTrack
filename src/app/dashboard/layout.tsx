import { Suspense } from "react"

import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardAuthHeader } from "@/components/dashboard/dashboard-auth-header"
import { DashboardHeaderSkeleton } from "@/components/dashboard/loading/page-skeletons"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Suspense fallback={<DashboardHeaderSkeleton />}>
          <DashboardAuthHeader />
        </Suspense>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
