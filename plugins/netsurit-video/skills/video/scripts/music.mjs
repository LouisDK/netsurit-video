#!/usr/bin/env node
// Eleven Music for a piece: draft a composition plan from the piece's own acts, then compose takes from it.
//   node music.mjs <piece> --plan                draft audio/plan.json from TIMELINE.acts (needs a built index.html):
//                                                one chunk per act, lengths summing exactly to the piece; the chunk
//                                                that holds the payoff hit starts 3 s early (see netsurit/music.md)
//   node music.mjs <piece> --count               the plan's length and the rough credit cost of one take
//   node music.mjs <piece> --take N [--seed S]   compose audio/plan.json -> audio/em-takeN.mp3 (+ .json: the plan the
//                                                model actually used, its metadata, the song id)
// Proven: music_v2_5, "120 bpm" in every chunk's styles lands on the 120 BPM grid; ~2,100 credits per 3-minute take.
// Never asks for vocals. The key comes from ELEVENLABS_API_KEY or a .env file (here or above the piece); never printed.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const argv = process.argv.slice(2), piece = argv[0] && !argv[0].startsWith('--') ? path.resolve(argv[0]) : null;
const opt = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };
const has = (k) => argv.includes('--' + k);
if (!piece) { console.error('usage: node music.mjs <piece> --plan | --count | --take N [--seed S]'); process.exit(2); }
const AUD = path.join(piece, 'audio'), PLAN = path.join(AUD, 'plan.json');
fs.mkdirSync(AUD, { recursive: true });
const CREDITS_PER_MIN = 700;

// a mood per act role: an underscore that leaves room for a narrator, Netsurit-confident, never busy
const ROLE = {
  build:   { tag: 'Intro', pos: ['curious, unresolved', 'soft felt piano', 'sparse plucked arpeggio', 'warm analog pad'] },
  journey: { tag: 'Verse', pos: ['same motif, a touch fuller', 'plucked eighth-note arpeggio', 'soft pulse', 'light percussion', 'understated'] },
  silence: { tag: 'Breakdown', pos: ['thinning out', 'held pad only', 'tension', 'near silence at the end'] },
  gift:    { tag: 'Drop', pos: ['arrival', 'the fullest moment', 'warm major', 'confident', 'wide pads, punchy low end'] },
  goodbye: { tag: 'Outro', pos: ['resolving', 'warm final chord', 'fades out'] },
};
const GLOBAL = ['cinematic corporate underscore', 'instrumental', '120 bpm', 'leaves space for narration'];
const NEG = ['vocals', 'singing', 'choir', 'spoken word', 'busy melody'];

