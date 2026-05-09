// Section accents — one Tailwind palette per major area.
// Use the static class name strings (Tailwind needs to see them at compile time).

export type Section = "dashboard" | "clients" | "sessions" | "programs" | "exercises" | "settings" | "prospects" | "calendar"

export const SECTION_ACCENTS: Record<
  Section,
  {
    text: string
    textMuted: string
    bg: string
    bgSoft: string
    border: string
    ring: string
    icon: string
    badge: string
    activeBg: string
    activeText: string
    hex: string
  }
> = {
  dashboard: {
    text: "text-indigo-700",
    textMuted: "text-indigo-500",
    bg: "bg-indigo-600",
    bgSoft: "bg-indigo-50",
    border: "border-indigo-200",
    ring: "ring-indigo-500/30",
    icon: "text-indigo-600",
    badge: "bg-indigo-100 text-indigo-700",
    activeBg: "bg-indigo-50 dark:bg-indigo-950/50",
    activeText: "text-indigo-700 dark:text-indigo-300",
    hex: "#4f46e5",
  },
  clients: {
    text: "text-blue-700",
    textMuted: "text-blue-500",
    bg: "bg-blue-600",
    bgSoft: "bg-blue-50",
    border: "border-blue-200",
    ring: "ring-blue-500/30",
    icon: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
    activeBg: "bg-blue-50 dark:bg-blue-950/50",
    activeText: "text-blue-700 dark:text-blue-300",
    hex: "#2563eb",
  },
  sessions: {
    text: "text-emerald-700",
    textMuted: "text-emerald-500",
    bg: "bg-emerald-600",
    bgSoft: "bg-emerald-50",
    border: "border-emerald-200",
    ring: "ring-emerald-500/30",
    icon: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
    activeBg: "bg-emerald-50 dark:bg-emerald-950/50",
    activeText: "text-emerald-700 dark:text-emerald-300",
    hex: "#059669",
  },
  programs: {
    text: "text-violet-700",
    textMuted: "text-violet-500",
    bg: "bg-violet-600",
    bgSoft: "bg-violet-50",
    border: "border-violet-200",
    ring: "ring-violet-500/30",
    icon: "text-violet-600",
    badge: "bg-violet-100 text-violet-700",
    activeBg: "bg-violet-50 dark:bg-violet-950/50",
    activeText: "text-violet-700 dark:text-violet-300",
    hex: "#7c3aed",
  },
  exercises: {
    text: "text-amber-700",
    textMuted: "text-amber-600",
    bg: "bg-amber-500",
    bgSoft: "bg-amber-50",
    border: "border-amber-200",
    ring: "ring-amber-500/30",
    icon: "text-amber-600",
    badge: "bg-amber-100 text-amber-800",
    activeBg: "bg-amber-50 dark:bg-amber-950/50",
    activeText: "text-amber-800 dark:text-amber-200",
    hex: "#d97706",
  },
  settings: {
    text: "text-zinc-700",
    textMuted: "text-zinc-500",
    bg: "bg-zinc-700",
    bgSoft: "bg-zinc-100",
    border: "border-zinc-200",
    ring: "ring-zinc-400/30",
    icon: "text-zinc-700",
    badge: "bg-zinc-100 text-zinc-700",
    activeBg: "bg-zinc-100 dark:bg-zinc-800/80",
    activeText: "text-zinc-900 dark:text-zinc-100",
    hex: "#52525b",
  },
  prospects: {
    text: "text-orange-700",
    textMuted: "text-orange-500",
    bg: "bg-orange-500",
    bgSoft: "bg-orange-50",
    border: "border-orange-200",
    ring: "ring-orange-500/30",
    icon: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
    activeBg: "bg-orange-50 dark:bg-orange-950/50",
    activeText: "text-orange-700 dark:text-orange-300",
    hex: "#ea580c",
  },
  calendar: {
    text: "text-teal-700",
    textMuted: "text-teal-500",
    bg: "bg-teal-600",
    bgSoft: "bg-teal-50",
    border: "border-teal-200",
    ring: "ring-teal-500/30",
    icon: "text-teal-600",
    badge: "bg-teal-100 text-teal-700",
    activeBg: "bg-teal-50 dark:bg-teal-950/50",
    activeText: "text-teal-700 dark:text-teal-300",
    hex: "#0d9488",
  },
}

// 8 deterministic avatar palettes — chosen to be readable on light bg.
// Pre-listed Tailwind classes so they survive purge.
const AVATAR_PALETTE = [
  {
    bg: "bg-rose-100 dark:bg-rose-950/55",
    text: "text-rose-800 dark:text-rose-100",
    ring: "ring-rose-200 dark:ring-rose-800/60",
  },
  {
    bg: "bg-orange-100 dark:bg-orange-950/55",
    text: "text-orange-800 dark:text-orange-100",
    ring: "ring-orange-200 dark:ring-orange-800/60",
  },
  {
    bg: "bg-amber-100 dark:bg-amber-950/55",
    text: "text-amber-800 dark:text-amber-100",
    ring: "ring-amber-200 dark:ring-amber-800/60",
  },
  {
    bg: "bg-emerald-100 dark:bg-emerald-950/55",
    text: "text-emerald-800 dark:text-emerald-100",
    ring: "ring-emerald-200 dark:ring-emerald-800/60",
  },
  {
    bg: "bg-teal-100 dark:bg-teal-950/55",
    text: "text-teal-800 dark:text-teal-100",
    ring: "ring-teal-200 dark:ring-teal-800/60",
  },
  {
    bg: "bg-sky-100 dark:bg-sky-950/55",
    text: "text-sky-800 dark:text-sky-100",
    ring: "ring-sky-200 dark:ring-sky-800/60",
  },
  {
    bg: "bg-indigo-100 dark:bg-indigo-950/55",
    text: "text-indigo-800 dark:text-indigo-100",
    ring: "ring-indigo-200 dark:ring-indigo-800/60",
  },
  {
    bg: "bg-fuchsia-100 dark:bg-fuchsia-950/55",
    text: "text-fuchsia-800 dark:text-fuchsia-100",
    ring: "ring-fuchsia-200 dark:ring-fuchsia-800/60",
  },
]

function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export function avatarColor(seed: string) {
  return AVATAR_PALETTE[hash(seed) % AVATAR_PALETTE.length]
}
