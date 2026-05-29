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
  Menu,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RevoLogo } from "@/components/brand/revo-logo";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { SECTION_ACCENTS, type Section } from "@/lib/colors";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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

function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DashboardNavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {navItems.map(({ label, href, icon: Icon, section }) => {
        const isActive = isNavItemActive(pathname, href);
        const accent = SECTION_ACCENTS[section];

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? cn(accent.activeBg, accent.activeText)
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                isActive
                  ? accent.icon
                  : "text-muted-foreground group-hover:text-foreground",
              )}
            />
            {label}
          </Link>
        );
      })}
    </>
  );
}

export function MobileDashboardNav() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const labelTone = mounted && resolvedTheme === "dark" ? "dark" : "light";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-4 md:hidden">
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger
          render={
            <Button variant="outline" size="icon" aria-label="Ouvrir le menu">
              <Menu className="h-5 w-5" />
            </Button>
          }
        />
        <SheetContent side="left" className="w-[min(100vw-2rem,18rem)] gap-0 p-0">
          <SheetHeader className="border-b border-border">
            <SheetTitle className="sr-only">Navigation Revo</SheetTitle>
            {mounted ? (
              <RevoLogo size="sm" href="/dashboard" showLabel tone={labelTone} />
            ) : (
              <span className="inline-block h-6 w-12" aria-hidden />
            )}
          </SheetHeader>

          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
            <DashboardNavLinks
              pathname={pathname}
              onNavigate={() => setMenuOpen(false)}
            />
          </nav>

          <div className="mt-auto flex items-center justify-between border-t border-border p-4">
            <UserButton showName />
            <ThemeToggle />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 justify-center">
        {mounted ? (
          <RevoLogo size="sm" href="/dashboard" showLabel tone={labelTone} />
        ) : (
          <span className="inline-block h-6 w-12" aria-hidden />
        )}
      </div>

      <UserButton />
    </header>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const labelTone = mounted && resolvedTheme === "dark" ? "dark" : "light";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="hidden h-screen w-60 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-14 items-center justify-between gap-2 border-b border-sidebar-border px-4">
        {mounted ? (
          <RevoLogo size="sm" href="/dashboard" showLabel tone={labelTone} />
        ) : (
          <span className="inline-block h-6 w-12" aria-hidden />
        )}
        <ThemeToggle />
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        <DashboardNavLinks pathname={pathname} />
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <UserButton showName />
      </div>
    </aside>
  );
}
