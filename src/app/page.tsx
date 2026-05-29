import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Users, Dumbbell, BarChart3,
  Check, Clock, Sparkles,
} from "lucide-react";
import { Nav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { AppScreenshotsCarousel } from "@/components/marketing/app-screenshots-carousel";
import { GlassStatCard } from "@/components/marketing/glass-stat-card";
import { AnimateIn, StaggerChildren, StaggerItem } from "@/components/marketing/animate-in";

// ── Section chip (tag orange discret) ──────────────────────────────────────
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
      {children}
    </span>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <Nav />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Halo léger : sans blur CSS, juste un gradient — zéro coût GPU */}
        <div
          className="pointer-events-none absolute -top-32 right-0 h-[34rem] w-[34rem] rounded-full opacity-40 hidden sm:block"
          style={{ background: "radial-gradient(circle, rgba(251,146,60,0.22) 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-28 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 lg:pt-36">
          <AnimateIn>
            <Chip>La plateforme pour coachs sportifs</Chip>

            <h1
              className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.92] tracking-[-0.03em] text-slate-900"
              style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)" }}
            >
              Gérez.<br />
              Suivez.<br />
              <span style={{ color: "#ea580c" }}>Performez.</span>
            </h1>

            <p className="mt-7 max-w-md text-lg leading-relaxed text-slate-600">
              Revo centralise vos clients, séances et programmes dans une seule interface pensée pour les coachs de terrain.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/sign-up"
                className="inline-flex h-12 items-center gap-2 rounded-xl px-7 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #ea580c, #c2410c)", boxShadow: "0 6px 24px rgba(234,88,12,0.32)" }}
              >
                Commencer gratuitement
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/fonctionnalites"
                className="inline-flex h-12 items-center gap-1.5 px-2 text-sm font-semibold text-slate-700 transition-colors hover:text-orange-600"
              >
                Voir les fonctionnalités <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />Gratuit pour démarrer</span>
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />Sans carte bancaire</span>
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />14 j Pro offerts</span>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.1} direction="right" className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Photo terrain — coach / cliente */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-orange-900/10 ring-1 ring-black/5">
                <Image
                  src="/hero-bg.jpg"
                  alt="Coach sportif accompagnant une cliente en séance"
                  width={1024}
                  height={683}
                  className="h-[24rem] w-full object-cover sm:h-[28rem]"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent" />
              </div>

              {/* Cards vitrées flottantes */}
              <GlassStatCard className="absolute -left-3 top-8 w-40 sm:-left-6" rotateDeg={-4}>
                <p className="revo-glass-label">Bibliothèque</p>
                <p className="revo-glass-value text-2xl">76</p>
                <p className="revo-glass-sub">exercices illustrés</p>
              </GlassStatCard>

              <GlassStatCard className="absolute -right-3 top-24 w-44 sm:-right-7" rotateDeg={3}>
                <p className="revo-glass-label">Nouveau record</p>
                <p className="revo-glass-value-neutral text-base">Squat 100 kg 🏆</p>
                <p className="revo-glass-sub">détecté automatiquement</p>
              </GlassStatCard>

              <GlassStatCard className="absolute -bottom-5 left-6 w-48" rotateDeg={-2}>
                <p className="revo-glass-label">Séance enregistrée</p>
                <p className="revo-glass-value-neutral text-base">en moins de 2 min</p>
                <p className="revo-glass-sub">pendant ou après l'entraînement</p>
              </GlassStatCard>

              {/* Mascotte — clin d'œil de marque */}
              <Image
                src="/revo-mascot-coach.png"
                alt=""
                width={160}
                height={160}
                className="revo-float absolute -bottom-8 -right-4 w-24 drop-shadow-2xl sm:w-28"
              />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── APERÇU APP — carousel de vrais écrans ────────────────────────── */}
      <section className="overflow-hidden border-t border-slate-200 py-20">
        <div className="mx-auto mb-12 max-w-6xl px-6 sm:px-12">
          <AnimateIn>
            <Chip>
              <Sparkles className="h-3 w-3" /> Aperçu de l&apos;app
            </Chip>
            <h2
              className="font-[family-name:var(--font-display)] font-bold leading-tight tracking-tight text-slate-900"
              style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
            >
              De vraies captures, pas des promesses.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-500">
              Voici l&apos;application telle qu&apos;elle est aujourd&apos;hui. Le défilement est automatique — utilisez les flèches ou faites glisser pour prendre la main.
            </p>
          </AnimateIn>
        </div>
        <AnimateIn delay={0.1}>
          <AppScreenshotsCarousel />
        </AnimateIn>
      </section>

      {/* ── STATS BARRE ──────────────────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-slate-50">
        <StaggerChildren className="mx-auto grid max-w-5xl grid-cols-3 divide-x divide-slate-200">
          {[
            { value: "76", label: "exercices", sub: "catalogue illustré inclus" },
            { value: "0 €", label: "pour démarrer", sub: "plan gratuit sans limite de durée" },
            { value: "14 j", label: "d'essai Pro", sub: "sans carte bancaire" },
          ].map(({ value, label, sub }) => (
            <StaggerItem key={value}>
              <div className="flex flex-col items-center gap-1 py-10 text-center">
                <span
                  className="font-[family-name:var(--font-display)] pb-1 font-bold leading-[1.08] tracking-tight"
                  style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "#ea580c" }}
                >
                  {value}
                </span>
                <span className="mt-2 text-sm font-semibold text-slate-800">{label}</span>
                <span className="text-xs text-slate-400">{sub}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* ── FONCTIONNALITÉS — 3 cartes ────────────────────────────────────── */}
      <section className="px-6 py-24 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <AnimateIn className="mb-14">
            <Chip>Fonctionnalités</Chip>
            <h2
              className="font-[family-name:var(--font-display)] font-bold leading-tight tracking-tight text-slate-900"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              Tout ce qu&apos;un coach<br className="hidden sm:block" /> a vraiment besoin.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-500">
              Pas de fonctionnalités gadgets. Revo est taillé pour les coachs de terrain qui veulent aller vite.
            </p>
          </AnimateIn>

          <StaggerChildren className="grid grid-cols-1 gap-px bg-slate-100 md:grid-cols-3">
            {[
              {
                icon: Users,
                number: "01",
                title: "Gestion clients",
                description: "Profil complet, historique de séances, objectifs, notes et photos de progression. Retrouvez tout en 2 secondes.",
              },
              {
                icon: Dumbbell,
                number: "02",
                title: "Séances & Programmes",
                description: "Saisie rapide pendant la séance. Programmes structurés assignables à plusieurs clients en un clic.",
              },
              {
                icon: BarChart3,
                number: "03",
                title: "Stats & Records",
                description: "Courbes de progression, records personnels automatiques, volume hebdo. Des preuves concrètes pour fidéliser.",
              },
            ].map(({ icon: Icon, number, title, description }) => (
              <StaggerItem key={title}>
                <div className="group flex h-full flex-col gap-6 bg-white p-8 transition-colors hover:bg-slate-50">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 transition-colors group-hover:bg-orange-100">
                      <Icon className="h-5 w-5" style={{ color: "#ea580c" }} />
                    </div>
                    <span className="font-[family-name:var(--font-display)] text-4xl font-bold text-slate-100 transition-colors group-hover:text-slate-200">
                      {number}
                    </span>
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-bold text-slate-900">{title}</h3>
                    <p className="text-sm leading-relaxed text-slate-500">{description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          <AnimateIn delay={0.2} className="mt-7">
            <Link
              href="/fonctionnalites"
              className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700"
            >
              Toutes les fonctionnalités <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ─────────────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-slate-50 px-6 py-24 sm:px-12">
        <div className="mx-auto max-w-4xl">
          <AnimateIn className="mb-14 text-center">
            <Chip>Démarrage rapide</Chip>
            <h2
              className="font-[family-name:var(--font-display)] font-bold leading-tight tracking-tight text-slate-900"
              style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
            >
              Opérationnel en 2 minutes.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-slate-500">
              Pas besoin d&apos;onboarding compliqué. Trois étapes et vous coachez.
            </p>
          </AnimateIn>

          <StaggerChildren className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Créez votre compte",
                description: "Inscription en 30 secondes avec email ou Google. Aucune carte bancaire pour le plan gratuit.",
                accent: "bg-orange-500",
              },
              {
                step: "2",
                title: "Ajoutez vos clients",
                description: "Créez le profil de votre premier client : objectifs, niveau, notes. Tout est centralisé.",
                accent: "bg-orange-400",
              },
              {
                step: "3",
                title: "Coachez et suivez",
                description: "Enregistrez les séances, créez des programmes. La progression se suit automatiquement.",
                accent: "bg-orange-300",
              },
            ].map(({ step, title, description, accent }) => (
              <StaggerItem key={step}>
                <div className="relative flex flex-col gap-4 rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-100">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-white ${accent}`}>
                    {step}
                  </span>
                  <div>
                    <h3 className="mb-1.5 text-base font-bold text-slate-900">{title}</h3>
                    <p className="text-sm leading-relaxed text-slate-500">{description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          <AnimateIn delay={0.3} className="mt-10 text-center">
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #ea580c, #c2410c)" }}
            >
              Créer mon compte gratuitement <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* ── DEEP-DIVE CLIENTS ────────────────────────────────────────────── */}
      <section className="px-6 py-24 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <AnimateIn>
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <div>
                <Chip>Gestion clients</Chip>
                <h2
                  className="font-[family-name:var(--font-display)] font-bold leading-tight tracking-tight text-slate-900"
                  style={{ fontSize: "clamp(1.875rem, 3.5vw, 3rem)" }}
                >
                  Tous vos clients,<br /> organisés en un clin d&apos;œil.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-500">
                  Un profil complet pour chaque client. Retrouvez n&apos;importe quelle information en quelques secondes.
                </p>
                <ul className="mt-7 space-y-3">
                  {[
                    "Profil complet avec objectifs et notes",
                    "Historique complet de toutes les séances",
                    "Alerte si un client ne s'est pas entraîné",
                    "Photos avant/après avec comparaison",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/fonctionnalites"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700"
                >
                  En savoir plus <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="flex justify-center">
                <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-slate-300">Profil client</p>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-base font-bold text-orange-600">M</div>
                    <div>
                      <p className="font-semibold text-slate-900">Marc Dupont</p>
                      <p className="text-xs text-slate-400">Client depuis 4 mois · 18 séances</p>
                    </div>
                    <span className="ml-auto rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">Actif</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Objectif", value: "Prise de masse" },
                      { label: "Programme", value: "Push / Pull / Legs" },
                      { label: "Dernier PR", value: "Squat 100 kg 🏆" },
                      { label: "Prochaine séance", value: "Demain 9h00" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5">
                        <span className="text-xs text-slate-400">{label}</span>
                        <span className="text-xs font-semibold text-slate-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── DEEP-DIVE SÉANCES ────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-slate-50 px-6 py-24 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <AnimateIn>
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <div className="order-2 flex justify-center lg:order-1">
                <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-300">Séance · Lundi</p>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" /> 1h12
                    </span>
                  </div>
                  {[
                    { exercise: "Squat", sets: "4×8", weight: "80 kg", pr: true },
                    { exercise: "Leg Press", sets: "3×12", weight: "160 kg", pr: false },
                    { exercise: "Fentes avant", sets: "3×10", weight: "20 kg", pr: false },
                    { exercise: "Extensions", sets: "3×15", weight: "50 kg", pr: false },
                  ].map(({ exercise, sets, weight, pr }) => (
                    <div key={exercise} className="mb-2 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{exercise}</p>
                        <p className="text-xs text-slate-400">{sets} · {weight}</p>
                      </div>
                      {pr && (
                        <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-600">
                          🏆 PR
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <Chip>Suivi de séances</Chip>
                <h2
                  className="font-[family-name:var(--font-display)] font-bold leading-tight tracking-tight text-slate-900"
                  style={{ fontSize: "clamp(1.875rem, 3.5vw, 3rem)" }}
                >
                  Une séance enregistrée<br /> en moins de 2 minutes.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-500">
                  Interface pensée pour la vitesse. Saisissez tout pendant ou juste après la séance.
                </p>
                <ul className="mt-7 space-y-3">
                  {[
                    "Saisie rapide : exercice / séries / reps / poids",
                    "Suggestions basées sur la séance précédente",
                    "Détection automatique des records personnels",
                    "Chronomètre intégré pour les temps de repos",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/fonctionnalites"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700"
                >
                  En savoir plus <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── ACCÈS ANTICIPÉ ───────────────────────────────────────────────── */}
      <section className="px-6 py-24 sm:px-12">
        <div className="mx-auto max-w-5xl">
          <AnimateIn>
            <div className="relative overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-8 sm:p-12">
              <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <Chip>
                    <Sparkles className="h-3 w-3" /> Accès anticipé
                  </Chip>
                  <h2
                    className="font-[family-name:var(--font-display)] font-bold leading-tight tracking-tight text-slate-900"
                    style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}
                  >
                    Construit avec des coachs, pour des coachs.
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
                    Revo est en accès anticipé. Plutôt que d&apos;afficher de faux avis, on préfère
                    vous montrer le produit réel et avancer avec vos retours. Rejoignez les
                    premiers coachs et façonnez l&apos;outil avec nous.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-4">
                    <Link
                      href="/sign-up"
                      className="inline-flex h-12 items-center gap-2 rounded-xl px-7 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                      style={{ background: "linear-gradient(135deg, #ea580c, #c2410c)", boxShadow: "0 6px 24px rgba(234,88,12,0.28)" }}
                    >
                      Rejoindre l&apos;accès anticipé <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="flex justify-center lg:justify-end">
                  <Image
                    src="/revo-mascot-celebrate.png"
                    alt="Mascotte Revo"
                    width={260}
                    height={300}
                    className="revo-float w-44 drop-shadow-2xl sm:w-56"
                  />
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── TARIFS ───────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-slate-50 px-6 py-24 sm:px-12">
        <div className="mx-auto max-w-4xl">
          <AnimateIn className="mb-14">
            <Chip>Tarifs</Chip>
            <h2
              className="font-[family-name:var(--font-display)] font-bold leading-tight tracking-tight text-slate-900"
              style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
            >
              Simple et transparent.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-slate-500">
              Démarrez gratuitement. Passez au Pro quand votre activité grandit.
            </p>
          </AnimateIn>

          <StaggerChildren className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <StaggerItem>
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-8">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Gratuit</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-display)] text-5xl font-bold leading-none text-slate-900">0 €</span>
                  <span className="text-sm text-slate-400">/ mois</span>
                </div>
                <p className="mt-3 text-sm text-slate-500">Pour découvrir Revo sans risque.</p>
                <ul className="mt-8 space-y-3">
                  {["Jusqu'à 5 clients", "Séances illimitées", "Bibliothèque d'exercices", "3 programmes max"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-slate-600">
                      <Check className="h-4 w-4 shrink-0 text-slate-300" strokeWidth={2.5} /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className="mt-10 flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Créer mon compte
                </Link>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="relative h-full overflow-hidden rounded-2xl bg-slate-900 p-8 text-white">
                <div className="absolute inset-x-0 top-0 h-1" style={{ background: "linear-gradient(90deg, #ea580c, #f97316)" }} />
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-orange-400">Pro</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-display)] text-5xl font-bold leading-none">29 €</span>
                  <span className="text-sm text-slate-400">/ mois</span>
                </div>
                <p className="mt-3 text-sm text-slate-400">Pour les coachs qui vivent de leur activité.</p>
                <ul className="mt-8 space-y-3">
                  {["Clients illimités", "Programmes illimités", "Statistiques avancées", "Records personnels auto", "Export PDF", "Support prioritaire"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                      <Check className="h-4 w-4 shrink-0" style={{ color: "#f97316" }} strokeWidth={2.5} /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className="mt-10 flex h-11 w-full items-center justify-center rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #ea580c, #c2410c)", boxShadow: "0 4px 20px rgba(234,88,12,0.4)" }}
                >
                  Essayer Pro 14 jours — gratuit
                </Link>
                <p className="mt-3 text-center text-xs text-slate-500">Sans carte bancaire · Annulation à tout moment</p>
              </div>
            </StaggerItem>
          </StaggerChildren>

          <AnimateIn delay={0.2} className="mt-7">
            <Link
              href="/tarifs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700"
            >
              Voir la comparaison complète <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-slate-200 bg-slate-900 px-6 py-32 text-white sm:px-12">
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #ea580c 0%, transparent 70%)" }} />
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }} />

        <AnimateIn>
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-400">
              Rejoignez Revo
            </div>
            <h2
              className="font-[family-name:var(--font-display)] font-bold leading-tight tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              Prêt à coacher<br />
              <span style={{ color: "#ea580c" }}>autrement ?</span>
            </h2>
            <p className="mx-auto mt-6 max-w-md text-lg text-slate-400">
              Créez votre compte en 30 secondes. Aucune carte bancaire. Aucun engagement.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/sign-up"
                className="inline-flex h-13 items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #ea580c, #c2410c)", boxShadow: "0 4px 24px rgba(234,88,12,0.4)" }}
              >
                Commencer gratuitement <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/tarifs"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10"
              >
                Voir les tarifs
              </Link>
            </div>

            <div className="absolute right-0 top-0 hidden opacity-35 lg:block">
              <Image src="/revo-mascot.png" alt="" width={240} height={280} className="w-44 xl:w-52 drop-shadow-2xl" />
            </div>
          </div>
        </AnimateIn>
      </section>

      <MarketingFooter variant="full" />
    </div>
  );
}
