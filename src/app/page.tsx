import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  MessageSquare,
  FileSpreadsheet,
  BookOpen,
  Star,
} from "lucide-react";
import { Nav } from "@/components/marketing/nav";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <Image
          src="/hero-bg.jpg"
          alt="Coach sportif avec client"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-zinc-950/72" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <span className="mb-6 inline-flex items-center rounded-full bg-green-500/15 px-4 py-1.5 text-sm font-semibold text-green-400 ring-1 ring-green-500/30">
              Pour coachs sportifs &amp; personal trainers
            </span>

            <h1 className="mt-4 text-6xl font-extrabold leading-[1.05] tracking-tight text-white">
              Vos clients progressent.
              <br />
              <span className="text-green-400">Ils le savent.</span>
              <br />
              Ils restent.
            </h1>

            <p className="mt-6 max-w-lg text-xl leading-relaxed text-zinc-300">
              Fini les séances perdues dans WhatsApp et les carnets illisibles.
              CoachTrack centralise tout — et vos clients voient leurs résultats
              en temps réel.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-green-500/25 transition-all hover:bg-green-400"
              >
                Créer mon compte coach
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#probleme"
                className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Je me reconnais
              </Link>
            </div>

            <p className="mt-5 text-sm text-zinc-500">
              Gratuit pour commencer · Sans carte bancaire · 2 minutes
            </p>
          </div>

          {/* Floating proof cards */}
          <div className="absolute bottom-12 right-6 hidden flex-col gap-3 lg:flex">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/80 px-5 py-4 backdrop-blur-md">
              <div className="flex -space-x-2">
                {["bg-green-400", "bg-blue-400", "bg-orange-400"].map((c) => (
                  <div
                    key={c}
                    className={`h-7 w-7 rounded-full ${c} border-2 border-zinc-900`}
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Clients fidélisés
                </p>
                <p className="text-xs text-zinc-400">Ils voient leur progres</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-900/80 px-5 py-4 backdrop-blur-md">
              <span className="text-2xl font-bold text-green-400">+34%</span>
              <div>
                <p className="text-sm font-semibold text-white">
                  Rétention moyenne
                </p>
                <p className="text-xs text-zinc-400">vs suivi sur WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────── */}
      <section id="probleme" className="bg-zinc-50 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-600">
              Soyons honnêtes
            </p>
            <h2 className="text-5xl font-extrabold tracking-tight text-zinc-900">
              Tu te reconnais ?
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {[
              {
                icon: MessageSquare,
                title: "Le suivi sur WhatsApp",
                description:
                  "Tes notes de séance sont éparpillées dans des conversations. Retrouver ce qu'a fait un client il y a 3 semaines prend 10 minutes.",
              },
              {
                icon: FileSpreadsheet,
                title: "Le tableau Excel ingérable",
                description:
                  "Tu as essayé d'organiser ça dans un tableur. Il est devenu illisible au 5ème client. Tu as arrêté de le mettre à jour.",
              },
              {
                icon: BookOpen,
                title: "Le carnet papier",
                description:
                  "Pratique sur le moment, inutile à distance. Impossible de montrer une courbe de progression à ton client. Il repart sans voir ses progrès.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-3xl border border-zinc-200 bg-white p-7"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                  <Icon className="h-5 w-5 text-red-400" strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-base font-bold text-zinc-900">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-500">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl bg-zinc-900 px-10 py-8 text-center">
            <p className="text-xl font-bold text-white">
              Le vrai problème, c&apos;est que tes clients ne{" "}
              <span className="text-green-400">voient pas</span> leurs progrès.
            </p>
            <p className="mt-3 text-zinc-400">
              Quand un client ne perçoit pas son évolution, il doute, il
              décroche. Il annule. Il part. Pas parce que tu es un mauvais
              coach — parce qu&apos;il n&apos;a pas de preuves de ses efforts.
            </p>
          </div>
        </div>
      </section>

      {/* ── SOLUTION ─────────────────────────────────────────────── */}
      <section id="fonctionnalites" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-600">
              La solution
            </p>
            <h2 className="text-5xl font-extrabold tracking-tight text-zinc-900">
              Ce que vos clients
              <br />
              ressentent avec CoachTrack.
            </h2>
          </div>

          <div className="grid grid-cols-3 grid-rows-2 gap-4">
            <div className="col-span-2 rounded-3xl bg-zinc-950 p-8 text-white">
              <span className="mb-4 inline-block rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">
                Fidélisation
              </span>
              <h3 className="text-2xl font-bold">
                Ils voient qu&apos;ils progressent. Ils restent.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Chaque séance est enregistrée, chaque record noté. Votre client
                peut voir en un coup d&apos;œil qu&apos;il soulève 20% de plus
                qu&apos;il y a 2 mois. Cette preuve concrète, c&apos;est ce qui
                le fait revenir.
              </p>
              <div className="mt-6 flex items-end gap-1.5 h-16">
                {[25, 32, 30, 42, 45, 40, 58, 62, 78].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-green-500/60"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="col-span-1 rounded-3xl bg-green-50 p-7">
              <span className="mb-4 inline-block rounded-full bg-green-200 px-3 py-1 text-xs font-semibold text-green-800">
                Professionalisme
              </span>
              <h3 className="text-lg font-bold text-zinc-900">
                Vous arrivez préparé à chaque séance.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Chaque client, chaque historique, accessible en 10 secondes.
                Finies les &quot;attends je cherche&quot; devant le client.
              </p>
            </div>

            <div className="col-span-1 rounded-3xl border border-zinc-200 p-7">
              <span className="mb-4 inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                Gain de temps
              </span>
              <h3 className="text-lg font-bold text-zinc-900">
                30 min d&apos;admin économisées par semaine.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                Enregistrement rapide pendant ou après la séance. Programmes
                réutilisables. Zéro double saisie.
              </p>
            </div>

            <div className="col-span-2 rounded-3xl bg-zinc-100 p-8">
              <span className="mb-4 inline-block rounded-full bg-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-700">
                Croissance
              </span>
              <h3 className="text-xl font-bold text-zinc-900">
                Un coach organisé, c&apos;est un coach recommandé.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Vos clients satisfaits parlent de vous. Leur progression visible
                devient votre meilleure publicité. Le bouche-à-oreille, ça se
                construit sur des résultats prouvés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ──────────────────────────────────────────── */}
      <section className="bg-zinc-950 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-green-400 text-green-400"
              />
            ))}
          </div>
          <blockquote className="text-2xl font-semibold leading-relaxed text-white">
            &ldquo;Avant CoachTrack, je perdais 30 minutes par client juste à
            retrouver ses anciens programmes. Maintenant j&apos;arrive en
            séance, j&apos;ouvre l&apos;appli, tout est là. Mes clients voient
            leur courbe de progression — deux d&apos;entre eux ont pris un
            abonnement annuel après avoir vu leurs résultats.&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-500/20 ring-2 ring-green-500/30 flex items-center justify-center text-lg font-bold text-green-400">
              M
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">
                Marc — Personal trainer indépendant
              </p>
              <p className="text-xs text-zinc-500">
                Utilise CoachTrack depuis 4 mois · 18 clients actifs
              </p>
            </div>
          </div>
          {/* Note: remplacer par un vrai témoignage avant le lancement */}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="comment" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-600">
              Comment ça marche
            </p>
            <h2 className="text-5xl font-extrabold tracking-tight text-zinc-900">
              Opérationnel en 3 étapes.
            </h2>
          </div>

          <div className="relative grid grid-cols-3 gap-10">
            <div className="absolute top-7 left-[16.5%] right-[16.5%] h-px bg-zinc-200 hidden lg:block" />

            {[
              {
                number: "01",
                title: "Créez votre compte",
                description:
                  "2 minutes. Gratuit. Pas de carte bancaire. Vous êtes opérationnel immédiatement.",
              },
              {
                number: "02",
                title: "Ajoutez votre premier client",
                description:
                  "Prénom, objectif, niveau. On vous guide pas à pas à l'inscription.",
              },
              {
                number: "03",
                title: "Enregistrez la première séance",
                description:
                  "Exercices, séries, poids. Votre client peut voir ses résultats dès la fin de la séance.",
              },
            ].map(({ number, title, description }) => (
              <div key={number} className="relative text-center">
                <div className="relative z-10 mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-lg font-extrabold text-zinc-900 shadow-sm">
                  {number}
                </div>
                <h3 className="text-lg font-bold text-zinc-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────── */}
      <section id="tarifs" className="bg-zinc-50 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-600">
              Tarifs
            </p>
            <h2 className="text-5xl font-extrabold tracking-tight text-zinc-900">
              Commencez sans risque.
            </h2>
            <p className="mt-4 text-lg text-zinc-500">
              Gratuit pour démarrer. Payant seulement quand vous en avez
              vraiment besoin.
            </p>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-5">
            <div className="rounded-3xl border border-zinc-200 bg-white p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Gratuit
              </p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-zinc-900">
                  0 €
                </span>
                <span className="text-sm text-zinc-400">/ mois</span>
              </div>
              <p className="mt-2 text-sm text-zinc-500">
                Parfait pour démarrer et tester.
              </p>
              <ul className="mt-8 space-y-3.5">
                {[
                  "Jusqu'à 5 clients",
                  "Séances illimitées",
                  "Bibliothèque d'exercices",
                  "Support par email",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 text-sm text-zinc-600"
                  >
                    <Check
                      className="h-4 w-4 flex-shrink-0 text-green-500"
                      strokeWidth={2.5}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 flex h-11 w-full items-center justify-center rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50"
              >
                Créer mon compte gratuit
              </Link>
            </div>

            <div className="rounded-3xl bg-zinc-950 p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Pro
              </p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-white">
                  29 €
                </span>
                <span className="text-sm text-zinc-500">/ mois</span>
              </div>
              <p className="mt-2 text-sm text-zinc-500">
                Pour les coachs qui vivent de leur activité.
              </p>
              <ul className="mt-8 space-y-3.5">
                {[
                  "Clients illimités",
                  "Programmes avancés",
                  "Courbes de progression",
                  "Support prioritaire",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 text-sm text-zinc-300"
                  >
                    <Check
                      className="h-4 w-4 flex-shrink-0 text-green-500"
                      strokeWidth={2.5}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 flex h-11 w-full items-center justify-center rounded-xl bg-green-500 text-sm font-semibold text-white transition-colors hover:bg-green-400"
              >
                Essayer Pro gratuitement
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section className="bg-green-600 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-5xl font-extrabold tracking-tight text-white">
            Votre prochain client
            <br />
            mérite mieux qu&apos;un carnet.
          </h2>
          <p className="mt-5 text-lg text-green-100">
            Rejoignez les coachs qui ont arrêté de bricoler et commencé à
            professionnaliser leur suivi.
          </p>
          <Link
            href="/sign-up"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-green-700 shadow-xl shadow-green-900/20 transition-all hover:bg-green-50"
          >
            Créer mon compte coach — c&apos;est gratuit
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-sm text-green-200/70">
            Sans carte bancaire · Sans engagement
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 bg-zinc-950 px-6 py-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-sm font-bold text-zinc-400">CoachTrack</span>
          <p className="text-xs text-zinc-600">
            © 2026 CoachTrack. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-xs text-zinc-600 transition-colors hover:text-zinc-400"
            >
              Confidentialité
            </Link>
            <Link
              href="#"
              className="text-xs text-zinc-600 transition-colors hover:text-zinc-400"
            >
              CGU
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
