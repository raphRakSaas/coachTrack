import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { Nav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { AnimateIn, StaggerChildren, StaggerItem } from "@/components/marketing/animate-in";

export const metadata: Metadata = {
  title: "Ressources",
  description: "Guides, conseils et stratégies pour développer votre activité de coaching sportif.",
};

/** Illustration graphique — progression (sans emoji), couleurs charte */
function FeaturedProgressIllustration() {
  const baseline = 92;
  const barW = 16;
  const gap = 22;
  const startX = 16;
  const heights = [22, 28, 26, 34, 38, 44, 52, 58];
  const tops = heights.map((height, index) => ({
    cx: startX + index * gap + barW / 2,
    cy: baseline - height - 4,
  }));
  const linePath = tops
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.cx} ${point.cy}`)
    .join(" ");
  const areaPath = `${linePath} L ${tops[tops.length - 1]!.cx} ${baseline} L ${tops[0]!.cx} ${baseline} Z`;

  return (
    <svg
      viewBox="0 0 200 100"
      className="h-auto w-full max-w-[260px]"
      role="img"
      aria-label="Schéma illustrant une progression dans le temps"
    >
      <defs>
        <linearGradient id="blog-progress-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--m-accent)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--m-accent)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="blog-progress-bar" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--m-accent-mid)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--m-accent)" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {/* repères discrets */}
      <line
        x1="12"
        y1={baseline}
        x2="192"
        y2={baseline}
        stroke="var(--m-border)"
        strokeWidth="1"
      />
      {heights.map((height, index) => (
        <rect
          key={index}
          x={startX + index * gap}
          y={baseline - height}
          width={barW}
          height={height}
          rx="4"
          fill="url(#blog-progress-bar)"
          opacity={0.25 + index * 0.09}
        />
      ))}
      <path d={areaPath} fill="url(#blog-progress-area)" />
      <path
        d={linePath}
        fill="none"
        stroke="var(--m-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {tops.map((point) => (
        <circle
          key={`${point.cx}-${point.cy}`}
          cx={point.cx}
          cy={point.cy}
          r="3.5"
          fill="var(--m-bg-card)"
          stroke="var(--m-accent)"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

const ARTICLES = [
  {
    tag: "Fidélisation",
    title: "Comment montrer la progression de vos clients pour les fidéliser",
    excerpt: "Les coachs qui retiennent leurs clients longtemps ont un point commun : ils rendent les progrès visibles. Voici comment mettre en place un système simple et efficace.",
    readTime: "5 min",
    date: "2 mai 2026",
    accent: "var(--m-accent)",
    featured: true,
  },
  {
    tag: "Organisation",
    title: "5 erreurs à éviter dans le suivi de vos clients",
    excerpt: "Du carnet papier au tableau Excel illisible — les pièges classiques des coachs qui commencent, et comment les éviter dès le départ.",
    readTime: "4 min",
    date: "28 avr. 2026",
    accent: "#22c55e",
    featured: false,
  },
  {
    tag: "Programmes",
    title: "Créer un programme Push / Pull / Legs : le guide complet",
    excerpt: "Structure, fréquence, sélection des exercices, progression de charge — tout ce qu'il faut savoir pour créer un programme PPL efficace pour vos clients.",
    readTime: "8 min",
    date: "20 avr. 2026",
    accent: "#fbbf24",
    featured: false,
  },
  {
    tag: "Business",
    title: "Comment fixer le prix de vos séances en 2026",
    excerpt: "Tarif horaire, forfaits, abonnements — les différentes structures de prix pour un coach personnel, avec des exemples concrets et une méthode pour trouver votre positionnement.",
    readTime: "6 min",
    date: "12 avr. 2026",
    accent: "#10b981",
    featured: false,
  },
  {
    tag: "Science du sport",
    title: "Surcharge progressive : le principe fondamental que vos clients doivent comprendre",
    excerpt: "Pourquoi augmenter les charges régulièrement est non négociable, et comment expliquer ce concept à un débutant pour maximiser ses résultats et sa motivation.",
    readTime: "5 min",
    date: "5 avr. 2026",
    accent: "#ef4444",
    featured: false,
  },
];

const TAGS = ["Tous", "Fidélisation", "Organisation", "Programmes", "Business", "Science du sport"];

export default function BlogPage() {
  const [featuredArticle, ...otherArticles] = ARTICLES;

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--m-bg)", color: "var(--m-text)" }}>
      <Nav />

      {/* Hero */}
      <section className="relative px-6 pt-36 pb-16 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[350px] w-[700px]"
            style={{ background: "radial-gradient(ellipse, var(--m-glow-primary) 0%, transparent 70%)", filter: "blur(40px)" }} />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl">
          <AnimateIn>
            <span className="mb-4 inline-block rounded-full border px-4 py-1.5 text-sm font-medium"
              style={{ borderColor: "rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.08)", color: "var(--m-accent-mid)" }}>
              Ressources
            </span>
            <h1 className="mt-4 text-5xl font-[family-name:var(--font-display)] font-bold tracking-tight" style={{ color: "var(--m-text)" }}>
              Pour les coachs qui veulent progresser.
            </h1>
            <p className="mt-4 text-lg" style={{ color: "var(--m-text-muted)" }}>
              Conseils pratiques, guides et stratégies pour développer votre activité de coaching.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Tags filter (static) */}
      <div className="px-6 pb-10">
        <div className="mx-auto max-w-5xl flex flex-wrap gap-2 justify-center">
          {TAGS.map((tag, i) => (
            <button
              key={tag}
              className="rounded-full px-4 py-1.5 text-sm font-medium transition-all hover:opacity-80"
              style={{
                background: i === 0 ? "var(--m-accent)" : "var(--m-bg-card)",
                color: i === 0 ? "#fff" : "var(--m-text-muted)",
                border: `1px solid ${i === 0 ? "transparent" : "var(--m-border)"}`,
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Articles */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-5xl">
          {/* Featured */}
          <AnimateIn className="mb-8">
            <div className="group relative overflow-hidden rounded-3xl border p-8 transition-all hover:border-violet-400/30"
              style={{ background: "var(--m-bg-card)", borderColor: "var(--m-border)" }}>
              <div className="grid items-center gap-8 lg:grid-cols-2">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ background: `${featuredArticle.accent}18`, color: featuredArticle.accent }}>
                      {featuredArticle.tag}
                    </span>
                    <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: "rgba(139,92,246,0.15)", color: "var(--m-accent-mid)" }}>
                      Article vedette
                    </span>
                  </div>
                  <h2 className="text-2xl font-[family-name:var(--font-display)] font-bold leading-tight" style={{ color: "var(--m-text)" }}>
                    {featuredArticle.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--m-text-muted)" }}>{featuredArticle.excerpt}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--m-text-faint)" }}>
                      <Clock className="h-3.5 w-3.5" /> {featuredArticle.readTime} de lecture
                    </span>
                    <span className="text-xs" style={{ color: "var(--m-text-faint)" }}>{featuredArticle.date}</span>
                  </div>
                  <Link href="#" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-70" style={{ color: "var(--m-accent)" }}>
                    Lire l&apos;article <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                {/* Illustration graphique */}
                <div
                  className="hidden flex-col items-center justify-center rounded-2xl border p-8 lg:flex"
                  style={{
                    background: "var(--m-bg-section)",
                    borderColor: "var(--m-border)",
                    minHeight: "200px",
                  }}
                >
                  <FeaturedProgressIllustration />
                  <p className="mt-5 text-center text-sm font-medium" style={{ color: "var(--m-text-muted)" }}>
                    Progression client
                  </p>
                </div>
              </div>
            </div>
          </AnimateIn>

          {/* Grid */}
          <StaggerChildren className="grid gap-5 sm:grid-cols-2">
            {otherArticles.map(({ tag, title, excerpt, readTime, date, accent }) => (
              <StaggerItem key={title}>
                <div className="group h-full rounded-3xl border p-7 transition-all hover:border-violet-400/30"
                  style={{ background: "var(--m-bg-card)", borderColor: "var(--m-border)" }}>
                  <div className="mb-4 flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5" style={{ color: accent }} />
                    <span className="text-xs font-semibold" style={{ color: accent }}>{tag}</span>
                  </div>
                  <h3 className="text-base font-bold leading-tight" style={{ color: "var(--m-text)" }}>{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed line-clamp-3" style={{ color: "var(--m-text-muted)" }}>{excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs" style={{ color: "var(--m-text-faint)" }}>
                        <Clock className="h-3 w-3" /> {readTime}
                      </span>
                      <span className="text-xs" style={{ color: "var(--m-text-faint)" }}>{date}</span>
                    </div>
                    <Link href="#" className="text-xs font-semibold transition-colors hover:opacity-70" style={{ color: "var(--m-accent)" }}>
                      Lire →
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* Newsletter */}
          <AnimateIn delay={0.2} className="mt-12">
            <div className="rounded-3xl border p-8 text-center"
              style={{ background: "rgba(139,92,246,0.06)", borderColor: "rgba(139,92,246,0.2)" }}>
              <h3 className="text-2xl font-[family-name:var(--font-display)] font-bold" style={{ color: "var(--m-text)" }}>
                Restez informé
              </h3>
              <p className="mt-2 text-sm" style={{ color: "var(--m-text-muted)" }}>
                Un email par semaine avec nos meilleurs conseils coaching. Pas de spam.
              </p>
              <p className="mt-2 text-xs" style={{ color: "var(--m-text-faint)" }}>
                Inscription newsletter non active pour le moment — aucune donnée n&apos;est enregistrée.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-violet-500"
                  style={{ background: "var(--m-bg-card)", borderColor: "var(--m-border)", color: "var(--m-text)" }}
                />
                <button
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, var(--m-accent), var(--m-accent))" }}
                >
                  S&apos;abonner
                </button>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      <MarketingFooter variant="compact" />
    </div>
  );
}
