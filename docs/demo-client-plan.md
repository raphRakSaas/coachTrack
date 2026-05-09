# Plan — Client démo & alignement produit (style Ekklo, sauce Revo)

## Faut-il documenter avant de coder ?

| Approche | Quand la choisir |
|----------|------------------|
| **Doc courte + décisions** (ce fichier) | Toujours utile pour : modèle de données, webhook, RGPD, ordre des migrations. |
| **Gros cahier des charges** avant une ligne de code | Rarement nécessaire ici : on peut itérer page par page une fois le démo posé. |
| **Coder direct** | OK si on accepte de refaire le modèle ; avec un client démo **partagé entre comptes**, le risque est de se tromper sur « une ligne globale » vs « une ligne par coach ». |

**Décision recommandée pour CoachTrack :** garder ce plan comme référence, puis **implémenter** (schéma → webhook ou seed → UI).

---

## Décision technique : « accessible à tous les comptes »

Dans la base actuelle, `Client.coachId` est **obligatoire**. Il n’y a pas de client sans coach.

Donc le client démo **n’est pas une seule ligne unique pour toute la plateforme**. Il faut :

- **Une ligne `Client` par coach**, avec un flag du type `isDemo` (ou `isSystemDemo`),
- Le **même scénario de démo** (prénom, nom, objectifs, programmes exemple…) pour tout le monde,
- Création déclenchée à **`user.created`** (webhook Clerk → après `User.create`, créer le client démo), **et/ou** un script `prisma` pour les coaches déjà existants.

Les coaches ne voient « qu’un » client démo dans l’UI ; les données sont **cohérentes multi-tenant** et plus simples à filtrer (stats, suppression « uniquement démo », etc.).

---

## Données fictives & RGPD

- Données **clairement fictives** (nom type « Marie Démo », email `@demo.revo.app` ou équivalent).
- Pas de vraies données de santé réelles ; mention dans la politique de confidentialité si besoin.
- Option ultérieure : consentement ou bannière « données de démonstration » sur la fiche démo.

---

## Checklist d’implémentation (ordre suggéré)

### Phase A — Fondations démo ✅ (implémenté dans le repo)

1. **Schéma Prisma** : `isDemo Boolean @default(false)` sur `Client` + `@@index([coachId, isDemo])`.
2. **`npx prisma db push`** (ou migrate) à lancer après pull.
3. **Webhook Clerk** : après `User.create`, `ensureDemoClientForCoach(user.id)` (`src/lib/demo-client.ts`).
4. **Rattrapage** : `npm run db:backfill-demo` → `scripts/backfill-demo-clients.ts`.
5. **UI** : badge « Démo » sur liste + fiche client ; bouton supprimer masqué pour le démo ; `deleteClient` refuse si `isDemo`.

### Phase B — Remplir le démo (contenu Revo)

6. Données enrichies optionnelles : `Program` + `Session` + mesures pour rendre le tableau de bord vivant (comme la fiche Ekklo).
7. Constantes centralisées (`lib/demo-client.ts` ou similar) : prénom, nom, objectifs — une seule source de vérité.

### Phase C — Parcours produit (sans tout bloquer sur une doc géante)

8. Prioriser les écrans du dashboard et de la fiche client en reprenant les sections utiles de `docs/ekklo-reference.md`.
9. Ajouter des docs **par domaine** au fil de l’eau (`docs/feature-*.md`) plutôt qu’un mega-spec upfront.

---

## Suite possible : roadmap « comme Ekklo, sauce Revo »

À traiter **après** le client démo stable :

| Domaine | Priorité suggérée |
|---------|-------------------|
| Liste + fiche client + démo | Haute |
| Tableau de bord coach | Haute |
| Programmes / séances | Moyenne |
| Nutrition / suivi avancé | Selon scope MVP |

---

## Références dans le repo

- Modèle : `prisma/schema.prisma` (`Client`)
- Webhook inscription : `src/app/api/webhooks/clerk/route.ts`
- Inspiration UX : `docs/ekklo-reference.md` (ne pas copier l’identité visuelle ni les textes propriétaires d’Ekklo)
