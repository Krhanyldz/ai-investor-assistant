# AI Investor Assistant

This project is a Next.js application for building a scalable investing workflow. The current implementation establishes a lightweight feature-based architecture with clear separation between app, features, services, shared UI, and domain types.

## Architecture

- App shell: [src/app](src/app)
- Feature layer: [src/features](src/features)
- Domain layer: [src/domain](src/domain)
- Services layer: [src/services](src/services)
- Shared UI and utilities: [src/shared](src/shared)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the app.

## Available scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run lint` — run ESLint
- `npm run test` — run the Vitest suite

## Supabase database

The profile schema is managed through versioned SQL migrations in [supabase/migrations](supabase/migrations). Do not edit the hosted database schema manually after adopting these migrations; create a new migration instead.

Prerequisites:

- Node.js 20 or newer for `npx supabase`
- Docker Desktop or another Docker-compatible container runtime for the local Supabase stack
- No secrets, access tokens, database passwords, or service-role keys committed to Git

Local setup and reset:

```bash
npx supabase start
npx supabase db reset
```

Run database tests:

```bash
npx supabase test db
```

Stop the local stack when finished:

```bash
npx supabase stop
```

Hosted project workflow:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push --dry-run
npx supabase db push
```

Always review the dry run before pushing migrations to a hosted project. Do not use `db push` from automation unless the target project and migration plan have been reviewed.
