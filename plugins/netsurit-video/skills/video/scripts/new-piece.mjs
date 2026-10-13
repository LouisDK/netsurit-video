#!/usr/bin/env node
// Start a Netsurit piece from the starter: pieces/<name>/ with the brand layer, the logo assets and the byline filled in.
//   usage: node <skill>/scripts/new-piece.mjs <name> --title "The title" --name "Your Name" [--unit "Netsurit Innovate"]
//          [--date "October 2026"] [--tagline "Memory that|compounds."] [--format 9:16|16:9] [--dir pieces]
//   --format: the main shape (9:16 = WhatsApp, the default); the other is always available with ?format= / --format.
//   --tagline: the end card's headline; "|" splits it into lines on 9:16.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2), name = argv[0];
const opt = (k, d) => { const i = argv.indexOf('--' + k); return i > 0 ? argv[i + 1] : d; };
if (!name || name.startsWith('--') || !/^[a-z0-9][a-z0-9-]*$/.test(name)) {
  console.error('usage: node new-piece.mjs <name: lowercase-with-dashes> --title "..." --name "..." [--unit ..] [--date ..] [--tagline "a|b"] [--format 9:16|16:9]');
  process.exit(2);
}
const month = new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' });
const V = {
  NAME: name,
  TITLE: opt('title', name.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())),
  PERSON: opt('name', ''),
  UNIT: opt('unit', 'Netsurit Innovate'),
  DATE: opt('date', month),
  FORMAT: opt('format', '9:16'),
  TAGLINE: (opt('tagline', 'Break free from|ordinary IT.')).split('|').map((s) => s.trim()),
};
if (!['9:16', '16:9'].includes(V.FORMAT)) { console.error('--format must be 9:16 or 16:9'); process.exit(2); }
const out = path.resolve(opt('dir', 'pieces'), name);
if (fs.existsSync(out)) { console.error(`${out} already exists: pick another name (nothing was changed)`); process.exit(1); }

const q = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const fill = (s) => s
  .replaceAll('__TITLE__', V.TITLE).replaceAll('__FORMAT__', V.FORMAT)
  .replaceAll("'__NAME__'", `'${q(V.PERSON)}'`).replaceAll('__NAME__', V.NAME)
  .replaceAll('__UNIT__', q(V.UNIT)).replaceAll('__DATE__', q(V.DATE))
  .replaceAll('__TAGLINE__', JSON.stringify(V.TAGLINE).replace(/","/g, '", "'));
fs.cpSync(path.join(SKILL, 'starter'), out, { recursive: true });
for (const f of ['src/head.html', 'piece.json', 'brief.md', 'LOG.md']) {
  const p = path.join(out, f); if (fs.existsSync(p)) fs.writeFileSync(p, fill(fs.readFileSync(p, 'utf8')));
}
// the 16:9 main format: its own safe area for review
if (V.FORMAT === '16:9') {
  const pj = JSON.parse(fs.readFileSync(path.join(out, 'piece.json'), 'utf8'));
  pj.format = { ...pj.format, width: 1920, height: 1080 }; pj.review.safe = { top: 60, bottom: 110, right: 60 };
  fs.writeFileSync(path.join(out, 'piece.json'), JSON.stringify(pj, null, 2) + '\n');
}
fs.copyFileSync(path.join(SKILL, 'netsurit/brand.js'), path.join(out, 'src/brand.js'));
fs.mkdirSync(path.join(out, 'assets'), { recursive: true });
for (const f of ['N2026.png', 'N.png']) fs.copyFileSync(path.join(SKILL, 'netsurit/ci', f), path.join(out, 'assets', f));
console.log(`made ${path.relative(process.cwd(), out) || out}  (${V.FORMAT}, "${V.TITLE}", ${V.PERSON || '(no name yet)'} · ${V.UNIT} · ${V.DATE})`);
console.log(`next: node ${path.relative(process.cwd(), path.join(SKILL, 'engine/tools/build.mjs'))} ${path.relative(process.cwd(), out)}`);
