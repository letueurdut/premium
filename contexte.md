markdown

# PREMIUM — Document de Référence Projet
> Version 1.2 — Source of Truth pour le développement
> Dernière mise à jour : 24/03/2026, après initialisation du Bloc 1

---

## 1. Vision & Objectif

**PREMIUM** est une plateforme de gestion de tâches à accès restreint, structurée autour d'une relation de pouvoir asymétrique entre un **Admin** (donneur d'ordres) et des **Users** (exécutants). L'Admin assigne des tâches — régulières ou punitives — que les Users doivent accomplir et prouver. La complétion débloque des récompenses dans un système de progression appelé le **Vault**.

L'esthétique est volontairement **austère, premium et autoritaire** : noir profond, rouge sang, typographie tranchante. Pas un outil de productivité ordinaire — une arène.

---

## 2. Stack Technique Définitif

| Couche | Technologie | Version | Rôle |
|---|---|---|---|
| Framework | Next.js 14 (App Router) | `14.2.35` | Routing, Server Actions, SSR/SSG |
| Langage | TypeScript (strict) | — | Typage bout-en-bout |
| Styles | Tailwind CSS | — | UI utilitaire, thème sombre |
| Base de données | Neon (PostgreSQL serverless) | — | Persistance principale |
| ORM | Drizzle ORM | — | Schéma, migrations, requêtes typées |
| Authentification | Clerk | `5.7.5` ⚠️ (max compatible Next 14) | Sessions, rôles, JWT |
| Temps réel | Pusher | — | Chat Admin ↔ User |
| Upload fichiers | Uploadthing | `uploadthing` + `@uploadthing/react` ⚠️ (pas `@uploadthing/nextjs`) | Preuves média (images, vidéos) |
| Déploiement | Vercel | — | Hosting + Edge Functions |
| Variables d'env | `.env.local` + Vercel Env | — | Secrets de production |

> ⚠️ **Notes de compatibilité :**
> - `@clerk/nextjs` → utiliser `5.7.5` max. La v6+ exige Next.js 15.
> - `@uploadthing/nextjs` n'existe pas. Utiliser `uploadthing` (serveur) + `@uploadthing/react` (client).

---

## 3. Architecture des Dossiers

src/
├── app/
│ ├── (auth)/
│ │ ├── sign-in/ # Page Clerk sign-in
│ │ └── sign-up/ # Page Clerk sign-up
│ ├── admin/
│ │ ├── dashboard/ # ✅ Layout & page temporaire
│ │ ├── users/ # (à venir)
│ │ ├── create-task/ # (à venir)
│ │ ├── proofs/ # (à venir)
│ │ ├── overdue/ # (à venir)
│ │ └── rewards/ # (à venir)
│ ├── user/
│ │ ├── dashboard/ # ✅ Layout & page temporaire
│ │ ├── tasks/ # (à venir)
│ │ ├── vault/ # (à venir)
│ │ └── chat/ # (à venir)
│ ├── globals.css # ✅ Styles globaux + classes utilitaires PREMIUM
│ └── api/
│ ├── webhooks/ # ✅ Route webhook Clerk (créée, à configurer)
│ ├── pusher/ # (à venir)
│ └── uploadthing/ # (à venir)
├── components/
│ ├── ui/ # ✅ Primitives (Button, Badge, Card)
│ ├── common/ # ✅ Sidebar, Header (créés)
│ ├── admin/ # (à venir)
│ └── user/ # (à venir)
├── lib/
│ ├── types/index.ts # ✅ Interfaces TypeScript globales
│ ├── db/
│ │ ├── index.ts # ✅ Client Drizzle + connexion Neon (créé)
│ │ └── schema.ts # ✅ Schéma complet des tables
│ ├── actions/ # (à venir)
│ ├── queries/ # (à venir)
│ ├── pusher.ts # (à venir)
│ └── utils.ts # ✅ Helpers partagés
├── mock-data/
│ └── index.ts # ✅ Service mock — simule le backend
└── middleware.ts # ✅ Protection des routes (basique)
text


