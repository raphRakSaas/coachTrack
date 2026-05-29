"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardList,
  CalendarCheck,
  Settings,
  UserSearch,
  CalendarDays,
  Activity,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RevoLogo } from "@/components/brand/revo-logo";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { SECTION_ACCENTS, type Section } from "@/lib/colors";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  section: Section;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, section: "dashboard" },
  { label: "Clients", href: "/dashboard/clients", icon: Users, section: "clients" },
  { label: "Prospects", href: "/dashboard/prospects", icon: UserSearch, section: "prospects" },
  { label: "Calendrier", href: "/dashboard/calendar", icon: CalendarDays, section: "calendar" },
  { label: "Séances", href: "/dashboard/sessions", icon: CalendarCheck, section: "sessions" },
  { label: "Programmes", href: "/dashboard/programs", icon: ClipboardList, section: "programs" },
  { label: "Suivi", href: "/dashboard/suivi", icon: Activity, section: "tracking" },
  { label: "Nutrition", href: "/dashboard/nutrition", icon: UtensilsCrossed, section: "nutrition" },
  { label: "Exercices", href: "/dashboard/exercises", icon: Dumbbell, section: "exercises" },
  { label: "Paramètres", href: "/dashboard/settings", icon: Settings, section: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const labelTone =
    mounted && resolvedTheme === "dark" ? "dark" : "light";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="hidden md:flex h-screen w-60 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center justify-between gap-2 border-b border-sidebar-border px-4">
        {mounted ? (
          <RevoLogo size="sm" href="/dashboard" showLabel tone={labelTone} />
        ) : (
          <span className="inline-block h-6 w-12" aria-hidden />
        )}
        <ThemeToggle />
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {navItems.map(({ label, href, icon: Icon, section }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);
          const accent = SECTION_ACCENTS[section];

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? cn(accent.activeBg, accent.activeText)
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  isActive
                    ? accent.icon
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <UserButton showName />
      </div>
    </aside>
  );
}
