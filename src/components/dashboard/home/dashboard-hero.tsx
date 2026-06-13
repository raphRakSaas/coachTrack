import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import { Plus } from "lucide-react"

import { getCoachId, greetingByHour } from "@/components/dashboard/home/dashboard-date-utils"
import {
  DashboardHeroSummary,
} from "@/components/dashboard/home/dashboard-hero-summary"
import { DashboardHeroSummarySkeleton } from "@/components/dashboard/home/dashboard-skeletons"

export async function DashboardHero() {
  const user = await getCoachId()
  const firstName = user.name?.split(" ")[0] ?? null
  const greeting = greetingByHour()
  const currentDateLabel = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <section
      className="relative -mx-6 -mt-0 flex items-end justify-between overflow-hidden px-8 pb-0 pt-8"
      style={{ background: "#080a0e", minHeight: 200 }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #84cc16 30%, transparent 80%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-5 pb-8">
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/25">
            {currentDateLabel}
          </p>
          <h1 className="text-[2.6rem] font-black leading-none tracking-tight text-white">
            {greeting}
            {firstName && (
              <>
                , <span className="text-[#a3e635]">{firstName}</span>
              </>
            )}
          </h1>
          <Suspense fallback={<DashboardHeroSummarySkeleton />}>
            <DashboardHeroSummary coachId={user.id} />
          </Suspense>
        </div>

        <Link
          href="/dashboard/sessions"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-[#a3e635] px-5 py-2.5 text-sm font-bold text-black transition-all hover:bg-[#bef264] active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Nouvelle séance
        </Link>
      </div>

      <div className="relative hidden shrink-0 self-end md:block">
        <Image
          src="/revo-mascot-coach.png"
          alt="Mascotte Revo"
          width={200}
          height={200}
          className="revo-float h-48 w-auto object-contain"
          priority
          style={{
            filter: "drop-shadow(0 0 40px rgba(163, 230, 53, 0.18))",
          }}
        />
      </div>
    </section>
  )
}
