# The Netsurit explainer playbook

What worked on **The Enterprise Brain** (2:57, 8 chapters, 30 voice lines, 7 shape morphs, 16:9 and 9:16), distilled into rules. The full source is in `examples/`; read the 9:16 one when a rule here isn't enough.

## Story

- **Shape:** hook → the problem made visible → the usual answers fall short (one chapter each) → **the turn** (a held silence) → **the payoff** (the loudest hit, red arrives) → 2–3 proof beats → the close echoes the opening, now full → end card.
  - The Enterprise Brain: "It's Tuesday. A new regulation lands." → a hollow head, facts whose links never arrive → the Librarian (an assistant over files: "words, not beliefs") and the Clerk (an agent over CRM/ERP: "numbers, not beliefs") → two rooms and an empty glowing slot, silence → the slot becomes the head, red core, the hit → one email becomes a claim; it hears silence; it asks every customer → the Librarian and the Clerk plug into the brain → "Models depreciate. Memory compounds."
- **One device you can say in a sentence** ("the company's head starts hollow and ends full"). Every chapter moves it.
- **Open on a concrete moment** (a day, a person, a real-sounding event), not a definition. Fictional examples, labelled as such in the brief.
- **A refrain** helps: a charcoal band with the chapter's verdict ("WORDS, NOT BELIEFS") at the end of each "usual answer".
- **Name the actors** (the Librarian, the Clerk) instead of products, unless the piece is about a product.

## The voice is the clock

- Write the script first, one line per beat. ≤ 3.5 words/s; short lines are fine. A line like "So who do you ask?" spoken naturally will fail the density check (5 words in 0.9 s); it is acceptable, but know it.
- Give a line a longer `"after"` where the picture needs time: a count, a caption, the silence before the payoff (1.5 s+).
- Cue every action on a spoken word: `VW('l2', 'source')` (word start), `VE(...)` (word end), `VL(id).t0/t1`. Morphs sit in the middle of a pause: `gap('l1', 'l2')`, snapped to the 8th grid.
- A slow take: slow just that line with ffmpeg (`-af atempo=0.94`, keep the original), point `"file"` at the slowed WAV, rerun `voice.mjs`. Used on 3 of 30 lines.
- **The payoff hit goes in a pause, never under a word** (the voice ducks the music; a hit under speech disappears).

## Picture: the infographic look in Netsurit colours

- Two modes: **illustration on white** (the head, people, flows, gears, bubbles) and **sheets on Mist** (a two-tone title, white cards, charcoal header bands, pills, badges, connectors). Alternate them by chapter.
- **The hero shape is a head in profile.** Hollow (dashed Steel outline, empty dashed core) while the problem stands; charcoal with a **red core** from the payoff on. Red appears in quantity only from the payoff.
- People: Azure shirt for the first actor (the default `igPerson`), Steel for the second (`nsPersonAs(NS.steel, NS.steelD, …)`), "you" in Azure.
- **Morph bridges** carry the eye between chapters: a "?" bubble becomes the next chapter's card; a card becomes a ledger; the empty slot becomes the head; the core becomes an email card. Both ends are the same rectangles the scenes draw (keep them in one layout object), each bridge sits in a pause, and shapes with similar proportions morph cleanly (tall → wide shows a cross-shaped blob for a moment).
- **Something always moves:** word-cued reframes (cameras), draw-ons, pops, travelling arrowheads. The review fails any stretch over 3 s that barely changes; a slow push-in fixes a hold (the end card has one).

## Layout per shape (one piece, two arrangements)