---

## 4. Modèles de Données (Schéma Drizzle)

Le schéma complet est défini dans `src/lib/db/schema.ts`. Il inclut les tables suivantes :

- `users` (id, clerkId, username, role, lastActive, createdAt)
- `user_stats` (userId, tasksCompleted, currentStreak, longestStreak, totalMinutes, lastSeenAt)
- `tasks` (id, title, description, userId, createdBy, deadline, status, type, createdAt)
- `proof_submissions` (id, taskId, userId, content, mediaUrls, status, adminNote, submittedAt, reviewedAt)
- `messages` (id, senderId, receiverId, content, read, createdAt)
- `rewards` (id, title, description, unlockType, unlockValue, iconUrl, createdAt)
- `user_rewards` (userId, rewardId, unlockedAt)

Les enums PostgreSQL sont définis via `pgEnum`.

---

## 5. Fonctionnalités Détaillées

*Identique à la version 1.1 (pas de changement fonctionnel à ce stade).*

---

## 6. Identité Visuelle & Classes Utilitaires

**Tokens Tailwind (définis dans `tailwind.config.ts`) :**

- `bg-p-black`, `bg-p-surface`, `bg-p-card`, `border-p-border`, `bg-p-muted`
- `bg-p-red`, `bg-p-red-hover`
- `text-p-text`, `text-p-text-muted`, `text-p-text-dim`
- Police `font-display` (Playfair Display) et `font-body` (DM Sans)

**Classes utilitaires (dans `globals.css`) :**

- `.card`, `.card-hover`
- `.btn-primary`, `.btn-ghost`, `.btn-danger`
- `.badge-neutral`, `.badge-red`, `.badge-green`, `.badge-yellow`
- `.input`
- `.nav-item`, `.nav-item.active`
- `.task-punishment`
- `.shimmer`
- `.glow-red`, `.glow-red-sm`, `.text-glow-red`
- `.animate-in`, `.animate-fade`

---

## 7. Variables d'Environnement Requises

