import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Nav } from "@/components/marketing/nav";
import { AnimateIn, StaggerChildren, StaggerItem } from "@/components/marketing/animate-in";

export const metadata: Metadata = {
  title: "Fonctionnalités",
  description: "Découvrez toutes les fonctionnalités de Revo pour gérer vos clients, programmes et séances.",
};

const FEATURES_FULL = [
  {
    tag: "Gestion clients",
    title: "Tous vos clients, organisés et accessibles",
    description: "Un profil complet pour chaque client : informations personnelles, objectifs, notes, historique de séances, programmes en cours et photos de progression. Retrouvez n'importe quelle information en quelques secondes.",
    points: [
      "Profil client complet (objectifs, notes, historique)",
      "Photos de progression avant/après",
      "Indicateur d'activité et de fidélité",
      "Alerte si un client ne s'est pas entraîné depuis X jours",
      "Export des données client en PDF",
    ],
    accent: "#22c55e",
    direction: "left" as const,
    IllustrationEl: () => (
      <div className="w-full max-w-sm rounded-2xl border p-6" style={{ background: "var(--m-bg)", borderColor: "var(--m-border)" }}>
        <div className="mb-4 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full flex items-center justify-center text-white text-lg font-bold" style={{ background: "#22c55e" }}>M</div>
          <div>
            <p className="font-semibold" style={{ color: "var(--m-text)" }}>Marc Dupont</p>
            <p className="text-xs" style={{ color: "var(--m-text-faint)" }}>Client depuis 4 mois · 18 séances</p>
          </div>
          <span className="ml-auto rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>Actif</span>
        </div>
        <div className="space-y-2">
          {[{ label: "Objectif", value: "Prise de masse" }, { label: "Programme", value: "Push/Pull/Legs" }, { label: "Dernier RM", value: "Squat : 100 kg" }].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between rounded-xl px-4 py-2" style={{ background: "var(--m-bg-section)" }}>
              <span className="text-xs" style={{ color: "var(--m-text-faint)" }}>{label}</span>
              <span className="text-xs font-semibold" style={{ color: "var(--m-text)" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    tag: "Suivi des séances",
    title: "Enregistrez une séance en moins de 2 minutes",
    description: "Une interface pensée pour la vitesse. Pendant ou juste après la séance, enregistrez exercices, séries, répétitions, poids et notes en quelques taps. Tout est sauvegardé automatiquement, lié au bon client.",
    points: [
      "Saisie rapide exercices / séries / répétitions / poids",
      "Suggestions basées sur la séance précédente",
      "Notes vocales transcrites automatiquement",
      "Détection automatique des records personnels",
      "Chronomètre intégré pour les temps de repos",
    ],
    accent: "var(--m-accent)",
    direction: "right" as const,
    IllustrationEl: () => (
      <div className="w-full max-w-sm rounded-2xl border p-6" style={{ background: "var(--m-bg)", borderColor: "var(--m-border)" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--m-text-faint)" }}>Séance · Lundi 6 mai</p>
        {[
          { exercise: "Squat", sets: "4×8", weight: "80 kg", pr: true },
          { exercise: "Leg press", sets: "3×12", weight: "160 kg", pr: false },
          { exercise: "Fentes", sets: "3×10", weight: "20 kg", pr: false },
        ].map(({ exercise, sets, weight, pr }) => (
          <div key={exercise} className="mb-2 flex items-center justify-between rounded-xl px-4 py-2.5" style={{ background: "var(--m-bg-section)" }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--m-text)" }}>{exercise}</p>
              <p className="text-xs" style={{ color: "var(--m-text-faint)" }}>{sets} · {weight}</p>
            </div>
            {pr && <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: "rgba(139,92,246,0.15)", color: "var(--m-accent-mid)" }}>🏆 PR</span>}
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: "Programmes d'entraînement",
    title: "Créez des plans sur mesure, réutilisez-les à l'infini",
    description: "Construisez des programmes structurés (séances par jour, exercices, séries, objectif de charge) et assignez-les à un ou plusieurs clients. Modifiez, dupliquez, versionner.",
    points: [
      "Création par blocs (semaines, séances, exercices)",
      "Assignation à plusieurs clients simultanément",
      "Suivi de l'exécution (séances réalisées vs planifiées)",
      "Progression de charge automatique (surcharge progressive)",
      "Bibliothèque de templates réutilisables",
    ],
    accent: "var(--m-accent)",
    direction: "left" as const,
    IllustrationEl: () => (
      <div className="w-full max-w-sm rounded-2xl border p-6" style={{ background: "var(--m-bg)", borderColor: "var(--m-border)" }}>
        <p className="text-xs font-bold mb-3" style={{ color: "var(--m-accent-mid)" }}>Programme Push / Pull / Legs — 12 semaines</p>
        {["Jour 1 — Push (Poitrine, Épaules, Triceps)", "Jour 2 — Pull (Dos, Biceps)", "Jour 3 — Legs (Quadriceps, Ischio, Mollets)"].map((day, i) => (
          <div key={i} className="mb-2 flex items-center gap-3 rounded-xl px-4 py-2.5" style={{ background: "var(--m-bg-section)" }}>
            <div className="h-6 w-6 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: "var(--m-accent)" }}>{i + 1}</div>
            <p className="text-xs" style={{ color: "var(--m-text)" }}>{day}</p>
          </div>
        ))}
        <p className="mt-3 text-xs text-center" style={{ color: "var(--m-text-faint)" }}>3 clients · Semaine 4/12</p>
      </div>
    ),
  },
  {
    tag: "Bibliothèque d'exercices",
    title: "Des centaines d'exercices prêts à l'emploi",
    description: "Accédez à une bibliothèque complète classée par groupe musculaire, matériel et niveau. Créez vos propres exercices personnalisés avec photos et instructions. Partagez votre bibliothèque entre clients.",
    points: [
      "500+ exercices avec descriptions et illustrations",
      "Filtres : groupe musculaire, matériel, difficulté",
      "Création d'exercices personnalisés avec photo/vidéo",
      "Historique de charge par exercice et par client",
      "Records personnels par exercice automatiquement suivis",
    ],
    accent: "#fbbf24",
    direction: "right" as const,
    IllustrationEl: () => (
      <div className="w-full max-w-sm rounded-2xl border p-6" style={{ background: "var(--m-bg)", borderColor: "var(--m-border)" }}>
        <div className="mb-3 flex gap-2">
          {["Tous", "Poitrine", "Dos", "Jambes"].map((cat, i) => (
            <span key={cat} className="rounded-full px-3 py-1 text-xs font-medium cursor-pointer"
              style={{ background: i === 0 ? "#fbbf24" : "var(--m-bg-section)", color: i === 0 ? "#000" : "var(--m-text-muted)" }}>
              {cat}
            </span>
          ))}
        </div>
        {["Squat", "Développé couché", "Soulevé de terre"].map((ex) => (
          <div key={ex} className="mb-2 flex items-center gap-3 rounded-xl px-4 py-2.5 cursor-pointer hover:opacity-80 transition-opacity" style={{ background: "var(--m-bg-section)" }}>
            <div className="h-8 w-8 rounded-lg flex items-center justify-center text-base" style={{ background: "rgba(251,191,36,0.15)" }}>🏋️</div>
            <p className="text-sm font-semibold" style={{ color: "var(--m-text)" }}>{ex}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: "Statistiques & Analytics",
    title: "Des données qui parlent à vos clients",
    description: "Courbes de charge, volume hebdomadaire, records personnels, répartition par groupe musculaire. Montrez à vos clients des preuves concrètes de leur progression — c'est ce qui les fait rester.",
    points: [
      "Courbes de progression par exercice",
      "Volume hebdomadaire et mensuel",
      "Records personnels avec dates",
      "Rapport de progression partageable avec le client",
      "Comparatif semaine sur semaine / mois sur mois",
    ],
    accent: "var(--m-accent)",
    direction: "left" as const,
    IllustrationEl: () => (
      <div className="w-full max-w-sm rounded-2xl border p-6" style={{ background: "var(--m-bg)", borderColor: "var(--m-border)" }}>
        <p className="text-xs font-semibold mb-4" style={{ color: "var(--m-text)" }}>Progression Squat — 3 derniers mois</p>
        <div className="flex items-end gap-2 h-24">
          {[60, 70, 72, 75, 78, 80, 82, 85, 90, 95, 97, 100].map((val, i) => (
            <div key={i} className="flex-1 rounded-sm" style={{ height: `${(val / 100) * 100}%`, background: `rgba(139,92,246,${0.3 + i * 0.06})` }} />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--m-text-faint)" }}>Mars</span>
          <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: "rgba(139,92,246,0.15)", color: "var(--m-accent-mid)" }}>+67% en 3 mois</span>
          <span className="text-xs" style={{ color: "var(--m-text-faint)" }}>Mai</span>
        </div>
      </div>
    ),
  },
  {
    tag: "Paiements & Abonnements",
    title: "Gérez vos revenus sereinement",
    description: "Suivez vos paiements, gérez vos abonnements clients et consultez vos revenus en un coup d'œil. Plan FREE pour démarrer, plan Pro pour développer votre activité sans limite.",
    points: [
      "Suivi des paiements par client",
      "Tableau de bord revenus mensuel",
      "Relances automatiques en cas de retard",
      "Facturation intégrée (bientôt)",
      "Export comptable (bientôt)",
    ],
    accent: "#10b981",
    direction: "right" as const,
    IllustrationEl: () => (
      <div className="w-full max-w-sm rounded-2xl border p-6" style={{ background: "var(--m-bg)", borderColor: "var(--m-border)" }}>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold" style={{ color: "var(--m-text)" }}>Revenus — Mai 2026</p>
          <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>+12%</span>
        </div>
        <p className="text-4xl font-[family-name:var(--font-display)] font-bold mb-4" style={{ color: "#10b981" }}>3 480 €</p>
        {[{ label: "Abonnements actifs", val: "12" }, { label: "En attente", val: "1" }, { label: "Ce mois", val: "29 séances" }].map(({ label, val }) => (
          <div key={label} className="mb-2 flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "var(--m-bg-section)" }}>
            <span className="text-xs" style={{ color: "var(--m-text-faint)" }}>{label}</span>
            <span className="text-xs font-bold" style={{ color: "var(--m-text)" }}>{val}</span>
          </div>
        ))}
      </div>
    ),
  },
];

export default function FonctionnalitesPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--m-bg)", color: "var(--m-text)" }}>
      <Nav />

      {/* Hero */}
      <section className="relative px-6 pt-36 pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px]"
            style={{ background: "radial-gradient(ellipse, var(--m-glow-primary) 0%, transparent 70%)", filter: "blur(40px)" }} />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl">
          <AnimateIn>
            <span className="mb-4 inline-block rounded-full border px-4 py-1.5 text-sm font-medium"
              style={{ borderColor: "rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.08)", color: "var(--m-accent-mid)" }}>
              Fonctionnalités
            </span>
            <h1 className="mt-4 text-6xl font-[family-name:var(--font-display)] font-bold tracking-tight" style={{ color: "var(--m-text)" }}>
              Tout ce dont un coach a besoin.
            </h1>
            <p className="mt-5 text-xl leading-relaxed" style={{ color: "var(--m-text-muted)" }}>
              Revo centralise tous vos outils de coaching en une seule plateforme simple,
              rapide et conçue pour le terrain.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, var(--m-accent), var(--m-accent))", boxShadow: "0 8px 32px rgba(139,92,246,0.3)" }}>
                Commencer gratuitement <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/tarifs" className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-all hover:opacity-70"
                style={{ borderColor: "var(--m-border)", color: "var(--m-text-muted)" }}>
                Voir les tarifs
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Features alternées */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-6xl space-y-28">
          {FEATURES_FULL.map(({ tag, title, description, points, accent, direction, IllustrationEl }, idx) => (
            <AnimateIn key={tag} direction={direction} delay={0.1}>
              <div className={`grid items-center gap-12 lg:grid-cols-2 ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                style={{ direction: idx % 2 === 1 ? "rtl" : "ltr" }}>
                <div style={{ direction: "ltr" }}>
                  <span className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ background: `${accent}18`, color: accent }}>
                    {tag}
                  </span>
                  <h2 className="text-4xl font-[family-name:var(--font-display)] font-bold tracking-tight" style={{ color: "var(--m-text)" }}>
                    {title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--m-text-muted)" }}>{description}</p>
                  <ul className="mt-6 space-y-2.5">
                    {points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm" style={{ color: "var(--m-text-muted)" }}>
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: accent }} strokeWidth={2.5} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-center" style={{ direction: "ltr" }}>
                  <IllustrationEl />
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20" style={{ background: "var(--m-bg-section)" }}>
        <AnimateIn>
          <div className="mx-auto max-w-3xl rounded-3xl border px-10 py-14 text-center"
            style={{ background: "rgba(139,92,246,0.07)", borderColor: "rgba(139,92,246,0.25)" }}>
            <h2 className="text-4xl font-[family-name:var(--font-display)] font-bold" style={{ color: "var(--m-text)" }}>
              Prêt à tester Revo ?
            </h2>
            <p className="mt-3 text-base" style={{ color: "var(--m-text-muted)" }}>Gratuit, sans engagement, opérationnel en 2 minutes.</p>
            <Link href="/sign-up"
              className="mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, var(--m-accent), var(--m-accent))" }}>
              Créer mon compte gratuit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </AnimateIn>
      </section>

      {/* Footer minimal */}
      <footer className="border-t px-6 py-8 text-center" style={{ borderColor: "var(--m-border)" }}>
        <p className="text-xs" style={{ color: "var(--m-text-faint)" }}>© 2026 Revo. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
