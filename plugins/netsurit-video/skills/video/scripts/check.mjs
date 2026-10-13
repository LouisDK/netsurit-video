#!/usr/bin/env node
// Check everything a Netsurit video needs, and say how to fix what's missing (for this machine's OS).
//   usage: node <skill>/scripts/check.mjs [--offline] [--json]
//   --offline: skip the ElevenLabs account call. Exit code 0 when every REQUIRED item passes.
// Never prints the ElevenLabs key: only whether it is set and what the account allows.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync, execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const argv = process.argv.slice(2), OFFLINE = argv.includes('--offline'), JSON_OUT = argv.includes('--json');
const PLAT = process.platform;
const WSL = PLAT === 'linux' && /microsoft/i.test(fs.existsSync('/proc/version') ? fs.readFileSync('/proc/version', 'utf8') : '');
const OS = PLAT === 'win32' ? 'windows' : PLAT === 'darwin' ? 'mac' : WSL ? 'wsl' : 'linux';
const OSNAME = { windows: 'Windows', mac: 'macOS', wsl: 'WSL2 (Ubuntu on Windows)', linux: 'Linux' }[OS];
const SKILL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const results = [];
const add = (level, name, ok, detail, fix) => results.push({ level, name, ok, detail, fix: ok ? null : fix });
const run = (cmd, args, o = {}) => { const r = spawnSync(cmd, args, { encoding: 'utf8', shell: PLAT === 'win32', timeout: 60000, ...o }); return { ok: r.status === 0, out: (r.stdout || '') + (r.stderr || ''), status: r.status }; };
const pick = (m) => m[OS] ?? m.linux;

// ---- 1. Node
const nodeMajor = +process.versions.node.split('.')[0];
add('required', 'Node.js 18+', nodeMajor >= 18, `v${process.versions.node}`, pick({
  windows: 'winget install OpenJS.NodeJS.LTS   (then open a new terminal)',
  mac: 'brew install node   (or the LTS installer from nodejs.org)',
  linux: 'curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs',
}));

// ---- 2. ffmpeg + ffprobe, with libx264
const ff = run('ffmpeg', ['-hide_banner', '-version']), fp = run('ffprobe', ['-hide_banner', '-version']);
const x264 = ff.ok && /libx264/.test(run('ffmpeg', ['-hide_banner', '-encoders']).out);
add('required', 'ffmpeg + ffprobe (with libx264)', ff.ok && fp.ok && x264,
  ff.ok ? (ff.out.match(/ffmpeg version (\S+)/) || [])[1] + (x264 ? ', libx264' : ', NO libx264') : 'not found on PATH', pick({
    windows: 'winget install Gyan.FFmpeg   (then open a new terminal)',
    mac: 'brew install ffmpeg',
    linux: 'sudo apt update && sudo apt install -y ffmpeg',
  }));

// ---- 3. Playwright + Chromium (and, through it, the Oxygen font as the browser sees it)
const require = createRequire(import.meta.url);
let pw = null, pwWhere = '';
try { pw = require('playwright'); pwWhere = 'local'; } catch {
  try { const g = execSync('npm root -g', { encoding: 'utf8', shell: true }).trim(); pw = require(path.join(g, 'playwright')); pwWhere = 'global'; } catch {}
}
let chromiumOk = false, chromiumErr = '', oxygen = null;
if (pw) {
  try {
    const b = await pw.chromium.launch();
    const pg = await b.newPage();
    // a font is installed when text set in it measures differently from the fallback
    oxygen = await pg.evaluate(async () => {
      const c = document.createElement('canvas').getContext('2d'), s = 'Break free from ordinary IT. 0123456789';
      const w = (f) => { c.font = f; return c.measureText(s).width; };
      return ['400', '700'].every((wt) => w(`${wt} 40px "Oxygen", monospace`) !== w(`${wt} 40px monospace`) && w(`${wt} 40px "Oxygen", serif`) !== w(`${wt} 40px serif`));
    });
    await b.close(); chromiumOk = true;
  } catch (e) { chromiumErr = String(e.message || e).split('\n')[0]; }
}
add('required', 'Playwright + Chromium', !!pw && chromiumOk,
  pw ? (chromiumOk ? `playwright (${pwWhere}), Chromium launches` : `playwright found, Chromium won't launch: ${chromiumErr}`) : 'playwright not installed',
  (pw ? '' : 'npm i -g playwright && ') + 'npx playwright install chromium' + (OS === 'linux' || OS === 'wsl' ? ' && sudo npx playwright install-deps chromium' : ''));

// ---- 4. Oxygen (the CI typeface; the build can't embed fonts, so it must be installed)
add('required', 'Oxygen font installed (Netsurit CI)', oxygen === true,
  oxygen === null ? 'not checked (needs Chromium)' : oxygen ? 'Chromium renders Oxygen 400 + 700' : 'not installed: text would fall back to Segoe UI / Arial',
  `node "${path.join(SKILL, 'scripts', 'install-fonts.mjs')}"` + (OS === 'windows' ? '   (or open netsurit/ci/fonts/*.ttf and click Install for each)' : ''));