```env
# Neon
DATABASE_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/user/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/user/dashboard

# Pusher (à venir)
PUSHER_APP_ID=
PUSHER_SECRET=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=

# Uploadthing (à venir)
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

8. Roadmap — Blocs de Développement
🧱 BLOC 1 — Fondations Projet

Objectif : un projet qui tourne en local avec la DB connectée et les routes protégées.

    Init Next.js 14 + TypeScript + Tailwind CSS

    Installation des dépendances (avec versions compatibles)

    Écriture du schéma Drizzle complet

    Client Drizzle + connexion Neon

    Configuration Drizzle Kit (drizzle.config.ts)

    Interfaces TypeScript globales (src/lib/types/index.ts)

    Service mock data (src/mock-data/index.ts)

    Design system : tailwind.config.ts avec palette de tokens PREMIUM

    globals.css : classes utilitaires complètes

    layout.tsx racine : polices via next/font/google, variables CSS

    Composants UI de base (Button, Badge, Card) dans src/components/ui/

    Layout global : Sidebar + Header (composants shells)

    Layouts admin/user avec Sidebar/Header (fichiers créés)

    Installation et configuration basique de Clerk (middleware, pages sign-in/sign-up)

    Première migration Neon et vérification des tables en base

    Webhook Clerk → création automatique du user en base (route API créée, reste à configurer l'endpoint Clerk)

    middleware.ts : protection avancée avec rôles (en attente des métadonnées Clerk)

Livrable actuel : L'app tourne, les pages d'authentification Clerk sont accessibles, les layouts existent avec Sidebar/Header statiques. Les routes sont protégées par un middleware simple (vérifie la connexion). Les composants UI sont prêts.

Reste à faire dans le Bloc 1 :

    Finaliser la migration Drizzle (créer les tables)

    Configurer le webhook Clerk pour synchroniser les utilisateurs en base

    Ajouter le rôle dans les métadonnées publiques Clerk et adapter le middleware

🔐 BLOC 2 — Gestion des Utilisateurs

    Page Admin — Liste des users (lecture DB)

    Détail d'un user : stats, tâches associées

    Action : changer le rôle d'un user

    Initialisation de user_stats à la création du compte (via webhook)

    Mise à jour de lastActive à chaque requête authentifiée

✅ BLOC 3 — Système de Tâches (Core)

    Formulaire Admin — Créer une tâche (Server Action)

    Attribution de la tâche à un user

    Page User — Liste de ses tâches (filtre par statut)

    Page User — Détail d'une tâche

    Action User : passer une tâche en in-progress

    Distinction visuelle regular vs punishment

    Page Admin — Suivi des tâches en retard (overdue)

    Action Admin : marquer failed ou accorder une extension

📎 BLOC 4 — Soumission & Révision de Preuves

    Configuration Uploadthing

    Formulaire User — Soumettre une preuve (texte + médias)

    Statut tâche → submitted

    Page Admin — File de révision (pending proofs)

    Visualisation preuve : texte + médias

    Actions Admin : Approuver (→ completed) ou Rejeter avec note

    Mise à jour user_stats.tasksCompleted et streak

🏆 BLOC 5 — Vault & Récompenses

    Page Admin — CRUD des récompenses

    Fonction checkAndUnlockRewards(userId)

    Page User — Vault : grille récompenses

    Dashboard User — Barre de progression vers la prochaine récompense

💬 BLOC 6 — Chat Temps Réel

    Configuration Pusher

    Endpoint /api/pusher/auth

    Persistance des messages en base (messages)

    Interface chat User

    Vue chat Admin

📊 BLOC 7 — Dashboards & Statistiques

    Dashboard Admin : métriques globales

    Dashboard User : résumé personnel, streak

    Graphique taux de complétion

🚀 BLOC 8 — Publication & Production

    Audit variables d'environnement

    Déploiement Vercel

    Webhook Clerk en production

    Monitoring

9. Conventions de Développement

    Server Actions pour toutes les mutations (sauf API routes nécessaires).

    Queries séparées des Server Actions dans lib/queries/.

    Mock data dans src/mock-data/index.ts — toute l'UI est développée contre ce service jusqu'à la connexion DB réelle.

    Aucun accès direct à la DB depuis les composants client.

    Tout composant avec "use client" ne doit pas importer le client Drizzle.

    Les rôles sont toujours vérifiés côté serveur (ne jamais se fier au rôle transmis par le client).

    Nommage : camelCase pour les variables, PascalCase pour les composants, kebab-case pour les fichiers.

10. Ordre de Travail Recommandé
text

BLOC 1 → BLOC 2 → BLOC 3 → BLOC 4 → BLOC 5 → BLOC 6 → BLOC 7 → BLOC 8
  │          │        │        │        │        │        │        │
Fondations  Users   Tâches  Preuves  Vault   Chat   Dashboards  Prod

Chaque bloc peut être développé, testé et mergé indépendamment.
Ne jamais commencer un bloc avant que le précédent soit stable.
11. État d’Avancement Actuel (24/03/2026)

    Bloc 1 : Partiellement terminé. Les fondations techniques sont en place (Next.js, Tailwind, Drizzle, Clerk). Les composants UI de base sont prêts. Les layouts admin/user existent avec une Sidebar et Header statiques. L’authentification Clerk fonctionne. Reste à : exécuter les migrations DB, configurer le webhook Clerk pour lier les utilisateurs, et finaliser la protection par rôle.

    Prochaine étape : Terminer le Bloc 1 en mettant en place la base de données et le webhook, puis passer au Bloc 2 (gestion des utilisateurs).