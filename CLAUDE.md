# CLAUDE.md — AI Assistant Guide for demo-app

> This file is the **single source of truth** for Claude Code (and any AI assistant) working in this repo.
> Read it fully before making any changes. All conventions here are **non-negotiable**.

---

## 🏗️ Monorepo Structure

```
demo-app/
├── apps/
│   ├── web/          # React 19 + Vite 6 + tRPC client  (@demo-app/web)
│   └── api/          # Fastify + tRPC v11 + Drizzle      (@demo-app/api)
├── packages/
│   ├── validators/   # ⭐ SHARED Zod schemas & TS types  (@demo-app/validators)
│   ├── db/           # Drizzle schema + DB client         (@demo-app/db)
│   ├── ui/           # MUI components + gold theme        (@demo-app/ui)
│   └── config/       # Shared TS/ESLint/Vitest configs   (@demo-app/config)
├── .github/
│   ├── workflows/    # CI/CD pipelines
│   └── ISSUE_TEMPLATE/
├── CLAUDE.md         # ← you are here
├── ONBOARDING.md
└── docker-compose.yml
```

---

## ⭐ Domain Model — Single Source of Truth

**ALL** domain types, Zod schemas, and API contracts live in `packages/validators/`.

| Rule     | Detail                                                                |
| -------- | --------------------------------------------------------------------- |
| ✅ DO    | Import types from `@demo-app/validators` in both frontend AND backend |
| ✅ DO    | Add new domain schemas to `packages/validators/src/schemas/`          |
| ❌ DON'T | Define inline Zod schemas inside `apps/`                              |
| ❌ DON'T | Duplicate types between frontend and backend                          |
| ❌ DON'T | Use `z.any()` or `as unknown` to bypass validation                    |

### Schema file naming

```
packages/validators/src/schemas/
  {domain}.schema.ts     # e.g. user.schema.ts, product.schema.ts
```

---

## 📁 File Naming Conventions

| Type            | Convention                  | Example                   |
| --------------- | --------------------------- | ------------------------- |
| React component | PascalCase + `.tsx`         | `UserCard.tsx`            |
| React hook      | camelCase prefixed `use`    | `useUsers.ts`             |
| tRPC router     | camelCase + `.router.ts`    | `user.router.ts`          |
| Zod schema file | camelCase + `.schema.ts`    | `user.schema.ts`          |
| DB table        | camelCase + `.table.ts`     | `users.table.ts`          |
| Utility/helper  | camelCase + `.ts`           | `pagination.ts`           |
| Test file       | same name + `.test.ts(x)`   | `UserCard.test.tsx`       |
| E2E test file   | kebab-case + `.spec.ts`     | `user-management.spec.ts` |
| Type-only file  | camelCase + `.types.ts`     | `router.types.ts`         |
| Constants       | camelCase + `.constants.ts` | `routes.constants.ts`     |

### Directory structure per feature

```
src/
  pages/
    users/
      UsersPage.tsx
      UsersPage.test.tsx          ← unit test co-located
      __tests__/                  ← OR grouped here
        UsersPage.test.tsx
  components/
    user-card/
      UserCard.tsx
      UserCard.test.tsx
  hooks/
    useUsers.ts
    useUsers.test.ts
  lib/
    trpc.ts                       ← tRPC client init
    query-provider.tsx
```

---

## ✅ Test Naming Conventions

### Unit / Integration (Vitest)

```typescript
// File: UserCard.test.tsx
describe('UserCard', () => {
  // component/module name
  describe('when user is admin', () => {
    // condition / state
    it('renders admin badge', () => {
      // behaviour: "it [does X]"
    });
    it('shows delete button', () => {});
  });

  describe('when user is viewer', () => {
    it('hides delete button', () => {});
  });
});
```

### Router tests (tRPC)

```typescript
describe('userRouter', () => {
  describe('create', () => {
    it('creates a user with valid input', async () => {});
    it('rejects invalid email', async () => {});
    it('rejects duplicate email', async () => {});
  });
});
```

### E2E (Playwright)

