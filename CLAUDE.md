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

### Auth flow

Clerk handles authentication. `src/proxy.ts` (Next.js 16 renamed `middleware` → `proxy`) protects all routes except `/`, `/sign-in`, and `/sign-up`. When a user registers, Clerk fires a `user.created` webhook to `POST /api/webhooks/clerk` which creates the corresponding `User` row in the database via Prisma.

The DB `User.clerkId` is the bridge between Clerk's session and the app's data. Every protected server action or route handler resolves the current user with Clerk's `auth()` then fetches by `clerkId`.

### Data model (prisma/schema.prisma)

The coach is a `User`. Each coach has `Client`s. A `Client` can have `Program`s (workout plans with `WorkoutDay`s and `ProgramExercise`s) and `Session`s (logged workouts with `SessionExercise`s and `SessionSet`s). `Exercise` is a shared library — global exercises (`isGlobal: true`) plus per-coach custom ones. `Subscription` stores Stripe billing state per coach.

### Singleton Prisma client

`src/lib/prisma.ts` exports a singleton `prisma` instance using `globalThis` to survive Next.js hot reload in development. Import from there everywhere — never instantiate `PrismaClient` directly.