// ---- 5. Python + faster-whisper (word timings for the voice-over), decoding audio for real
const PY = PLAT === 'win32' ? 'python' : 'python3';
// Ubuntu 23.04+ and Homebrew's Python refuse --user installs (PEP 668) unless told otherwise
const PIP = `${PY} -m pip install --user${OS === 'windows' ? '' : ' --break-system-packages'}`;
const pyv = run(PY, ['--version']);
let fw = { ok: false, detail: '' };
if (pyv.ok) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nscheck-')), wav = path.join(tmp, 't.wav');
  run('ffmpeg', ['-v', 'error', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=0.5', '-ar', '16000', '-ac', '1', wav]);
  const code = 'import sys, faster_whisper, av\nfrom faster_whisper.audio import decode_audio\na = decode_audio(sys.argv[1])\nprint(faster_whisper.__version__, av.__version__, len(a))';
  const r = run(PY, ['-c', code, wav], { shell: false });
  const m = r.out.trim().split(/\s+/);
  fw = r.ok ? { ok: true, detail: `faster-whisper ${m[0]}, PyAV ${m[1]}, decodes audio` }
    : /No module named 'faster_whisper'/.test(r.out) ? { ok: false, detail: 'faster-whisper not installed', fix: `${PIP} faster-whisper "av==15.1.0"` }
    : /metadata_errors/.test(r.out) ? { ok: false, detail: 'installed, but PyAV is too new for it (audio decoding crashes)', fix: `${PIP} "av==15.1.0"` }
    : { ok: false, detail: 'installed but failed: ' + r.out.trim().split('\n').pop(), fix: `${PIP} --upgrade faster-whisper "av==15.1.0"` };
  fs.rmSync(tmp, { recursive: true, force: true });
}
add('recommended', 'Python 3 + faster-whisper (word-accurate voice timing)', pyv.ok && fw.ok,
  pyv.ok ? `${pyv.out.trim()}; ${fw.detail}` : 'python not found',
  pyv.ok ? fw.fix : pick({ windows: 'winget install Python.Python.3.12, then: python -m pip install --user faster-whisper "av==15.1.0"', mac: `brew install python, then: ${PIP} faster-whisper "av==15.1.0"`, linux: `sudo apt install -y python3-pip, then: ${PIP} faster-whisper "av==15.1.0"` }));

// ---- 6. ElevenLabs (voice + music): the key in the environment or ./.env, never printed
let key = process.env.ELEVENLABS_API_KEY, keyFrom = 'environment';
if (!key && fs.existsSync('.env')) { const m = fs.readFileSync('.env', 'utf8').match(/^\s*ELEVENLABS_API_KEY\s*=\s*["']?([^"'\s]+)/m); if (m) { key = m[1]; keyFrom = './.env'; } }
let elDetail = key ? `key set (${keyFrom})` : 'no ELEVENLABS_API_KEY', elOk = !!key;
if (key && !OFFLINE) {
  try {
    const r = await fetch('https://api.elevenlabs.io/v1/user/subscription', { headers: { 'xi-api-key': key } });
    if (r.ok) { const s = await r.json(); elDetail += `; plan ${s.tier}, ${s.character_count}/${s.character_limit} credits used this period`; }
    else { elOk = false; elDetail += `; the API refused it (HTTP ${r.status}): check the key and its permissions`; }
  } catch (e) { elDetail += '; could not reach api.elevenlabs.io (' + (e.cause?.code || e.message) + ')'; }
}
add('recommended', 'ElevenLabs API key (narration + music)', elOk, elDetail,
  'Create a key at elevenlabs.io → Developers → API keys (permissions: Text to Speech, Voices read, Music, User read). Put it in a .env file in your project folder: ELEVENLABS_API_KEY=... and add .env to .gitignore. See netsurit/voice.md.');

// ---- 7. a scratch voice (optional: timing before the real voice exists)
const scratch = OS === 'windows' ? run('powershell', ['-NoProfile', '-Command', 'Add-Type -AssemblyName System.Speech; "ok"']).ok
  : OS === 'mac' ? run('which', ['say']).ok : run('which', ['espeak']).ok;
add('optional', 'OS speech for a scratch voice (voice.mjs --scratch)', scratch, scratch ? 'available' : 'not found',
  OS === 'linux' || OS === 'wsl' ? 'sudo apt install -y espeak   (or skip it: the starter times itself from the script until the real voice exists)' : 'built in on Windows and macOS');

// ---- report
if (JSON_OUT) { console.log(JSON.stringify({ os: OSNAME, results }, null, 2)); }
else {
  console.log(`Netsurit video — prerequisites on ${OSNAME} (${os.arch()})\n`);
  for (const r of results) {
    const mark = r.ok ? 'OK  ' : r.level === 'required' ? 'MISS' : r.level === 'recommended' ? 'WARN' : 'skip';
    console.log(`  [${mark}] ${r.name}${r.level !== 'required' ? ` (${r.level})` : ''}\n         ${r.detail}`);
    if (r.fix) console.log(`         fix: ${r.fix}`);
  }
  const miss = results.filter((r) => r.level === 'required' && !r.ok).length, warn = results.filter((r) => r.level === 'recommended' && !r.ok).length;
  console.log(`\n${miss ? `${miss} required item(s) missing: fix them, then run this again.` : 'Ready to make videos.'}${warn ? ` ${warn} recommended item(s) missing (narration / exact word timing).` : ''}`);
  if (OS === 'windows') console.log('Tip: on Windows the whole toolchain is proven under WSL2 (Ubuntu). Native Windows should work too; use PowerShell, and open a new terminal after each install.');
}
process.exit(results.some((r) => r.level === 'required' && !r.ok) ? 1 : 0);
