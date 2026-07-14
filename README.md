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
