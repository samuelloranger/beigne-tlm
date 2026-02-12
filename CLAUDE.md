# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Beigne is a fun office tracker app for catching colleagues who leave their computers unlocked. When someone is caught, they owe donuts (beignes). The UI is in French.

## Commands

```bash
# Install dependencies
bun install

# Run both server and web concurrently
bun run dev

# Run individually
bun run dev:server    # Elysia API on :3001
bun run dev:web       # Vite React app on :3000

# Database
bun run db:migrate    # Run Prisma migrations
bun run db:seed       # Seed the database
cd packages/server && bunx prisma studio  # Visual DB browser
```

## Architecture

Bun workspace monorepo with two packages:

- **`packages/server`** — Elysia (Bun-native HTTP framework) REST API with Prisma ORM on SQLite (via libSQL adapter). Prisma client is generated to `packages/server/generated/prisma/` (gitignored). Config in `prisma.config.ts` points to `dev.db` in the server package root.
- **`packages/web`** — React 19 + Vite + Tailwind CSS v4 SPA. Vite proxies `/api/*` requests to the server on port 3001 (stripping the `/api` prefix).

## Key Patterns

- API client lives in `packages/web/src/api.ts` — all fetch calls go through `/api` base path which Vite proxies to the server
- Server entry is `packages/server/src/index.ts` — single-file Elysia app with route validation using `t` (TypeBox)
- Database connection is in `packages/server/src/db.ts` using PrismaLibSQL adapter
- The app is a single-page `App.tsx` component (no routing)

## Data Model

Two models: `User` (id, name) and `Beigne` (id, userId, caughtAt, cost). A beigne starts with null cost; the cost is filled in once donuts are purchased.
