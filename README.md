# demo-app

> Full-stack monorepo — React 19 · tRPC v11 · Drizzle/Postgres · MUI gold dark theme
> Optimised for trunk-based development and Claude Code.

[![CI](https://github.com/GjorgiKrenkov/demo-app/actions/workflows/ci.yml/badge.svg)](https://github.com/GjorgiKrenkov/demo-app/actions/workflows/ci.yml)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 6, React Router v7, MUI v6 |
| API | Fastify v5, tRPC v11 (type-safe end-to-end) |
| Database | PostgreSQL 16, Drizzle ORM |
| Validation | Zod (shared via `@demo-app/validators`) |
| Monorepo | pnpm workspaces, Turborepo |
| Testing | Vitest, React Testing Library, Playwright |
| Error monitoring | GlitchTip (Sentry-compatible, open-source) |
| Code quality | ESLint (strict flat config), Prettier, Husky, commitlint |

---

## Packages

| Package | Description |
|---------|-------------|
| `@demo-app/web` | React frontend |
| `@demo-app/api` | tRPC + Fastify API server |
| `@demo-app/validators` | ⭐ Shared Zod schemas — single source of truth |
| `@demo-app/db` | Drizzle schema + migrations |
| `@demo-app/ui` | Shared MUI components + gold dark/light theme |
| `@demo-app/config` | Shared TS/ESLint/Vitest configs |

---

## Quick Start

```bash
git clone https://github.com/GjorgiKrenkov/demo-app.git
cd demo-app
nvm use            # Node 20 (reads .nvmrc)
npm install -g pnpm@9
pnpm install
cp .env.example .env
docker compose up -d postgres
pnpm db:generate && pnpm db:migrate
pnpm dev           # API → :3001  |  Web → :5173
```

See [ONBOARDING.md](./ONBOARDING.md) for full setup instructions.

---

## Development Conventions

Read **[CLAUDE.md](./CLAUDE.md)** before writing any code — it covers:
- File & test naming conventions
- 20-line method limit
- Zod validation requirements
- Branch/PR/commit conventions
- MCP setup for Claude Code
- Design system tokens

---

## Key Commands

```bash
pnpm dev            # start all
pnpm test           # unit tests
pnpm test:coverage  # coverage (≥ 80% required)
pnpm lint           # lint (0 warnings allowed)
pnpm type-check     # TypeScript strict check
pnpm db:studio      # Drizzle Studio GUI
pnpm db:generate    # generate migrations
```

---

## Branching Strategy (Trunk-Based)

```
main        ← production
  └── develop ← integration (max 2 open PRs at a time)
        └── feat/your-feature  ← short-lived branches
```

Commit format: `type(scope): description` ([Conventional Commits](https://www.conventionalcommits.org))
