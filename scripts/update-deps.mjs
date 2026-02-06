#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const args = new Set(process.argv.slice(2));

if (args.has('--help') || args.has('-h')) {
  console.log(
    `\nUpdate dependencies across the root package + all npm workspaces.\n\nUsage:\n  node scripts/update-deps.mjs [--check] [--no-install]\n\nOptions:\n  --check        Show available updates but do not write package.json files\n  --no-install   Skip "npm install" after updating package.json files\n`,
  );
  process.exit(0);
}

const checkOnly = args.has('--check');
const skipInstall = args.has('--no-install');

const ncuArgs = checkOnly ? '' : ' -u';

function run(command, cwd = repoRoot) {
  execSync(command, {
    cwd,
    stdio: 'inherit',
    env: process.env,
  });
}

function readJson(jsonPath) {
  return JSON.parse(readFileSync(jsonPath, 'utf8'));
}

function getWorkspacePatterns(rootPkg) {
  const ws = rootPkg.workspaces;
  if (!ws) return [];
  if (Array.isArray(ws)) return ws;
  if (ws && Array.isArray(ws.packages)) return ws.packages;
  return [];
}

function expandWorkspacePattern(pattern) {
  // Minimal glob support:
  // - exact path: "ai-skills-loader"
  // - single-star folder globs: "packages/*" or "extensions/*"
  // Other patterns can be added later if needed.

  if (!pattern.includes('*')) {
    return [pattern];
  }

  const normalized = pattern.replace(/\\/g, '/');
  const starIndex = normalized.indexOf('*');
  const base = normalized.slice(0, starIndex).replace(/\/$/, '');

  const baseAbs = path.join(repoRoot, base);
  if (!existsSync(baseAbs)) return [];

  const entries = readdirSync(baseAbs, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.posix.join(base || '', d.name));

  return entries;
}

function isWorkspacePackageDir(relDir) {
  const absDir = path.join(repoRoot, relDir);
  return existsSync(path.join(absDir, 'package.json'));
}

process.chdir(repoRoot);

const rootPkg = readJson(path.join(repoRoot, 'package.json'));
const patterns = getWorkspacePatterns(rootPkg);

const workspaceDirs = new Set();
for (const pattern of patterns) {
  for (const relDir of expandWorkspacePattern(pattern)) {
    if (isWorkspacePackageDir(relDir)) {
      workspaceDirs.add(relDir);
    }
  }
}

console.log('\n==> Updating root dependencies to latest (major bumps included)');
run(`npx -y npm-check-updates${ncuArgs}`, repoRoot);

for (const relDir of [...workspaceDirs].sort()) {
  console.log(`\n==> Updating workspace dependencies: ${relDir}`);
  run(`npx -y npm-check-updates${ncuArgs}`, path.join(repoRoot, relDir));
}

if (!checkOnly && !skipInstall) {
  console.log('\n==> Re-installing to update lockfile');
  run('npm install', repoRoot);
}

console.log(
  checkOnly
    ? '\nDone. Re-run without --check to apply changes.'
    : '\nDone. Review changes and run your build/tests.',
);
