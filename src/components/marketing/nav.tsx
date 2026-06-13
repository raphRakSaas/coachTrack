"use client";

import Link from "next/link";
import { RevoLogo } from "@/components/brand/revo-logo";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/fonctionnalites", label: "Fonctionnalités" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/blog", label: "Ressources" },
];

export function Nav() {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const navInner = navInnerRef.current;
    if (!navInner) return;

    let ticking = false;

    const updateScrolledState = () => {
      navInner.dataset.scrolled = window.scrollY > 12 ? "true" : "false";
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateScrolledState);
    };

    updateScrolledState();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div
          ref={navInnerRef}
          className="marketing-nav-inner flex h-14 items-center justify-between rounded-2xl px-5"
        >
          <RevoLogo href="/" size="md" showLabel priority />

          <nav className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="text-sm font-medium transition-colors hover:text-slate-900"
                  style={{ color: active ? "#ea580c" : "#64748b" }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="hidden h-9 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 sm:inline-flex"
                style={{
                  background: "linear-gradient(135deg, #ea580c, #c2410c)",
                  boxShadow: "0 2px 8px rgba(234,88,12,0.3)",
                }}
              >
                Tableau de bord
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/demo"
                  className="hidden text-sm font-semibold text-slate-700 transition-colors hover:text-orange-600 lg:block"
                >
                  Démo
                </Link>
                <Link
                  href="/sign-in"
                  className="hidden text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 lg:block"
                >
                  Se connecter
                </Link>
                <Link
                  href="/sign-up"
                  className="hidden h-9 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 sm:inline-flex"
                  style={{
                    background: "linear-gradient(135deg, #ea580c, #c2410c)",
                    boxShadow: "0 2px 8px rgba(234,88,12,0.3)",
                  }}
                >
                  Commencer
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}

            <button
              type="button"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 md:hidden"
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
                >
                  {label}
                </Link>
              ))}
              <div className="mt-2 space-y-2 border-t border-slate-100 pt-3">
                <Link
                  href="/demo"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 items-center justify-center rounded-xl border border-slate-900 bg-slate-900 text-sm font-semibold text-white"
                >
                  Voir la démo
                </Link>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 items-center justify-center rounded-xl border border-slate-200 text-sm font-medium text-slate-600"
                >
                  Se connecter
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 items-center justify-center rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #ea580c, #c2410c)" }}
                >
                  Commencer gratuitement
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
