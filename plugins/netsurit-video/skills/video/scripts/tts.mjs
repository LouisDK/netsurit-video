#!/usr/bin/env node
// ElevenLabs narration by API key: find narrators, sample a line in a few voices, then generate every line once.
//   node tts.mjs --search narrator                         list voices (yours, then the shared library) with ids
//   node tts.mjs <piece> --count                           characters (≈ credits) the script will cost, and the balance
//   node tts.mjs <piece> --sample <id1,id2,id3> [--line l1] one line in each voice -> voice/samples/<line>-<voice>.mp3
//   node tts.mjs <piece> --voice <id> [--model eleven_multilingual_v2] [--lines l1,l2] [--force]
//        every line (or just --lines) -> voice/<id>.mp3, and sets "file" on each line in voice/script.json.
//        Lines that already have a take are skipped unless --force (re-takes cost credits again).
// The key comes from ELEVENLABS_API_KEY or a .env file (here or above the piece). It is never printed.
// Then: node <skill>/engine/tools/voice.mjs <piece>  (voice.wav + word timings -> voice.json)
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };
const has = (k) => argv.includes('--' + k);
const API = 'https://api.elevenlabs.io';
const GEORGE = 'JBFqnCBsd6RMkjVDRZzb';   // "George", premade: the narrator of The Enterprise Brain

function findKey(from) {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  for (let d = path.resolve(from); ; d = path.dirname(d)) {
    const f = path.join(d, '.env');
    if (fs.existsSync(f)) { const m = fs.readFileSync(f, 'utf8').match(/^\s*ELEVENLABS_API_KEY\s*=\s*["']?([^"'\s]+)/m); if (m) return m[1]; }
    if (path.dirname(d) === d) break;
  }
  console.error('No ELEVENLABS_API_KEY: put it in a .env file in your project folder (ELEVENLABS_API_KEY=...), never in the piece or git.');
  process.exit(2);
}
const piece = argv[0] && !argv[0].startsWith('--') ? path.resolve(argv[0]) : null;
const KEY = findKey(piece || '.');
const H = { 'xi-api-key': KEY };
async function api(p, o = {}) {
  const r = await fetch(API + p, { ...o, headers: { ...H, ...(o.headers || {}) } });
  if (!r.ok) { console.error(`ElevenLabs ${p}: HTTP ${r.status} ${(await r.text()).slice(0, 300)}`); process.exit(1); }
  return r;
}
async function balance() {
  const s = await (await api('/v1/user/subscription')).json();
  return { used: s.character_count, limit: s.character_limit, left: s.character_limit - s.character_count, tier: s.tier };
}

if (has('search')) {
  const q = encodeURIComponent(opt('search', 'narrator'));
  const mine = await (await api(`/v2/voices?search=${q}&page_size=20`)).json();
  const lib = await (await api(`/v1/shared-voices?search=${q}&page_size=20`)).json();
  console.log('your voices:');
  for (const v of mine.voices || []) console.log(`  ${v.voice_id}  ${v.name}  ${[v.labels?.accent, v.labels?.gender, v.labels?.age, v.labels?.description].filter(Boolean).join(', ')}`);
  console.log('voice library (add one to your voices in the ElevenLabs app before using it):');
  for (const v of lib.voices || []) console.log(`  ${v.voice_id}  ${v.name}  ${[v.accent, v.gender, v.age, v.descriptive || v.description?.slice(0, 60)].filter(Boolean).join(', ')}`);
  process.exit(0);
}
if (!piece) { console.error('usage: node tts.mjs <piece> --count | --sample id1,id2 [--line l1] | --voice <id> [--lines ..] [--force];  node tts.mjs --search narrator'); process.exit(2); }
const SP = path.join(piece, 'voice', 'script.json');
const script = JSON.parse(fs.readFileSync(SP, 'utf8'));
const MODEL = opt('model', 'eleven_multilingual_v2');

async function speak(voice, text, out) {
  const r = await api(`/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, model_id: MODEL }),
  });
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
}

const total = script.lines.reduce((n, l) => n + l.text.length, 0);
if (has('count')) {
  const b = await balance();
  const words = script.lines.reduce((n, l) => n + l.text.split(/\s+/).length, 0);
  console.log(`${script.lines.length} lines, ${words} words, ${total} characters ≈ ${total} credits for one full take (re-takes cost again)`);
  console.log(`account: ${b.tier}, ${b.left} of ${b.limit} credits left this period`);
  process.exit(0);
}
if (has('sample')) {
  const voices = opt('sample').split(','), id = opt('line', script.lines[0].id), line = script.lines.find((l) => l.id === id);
  if (!line) { console.error('no line ' + id); process.exit(2); }
  for (const v of voices) {
    const out = path.join(piece, 'voice', 'samples', `${id}-${v}.mp3`);
    await speak(v, line.text, out);
    console.log(`wrote ${path.relative(process.cwd(), out)}`);
  }
  console.log(`${voices.length * line.text.length} characters used. Play them to the user and let them pick one voice.`);
  process.exit(0);
}
const voice = opt('voice', GEORGE), only = opt('lines') ? opt('lines').split(',') : null, force = has('force');
const todo = script.lines.filter((l) => (!only || only.includes(l.id)) && (force || !l.file || !fs.existsSync(path.join(piece, 'voice', l.file))));
const chars = todo.reduce((n, l) => n + l.text.length, 0), b = await balance();
console.log(`${todo.length} line(s), ${chars} characters with voice ${voice} (${MODEL}); ${b.left} credits left`);
if (chars > b.left) { console.error('not enough credits for this run: nothing generated'); process.exit(1); }
for (const l of todo) {
  const file = `${l.id}.mp3`;
  await speak(voice, l.text, path.join(piece, 'voice', file));
  l.file = file;
  fs.writeFileSync(SP, JSON.stringify(script, null, 2) + '\n');   // after each take, so an interrupted run keeps what it made
  console.log(`  ${file}  "${l.text.slice(0, 60)}${l.text.length > 60 ? '…' : ''}"`);
}
console.log(`done. next: node <skill>/engine/tools/voice.mjs ${path.relative(process.cwd(), piece)}`);