```typescript
// File: user-management.spec.ts
test.describe('user management', () => {
  test('admin can create a user', async ({ page }) => {});
  test('viewer cannot delete a user', async ({ page }) => {});
});
```

### Rules

- Test description = **observable behaviour**, not implementation detail
- Avoid `toBeTruthy()` — use specific matchers (`toBe`, `toEqual`, `toHaveLength`)
- Every public function needs ≥1 happy-path + ≥1 edge-case test
- Use `describe` for grouping, `it` for assertions (not `test` inside describe)
- Test files live either **co-located** (`Component.test.tsx` next to `Component.tsx`) or in `__tests__/` subfolder — **pick one per app and be consistent**

---

## 📏 Code Rules (Non-Negotiable)

### 1. Method length ≤ 20 lines (logic lines)

No function body may exceed 20 lines of logic (blank lines and comments excluded).
If it does → extract helpers, use early returns, or split into smaller functions.

```typescript
// ✅ Good — 4 logic lines
const getUserById = async (id: string): Promise<User> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
  if (!user) {
    throw new TRPCError({ code: 'NOT_FOUND' });
  }
  return user;
};

// ❌ Bad — violates single responsibility
const processUser = async (id: string, data: unknown) => {
  // 30+ lines of mixed concerns
};
```

### 2. TypeScript — no escape hatches

```typescript
// ❌ NEVER
const x: any = ...
as unknown as SomeType
// @ts-ignore
// @ts-expect-error  (only allowed with explanation comment)
```

### 3. Zod for ALL external input

- HTTP request bodies → Zod (via tRPC input schemas)
- env vars → validate at startup with Zod
- localStorage / query params → Zod parse before use

### 4. SOLID principles

- **S** — one file = one responsibility. Routes ≠ business logic ≠ DB queries
- **O** — extend via new schemas/routers, not by modifying existing ones
- **L** — component/function contracts must not be broken by subclasses/overrides
- **I** — small, focused interfaces. No `IUser` with 20 fields if you only need 3
- **D** — depend on `@demo-app/validators` abstractions, not concrete DB row types

### 5. DRY

- Shared logic → `packages/` or `src/lib/`
- Repeated UI patterns → `packages/ui/src/components/`
- Repeated API patterns → shared middleware in `apps/api/src/trpc/`

### 6. No `console.log` in committed code

Use `console.warn` / `console.error` only where intentional (server startup, etc.).
For debugging → use the VS Code debugger (launch configs provided).

---

## 🌿 Branch & PR Convention (Trunk-Based Development)

### Branch naming

```
type/short-description
type/scope/short-description

feat/user-authentication
fix/login-redirect-loop
feat/payment/stripe-integration
chore/upgrade-drizzle-v2
```

### Trunk-based flow

```
main  ← production (protected, no direct push)
  └── develop ← integration branch (protected)
        └── feat/my-feature  ← short-lived (max 2 days)
```

### PR rules

| Rule                     | Limit         |
| ------------------------ | ------------- |
| Max open PRs → `develop` | **2**         |
| Max PR diff              | **800 lines** |
| Required approvals       | **1**         |
| CI must pass             | ✅ always     |
| Coverage must not drop   | ✅ always     |

If a feature is > 800 lines → **break it into subtasks** (separate issues + PRs).

### Commit messages (Conventional Commits)

```
feat(user): add email verification endpoint
fix(auth): prevent token refresh on logout
test(user-router): add edge cases for duplicate email
docs(onboarding): update postgres setup steps
refactor(validators): extract pagination schema to common
```

### Atomic commits (non-negotiable)

One commit = one logical change. Never bundle unrelated fixes together.

| Rule                                        | Example                                                               |
| ------------------------------------------- | --------------------------------------------------------------------- |
| ✅ One concern per commit                   | `fix(db): add missing drizzle-zod dependency`                         |
| ✅ Lockfile travels with its dep change     | commit `package.json` + `pnpm-lock.yaml` together                     |
| ❌ Never mix scopes                         | don't fix a dep AND update a config AND add a migration in one commit |
| ❌ Never commit "while I'm in here" cleanup | open a separate issue/PR for unrelated improvements                   |

