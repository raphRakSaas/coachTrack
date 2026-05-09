import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Star,
  MessageSquare,
  FileSpreadsheet,
  BookOpen,
} from "lucide-react";
import { Nav } from "@/components/marketing/nav";

// ─── Inline SVG illustrations ──────────────────────────────────────────────

function IllustrationAnalytics() {
  return (
    <svg viewBox="0 0 120 60" fill="none" className="w-full max-w-[160px]">
      <rect x="0" y="40" width="16" height="20" rx="3" fill="rgba(139,92,246,0.3)" />
      <rect x="22" y="28" width="16" height="32" rx="3" fill="rgba(139,92,246,0.45)" />
      <rect x="44" y="18" width="16" height="42" rx="3" fill="rgba(139,92,246,0.6)" />
      <rect x="66" y="10" width="16" height="50" rx="3" fill="rgba(139,92,246,0.75)" />
      <rect x="88" y="4" width="16" height="56" rx="3" fill="#8b5cf6" />
      <polyline
        points="8,40 30,28 52,18 74,10 96,4"
        stroke="#a78bfa"
        strokeWidth="1.5"
        strokeDasharray="3 2"
        opacity="0.6"
      />
    </svg>
  );
}

function IllustrationClients() {
  return (
    <svg viewBox="0 0 100 60" fill="none" className="w-full max-w-[140px]">
      {[
        { cx: 18, cy: 22 },
        { cx: 50, cy: 15 },
        { cx: 82, cy: 22 },
      ].map(({ cx, cy }, i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="10" fill="rgba(34,197,94,0.2)" stroke="rgba(34,197,94,0.5)" strokeWidth="1.5" />
          <circle cx={cx} cy={cy - 3} r="4" fill="rgba(34,197,94,0.6)" />
          <path
            d={`M${cx - 8} ${cy + 10} Q${cx} ${cy + 4} ${cx + 8} ${cy + 10}`}
            stroke="rgba(34,197,94,0.5)"
            strokeWidth="1.5"
            fill="none"
          />
        </g>
      ))}
      <line x1="28" y1="22" x2="40" y2="18" stroke="rgba(34,197,94,0.3)" strokeWidth="1" strokeDasharray="3 2" />
      <line x1="60" y1="18" x2="72" y2="22" stroke="rgba(34,197,94,0.3)" strokeWidth="1" strokeDasharray="3 2" />
      <rect x="8" y="44" width="84" height="1" rx="0.5" fill="rgba(255,255,255,0.06)" />
      <rect x="20" y="48" width="60" height="8" rx="4" fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.2)" strokeWidth="1" />
      <text x="50" y="55" textAnchor="middle" fill="rgba(34,197,94,0.7)" fontSize="5" fontFamily="monospace">12 clients actifs</text>
    </svg>
  );
}

function IllustrationSessions() {
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  const filled = [true, true, false, true, true, false, false];
  return (
    <svg viewBox="0 0 110 60" fill="none" className="w-full max-w-[150px]">
      <rect x="2" y="2" width="106" height="56" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {days.map((day, i) => (
        <g key={i}>
          <text
            x={10 + i * 14}
            y="16"
            fill="rgba(255,255,255,0.3)"
            fontSize="5"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {day}
          </text>
          {filled[i] ? (
            <rect
              x={4 + i * 14}
              y="22"
              width="12"
              height="28"
              rx="3"
              fill="rgba(139,92,246,0.6)"
              stroke="rgba(139,92,246,0.8)"
              strokeWidth="0.5"
            />
          ) : (
            <rect
              x={4 + i * 14}
              y="22"
              width="12"
              height="28"
              rx="3"
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.5"
            />
          )}
        </g>
      ))}
    </svg>
  );
}

