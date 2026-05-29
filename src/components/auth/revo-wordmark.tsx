import { RevoLogo, type RevoLogoSize } from "@/components/brand/revo-logo"
import { cn } from "@/lib/utils"

type RevoWordmarkProps = {
  tone?: "light" | "dark"
  size?: "sm" | "md" | "lg"
  className?: string
  href?: string | null
}

const wordmarkToLogoSize: Record<NonNullable<RevoWordmarkProps["size"]>, RevoLogoSize> = {
  sm: "sm",
  md: "md",
  lg: "lg",
}

export function RevoWordmark({
  tone = "light",
  size = "md",
  className,
  href = "/",
}: RevoWordmarkProps) {
  return (
    <RevoLogo
      size={wordmarkToLogoSize[size]}
      href={href}
      showLabel
      tone={tone}
      className={cn(className)}
    />
  )
}
