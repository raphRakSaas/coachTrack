import { Skeleton } from "@/components/ui/skeleton"

export function DashboardHeroSkeleton() {
  return (
    <section
      className="relative -mx-6 flex items-end overflow-hidden px-8 pb-8 pt-8"
      style={{ background: "#080a0e", minHeight: 200 }}
    >
      <div className="space-y-3">
        <Skeleton className="h-3 w-40 bg-white/10" />
        <Skeleton className="h-10 w-56 bg-white/10" />
        <Skeleton className="h-4 w-72 bg-white/10" />
        <Skeleton className="mt-2 h-10 w-40 rounded-full bg-white/10" />
      </div>
    </section>
  )
}

export function DashboardHeroSummarySkeleton() {
  return <Skeleton className="mt-3 h-4 w-72 bg-white/10" />
}

export function DashboardMetricsSkeleton() {
  return (
    <div className="border-b border-border">
      <div className="grid grid-cols-2 divide-x divide-border lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2 px-6 py-6">
            <Skeleton className="h-12 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ChartCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-5 ${className ?? ""}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  )
}

function SideListSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-14" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 px-2 py-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardActivityRowSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <ChartCardSkeleton className="lg:col-span-2" />
      <SideListSkeleton />
    </div>
  )
}

export function DashboardTrendRowSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <ChartCardSkeleton className="lg:col-span-2" />
      <ChartCardSkeleton />
    </div>
  )
}

export function DashboardPulseRowSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 pb-4 lg:grid-cols-3">
      <ChartCardSkeleton className="lg:col-span-2" />
      <SideListSkeleton />
    </div>
  )
}
