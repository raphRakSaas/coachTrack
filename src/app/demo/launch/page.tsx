import { Suspense } from "react"
import { DemoLaunchClient } from "@/components/demo/demo-launch-client"

export const metadata = {
  title: "Lancement démo",
  robots: { index: false, follow: false },
}

export default function DemoLaunchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
          Chargement…
        </div>
      }
    >
      <DemoLaunchClient />
    </Suspense>
  )
}
