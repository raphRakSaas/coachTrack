# Ekklo — Section Notifications (référence complète)

> URL : `https://pro.ekklo.com/organizations/notifications`
> Section GESTION · Icône : 🔔

---

## 1. Structure de la page

### 1.1 Header de la page

```
┌─────────────────────────────────────────────────────────────────┐
│  Notifications                                                  │
│  Gagnez du temps en créant vos templates de circuits, de        │
│  séances et de programmes sportifs prêts à être personnalisés   │
│  pour chaque client.                                            │
│                                                                 │
│  [🎬 Tutoriel vidéo]   [Revoir le guide]                       │
└─────────────────────────────────────────────────────────────────┘
```

- Lien **"Tutoriel vidéo"** : lien externe YouTube/vidéo
- Bouton **"Revoir le guide"** : relance le tutoriel contextuel (mascotte)

### 1.2 Onglets principaux

```
[ Pré-définies ]    [ Personnalisées ]    (Vue board — uniquement dans Personnalisées)
```

---

## 2. Onglet "Pré-définies"

### 2.1 Widget "Consommation"

| Élément | Valeur | Description |
|---------|--------|-------------|
| Quota | **0 / 1000** | Notifications envoyées ce mois / quota mensuel |
| Label | "Notifications envoyées" | |
| Illustration | Mascotte Ekklo joyeuse | Icône décorative |

> **Note** : Le quota mensuel de 1 000 notifications s'applique au plan FREE/TRIAL. À surveiller pour ne pas dépasser la limite.

### 2.2 Notifications automatiques → Clients

| Notification | Toggle | Description complète |
|-------------|--------|----------------------|
| **Séances** | ⚫ OFF | Votre client va recevoir une notification à **10h00** le jour de sa séance *(programmes en jour uniquement)* |
| **Publication de programme sportif** | ⚫ OFF | Votre client recevra une notification lorsqu'un programme sportif est **publié ou mis à jour** |
| **Assignation de programme de nutrition** | ⚫ OFF | Votre client recevra une notification lorsqu'un **programme de nutrition** lui est assigné |
| **Assignation d'habitudes** | ⚫ OFF | Votre client recevra une notification lorsque des **habitudes** lui sont assignées |
| **Messages de motivation** | ⚫ OFF | Votre client va recevoir une notification de motivation **générée par l'IA** tous les jours à **9h05** |
| **Assignation de questionnaire** | ⚫ OFF | Votre client recevra une notification lorsqu'un **questionnaire** lui est assigné |
| **Assignation de fichiers** | ⚫ OFF | Votre client recevra une notification lorsqu'un **fichier ou dossier** lui est assigné |
| **Partage de vidéos** | ⚫ OFF | Votre client recevra une notification lorsqu'une **vidéo ou un dossier vidéo** lui est partagé |

### 2.3 Notifications automatiques → Coach

| Notification | Toggle | Description complète |
|-------------|--------|----------------------|
| **Bilan complété** | ⚫ OFF | Vous recevrez une notification lorsqu'un client **remplit un bilan** |
| **Feedback de séance complété** | ⚫ OFF | Vous recevrez une notification lorsqu'un client **complète un rapport de séance** |

---

## 3. Tutoriel "Pré-définies" (6 étapes)

Déclencheur : bouton "Revoir le guide" ou première visite de la page.

| Étape | Titre | Contenu |
|-------|-------|---------|
| **1/6** | Notifications prédéfinies | "Bienvenue dans l'onglet **Prédéfini** ! Ici, vous configurez les notifications **automatiques** envoyées à vos clients et à vous-même." |
| **2/6** | Votre quota mensuel | "Cette carte indique le nombre de **notifications envoyées** ce mois-ci par rapport à votre **quota mensuel**. Gardez un œil dessus !" |
| **3/6** | Notifications client | "Ces notifications sont envoyées **automatiquement à vos clients** : assignation de séances, programmes sport/nutrition, habitudes, questionnaires, et messages de motivation." |
| **4/6** | Notifications coach | "Ces notifications vous sont destinées **en tant que coach**. Recevez une alerte quand un client complète un bilan ou une séance." |
| **5/6** | Activer / Désactiver | "Chaque notification dispose d'un **toggle** pour l'activer ou la désactiver selon vos besoins. Simple et rapide !" |
| **6/6** | 🎉 Félicitations ! | "Vous maîtrisez maintenant les **notifications prédéfinies** ! Activez celles qui vous sont utiles pour garder vos clients engagés." |

