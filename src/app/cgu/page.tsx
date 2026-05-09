import type { Metadata } from "next"
import { LegalDocShell } from "@/components/marketing/legal-doc-shell"

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: "CGU du service Revo pour les coachs sportifs.",
}

export default function CguPage() {
  return (
    <LegalDocShell
      title="Conditions générales d'utilisation"
      updatedLabel="Dernière mise à jour : 9 mai 2026 — Document modèle à valider juridiquement."
    >
      <p>
        Les présentes CGU régissent l&apos;accès et l&apos;utilisation du
        service <strong>Revo</strong>. Elles complètent les conditions des
        prestataires techniques (authentification Clerk, paiement Stripe,
        hébergement) applicables entre vous et ces tiers.
      </p>

      <h2>1. Objet du service</h2>
      <p>
        Revo est une application en ligne destinée aux professionnels du
        coaching pour organiser clients, programmes et séances. Les
        fonctionnalités peuvent évoluer ; les descriptions sur le site sont
        données à titre indicatif.
      </p>

      <h2>2. Compte et accès</h2>
      <p>
        Vous créez un compte via notre fournisseur d&apos;authentification. Vous
        êtes responsable de la confidentialité de vos identifiants et de
        l&apos;exactitude des informations fournies.
      </p>

      <h2>3. Contenu et données des clients</h2>
      <p>
        En tant que coach, vous êtes généralement responsable du traitement des
        données personnelles de vos clients dans l&apos;outil. Vous vous engagez
        à disposer des droits et bases légales nécessaires (informations,
        consentements ou autres fondements) et à ne pas importer de contenus
        illicites ou portant atteinte aux droits de tiers.
      </p>

      <h2>4. Tarifs et facturation</h2>
      <p>
        Les offres et prix sont ceux affichés sur la page Tarifs au jour de la
        souscription. Lorsque la facturation en ligne sera activée, le paiement
        sera traité par Stripe ; aucun numéro de carte ne transite par nos
        serveurs. Les factures devront respecter les obligations applicables
        (TVA, mentions obligatoires, conservation).
      </p>

      <h2>5. Droit de rétractation (consommateurs)</h2>
      <p>
        Si vous êtes un consommateur au sens du Code de la consommation, vous
        disposez d&apos;un délai de 14 jours pour exercer votre droit de
        rétractation sur un contrat à distance, sous réserve des exceptions
        prévues par la loi pour les contenus numériques fournis avant la fin du
        délai avec accord exprès et renoncement au droit. Précisez ici la
        procédure (contact, formulaire) après validation juridique.
      </p>

      <h2>6. Limitation de responsabilité</h2>
      <p>
        Le service est fourni « en l&apos;état ». Nous ne sommes pas responsables
        des décisions d&apos;entraînement ou de santé prises sur la base des
        données saisies : Revo est un outil de gestion, pas un dispositif
        médical. Une clause détaillée de limitation doit être rédigée par votre
        conseil.
      </p>

      <h2>7. Résiliation</h2>
      <p>
        Vous pouvez supprimer votre compte depuis les paramètres lorsque la
        fonctionnalité est proposée. Les effets sur la conservation des données
        sont précisés dans la politique de confidentialité.
      </p>

      <h2>8. Droit applicable et litiges</h2>
      <p>
        Indiquez le droit applicable (droit français en général pour une société
        française) et les modalités de règlement des différends (tribunaux
        compétents, médiation de la consommation le cas échéant).
      </p>
    </LegalDocShell>
  )
}
