# Music

Two options. **Composed in code** (`src/score.js`, free, proven, every hit exactly where you want it) is the default. **An Eleven Music track** sounds richer and was used for the final Enterprise Brain; it costs about 700 credits per minute per take, and usually 2–3 takes plus some post work.

## Eleven Music, step by step (proven on The Enterprise Brain)
1. Build the piece with the final voice (the acts' times come from it).
2. Draft the plan from the piece's own acts, then edit the styles to the piece (key, instruments, mood per section). Keep `"120 bpm"` in every chunk (the takes landed at 119.99 BPM, on the piece's grid) and keep the durations (the model hits them exactly):
   ```bash
   node <skill>/scripts/music.mjs pieces/<name> --plan     # audio/plan.json: one chunk per act, lengths summing to the piece
   node <skill>/scripts/music.mjs pieces/<name> --count    # ≈ credits per take: tell the user before composing
   node <skill>/scripts/music.mjs pieces/<name> --take 1 [--seed 4117]
   ```
   Instrumental only: the plan forbids vocals (faster-whisper can't time sung words in a mix, and lyrics compete with the narrator).
3. **The chunk with the payoff starts 3 s early** (`--plan` does this): the model fades into a chunk's first ~3 s, so the arrival would otherwise land late. Asking for "a sudden stop" in the prompt made it worse.
4. Find the arrival: `node <skill>/engine/tools/beats.mjs pieces/<name>/audio/em-take1.mp3 pieces/<name>` (its `loudest`, `hits` and `quiet`), and listen.
5. **Place the silence and the hit in post, not in the prompt.** For the Enterprise Brain: fade out over 0.12 s at the end of the turn's last word, true silence to the hit, then the track resumes from its own arrival onset, placed exactly on `TIMELINE.hit`:
   ```bash
   # The Enterprise Brain's numbers: the turn's last word ends at 82.45 s, TIMELINE.hit = 84.19 s, the take's arrival
   # onset = 84.01 s. Fade 82.33-82.45, silence to 84.19, then the track from 84.01 on, starting at 84.19.
   ffmpeg -i em-take3.mp3 -filter_complex \
     "[0:a]atrim=0:82.45,afade=t=out:st=82.33:d=0.12,apad=whole_dur=84.19[x];[0:a]atrim=start=84.01,asetpts=PTS-STARTPTS[y];[x][y]concat=n=2:v=0:a=1" \
     -ar 48000 track-raw.wav
   ```
6. **Section gains** so the review's arc passes (the model only partly follows "fullest" / "fades" in the prompt). What worked: the build −1.5 dB, the payoff 0 dB, later proof sections −1 to −2 dB, the close −7 dB ramped over 1.5 s:
   ```bash
   # example: the build (20-82 s) down 1.5 dB, the close (from 150 s) down 7 dB
   ffmpeg -i track-raw.wav -af "volume=-1.5dB:enable='between(t,20,82)',volume=-7dB:enable='gte(t,150)'" track.wav
   ```
7. Pad the end card: `ffmpeg -i track.wav -af apad=pad_dur=5.5 track-endcard.wav`.
8. In `piece.json`: `"music": { "file": "audio/track-endcard.wav", "start": 0, "gain": 0, "fade": 0.5 }`. Export replaces the score's music bus with the track and keeps its `'s'` bus (sound effects): move every hit you still want to `to = 's'`.
9. Export and review. If the track's own peak beats the hit (the review says where the loudest 100 ms is), lower that section and re-export with `--only-audio` (≈ 4× faster).

## Levels
- Under the narrator: `"voice": { "music": -15 }`. Lower it there; `music.gain` does nothing useful (export renormalises the track to −14 LUFS straight after it).
- The final mix is −14 LUFS, true peak ≤ −1 dB (phones and WhatsApp).

## Licence
Use only music generated on an account whose plan allows commercial use, or tracks Netsurit has licensed. Never fetch music from a site the user didn't point to.
