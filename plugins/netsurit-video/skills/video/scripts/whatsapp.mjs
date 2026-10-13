#!/usr/bin/env node
// WhatsApp deliverables, encoded from the lossless PNG frames and the mixed audio (never from another MP4):
//   renders/whatsapp.mp4     720x1280 H.264 (CRF 18, or two-pass to fit when that's too big), under 16 MB: what to send in a chat. WhatsApp's HD send
//                            caps at 720p, so at 720p and inside the size limit it has little left to squeeze.
//   renders/whatsapp-hd.mp4  1080x1920, high quality: send as a document, by email or as a download link.
//   usage: node whatsapp.mjs <piece> [--mb 15] [--format 9:16]   (after engine/tools/export.mjs)
// Proven on The Enterprise Brain (2:57): 14.8 MB at 567 kbit/s, SSIM 0.9993 against the lossless frames.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const argv = process.argv.slice(2), piece = argv[0] && path.resolve(argv[0]);
const opt = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
if (!piece) { console.error('usage: node whatsapp.mjs <piece> [--mb 15] [--format 9:16]'); process.exit(2); }
const pj = JSON.parse(fs.readFileSync(path.join(piece, 'piece.json'), 'utf8'));
const fmt = opt('format', '9:16'), main = (pj.formats || ['9:16'])[0];
const FR = path.join(piece, fmt === main ? 'frames' : 'frames-' + (fmt === '9:16' ? '1080x1920' : '1920x1080'));
const OUT = path.join(piece, 'renders'), A = path.join(OUT, 'audio.wav');
if (!fs.existsSync(path.join(FR, 'f0000.png')) || !fs.existsSync(A)) { console.error(`no frames in ${FR} or no ${A}: run engine/tools/export.mjs first`); process.exit(1); }
const portrait = fmt === '9:16';
const run = (args, o = {}) => { const r = spawnSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args], { stdio: 'inherit', cwd: OUT, ...o }); if (r.status) process.exit(r.status); };
const probe = (f, e) => spawnSync('ffprobe', ['-v', 'error', ...e, '-of', 'csv=p=0', f], { encoding: 'utf8' }).stdout.trim();
const DUR = +probe(A, ['-show_entries', 'format=duration']);
const MB = +opt('mb', 15), AK = 96;
// 1) quality first: CRF 18 at 720p. Flat animation is cheap, so most pieces land well under the limit this way.
// 2) only if that is over the budget: two-pass at the bitrate that fills it (the size budget over the duration,
//    minus audio and ~2% container).
const IN = ['-framerate', '30', '-i', path.join(FR, 'f%04d.png')];
const X = ['-c:v', 'libx264', '-preset', 'veryslow', '-tune', 'animation', '-profile:v', 'high', '-level', '3.1', '-pix_fmt', 'yuv420p', '-g', '60', '-bf', '3'];
const SCALE = ['-vf', `scale=${portrait ? '720:1280' : '1280:720'}:flags=lanczos`];
const AUD = ['-c:a', 'aac', '-b:a', `${AK}k`, '-ar', '48000', '-ac', '2', '-movflags', '+faststart', '-shortest'];
const WA = path.join(OUT, 'whatsapp.mp4');
run([...IN, '-i', A, ...SCALE, ...X, '-crf', '18', ...AUD, WA]);
if (fs.statSync(WA).size <= MB * 1e6) console.log(`quality pass (CRF 18) fits: ${(fs.statSync(WA).size / 1e6).toFixed(1)} MB <= ${MB} MB`);
else {
  const VK = Math.floor(MB * 8e6 / DUR / 1000 * 0.98 - AK);
  console.log(`CRF 18 is ${(fs.statSync(WA).size / 1e6).toFixed(1)} MB: two-pass at ${VK} kbit/s video + ${AK} kbit/s audio to fit ${MB} MB`);
  if (VK < 350) console.log('warning: under ~350 kbit/s small text gets soft; consider a shorter cut, or send whatsapp-hd.mp4 as a document');
  run([...IN, ...SCALE, ...X, '-b:v', `${VK}k`, '-pass', '1', '-an', '-f', 'mp4', process.platform === 'win32' ? 'NUL' : '/dev/null']);
  run([...IN, '-i', A, ...SCALE, ...X, '-b:v', `${VK}k`, '-maxrate', `${VK * 3}k`, '-bufsize', `${VK * 6}k`, '-pass', '2', ...AUD, WA]);
  for (const f of fs.readdirSync(OUT)) if (/^ffmpeg2pass/.test(f)) fs.rmSync(path.join(OUT, f));
}
run([...IN, '-i', A, '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-crf', '18', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-movflags', '+faststart', '-shortest', path.join(OUT, 'whatsapp-hd.mp4')]);
for (const f of ['whatsapp.mp4', 'whatsapp-hd.mp4']) {
  const p = path.join(OUT, f);
  console.log(`${f.padEnd(18)} ${(fs.statSync(p).size / 1e6).toFixed(1)} MB  ${probe(p, ['-select_streams', 'v', '-show_entries', 'stream=width,height,bit_rate'])}`);
}
if (fs.statSync(path.join(OUT, 'whatsapp.mp4')).size > 16e6) console.log('warning: whatsapp.mp4 is over 16 MB; rerun with a lower --mb');
console.log('Before sending it out: send whatsapp.mp4 to yourself (standard and HD) and watch it on a phone.');
