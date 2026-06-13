import { ClientsLayoutWithSuspense } from "@/components/dashboard/clients/clients-layout-loader"
import { ClientsSplitSkeleton } from "@/components/dashboard/loading/page-skeletons"

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientsLayoutWithSuspense fallback={<ClientsSplitSkeleton />}>
      {children}
    </ClientsLayoutWithSuspense>
  )
}
