import { Suspense } from "react"

import { DashboardHero } from "@/components/dashboard/home/dashboard-hero"
import { DashboardMetrics } from "@/components/dashboard/home/dashboard-metrics"
import { DashboardActivityRow } from "@/components/dashboard/home/dashboard-activity-row"
import { DashboardTrendRow } from "@/components/dashboard/home/dashboard-trend-row"
import { DashboardPulseRow } from "@/components/dashboard/home/dashboard-pulse-row"
import {
  DashboardActivityRowSkeleton,
  DashboardHeroSkeleton,
  DashboardMetricsSkeleton,
  DashboardPulseRowSkeleton,
  DashboardTrendRowSkeleton,
} from "@/components/dashboard/home/dashboard-skeletons"

export default function DashboardPage() {
  return (
    <div className="min-h-full space-y-0">
      <Suspense fallback={<DashboardHeroSkeleton />}>
        <DashboardHero />
      </Suspense>

      <Suspense fallback={<DashboardMetricsSkeleton />}>
        <DashboardMetrics />
      </Suspense>

      <div className="space-y-5 px-6 pt-5 pb-6">
        <Suspense fallback={<DashboardActivityRowSkeleton />}>
          <DashboardActivityRow />
        </Suspense>

        <Suspense fallback={<DashboardTrendRowSkeleton />}>
          <DashboardTrendRow />
        </Suspense>

        <Suspense fallback={<DashboardPulseRowSkeleton />}>
          <DashboardPulseRow />
        </Suspense>
      </div>
    </div>
  )
}
