"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className="shrink-0 text-muted-foreground hover:text-foreground"
      disabled={!mounted}
      aria-hidden={!mounted}
      aria-label={
        mounted
          ? isDark
            ? "Passer en mode clair"
            : "Passer en mode sombre"
          : undefined
      }
      title={mounted ? (isDark ? "Mode clair" : "Mode sombre") : undefined}
      onClick={() => {
        if (mounted) setTheme(isDark ? "light" : "dark")
      }}
    >
      {!mounted ? (
        <Moon className="h-4 w-4 opacity-0" aria-hidden />
      ) : isDark ? (
        <Sun className="h-4 w-4" aria-hidden />
      ) : (
        <Moon className="h-4 w-4" aria-hidden />
      )}
    </Button>
  )
}
