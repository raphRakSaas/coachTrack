"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export function Nav() {
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-base font-bold text-zinc-900">
          CoachTrack
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#fonctionnalites"
            className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
          >
            Fonctionnalités
          </Link>
          <Link
            href="#comment"
            className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
          >
            Comment ça marche
          </Link>
          <Link
            href="#tarifs"
            className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
          >
            Tarifs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              Tableau de bord
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
              >
                Se connecter
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex h-9 items-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
              >
                Commencer gratuitement
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
