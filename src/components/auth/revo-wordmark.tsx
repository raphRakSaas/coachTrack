import Link from "next/link"
import { cn } from "@/lib/utils"

type RevoWordmarkProps = {
  /** Texte foncé (sidebar, fond clair) ou clair (panneau auth sur photo). */
  tone?: "light" | "dark"
  size?: "sm" | "md" | "lg"
  className?: string
  href?: string | null
}

const sizeClass = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
}

export function RevoWordmark({
  tone = "light",
  size = "md",
  className,
  href = "/",
}: RevoWordmarkProps) {
  const label = (
    <>
      <span
        className={cn(
          "font-[family-name:var(--font-display)] font-bold tracking-tight",
          sizeClass[size],
          tone === "dark" ? "text-white" : "text-zinc-900",
          className
        )}
      >
        Revo
      </span>
      <span
        className={cn(
          "shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500",
          size === "sm" && "h-1.5 w-1.5",
          size === "md" && "h-2 w-2",
          size === "lg" && "h-2 w-2"
        )}
        aria-hidden
      />
    </>
  )

  const wrapClass = "flex items-center gap-1.5"

  if (href === null) {
    return <div className={wrapClass}>{label}</div>
  }

  return (
    <Link
      href={href}
      className={cn(
        wrapClass,
        "rounded-md outline-none focus-visible:ring-2",
        tone === "dark"
          ? "focus-visible:ring-white/40"
          : "focus-visible:ring-indigo-500/40"
      )}
    >
      {label}
    </Link>
  )
}
