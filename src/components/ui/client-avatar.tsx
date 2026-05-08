import { cn } from "@/lib/utils"
import { avatarColor } from "@/lib/colors"

const SIZES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-2xl",
}

export function ClientAvatar({
  firstName,
  lastName,
  size = "md",
  className,
  ring = false,
}: {
  firstName: string
  lastName: string
  size?: keyof typeof SIZES
  className?: string
  ring?: boolean
}) {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()
  const palette = avatarColor(`${firstName}${lastName}`)

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        palette.bg,
        palette.text,
        ring && cn("ring-2", palette.ring),
        SIZES[size],
        className
      )}
    >
      {initials}
    </div>
  )
}
