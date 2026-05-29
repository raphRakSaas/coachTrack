import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const REVO_LOGO_SRC = "/revoLogo.png"

const sizeConfig = {
  xs: {
    icon: "h-6 w-auto",
    label: "text-sm",
    width: 48,
    height: 24,
  },
  sm: {
    icon: "h-8 w-auto",
    label: "text-base",
    width: 56,
    height: 32,
  },
  md: {
    icon: "h-9 w-auto",
    label: "text-base",
    width: 64,
    height: 36,
  },
  lg: {
    icon: "h-11 w-auto",
    label: "text-lg",
    width: 80,
    height: 44,
  },
} as const

export type RevoLogoSize = keyof typeof sizeConfig

type RevoLogoProps = {
  size?: RevoLogoSize
  className?: string
  href?: string | null
  priority?: boolean
  /** Affiche le mot « Revo » à côté du pictogramme. */
  showLabel?: boolean
  /** Couleur du libellé : clair sur fond sombre, foncé sur fond clair. */
  tone?: "light" | "dark"
}

export function RevoLogo({
  size = "md",
  className,
  href = "/",
  priority = false,
  showLabel = false,
  tone = "light",
}: RevoLogoProps) {
  const config = sizeConfig[size]

  const brand = (
    <span
      className={cn(
        "inline-flex items-center gap-2",
        showLabel && "group-hover:opacity-90",
        className
      )}
    >
      <Image
        src={REVO_LOGO_SRC}
        alt=""
        width={config.width}
        height={config.height}
        className={cn(config.icon, "shrink-0 object-contain")}
        priority={priority}
        aria-hidden
      />
      {showLabel ? (
        <span
          className={cn(
            "font-[family-name:var(--font-display)] font-bold tracking-tight",
            config.label,
            tone === "dark" ? "text-white" : "text-slate-900"
          )}
        >
          Revo
        </span>
      ) : null}
    </span>
  )

  const accessibleLabel = showLabel ? "Revo — accueil" : "Revo"

  if (href === null) {
    return (
      <span className="inline-flex shrink-0" aria-label={accessibleLabel}>
        {brand}
      </span>
    )
  }

  return (
    <Link
      href={href}
      aria-label={accessibleLabel}
      className={cn(
        "group inline-flex shrink-0 rounded-md outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-orange-500/40"
      )}
    >
      {brand}
    </Link>
  )
}
