# Examples: The Enterprise Brain

The complete source of the piece this plugin was distilled from (Louis de Klerk, Netsurit Innovate, October 2026): 2:57, 8 chapters, 30 narrated lines, 7 shape morphs.

| folder | shape | notes |
|---|---|---|
| `enterprise-brain-9x16/` | 1080×1920, the WhatsApp version (primary) | every scene re-laid out for a phone; `LOG.md` has the review history |
| `enterprise-brain-16x9/` | 1920×1080 | the original layout, re-branded to the CI |

They include the script (`voice/script.json`), the word timings (`voice.json`), the music plan (`audio/plan.json`) and the beat map, but **no audio** (the voice takes and the track are ~130 MB). So they build and preview silently with the exact timing, and you can render stills from them; a full export needs the audio.

```bash
T=<skill>/engine/tools
node $T/build.mjs <skill>/examples/enterprise-brain-9x16      # then open its index.html (?t=84.2 freezes a frame)
node $T/still.mjs <skill>/examples/enterprise-brain-9x16 30,84.5,170 eb.png --scale 0.3
```
(The build writes `index.html` into the example folder.) To work from one, copy the folder into your own `pieces/` first.

Read in this order: `brief.md` (the story and the sources), `src/head.html` (the voice-led timeline: eras, morphs, acts, board), `src/common.js` (the shared geometry), one scene (`src/s4-brain.js` is the payoff), `src/cams.js`, `src/bridges.js`, `src/score.js`, `LOG.md`. Its `src/brand.js` is an earlier, single-shape version of `netsurit/brand.js`; new pieces use the latter.
