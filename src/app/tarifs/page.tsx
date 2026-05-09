"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, X, HelpCircle } from "lucide-react";
import { Nav } from "@/components/marketing/nav";
import { AnimateIn, StaggerChildren, StaggerItem } from "@/components/marketing/animate-in";

const FREE_FEATURES = [
  "Jusqu'à 5 clients actifs",
  "Séances illimitées",
  "Bibliothèque d'exercices globale",
  "Création de programmes (limité à 3)",
  "Statistiques de base",
  "Support par email",
];

const PRO_FEATURES = [
  "Clients illimités",
  "Séances illimitées",
  "Bibliothèque d'exercices complète + personnalisée",
  "Programmes illimités",
  "Statistiques avancées & courbes",
  "Records personnels automatiques",
  "Export PDF des rapports",
  "Support prioritaire",
  "Accès aux nouvelles fonctionnalités en avant-première",
];

const COMPARISON = [
  { feature: "Clients actifs",            free: "5 max",   pro: "Illimités" },
  { feature: "Séances enregistrées",      free: true,      pro: true },
  { feature: "Bibliothèque d'exercices",  free: "500+",    pro: "500+ + perso" },
  { feature: "Programmes",               free: "3 max",   pro: "Illimités" },
  { feature: "Statistiques de base",      free: true,      pro: true },
  { feature: "Courbes de progression",    free: false,     pro: true },
  { feature: "Records personnels (PR)",   free: false,     pro: true },
  { feature: "Export PDF",               free: false,     pro: true },
  { feature: "Support",                  free: "Email",   pro: "Prioritaire" },
  { feature: "Nouvelles fonctionnalités", free: false,     pro: "En avant-première" },
];

const FAQ = [
  { q: "Puis-je changer de plan à tout moment ?", a: "Oui, vous pouvez passer du plan gratuit au plan Pro à n'importe quel moment, et inversement. Sans engagement de durée." },
  { q: "Y a-t-il une période d'essai pour le plan Pro ?", a: "Oui, le plan Pro inclut 14 jours d'essai gratuit sans carte bancaire requise. Annulation à tout moment." },
  { q: "Mes données sont-elles conservées si je repasse en gratuit ?", a: "Absolument. Toutes vos données (clients, séances, programmes) sont conservées. Seule l'accès aux fonctionnalités Pro est restreint." },
  { q: "Comment fonctionne la facturation ?", a: "La facturation est mensuelle ou annuelle (avec 2 mois offerts). Vous recevez une facture par email chaque mois. Paiement par carte bancaire via Stripe." },
  { q: "Est-ce que Revo est adapté aux salles de sport ?", a: "Revo est conçu pour les coachs indépendants et les personal trainers. Pour les salles multi-coachs, contactez-nous pour un tarif sur mesure." },
];

