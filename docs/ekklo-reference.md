# Référence Ekklo — Document de reproduction

> Plateforme SaaS de coaching en ligne · **pro.ekklo.com**
> Compte de référence : Joe Dalton (essai gratuit 14 jours)

---

## 0. Cartographie — tout est-il couvert ?

**Oui : chaque entrée de la sidebar et les onglets fiche client sont référencés.** En revanche, le **niveau de détail n’est pas le même partout** : la partie **CRM / fiche client** (§3 à §5g) est la plus documentée car c’est le cœur du parcours coach ; les **pages « organisation »** (Prospects, Calendrier, Sport global, etc.) sont pour l’instant des **résumés de structure** issus de l’exploration — pas un pas-à-pas de chaque formulaire et modal.

| Entrée sidebar | URL type | Où c’est documenté | Niveau |
|----------------|----------|-------------------|--------|
| **Tableau de bord** | `/organizations` | §2 | Moyen — widgets principaux |
| **Clients** | `/organizations/customers` | §3 à §5g | **Élevé** — liste + 7 onglets + paramètres |
| **Prospects** | `/organizations/prospects` | §6b | Résumé — Kanban + liste |
| **Calendrier** | `/organizations/calendar` | §6c | Résumé — vues + modal paramètres |
| **Sport** | `/organizations/sport` | §6d | Résumé — onglets + biblio exercices |
| **Nutrition** | `/organizations/nutrition` | §6e | Résumé — onglets |
| **Suivi** | `/organizations/tracking` | §6f | Résumé |
| **Vidéos** | `/organizations/videos` | §6g | Résumé |
| **Comptabilité** | `/organizations/billing` | §6h | Résumé — onglets |
| **Équipes** | `/organizations/teams` | §6i | Résumé |
| **Drive** | `/organizations/drive` | §6j | Résumé |
| **Automatisation** | `/organizations/automations` | §6k | Résumé — paywall essai |
| **Notifications** | `/organizations/notifications` | §6n + [`ekklo-notifications.md`](./ekklo-notifications.md) | **Élevé** |
| **Mon site web** | `/organizations/website` | §6l | Résumé — checklist profil |
| **Application** | `/organizations/mobile` | §6m + [`ekklo-application-mobile.md`](./ekklo-application-mobile.md) | Moyen à élevé |

**Résumé honnête :** si tu veux la même granularité que pour **Clients** (chaque champ, chaque bouton, chaque tutoriel) pour **Prospects, Calendrier, Sport…**, il faudra soit une **passée complémentaire** dans Ekklo (capture + inventaire), soit des **fichiers dédiés par section** (`ekklo-prospects.md`, `ekklo-calendrier.md`, …) à remplir progressivement.

---

## 1. Structure globale de l'interface

### 1.1 Sidebar gauche (navigation principale)

```
┌─────────────────────────┐
│  🟢 Ekklo  ▾            │  Logo + dropdown org
├─────────────────────────┤
│  ⊞  Tableau de bord     │  (actif = fond clair)
│  😊 Clients             │
│  🎯 Prospects           │
│  📅 Calendrier          │
├─ RESSOURCES ────────────┤
│  🏋️ Sport               │
│  🥗 Nutrition           │
│  📊 Suivi               │
│  🎬 Vidéos              │
├─ GESTION ───────────────┤
│  💰 Comptabilité        │
│  👥 Équipes             │
│  📁 Drive               │
│  🤖 Automatisation      │
│  🔔 Notifications       │
├─ PROFIL ────────────────┤
│  🌐 Mon site web        │
│  📱 Application         │
├─────────────────────────┤
│  ✨ 7 Nouveautés        │  Badge vert fluo (en bas)
│  Voyez qui a chaq · 6…  │
├─────────────────────────┤
│  👤 Joe dalton    ▾     │  Profil utilisateur
└─────────────────────────┘
```