function IllustrationProgrammes() {
  return (
    <svg viewBox="0 0 120 70" fill="none" className="w-full max-w-[160px]">
      {[
        { y: 6, w: 110, label: "Squat — 4×8 @ 80kg", accent: "#8b5cf6" },
        { y: 24, w: 90, label: "Développé couché — 3×10", accent: "#7c3aed" },
        { y: 42, w: 75, label: "Tractions — 3×max", accent: "#6d28d9" },
      ].map(({ y, w, label, accent }, i) => (
        <g key={i}>
          <rect x="0" y={y} width={w} height="14" rx="4" fill={`${accent}22`} stroke={`${accent}55`} strokeWidth="1" />
          <rect x="0" y={y} width="4" height="14" rx="2" fill={accent} />
          <text x="10" y={y + 9} fill="rgba(255,255,255,0.6)" fontSize="5" fontFamily="monospace">{label}</text>
        </g>
      ))}
      <circle cx="110" cy="60" r="8" fill="rgba(139,92,246,0.2)" stroke="rgba(139,92,246,0.4)" strokeWidth="1" />
      <text x="110" y="63" textAnchor="middle" fill="#a78bfa" fontSize="7">+</text>
    </svg>
  );
}

function IllustrationExercices() {
  return (
    <svg viewBox="0 0 100 50" fill="none" className="w-full max-w-[140px]">
      {/* Dumbbell */}
      <rect x="5" y="21" width="12" height="8" rx="3" fill="rgba(251,191,36,0.4)" stroke="rgba(251,191,36,0.6)" strokeWidth="1" />
      <rect x="17" y="18" width="8" height="14" rx="2" fill="rgba(251,191,36,0.6)" stroke="rgba(251,191,36,0.8)" strokeWidth="1" />
      <rect x="25" y="23" width="50" height="4" rx="2" fill="rgba(251,191,36,0.3)" />
      <rect x="75" y="18" width="8" height="14" rx="2" fill="rgba(251,191,36,0.6)" stroke="rgba(251,191,36,0.8)" strokeWidth="1" />
      <rect x="83" y="21" width="12" height="8" rx="3" fill="rgba(251,191,36,0.4)" stroke="rgba(251,191,36,0.6)" strokeWidth="1" />
      {/* Tag labels */}
      <rect x="5" y="37" width="28" height="8" rx="3" fill="rgba(251,191,36,0.1)" stroke="rgba(251,191,36,0.2)" strokeWidth="0.5" />
      <rect x="38" y="37" width="20" height="8" rx="3" fill="rgba(251,191,36,0.1)" stroke="rgba(251,191,36,0.2)" strokeWidth="0.5" />
      <rect x="63" y="37" width="32" height="8" rx="3" fill="rgba(251,191,36,0.1)" stroke="rgba(251,191,36,0.2)" strokeWidth="0.5" />
      <text x="19" y="43" textAnchor="middle" fill="rgba(251,191,36,0.6)" fontSize="4">Poitrine</text>
      <text x="48" y="43" textAnchor="middle" fill="rgba(251,191,36,0.6)" fontSize="4">Dos</text>
      <text x="79" y="43" textAnchor="middle" fill="rgba(251,191,36,0.6)" fontSize="4">Jambes</text>
    </svg>
  );
}

function IllustrationPaiements() {
  return (
    <svg viewBox="0 0 110 60" fill="none" className="w-full max-w-[150px]">
      <rect x="0" y="8" width="110" height="44" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <rect x="0" y="8" width="110" height="16" rx="8" fill="rgba(16,185,129,0.15)" />
      <rect x="0" y="16" width="110" height="8" fill="rgba(16,185,129,0.15)" />
      <circle cx="14" cy="38" r="7" fill="rgba(16,185,129,0.3)" stroke="rgba(16,185,129,0.5)" strokeWidth="1" />
      <circle cx="22" cy="38" r="7" fill="rgba(16,185,129,0.5)" stroke="rgba(16,185,129,0.7)" strokeWidth="1" />
      <rect x="40" y="34" width="55" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
      <rect x="40" y="42" width="35" height="4" rx="2" fill="rgba(255,255,255,0.06)" />
      <text x="55" y="16" textAnchor="middle" fill="rgba(16,185,129,0.8)" fontSize="5" fontFamily="monospace">29 € / mois</text>
    </svg>
  );
}

