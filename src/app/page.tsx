import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Users, Dumbbell, BarChart3, CalendarDays,
  Check, Star, TrendingUp, Target, Trophy, Clock
} from "lucide-react";
import { Nav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { GlassStatCard } from "@/components/marketing/glass-stat-card";
import { AnimateIn, StaggerChildren, StaggerItem } from "@/components/marketing/animate-in";

// ── Accent line ────────────────────────────────────────────────────────────
function AccentLine() {
  return <div className="mb-8 h-0.5 w-10" style={{ background: "#ea580c" }} />;
}

// ── Section label ──────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "#ea580c" }}>
      {children}
    </p>
  );
}

// ── Testimonial card ───────────────────────────────────────────────────────
function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="flex flex-col gap-5 border-t-2 pt-8" style={{ borderColor: "#ea580c" }}>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
        ))}
      </div>
      <p className="text-base leading-relaxed text-slate-600 flex-1">&ldquo;{quote}&rdquo;</p>
      <div>
        <p className="text-sm font-bold text-slate-900">{author}</p>
        <p className="text-xs text-slate-400 mt-0.5">{role}</p>
      </div>
    </div>
  );
}

// ── Dashboard Mockup ───────────────────────────────────────────────────────
function DashboardMockup() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60">
      <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
        <span className="mx-auto text-xs text-slate-400">app.revo.coach</span>
      </div>
      <div className="flex h-72 sm:h-80">
        <div className="w-44 shrink-0 bg-slate-900 p-3">
          <div className="mb-5 flex items-center gap-2 px-2 pt-1">
            <div className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, #ea580c, #c2410c)" }}>R</div>
            <span className="text-sm font-bold text-white">Revo</span>
          </div>
          {[
            { label: "Tableau de bord", active: false },
            { label: "Clients", active: true },
            { label: "Séances", active: false },
            { label: "Programmes", active: false },
            { label: "Exercices", active: false },
          ].map(({ label, active }) => (
            <div key={label}
              className={`mb-0.5 flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium ${
                active ? "bg-orange-500/20 text-orange-300" : "text-slate-500"
              }`}>
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? "bg-orange-400" : "bg-slate-700"}`} />
              {label}
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-hidden p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-900">Clients actifs</h3>
            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-600">5 clients</span>
          </div>
          <div className="space-y-2">
            {[
              { name: "Marc D.", goal: "Prise de masse", sessions: "18 séances", active: true },
              { name: "Sophie M.", goal: "Perte de poids", sessions: "11 séances", active: true },
              { name: "Thomas L.", goal: "Force", sessions: "24 séances", active: false },
              { name: "Léa P.", goal: "Endurance", sessions: "7 séances", active: true },
            ].map(({ name, goal, sessions, active }) => (
              <div key={name} className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                  {name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-900">{name}</p>
                  <p className="truncate text-xs text-slate-400">{goal} · {sessions}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                }`}>
                  {active ? "Actif" : "Inactif"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
      <section className="relative min-h-screen overflow-hidden">
        <div className="grid min-h-screen lg:grid-cols-2">

          {/* Left — texte */}
          <div className="relative z-10 flex flex-col justify-center px-8 pb-16 pt-32 sm:px-12 lg:px-16">
            <AnimateIn>
              <AccentLine />
              <Label>La plateforme pour coachs sportifs</Label>

              <h1
                className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.92] tracking-[-0.03em] text-slate-900"
                style={{ fontSize: "clamp(3rem, 7.5vw, 6.5rem)" }}
              >
                Gérez.<br />
                Suivez.<br />
                <span style={{ color: "#ea580c" }}>Scalez.</span>
              </h1>

              <p className="mt-8 max-w-md text-lg leading-relaxed text-slate-500">
                Revo centralise vos clients, séances et programmes dans une seule interface pensée pour les coachs de terrain.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/sign-up"
                  className="inline-flex h-12 items-center gap-2 rounded-xl px-7 text-sm font-bold uppercase tracking-wide text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #ea580c, #c2410c)", boxShadow: "0 4px 20px rgba(234,88,12,0.35)" }}
                >
                  Commencer gratuitement
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/fonctionnalites"
                  className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 px-7 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Voir les fonctionnalités
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />Gratuit pour démarrer</span>
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />Sans carte bancaire</span>
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />14j Pro offerts</span>
              </div>
            </AnimateIn>
          </div>

          {/* Right — photo + mascot */}
          <AnimateIn delay={0.1} direction="right" className="relative hidden lg:block">
            {/* Photo background */}
            <div className="absolute inset-0">
              <Image
                src="/hero-bg.jpg"
                alt=""
                fill
                className="object-cover object-center"
                priority
              />
              {/* White gradient overlay on left edge */}
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0.2) 35%, rgba(255,255,255,0) 60%)" }} />
              {/* Subtle orange tint */}
              <div className="absolute inset-0 opacity-10"
                style={{ background: "linear-gradient(135deg, rgba(234,88,12,0.3) 0%, transparent 60%)" }} />
            </div>

            {/* Mascot + glass cards */}
            <div className="relative z-10 flex h-full items-center justify-center">
              <div className="relative revo-float">
                {/* <Image
                  src="/revo-mascot-coach.png"
                  alt="Revo mascotte"
                  width={340}
                  height={400}
                  className="w-64 xl:w-[340px] drop-shadow-xl"
                  priority
                /> */}
              </div>

              <GlassStatCard className="absolute -left-4 top-1/4 w-44" straddle="left" rotateDeg={-3}>
                <p className="revo-glass-label mb-1">Clients suivis</p>
                <p className="revo-glass-value text-2xl">12</p>
                <p className="revo-glass-sub mt-0.5 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-500" /> +3 ce mois
                </p>
              </GlassStatCard>

              <GlassStatCard className="absolute right-8 top-1/3 w-44" rotateDeg={3}>
                <p className="revo-glass-label mb-1">Séances ce mois</p>
                <p className="revo-glass-value text-2xl">48</p>
                <p className="revo-glass-sub mt-0.5">vs 41 le mois dernier</p>
              </GlassStatCard>

              <GlassStatCard className="absolute bottom-24 left-0 w-48" rotateDeg={-2}>
                <p className="revo-glass-label mb-1">Dernier PR · Marc D.</p>
                <p className="revo-glass-value-neutral text-sm font-bold">🏆 Squat 100 kg</p>
                <p className="revo-glass-sub mt-0.5">Record personnel !</p>
              </GlassStatCard>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── STATS GÉANTES ────────────────────────────────────────────────── */}
      <section className="border-y border-slate-200">
        <StaggerChildren className="mx-auto grid max-w-5xl grid-cols-3 divide-x divide-slate-200">
          {[
            { value: "500+", label: "exercices", sub: "dans la bibliothèque" },
            { value: "0 €", label: "pour démarrer", sub: "plan gratuit illimité" },
            { value: "14 j", label: "d'essai Pro", sub: "sans carte bancaire" },
          ].map(({ value, label, sub }) => (
            <StaggerItem key={value}>
              <div className="flex flex-col items-center gap-1 py-12 text-center">
                <span
                  className="font-[family-name:var(--font-display)] font-bold leading-none tracking-tight"
                  style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#ea580c" }}
                >
                  {value}
                </span>
                <span className="mt-2 text-sm font-semibold text-slate-900">{label}</span>
                <span className="text-xs text-slate-400">{sub}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* ── FEATURES — 3 grandes cartes ────────────────────────────────── */}
      <section className="px-8 py-32 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <AnimateIn className="mb-16">
            <AccentLine />
            <Label>Fonctionnalités</Label>
            <h2
              className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.95] tracking-[-0.025em] text-slate-900"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
            >
              Tout ce dont<br />un coach a besoin.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-500">
              Pas de fonctionnalités inutiles. Revo est taillé pour les coachs de terrain qui veulent aller vite.
            </p>
          </AnimateIn>

          <StaggerChildren className="grid grid-cols-1 gap-px bg-slate-200 md:grid-cols-3">
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
                <div className="group flex flex-col gap-6 bg-white p-8 transition-colors hover:bg-slate-50 h-full">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 transition-colors group-hover:bg-orange-100">
                      <Icon className="h-6 w-6" style={{ color: "#ea580c" }} />
                    </div>
                    <span className="font-[family-name:var(--font-display)] text-4xl font-bold text-slate-100 transition-colors group-hover:text-slate-200">
                      {number}
                    </span>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
                    <p className="text-sm leading-relaxed text-slate-500">{description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          <AnimateIn delay={0.2} className="mt-8">
            <Link href="/fonctionnalites"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors"
              style={{ color: "#ea580c" }}>
              Toutes les fonctionnalités <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ────────────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-slate-50 px-8 py-32 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <AnimateIn className="mb-16">
            <AccentLine />
            <Label>Démarrage</Label>
            <h2
              className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.95] tracking-[-0.025em] text-slate-900"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
            >
              Opérationnel<br />en 2 minutes.
            </h2>
          </AnimateIn>

          <StaggerChildren className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              { number: "01", title: "Créez votre compte", description: "Inscription en 30 secondes avec email ou Google. Aucune carte bancaire requise pour le plan gratuit." },
              { number: "02", title: "Ajoutez vos clients", description: "Créez le profil de votre premier client : objectifs, niveau, notes. Tout est centralisé." },
              { number: "03", title: "Coachez et suivez", description: "Enregistrez les séances, créez des programmes. La progression se suit automatiquement." },
            ].map(({ number, title, description }) => (
              <StaggerItem key={number}>
                <div>
                  <div
                    className="mb-5 font-[family-name:var(--font-display)] text-6xl font-bold leading-none"
                    style={{ color: "#ea580c" }}
                  >
                    {number}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ── INTERFACE — dashboard mockup ─────────────────────────────────── */}
      <section className="px-8 py-32 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <AnimateIn className="mb-12">
            <AccentLine />
            <Label>Interface</Label>
            <h2
              className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.95] tracking-[-0.025em] text-slate-900"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
            >
              Pensée pour<br />aller vite.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-500">
              Retrouvez n&apos;importe quel client, séance ou programme en quelques clics. Interface claire, zéro superflu.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <DashboardMockup />
          </AnimateIn>
        </div>
      </section>

      {/* ── DEEP-DIVE CLIENTS ────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-slate-50 px-8 py-32 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <AnimateIn>
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div>
                <AccentLine />
                <Label>Gestion clients</Label>
                <h2
                  className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.92] tracking-[-0.025em] text-slate-900"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
                >
                  Vos clients<br />au bout des doigts.
                </h2>
                <p className="mt-5 text-base leading-relaxed text-slate-500">
                  Un profil complet pour chaque client. Retrouvez n&apos;importe quelle information en quelques secondes.
                </p>
                <ul className="mt-8 space-y-3">
                  {[
                    "Profil complet avec objectifs et notes",
                    "Historique complet de toutes les séances",
                    "Alerte si un client ne s'est pas entraîné",
                    "Photos avant/après avec comparaison",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#ea580c" }} strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/fonctionnalites"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors"
                  style={{ color: "#ea580c" }}>
                  En savoir plus <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="flex justify-center">
                <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-300">Profil client</p>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600">M</div>
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
                      <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2">
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
      <section className="border-t border-slate-200 px-8 py-32 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <AnimateIn>
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div className="flex justify-center lg:order-1 order-2">
                <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-300">Séance · Lundi</p>
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
                      {pr && <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-600">🏆 PR</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:order-2 order-1">
                <AccentLine />
                <Label>Suivi de séances</Label>
                <h2
                  className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.92] tracking-[-0.025em] text-slate-900"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
                >
                  Une séance<br />en 2 minutes.
                </h2>
                <p className="mt-5 text-base leading-relaxed text-slate-500">
                  Interface pensée pour la vitesse. Saisissez tout pendant ou juste après la séance.
                </p>
                <ul className="mt-8 space-y-3">
                  {[
                    "Saisie rapide : exercice / séries / reps / poids",
                    "Suggestions basées sur la séance précédente",
                    "Détection automatique des records personnels",
                    "Chronomètre intégré pour les temps de repos",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#ea580c" }} strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/fonctionnalites"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors"
                  style={{ color: "#ea580c" }}>
                  En savoir plus <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ──────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-slate-50 px-8 py-32 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <AnimateIn className="mb-16">
            <AccentLine />
            <Label>Témoignages</Label>
            <h2
              className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.92] tracking-[-0.025em] text-slate-900"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
            >
              Ils coachent<br />avec Revo.
            </h2>
          </AnimateIn>

          <StaggerChildren className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              {
                quote: "Avant Revo, je perdais 30 minutes par séance à noter dans des spreadsheets. Maintenant tout est dans l'app. Révolutionnaire.",
                author: "Julien M.",
                role: "Personal trainer · Lyon",
              },
              {
                quote: "La bibliothèque d'exercices et les programmes assignables à plusieurs clients en même temps, c'est un gain de temps énorme.",
                author: "Camille R.",
                role: "Coach sportif · Paris",
              },
              {
                quote: "La détection automatique des records personnels a changé la relation avec mes clients. Ils adorent voir leurs progrès.",
                author: "Nicolas T.",
                role: "Personal trainer · Bordeaux",
              },
            ].map((t) => (
              <StaggerItem key={t.author}>
                <TestimonialCard {...t} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ── PRICING TEASER ───────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 px-8 py-32 sm:px-12">
        <div className="mx-auto max-w-5xl">
          <AnimateIn className="mb-16">
            <AccentLine />
            <Label>Tarifs</Label>
            <h2
              className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.92] tracking-[-0.025em] text-slate-900"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
            >
              Simple<br />et transparent.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-500">
              Démarrez gratuitement. Passez au Pro quand vous êtes prêt à scaler.
            </p>
          </AnimateIn>

          <StaggerChildren className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <StaggerItem>
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-8">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-300">Gratuit</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-display)] text-6xl font-bold leading-none text-slate-900">0€</span>
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
                <Link href="/sign-up"
                  className="mt-10 flex h-12 w-full items-center justify-center rounded-xl border border-slate-200 text-sm font-bold uppercase tracking-wide text-slate-700 transition-colors hover:bg-slate-50">
                  Créer mon compte
                </Link>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="relative h-full overflow-hidden rounded-2xl bg-slate-900 p-8 text-white">
                {/* Orange accent stripe top */}
                <div className="absolute inset-x-0 top-0 h-1" style={{ background: "linear-gradient(90deg, #ea580c, #f97316)" }} />
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-orange-400">Pro</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-display)] text-6xl font-bold leading-none">29€</span>
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
                <Link href="/sign-up"
                  className="mt-10 flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold uppercase tracking-wide text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #ea580c, #c2410c)", boxShadow: "0 4px 20px rgba(234,88,12,0.4)" }}>
                  Essayer Pro 14 jours — gratuit
                </Link>
                <p className="mt-3 text-center text-xs text-slate-500">Sans carte bancaire · Annulation à tout moment</p>
              </div>
            </StaggerItem>
          </StaggerChildren>

          <AnimateIn delay={0.2} className="mt-8">
            <Link href="/tarifs"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors"
              style={{ color: "#ea580c" }}>
              Voir la comparaison complète <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-slate-200 bg-slate-900 px-8 py-40 text-white sm:px-12">
        {/* Orange corner accent */}
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #ea580c 0%, transparent 70%)" }} />
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }} />

        <AnimateIn>
          <div className="relative z-10 mx-auto max-w-4xl">
            <div className="mb-8 flex items-center gap-3">
              <div className="h-0.5 w-10" style={{ background: "#ea580c" }} />
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-400">Rejoignez Revo</p>
            </div>
            <h2
              className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.92] tracking-[-0.03em]"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
              Prêt à coacher<br />
              <span style={{ color: "#ea580c" }}>autrement ?</span>
            </h2>
            <p className="mt-8 max-w-md text-lg text-slate-400">
              Créez votre compte en 30 secondes. Aucune carte bancaire. Aucun engagement.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/sign-up"
                className="inline-flex h-14 items-center gap-2 rounded-xl px-8 text-sm font-bold uppercase tracking-wide text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #ea580c, #c2410c)", boxShadow: "0 4px 24px rgba(234,88,12,0.4)" }}>
                Commencer gratuitement <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/tarifs"
                className="inline-flex h-14 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10">
                Voir les tarifs
              </Link>
            </div>

            {/* Mascot flottante */}
            <div className="absolute right-0 top-0 hidden opacity-40 lg:block">
              <Image src="/revo-mascot.png" alt="" width={240} height={280} className="w-48 xl:w-56 drop-shadow-2xl" />
            </div>
          </div>
        </AnimateIn>
      </section>

      <MarketingFooter variant="full" />
    </div>
  );
}
