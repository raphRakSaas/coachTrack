import Link from "next/link"

const FOOTER_NAV = [
  { href: "/fonctionnalites", label: "Fonctionnalités" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/blog", label: "Blog" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgu", label: "CGU" },
  { href: "/confidentialite", label: "Confidentialité" },
] as const

type MarketingFooterProps = {
  /** Pleine largeur avec logo (landing). Sinon pied minimal centré. */
  variant?: "full" | "compact"
}

export function MarketingFooter({ variant = "compact" }: MarketingFooterProps) {
  if (variant === "full") {
    return (
      <footer
        className="border-t px-6 py-10"
        style={{ borderColor: "var(--m-border)" }}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-1.5">
            <span
              className="font-[family-name:var(--font-display)] text-base font-bold"
              style={{ color: "var(--m-text)" }}
            >
              Revo
            </span>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--m-accent)" }}
            />
          </div>
          <p className="text-xs" style={{ color: "var(--m-text-faint)" }}>
            © {new Date().getFullYear()} Revo. Tous droits réservés.
          </p>
          <nav className="flex flex-wrap justify-center gap-6">
            {FOOTER_NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs transition-opacity hover:opacity-70"
                style={{ color: "var(--m-text-faint)" }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    )
  }

  return (
    <footer
      className="border-t px-6 py-8"
      style={{ borderColor: "var(--m-border)" }}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-xs" style={{ color: "var(--m-text-faint)" }}>
          © {new Date().getFullYear()} Revo. Tous droits réservés.
        </p>
        <nav className="flex flex-wrap justify-center gap-4 sm:justify-end">
          {FOOTER_NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs transition-opacity hover:opacity-70"
              style={{ color: "var(--m-text-faint)" }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
