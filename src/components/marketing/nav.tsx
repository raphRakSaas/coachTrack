"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/marketing/theme-toggle";

const NAV_LINKS = [
  { href: "/fonctionnalites", label: "Fonctionnalités" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/blog", label: "Ressources" },
];

export function Nav() {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div
          className="flex h-14 items-center justify-between rounded-2xl border px-5 dark:bg-[rgba(7,12,20,0.88)] bg-[rgba(255,255,255,0.92)]"
          style={{
            borderColor: "var(--m-border)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <span className="text-lg font-[family-name:var(--font-display)] font-bold tracking-tight" style={{ color: "var(--m-text)" }}>
              Revo
            </span>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--m-accent)" }} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="text-sm font-medium transition-colors"
                  style={{
                    color: active ? "var(--m-accent)" : "var(--m-text-muted)",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold text-white transition-opacity hover:opacity-80"
                style={{ background: "linear-gradient(135deg, var(--m-accent), var(--m-accent-mid))" }}
              >
                Tableau de bord
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="hidden text-sm font-medium transition-colors lg:block"
                  style={{ color: "var(--m-text-muted)" }}
                >
                  Se connecter
                </Link>
                <Link
                  href="/sign-up"
                  className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold text-white transition-opacity hover:opacity-80"
                style={{ background: "linear-gradient(135deg, var(--m-accent), var(--m-accent-mid))" }}
              >
                Commencer
                <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className="flex h-8 w-8 items-center justify-center rounded-xl md:hidden dark:bg-white/5 bg-black/5"
              style={{ border: "1px solid var(--m-border)", color: "var(--m-text)" }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="mt-2 rounded-2xl border p-4 dark:bg-[rgba(7,12,20,0.95)] bg-white"
            style={{
              borderColor: "var(--m-border)",
              backdropFilter: "blur(18px)",
            }}
          >
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium transition-colors hover:bg-violet-500/10"
                  style={{ color: "var(--m-text-muted)" }}
                >
                  {label}
                </Link>
              ))}
              <div className="mt-2 border-t pt-3" style={{ borderColor: "var(--m-border)" }}>
                {isSignedIn ? (
                  <Link
                    href="/dashboard"
                    className="flex h-10 items-center justify-center rounded-xl text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, var(--m-accent), var(--m-accent-mid))" }}
                  >
                    Tableau de bord
                  </Link>
                ) : (
                  <Link
                    href="/sign-up"
                    className="flex h-10 items-center justify-center rounded-xl text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, var(--m-accent), var(--m-accent-mid))" }}
                  >
                    Commencer gratuitement
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
