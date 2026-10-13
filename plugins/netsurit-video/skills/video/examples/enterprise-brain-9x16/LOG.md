# WhatsApp version (9:16) — LOG

The primary version for sending, made on 2026-10-12. It is a vertical re-layout of `pieces/enterprise-brain-netsurit` (16:9).

- **Unchanged from the 16:9 Netsurit version:**
  - the voice, the Eleven Music track (`audio/track-endcard.wav`), the sound effects and every cue timed to the words;
  - the story and the brand layer.
- **Re-laid out for 1080×1920:** every scene, the morph ends (`common.js` geometry), the lower third and the end card. Per scene:
  - **Hook:** the head fills the middle, "you" stand on the right, and the rule drops under the chin.
  - **Librarian:** the sources (3 columns) are above the answer card.
  - **Clerk:** the ledger is on top; the Clerk, his CRM/ERP badges, the email and the count card are below.
  - **Turn:** the rooms are stacked, with the slot between them.
  - **Claim:** the email is above the claim, and the four callouts are tags on their rows.
  - **Signals:** three cards are stacked, and the network with its ranked list is at the bottom.
  - **Loop:** the same framing as the hook; the Librarian and the Clerk stop under the chin.
- **Built for WhatsApp's re-encode:**
  - the head is flat (no animated grain), the sheets are flat Mist (no drifting waves) and every line is 1.35× thicker;
  - the sheet scenes hold still (on a full-height layout, any zoom would crop the bottom cards), so only the head scenes have camera moves.
- **Sizes:** body text ≥ 26 px, captions 54 px on two lines, titles 84 px. The safe area is y 180–1700, clear of WhatsApp's top bar and scrubber.
- **Not burned in:** captions (by choice).

- **Review (2026-10-12):** every check passes except one.
  - Passing: story arc 4/4, text (0 cut-off, overlapping or in the safe zone), morphs, no still stretch over 3 s, no flat frames. Loudness is −14.3 LUFS with a true peak of −1.4 dBFS, the same as the 16:9 version.
  - The only failure is the known density line, "So who do you ask?", inherited from the script.
- **Fixes made during the review:**
  - The claim's v2 rises from below, and v1's rows fade as it steps back, so the two cards never mix.
  - The sheet cameras came back: the 16:9 keys with x pulled toward the centre. They zoom from the top edge, and there is about 220 px of empty background under the lowest card.
  - The bottom lines ("Same weight", the bands, the © line) and the WED calendar were moved inward, so they stay clear of the safe zone even at full zoom.
  - The end card has a slow push-in.
- **Deliverables:** `encode-whatsapp.sh` encodes from the lossless PNG frames.
  - `renders/whatsapp.mp4` (send this one in chats): 720×1280, two-pass H.264 at 569 kbit/s plus 96k AAC, 14.8 MB. SSIM against the lossless frames is 0.9993; small text stays crisp.
  - `renders/whatsapp-hd.mp4`: 1080×1920, CRF 18, 18.7 MB. Send it as a document, by email or as a download link.
- **Still to do:** a test send to yourself on WhatsApp, both as a standard send and as HD, watched on a phone.

---


# Netsurit CI version — LOG

