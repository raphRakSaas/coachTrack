import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

function PagePadding({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn("p-4 md:p-6 lg:p-8", className)}>{children}</div>
}

function PageHeaderSkeleton({
  withActions = true,
  actionCount = 2,
}: {
  withActions?: boolean
  actionCount?: number
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
      {withActions && (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: actionCount }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-24 rounded-lg" />
          ))}
        </div>
      )}
    </div>
  )
}

function MetricCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <Skeleton className="mb-3 h-4 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="mt-2 h-3 w-24" />
        </div>
      ))}
    </div>
  )
}

function ListRowsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
        >
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-4 w-4 shrink-0 rounded" />
        </div>
      ))}
    </div>
  )
}

function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <Skeleton className="mb-4 h-5 w-2/3" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  )
}

export function DashboardHomeSkeleton() {
  return (
    <div className="min-h-full">
      <section
        className="relative flex items-end justify-between overflow-hidden px-4 pb-0 pt-8 md:px-8"
        style={{ background: "#080a0e", minHeight: 200 }}
      >
        <div className="flex flex-col gap-5 pb-8">
          <div className="space-y-3">
            <Skeleton className="h-3 w-40 bg-white/10" />
            <Skeleton className="h-10 w-56 bg-white/10" />
            <Skeleton className="h-4 w-72 bg-white/10" />
          </div>
          <Skeleton className="h-10 w-40 rounded-full bg-white/10" />
        </div>
      </section>

      <PagePadding className="space-y-6">
        <MetricCardsSkeleton />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Skeleton className="h-56 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
        <ListRowsSkeleton count={4} />
      </PagePadding>
    </div>
  )
}

export function ListPageSkeleton({
  withFilters = true,
  withMetrics = false,
  rowCount = 6,
}: {
  withFilters?: boolean
  withMetrics?: boolean
  rowCount?: number
}) {
  return (
    <PagePadding>
      <PageHeaderSkeleton />
      {withMetrics && (
        <div className="mb-6">
          <MetricCardsSkeleton count={3} />
        </div>
      )}
      {withFilters && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Skeleton className="h-10 w-full max-w-sm rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      )}
      <ListRowsSkeleton count={rowCount} />
    </PagePadding>
  )
}

export function CardListPageSkeleton({ cardCount = 6 }: { cardCount?: number }) {
  return (
    <PagePadding>
      <PageHeaderSkeleton />
      <CardGridSkeleton count={cardCount} />
    </PagePadding>
  )
}

export function DetailPageSkeleton({ withTabs = true }: { withTabs?: boolean }) {
  return (
    <PagePadding className="space-y-0 p-0 md:p-0">
      <div className="border-b border-border bg-card px-4 py-4 md:px-6">
        <div className="flex items-start gap-3">
          <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-24 shrink-0 rounded-lg" />
        </div>
      </div>
      {withTabs && (
        <div className="flex gap-2 overflow-hidden border-b border-border px-4 py-3 md:px-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-24 shrink-0 rounded-md" />
          ))}
        </div>
      )}
      <PagePadding>
        <MetricCardsSkeleton count={4} />
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-52 rounded-2xl" />
          <Skeleton className="h-52 rounded-2xl" />
        </div>
      </PagePadding>
    </PagePadding>
  )
}

export function ClientsSplitSkeleton() {
  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <aside className="flex h-full w-full shrink-0 flex-col border-r border-border bg-card md:w-56">
        <div className="space-y-3 border-b border-border px-3 py-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
        <div className="flex border-b border-border">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="mx-1 my-2 h-6 flex-1 rounded" />
          ))}
        </div>
        <div className="space-y-1 p-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2 px-2 py-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            </div>
          ))}
        </div>
      </aside>
      <div className="hidden min-w-0 flex-1 md:block">
        <DetailPageSkeleton />
      </div>
    </div>
  )
}

export function ClientDetailSkeleton() {
  return <DetailPageSkeleton withTabs />
}

export function CalendarPageSkeleton() {
  return (
    <PagePadding>
      <PageHeaderSkeleton actionCount={3} />
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-4">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="mx-auto h-12 w-10" />
            ))}
          </div>
        </div>
        <div className="space-y-3 p-4 md:hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          ))}
        </div>
        <Skeleton className="hidden h-[420px] md:block" />
      </div>
    </PagePadding>
  )
}

export function SettingsPageSkeleton() {
  return (
    <PagePadding>
      <PageHeaderSkeleton withActions={false} />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <Skeleton className="mb-4 h-5 w-40" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </PagePadding>
  )
}

export function FormPageSkeleton() {
  return (
    <PagePadding>
      <PageHeaderSkeleton actionCount={1} />
      <div className="mx-auto max-w-3xl space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </PagePadding>
  )
}

export function DashboardHeaderSkeleton() {
  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-4 md:hidden">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </header>
    </>
  )
}

export function OnboardingPageSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <Skeleton className="mx-auto h-12 w-12 rounded-xl" />
        <Skeleton className="mx-auto h-8 w-64" />
        <Skeleton className="mx-auto h-4 w-80" />
        <div className="space-y-3 pt-2">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
