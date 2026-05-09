import type { Metadata } from "next"
import { LegalDocShell } from "@/components/marketing/legal-doc-shell"

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Traitement des données personnelles, RGPD, cookies et sous-traitants — Revo.",
}

export default function ConfidentialitePage() {
  return (
    <LegalDocShell
      title="Politique de confidentialité"
      updatedLabel="Dernière mise à jour : 9 mai 2026 — À compléter avec vos informations légales (raison sociale, siège, contact DPO ou référent)."
    >
      <p>
        La présente politique décrit comment <strong>Revo</strong> (ci-après «
        nous ») traite les données personnelles dans le cadre du service SaaS
        proposé aux coachs sportifs. Elle doit être complétée par vos mentions
        d&apos;identité juridique et revue par un professionnel du droit adapté
        à votre situation.
      </p>

      <h2>1. Responsable du traitement</h2>
      <p>
        Indiquez ici la dénomination sociale, le siège, le SIREN et un courriel
        de contact RGPD (ou DPD/DPO le cas échéant).
      </p>

      <h2>2. Données traitées</h2>
      <ul>
        <li>
          <strong>Compte coach</strong> : identifiant Clerk, adresse e-mail,
          nom, informations de profil professionnel saisies dans l&apos;application.
        </li>
        <li>
          <strong>Clients du coach</strong> : identité, coordonnées, données
          sportives (programmes, séances), éventuellement{" "}
          <strong>
            données de santé ou sensibles
          </strong>{" "}
          (notes médicales, blessures, mensurations, poids, etc.) lorsque vous
          les enregistrez. Ces catégories relèvent notamment de l&apos;article 9
          du RGPD : elles ne doivent être collectées qu&apos;avec un fondement
          légal approprié (souvent consentement explicite du client concerné).
        </li>
        <li>
          <strong>Contenus</strong> : exercices, images chargées via notre
          intégration d&apos;hébergement média (signature sécurisée côté serveur).
        </li>
        <li>
          <strong>Paiements</strong> : lorsque la facturation en ligne sera
          activée, les données de carte sont traitées exclusivement par Stripe ;
          nous ne les stockons pas sur nos serveurs.
        </li>
      </ul>

      <h2>3. Finalités et bases légales</h2>
      <ul>
        <li>
          Exécution du contrat : fourniture du service, authentification,
          synchronisation des données coach/clients.
        </li>
        <li>
          Obligations légales : conservation comptable / fiscalité lorsque
          applicable.
        </li>
        <li>
          Données sensibles : traitement uniquement si une base légale prévue à
          l&apos;article 9 du RGPD est applicable et documentée (consentement
          explicite, etc.).
        </li>
      </ul>

      <h2>4. Sous-traitants (hébergement & outils)</h2>
      <p>
        Des sous-traitants situés hors UE peuvent intervenir ; des garanties
        appropriées (clauses contractuelles types de la Commission européenne,
        mesures complémentaires) doivent être documentées dans vos accords
        (DPA signés avec Neon, Clerk, Stripe, Cloudinary, Vercel / hébergeur,
        etc.).
      </p>

      <h2>5. Durées de conservation</h2>
      <p>
        Définissez et documentez des durées par catégorie de données (compte
        actif, après résiliation, dossiers comptables). Les données des clients
        finalement suivis par un coach doivent être traitées conformément au
        contrat entre le coach et son client et au RGPD.
      </p>

      <h2>6. Vos droits (RGPD)</h2>
      <p>
        Vous disposez d&apos;un droit d&apos;accès, de rectification,
        d&apos;effacement, de limitation, d&apos;opposition, de portabilité et
        du droit de définir des directives post-mortem (conditions applicables).
        Pour les données traitées dans Revo par le coach en tant que responsable
        vis-à-vis de ses propres clients, c&apos;est le coach qui doit répondre
        aux demandes ; pour les données dont nous sommes responsables en tant
        qu&apos;éditeur du service, contactez-nous à l&apos;adresse indiquée en
        section 1. Vous pouvez introduire une réclamation auprès de la CNIL (
        <a href="https://www.cnil.fr" className="text-violet-600 underline">
          cnil.fr
        </a>
        ).
      </p>
      <p>
        Lorsque vous êtes connecté, les{" "}
        <a href="/dashboard/settings" className="text-violet-600 underline">
          paramètres du compte
        </a>{" "}
        permettent d&apos;exporter vos données et de demander la suppression
        définitive du compte, sous réserve des limitations techniques.
      </p>

      <h2 id="cookies">7. Cookies et traceurs</h2>
      <p>
        Des cookies strictement nécessaires au fonctionnement du service
        (session, sécurité, authentification Clerk) sont déposés. D&apos;autres
        traceurs non indispensables ne sont utilisés qu&apos;avec votre accord
        lorsque nous les activerons. Vous pouvez retirer votre consentement à
        tout moment en effaçant les données stockées localement pour les
        préférences cookies (navigateur) ou via notre bandeau lorsqu&apos;il est
        proposé.
      </p>
    </LegalDocShell>
  )
}
