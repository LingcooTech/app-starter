#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { createWriteStream, existsSync } from 'node:fs';
import { cp, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const DEFAULT_REPOSITORY = 'LingcooTech/ts-app-starter';
const TEXT_EXTENSIONS = new Set(['.md', '.json', '.ts', '.tsx', '.js', '.mjs', '.mts', '.css', '.yml', '.yaml', '.html', '.env', '.example', '.sql', '.toml']);

function usage() {
  console.log(`
Usage:
  npx create-ts-app-starter@latest <directory> [options]

Options:
  --example <name>          Template example (currently: minimal)
  --package-manager <name>  pnpm, npm, yarn, or bun (default: pnpm)
  --skip-install            Do not install dependencies
  --no-git                  Do not initialize a Git repository
  --ref <branch-or-tag>     Template branch or tag (default: main)
  --help                    Show this help
`);
}

function parseArgs(args) {
  const options = { packageManager: 'pnpm', example: 'minimal', ref: 'main', git: true, install: true };
  let directory;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') return { help: true };
    if (arg === '--skip-install') { options.install = false; continue; }
    if (arg === '--no-git') { options.git = false; continue; }
    if (arg === '--example' || arg === '--package-manager' || arg === '--ref') {
      const value = args[++index];
      if (!value) throw new Error(`${arg} requires a value`);
      if (arg === '--example') options.example = value;
      if (arg === '--package-manager') options.packageManager = value;
      if (arg === '--ref') options.ref = value;
      continue;
    }
    if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    if (directory) throw new Error('Only one target directory may be specified');
    directory = arg;
  }
  if (!directory) throw new Error('A target directory is required');
  if (!['pnpm', 'npm', 'yarn', 'bun'].includes(options.packageManager)) throw new Error('Package manager must be pnpm, npm, yarn, or bun');
  if (options.example !== 'minimal') throw new Error(`Example "${options.example}" is not available yet. Use --example minimal.`);
  return { directory, options };
}

async function downloadTemplate(workdir, ref) {
  const archive = join(workdir, 'template.tar.gz');
  let response = await fetch(`https://codeload.github.com/${DEFAULT_REPOSITORY}/tar.gz/refs/heads/${encodeURIComponent(ref)}`);
  if (!response.ok) response = await fetch(`https://codeload.github.com/${DEFAULT_REPOSITORY}/tar.gz/refs/tags/${encodeURIComponent(ref)}`);
  if (!response.ok || !response.body) throw new Error(`Unable to download template (${response.status})`);
  await pipeline(Readable.fromWeb(response.body), createWriteStream(archive));
  execFileSync('tar', ['-xzf', archive, '-C', workdir]);
  const extracted = (await readdir(workdir)).find((entry) => entry.startsWith('ts-app-starter-'));
  if (!extracted) throw new Error('Downloaded template archive has an unexpected layout');
  return join(workdir, extracted);
}

async function copyTemplate(source, target) {
  await mkdir(target, { recursive: true });
  for (const entry of await readdir(source)) await cp(join(source, entry), join(target, entry), { recursive: true, force: true });
  await rm(join(target, '.git'), { recursive: true, force: true });
  await rm(join(target, 'create-ts-app-starter'), { recursive: true, force: true });
  await rm(join(target, 'node_modules'), { recursive: true, force: true });
}

async function transformFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    if (['.git', 'node_modules', '.next', 'dist'].includes(entry.name)) continue;
    const path = join(root, entry.name);
    if (entry.isDirectory()) { await transformFiles(path); continue; }
    const extension = entry.name.includes('.') ? `.${entry.name.split('.').pop()}` : '';
    if (!TEXT_EXTENSIONS.has(extension) && !entry.name.startsWith('.env')) continue;
    const content = await readFile(path, 'utf8');
    await writeFile(path, content.replaceAll('@ts-app-starter', '@my-app').replaceAll('ts-app-starter', basename(root)), 'utf8');
  }
}

function commandFor(manager) {
  return manager === 'pnpm' ? ['corepack', ['pnpm', 'install']] : [manager, ['install']];
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2));
  if (parsed.help) { usage(); return; }
  const target = resolve(parsed.directory);
  if (existsSync(target) && (await readdir(target)).length > 0) throw new Error(`Target directory is not empty: ${target}`);
  const workdir = await mkdtemp(join(tmpdir(), 'create-ts-app-starter-'));
  try {
    console.log(`Creating a TypeScript application in ${target}`);
    const source = await downloadTemplate(workdir, parsed.options.ref);
    await copyTemplate(source, target);
    await transformFiles(target);
    if (parsed.options.git) {
      execFileSync('git', ['init', '-b', 'main'], { cwd: target, stdio: 'ignore' });
      execFileSync('git', ['add', '.'], { cwd: target });
      execFileSync('git', ['commit', '-m', 'Initial project'], { cwd: target, stdio: 'ignore' });
    }
    if (parsed.options.install) {
      const [command, args] = commandFor(parsed.options.packageManager);
      execFileSync(command, args, { cwd: target, stdio: 'inherit' });
    }
    console.log(`\nDone. Next steps:\n  cd ${parsed.directory}\n  cp .env.example .env\n  ${parsed.options.packageManager === 'pnpm' ? 'pnpm dev' : `${parsed.options.packageManager} run dev`}`);
  } finally {
    await rm(workdir, { recursive: true, force: true });
  }
}

main().catch((error) => { console.error(`\nError: ${error.message}`); process.exitCode = 1; });