**Navigation tutoriel** : ← Retour | X / 6 | Skip | Suivant → / Terminer ✓

---

## 4. Onglet "Personnalisées"

URL : `?tab=custom`

### 4.1 Barre d'outils

```
[ 🔍 Rechercher une notification... ]          [Créer une notification  +]
[ Vue tableau ↔ ]
```

- **Vue liste** (défaut) : tableau avec colonnes
- **Vue tableau/board** : mode Kanban avec panneau détail à droite
- Bouton **"Créer une notification"** : ouvre le formulaire en 3 étapes

### 4.2 Vue Liste — Colonnes du tableau

| Colonne | Description |
|---------|-------------|
| ☐ | Checkbox sélection |
| **STATUT** | Point vert (active) / gris (inactive) |
| **NOM DE LA NOTIFICATION** | Titre de la notification |
| **TYPE** | Badge : Push / Email / SMS |
| **DESTINATAIRE** | Avatar(s) des clients assignés |
| **PROCHAIN ENVOI** | Date et heure formatées (ex : "Lundi 11 mai 2026 à 09h00") |
| **DATE DE CRÉATION** | Date de création (format JJ/MM/AAAA) |

**Actions par notification** (survol ou sélection) :
- Désactiver / Activer
- Éditer
- Dupliquer
- Supprimer

### 4.3 Vue Board (Kanban/Détail)

```
┌──────────────────────────┬──────────────────────────────────────────┐
│  Notifications      [+]  │  ● Rappel de séance hebdomadaire  Push   │
│  ┌────────────────────┐  │  [Modifier 🔗]                           │
│  │ Rechercher...       │  │                                          │
│  └────────────────────┘  │  📅 Début : 10/05/2026 09:00:00          │
│                          │  🔄 Prochain envoi : Lundi 11 mai 09h00  │
│  ● Rappel de séance     │                                          │
│    hebdomadaire         │  Destinataires  ?                        │
│    Push · Lundi 11 mai  │                                          │
│    👥 1                  │  Description                             │
│                          │  "N'oubliez pas votre séance             │
│                          │   d'entraînement demain ! Préparez vos   │
│                          │   affaires et restez motivé(e) 💪"       │
└──────────────────────────┴──────────────────────────────────────────┘
```

---

## 5. Formulaire "Créer une notification" (3 étapes)

### Étape 1 : Paramètres

| Champ | Options | Description |
|-------|---------|-------------|
| **Type de notification*** | Push *(actif)* / Email *(grisé)* / SMS *(grisé)* | Push = app mobile · Email/SMS = plan supérieur |
| **Type d'envoi*** | Une fois / **Récurrent** | Envoi unique ou répété |
| **Date et heure de début*** | Sélecteur date + "09:00" | Date de début + heure |

**Configuration récurrence** (si Récurrent) :
- "Répéter tout(e)s les" : dropdown (jour / semaine / mois / ...)
- "Répéter le" : sélecteur de jours [Lu · Ma · Me · Je · Ve · Sa · Di]
- **Fin** : Radio `Jamais` ou `Le [date]`

**Preview live** (panneau droit) :
- Titre (provisoire)
- Badge type
- Début : date/heure formatée
- Fréquence : "Toutes les semaines"
- Destinataires (vide)

### Étape 2 : Message

| Champ | Placeholder | Contrainte |
|-------|-------------|------------|
| **Titre*** | "Titre de la notification" | Requis |
| **Description*** | "Description de la notification" | Requis |

**Exemple pré-rempli par le tutoriel** :
- Titre : "Rappel de séance hebdomadaire"
- Description : "N'oubliez pas votre séance d'entraînement demain ! Préparez vos affaires et restez motivé(e) 💪"

### Étape 3 : Assignation

