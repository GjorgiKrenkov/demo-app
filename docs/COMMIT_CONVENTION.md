# Commit Message Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

## Format

```
type(scope): short description

[optional body]

[optional footer]
```

## Types

| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Refactoring, no feature/fix |
| `perf` | Performance improvement |
| `test` | Adding/fixing tests |
| `build` | Build system or dependencies |
| `ci` | CI/CD configuration |
| `chore` | Maintenance, tooling |
| `revert` | Revert a previous commit |

## Scopes (examples)

`user`, `auth`, `api`, `web`, `db`, `validators`, `ui`, `ci`, `deps`

## Examples

```
feat(user): add email verification endpoint
fix(auth): prevent token refresh race condition
test(user-router): add edge cases for duplicate email
docs(onboarding): update postgres setup instructions
refactor(validators): extract pagination schema to common
chore(deps): upgrade drizzle-orm to v0.40
```

## Rules enforced by commitlint

- Subject must be **lowercase**
- Subject max **72 characters**
- No trailing period
- Scope must be **kebab-case**