A copy of `pieces/enterprise-brain-music` (picture, George's voice and the Eleven Music track unchanged), re-branded to `ci/Netsurit-CI-Guide.md`.

- **src/brand.js** (loaded after the style kit) does most of the work:
  - It remaps `IG`: the head is charcoal with a red core (belief), the Librarian is Azure, the Clerk is Steel, and structure is charcoal/black on Mist.
  - It sets Oxygen as the only font. The fonts are installed in `~/.local/share/fonts` from `ci/fonts`, so headless Chromium finds them by name; on another machine, install them first.
  - It neutralises the kit's shadow and glow.
  - It draws the N symbol in code in the 2026 red. `N.png` is the older red.
  - It adds the opening lower third (0.4–10.6 s) and the end card.
- **End card:** 5.5 s after the voice. The music is `audio/track-endcard.wav`, which is `track.wav` plus 5.5 s of silence (the track tail is already about −50 dB). The total is 176.712 s.
- **Titles** are in sentence case. Red is kept for belief and emphasis only.
- **Stills for sign-off:** `review/ci-stills.jpg`. Not yet exported or reviewed.
- **Known, inherited:** at about 45 s the TUE calendar drops over "Based on 3 documents". That overlap is also in the original.

---

# Eleven Music pilot — LOG

A copy of `pieces/enterprise-brain` with the code-composed music replaced by an Eleven Music track.

- **Unchanged:** the picture, George's voice and the sound effects. The frames are a symlink to the original's.
- **Changed:** `piece.json` gains `"music"`, and `src/score.js` moves the hit's sub and noise to the sfx bus so they still land under a supplied track.

## Access (2026-10-11)

- **Plan:** ElevenLabs Starter ($6/mo). The Music API works with the existing `ELEVENLABS_API_KEY`; no extra key permissions were needed.
- **Endpoints used:**
  - `POST /v1/music/detailed` (compose with a plan) returns `multipart/mixed`: a JSON part (`composition_plan`, `song_metadata`, `words_timestamps`, `waveform_visual`) plus an mp3 part. The song id is in the `song-id` response header.
  - `POST /v1/music/stem-separation` (`two_stems_v1`) returns a zip with `vocals.mp3` and `instrumental.mp3`.
- **Credits:** about 6,745 for everything below: a 13 s sung test, one stem split and three 2:51 takes. That is about 2,100 credits per 3-minute take.

## The sung test (13 s, music_v2_5, `with_timestamps`)

- `words_timestamps` = `[{word, start_ms, end_ms}]`, for example "Memory" 6760–7840 and "compounds" 7940–9860.
- **Accuracy:** on the vocal stem's envelope, the vocal starts at 6.78–6.80 s and the dip before "compounds" ends at about 7.96 s. That puts the API timestamps within about 1 frame.
- **faster-whisper on the full mix** heard "Thanks for watching!", a hallucination. Our `voice_words.py` cannot time sung vocals in a mix.
- **faster-whisper on the vocal stem** got all 6 words right (an intelligibility proxy), but its times were 0.3–0.4 s late.
- **Rule:** time sung words from `words_timestamps`. Use the vocal stem plus Whisper only to check intelligibility.

## The bed (`audio/plan.json`, music_v2_5, 9 chunks summing exactly to 171,212 ms)

- **Section lengths are exact,** and so is the total (171.19 s against 171.21 s).
- **Tempo:** "120 bpm" in the styles gave 119.99 BPM on all three takes, so it sits on the piece's 120 BPM grid.
- **Take 1** (seed 4117) and **take 2** (seed 8231): the model put a 2.8–3.8 s fade or gap at the *start* of the "drop" chunk, so the arrival was late (88.0 s and 87.0 s instead of 84.2 s). Asking for "a sudden stop" at the end of the previous chunk made it worse. Placement inside a chunk is not controllable, but this lead-in gap was consistent.
- **Take 3** (chosen): the drop chunk starts 3 s early (turn chunk 6.2 s, drop chunk 13.55 s). The arrival then landed at 84.02 s.
- **Post edit,** in `audio/track-raw.wav` (made by ffmpeg): 
  - fade out 82.33–82.45 s (the end of "…and why");
  - true silence 82.45–84.19 s;
  - the track resumes from its 84.01 s onset, placed at 84.19 s.
  - **Rule:** do silences and the hit's exact placement in post, not in the prompt.
- **Mix automation** on top, giving `audio/track.wav`. Settings are in `brief`/this log:
  - keepers −1.5 dB;
  - payoff section 0 dB;
  - claim −1 dB;
  - signals −2 dB;
  - close −7 dB, ramped over 1.5 s.
  - These were needed for the arc rules. The model's sections don't follow the plan's dynamics: the "fullest moment" and "fades" asks were only partly honoured.

## Review history

| Pass | Story arc | Payoff (loudest 100 ms) | Silence before | LUFS |
|---|---|---|---|---|
| Raw take 3 | 3/4 (close not decaying) | 132.3 s, signals (wrong act) | 0.0 s | −14.3 |
| −2.5 dB after the drop, −5 dB close | 2/4 | **84.2 s, the hit** | 1.6 s | −14.4 |
| keepers −1.5, after the drop −1, close −7 | **4/4** | 132.3 s (−9.4, beat the hit by 0.4 dB) | 0.0 s | −14.3 |
| + signals −2 (final) | **4/4** | **84.2 s, the hit** (−9.8) | 1.6 s | −14.3, true peak −1.5 |

The final review passes everything (morphs, arc 4/4, text, sound, dead beats) except the known h4 density line, the same as the original.

## To make reusable (tools/music.mjs)

- Build the chunks from the piece's era times, and start the drop chunk 3 s early.
- Call the API, split the multipart response, save the plan, the metadata and the song id.
- Do the silence and the splice onto the hit in post, plus per-section gain automation.
- `with_timestamps` adds `music.json` for sung words.
- The review should flag when the track's own peak beats the hit.

## Mix change (2026-10-11, after the user listened)

- **Request:** the music was a tad loud, so lower it by 30%.
- **What worked:** `voice.music` −12 → −15.1 dB.
- **Measured result:** the music in the voice gaps is 2.4–2.5 dB lower (about 25% in amplitude), and the voice is unchanged. The final loudness pass ate about 0.6 dB of the change.
- **Trap:** `music.gain` does nothing for this. Export normalizes the track plus the sfx to −14 LUFS straight after applying it, so the only effect is that the sfx get louder relative to the track.
