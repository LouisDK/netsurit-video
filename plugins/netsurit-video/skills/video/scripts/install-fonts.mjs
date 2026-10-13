#!/usr/bin/env node
// Install Oxygen (the Netsurit CI typeface, SIL Open Font License) for the current user, so headless Chromium
// renders it. The build can't embed fonts, so every machine that renders a Netsurit piece needs this once.
//   usage: node <skill>/scripts/install-fonts.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'netsurit', 'ci', 'fonts');
const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.ttf'));
let dest;
if (process.platform === 'win32') {
  dest = path.join(process.env.LOCALAPPDATA, 'Microsoft', 'Windows', 'Fonts');
  fs.mkdirSync(dest, { recursive: true });
  for (const f of files) {
    fs.copyFileSync(path.join(SRC, f), path.join(dest, f));
    // register the per-user font so apps (and Chromium) find it without a sign-out
    const name = `Oxygen ${f.replace(/^Oxygen-|\.ttf$/g, '')} (TrueType)`;
    spawnSync('reg', ['add', 'HKCU\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Fonts', '/v', name, '/t', 'REG_SZ', '/d', path.join(dest, f), '/f'], { stdio: 'ignore' });
  }
} else if (process.platform === 'darwin') {
  dest = path.join(os.homedir(), 'Library', 'Fonts');
  fs.mkdirSync(dest, { recursive: true });
  for (const f of files) fs.copyFileSync(path.join(SRC, f), path.join(dest, f));
} else {
  dest = path.join(os.homedir(), '.local', 'share', 'fonts');
  fs.mkdirSync(dest, { recursive: true });
  for (const f of files) fs.copyFileSync(path.join(SRC, f), path.join(dest, f));
  spawnSync('fc-cache', ['-f', dest], { stdio: 'ignore' });
}
console.log(`installed ${files.join(', ')} -> ${dest}`);
console.log('check: node ' + path.join(path.dirname(fileURLToPath(import.meta.url)), 'check.mjs') + ' --offline   (close and reopen any browser that was already running)');
