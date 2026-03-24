import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // new feature
        'fix',      // bug fix
        'docs',     // documentation only
        'style',    // formatting, no logic change
        'refactor', // refactoring, no feature/fix
        'perf',     // performance improvement
        'test',     // adding/fixing tests
        'build',    // build system or deps
        'ci',       // CI config
        'chore',    // maintenance
        'revert',   // revert commit
      ],
    ],
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 100],
    'footer-max-line-length': [2, 'always', 100],
  },
  helpUrl: 'https://github.com/GjorgiKrenkov/demo-app/blob/main/docs/COMMIT_CONVENTION.md',
};

export default config;