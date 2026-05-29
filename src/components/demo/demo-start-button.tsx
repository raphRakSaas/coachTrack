"use client"

import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type DemoStartButtonProps = {
  className?: string
  size?: "default" | "large"
}

export function DemoStartButton({ className, size = "default" }: DemoStartButtonProps) {
  const isLarge = size === "large"

  return (
    <Link
      href="/demo/launch"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]",
        isLarge ? "h-14 px-8 text-base sm:text-lg" : "h-12 px-7 text-sm",
        className,
      )}
      style={{
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        boxShadow: "0 8px 28px rgba(15,23,42,0.22)",
      }}
    >
      <Play className="h-5 w-5 fill-current" aria-hidden />
      {isLarge ? "Lancer la démo interactive" : "Voir la démo"}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </Link>
  )
}
