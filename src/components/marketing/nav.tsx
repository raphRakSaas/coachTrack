"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

export function Nav() {
  const { isSignedIn } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-6 pt-4">
        <div
          className="flex h-14 items-center justify-between rounded-2xl border px-5"
          style={{
            background: "rgba(7,12,20,0.85)",
            borderColor: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <span
              className="text-lg font-[family-name:var(--font-display)] font-bold tracking-tight text-white"
            >
              Revo
            </span>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "#8b5cf6" }}
            />
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-7 md:flex">
            {[
              { href: "#fonctionnalites", label: "Fonctionnalités" },
              { href: "#comment", label: "Comment ça marche" },
              { href: "#tarifs", label: "Tarifs" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium transition-colors"
                style={{ color: "rgba(255,255,255,0.55)" }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.9)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.55)")
                }
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="inline-flex h-8 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold text-white transition-opacity hover:opacity-80"
                style={{ background: "#8b5cf6" }}
              >
                Tableau de bord
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="hidden text-sm font-medium transition-colors sm:block"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  Se connecter
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex h-8 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold text-white transition-opacity hover:opacity-80"
                  style={{ background: "#8b5cf6" }}
                >
                  Commencer gratuitement
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