| | 9:16 (WhatsApp, 1080×1920) | 16:9 (1920×1080) |
|---|---|---|
| safe area | y 180–1700, x 60–1020 (WhatsApp's bar and scrubber) | 60 px top, 110 px bottom, 60 px sides |
| arrangement | stack: title on top, the main card in the middle, actors and sources below | side by side: actor left, card centre/right |
| captions | two short lines, 54 px, baselines 1590 / 1660 | one line, 46 px, baseline 1018 |
| titles | 84 px at y 290, subtitle 36 px | 72 px at y 150, subtitle 30 px |
| body text | ≥ 26 px (phone) | ≥ 22 px |
| head (hero) | ~660–720 px tall, centred | ~620–640 px tall |
| ground line | y 1440 | y 860 (the Enterprise Brain used 935; 860 leaves the lower third and caption clear when the camera zooms) |
| lower third | bottom left, y 1548 (two byline rows) | bottom left, y 966 (one row) |

- Keep the lower-third corner clear while it shows (0.4 s to the first morph).
- Long labels wrap by hand on 9:16; a caption that fits 16:9 runs off 9:16 (the text check catches it; trust it over your eye).
- Cards that slide in from the side on 9:16 get cut by the frame edge: rise them from below instead, and fade the old card's text as the new one covers it.

## Cameras

- Keys `[t, zoom, x, y]` on the words that name things; zoom keys ≤ 1.07 (scaled to ≈ 4.5 %); heavy springs (`SPRING.heavy`).
- **Sheets zoom from the top edge** (`SHEET_ERAS`): the title never crops, and there must be ~200 px of empty wash under the lowest card on 9:16.
- Back to z = 1 before every bridge (the bridge object must be in frame) and before the end card. Never let a zoom push text into the safe zone (the text check reads zoomed frames).

## Sound

- The arc the review checks: the payoff is the loudest act; **0.5–4 s of near-silence before the hit** (the turn); the close decays at least 6 dB below the payoff; −14 LUFS integrated, true peak ≤ −1 dB.
- Composed score: thin minor plucks and pad through the problem, a hard stop before the hit, a chord stab + sub on the hit (`'s'` bus), warm major after, a quiet tail under the end card.
- Under a voice: `"voice": { "music": -15 }` sat right (−12 was "a tad loud"). `music.gain` does **not** lower the music (export renormalises the track); `voice.music` does.
- Eleven Music: see `music.md` (the hit and silences are placed in post, not by the prompt).

## The end card and the byline

- `nsLowerThird({ out })` in the first scene; `nsEndCard(DURATION - 0.3)` at the end of the last scene; `END_CARD = 5.5` s after the voice; `TOTAL = DURATION + END_CARD`.
- Stop drawing captions once the card is opaque (`if (TT < DURATION + 0.3)`): text under it still counts as overlapping.
- With a music track, pad it with 5.5 s of silence for the card (`ffmpeg -i track.wav -af apad=pad_dur=5.5 track-endcard.wav`).

## WhatsApp (9:16) specifics

- WhatsApp re-encodes to 720p at a low bitrate. `brand.js` already flattens the phone build: no grain on the head, a flat Mist wash, lines 1.35× thicker. Avoid soft full-frame gradients and moving noise of your own.
- Deliver from the lossless frames (`scripts/whatsapp.mjs`), never by re-encoding an MP4.

## Review lessons (each cost a rebuild once)

- Morph and cut times off the 8th grid fail: snap them (`onBeat` / `gap`).
- A sound effect early in the piece louder than the payoff fails the arc: soften it.
- First camera passes cut text at frame edges: cap the zoom, centre the hook's moves.
- An object that drops in late (a calendar over a card) can cover text: put it at a card's corner with a border and shadow so it reads on any background.
- A soft red glow needs both colour stops (`addColorStop(0, 'rgba(244,54,76,0.12)')` and `addColorStop(1, 'rgba(255,255,255,0)')`): lose one and it becomes a hard pink disc.
- `brand.js` patches kit functions at load time: anything that needs `ctx` must look it up when called, not when the file loads.
- In the score, don't name a global `L` (the engine's score code declares its own); the starter's layout object is `LAY`.
- Look at `review/phone.jpg` at actual size: if a label is hard to read there, it is too small.
