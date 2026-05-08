# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint

# Prisma
npx prisma generate        # Regenerate client after schema changes
npx prisma db push         # Push schema to Neon (no migration file)
npx prisma studio          # GUI to inspect the database
```

> Use `rtk proxy npx` instead of `npx` when RTK hook intercepts and breaks argument parsing.

## Architecture

**Stack**: Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Prisma 7 · Neon (PostgreSQL) · Clerk v7

**Product**: CoachTrack — a French-language SaaS for fitness coaches to manage clients, sessions, and workout programs.

### Auth flow

Clerk handles authentication. `src/proxy.ts` (Next.js 16 renamed `middleware` → `proxy`) protects all routes except `/`, `/sign-in`, and `/sign-up`. When a user registers, Clerk fires a `user.created` webhook to `POST /api/webhooks/clerk` which creates the corresponding `User` row in the database via Prisma.

The DB `User.clerkId` is the bridge between Clerk's session and the app's data. Every protected server action or route handler resolves the current user with Clerk's `auth()` then fetches by `clerkId`.

### Neon + Prisma adapter

`src/lib/prisma.ts` uses `@prisma/adapter-neon` with the `ws` WebSocket constructor (required for Neon serverless). This is a singleton using `globalThis` to survive Next.js hot reload. Import `prisma` from `@/lib/prisma` everywhere — never instantiate `PrismaClient` directly. `prisma.config.ts` at the root loads `.env.local` for CLI commands.

### Data model (prisma/schema.prisma)

The coach is a `User`. Each coach has `Client`s. A `Client` can have `Program`s (workout plans with `WorkoutDay`s and `ProgramExercise`s) and `Session`s (logged workouts with `SessionExercise`s and `SessionSet`s). `Exercise` is a shared library — global exercises (`isGlobal: true`) plus per-coach custom ones. `Subscription` stores Stripe billing state per coach (`FREE` / `PRO` plans, `TRIALING` / `ACTIVE` / `PAST_DUE` / `CANCELED` / `UNPAID` statuses).

### Component structure

```
src/components/
  auth/       # Auth page layout (left panel branding)
  dashboard/  # Dashboard shell (sidebar with Clerk UserButton)
  marketing/  # Landing page components (nav, hero, etc.)
  ui/         # shadcn primitives (button, card, avatar, badge, separator…)
```

UI uses **shadcn** (style: `base-nova`, base color: `neutral`, CSS variables), **lucide-react** for icons, and **`@base-ui/react`** for headless primitives. Add new shadcn components with `npx shadcn add <component>`.

### Dashboard routes

The sidebar defines the planned route structure:

| Route | Section |
|---|---|
| `/dashboard` | Overview with stats + recent sessions |
| `/dashboard/clients` | Client list & management |
| `/dashboard/sessions` | Session log |
| `/dashboard/programs` | Workout programs |
| `/dashboard/exercises` | Exercise library |
| `/dashboard/settings` | Coach settings |

### Language & localization

The entire app UI is in **French**. Clerk is initialized with `frFR` localization. All user-facing strings (labels, empty states, error messages) must be written in French.

### Planned features (see `docs/user-journey.md`)

- `/onboarding` — post-signup guided flow (add first client → create first session), replaces direct redirect to dashboard for new users
- Authenticated users visiting `/` should redirect to `/dashboard`
- Pricing section on landing page (FREE vs PRO)
