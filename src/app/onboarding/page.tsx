import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { OnboardingStepper } from "@/components/onboarding/onboarding-stepper"

export default async function OnboardingPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")
  if (user.onboardingCompleted) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-zinc-50">
      <OnboardingStepper userName={user.name} />
    </div>
  )
}