**Design sidebar** : fond noir (#0D0D0D env.), icônes grises, item actif = fond légèrement clair + texte blanc. Section labels en majuscules petite taille, gris atténué.

---

### 1.2 Header (barre supérieure)

```
[ ⬛ ] | [ Breadcrumb ] | "Il vous reste 14 jours d'essai gratuit" [Mettre à niveau le plan] [Revoir le guide] | 🔍 | [Pacco] | [🕐 1] | [💬] | [🔔] | [🚀 Démarrage]
```

- **Toggle sidebar** : icône panneau (gauche)
- **Breadcrumb** : page courante (ex : "Tableau de bord", "Clients")
- **Bandeau trial** : texte gris + bouton blanc "Mettre à niveau le plan" + bouton "Revoir le guide"
- **Recherche** : icône loupe
- **Avatar Pacco** : bouton violet avec initiales "Pacco" (IA du coach ?)
- **Badge 1** : icône horloge avec compteur numérique
- **Chat** : icône bulle
- **Notifications** : icône cloche
- **Démarrage** : bouton CTA vert clair avec compteur de progression onboarding

---

## 2. Page : Tableau de bord (`/`)

### 2.1 Colonne gauche — "Votre activité"

| Widget | Contenu |
|--------|---------|
| **Mascotte d'accueil** | Personnage vert avec haltère, texte "Hello [Prénom] 👋" |
| **Planning du jour** | Zone vide + bouton `+ Ajouter un événement` |
| **Paiements reçus** | État vide : "Tes derniers paiements s'affichent ici." |
| **Revenus des derniers mois** | Graphique barres (0k€ sur Nov–Juin) |

### 2.2 Colonne droite

| Widget | Contenu |
|--------|---------|
| **Prochain webinaire Ekklo** | Fond bleu · Compte à rebours (J : H : MIN : SEC) · "Réserver ma place →" |
| **Suivi client** | 4 cartes métriques (voir ci-dessous) |
| **Activités clients** | Liste sessions passées + filtre "Tous" |
| **Bilans à valider** | Liste bilans en attente + filtre "Tous / À valider" |

#### Cartes "Suivi client"

| Carte | Valeur demo | Icône |
|-------|-------------|-------|
| Clients actifs | **1** / 50 | Mascotte verte |
| Clients en attente d'activation | **0** | — |
| Clients à risque | **1** | ⚙️ + "Voir >" |
| Nouveaux clients | **1** | — |

#### Section "Bilans à valider"

Affiche les bilans non traités avec : avatar client · nom · badge **"À valider"** (vert fluo) · type de bilan · date relative.

---

## 3. Page : Clients (`/organizations/customers`)

### 3.1 Panneau gauche — Liste des clients

- Bouton **"Inviter"** (vert fluo, haut)
- Champ de recherche : "Rechercher"
- Filtres : `Tous` · `Filtrer`
- Sections : **Actifs** · (Inactifs, Archivés à prévoir)
- Entrée client : Avatar initiales coloré · Nom · Badge "Démo" (gris) · Indicateur présence (point vert)

### 3.2 Panneau droit — Fiche client

**Header fiche client :**
```
[Avatar] Nom Prénom  [Actif ●] [Toggle ON/OFF]    [Envoyer un message]  [Paramètres]
```

**Onglets client :**
```
[ Vue d'ensemble ] [ Informations ] [ Calendrier ] [ Sport ] [ Nutrition ] [ Suivi ] [ Partage ]
```

---

## 4. Fiche client — Onglet "Vue d'ensemble"

### 4.1 Zone info de connexion (client démo uniquement)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ✉ Email                      Ce client est un exemple pour vous aider à     │
│  demo-revo-4409@demo.ekklo.com découvrir la plateforme. Vous pouvez vous     │
│  [Copier]                      connecter sur l'app mobile avec ces           │
│  🔑 Mot de passe               identifiants.                                 │
│  EkkloDemo2026! [Copier]       [ 🗑 Supprimer le client démo ]              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Informations rapides (ligne horizontale)

| Champ | Valeur |
|-------|--------|
| Email | demo-revo-4409@demo.ekklo.com |
| Dates du coaching | Non renseigné – Non renseigné |
| Notifications push | Inactif |
| Téléphone | Non renseigné |
| Objectif du coaching | Perte de poids |
| Intégrations | 🍎 Apple Health |

### 4.3 Widget "Parcours de coaching"

```
📍 Parcours de coaching  · 25%                    ✏️ Modifier  🗑 Retirer

  ┌─────────────────────────────┐
  │  PHASE EN COURS             │
  │  Adaptation                 │  75% de la phase
  │  Semaine 4 / 4 · Fin le 16 mai  │
  └─────────────────────────────┘

  [📍 Adaptation      ] ──▶ [🔆 Intensification] ──▶ [📋 Maintien      ]
    18 avr. → 16 mai           16 mai → 27 juin          27 juin → 11 juil.
```

### 4.4 Widget "Activités clients"

- Header : `Activités clients` + filtre `Tous ▾`
- Sous-section : **Passées**
- Entrées : date · avatar · nom client · badge type activité (`Séance` en vert fluo)
- Exemple : `05/05/2026 | MD Marie Dupont | Séance`

### 4.5 Widget "Douleurs"

- Header : `⚡ Douleurs` · badge "Non partagé" · icônes vue · `2 notes` · `⋮`
- Texte vide : "Annotez les zones corporelles pour suivre les douleurs..."
- Vue : **Face** / **Dos** — silhouette humaine cliquable pour annoter les zones
- Interaction : "Survolez une zone pour voir son nom · Cliquez pour ajouter ou modifier une note"

### 4.6 Widget "Programmes sport"

```
Programmes sport                                      Voir tout
  • 09/05   Exemple : Programme sportif sur 4 mois   [Calendrier]  [-]
```

### 4.7 Widget "Données de suivi"

- Header : `📊 Données de suivi` · sélecteur `4 semaines ▾` · `Vue détaillée`
- Cartes métriques :

| Métrique | Valeur | Date | Couleur graphique |
|----------|--------|------|-------------------|
| ⚖️ Poids | 65.0 kg | 09/05 | Vert (#4ADE80) |
| 🌙 Sommeil | 6h53 | 08/05 | Violet |

### 4.8 Widget "Paiements du client"

```
🤖 [Mascotte vide]  "Les paiements de ce client s'afficheront ici."

  12 nov.   Programme sport   150,00 €
```

### 4.9 Widget "Abonnements actifs"

```
🤖 [Mascotte vide]  "Les abonnements de ce client s'afficheront ici."

  Mensuel   Formule Pro   49,00 €/mois
```

### 4.10 Widget "Notes"

- Header : `📋 Notes` + `+` (ajouter)
- Note 1 — 06/05/2026 :
  ```
  Avant prochaine séance :
  - Lui demander comment va la lombaire (cf note S2)
  - Montrer la progression sur le tirage vertical (+5 kg sur 2 semaines 🔥)
  - Proposer d'ajouter 10 min de mobilité en fin de séance
  - Rappel : vacances prévues dans 3 semaines, anticiper un bloc "déload"
  ```
- Note 2 — Bilan S2 :
  ```
  - Assiduité : 5/6 séances réalisées, bon feeling général
  - Petite douleur lombaire sur les fentes → à surveiller, proposer variante sans charge
  - Nutrition : respect du plan à [...]
  ```
- Note 3 — Appel découverte :
  ```
  - 30 ans, chargée de com évènementielle (journées intenses, repas sur le pouce)
  - Objectif principal : perdre ~5 kg d'ici 3 mois et retrouver de la tonicité
  - Activité [...]
  ```

---

## 5. Fiche client — Onglet "Informations"

### 5.1 Coordonnées

| Champ | Valeur |
|-------|--------|
| Prénom | Marie |
| Nom | Dupont |
| Email | demo-revo-4409@demo.ekklo.com |
| Téléphone | +33 |

### 5.2 Profil

| Champ | Valeur |
|-------|--------|
| Genre | Femme |
| Âge | 30 ans |
| Taille | 165 cm |
| Poids | 68 kg |

### 5.3 Style de vie

| Champ | Valeur |
|-------|--------|
| Niveau d'activité | Modérée |
| Niveau sportif | Débutant |
| Type de corps | Mésomorphe |
| Préférences alimentaires | Standard 🍽️ |
| TCA | Non |

### 5.4 Tags

Vide — placeholder : "Ajoutez-en pour catégoriser votre client."

### 5.5 Coordonnées (adresse)

Tous champs "Non renseigné" : Entreprise · Adresse · Code postal · Ville · Pays

### 5.6 Réseaux sociaux

Tous "Non renseigné" : LinkedIn · Instagram · Facebook · X (Twitter)

### 5.7 Préférences

| Champ | Valeur |
|-------|--------|
| Langue | 🇫🇷 Français (désactivé) |
| Fuseau horaire | 🇫🇷 Paris (UTC+1/+2) |

### 5.8 Objectifs

| Champ | Valeur |
|-------|--------|
| Type d'objectif | Perte de poids |
| Début de coaching | Non défini |
| Objectif (date) | Non défini |
| Échéance | Non défini |

### 5.9 Objectifs poids

| Champ | Valeur |
|-------|--------|
| Poids de départ | 68 kg |
| Poids cible | 63 kg |
| Rythme | -1 kg / semaine |
| Délai estimé | 1 mois et 1 semaine |

### 5.10 Nutrition — Calories par repas

**Objectif total : 2 000 kcal / jour**

| Repas | % | kcal/jour | Recommandation |
|-------|---|-----------|----------------|
| Petit déjeuner | 25% | 500 kcal | Reco: 25% |
| Déjeuner | 40% | 800 kcal | Reco: 40% |
| Dîner | 30% | 600 kcal | Reco: 30% |
| Collation | 5% | 100 kcal | Reco: 5% |
| **Total** | **100%** | **2 000 kcal** | — |

### 5.11 Nutrition — Macronutriments

**Mode : Standard (% des calories)**

| Macro | % | kcal | Grammes | Recommandation |
|-------|---|------|---------|----------------|
| Glucides | 50% | 1 000 kcal | 250 g | 45–65% des cal. totales |
| Protéines | 20% | 400 kcal | 100 g | 10–35% (1.6–2.2g/kg) |
| Lipides | 30% | 600 kcal | 67 g | 20–35% des cal. totales |
| **Total** | **100%** | **2 000 kcal** | — | — |

### 5.12 Hydratation

| Champ | Valeur |
|-------|--------|
| Objectif | 2.5 L / jour |

---

## 5b. Fiche client — Onglet "Calendrier"

Vue semaine avec :
- Séances planifiées (badges colorés sur les jours)
- Jours de repos

Navigation : ← Précédente · Semaine courante · Suivante →

---

## 5c. Fiche client — Onglet "Sport"

### Séances réalisées

| Colonne | Contenu |
|---------|---------|
| Date | Date de la séance |
| Nom de séance | Titre du programme |
| Actions | Voir le rapport détaillé |

**Rapport de séance (détail)** :
- Nom de la séance
- Durée totale
- Exercices réalisés avec séries/répétitions/poids
- Feedback client (intensité perçue)
- Notes

---

## 5d. Fiche client — Onglet "Nutrition"

### Suivi nutritionnel

- **Jauge calories** : progression du jour (ex : 1 450 / 2 000 kcal)
- **Jauges macronutriments** : Glucides / Protéines / Lipides (g et %)
- **Barre de progression journalière**
- **Historique journalier** : détail des repas et apports caloriques

---

## 5e. Fiche client — Onglet "Suivi"

### Suivis en cours

**Filtres** : Bilans | Habitudes | Questionnaires | Mesures

| Colonne | Contenu |
|---------|---------|
| Nom du suivi | Titre (ex : "Bilan de forme") |
| Statut | Badge (Complété / En cours / À valider) |
| Date | Date de complétion |

**Panneau détail (droite)** :
- Vue "Comparer" : comparaison entre deux dates
- Vue "Évolution" : graphique de progression

---

## 5f. Fiche client — Onglet "Partage"

**Barre d'outils :**

```
[ 🔍 Rechercher un fichier ou dossier... ]  [ Tous ] [🔽 Filtrer] [Drive] [Vidéos]
                                             [Nouveau dossier]  [Ajouter  +]
```

| Bouton | Fonction |
|--------|----------|
| **Tous** | Affiche tout le contenu partagé |
| **Filtrer** | Filtre par type/date |
| **Drive** | Affiche uniquement les fichiers Drive |
| **Vidéos** | Affiche uniquement les vidéos partagées |
| **Nouveau dossier** | Crée un dossier de partage |
| **Ajouter +** | Ajoute un fichier ou dossier existant du Drive |

**État vide :**
> "Aucun fichier ou dossier partagé avec ce client · Partagez des fichiers depuis le Drive pour qu'ils apparaissent ici"

---

## 5g. Paramètres du client

Accessible via le bouton **"Paramètres"** dans le header de la fiche client.

### Renvoyer l'invitation

```
ℹ Cette action enverra un email au client contenant ses identifiants de connexion
  et un nouveau mot de passe temporaire.

  [✉ Renvoyer l'invitation]  ← bouton vert fluo
```

### Modules activés

> "Ces paramètres permettent de contrôler quelles fonctionnalités sont accessibles à votre client dans l'application. Activez ou désactivez les modules selon vos besoins d'accompagnement."

| # | Module | Description | État (démo) |
|---|--------|-------------|-------------|
| 1 | **Messagerie** | Conversations privées avec votre client | ✅ ON |
| 2 | **Entraînements** | Programmes, séances sportives et bilans | ✅ ON |
| 3 | **Habitudes** | Suivi quotidien des habitudes | ✅ ON |
| 4 | **Questionnaires** | Formulaires et suivis personnalisés | ✅ ON |
| 5 | **Nutrition** | Plans alimentaires et suivi nutritionnel | ✅ ON |
| 6 | **Drive** | Partage et stockage de fichiers | ✅ ON |
| 7 | **Vidéos** | Contenu vidéo et exercices illustrés | ✅ ON |
| 8 | **Séquences** | Contenus pédagogiques séquentiels | ✅ ON |
| 9 | **Recettes Ekklo** | Accès aux recettes fournies par Ekklo | ✅ ON |
| 10 | **Poids** | Suivi et historique du poids | ✅ ON |
| 11 | **Activités** | Enregistrement et suivi des activités sportives | ✅ ON |
| 12 | **Pas** | Encart nombre de pas sur la page d'accueil | ✅ ON |
| 13 | **Sommeil** | Encart suivi du sommeil sur la page d'accueil | ✅ ON |
| 14 | **Calories** | Encart calories brûlées sur la page d'accueil | ✅ ON |
| 15 | **Rappels d'hydratation** | Notifications locales pour boire de l'eau | ⚫ OFF |
| 16 | **Rappels de repas** | Notifications locales pour les repas | ⚫ OFF |
| 17 | **Partager les douleurs** | Le client voit dans son app les annotations de douleurs que vous ajoutez sur son corps | ⚫ OFF |

---

## 6. Navigation — Toutes les sections

| Section | URL réelle | Description |
|---------|-----------|-------------|
| Tableau de bord | `/organizations` | Dashboard principal |
| Clients | `/organizations/customers` | CRM clients |
| Prospects | `/organizations/prospects` | Gestion leads/prospects |
| Calendrier | `/organizations/calendar` | Planning coach + clients |
| Sport | `/organizations/sport` | Programmes, séances, exercices |
| Nutrition | `/organizations/nutrition` | Plans alimentaires |
| Suivi | `/organizations/tracking` | Métriques & bilans |
| Vidéos | `/organizations/videos` | Vidéothèque coaching |
| Comptabilité | `/organizations/billing` | Paiements + suivi clients |
| Équipes | `/organizations/teams` | Gestion équipe coaches |
| Drive | `/organizations/drive` | Stockage fichiers |
| Automatisation | `/organizations/automations` | Workflows automatiques (plan PRO) |
| Notifications | `/organizations/notifications` | Config + création notifications |
| Mon site web | `/organizations/website` | Page coach publique (find.ekklo.com) |
| Application | `/organizations/mobile` | Config app mobile client |

---

## 6b. Page : Prospects

### Vues disponibles
- **Tableau** (Kanban) : colonnes par statut de prospect
- **Liste** : tableau avec colonnes STATUT / NOM / etc.

### Vue Tableau (Kanban)

Colonnes Kanban :
- Nouveau lead
- Contacté
- Rendez-vous
- Proposition
- Gagné / Perdu

### Vue Liste

| Colonne | Contenu |
|---------|---------|
| STATUT | Badge coloré |
| NOM | Nom + initiales avatar |
| EMAIL | Adresse email |
| TÉLÉPHONE | Numéro |
| DATE DE CRÉATION | Date d'ajout |

**Bouton "Ajouter un prospect"** (vert fluo, haut à droite)

---

## 6c. Page : Calendrier

### Vues disponibles
- **Mois** : vue mensuelle
- **Semaine** : vue hebdomadaire

### Paramètres du calendrier (modal)

**Section : Intégration Google Agenda**
- Connexion Google Calendar
- Synchronisation bidirectionnelle
- Import/export d'événements

**Section : Préférences**
- Heure de début de journée
- Heure de fin de journée
- Durée par défaut des séances
- Jour de début de semaine

---

## 6d. Page : Sport

### Onglets
1. **Programmes assignés** : programmes actifs des clients
2. **Programmes** : bibliothèque de templates de programmes
3. **Séances** : bibliothèque de séances
4. **Circuits** : bibliothèque de circuits

### Bibliothèque d'exercices (sous-section)

Accessible depuis "Sport" → lien/bouton interne

| Fonctionnalité | Détail |
|----------------|--------|
| Recherche | "Rechercher un exercice..." |
| Filtres par tag | Nombreux tags de groupes musculaires et types d'exercice |
| Pagination | Navigation entre pages d'exercices |
| Exercices globaux | isGlobal: true — fournis par Ekklo |
| Exercices personnalisés | Créés par le coach |

---

## 6e. Page : Nutrition

### Onglets
1. **Programmes** : programmes nutritionnels clients
2. **Plans de repas** : bibliothèque de plans alimentaires

---

## 6f. Page : Suivi

### Contenu
- Templates de **Bilans de forme**
- Vue liste des bilans assignés

**Exemple de bilan disponible** : "Bilan de forme" (template démo Ekklo)

---

## 6g. Page : Vidéos

### Structure
- Recherche : "Rechercher une vidéo..."
- Filtres par catégorie
- Gestion des collections
- État vide : "Aucune vidéo" avec CTA d'ajout

---

## 6h. Page : Comptabilité

### Onglets
1. **Paiements** : historique des paiements reçus (état vide par défaut)
2. **Suivi Clients** : tableau de suivi financier par client

---

## 6i. Page : Équipes

### Structure
- État vide : "Aucune équipe"
- Bouton **"Créer une équipe"**
- Description : permet d'ajouter des coachs collaborateurs

---

## 6j. Page : Drive

### Structure
- **Dossiers** : liste des dossiers créés
- **Fichiers** : liste des fichiers uploadés
- État vide pour les deux sections
- Boutons : "Nouveau dossier" · "Ajouter un fichier"

---

## 6k. Page : Automatisation

### État actuel (plan FREE/TRIAL)

**Paywall visible :**
> "Automatisez vos tâches répétitives avec des workflows intelligents."
> [Upgrader mon abonnement →]

Fonctionnalité réservée au plan **PRO** ou supérieur.

---

## 6l. Page : Mon site web

### Onglets
1. **Profil** : informations du profil public coach

### Checklist "Mon site web"
Éléments requis pour apparaître sur **find.ekklo.com** :
- [ ] Photo de profil
- [ ] Prénom et nom
- [ ] Description/biographie
- [ ] Spécialités
- [ ] Localisation ou mode (présentiel/distanciel)

### Profil public
- URL : `find.ekklo.com/[slug-coach]`
- Champs : photo, nom, titre, description, spécialités, tarifs, contact

---

## 6m. Page : Application mobile

→ Voir le document dédié : [`ekklo-application-mobile.md`](./ekklo-application-mobile.md)

---

## 6n. Page : Notifications

→ Voir le document dédié : [`ekklo-notifications.md`](./ekklo-notifications.md)

---

## 7. Design System

### Palette de couleurs

| Rôle | Couleur | Exemple |
|------|---------|---------|
| Fond principal | `#0D0D0D` (noir) | Sidebar, fonds |
| Fond secondaire | `#1A1A1A` (gris très foncé) | Cards, panels |
| Fond card active | `#242424` | Card sélectionnée |
| Accent principal | `#C5F135` (vert fluo/citron) | Bouton "Inviter", badges CTA, mascotte |
| Accent secondaire | `#A855F7` (violet) | Avatar Pacco |
| Accent info | `#3B82F6` (bleu) | Bannière webinaire |
| Texte principal | `#FFFFFF` | Titres |
| Texte secondaire | `#9CA3AF` (gris) | Labels, descriptions |
| Succès / Actif | `#4ADE80` (vert clair) | Badge "Actif", graphique poids |
| Warning / À valider | `#C5F135` (vert fluo) | Badge "À valider" |
| Danger | `#EF4444` (rouge) | Bouton supprimer |

### Typographie

- Police principale : sans-serif moderne (Inter ou similaire)
- Titres section : `font-semibold` ~16–18px
- Labels : ~12–13px, uppercase pour les sections de sidebar
- Corps : ~14px

### Composants récurrents

| Composant | Description |
|-----------|-------------|
| **Badge statut** | Pill arrondie · "Actif" (vert) · "Inactif" · "Démo" (gris) · "À valider" (vert fluo) |
| **Avatar client** | Cercle coloré avec initiales en 2 lettres |
| **Card métrique** | Fond sombre · grande valeur chiffrée · label sous · optionnel: graphique sparkline |
| **Timeline parcours** | Chips carrés avec dates de phase, reliés par flèches |
| **Toggle switch** | Switch iOS-like pour activer/désactiver un client |
| **Mascotte vide** | Personnage Ekklo vert + texte explicatif quand section vide |
| **Graphique barres** | Barres verticales colorées (vert/violet) sur fond sombre, axes minimalistes |

---

## 8. Onboarding coach (guide de démarrage)

**Panel "Bien démarrer sur Ekklo" — 0/4 étapes :**

1. **Compléter mon site web** — "Remplis ta fiche pour apparaître sur find.ekklo.com"
2. **Explorer ton client démo** — "Découvre à quoi ressemble un client actif avec programmes et bilans"
3. **Inviter ton premier vrai client** — "Envoie une invitation par email — ton client recevra un lien pour télécharger l'app"
4. **Créer ton premier programme** — "Personnalise un programme en quelques clics, ou utilise un de nos templates"

→ Lien "Voir le guide complet"

---

## 9. Plan tarifaire (vu dans l'interface)

| Plan | Prix | Fonctionnalité visible |
|------|------|------------------------|
| Gratuit (essai) | 0€ · 14 jours | Jusqu'à 50 clients (1/50 actif) |
| Pro | 49,00 €/mois | Accès complet |
| Programme sport (one-shot) | 150,00 € | Achat programme unique |

---

## 10. Application mobile client

- Email démo : `demo-revo-4409@demo.ekklo.com`
- Mot de passe démo : `EkkloDemo2026!`
- Intégration : Apple Health
- Données synchronisées : Poids (65.0 kg), Sommeil (6h53)

---

## 11. Centre de notifications coach (F8)

Panel latéral accessible via l'icône 🔔 dans le header (raccourci : F8).

**Filtres** : Tous · Bilans · Récapitulatifs · Séances · Paiements · Questionnaires

État vide : "Aucune notification pour le moment"

---

## 12. Changelog — "7 Nouveautés"

Badge vert fluo visible en bas de la sidebar. Contenu des dernières nouvelles :

| Date | Nouveauté |
|------|-----------|
| 02 mai 2026 | Fonctionnalité (détails non capturés intégralement) |
| 01 mai 2026 | Fonctionnalité (détails non capturés intégralement) |

---

## 13. Mascotte Ekklo ("Pacco")

- Personnage vert avec haltère (style 3D rond)
- Apparaît dans : guides d'onboarding, états vides, tutoriels
- Variants : joyeux (bras levés), professeur (pointeur), surpris
- Bouton "Pacco" (violet) dans le header = assistant IA pour le coach

---

## 14. Pages d'erreur

**404 "Petite sortie de piste !"**
> "Cette page n'est pas sur ton parcours, mais ton tableau de bord t'attend pour reprendre la route vers tes objectifs."

Bouton : "Retourner à mon dashboard"

Note : Les routes `/organizations/dashboard`, `/organizations/application`, `/organizations/billing` etc. donnent 404 — les URLs exactes sont :
- Dashboard : `/organizations`
- Application : `/organizations/mobile`
- Comptabilité : `/organizations/billing`
