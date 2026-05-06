# Parcours utilisateur & User Stories — Conversion

## Le problème actuel

Un visiteur qui arrive sur `/sign-in` ou `/sign-up` sans contexte :
- Ne sait pas ce que fait le produit
- N'a aucune raison de créer un compte
- Part (taux de rebond élevé)

**Règle d'or** : on ne demande jamais d'informations à quelqu'un qui ne nous a pas encore donné sa confiance.

---

## Parcours cible

```
Découverte → Compréhension → Désir → Inscription → Activation
    /              /               /        /sign-up     /onboarding
(Landing)    (Features)       (Preuve)   (Compte)    (1er client)
```

---

## Personas

### 👤 Le Coach Curieux
Arrive via Google, Instagram ou bouche-à-oreille.  
Ne connaît pas CoachTrack.  
**Question dans sa tête** : "Est-ce que ça vaut mon temps ?"

### 👤 Le Coach Convaincu
Recommandé par un collègue, sait déjà ce qu'il veut.  
**Question dans sa tête** : "Comment je commence ?"

---

## User Stories

### 1 — Landing page (/)

> **En tant que** coach curieux qui arrive sur le site,  
> **je veux** comprendre en moins de 5 secondes ce que fait CoachTrack,  
> **afin de** décider si ça vaut la peine de continuer.

**Critères d'acceptance :**
- Hero avec titre clair + sous-titre + CTA "Commencer gratuitement"
- Section "Ce que vous pouvez faire" avec 3 bénéfices clés (pas des features, des bénéfices)
- Pas de demande d'email ou d'inscription sur cette page

---

> **En tant que** coach intéressé mais pas encore convaincu,  
> **je veux** voir à quoi ressemble l'outil avant de m'inscrire,  
> **afin de** valider que l'interface correspond à mon usage.

**Critères d'acceptance :**
- Section screenshots ou mockup du dashboard
- Section "Comment ça marche" en 3 étapes max
- Pas besoin d'un vrai démo interactif au lancement

---

> **En tant que** coach prêt à s'inscrire,  
> **je veux** savoir que c'est gratuit pour commencer,  
> **afin de** m'inscrire sans risque.

**Critères d'acceptance :**
- Mention "Gratuit pour commencer, sans carte bancaire" visible
- Section pricing simple : FREE vs PRO
- CTA final en bas de page

---

### 2 — Inscription (/sign-up)

> **En tant que** coach qui clique sur "Commencer gratuitement",  
> **je veux** créer mon compte rapidement,  
> **afin de** commencer à utiliser l'outil sans friction.

**Critères d'acceptance :**
- Page sign-up accessible uniquement depuis le CTA de la landing (pas directement depuis la nav principale)
- Google OAuth mis en avant pour réduire la saisie
- Pas de champs superflus au moment de l'inscription

---

### 3 — Onboarding (/onboarding)

> **En tant que** coach qui vient de créer son compte,  
> **je veux** être guidé pas à pas pour configurer mon espace,  
> **afin de** ne pas arriver sur un dashboard vide sans savoir quoi faire.

**Critères d'acceptance :**
- Redirection vers `/onboarding` au lieu du dashboard après la première connexion
- Étape 1 : "Ajoutez votre premier client" (formulaire simplifié : prénom + nom)
- Étape 2 : "Créez sa première séance" (optionnel, peut être sauté)
- Après onboarding → `/dashboard` avec le client déjà créé visible

---

### 4 — Retour sur le site (connexion)

> **En tant que** coach déjà inscrit qui revient sur le site,  
> **je veux** accéder directement à mon dashboard,  
> **afin de** ne pas repasser par la landing page.

**Critères d'acceptance :**
- Si l'utilisateur est déjà connecté et va sur `/`, redirection vers `/dashboard`
- Lien "Se connecter" discret dans la nav de la landing page

---

## Ordre de build recommandé

| Priorité | Page | Pourquoi |
|---|---|---|
| 1 | Landing page `/` | Sans ça, 0 conversion |
| 2 | Onboarding `/onboarding` | Sans ça, 0 activation |
| 3 | Redirection si connecté | UX de base |
| 4 | Pricing section | Réduction friction |

---

## Ce qu'on NE fait PAS au lancement

- Pas de vidéo démo (trop long à produire)
- Pas de chat live (distraction)
- Pas de témoignages (on n'en a pas encore)
- Pas de FAQ (on ne connaît pas encore les vraies questions)
