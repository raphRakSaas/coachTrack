import { redirect } from "next/navigation"
import { Sidebar, MobileDashboardNav } from "@/components/dashboard/sidebar"
import { DemoBanner } from "@/components/dashboard/demo-banner"
import { getCurrentUser } from "@/lib/auth"
import { isSystemDemoCoach } from "@/lib/demo-account"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")
  if (!user.onboardingCompleted) redirect("/onboarding")

  const isDemoSession = isSystemDemoCoach(user)

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {isDemoSession && <DemoBanner />}
        <MobileDashboardNav />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
