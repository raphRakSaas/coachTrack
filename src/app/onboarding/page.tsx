import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { OnboardingStepper } from "@/components/onboarding/onboarding-stepper"

export default async function OnboardingPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")
  if (user.onboardingCompleted) redirect("/dashboard")

  const clerkUser = await currentUser()
  let coachFirstName = clerkUser?.firstName?.trim() ?? ""
  let coachLastName = clerkUser?.lastName?.trim() ?? ""

  if (!coachFirstName && !coachLastName && user.name?.trim()) {
    const segments = user.name.trim().split(/\s+/).filter(Boolean)
    coachFirstName = segments[0] ?? ""
    coachLastName = segments.slice(1).join(" ")
  }

  return (
    <OnboardingStepper
      initialCoachFirstName={coachFirstName}
      initialCoachLastName={coachLastName}
    />
  )
}
