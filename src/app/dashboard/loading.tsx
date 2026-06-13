import {
  DashboardActivityRowSkeleton,
  DashboardHeroSkeleton,
  DashboardMetricsSkeleton,
  DashboardPulseRowSkeleton,
  DashboardTrendRowSkeleton,
} from "@/components/dashboard/home/dashboard-skeletons"

export default function DashboardLoading() {
  return (
    <div className="min-h-full space-y-0">
      <DashboardHeroSkeleton />
      <DashboardMetricsSkeleton />
      <div className="space-y-5 px-6 pt-5 pb-6">
        <DashboardActivityRowSkeleton />
        <DashboardTrendRowSkeleton />
        <DashboardPulseRowSkeleton />
      </div>
    </div>
  )
}
