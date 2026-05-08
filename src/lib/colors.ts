// Section accents — one Tailwind palette per major area.
// Use the static class name strings (Tailwind needs to see them at compile time).

export type Section = "dashboard" | "clients" | "sessions" | "programs" | "exercises" | "settings"

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
    activeBg: "bg-indigo-50",
    activeText: "text-indigo-700",
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
    activeBg: "bg-blue-50",
    activeText: "text-blue-700",
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
    activeBg: "bg-emerald-50",
    activeText: "text-emerald-700",
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
    activeBg: "bg-violet-50",
    activeText: "text-violet-700",
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
    activeBg: "bg-amber-50",
    activeText: "text-amber-800",
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
    activeBg: "bg-zinc-100",
    activeText: "text-zinc-900",
    hex: "#52525b",
  },
}

// 8 deterministic avatar palettes — chosen to be readable on light bg.
// Pre-listed Tailwind classes so they survive purge.
const AVATAR_PALETTE = [
  { bg: "bg-rose-100", text: "text-rose-700", ring: "ring-rose-200" },
  { bg: "bg-orange-100", text: "text-orange-700", ring: "ring-orange-200" },
  { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-200" },
  { bg: "bg-emerald-100", text: "text-emerald-700", ring: "ring-emerald-200" },
  { bg: "bg-teal-100", text: "text-teal-700", ring: "ring-teal-200" },
  { bg: "bg-sky-100", text: "text-sky-700", ring: "ring-sky-200" },
  { bg: "bg-indigo-100", text: "text-indigo-700", ring: "ring-indigo-200" },
  { bg: "bg-fuchsia-100", text: "text-fuchsia-700", ring: "ring-fuchsia-200" },
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
