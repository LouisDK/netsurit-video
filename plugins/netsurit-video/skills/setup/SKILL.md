---
name: setup
description: Check and set up a computer to make Netsurit videos with the netsurit-video plugin — Node, ffmpeg, Playwright + Chromium, the Oxygen font, Python + faster-whisper and the ElevenLabs API key — with install steps for Windows (WSL2 or native), macOS and Linux, then a test render. Use when someone first installs the plugin, when the video skill reports missing prerequisites, or when they ask "what do I need to make a Netsurit video?".
---

# Set up for Netsurit videos

The tools live in the sibling `video` skill: `V=<this skill's base directory>/../video`. Work through this with the user step by step; run the commands yourself where you can, and hand them anything needing `sudo` or an installer window (suggest `! <command>` so the output lands in the chat). Never print, echo or log the ElevenLabs key.

## 1. Check
```bash
node "$V/scripts/check.mjs"
```
No Node at all → install it first (below), then rerun. The report marks each item OK / MISS (required) / WARN (recommended) / skip (optional) with the fix for this OS.

## 2. Fix, in this order

**Windows:** the toolchain is proven under **WSL2 (Ubuntu)**; native Windows should work (the tools are Node, and the checks know Windows), but is not yet proven. Recommend WSL2 unless the user prefers native:
- WSL2: in an admin PowerShell `wsl --install -d Ubuntu`, restart, open Ubuntu, then follow the Linux steps inside it. Run Claude Code inside WSL, and keep projects in the Linux home (`~/…`), not under `/mnt/c` (much slower).
- Native: `winget install OpenJS.NodeJS.LTS Gyan.FFmpeg Python.Python.3.12`, open a new terminal, then the common steps.

**macOS:** `brew install node ffmpeg python` (Homebrew from brew.sh first if needed).

**Linux / WSL2 (Ubuntu):**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs ffmpeg python3-pip
```

**Common steps (every OS):**
```bash
npm i -g playwright && npx playwright install chromium
# Linux/WSL only: the browser's system libraries
sudo npx playwright install-deps chromium
node "$V/scripts/install-fonts.mjs"                          # Oxygen, the Netsurit typeface (for this user)
python3 -m pip install --user --break-system-packages faster-whisper "av==15.1.0"   # Windows: python -m pip install --user faster-whisper "av==15.1.0"
```
- **Why PyAV 15.1.0:** faster-whisper 1.2.1 passes an argument PyAV 19 removed; audio decoding then crashes. The check decodes a test tone to prove the pair works.
- Older pip (Ubuntu 22.04 and before) doesn't know `--break-system-packages`: drop it there.
- The first voice timing downloads the `small.en` Whisper model (~460 MB) once.
- Optional, Linux only: `sudo apt install -y espeak` for a scratch voice (not needed: the starter times itself from its script).

**ElevenLabs key** (narration and music): see `$V/netsurit/voice.md` → "Set up once". The key goes in a `.env` file in the user's video project folder (`ELEVENLABS_API_KEY=...`), with `.env` in `.gitignore`. Ask whether Netsurit has a shared account before they create one.

## 3. Prove it with a test render
In the user's project folder (or a scratch folder):
```bash
node "$V/scripts/new-piece.mjs" hello-netsurit --title "Hello, Netsurit" --name "<their name>" --tagline "Break free from|ordinary IT."
node "$V/engine/tools/build.mjs" pieces/hello-netsurit
node "$V/engine/tools/still.mjs" pieces/hello-netsurit 3,10,18,24 hello.png --scale 0.4
node "$V/engine/tools/export.mjs" pieces/hello-netsurit --share
node "$V/engine/tools/review.mjs" pieces/hello-netsurit
```
Show `hello.png`: the byline with the red N bottom left, Oxygen type, a charcoal head with a red core, the black end card. The review should pass every check (about 2 minutes in all). If the type looks like Arial, the font isn't installed for the browser: rerun `install-fonts.mjs`, then `check.mjs`.

Then tell them they're ready: "Ask me to make a Netsurit video about …" (the `video` skill takes it from there). They can delete `pieces/hello-netsurit`.
