# Narration: ElevenLabs by API key

The voice is the clock: the picture is timed to the words, so the voice comes **before** the scenes are final. (Until then the starter times itself from `SCRIPT` in `src/head.html`.)

## Set up once
1. An ElevenLabs account (the Starter plan, about $6 a month, was enough for The Enterprise Brain: ~2,300 credits for the voice, ~2,100 per 3-minute music take). Ask your manager whether Netsurit has a shared account first.
2. **Developers → API keys → Create**, with permissions: Text to Speech, Voices (read), Music (for music.md), User (read).
3. In your project folder (not in a piece, not in the plugin), create `.env`:
   ```
   ELEVENLABS_API_KEY=sk_...
   ```
   and add `.env` to `.gitignore`. The scripts find it there; never paste the key into a chat, a log or a file that gets shared.
4. `node <skill>/scripts/check.mjs` shows whether the key works and the credits left.

## Per piece
```bash
S=<skill>/scripts T=<skill>/engine/tools
node $S/tts.mjs pieces/<name> --count                              # characters ≈ credits, and the balance: tell the user
node $S/tts.mjs --search narrator                                  # voice ids (yours + the library)
node $S/tts.mjs pieces/<name> --sample JBFqnCBsd6RMkjVDRZzb,<id2>,<id3> --line l1   # one line in 2–3 voices
#   play them to the user (voice/samples/), let them pick
node $S/tts.mjs pieces/<name> --voice <chosen id>                  # every line once -> voice/<id>.mp3, "file" set in script.json
node $T/voice.mjs pieces/<name>                                    # voice/voice.wav + voice.json (word times, faster-whisper, local)
```
Then add to `piece.json`: `"voice": { "file": "voice/voice.wav", "music": -15 }` and rebuild. Every `VW()` cue moves onto its word.

- **George** (`JBFqnCBsd6RMkjVDRZzb`, premade, `eleven_multilingual_v2`) narrated The Enterprise Brain: calm, British, credible for a business audience. A library voice must be added to "My voices" in the ElevenLabs app before the API can use it.
- Write the script as spoken: numbers and acronyms spelled the way they should sound ("C R M", "twenty rows").
- **Re-takes:** edit the line's text (or not), `tts.mjs <piece> --voice <id> --lines l3 --force`, rerun `voice.mjs`, rebuild. Check the cues that point at a changed word.
- **Too fast:** `ffmpeg -i voice/l1.mp3 -af atempo=0.94 voice/l1.slow.wav`, set that line's `"file"` to `l1.slow.wav`, rerun `voice.mjs` (0.88–0.97 sounded natural).
- **Pauses:** each line's `"after"` (seconds of silence after it) shapes the edit; lengthen it where the picture needs to land.
- **The user's own recording** works too: one file per line in `voice/`, `"file"` set per line, then `voice.mjs`.
- Without faster-whisper, `voice.mjs` estimates word times from the letters (cues land roughly); install it (`check.mjs` shows how).
- Never clone a real person's voice without their written consent; never use a voice from a source the user didn't choose.
