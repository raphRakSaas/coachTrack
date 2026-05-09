# Ekklo — Application mobile (référence complète)

> URL : `https://pro.ekklo.com/organizations/mobile`
> Section PROFIL · Icône : 📱

---

## 1. Structure de la page

### 1.1 Header

```
┌─────────────────────────────────────────────────────────────────┐
│  Application mobile                                             │
│  Offrez une expérience unique à vos clients en créant votre     │
│  propre application.                                            │
│                                                                 │
│  [🎬 Tutoriel vidéo]   [Revoir le guide]                       │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Onglets

```
[ Personnalisation Standard ]  [ Personnalisation Avancée ]  [ Séquence ]  [ Boutique ]
```

---

## 2. Onglet "Personnalisation Standard"

URL : `?tab=branding` (défaut)

### 2.1 Images de couverture

Personnalisation des images par défaut affichées dans l'app mobile client.

| Section | Description | Contraintes |
|---------|-------------|-------------|
| **Programme Sportif** | Image affichée sur les cartes de programmes sportifs | JPG, PNG · Max 5 MB |
| **Plan Nutritionnel** | Image affichée sur les cartes de nutrition | JPG, PNG · Max 5 MB |
| **Bilan** | Image affichée sur les cartes de bilan | JPG, PNG · Max 5 MB |

> Interface : zone de drop avec aperçu + bouton "Modifier"

### 2.2 Protection du contenu

| Élément | Détail |
|---------|--------|
| **Statut** | Toggle désactivé (grisé) — réservé plan **Business** |
| **Description** | "Vos clients ne pourront pas effectuer de captures d'écran de vos programmes, plans nutritionnels et contenus partagés dans l'application mobile." |
| **Portée** | "Cette option s'applique à l'ensemble de vos contenus sur l'application mobile." |
| **Restriction** | "Fonctionnalité réservée à l'abonnement Business" |
| **CTA** | Bouton + Lien "Upgrader mon abonnement →" |

---

## 3. Tutoriel "Personnalisation Standard" (guide mascotte)

Déclencheur : première visite ou bouton "Revoir le guide".

**Intro** : "Découvrir la personnalisation ?"
> "Je vais vous montrer comment personnaliser les images de couverture de votre application mobile."

- Bouton : "Plus tard" | "C'est parti !" | 🎬 "Voir la vidéo tutoriel"

*(Nombre exact d'étapes non documenté — tutoriel interactif pas encore suivi)*

---

## 4. Onglet "Personnalisation Avancée"

URL : `?tab=branding-advanced`

### 4.1 État actuel (plan FREE/TRIAL)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   [Mascotte avec mains sur les yeux]                        │
│                                                             │
│   Vous n'avez pas accès à l'application personnalisée       │
│   avec votre abonnement.                                    │
│                                                             │
│   [Upgrader votre abonnement →]                             │
│                                                             │
│   ── ── ── ── ── ── ── ── ── ── ── ──                      │
│                                                             │
│   Découvrez l'application personnalisée                     │
│   (section de présentation des fonctionnalités)             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Fonctionnalités probables (plan Business)

- Logo personnalisé dans l'application
- Couleurs de thème personnalisées
- Nom de l'app / branding complet
- Écran de connexion personnalisé

> Note : Fonctionnalités non accessibles sur le plan d'essai.

---

## 5. Onglet "Séquence"

URL : `?tab=sequence`

### 5.1 Description

> "Une séquence est un ensemble de pages qui seront présentées à vos coachés à des moments spécifiques de leur parcours."

### 5.2 Section "Première connexion"

| Élément | Description |
|---------|-------------|
| **Titre** | Première connexion |
| **Sous-titre** | "Ces pages seront affichées lors de la première connexion" |
| **État vide** | "Aucune page · Commencez par créer votre première page" |
| **Bouton "J'ai compris"** | Ferme la bannière d'explication |
| **Bouton "Ajouter une page"** | Crée une nouvelle page d'onboarding (2 boutons présents : header + état vide) |

### 5.3 Utilisation

Les séquences permettent de créer un **onboarding personnalisé** pour les nouveaux clients :
- Pages de bienvenue
- Présentation du coach
- Instructions de démarrage
- Questions initiales

### 5.4 Tutoriel "Séquences" (guide mascotte)

**Intro** : "Découvrir les séquences ?"
> "Je vais vous guider pour créer votre première séquence d'onboarding et accueillir vos nouveaux clients."

- Bouton : "Plus tard" | "C'est parti !" | 🎬 "Voir la vidéo tutoriel"

*(Étapes détaillées non documentées — tutoriel non suivi)*

---

## 6. Onglet "Boutique"

URL : `?tab=boutique` *(probable)*

### 6.1 Description

La Boutique permet de créer des **offres partenaires** à partager avec les clients directement dans l'application mobile.

### 6.2 État vide

| Élément | Contenu |
|---------|---------|
| **Titre** | "Aucune offre disponible" |
| **Description** | "Créez votre premier partenariat pour offrir des avantages exclusifs à vos clients." |
| **Barre de recherche** | "Rechercher une offre..." |
| **Bouton** | "Ajouter une offre  +" |

### 6.3 Tutoriel "Boutique" (guide mascotte)

**Intro** : "Découvrir la boutique ?"
> "Je vais vous guider pour créer votre première offre partenaire et la partager avec vos clients."

- Bouton : "Plus tard" | "C'est parti !" | 🎬 "Voir la vidéo tutoriel"

*(Étapes détaillées non documentées — tutoriel non suivi)*

---

## 7. Application mobile client (côté client)

### 7.1 Accès démo

| Champ | Valeur |
|-------|--------|
| Email | `demo-revo-4409@demo.ekklo.com` |
| Mot de passe | `EkkloDemo2026!` |

### 7.2 Fonctionnalités visibles dans l'app

- Messagerie privée avec le coach
- Programmes sportifs assignés
- Suivi nutritionnel (calories, macros)
- Bilans de forme
- Habitudes quotidiennes
- Vidéos et exercices illustrés
- Séquences d'onboarding
- Recettes Ekklo
- Suivi du poids
- Activités sportives
- Compteur de pas (page d'accueil)
- Suivi du sommeil (page d'accueil)
- Calories brûlées (page d'accueil)

### 7.3 Intégrations

| Intégration | Description |
|-------------|-------------|
| **Apple Health** | Synchronisation automatique poids, sommeil, activités |
| Push notifications | Activées/désactivées par le client |

---

## 8. Modules de l'app activables par le coach

Ces modules sont configurables individuellement par le coach dans **Paramètres du client** :

| Module | Icône | Description |
|--------|-------|-------------|
| **Messagerie** | 💬 | Conversations privées avec votre client |
| **Entraînements** | 🏋️ | Programmes, séances sportives et bilans |
| **Habitudes** | 📅 | Suivi quotidien des habitudes |
| **Questionnaires** | 📋 | Formulaires et suivis personnalisés |
| **Nutrition** | 🥗 | Plans alimentaires et suivi nutritionnel |
| **Drive** | 📁 | Partage et stockage de fichiers |
| **Vidéos** | 🎬 | Contenu vidéo et exercices illustrés |
| **Séquences** | 📖 | Contenus pédagogiques séquentiels |
| **Recettes Ekklo** | 🍽️ | Accès aux recettes fournies par Ekklo |
| **Poids** | ⚖️ | Suivi et historique du poids |
| **Activités** | ⚡ | Enregistrement et suivi des activités sportives |
| **Pas** | 👟 | Encart nombre de pas sur la page d'accueil |
| **Sommeil** | 🌙 | Encart suivi du sommeil sur la page d'accueil |
| **Calories** | 🔥 | Encart calories brûlées sur la page d'accueil |
| **Rappels d'hydratation** | 💧 | Notifications locales pour boire de l'eau |
| **Rappels de repas** | 🕐 | Notifications locales pour les repas |
| **Partager les douleurs** | 🩺 | Le client voit dans son app les annotations de douleurs que vous ajoutez sur son corps |

> État par défaut : Messagerie → Calories = **activés** · Rappels d'hydratation, Rappels de repas, Partager les douleurs = **désactivés**

---

## 9. Plans requis par fonctionnalité

| Fonctionnalité | Plan requis |
|----------------|-------------|
| Personnalisation Standard (images) | FREE / TRIAL |
| Séquences d'onboarding | FREE / TRIAL |
| Boutique partenaires | FREE / TRIAL (probable) |
| Personnalisation Avancée (branding) | **Business** |
| Protection du contenu | **Business** |
| Push notifications | FREE / TRIAL |
| Email / SMS notifications | **Pro** ou supérieur |
