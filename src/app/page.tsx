import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Star, ChevronRight } from "lucide-react";
import { Nav } from "@/components/marketing/nav";
import { GlassStatCard } from "@/components/marketing/glass-stat-card";
import { AnimateIn, StaggerChildren, StaggerItem } from "@/components/marketing/animate-in";

// ─── Highlight wrapper for editorial key words ────────────────────────────
function Accent({ children }: { children: React.ReactNode }) {
  return (
    <em
      className="not-italic font-[family-name:var(--font-display)]"
      style={{ color: "var(--m-accent)" }}
    >
      {children}
    </em>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--m-bg)", color: "var(--m-text)" }}>
      <Nav />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen overflow-x-hidden px-6 pt-32 pb-28">
        {/* Glow background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 left-0 h-[700px] w-[700px] rounded-full opacity-60"
            style={{ background: "radial-gradient(circle, var(--m-glow-primary) 0%, transparent 65%)", filter: "blur(70px)" }} />
          <div className="absolute top-1/2 right-0 h-[500px] w-[500px] rounded-full opacity-40"
            style={{ background: "radial-gradient(circle, var(--m-glow-secondary) 0%, transparent 70%)", filter: "blur(80px)" }} />
          <div className="revo-grain" aria-hidden />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid items-center gap-4 lg:grid-cols-[1fr_480px]">

            {/* Text column */}
            <div className="max-w-2xl">
              <p className="revo-fade-up max-w-md text-sm leading-snug" style={{ color: "var(--m-text-muted)" }}>
                <span className="font-semibold" style={{ color: "var(--m-accent)" }}>Revo</span>
                {" "}— pour les coachs qui veulent arrêter de jongler entre WhatsApp, Excel et le carnet.
              </p>

              <h1 className="revo-fade-up anim-delay-100 mt-6 font-[family-name:var(--font-display)] font-bold leading-[0.97] tracking-tight"
                style={{ fontSize: "clamp(3rem, 6.5vw, 5rem)" }}>
                Gérez moins.
                <br />
                <span style={{ color: "var(--m-accent)" }}>Coachez plus.</span>
                <br />
                <span style={{ color: "var(--m-text-muted)" }}>Fidélisez davantage.</span>
              </h1>

              <p className="revo-fade-up anim-delay-200 mt-7 max-w-lg text-[1.05rem] leading-[1.65]" style={{ color: "var(--m-text-muted)" }}>
                Un seul endroit pour vos clients, vos programmes et vos séances.
                Quand la progression est visible, les gens reviennent — point.
              </p>

              {/* CTAs */}
              <div className="revo-fade-up anim-delay-300 mt-9 flex flex-wrap items-center gap-4">
                <Link href="/sign-up"
                  className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, var(--m-accent), var(--m-accent-mid))", boxShadow: "0 8px 32px var(--m-glow-primary)" }}>
                  Créer mon compte coach
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/fonctionnalites"
                  className="inline-flex items-center gap-1.5 text-base font-medium transition-opacity hover:opacity-70"
                  style={{ color: "var(--m-text-muted)" }}>
                  Voir les fonctionnalités
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <p className="revo-fade-up anim-delay-400 mt-5 text-xs" style={{ color: "var(--m-text-faint)" }}>
                Gratuit pour commencer · Sans carte bancaire · Opérationnel en 2 min
              </p>

              {/* Stats mobile — sur desktop elles sont sur la mascotte */}
              <div className="revo-fade-up anim-delay-500 mt-10 flex flex-wrap gap-3 border-t pt-8 lg:hidden" style={{ borderColor: "var(--m-border)" }}>
                {[
                  { val: "+34%", sub: "vs chaos WhatsApp", label: "Rétention" },
                  { val: "30 min", sub: "/ semaine", label: "Temps gagné" },
                  { val: "320+", sub: "coachs", label: "Sur Revo" },
                ].map(({ val, sub, label }) => (
                  <div key={label} className="revo-glass min-w-[140px] flex-1 px-4 py-3">
                    <p className="revo-glass-label">{label}</p>
                    <p className="revo-glass-value text-2xl">{val}</p>
                    <p className="revo-glass-sub text-[11px]">{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mascotte + cartes vitrées superposées */}
            <div className="relative mx-auto hidden min-h-[480px] w-full max-w-[520px] lg:block">
              <Image
                src="/revo-mascot-green.png"
                alt="Revo mascotte"
                width={520}
                height={520}
                className="relative z-0 mx-auto object-contain revo-float revo-fade-in anim-delay-300 drop-shadow-[0_25px_60px_rgba(0,0,0,0.25)]"
                priority
              />
              <GlassStatCard
                className="absolute left-[13%] top-[10%] z-10 w-[min(235px,54%)]"
                straddle="left"
                rotateDeg={-2.5}
              >
                <p className="revo-glass-label">Rétention</p>
                <p className="revo-glass-value text-3xl">+34%</p>
                <p className="revo-glass-sub mt-0.5">vs suivi WhatsApp / carnet</p>
              </GlassStatCard>
              <GlassStatCard
                className="absolute right-[13%] top-[38%] z-10 w-[min(215px,50%)]"
                straddle="right"
                rotateDeg={3}
              >
                <p className="revo-glass-label">Admin</p>
                <p className="revo-glass-value text-3xl">30 min</p>
                <p className="revo-glass-sub mt-0.5">économisées par semaine</p>
              </GlassStatCard>
              <GlassStatCard
                className="absolute bottom-[12%] left-1/2 z-10 w-[min(260px,62%)]"
                straddle="bottom-center"
                rotateDeg={-1}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {["#059669", "#0d9488", "#6366f1"].map((hex) => (
                      <span key={hex} className="h-7 w-7 rounded-full border-2 border-white/90 shadow-sm dark:border-slate-700" style={{ background: hex }} />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[var(--revo-glass-muted)]">Coachs actifs</span>
                </div>
                <p className="revo-glass-value-neutral text-2xl">320+</p>
                <p className="revo-glass-sub">sur la plateforme</p>
              </GlassStatCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM — Editorial numbered list ────────────────────────────── */}
      <section className="px-6 py-24" style={{ borderTop: "1px solid var(--m-border)" }}>
        <div className="mx-auto max-w-5xl">
          <AnimateIn>
            <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "var(--m-accent)" }}>Le constat</p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl font-bold tracking-tight" style={{ color: "var(--m-text)" }}>
              Tu te reconnais<br />dans l&apos;un de ces scénarios ?
            </h2>
          </AnimateIn>

          <div className="mt-16 space-y-0">
            {[
              {
                num: "01",
                title: "Le suivi sur WhatsApp",
                desc: "Tes notes de séance sont éparpillées dans des conversations. Retrouver ce qu'a fait un client il y a trois semaines prend dix minutes.",
              },
              {
                num: "02",
                title: "Le tableau Excel ingérable",
                desc: "Illisible au cinquième client. Tu as arrêté de le mettre à jour. Et ton client ne voit toujours pas sa progression.",
              },
              {
                num: "03",
                title: "Le carnet papier",
                desc: "Pratique sur le moment, inutile à distance. Impossible de montrer une courbe de progression — ton client repart sans preuve de ses efforts.",
              },
            ].map(({ num, title, desc }) => (
              <AnimateIn key={num} direction="left">
                <div className="grid grid-cols-[80px_1fr] gap-8 border-b py-10 sm:grid-cols-[120px_1fr]"
                  style={{ borderColor: "var(--m-border)" }}>
                  <span className="font-[family-name:var(--font-display)] text-6xl font-bold leading-none sm:text-7xl"
                    style={{ color: "var(--m-text-faint)", opacity: 0.35 }}>
                    {num}
                  </span>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-xl font-bold" style={{ color: "var(--m-text)" }}>{title}</h3>
                    <p className="mt-2 max-w-2xl text-base leading-relaxed" style={{ color: "var(--m-text-muted)" }}>{desc}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* Conclusion punchy */}
          <AnimateIn delay={0.2} className="mt-14">
            <p className="max-w-3xl text-2xl font-semibold leading-relaxed" style={{ color: "var(--m-text)" }}>
              Quand un client ne <Accent>voit pas</Accent> ses progrès, il doute, il décroche, il annule.
              Pas parce que tu es un mauvais coach — parce qu&apos;il n&apos;a pas de preuves.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ── BREAK — Coaching mascot + Quote ────────────────────────────── */}
      <section className="overflow-x-hidden" style={{ background: "var(--m-bg-section)" }}>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimateIn direction="left">
              <div className="relative mx-auto max-w-[460px]">
                <Image
                  src="/revo-mascot-coach.png"
                  alt="Coach Revo"
                  width={460}
                  height={460}
                  className="relative z-0 mx-auto object-contain revo-float drop-shadow-2xl"
                />
                <GlassStatCard
                  className="absolute right-[11%] top-[11%] z-10 hidden w-[min(218px,54%)] sm:block"
                  straddle="right"
                  rotateDeg={2.5}
                >
                  <p className="revo-glass-label">Séances planifiées</p>
                  <p className="revo-glass-value text-2xl">127</p>
                  <p className="revo-glass-sub">cette semaine (exemple)</p>
                </GlassStatCard>
                <GlassStatCard
                  className="absolute left-[11%] bottom-[22%] z-10 hidden w-[min(225px,56%)] sm:block"
                  straddle="left"
                  rotateDeg={-2}
                >
                  <p className="revo-glass-label">Clients suivis</p>
                  <p className="revo-glass-value-neutral text-2xl">24</p>
                  <p className="revo-glass-sub">profils à jour</p>
                </GlassStatCard>
              </div>
            </AnimateIn>
            <AnimateIn direction="right">
              <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "var(--m-accent)" }}>La solution</p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight tracking-tight sm:text-5xl" style={{ color: "var(--m-text)" }}>
                Revo rend chaque progrès{" "}
                <Accent>visible</Accent>
                {" "}en temps réel.
              </h2>
              <p className="mt-5 text-lg leading-relaxed" style={{ color: "var(--m-text-muted)" }}>
                Chaque séance enregistrée, chaque record noté. Votre client voit qu&apos;il soulève
                20% de plus qu&apos;il y a deux mois. Cette preuve concrète, c&apos;est ce qui le fait revenir.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  "Courbes de charge et records personnels automatiques",
                  "Programmes structurés assignés à chaque client",
                  "Séances enregistrées en moins de 2 minutes",
                  "Tout centralisé — fini les carnets et tableaux Excel",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "var(--m-accent)" }} strokeWidth={2.5} />
                    <p className="text-sm leading-relaxed" style={{ color: "var(--m-text-muted)" }}>{point}</p>
                  </div>
                ))}
              </div>
              <Link href="/fonctionnalites"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
                style={{ color: "var(--m-accent)" }}>
                Voir toutes les fonctionnalités <ChevronRight className="h-4 w-4" />
              </Link>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── KEY FEATURES — Editorial rows ────────────────────────────────── */}
      <section id="fonctionnalites" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <AnimateIn>
            <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "var(--m-accent)" }}>Fonctionnalités</p>
          </AnimateIn>

          {/* Feature 1 */}
          <AnimateIn className="mt-20 grid items-center gap-12 border-b pb-20 lg:grid-cols-2" style={{ borderColor: "var(--m-border)" }}>
            <div>
              <p className="font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--m-text-faint)" }}>
                Gestion clients
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight leading-tight" style={{ color: "var(--m-text)" }}>
                Tous vos clients,<br />
                <Accent>en 10 secondes</Accent>.
              </h2>
              <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--m-text-muted)" }}>
                Profil complet, objectifs, historique de séances et programmes actifs.
                Plus de "attends je cherche" devant votre client.
              </p>
            </div>
            {/* Mini UI mockup */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--m-bg-card)", borderColor: "var(--m-border)" }}>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--m-text-faint)" }}>Vos clients</p>
              {[
                { name: "Marc Dupont", sessions: 18, prog: "Push/Pull/Legs" },
                { name: "Sophie R.", sessions: 31, prog: "Full body x3" },
                { name: "Thomas B.", sessions: 9, prog: "Débutant" },
              ].map(({ name, sessions, prog }) => (
                <div key={name} className="mb-3 flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: "var(--m-bg-section)" }}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, var(--m-accent), var(--m-accent-mid))" }}>
                    {name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--m-text)" }}>{name}</p>
                    <p className="text-xs truncate" style={{ color: "var(--m-text-faint)" }}>{prog}</p>
                  </div>
                  <span className="text-xs font-bold" style={{ color: "var(--m-accent)" }}>{sessions} séances</span>
                </div>
              ))}
            </div>
          </AnimateIn>

          {/* Feature 2 */}
          <AnimateIn className="mt-20 grid items-center gap-12 border-b pb-20 lg:grid-cols-2" style={{ borderColor: "var(--m-border)" }}>
            {/* Mini chart */}
            <div className="order-last lg:order-first rounded-2xl border p-6" style={{ background: "var(--m-bg-card)", borderColor: "var(--m-border)" }}>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--m-text-faint)" }}>Squat — Progression 3 mois</p>
              <div className="flex items-end gap-1.5 h-28 mt-4">
                {[60, 65, 65, 70, 72, 75, 75, 80, 82, 85, 92, 100].map((val, i) => (
                  <div key={i} className="flex-1 rounded-sm transition-all"
                    style={{ height: `${(val / 100) * 100}%`, background: `rgba(34,197,94,${0.25 + i * 0.06})` }} />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--m-text-faint)" }}>Mars</span>
                <div className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: "rgba(34,197,94,0.15)", color: "var(--m-accent)" }}>
                  +67% en 3 mois
                </div>
                <span className="text-xs" style={{ color: "var(--m-text-faint)" }}>Mai</span>
              </div>
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--m-text-faint)" }}>
                Statistiques
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight leading-tight" style={{ color: "var(--m-text)" }}>
                Chaque progrès,<br />
                <Accent>visible</Accent>{" "}et partageable.
              </h2>
              <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--m-text-muted)" }}>
                Courbes de charge, records personnels, volume hebdomadaire.
                Montrez à vos clients des preuves concrètes — c&apos;est ce qui les fait rester.
              </p>
            </div>
          </AnimateIn>

          {/* Feature 3 */}
          <AnimateIn className="mt-20 grid items-center gap-12 lg:grid-cols-2" style={{ borderColor: "var(--m-border)" }}>
            <div>
              <p className="font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--m-text-faint)" }}>
                Séances
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight leading-tight" style={{ color: "var(--m-text)" }}>
                Enregistrée en{" "}
                <Accent>2 minutes</Accent>.<br />Chrono.
              </h2>
              <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--m-text-muted)" }}>
                Interface pensée pour le terrain. Exercices, séries, poids — sans friction.
                Pendant ou juste après la séance, tout est sauvegardé en quelques taps.
              </p>
              <Link href="/fonctionnalites" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70"
                style={{ color: "var(--m-accent)" }}>
                Voir toutes les fonctionnalités <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-2xl border p-6" style={{ background: "var(--m-bg-card)", borderColor: "var(--m-border)" }}>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--m-text-faint)" }}>Séance · Lundi 6 mai</p>
              {[
                { exercise: "Squat", sets: "4×8", weight: "100 kg", pr: true },
                { exercise: "Leg press", sets: "3×12", weight: "160 kg", pr: false },
                { exercise: "Fentes marchées", sets: "3×10", weight: "20 kg", pr: false },
              ].map(({ exercise, sets, weight, pr }) => (
                <div key={exercise} className="mb-3 flex items-center justify-between rounded-xl px-4 py-3"
                  style={{ background: "var(--m-bg-section)" }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--m-text)" }}>{exercise}</p>
                    <p className="text-xs" style={{ color: "var(--m-text-faint)" }}>{sets} · {weight}</p>
                  </div>
                  {pr && (
                    <div className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: "rgba(34,197,94,0.15)", color: "var(--m-accent)" }}>
                      Record perso
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── TESTIMONIALS — No card boxes, just quotes ─────────────────────── */}
      <section className="px-6 py-24" style={{ background: "var(--m-bg-section)" }}>
        <div className="mx-auto max-w-5xl">
          <AnimateIn>
            <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "var(--m-accent)" }}>Témoignages</p>
          </AnimateIn>

          <StaggerChildren className="mt-12 grid gap-16 lg:grid-cols-2">
            {[
              {
                quote: "Avant Revo, je perdais 30 min par client juste à retrouver ses anciens programmes. Maintenant tout est là. Deux clients ont pris un abonnement annuel après avoir vu leurs courbes.",
                name: "Marc L.", role: "Personal trainer · 18 clients actifs",
              },
              {
                quote: "J'avais essayé 4 applications différentes. Revo est la seule qui comprend vraiment le workflow d'un coach. La bibliothèque d'exercices, les programmes, le suivi — tout est cohérent.",
                name: "Sophie R.", role: "Coach sportif en salle · 31 clients",
              },
            ].map(({ quote, name, role }) => (
              <StaggerItem key={name}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                {/* Large opening quote mark */}
                <p className="font-[family-name:var(--font-display)] text-6xl font-bold leading-none -mb-3" style={{ color: "var(--m-accent)", opacity: 0.4 }}>&ldquo;</p>
                <blockquote className="text-lg leading-relaxed font-medium" style={{ color: "var(--m-text)" }}>
                  {quote}
                </blockquote>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg, var(--m-accent), var(--m-accent-mid))" }}>
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--m-text)" }}>{name}</p>
                    <p className="text-xs" style={{ color: "var(--m-text-faint)" }}>{role}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section id="tarifs" className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <AnimateIn>
            <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "var(--m-accent)" }}>Tarifs</p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl font-bold tracking-tight" style={{ color: "var(--m-text)" }}>
              Commencez <Accent>sans risque</Accent>.
            </h2>
            <p className="mt-4 text-lg" style={{ color: "var(--m-text-muted)" }}>
              Gratuit pour démarrer. Payant seulement quand vous êtes prêt.
            </p>
          </AnimateIn>

          <StaggerChildren className="mt-12 mx-auto grid max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2">
            <StaggerItem>
              <div className="h-full rounded-2xl border p-8" style={{ background: "var(--m-bg-card)", borderColor: "var(--m-border)" }}>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--m-text-faint)" }}>Gratuit</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-display)] text-5xl font-bold" style={{ color: "var(--m-text)" }}>0 €</span>
                  <span className="text-sm" style={{ color: "var(--m-text-faint)" }}>/ mois</span>
                </div>
                <p className="mt-2 text-sm" style={{ color: "var(--m-text-muted)" }}>Pour découvrir sans risque.</p>
                <ul className="mt-8 space-y-3">
                  {["Jusqu'à 5 clients", "Séances illimitées", "Bibliothèque d'exercices", "Support par email"].map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-sm" style={{ color: "var(--m-text-muted)" }}>
                      <Check className="h-4 w-4 shrink-0" style={{ color: "var(--m-accent)" }} strokeWidth={2.5} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up" className="mt-8 flex h-11 w-full items-center justify-center rounded-xl border text-sm font-semibold transition-all hover:opacity-70"
                  style={{ borderColor: "var(--m-border)", color: "var(--m-text)" }}>
                  Créer mon compte gratuit
                </Link>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="relative h-full rounded-2xl border p-8"
                style={{ background: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.35)", boxShadow: "0 0 60px rgba(34,197,94,0.08)" }}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg, var(--m-accent), var(--m-accent-mid))" }}>
                  Recommandé
                </div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--m-accent)" }}>Pro</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-display)] text-5xl font-bold" style={{ color: "var(--m-text)" }}>29 €</span>
                  <span className="text-sm" style={{ color: "var(--m-text-faint)" }}>/ mois</span>
                </div>
                <p className="mt-2 text-sm" style={{ color: "var(--m-text-muted)" }}>Pour les coachs qui vivent de leur activité.</p>
                <ul className="mt-8 space-y-3">
                  {["Clients illimités", "Programmes avancés", "Courbes de progression", "Statistiques détaillées", "Support prioritaire"].map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-sm" style={{ color: "var(--m-text)" }}>
                      <Check className="h-4 w-4 shrink-0" style={{ color: "var(--m-accent)" }} strokeWidth={2.5} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up" className="mt-8 flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, var(--m-accent), var(--m-accent-mid))", boxShadow: "0 4px 20px rgba(34,197,94,0.3)" }}>
                  Essayer Pro gratuitement
                </Link>
              </div>
            </StaggerItem>
          </StaggerChildren>

          <AnimateIn delay={0.2} className="mt-6 text-center">
            <Link href="/tarifs" className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--m-accent)" }}>
              Voir la comparaison complète <ChevronRight className="h-4 w-4" />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* ── FINAL CTA — Celebrate mascot ─────────────────────────────────── */}
      <section className="overflow-x-hidden px-6 py-24" style={{ background: "var(--m-bg-section)" }}>
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_380px]">
            <AnimateIn direction="left">
              <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "var(--m-accent)" }}>Rejoignez Revo</p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl font-bold leading-tight tracking-tight" style={{ color: "var(--m-text)" }}>
                Votre prochain client mérite mieux qu&apos;un carnet.
              </h2>
              <p className="mt-5 text-lg" style={{ color: "var(--m-text-muted)" }}>
                Rejoignez les coachs qui ont arrêté de bricoler et commencé à
                <strong style={{ color: "var(--m-text)", fontWeight: 600 }}> professionnaliser leur suivi.</strong>
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/sign-up"
                  className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white transition-all hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg, var(--m-accent), var(--m-accent-mid))", boxShadow: "0 8px 40px rgba(34,197,94,0.3)" }}>
                  Créer mon compte — c&apos;est gratuit
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="mt-4 text-sm" style={{ color: "var(--m-text-faint)" }}>Sans carte bancaire · Sans engagement</p>
            </AnimateIn>

            <AnimateIn direction="right" className="relative hidden min-h-[400px] items-center justify-center lg:flex">
              <div className="relative mx-auto w-full max-w-[400px]">
                <Image
                  src="/revo-mascot-celebrate.png"
                  alt="Mascotte Revo en célébration"
                  width={400}
                  height={400}
                  className="relative z-0 mx-auto object-contain revo-float drop-shadow-2xl"
                />
                <GlassStatCard
                  className="absolute right-[11%] top-[13%] z-10 w-[min(208px,54%)]"
                  straddle="right"
                  rotateDeg={2}
                >
                  <p className="revo-glass-label">Record perso</p>
                  <p className="revo-glass-value text-xl leading-snug">Squat · 100 kg</p>
                  <p className="revo-glass-sub">détecté auto après séance</p>
                </GlassStatCard>
                <GlassStatCard
                  className="absolute left-[11%] bottom-[17%] z-10 w-[min(228px,56%)]"
                  straddle="left"
                  rotateDeg={-2.5}
                >
                  <p className="revo-glass-label">Objectif client</p>
                  <p className="revo-glass-value text-2xl">82%</p>
                  <p className="revo-glass-sub">du programme bouclé</p>
                </GlassStatCard>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t px-6 py-10" style={{ borderColor: "var(--m-border)" }}>
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-1.5">
            <span className="font-[family-name:var(--font-display)] text-base font-bold" style={{ color: "var(--m-text)" }}>Revo</span>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--m-accent)" }} />
          </div>
          <p className="text-xs" style={{ color: "var(--m-text-faint)" }}>© 2026 Revo. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-6">
            {[
              { href: "/fonctionnalites", label: "Fonctionnalités" },
              { href: "/tarifs", label: "Tarifs" },
              { href: "/blog", label: "Blog" },
              { href: "#", label: "CGU" },
              { href: "#", label: "Confidentialité" },
            ].map(({ href, label }) => (
              <Link key={label} href={href} className="text-xs transition-opacity hover:opacity-70" style={{ color: "var(--m-text-faint)" }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