| Champ | Options |
|-------|---------|
| **Destinataires*** | Recherche par nom + liste clients |
| Exemple clients | "JD Joe dalton" · "MD Marie Dupont" |

Bouton final : **"Créer la notification"** (vert fluo)

---

## 6. Tutoriel "Personnalisées" (9 étapes)

Déclencheur : première visite de l'onglet Personnalisées.

| Étape | Titre | Contenu | Type |
|-------|-------|---------|------|
| **1/9** | Notifications personnalisées | "Bienvenue dans l'onglet **Personnalisées** ! Créez vos propres notifications **récurrentes** (email ou push) pour communiquer avec vos clients." | Info |
| **2/9** | Créer une notification | "👆 Cliquez sur ce bouton pour créer une nouvelle notification personnalisée." · **En attente de votre action…** | Interactif |
| **3/9** | Paramètres de la notification | "Je vais **remplir les paramètres** avec des valeurs d'exemple : mode récurrent, hebdomadaire le lundi." | Info |
| **4/9** | Étape suivante | "👆 Cliquez sur **Suivant** pour passer à la rédaction du message." · **En attente de votre action…** | Interactif |
| **5/9** | Rédigez votre message | "Je vais remplir le **titre** et la **description** de votre notification avec des valeurs d'exemple." | Info |
| **6/9** | Étape suivante | "👆 Cliquez sur **Suivant** pour choisir les destinataires." · **En attente de votre action…** | Interactif |
| **7/9** | Choisissez les destinataires | "Je vais sélectionner un **destinataire** pour cette notification. Vous pourrez en ajouter d'autres ensuite !" | Info |
| **8/9** | Créer la notification | "👆 Cliquez sur ce bouton pour créer votre notification personnalisée." · **En attente de votre action…** | Interactif |
| **9/9** | 🎉 Félicitations ! | "Vous savez maintenant créer des **notifications personnalisées** ! Utilisez-les pour garder le lien avec vos clients et les motiver au quotidien." | Fin |

---

## 7. Centre de notifications coach (F8)

Accessible depuis le header via l'icône **🔔** (raccourci clavier : F8).

### 7.1 Structure du panneau

```
┌────────────────────────────────────┐
│  Notifications                  ✕  │
│                                    │
│  Filtrer par type                  │
│  [ Tous ] [🏆 Bilans] [📧 Récap.]  │
│  [💪 Séances] [💰 Paiements]       │
│  [📋 Questionnaires]               │
│                                    │
│  🔕                               │
│  Aucune notification pour le moment│
└────────────────────────────────────┘
```

### 7.2 Filtres disponibles

| Filtre | Icône | Description |
|--------|-------|-------------|
| **Tous** | — | Toutes les notifications |
| **Bilans** | 🏆 | Bilans complétés par les clients |
| **Récapitulatifs** | 📧 | Récapitulatifs hebdomadaires/mensuels |
| **Séances** | 💪 | Feedbacks de séances complétées |
| **Paiements** | 💰 | Notifications de paiements reçus |
| **Questionnaires** | 📋 | Questionnaires remplis par les clients |

---

## 8. Plans & Quotas

| Plan | Quota notifications/mois | Fonctionnalités |
|------|--------------------------|-----------------|
| FREE (essai) | **1 000** | Push uniquement |
| Pro | Plus élevé | Push + Email |
| Business | Illimité (probable) | Push + Email + SMS + Protection contenu |

> Note : Email et SMS sont **désactivés** (grisés) sur le plan FREE/TRIAL. Seul le **Push** est disponible.

---

## 9. Particularités UX notées

- Les notifications **Pré-définies** sont globales (pour tous les clients)
- Les notifications **Personnalisées** sont assignées à des clients spécifiques
- La **vue board** offre un panneau détail latéral pour inspecter chaque notification
- Le widget **Consommation** est un compteur mensuel qui se remet à zéro chaque mois
- Les **Messages de motivation** utilisent l'IA pour générer les textes (envoi quotidien à 9h05)
- La notification de **Séances** est liée aux programmes "en jour uniquement" (pas les programmes en semaines)
