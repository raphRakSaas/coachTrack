import { ListPageSkeleton } from "@/components/dashboard/loading/page-skeletons"

export default function SessionsLoading() {
  return <ListPageSkeleton withMetrics withFilters rowCount={8} />
}
