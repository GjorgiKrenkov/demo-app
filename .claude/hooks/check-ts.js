#!/usr/bin/env node
// PostToolUse hook: runs ESLint + type-check after every Edit/Write on a .ts/.tsx file.
// If errors are found, injects them into Claude's context so it must fix them.

const { execSync } = require('child_process');
const path = require('path');

/** Convert Git Bash Unix paths (/c/Users/...) to Windows paths (C:\Users\...) */
const toWindowsPath = (p) =>
  p.replace(/^\/([a-zA-Z])\//, (_, d) => `${d.toUpperCase()}:\\`).replace(/\//g, '\\');

let raw = '';
process.stdin.on('data', (chunk) => {
  raw += chunk;
});
process.stdin.on('end', () => {
  let input;
  try {
    input = JSON.parse(raw);
  } catch (_) {
    process.exit(0);
  }

  const filePath = input.tool_input && input.tool_input.file_path;
  if (!filePath || !/\.(ts|tsx)$/.test(filePath)) process.exit(0);

  const cwd = process.cwd();
  // Normalize both to Windows paths for reliable path.relative() on Windows
  const normalizedFile = toWindowsPath(filePath);
  const relFile = path.relative(cwd, path.resolve(normalizedFile));

  // Skip files outside the project
  if (relFile.startsWith('..')) process.exit(0);

  let errors = '';

  try {
    execSync(`pnpm exec eslint --max-warnings=0 "${relFile}"`, { cwd, stdio: 'pipe' });
  } catch (e) {
    const out = [e.stdout, e.stderr]
      .filter(Boolean)
      .map((b) => b.toString())
      .join('');
    errors += `ESLint errors in ${relFile}:\n${out}\n`;
  }

  try {
    execSync('pnpm type-check', { cwd, stdio: 'pipe' });
  } catch (e) {
    const out = [e.stdout, e.stderr]
      .filter(Boolean)
      .map((b) => b.toString())
      .join('');
    errors += `Type-check errors:\n${out}\n`;
  }

  if (errors) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: `⛔ Lint/TS errors detected — fix these before continuing:\n\n${errors}`,
        },
      }),
    );
  }
});
