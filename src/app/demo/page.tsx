import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowRight, BarChart3, Check, Dumbbell, Users } from "lucide-react"
import { Nav } from "@/components/marketing/nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { DemoStartButton } from "@/components/demo/demo-start-button"
import { isDemoCoachClerkId } from "@/lib/demo-account"

export const metadata = {
  title: "Démo interactive",
  description:
    "Explorez Revo sans inscription : tableau de bord, clients, séances, programmes et nutrition avec des données fictives.",
}

const DEMO_FEATURES = [
  {
    icon: BarChart3,
    title: "Tableau de bord complet",
    description: "Statistiques, tendances et activité récente — comme un vrai coach actif.",
  },
  {
    icon: Users,
    title: "Fiche client détaillée",
    description: "Profil Marie Démo : objectifs, mesures, notes, nutrition et suivi.",
  },
  {
    icon: Dumbbell,
    title: "Programmes & séances",
    description: "Programme 3 jours, historique de séances et bibliothèque d'exercices.",
  },
] as const

export default async function DemoPage() {
  const { userId } = await auth()
  if (userId && isDemoCoachClerkId(userId)) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Nav />

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-28 sm:px-10">
        <section className="mx-auto max-w-3xl text-center">
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
            Démo interactive · sans inscription
          </span>

          <h1
            className="font-[family-name:var(--font-display)] font-bold leading-tight tracking-tight text-slate-900"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)" }}
          >
            Testez Revo comme si vous étiez connecté
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Accédez au vrai tableau de bord avec un compte de démonstration. Données fictives,
            aucune carte bancaire, aucune création de compte obligatoire.
          </p>

          <div className="mt-10 flex justify-center">
            <DemoStartButton size="large" />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />
              Données 100 % fictives
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />
              Conforme RGPD (pas de vraies données santé)
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />
              2 min pour tout explorer
            </span>
          </div>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-3">
          {DEMO_FEATURES.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 text-left"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="font-semibold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
            </article>
          ))}
        </section>

        <section className="mt-16 rounded-3xl border border-slate-200 bg-slate-900 px-8 py-10 text-center text-white sm:px-12">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
            Prêt à passer au vrai compte ?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-300">
            La démo ne sauvegarde rien pour vous. Créez un compte gratuit pour vos propres clients
            et vos vrais programmes.
          </p>
          <Link
            href="/sign-up"
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-orange-600 px-7 text-sm font-bold text-white transition hover:bg-orange-500"
          >
            Commencer gratuitement
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
