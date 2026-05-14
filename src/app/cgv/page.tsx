import type { Metadata } from "next"
import { LegalDocShell } from "@/components/marketing/legal-doc-shell"

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: "Conditions générales de vente du service Revo pour les abonnements Pro.",
}

export default function CgvPage() {
  return (
    <LegalDocShell
      title="Conditions générales de vente"
      updatedLabel="Dernière mise à jour : 14 mai 2026 — Document modèle à valider juridiquement."
    >
      <p>
        Les présentes Conditions Générales de Vente (CGV) régissent les relations commerciales entre{" "}
        <strong>Revo</strong> (ci-après « le Prestataire ») et toute personne physique ou morale
        (ci-après « le Client ») souhaitant souscrire à un abonnement payant via le service.
      </p>

      <h2>1. Objet</h2>
      <p>
        Les présentes CGV ont pour objet de définir les conditions dans lesquelles Revo fournit au
        Client l&apos;accès aux fonctionnalités de l&apos;abonnement <strong>Pro</strong>, notamment :
        clients illimités, programmes illimités, statistiques avancées, records personnels automatiques,
        export PDF et support prioritaire.
      </p>

      <h2>2. Prix et facturation</h2>
      <p>
        Les tarifs applicables sont ceux affichés sur la page{" "}
        <a href="/tarifs">Tarifs</a> au moment de la souscription. Les prix sont exprimés en euros
        toutes taxes comprises (TTC). La facturation est mensuelle ou annuelle selon l&apos;option
        choisie par le Client.
      </p>
      <ul>
        <li>
          <strong>Abonnement mensuel</strong> : prélevé chaque mois à date anniversaire.
        </li>
        <li>
          <strong>Abonnement annuel</strong> : prélevé une fois par an. Une réduction de 20 % est
          appliquée par rapport au tarif mensuel.
        </li>
      </ul>
      <p>
        Le paiement s&apos;effectue par carte bancaire via notre prestataire{" "}
        <strong>Stripe</strong>. Aucun numéro de carte ne transite par les serveurs de Revo.
        Une facture est émise et disponible dans votre espace client après chaque prélèvement.
      </p>

      <h2>3. Essai gratuit</h2>
      <p>
        Toute première souscription à l&apos;abonnement Pro bénéficie d&apos;une période d&apos;essai gratuit
        de <strong>14 jours</strong>. Aucune carte bancaire n&apos;est requise pour activer l&apos;essai.
        À l&apos;issue de cette période, le Client est libre de souscrire ou de rester sur le plan Gratuit.
        Aucun prélèvement n&apos;est effectué sans action explicite du Client.
      </p>

      <h2>4. Droit de rétractation</h2>
      <p>
        Conformément à l&apos;article L.221-28 du Code de la consommation, le droit de rétractation ne
        s&apos;applique pas aux prestations de services pleinement exécutées avant la fin du délai de
        rétractation, avec accord préalable exprès du consommateur. Toutefois, Revo offre la
        possibilité d&apos;annuler l&apos;abonnement à tout moment depuis l&apos;espace client, sans frais ni
        justification, avec effet à la fin de la période de facturation en cours.
      </p>

      <h2>5. Résiliation et remboursement</h2>
      <p>
        Le Client peut résilier son abonnement à tout moment depuis son espace client. La résiliation
        prend effet à la fin de la période de facturation en cours ; aucun remboursement partiel
        n&apos;est effectué pour la période déjà payée. En cas de défaillance technique imputable à Revo
        entraînant une indisponibilité prolongée du service (&gt;72h consécutives), le Client peut
        solliciter un remboursement au prorata.
      </p>

      <h2>6. Obligations du Prestataire</h2>
      <p>
        Revo s&apos;engage à fournir le service avec une disponibilité cible de 99 % hors maintenances
        planifiées, à informer les Clients des évolutions tarifaires au moins 30 jours à l&apos;avance, et
        à conserver les données du Client pendant toute la durée de l&apos;abonnement et 30 jours après
        résiliation.
      </p>

      <h2>7. Obligations du Client</h2>
      <p>
        Le Client s&apos;engage à fournir des informations de paiement exactes et à jour, à utiliser le
        service conformément aux Conditions Générales d&apos;Utilisation (CGU) et à ne pas revendre ou
        redistribuer l&apos;accès au service.
      </p>

      <h2>8. Limitation de responsabilité</h2>
      <p>
        La responsabilité de Revo est limitée au montant des sommes effectivement encaissées sur les
        12 derniers mois précédant le sinistre. Revo ne saurait être tenu responsable des pertes
        indirectes, manques à gagner ou préjudices commerciaux.
      </p>

      <h2>9. Loi applicable et juridiction</h2>
      <p>
        Les présentes CGV sont soumises au droit français. En cas de litige, et à défaut de résolution
        amiable, les tribunaux compétents sont ceux du ressort du siège social du Prestataire.
      </p>

      <h2>10. Contact</h2>
      <p>
        Pour toute question relative à la facturation ou à l&apos;abonnement, contactez-nous à l&apos;adresse
        indiquée dans les <a href="/mentions-legales">mentions légales</a>.
      </p>
    </LegalDocShell>
  )
}