// ─── Feature cards data ────────────────────────────────────────────────────

const features = [
  {
    tag: "Statistiques",
    title: "Chaque progrès, visible en un coup d'œil",
    description:
      "Courbes de charge, records personnels, volume hebdomadaire. Vos clients voient leur évolution en temps réel — et ça les fait rester.",
    colSpan: "lg:col-span-2",
    accentColor: "#8b5cf6",
    Illustration: IllustrationAnalytics,
  },
  {
    tag: "Clients",
    title: "Tous vos clients au même endroit",
    description:
      "Profil complet, objectifs, historique et programmes actifs. Accès en 10 secondes chrono.",
    colSpan: "lg:col-span-1",
    accentColor: "#22c55e",
    Illustration: IllustrationClients,
  },
  {
    tag: "Séances",
    title: "Enregistrez une séance en moins de 2 min",
    description:
      "Interface rapide, pensée pour le terrain. Exercices, séries, poids — sans friction.",
    colSpan: "lg:col-span-1",
    accentColor: "#8b5cf6",
    Illustration: IllustrationSessions,
  },
  {
    tag: "Programmes",
    title: "Créez et réutilisez vos programmes",
    description:
      "Construisez des plans d'entraînement structurés, assignez-les à vos clients, suivez leur exécution.",
    colSpan: "lg:col-span-2",
    accentColor: "#7c3aed",
    Illustration: IllustrationProgrammes,
  },
  {
    tag: "Exercices",
    title: "Une bibliothèque complète et personnalisable",
    description:
      "Accédez à des centaines d'exercices globaux ou créez les vôtres. Organisés par muscle, matériel et difficulté.",
    colSpan: "lg:col-span-1",
    accentColor: "#fbbf24",
    Illustration: IllustrationExercices,
  },
  {
    tag: "Paiements",
    title: "Gérez vos abonnements sereinement",
    description:
      "Plan FREE pour démarrer, plan Pro pour scaler. Aucune mauvaise surprise — juste de la clarté.",
    colSpan: "lg:col-span-2",
    accentColor: "#10b981",
    Illustration: IllustrationPaiements,
  },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div
      className="min-h-screen overflow-x-hidden text-white"
      style={{ background: "#070c14" }}
    >
      <Nav />

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center px-6 pt-28 pb-20">
        {/* Gradient mesh background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute top-1/4 right-0 h-[500px] w-[500px] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, rgba(34,197,94,0.3) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
              style={{ borderColor: "rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.1)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "#8b5cf6" }} />
              <span className="text-sm font-medium" style={{ color: "#a78bfa" }}>
                La plateforme pour coachs sportifs professionnels
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-6xl font-[family-name:var(--font-display)] font-bold leading-[1.05] tracking-tight lg:text-7xl"
            >
              Gérez moins.
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 40%, #22c55e 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Coachez plus.
              </span>
              <br />
              Fidélisez davantage.
            </h1>

            <p
              className="mt-6 max-w-xl text-xl leading-relaxed"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Revo centralise vos clients, programmes, séances et statistiques.
              Fini WhatsApp et les carnets illisibles — vos clients voient leurs
              progrès, et ils restent.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
                  boxShadow: "0 8px 32px rgba(139,92,246,0.35)",
                }}
              >
                Créer mon compte coach
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#fonctionnalites"
                className="inline-flex items-center gap-2 rounded-xl border px-7 py-3.5 text-base font-semibold transition-all hover:opacity-80"
                style={{
                  borderColor: "rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                Découvrir les fonctionnalités
              </Link>
            </div>

            <p className="mt-5 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
              Gratuit pour commencer · Sans carte bancaire · Opérationnel en 2 min
            </p>
          </div>

          {/* Floating stat cards */}
          <div className="absolute bottom-16 right-6 hidden flex-col gap-3 lg:flex">
            <div
              className="flex items-center gap-4 rounded-2xl border px-5 py-4"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span className="text-2xl font-[family-name:var(--font-display)] font-bold" style={{ color: "#a78bfa" }}>
                +34%
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Rétention clients</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  vs suivi sur WhatsApp
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 rounded-2xl border px-5 py-4"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex -space-x-2">
                {["#8b5cf6", "#22c55e", "#f59e0b"].map((color) => (
                  <div
                    key={color}
                    className="h-7 w-7 rounded-full border-2"
                    style={{ background: color, borderColor: "#070c14" }}
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Clients fidélisés</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Ils voient leurs progrès
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-4 rounded-2xl border px-5 py-4"
              style={{
                background: "rgba(34,197,94,0.06)",
                borderColor: "rgba(34,197,94,0.15)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span className="text-2xl font-[family-name:var(--font-display)] font-bold" style={{ color: "#22c55e" }}>
                30 min
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Économisées / semaine</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  en tâches administratives
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF STRIP ─────────────────────────────────────── */}
      <div
        className="border-y px-6 py-5"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 overflow-hidden">
          <p className="text-sm whitespace-nowrap" style={{ color: "rgba(255,255,255,0.35)" }}>
            Rejoignez les coachs qui font confiance à Revo
          </p>
          <div className="flex items-center gap-8">
            {[
              { label: "Clients gérés", value: "2 400+" },
              { label: "Séances enregistrées", value: "18 000+" },
              { label: "Coachs actifs", value: "320+" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-base font-[family-name:var(--font-display)] font-bold text-white">
                  {value}
                </p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PROBLEM ────────────────────────────────────────────────── */}
      <section id="probleme" className="px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p
              className="mb-3 text-sm font-semibold uppercase tracking-widest"
              style={{ color: "#8b5cf6" }}
            >
              Soyons honnêtes
            </p>
            <h2 className="text-5xl font-[family-name:var(--font-display)] font-bold tracking-tight">
              Tu te reconnais ?
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: MessageSquare,
                title: "Le suivi sur WhatsApp",
                description:
                  "Tes notes de séance sont éparpillées dans des conversations. Retrouver ce qu'a fait un client il y a 3 semaines prend 10 minutes.",
                accent: "#ef4444",
              },
              {
                icon: FileSpreadsheet,
                title: "Le tableau Excel ingérable",
                description:
                  "Illisible au 5ème client. Tu as arrêté de le mettre à jour. Et ton client ne voit toujours pas ses résultats.",
                accent: "#f97316",
              },
              {
                icon: BookOpen,
                title: "Le carnet papier",
                description:
                  "Pratique sur le moment, inutile à distance. Impossible de montrer une courbe de progression. Ton client repart sans voir ses progrès.",
                accent: "#eab308",
              },
            ].map(({ icon: Icon, title, description, accent }) => (
              <div
                key={title}
                className="rounded-3xl border p-7"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `${accent}18` }}
                >
                  <Icon className="h-5 w-5" style={{ color: accent }} strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-base font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div
            className="mt-10 rounded-3xl border px-10 py-8 text-center"
            style={{
              background: "rgba(139,92,246,0.06)",
              borderColor: "rgba(139,92,246,0.2)",
            }}
          >
            <p className="text-xl font-bold text-white">
              Le vrai problème : tes clients ne{" "}
              <span style={{ color: "#a78bfa" }}>voient pas</span> leurs progrès.
            </p>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              Quand un client ne perçoit pas son évolution, il doute, il décroche, il annule. Pas parce que
              tu es un mauvais coach — parce qu&apos;il n&apos;a pas de preuves de ses efforts.
            </p>
          </div>
        </div>
      </section>

      {/* ── FEATURES BENTO ─────────────────────────────────────────── */}
      <section id="fonctionnalites" className="px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16">
            <p
              className="mb-3 text-sm font-semibold uppercase tracking-widest"
              style={{ color: "#8b5cf6" }}
            >
              Fonctionnalités
            </p>
            <h2 className="max-w-2xl text-5xl font-[family-name:var(--font-display)] font-bold tracking-tight">
              Tout ce qu&apos;il vous faut,
              <br />
              au même endroit.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {features.map(({ tag, title, description, colSpan, accentColor, Illustration }) => (
              <div
                key={tag}
                className={`${colSpan} rounded-3xl border p-7 transition-all hover:border-opacity-50`}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <span
                  className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    background: `${accentColor}18`,
                    color: accentColor,
                  }}
                >
                  {tag}
                </span>
                <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {description}
                </p>
                <div className="mt-6">
                  <Illustration />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────── */}
      <section id="comment" className="px-6 py-28">
        <div
          className="mx-auto max-w-5xl rounded-3xl border px-10 py-16"
          style={{
            background: "rgba(255,255,255,0.02)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <div className="mb-16 text-center">
            <p
              className="mb-3 text-sm font-semibold uppercase tracking-widest"
              style={{ color: "#8b5cf6" }}
            >
              Comment ça marche
            </p>
            <h2 className="text-5xl font-[family-name:var(--font-display)] font-bold tracking-tight">
              Opérationnel en 3 étapes.
            </h2>
          </div>

          <div className="relative grid gap-10 sm:grid-cols-3">
            <div
              className="absolute top-7 left-[16.5%] right-[16.5%] hidden h-px sm:block"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(139,92,246,0.3), transparent)",
              }}
            />
            {[
              {
                number: "01",
                title: "Créez votre compte",
                description: "2 minutes. Gratuit. Sans carte bancaire. Vous êtes opérationnel immédiatement.",
              },
              {
                number: "02",
                title: "Ajoutez votre premier client",
                description: "Prénom, objectif, niveau. L'onboarding vous guide pas à pas dès l'inscription.",
              },
              {
                number: "03",
                title: "Enregistrez la première séance",
                description: "Exercices, séries, poids. Votre client voit ses résultats dès la fin de la séance.",
              },
            ].map(({ number, title, description }) => (
              <div key={number} className="relative text-center">
                <div
                  className="relative z-10 mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border text-lg font-[family-name:var(--font-display)] font-bold"
                  style={{
                    background: "rgba(139,92,246,0.1)",
                    borderColor: "rgba(139,92,246,0.3)",
                    color: "#a78bfa",
                  }}
                >
                  {number}
                </div>
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────── */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p
              className="mb-3 text-sm font-semibold uppercase tracking-widest"
              style={{ color: "#8b5cf6" }}
            >
              Témoignages
            </p>
            <h2 className="text-5xl font-[family-name:var(--font-display)] font-bold tracking-tight">
              Ils ont fait le saut.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                quote:
                  "Avant Revo, je perdais 30 min par client juste à retrouver ses anciens programmes. Maintenant j'arrive en séance, j'ouvre l'appli, tout est là. Deux clients ont pris un abonnement annuel après avoir vu leurs courbes.",
                name: "Marc L.",
                role: "Personal trainer indépendant · 18 clients actifs",
                initial: "M",
                accent: "#8b5cf6",
              },
              {
                quote:
                  "J'avais essayé 4 applications différentes. Revo est la seule qui comprend vraiment le workflow d'un coach. La bibliothèque d'exercices + les programmes + le suivi client — tout est cohérent.",
                name: "Sophie R.",
                role: "Coach sportif en salle · 31 clients",
                initial: "S",
                accent: "#22c55e",
              },
            ].map(({ quote, name, role, initial, accent }) => (
              <div
                key={name}
                className="rounded-3xl border p-8"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <div className="mb-5 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote
                  className="text-base leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  &ldquo;{quote}&rdquo;
                </blockquote>
                <div className="mt-6 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: `${accent}30`, border: `1.5px solid ${accent}50` }}
                  >
                    {initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────── */}
      <section id="tarifs" className="px-6 py-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <p
              className="mb-3 text-sm font-semibold uppercase tracking-widest"
              style={{ color: "#8b5cf6" }}
            >
              Tarifs
            </p>
            <h2 className="text-5xl font-[family-name:var(--font-display)] font-bold tracking-tight">
              Commencez sans risque.
            </h2>
            <p className="mt-4 text-lg" style={{ color: "rgba(255,255,255,0.45)" }}>
              Gratuit pour démarrer. Payant seulement quand vous en avez vraiment besoin.
            </p>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Free */}
            <div
              className="rounded-3xl border p-8"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Gratuit
              </p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-5xl font-[family-name:var(--font-display)] font-bold text-white">
                  0 €
                </span>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                  / mois
                </span>
              </div>
              <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                Parfait pour démarrer et tester.
              </p>
              <ul className="mt-8 space-y-3.5">
                {[
                  "Jusqu'à 5 clients",
                  "Séances illimitées",
                  "Bibliothèque d'exercices",
                  "Support par email",
                ].map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                    <Check className="h-4 w-4 flex-shrink-0" style={{ color: "#8b5cf6" }} strokeWidth={2.5} />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 flex h-11 w-full items-center justify-center rounded-xl border text-sm font-semibold transition-all hover:opacity-70"
                style={{
                  borderColor: "rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Créer mon compte gratuit
              </Link>
            </div>

            {/* Pro */}
            <div
              className="relative rounded-3xl border p-8"
              style={{
                background: "rgba(139,92,246,0.08)",
                borderColor: "rgba(139,92,246,0.3)",
                boxShadow: "0 0 60px rgba(139,92,246,0.08)",
              }}
            >
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6)" }}
              >
                Recommandé
              </div>
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "#a78bfa" }}
              >
                Pro
              </p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-5xl font-[family-name:var(--font-display)] font-bold text-white">
                  29 €
                </span>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                  / mois
                </span>
              </div>
              <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                Pour les coachs qui vivent de leur activité.
              </p>
              <ul className="mt-8 space-y-3.5">
                {[
                  "Clients illimités",
                  "Programmes avancés",
                  "Courbes de progression",
                  "Statistiques détaillées",
                  "Support prioritaire",
                ].map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm text-white">
                    <Check className="h-4 w-4 flex-shrink-0" style={{ color: "#a78bfa" }} strokeWidth={2.5} />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
                  boxShadow: "0 4px 20px rgba(139,92,246,0.3)",
                }}
              >
                Essayer Pro gratuitement
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────── */}
      <section className="px-6 py-28">
        <div
          className="mx-auto max-w-4xl rounded-3xl border px-10 py-16 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(139,92,246,0.08) 100%)",
            borderColor: "rgba(139,92,246,0.25)",
          }}
        >
          <h2 className="text-5xl font-[family-name:var(--font-display)] font-bold tracking-tight">
            Votre prochain client
            <br />
            mérite mieux qu&apos;un carnet.
          </h2>
          <p className="mt-5 text-lg" style={{ color: "rgba(255,255,255,0.5)" }}>
            Rejoignez les coachs qui ont arrêté de bricoler
            <br />
            et commencé à professionnaliser leur suivi.
          </p>
          <Link
            href="/sign-up"
            className="mt-10 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
              boxShadow: "0 8px 40px rgba(139,92,246,0.35)",
            }}
          >
            Créer mon compte coach — c&apos;est gratuit
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
            Sans carte bancaire · Sans engagement
          </p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer
        className="border-t px-6 py-10"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-1.5">
            <span className="font-[family-name:var(--font-display)] text-base font-bold text-white">
              Revo
            </span>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "#8b5cf6" }}
            />
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            © 2026 Revo. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            {["Confidentialité", "CGU", "Contact"].map((link) => (
              <Link
                key={link}
                href="#"
                className="text-xs transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
