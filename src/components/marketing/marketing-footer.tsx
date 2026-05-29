import Link from "next/link"
import { RevoLogo } from "@/components/brand/revo-logo"

type FooterLink = { href: string; label: string }
type FooterCol = { title: string; links: FooterLink[] }

const FOOTER_COLS: FooterCol[] = [
  {
    title: "Produit",
    links: [
      { href: "/fonctionnalites", label: "Fonctionnalités" },
      { href: "/tarifs", label: "Tarifs" },
      { href: "/blog", label: "Blog & Ressources" },
    ],
  },
  {
    title: "Démarrer",
    links: [
      { href: "/sign-up", label: "Créer un compte" },
      { href: "/sign-in", label: "Se connecter" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/cgu", label: "CGU" },
      { href: "/cgv", label: "CGV" },
      { href: "/confidentialite", label: "Politique de confidentialité" },
    ],
  },
]

type MarketingFooterProps = {
  variant?: "full" | "compact"
}

export function MarketingFooter({ variant = "compact" }: MarketingFooterProps) {
  const year = new Date().getFullYear()

  if (variant === "full") {
    return (
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <RevoLogo href="/" size="md" showLabel />
              </div>
              <p className="text-sm leading-relaxed text-slate-500 max-w-[220px]">
                La plateforme tout-en-un pour les coachs sportifs qui veulent passer plus de temps sur le terrain.
              </p>
              <p className="mt-6 text-xs text-slate-400">
                © {year} Revo. Tous droits réservés.
              </p>
            </div>

            {/* Nav columns */}
            {FOOTER_COLS.map(({ title, links }) => (
              <div key={title}>
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</p>
                <nav className="flex flex-col gap-3">
                  {links.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <RevoLogo href="/" size="sm" showLabel />
          <p className="text-xs text-slate-400">© {year} Revo. Tous droits réservés.</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-5 sm:justify-end">
          {FOOTER_COLS.flatMap(({ links }) => links).map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs text-slate-400 transition-colors hover:text-slate-700"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
