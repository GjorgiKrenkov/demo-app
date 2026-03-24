/** @type {import('lint-staged').Config} */
export default {
  '*.{ts,tsx}': ['pnpm exec eslint --fix --max-warnings=0', 'pnpm exec prettier --write'],
  '*.{js,jsx,mjs,cjs}': ['pnpm exec prettier --write'],
  '*.{json,md,yaml,yml}': ['pnpm exec prettier --write'],
};
