"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, X, HelpCircle } from "lucide-react";
import { Nav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
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
  { q: "Comment fonctionne la facturation ?", a: "Lorsque la facturation en ligne sera activée, les abonnements pourront être réglés par carte bancaire via Stripe : aucun numéro de carte ne transite par nos serveurs. Les factures et obligations légales (TVA, mentions) suivront la réglementation en vigueur au moment de l'activation." },
  { q: "Est-ce que Revo est adapté aux salles de sport ?", a: "Revo est conçu pour les coachs indépendants et les personal trainers. Pour les salles multi-coachs, contactez-nous pour un tarif sur mesure." },
];

export default function TarifsPage() {
  const [annual, setAnnual] = useState(false);
  const monthlyPrice = 29;
  const annualMonthlyPrice = Math.round(monthlyPrice * 0.8);
  const savings = (monthlyPrice - annualMonthlyPrice) * 12;

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <Nav />

      {/* Hero */}
      <section className="border-b border-slate-200 px-8 pb-20 pt-36 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <AnimateIn>
            <div className="mb-8 h-0.5 w-10" style={{ background: "#ea580c" }} />
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "#ea580c" }}>
              Tarifs
            </p>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <h1
                className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.92] tracking-[-0.03em] text-slate-900"
                style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
              >
                Commencez<br />sans risque.
              </h1>
              {/* Annual toggle */}
              <div className="flex items-center gap-3 pb-2">
                <span className={`text-sm font-medium ${annual ? "text-slate-400" : "text-slate-900"}`}>Mensuel</span>
                <button
                  onClick={() => setAnnual(!annual)}
                  className="relative h-6 w-11 rounded-full transition-colors"
                  style={{ background: annual ? "#ea580c" : "#e2e8f0" }}
                >
                  <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                    style={{ transform: annual ? "translateX(20px)" : "translateX(2px)" }} />
                </button>
                <span className={`text-sm font-medium ${annual ? "text-slate-900" : "text-slate-400"}`}>
                  Annuel
                  <span className="ml-2 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-600">
                    −20% · {savings} € économisés
                  </span>
                </span>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="px-8 py-20 sm:px-12">
        <StaggerChildren className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Free */}
          <StaggerItem>
            <div className="h-full rounded-3xl border p-8" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#94a3b8" }}>Gratuit</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-5xl font-[family-name:var(--font-display)] font-bold" style={{ color: "#0f172a" }}>0 €</span>
                <span className="text-sm" style={{ color: "#94a3b8" }}>/ mois</span>
              </div>
              <p className="mt-2 text-sm" style={{ color: "#475569" }}>Pour découvrir Revo sans risque.</p>
              <ul className="mt-8 space-y-3">
                {FREE_FEATURES.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 text-sm" style={{ color: "#475569" }}>
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "#ea580c" }} strokeWidth={2.5} />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up" className="mt-8 flex h-11 w-full items-center justify-center rounded-xl border text-sm font-semibold transition-all hover:opacity-70"
                style={{ borderColor: "#e2e8f0", color: "#0f172a" }}>
                Créer mon compte gratuit
              </Link>
            </div>
          </StaggerItem>

          {/* Pro */}
          <StaggerItem>
            <div className="relative h-full rounded-3xl border p-8"
              style={{ background: "rgba(234, 88, 12, 0.05)", borderColor: "rgba(234, 88, 12, 0.2)", boxShadow: "0 0 80px rgba(234, 88, 12, 0.08)" }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, #ea580c, #c2410c)" }}>
                Recommandé
              </div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#f97316" }}>Pro</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-5xl font-[family-name:var(--font-display)] font-bold" style={{ color: "#0f172a" }}>
                  {annual ? annualMonthlyPrice : monthlyPrice} €
                </span>
                <span className="text-sm" style={{ color: "#94a3b8" }}>/ mois</span>
              </div>
              {annual && (
                <p className="mt-1 text-xs font-medium" style={{ color: "#ea580c" }}>
                  Facturé {annualMonthlyPrice * 12} € / an · {savings} € économisés
                </p>
              )}
              <p className="mt-2 text-sm" style={{ color: "#475569" }}>Pour les coachs qui vivent de leur activité.</p>
              <ul className="mt-8 space-y-3">
                {PRO_FEATURES.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 text-sm" style={{ color: "#0f172a" }}>
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "#f97316" }} strokeWidth={2.5} />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up" className="mt-8 flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #ea580c, #c2410c)", boxShadow: "0 4px 20px rgba(234, 88, 12, 0.2)" }}>
                Essayer Pro 14 jours — gratuit <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
              <p className="mt-3 text-center text-xs" style={{ color: "#94a3b8" }}>Sans carte bancaire · Annulation à tout moment</p>
            </div>
          </StaggerItem>
        </StaggerChildren>
      </section>

      {/* Comparison table */}
      <section className="px-6 py-20" style={{ background: "#f8fafc" }}>
        <div className="mx-auto max-w-3xl">
          <AnimateIn className="mb-10 text-center">
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold" style={{ color: "#0f172a" }}>
              Comparaison complète
            </h2>
          </AnimateIn>
          <div className="overflow-hidden rounded-3xl border" style={{ borderColor: "#e2e8f0" }}>
            <div className="grid grid-cols-3 border-b px-6 py-4" style={{ borderColor: "#e2e8f0", background: "#ffffff" }}>
              <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>Fonctionnalité</p>
              <p className="text-center text-sm font-semibold" style={{ color: "#94a3b8" }}>Gratuit</p>
              <p className="text-center text-sm font-semibold" style={{ color: "#f97316" }}>Pro</p>
            </div>
            {COMPARISON.map(({ feature, free, pro }, idx) => (
              <div key={feature} className="grid grid-cols-3 border-b px-6 py-4 last:border-0"
                style={{ borderColor: "#e2e8f0", background: "#ffffff" }}>
                <p className="text-sm" style={{ color: "#475569" }}>{feature}</p>
                <div className="flex justify-center">
                  {typeof free === "boolean" ? (
                    free ? <Check className="h-4 w-4" style={{ color: "#ea580c" }} /> : <X className="h-4 w-4" style={{ color: "#94a3b8" }} />
                  ) : (
                    <span className="text-xs font-medium" style={{ color: "#475569" }}>{free}</span>
                  )}
                </div>
                <div className="flex justify-center">
                  {typeof pro === "boolean" ? (
                    pro ? <Check className="h-4 w-4" style={{ color: "#f97316" }} /> : <X className="h-4 w-4" style={{ color: "#94a3b8" }} />
                  ) : (
                    <span className="text-xs font-medium" style={{ color: "#f97316" }}>{pro}</span>
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
            <h2 className="text-3xl font-[family-name:var(--font-display)] font-bold" style={{ color: "#0f172a" }}>
              Questions fréquentes
            </h2>
          </AnimateIn>
          <StaggerChildren className="space-y-4">
            {FAQ.map(({ q, a }) => (
              <StaggerItem key={q}>
                <div className="rounded-2xl border p-6" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
                  <div className="flex items-start gap-3">
                    <HelpCircle className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "#ea580c" }} />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "#0f172a" }}>{q}</p>
                      <p className="mt-2 text-sm leading-relaxed" style={{ color: "#475569" }}>{a}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20" style={{ background: "#f8fafc" }}>
        <AnimateIn>
          <div className="mx-auto max-w-3xl rounded-3xl border px-10 py-14 text-center"
            style={{ background: "rgba(234, 88, 12, 0.05)", borderColor: "rgba(234, 88, 12, 0.2)" }}>
            <h2 className="text-4xl font-[family-name:var(--font-display)] font-bold" style={{ color: "#0f172a" }}>
              Prêt à démarrer ?
            </h2>
            <p className="mt-3 text-base" style={{ color: "#475569" }}>Créez votre compte gratuit en 2 minutes. Aucune carte bancaire requise.</p>
            <Link href="/sign-up"
              className="mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #ea580c, #c2410c)" }}>
              Créer mon compte gratuit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </AnimateIn>
      </section>

      <MarketingFooter variant="compact" />
    </div>
  );
}
