"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardList,
  CalendarCheck,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  { label: "Séances", href: "/dashboard/sessions", icon: CalendarCheck, section: "sessions" },
  { label: "Programmes", href: "/dashboard/programs", icon: ClipboardList, section: "programs" },
  { label: "Exercices", href: "/dashboard/exercises", icon: Dumbbell, section: "exercises" },
  { label: "Paramètres", href: "/dashboard/settings", icon: Settings, section: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex h-screen w-60 flex-col border-r border-zinc-200 bg-white">
      <div className="flex h-14 items-center gap-2 border-b border-zinc-200 px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-xs font-bold text-white">
          CT
        </div>
        <span className="text-base font-bold tracking-tight text-zinc-900">
          CoachTrack
        </span>
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
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? accent.icon : "text-zinc-400 group-hover:text-zinc-600"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-4">
        <UserButton showName />
      </div>
    </aside>
  );
}
