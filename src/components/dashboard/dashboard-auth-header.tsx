import { redirect } from "next/navigation"

import { MobileDashboardNav } from "@/components/dashboard/sidebar"
import { DemoBanner } from "@/components/dashboard/demo-banner"
import { getCurrentUser } from "@/lib/auth"
import { isSystemDemoCoach } from "@/lib/demo-account"

export async function DashboardAuthHeader() {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")
  if (!user.onboardingCompleted) redirect("/onboarding")

  const isDemoSession = isSystemDemoCoach(user)

  return (
    <>
      {isDemoSession && <DemoBanner />}
      <MobileDashboardNav />
    </>
  )
}
