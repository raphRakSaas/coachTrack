import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Nav } from "@/components/marketing/nav"

export function LegalDocShell({
  title,
  children,
  updatedLabel,
}: {
  title: string
  children: React.ReactNode
  updatedLabel: string
}) {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: "var(--m-bg)", color: "var(--m-text)" }}
    >
      <Nav />
      <article className="mx-auto max-w-3xl px-6 pb-24 pt-28">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
          style={{ color: "var(--m-text-muted)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l&apos;accueil
        </Link>
        <p className="text-xs" style={{ color: "var(--m-text-faint)" }}>
          {updatedLabel}
        </p>
        <h1
          className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight"
          style={{ color: "var(--m-text)" }}
        >
          {title}
        </h1>
        <div
          className="mt-10 space-y-6 text-sm leading-relaxed [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-[color:var(--m-text)] [&_li]:mt-1.5 [&_p]:text-pretty [&_strong]:text-[color:var(--m-text)] [&_ul]:list-disc [&_ul]:pl-5"
          style={{ color: "var(--m-text-muted)" }}
        >
          {children}
        </div>
      </article>
    </div>
  )
}
