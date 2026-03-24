## Summary
<!-- 1-2 sentences: WHAT changed and WHY -->

Closes #<!-- issue number -->

## Type of change
- [ ] `feat` — new feature
- [ ] `fix` — bug fix
- [ ] `refactor` — no feature/fix change
- [ ] `test` — tests only
- [ ] `docs` — documentation only
- [ ] `chore` — maintenance / deps

## Checklist
- [ ] Branch name follows convention: `type/short-description`
- [ ] PR title follows Conventional Commits: `type(scope): description`
- [ ] No method exceeds 4 lines (logic lines, excluding braces/imports)
- [ ] All new code has unit tests (≥ 80% coverage maintained)
- [ ] No `any` types — TypeScript is strict
- [ ] Zod validation used for all external inputs
- [ ] New domain types added to `packages/validators` (not inline)
- [ ] `pnpm lint` passes with 0 warnings
- [ ] `pnpm type-check` passes
- [ ] `pnpm test` passes
- [ ] PR diff ≤ 800 lines (if larger, split into subtasks)

## Test coverage
<!-- Paste the coverage summary for changed files -->
```
(paste here)
```

## Screenshots / Demo
<!-- For UI changes — before/after screenshots -->

## Notes for reviewer
<!-- Anything tricky, context, trade-offs -->