export default function TarifsPage() {
  const [annual, setAnnual] = useState(false);
  const monthlyPrice = 29;
  const annualMonthlyPrice = Math.round(monthlyPrice * 0.8);
  const savings = (monthlyPrice - annualMonthlyPrice) * 12;

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--m-bg)", color: "var(--m-text)" }}>
      <Nav />

      {/* Hero */}
      <section className="relative px-6 pt-36 pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px]"
            style={{ background: "radial-gradient(ellipse, var(--m-glow-primary) 0%, transparent 70%)", filter: "blur(40px)" }} />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl">
          <AnimateIn>
            <span className="mb-4 inline-block rounded-full border px-4 py-1.5 text-sm font-medium"
              style={{ borderColor: "rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.08)", color: "var(--m-accent-mid)" }}>
              Tarifs
            </span>
            <h1 className="mt-4 text-6xl font-[family-name:var(--font-display)] font-bold tracking-tight" style={{ color: "var(--m-text)" }}>
              Commencez sans risque.
            </h1>
            <p className="mt-5 text-xl" style={{ color: "var(--m-text-muted)" }}>
              Gratuit pour démarrer. Pro quand vous êtes prêt à scaler.
            </p>

            {/* Annual toggle */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <span className="text-sm font-medium" style={{ color: annual ? "var(--m-text-faint)" : "var(--m-text)" }}>Mensuel</span>
              <button
                onClick={() => setAnnual(!annual)}
                className="relative h-6 w-11 rounded-full transition-colors"
                style={{ background: annual ? "var(--m-accent)" : "var(--m-border)" }}
              >
                <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                  style={{ transform: annual ? "translateX(20px)" : "translateX(2px)" }} />
              </button>
              <span className="text-sm font-medium" style={{ color: annual ? "var(--m-text)" : "var(--m-text-faint)" }}>
                Annuel
                <span className="ml-1.5 rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
                  -20% · {savings} € économisés
                </span>
              </span>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="px-6 pb-20">
        <StaggerChildren className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Free */}
          <StaggerItem>
            <div className="h-full rounded-3xl border p-8" style={{ background: "var(--m-bg-card)", borderColor: "var(--m-border)" }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--m-text-faint)" }}>Gratuit</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-5xl font-[family-name:var(--font-display)] font-bold" style={{ color: "var(--m-text)" }}>0 €</span>
                <span className="text-sm" style={{ color: "var(--m-text-faint)" }}>/ mois</span>
              </div>
              <p className="mt-2 text-sm" style={{ color: "var(--m-text-muted)" }}>Pour découvrir Revo sans risque.</p>
              <ul className="mt-8 space-y-3">
                {FREE_FEATURES.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 text-sm" style={{ color: "var(--m-text-muted)" }}>
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "var(--m-accent)" }} strokeWidth={2.5} />
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

          {/* Pro */}
          <StaggerItem>
            <div className="relative h-full rounded-3xl border p-8"
              style={{ background: "rgba(139,92,246,0.07)", borderColor: "rgba(139,92,246,0.3)", boxShadow: "0 0 80px rgba(139,92,246,0.1)" }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, var(--m-accent), var(--m-accent))" }}>
                Recommandé
              </div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--m-accent-mid)" }}>Pro</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-5xl font-[family-name:var(--font-display)] font-bold" style={{ color: "var(--m-text)" }}>
                  {annual ? annualMonthlyPrice : monthlyPrice} €
                </span>
                <span className="text-sm" style={{ color: "var(--m-text-faint)" }}>/ mois</span>
              </div>
              {annual && (
                <p className="mt-1 text-xs font-medium" style={{ color: "#22c55e" }}>
                  Facturé {annualMonthlyPrice * 12} € / an · {savings} € économisés
                </p>
              )}
              <p className="mt-2 text-sm" style={{ color: "var(--m-text-muted)" }}>Pour les coachs qui vivent de leur activité.</p>
              <ul className="mt-8 space-y-3">
                {PRO_FEATURES.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 text-sm" style={{ color: "var(--m-text)" }}>
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "var(--m-accent-mid)" }} strokeWidth={2.5} />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up" className="mt-8 flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, var(--m-accent), var(--m-accent))", boxShadow: "0 4px 20px rgba(139,92,246,0.3)" }}>
                Essayer Pro 14 jours — gratuit <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
              <p className="mt-3 text-center text-xs" style={{ color: "var(--m-text-faint)" }}>Sans carte bancaire · Annulation à tout moment</p>
            </div>
          </StaggerItem>
        </StaggerChildren>
      </section>

      {/* Comparison table */}
      <section className="px-6 py-20" style={{ background: "var(--m-bg-section)" }}>
        <div className="mx-auto max-w-3xl">
          <AnimateIn className="mb-10 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold" style={{ color: "var(--m-text)" }}>
              Comparaison complète
            </h2>
          </AnimateIn>
          <div className="overflow-hidden rounded-3xl border" style={{ borderColor: "var(--m-border)" }}>
            <div className="grid grid-cols-3 border-b px-6 py-4" style={{ borderColor: "var(--m-border)", background: "var(--m-bg-card)" }}>
              <p className="text-sm font-semibold" style={{ color: "var(--m-text)" }}>Fonctionnalité</p>
              <p className="text-center text-sm font-semibold" style={{ color: "var(--m-text-faint)" }}>Gratuit</p>
              <p className="text-center text-sm font-semibold" style={{ color: "var(--m-accent-mid)" }}>Pro</p>
            </div>
            {COMPARISON.map(({ feature, free, pro }, idx) => (
              <div key={feature} className="grid grid-cols-3 border-b px-6 py-4 last:border-0"
                style={{ borderColor: "var(--m-border)", background: idx % 2 === 0 ? "var(--m-bg-card)" : "var(--m-bg)" }}>
                <p className="text-sm" style={{ color: "var(--m-text-muted)" }}>{feature}</p>
                <div className="flex justify-center">
                  {typeof free === "boolean" ? (
                    free ? <Check className="h-4 w-4" style={{ color: "#22c55e" }} /> : <X className="h-4 w-4" style={{ color: "var(--m-text-faint)" }} />
                  ) : (
                    <span className="text-xs font-medium" style={{ color: "var(--m-text-muted)" }}>{free}</span>
                  )}
                </div>
                <div className="flex justify-center">
                  {typeof pro === "boolean" ? (
                    pro ? <Check className="h-4 w-4" style={{ color: "var(--m-accent-mid)" }} /> : <X className="h-4 w-4" style={{ color: "var(--m-text-faint)" }} />
                  ) : (
                    <span className="text-xs font-medium" style={{ color: "var(--m-accent-mid)" }}>{pro}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <AnimateIn className="mb-10 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold" style={{ color: "var(--m-text)" }}>
              Questions fréquentes
            </h2>
          </AnimateIn>
          <StaggerChildren className="space-y-4">
            {FAQ.map(({ q, a }) => (
              <StaggerItem key={q}>
                <div className="rounded-2xl border p-6" style={{ background: "var(--m-bg-card)", borderColor: "var(--m-border)" }}>
                  <div className="flex items-start gap-3">
                    <HelpCircle className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "var(--m-accent)" }} />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--m-text)" }}>{q}</p>
                      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--m-text-muted)" }}>{a}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20" style={{ background: "var(--m-bg-section)" }}>
        <AnimateIn>
          <div className="mx-auto max-w-3xl rounded-3xl border px-10 py-14 text-center"
            style={{ background: "rgba(139,92,246,0.07)", borderColor: "rgba(139,92,246,0.25)" }}>
            <h2 className="text-4xl font-[family-name:var(--font-display)] font-bold" style={{ color: "var(--m-text)" }}>
              Prêt à démarrer ?
            </h2>
            <p className="mt-3 text-base" style={{ color: "var(--m-text-muted)" }}>Créez votre compte gratuit en 2 minutes. Aucune carte bancaire requise.</p>
            <Link href="/sign-up"
              className="mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, var(--m-accent), var(--m-accent))" }}>
              Créer mon compte gratuit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </AnimateIn>
      </section>

      <footer className="border-t px-6 py-8 text-center" style={{ borderColor: "var(--m-border)" }}>
        <p className="text-xs" style={{ color: "var(--m-text-faint)" }}>© 2026 Revo. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