if (has('plan')) {
  const require = createRequire(import.meta.url);
  let pw; try { pw = require('playwright'); } catch { pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
  const html = path.join(piece, 'index.html');
  if (!fs.existsSync(html)) { console.error('build the piece first (engine/tools/build.mjs)'); process.exit(1); }
  const b = await pw.chromium.launch(), pg = await b.newPage();
  await pg.goto(pathToFileURL(html).href + '?export=1');
  const T = await pg.evaluate(() => ({ acts: TIMELINE.acts, duration: TIMELINE.duration, hit: TIMELINE.hit, voice: typeof VOICE !== 'undefined' }));
  await b.close();
  // chunk boundaries = act boundaries; the end card (a goodbye after the voice) is padded with silence in post, not composed
  let acts = T.acts.map((a) => ({ ...a }));
  const endCard = acts.at(-1).role === 'goodbye' && /end card/i.test(acts.at(-1).name) ? acts.pop() : null;
  const total = acts.at(-1).t1;
  // a chunk under 3 s is too short for the model to do anything with: fold it into the one before (a short silence act
  // is made in post anyway)
  for (let i = acts.length - 1; i > 0; i--) if (acts[i].t1 - acts[i].t0 < 3 && acts[i].role !== 'gift') { acts[i - 1].t1 = acts[i].t1; acts.splice(i, 1); }
  const gi = acts.findIndex((a) => a.role === 'gift');
  if (gi > 0) { const lead = Math.min(3, (acts[gi - 1].t1 - acts[gi - 1].t0) * 0.5); acts[gi - 1].t1 -= lead; acts[gi].t0 -= lead; }   // the model fades into a chunk's first ~3 s
  let ms = acts.map((a) => Math.round((a.t1 - a.t0) * 1000));
  ms[ms.length - 1] += Math.round(total * 1000) - ms.reduce((s, x) => s + x, 0);   // exact total
  const chunks = acts.map((a, i) => {
    const r = ROLE[a.role] || ROLE.journey;
    return { text: `[${r.tag}]\n[Instrumental]`, duration_ms: ms[i], positive_styles: [...(i ? [] : GLOBAL), '120 bpm', 'D minor', ...r.pos], negative_styles: NEG };
  });
  const plan = { model_id: 'music_v2_5', with_timestamps: false, seed: 4117, composition_plan: { chunks } };
  fs.writeFileSync(PLAN, JSON.stringify(plan, null, 1) + '\n');
  console.log(`wrote ${path.relative(process.cwd(), PLAN)}: ${chunks.length} chunks, ${(total).toFixed(2)} s` + (endCard ? ` (+ ${(endCard.t1 - endCard.t0).toFixed(1)} s end card: pad with silence in post)` : ''));
  acts.forEach((a, i) => console.log(`  ${a.t0.toFixed(2).padStart(7)}–${a.t1.toFixed(2).padEnd(7)} ${chunks[i].text.split('\n')[0].padEnd(12)} ${a.name}`));
  if (T.hit) console.log(`the payoff hit is at ${T.hit.toFixed(2)} s: place the track's arrival there in post (music.md)`);
  console.log('edit the styles to the piece (key, instruments, mood per section), keep "120 bpm" and the durations.');
  process.exit(0);
}

const plan = JSON.parse(fs.readFileSync(PLAN, 'utf8'));
const secs = plan.composition_plan.chunks.reduce((s, c) => s + c.duration_ms, 0) / 1000;
const est = Math.round(secs / 60 * CREDITS_PER_MIN);
if (has('count')) { console.log(`plan: ${plan.composition_plan.chunks.length} chunks, ${secs.toFixed(2)} s ≈ ${est} credits per take`); process.exit(0); }

const n = opt('take'); if (!n) { console.error('--take N'); process.exit(2); }
let KEY = process.env.ELEVENLABS_API_KEY;
for (let d = piece; !KEY; d = path.dirname(d)) {
  const f = path.join(d, '.env'); if (fs.existsSync(f)) KEY = (fs.readFileSync(f, 'utf8').match(/^\s*ELEVENLABS_API_KEY\s*=\s*["']?([^"'\s]+)/m) || [])[1];
  if (path.dirname(d) === d) break;
}
if (!KEY) { console.error('No ELEVENLABS_API_KEY (environment or .env)'); process.exit(2); }
if (opt('seed')) plan.seed = +opt('seed');
console.log(`composing take ${n}: ${secs.toFixed(1)} s, seed ${plan.seed}, ≈ ${est} credits (a few minutes)…`);
const r = await fetch('https://api.elevenlabs.io/v1/music/detailed', { method: 'POST', headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(plan) });
if (!r.ok) { console.error(`HTTP ${r.status}: ${(await r.text()).slice(0, 400)}`); process.exit(1); }
// multipart/mixed: a JSON part (the plan used, song metadata) and the audio part
const buf = Buffer.from(await r.arrayBuffer()), ct = r.headers.get('content-type') || '';
const boundary = '--' + (ct.match(/boundary=([^;]+)/) || [])[1];
let meta = null, audio = null;
for (let i = buf.indexOf(boundary); i >= 0;) {
  const next = buf.indexOf(boundary, i + boundary.length); if (next < 0) break;
  const part = buf.subarray(i + boundary.length, next), sep = part.indexOf('\r\n\r\n');
  const head = part.subarray(0, sep).toString(), body = part.subarray(sep + 4, part.length - 2);
  if (/application\/json/i.test(head)) meta = JSON.parse(body.toString());
  else if (/audio\//i.test(head)) audio = body;
  i = next;
}
if (!audio) { console.error('no audio part in the response'); process.exit(1); }
const base = path.join(AUD, `em-take${n}`);
fs.writeFileSync(base + '.mp3', audio);
fs.writeFileSync(base + '.json', JSON.stringify({ song_id: r.headers.get('song-id'), seed: plan.seed, ...(meta || {}) }, null, 1) + '\n');
console.log(`wrote ${path.relative(process.cwd(), base)}.mp3 and .json (song id ${r.headers.get('song-id')})`);
console.log('next: listen; find the arrival with engine/tools/beats.mjs; place it on the hit and pad the end card in post (music.md).');
