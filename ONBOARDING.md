# Onboarding Guide — demo-app

Welcome! This guide gets you from zero to a running local development environment.
Estimated time: **15–20 minutes**.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Git | ≥ 2.40 | [git-scm.com](https://git-scm.com) |
| nvm | latest | [nvm.sh](https://github.com/nvm-sh/nvm) |
| Docker Desktop | ≥ 4.x | [docker.com](https://www.docker.com/products/docker-desktop) |
| VS Code | latest | [code.visualstudio.com](https://code.visualstudio.com) |

---

## Step 1 — Clone the repo

```bash
cd ~/Desktop   # or wherever you want it
git clone https://github.com/GjorgiKrenkov/demo-app.git
cd demo-app
```

---

## Step 2 — Install Node.js (via nvm)

```bash
nvm install      # reads .nvmrc → installs Node 20
nvm use          # switches to Node 20
node -v          # should print v20.x.x
```

---

## Step 3 — Install pnpm

```bash
npm install -g pnpm@9
pnpm -v          # should print 9.x.x
```

---

## Step 4 — Install dependencies

```bash
pnpm install
```

This installs all packages across the monorepo using the workspace protocol.

---

## Step 5 — Set up environment variables

```bash
cp .env.example .env
```

The defaults in `.env.example` work for local Docker Postgres — no changes needed to get started.

---

## Step 6 — Start the database

```bash
docker compose up -d postgres
```

Verify it's running:
```bash
docker compose ps
# Should show: demo_postgres   Up   0.0.0.0:5432->5432/tcp
```

---

## Step 7 — Run database migrations

```bash
pnpm db:generate   # generates SQL migrations from Drizzle schema
pnpm db:migrate    # applies migrations to local Postgres
```

---

## Step 8 — Set up Husky git hooks

```bash
pnpm prepare       # installs Husky hooks (runs automatically after pnpm install)
```

---

## Step 9 — Start the development servers

Open **two terminals** (or use VS Code's split terminal):

**Terminal 1 — API server:**
```bash
pnpm --filter @demo-app/api dev
# → API running at http://localhost:3001
# → tRPC panel at http://localhost:3001/trpc
```

**Terminal 2 — Frontend:**
```bash
pnpm --filter @demo-app/web dev
# → Frontend at http://localhost:5173
```

Or run everything at once:
```bash
pnpm dev
```

---

## Step 10 — Install VS Code extensions

When you open the repo in VS Code, you'll see a prompt to install recommended extensions.
Click **Install All**. Key ones:

- **ESLint** — real-time lint feedback
- **Prettier** — auto-format on save
- **Pretty TypeScript Errors** — readable TS errors
- **Error Lens** — inline error display
- **Vitest** — run/debug tests in the editor
- **Playwright** — run e2e tests in the editor
- **Drizzle** — schema visualizer

---

## Step 11 — Verify everything works

```bash
# Lint
pnpm lint

# Type check
pnpm type-check

# Unit tests
pnpm test

# Coverage (must stay ≥ 80%)
pnpm test:coverage
```

All should pass with no errors. 🎉

---

## Step 12 — Configure MCP (Claude Code — optional)

If you're using **Claude Code** as your AI assistant, set up MCP:

```bash
mkdir -p .claude
cp .claude/mcp.example.json .claude/mcp.json
```

Then edit `.claude/mcp.json` and fill in your GitHub PAT and local paths.
See **CLAUDE.md → MCP Configuration** for details.

---

## Common commands

```bash
pnpm dev                           # start all apps
pnpm build                         # build all packages
pnpm lint                          # lint everything
pnpm type-check                    # TypeScript check
pnpm test                          # all unit tests
pnpm test:coverage                 # with coverage report
pnpm --filter @demo-app/web test:e2e   # Playwright e2e
pnpm db:studio                     # Drizzle Studio (DB GUI)
pnpm db:generate                   # generate migration
pnpm db:migrate                    # run migrations
docker compose up -d               # start all Docker services
docker compose down                # stop all Docker services
```

---

## Troubleshooting

### "Cannot find module '@demo-app/validators'"
```bash
pnpm build --filter=@demo-app/config --filter=@demo-app/validators
```

### "DATABASE_URL is required"
Make sure you copied `.env.example` to `.env` and Docker Postgres is running.

### "Port 5432 already in use"
Another Postgres instance is running. Stop it or change the port in `docker-compose.yml`.

### pnpm install fails on Node version
```bash
nvm use    # ensures you're on Node 20
pnpm install
```

---

## Useful reading

- [CLAUDE.md](./CLAUDE.md) — all conventions (read before writing any code)
- [Turborepo docs](https://turbo.build/repo/docs)
- [tRPC v11 docs](https://trpc.io/docs)
- [Drizzle ORM docs](https://orm.drizzle.team)
- [MUI v6 docs](https://mui.com/material-ui)
- [Zod docs](https://zod.dev)
