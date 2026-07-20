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

Copy `.env.example` to `.env.local` and replace only the services you use. AI research requires a server-only `OPENAI_API_KEY`; never prefix it with `NEXT_PUBLIC_` or commit the value. `OPENAI_MODEL` is optional and defaults to the model shown in `.env.example`.

Required production configuration:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — browser-safe Supabase project values
- `NEXT_PUBLIC_APP_URL` — exact deployed origin, also added to Supabase Auth redirect URLs
- `FINNHUB_API_KEY` — server-only market-data credential
- `OPENAI_API_KEY` — optional, server-only; required only for AI research
- `OPENAI_MODEL` — optional model override

Before release, apply reviewed Supabase migrations, run `npx supabase test db`, configure the production auth callback URL (`/auth/callback`), verify email confirmation and password recovery, and require the `Lint`, `Test`, and `Build` branch-protection checks. Do not place server-only keys in variables prefixed with `NEXT_PUBLIC_`.

## Available scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run lint` — run ESLint
- `npm run test` — run the Vitest suite

## Continuous integration

The [Quality Gates workflow](.github/workflows/quality.yml) runs for every pull request and every push to `main`. It installs the locked dependencies with `npm ci`, uses the npm dependency cache, and runs these independent checks:

- `Lint` — ESLint
- `Test` — Vitest unit tests
- `Build` — Next.js production build

The workflow uses non-secret placeholder environment values that are sufficient for compilation. Production credentials are never exposed to pull-request workflows.

Configure the `main` branch protection rule to require the `Lint`, `Test`, and `Build` status checks before merging. GitHub only offers a check in the branch-protection selector after that check has run at least once.

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
