---
name: video
description: Make a Netsurit-branded animated explainer video — the netsurit-soft look (soft geometric illustration in the Netsurit CI: white, Mist arches, charcoal people with friendly faces, one red hero shape, Oxygen, the N lockup end card), narrated with ElevenLabs, timed to the words, with an optional Eleven Music score — rendered to MP4 for WhatsApp (9:16, the primary send) and 16:9. Walks through intake, a story check, a look check and a storyboard before animating, and proves the result with measured review checks. Use when someone at Netsurit asks for an explainer, animated video, short, reel or WhatsApp video about a topic, product, service or idea.
argument-hint: "[what the video is about] [source documents]"
---

# Netsurit video

*A plugin by Louis de Klerk (Netsurit Innovate).*

You make short animated explainers in the technique proven on **The Enterprise Brain** (Louis de Klerk, Netsurit Innovate, October 2026): a narrator who drives the timing, shape morphs and diagonal wipes between chapters, a payoff hit, and a black Netsurit end card. The default look is **netsurit-soft** ([its STYLE.md](engine/styles/netsurit-soft/STYLE.md)): friendly flat shapes built from circles and rounded rectangles on white, big Mist arches, people with dot eyes and a smile, pendant lamps, pill rows, and one red hero shape per frame with the N's 45° flag cut. The Enterprise Brain's flat infographic look is still available (`--style infographic`) when someone asks for it or extends an older piece. Every video is code: one `<canvas>` drawn frame by frame, rendered with headless Chromium and ffmpeg.

This skill is a Netsurit layer over a bundled engine (**Animate**, MIT, in `engine/`). All paths below are relative to this skill's base directory (`<skill>`); `T=<skill>/engine/tools`. Pieces live in the user's own project folder at `pieces/<name>/` (create `pieces/` if needed), never inside the plugin.

## 0. Before anything: prerequisites