**This applies to AI assistants too.** Claude must plan commits up front, stage files precisely, and never use `git add .` or `git add -A`.

---

## 🔧 MCP Configuration (Claude Code)

Create `.claude/mcp.json` (gitignored, per-developer) from this template:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<your-pat-with-repo+workflow-scopes>"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/demo-app"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://demo_user:demo_pass@localhost:5432/demo_db"
      }
    }
  }
}
```

Add `.claude/` to your `.gitignore` (already done).

### Useful Claude Code commands

```bash
# Check what issues are open
"Show me all open GitHub issues labelled bug"

# Explore edge cases for a new feature
"What are the edge cases for the createUser endpoint? Check validators and router"

# Find coverage gaps
"Which functions in user.router.ts have no test for the NOT_FOUND case?"

# Review a PR
"Review PR #42 for SOLID violations and missing Zod validation"
```

---

## 🧪 Running Tests

```bash
# All unit tests
pnpm test

# With coverage (must stay ≥ 80%)
pnpm test:coverage

# Watch mode (during development)
pnpm --filter @demo-app/web test:watch
pnpm --filter @demo-app/api test:watch

# E2E (Playwright)
pnpm --filter @demo-app/web test:e2e

# E2E with UI
pnpm --filter @demo-app/web test:e2e:ui

# Single file
pnpm --filter @demo-app/api vitest run src/router/__tests__/user.router.test.ts
```

---

## 🎨 Design System

All theming lives in `packages/ui/src/theme/`.

| Token                | Value     | Usage                                |
| -------------------- | --------- | ------------------------------------ |
| `primary.main`       | `#C9A84C` | Gold — buttons, links, active states |
| `primary.light`      | `#E8C547` | Gold hover                           |
| `primary.dark`       | `#A67C2A` | Gold pressed                         |
| `background.default` | `#0A0A0A` | Page background (dark)               |
| `background.paper`   | `#111111` | Card/surface background              |
| `text.primary`       | `#F5E6C8` | Cream — headings, body               |
| `text.secondary`     | `#B8A082` | Muted gold-tan — subtitles           |
| `error.main`         | `#CF6679` | Red (NOT orange — fixed from design) |

### Extending the theme

```typescript
// ✅ Add new component override in packages/ui/src/theme/dark.theme.ts
// ✅ Add new token in packages/ui/src/theme/tokens.ts
// ❌ Never hard-code hex colors in components — always use theme tokens
sx={{ color: 'primary.main' }}      // ✅
sx={{ color: '#C9A84C' }}           // ❌
```

---

## 📦 Adding a New Feature (Checklist)

1. **Create issue** with acceptance criteria + subtasks
2. **Branch** `feat/your-feature` off `develop`
3. **Add Zod schema** to `packages/validators/src/schemas/`
4. **Add DB table** (if needed) to `packages/db/src/schema/`
5. **Run** `pnpm db:generate` to create migration
6. **Add tRPC router** in `apps/api/src/router/`
7. **Add tests** for router (unit) — edge cases too
8. **Add React page/component** in `apps/web/src/`
9. **Add component test** with React Testing Library
10. **Add e2e test** in `apps/web/e2e/`
11. **Run** `pnpm lint && pnpm type-check && pnpm test:coverage`
12. **Open PR** → fill template → max 800 lines

---

## 🚨 Error Monitoring (GlitchTip)

- API: `apps/api/src/instrumentation.ts` — loaded before server start
- Web: `apps/web/src/instrumentation.ts` — loaded before React renders
- SDK: `@sentry/node` / `@sentry/react` (Sentry-compatible, works with GlitchTip DSN)
- Set `GLITCHTIP_DSN` in `.env` (see `.env.example`)
- Free cloud: https://app.glitchtip.com | Self-host: https://glitchtip.com/docs

---

## 🔑 Environment Variables

See `.env.example` for all variables. **Never commit `.env`.**

Validate env vars at startup using Zod (add to `apps/api/src/env.ts` — pattern provided below):

```typescript
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export const env = envSchema.parse(process.env);
```
