import type { Metadata } from "next"
import { LegalDocShell } from "@/components/marketing/legal-doc-shell"

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Éditeur, hébergement et contact — Revo.",
}

export default function MentionsLegalesPage() {
  return (
    <LegalDocShell
      title="Mentions légales"
      updatedLabel="Dernière mise à jour : 9 mai 2026 — Complétez les champs entre crochets avant mise en production."
    >
      <h2>Éditeur du site</h2>
      <ul>
        <li>
          <strong>Raison sociale</strong> : [À compléter]
        </li>
        <li>
          <strong>Forme juridique</strong> : [À compléter]
        </li>
        <li>
          <strong>Siège social</strong> : [Adresse complète]
        </li>
        <li>
          <strong>SIREN / RCS</strong> : [À compléter]
        </li>
        <li>
          <strong>Directeur de la publication</strong> : [Nom]
        </li>
        <li>
          <strong>Contact</strong> : [courriel professionnel]
        </li>
      </ul>

      <h2>Hébergement</h2>
      <p>
        Le site et l&apos;application sont hébergés par [Vercel Inc. ou autre —
        adresse, contact] et les données applicatives par des prestataires
        cloud (base de données Neon, etc.). Complétez conformément à vos
        contrats effectifs.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les éléments du site (textes, charte graphique, logo) sont protégés.
        Toute reproduction non autorisée est interdite. Les contenus saisis par
        les utilisateurs restent leur propriété ou celle des tiers concernés ;
        vous garantissez disposer des droits nécessaires à leur mise en ligne.
      </p>

      <h2>Liens externes</h2>
      <p>
        Le site peut contenir des liens vers des sites tiers ; nous ne maîtrisons
        pas leur contenu et déclinons toute responsabilité quant à leur
        utilisation.
      </p>
    </LegalDocShell>
  )
}