Run `node <skill>/scripts/check.mjs`. It checks Node, ffmpeg (libx264), Playwright + Chromium, the Oxygen font, Python + faster-whisper, the ElevenLabs key (and the account's credits) and prints the fix for this OS. If a **required** item is missing, stop and walk the user through the fixes (the `setup` skill in this plugin does exactly that), then run it again. Never print the API key.

## Non-negotiables

1. **No animating before the storyboard is approved.** Story check → look check → storyboard check, each with options (AskUserQuestion, recommended option first).
2. **The Netsurit CI, always** (`netsurit/ci/Netsurit-CI-Guide.md`; `src/brand.js` applies it):
   - Oxygen only; headings in sentence case ("One fact, one home", not Title Case).
   - Palette by role (netsurit-soft): white is the ground; Mist arches and domes sit behind subjects; charcoal = people, lamp shades, connectors and dark devices; Steel and fog = furniture, skylines, secondary bars; **Netsurit Red `#F4364C` = the one thing that matters in each frame** (one hero shape: the flag row, the arrow, the key bar) and nothing else; Amber only for lamp bulbs and at most one dot. No blue, outlines, shadows or gradients. Red is the highlight, never the wallpaper. (The infographic look's roles are in `netsurit/brand.js`.)
   - The `N2026` lockup only on black (the end card); never recoloured, stretched or retyped. The N symbol in the lower third is drawn in code in the 2026 red.
   - Every piece opens with the byline lower third (title · name · unit · date) and closes on the end card ("Break free from ordinary IT.", netsurit.com, "© 2026 Netsurit. All rights reserved.").
   - Tone (CI §5): bold, direct, client-first ("you"), human, no buzzword stacks, no exclamation marks. Spelling matches the market (UK/SA English by default).
3. **Every factual claim on screen is checked** with a web search and listed with its source in `brief.md`. Examples are fictional and say so.
4. **Two shapes from one piece:** 9:16 (WhatsApp, the primary send) and 16:9 (decks, LinkedIn, email). Lay each out on purpose (the starter's `LAY` object); never crop one into the other.
5. **"Done" is measured:** `review.mjs` passes for each shape and you have looked at the contact sheets and the phone sheet. Report the numbers.
6. **Secrets and confidentiality:** the ElevenLabs key lives only in a `.env` in the user's project (gitignored), never in a piece, a log or the chat. Only the narration script (and music prompts) go to ElevenLabs; source documents stay local. Say so if the subject is confidential.
7. **Ask before spending credits:** state the character count (`tts.mjs --count`) or the music estimate (`music.mjs --count`) and the balance before any generation.

## The flow

Read these once, before step 1: [netsurit/playbook.md](netsurit/playbook.md) (the proven technique, layout sizes, lessons), then the engine's [craft.md](engine/craft.md) and [grammar/STORY.md](engine/grammar/STORY.md). The engine's own [SKILL.md](engine/SKILL.md) is the full manual for the tools (voice, music, assets, formats, cameras, parallel agents); where it differs from this file, this file wins (the style is fixed, the voice is by API key, there is no style gallery).

### 0. Intake
Ask only what you can't infer from the request and the documents (one AskUserQuestion round, recommended defaults first):
- **Subject and sources:** the documents to explain (read them fully), the audience, and the *one sentence* they should remember.
- **Byline:** the presenter's name, unit (default "Netsurit Innovate"), date (default this month), the title, and the end card's tagline (2–5 words, two lines on 9:16).
- **Length:** 60–90 s for a single idea; up to ~3 min for a full explainer (The Enterprise Brain is 2:57). WhatsApp viewers drop off: shorter wins.
- **Shapes:** 9:16 + 16:9 *(recommended)*, or one of them.
- **Voice:** an ElevenLabs narrator *(recommended; George is proven)*, the user's own recording, or none (captions carry it).
- **Music:** composed in code *(free, proven)*, or an Eleven Music track (≈ 700 credits a minute per take; see [netsurit/music.md](netsurit/music.md)).
- **Captions burned in:** no by default (the narrator and the on-screen words carry it); say WhatsApp autoplays muted in some chats.

### 1. Story check (text)
Follow the proven shape in the playbook: a concrete hook moment → the problem made visible → the usual answers and why they fall short → **the turn** (a held silence) → **the payoff** (the loudest hit; red appears) → proof beats → a close that echoes the opening, now full → the end card. Show the user:
- the one-line idea and the sayable device ("the company's head starts hollow and ends full");
- the script, one line per beat (≤ 3.5 words/s; numbers and names written as spoken);
- a beat table: line, what's on screen, the bridge object into the next chapter, the sound's role.
Ask **approve / change beats / different angle**; revise until approved. Write `brief.md`.

### 2. Start the piece and the look check
```bash
node <skill>/scripts/new-piece.mjs <name> --title "…" --name "…" [--unit "Netsurit Innovate"] [--date "October 2026"] --tagline "Line one|line two" [--format 9:16] [--style netsurit-soft]
```
This copies the starter (netsurit-soft, four eras: the team → a lamp morph → one person at a red laptop → a diagonal wipe → the services sheet → a wipe after a held silence → the red arrow and the hit, plus the end card; voice-led; both shapes), the style's `src/brand.js` and the logo assets. `--style infographic` copies the Enterprise Brain starter (`starter-infographic/`) and `netsurit/brand.js` instead. Put the approved script in `voice/script.json` **and** in `SCRIPT` in `src/head.html` (the stand-in timing until the real voice exists). Build and draw the 2–4 most different beats in both shapes:
```bash
node $T/build.mjs pieces/<name>
node $T/still.mjs pieces/<name> 3,12,20 look.png --scale 0.5                 # 9:16
node $T/still.mjs pieces/<name> 3,12,20 look-wide.png --scale 0.4 --format 16:9
```
Check each frame against [engine/grammar/FRAME.md](engine/grammar/FRAME.md) and [the netsurit-soft STYLE.md](engine/styles/netsurit-soft/STYLE.md) (its frame checklist: one red hero, a soft ground shape, solid fills, faces on every person, a quiet bottom band). For `--style infographic`, use [the infographic STYLE.md](engine/styles/infographic/STYLE.md) minus the colours (brand.js remaps them). Show the images; ask **thumbs up per frame / change the look**.

### 3. Storyboard check
Draw every beat; fill `TIMELINE.board` (one `{ t, title, sound, next }` per beat); `node $T/storyboard.mjs pieces/<name>`; show it; ask for thumbs up/down by panel number. Redraw what's down.

### 4. Build
1. **The voice first** (it is the clock), see [netsurit/voice.md](netsurit/voice.md): `tts.mjs --count`, sample one line in 2–3 voices, let the user pick, generate every line once, then `node $T/voice.mjs pieces/<name>` (word timings) and add `"voice": { "file": "voice/voice.wav", "music": -15 }` to `piece.json`. Rebuild: every `VW(...)` cue now lands on its spoken word.
2. **Scenes:** one file per chapter for long pieces (`src/s1-….js`, listed in `piece.json` `"scenes"` after `src/brand.js`). Cue everything from the voice (`VW`, `VE`, `VL`); change chapters in the pauses (`gap('a', 'b')`): a shape morph (`BRIDGES`, shapes of similar proportions, both ends in `LAY`) or a diagonal wipe (list the time in `NSS_WIPES` and `TIMELINE.cuts`, and hard-cut the eras there).
3. **Cameras:** `pieceCam` in `src/bridges.js`: still, or a slow push of 3 % or less (`push(...)`), back to z = 1 before each morph. (The infographic starter uses word-cued `CAMS` keys instead.)
4. **Sound:** the composed score in `src/score.js`, or an Eleven Music track ([netsurit/music.md](netsurit/music.md)); keep hits on the `'s'` bus.
5. Tile across every morph while you build: `node $T/tile.mjs pieces/<name> tile.png <frames…>`.

### 5. Export and review (every shape)
```bash
node $T/export.mjs pieces/<name> --formats 9:16,16:9 --share     # main shape first (piece.json "formats"[0])
node $T/review.mjs pieces/<name>                                  # the main shape
node $T/review.mjs pieces/<name> --format 16:9                    # the other
```
Fix until it passes: morphs on the grid, story arc (the payoff is the loudest act, the end card decays), **text** (nothing cut off, overlapping or under the player UI), sound (the loudest moment in the payoff with 0.5–4 s of silence before it, −14 LUFS), no dead beats over 3 s. Look at `review/phone.jpg` at phone size. Write a per-shot PASS table in `LOG.md`.

### 6. Deliver
```bash
node <skill>/scripts/whatsapp.mjs pieces/<name>      # renders/whatsapp.mp4 (send this) + whatsapp-hd.mp4
```
See [netsurit/whatsapp.md](netsurit/whatsapp.md). Report: what it is, the files, the review numbers, what the review caught and fixed, the weakest shot, and what you couldn't verify (you can't listen; a test send to themselves on WhatsApp, watched on a phone, comes before distribution). Ask what should change.

### 7. Learn
Append to the piece's `LOG.md`. If something new went wrong or worked, propose a one-line rule for `netsurit/playbook.md` and suggest the user opens an issue or pull request at https://github.com/LouisDK/netsurit-video (the plugin's author, Louis de Klerk), so every colleague gets it.

## Files

| path | what |
|---|---|
| `scripts/check.mjs` | prerequisites, with the fix for this OS |
| `scripts/install-fonts.mjs` | installs Oxygen for the current user (Windows, macOS, Linux/WSL) |
| `scripts/new-piece.mjs` | a new piece from the starter, byline filled in |
| `scripts/tts.mjs` | ElevenLabs narration by API key: search voices, count, sample, generate |
| `scripts/music.mjs` | Eleven Music: a plan drafted from the piece's acts, then takes |
| `scripts/whatsapp.mjs` | the WhatsApp files from the lossless frames |
| `engine/styles/netsurit-soft/` | the default look: `kit.js`, `brand.js` (N symbol, lower third, end card), `STYLE.md`, a demo |
| `netsurit/brand.js` | the CI layer for the infographic look (palette roles, Oxygen, N symbol, lower third, end card, phone flattening) |
| `netsurit/ci/` | the CI guide, `N2026.png` (lockup on black), `N.png` (symbol), Oxygen (OFL) |
| `netsurit/playbook.md` | the proven technique: story shape, timing, layout per shape, camera, sound, review lessons |
| `netsurit/voice.md`, `music.md`, `whatsapp.md` | narration, music, delivery |
| `starter/` | the piece template new-piece.mjs copies (netsurit-soft) |
| `starter-infographic/` | the Enterprise Brain-look template (`--style infographic`) |
| `examples/enterprise-brain-9x16`, `-16x9` | the full source of The Enterprise Brain (no audio: they build and preview silently) |
| `engine/` | Animate 0.4 (MIT): tools, kit, grammar, the netsurit-soft and infographic styles; `engine/SKILL.md` is its manual |

## Honesty about what's proven
Proven end to end: the 2:57 Enterprise Brain in 16:9 and 9:16 (infographic; every check passed except one dense line), both starters in both shapes (every check passed, with stand-in voice timing), WSL2 Ubuntu with Node 22, ffmpeg 6.1, Playwright 1.59. Not yet proven: native Windows and macOS runs (the tools are cross-platform Node; WSL2 is the safe choice on Windows), `music.mjs --take` as packaged here (the same API call and plan format made the Enterprise Brain's track), pieces built from the starters by someone other than their author, and a full-length narrated piece in netsurit-soft (its people are drawn for a few poses: sit, stand, point, type). Say so when it matters.
