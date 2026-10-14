# Netsurit soft (soft geometric)

![sample](sample.png)

Friendly, flat, geometric illustration in the Netsurit CI. Everything is built from circles, semicircles, domes and rounded rectangles on white. Big pale arches sit behind the subjects. People have circle heads, dot eyes and a small smile. Pendant lamps have amber bulbs. Rows are pills with round icon badges, and charts use rounded bars. **One signature per frame:** a red bar or arrow ending in a 45° flag cut, like the N. Solid fills only: no outlines, shadows or gradients. The only lines are thin charcoal connectors with end dots.

Motion on 1s: gentle spring pop-ins, then small idle life (blinks, swaying lamps and plants, typing hands, a blinking amber light). Scenes change with a **diagonal wipe**: a red bar leads a Mist panel across the frame along the N's 45°. Shape morphs (for example lamp to lamp) also work.

Made with new-style.md from one AI-generated reference sheet (four 9:16 panels; the sheet itself is not shipped). **This is the Netsurit plugin's default look:** `scripts/new-piece.mjs` starts every piece in it unless `--style infographic` is given.

## Measured (reference → this style, `NSS` in kit.js)

| what | reference | this style |
|---|---|---|
| ground | `#fefefe`, 53% of the sheet | `white #FFFFFF` |
| arches, pills | `#e9eaf1`, 15% | `mist #EBEBF1`, `mistD #E1E2EA` |
| skyline, clouds, far shapes | `#bdc3cd` / `#c4c9d4` | `fog #C5CAD4`, `fogD #B4BAC5` |
| chairs, desk, plants, chart bars | `#9aa3ae` / `#9099a3` | `steel #A1AAB1` (CI Steel), `steelD #8F98A3` |
| figures, hair, lamp shades, connectors | `#2c2827` | `ink #2C2A29` (CI Charcoal) |
| icon badges | `#41484f` | `badge #41484F` |
| hero accent | `#f12b39`, 6% | `red #F4364C` (CI Netsurit Red), `redD #D42A3E` |
| lamp bulbs, one dot | `#fca837` | `amber #FDB736` (CI Amber) |
| skin | `#fdbc89` | `skin #FDBD8B` |
| placeholder lines | `#d5d7e2` | `skel #D6D8E2` |
| connectors | ~2.2px on a 466px panel | `NSS_LINE` 5px at 1080 |

Blue (`#0E75CB`) was tried in an earlier reference round and dropped: with red and amber it read as Google's palette. Don't bring it back.

## Palette and meaning

- **White is the ground (about 60%).** Mist arches and domes sit behind subjects, cropped by the frame edge.
- **Red is the one thing that matters in each frame:** the laptop, the flag row, the key chart bar, the arrow. Never use it for body text or backgrounds.
- **Charcoal** is for people's tops, hair, lamp shades, connectors and dark devices. **Steel and fog** are for furniture, skylines, clouds and secondary bars.
- **Amber** is only for lamp bulbs and at most one small dot.

## Type

Oxygen only (CI): 700 for labels and captions, 400 for secondary lines. Sentence case. At 1080 wide: caption 54, row label 42% of the row's height (80 on a 190px row), lower-third title 44.

## Motion habits

- `ones: true`. Entrances use closed-form springs: `nssPop` (people, badges, devices; gentle overshoot), `nssSettle` (arches, rows, captions; almost none) and `nssDraw` (lines, bars, write-ons). `nssIn` pops a shape in from its base: it rises 24px and scales up from 0.85.
- Stagger groups by 0.15–0.25 s.
- Idle life once things land: blinks every 2.6–4.2 s (seeded per person), lamps sway ±2.6°, plants sway, typing hands, the device's amber light blinks.
- **Scene changes:** `NSS_WIPES = [t, ...]` in the head makes the kit draw a diagonal wipe centred on each t. Hard-cut the eras at exactly t underneath it, and list the times in `TIMELINE.cuts`. The `bridges.js` shape morph also works (flat: no rim, no shadow); morph shapes of similar proportions, such as lamp shade to lamp shade.
- Camera: still, or a slow push of 3% or less.

## Frame checklist (on top of grammar/FRAME.md)

1. **One red hero shape per frame.** If a frame feels red, it has too much.
2. **A soft ground shape** (a Mist arch, a dome or a pale circle) sits behind the main subject on most frames.
3. **Solid fills only:** no outlines on shapes, no shadows, no gradients. The only lines are connectors (and lamp cords).
4. **Everything is built from circles and rounded rectangles.** The single exception is the flag cut, at 45°.
5. **People are friendly,** with dot eyes, a smile and relaxed poses, and they interact (pointing, typing, talking). No faceless silhouettes.
6. **The bottom band is quiet:** the art ends by about y 1560 on 9:16, and the caption sits alone beneath it (`nssCaption`, centred, charcoal with a red emphasis run).
7. **Sentence-case Oxygen,** with short labels on rows.

## Kit API (`kit.js`; everything is prefixed `nss`)

- **Motion:** `nssSpring`, `nssPop`, `nssSettle`, `nssDraw`, `nssAt(x, y, k, fn, alpha)`, `nssIn(x, y, p, fn)`.
- **Shapes:** `nssFill`, `nssCirc`, `nssRR(x, y, w, h, r, c)`, `nssLimb(P, w, c)`, `nssDome(cx, baseY, r, c)`, `nssArch(x, y, w, h, c)`, `nssFlagPts(x, y, w, h)`, `nssConnector(P, p, {t1})`, `nssRound`.
- **Text:** `nssText`, `nssRich`, `nssSkel`, `nssCaption([['plain'], ['red', 1], ...], {at, y})`.
- **Icons:** `nssIcon('cloud' | 'shield' | 'bars' | 'check' | 'person', x, y, r, c)`, `nssCloud(x, y, s, c)`.
- **World:**
  - `nssLamp(x, top, len, r, key)` and `nssLampShadePts` (for lamp morphs)
  - `nssPlant(x, baseY, s, key)`, `nssSkyline(baseY, [[x, w, h, dome, c], ...])`
  - `nssChair(x, seatY, f, {floor})`, `nssLaptop(x, y, w, {chart, p})`
- **People:** `nssPerson(x, y, s, { pose: 'sit' | 'stand', f: 1 | -1 | 0, top, legs, hair: 'short' | 'bun' | 'long', hands, point, floor, noLegs, key })`. Here s is the head's radius: about 60 for a group, 150 for a close-up.
- **Sheet:** `nssRow(x, y, w, h, label, icon, p, {hero, t})` (`hero` makes it the red flag row), `nssChart(x, baseY, w, h, vals, p, {trend})`, `nssDevice(x, y, w, h, p)`, `nssArrow(tailX, tailY, len, th, p)` (rises at 45°, tail cut level).
- **Wipe:** `nssWipeAt(tc)`, which `STYLE.post` draws for every entry in `NSS_WIPES`.

## Netsurit furniture (`brand.js`)

`netsurit/brand.js` patches the infographic kit and can't load with this style, so this folder has its own. `new-piece.mjs` copies it to the piece's `src/brand.js` (listed first in `"scenes"`); a piece can also list `"styles/netsurit-soft/brand.js"` directly, as `demo/` does. It needs `BYLINE`, `TOTAL`, `SAFE` in the head and `assets/N2026.png`.

- `nssSymbol(x, y, h)` draws the N in the 2026 red.
- `nssLowerThird({ in, out, x, y })` draws the opening byline at the bottom left. It sits where the caption goes, so start the first caption after `out`.
- `nssEndCard(DURATION - 0.3)` stops captions once it has covered the frame (`NSS_COVER`), so the text check stays clean. It wipes in diagonally to black, then shows the lockup, the eyebrow, the tagline, the byline, "Break free from ordinary IT.", netsurit.com and the legal line. It works on 9:16 and 16:9 (a long 16:9 tagline shrinks to fit).

## Using it in a piece

`node <skill>/scripts/new-piece.mjs <name> ...` gives a voice-led piece in this style for both shapes (the plugin's `starter/`: team → lamp morph → desk → wipe → services sheet → wipe, silence → the arrow and the hit → end card). Its `LAY` holds one arrangement per shape; the team and the desk are drawn on a 1080-wide stage that 16:9 scales and centres (`stage(S, fn)`, `at(S, point)`), with the wide backdrop drawn natively around it. A project may override the style with its own `<project>/styles/netsurit-soft/` (the build looks there first).

## Do / don't

- **Do** put one big soft shape behind the subject, use one red hero, keep generous white, and give every person a face.
- **Don't** add outlines to shapes, drop shadows, gradients, blue, more than one amber accent, all-caps headings (the end card's eyebrow is the CI exception), or puffy free-form clouds (use `nssCloud`).

## Not matched (deliberately or not yet)

- **Group-scene arms are simpler than the reference:** thick round strokes that can merge with the torso where they overlap. Close-ups match well.
- **There is no 3/4 head turn:** faces are side-on (`f: ±1`) or front (`f: 0`).
- **16:9 reuses the 9:16 people on a scaled stage:** the team and the desk are smaller on 16:9 than a native wide drawing would make them.

## Proven on

- `demo/`: 17.5 s, 9:16. Four scenes (team, close-up, services sheet, the rising arrow), one lamp-to-lamp morph, two diagonal wipes, the byline lower third and the end card. Build, stills and tile pass (`deterministic: true`). `review.mjs` passes on 9:16: cuts and the morph on the grid, story arc 3/3, text 0 problems, no dead beats, −14.2 LUFS, with the loudest moment in the payoff. 
- The plugin's `starter/` (from `new-piece.mjs`, with its stand-in voice timing): 25 s, 4 eras, one lamp morph, two wipes, the byline and the end card. `review.mjs` passes on **9:16 and 16:9**: cuts and the morph on the grid, story arc 3/3, text 0 problems, no dead beats, −14.5 LUFS, the loudest moment at the arrow's hit after 1.3 s of silence; tile `deterministic: true`. It hasn't carried a real ElevenLabs voice yet.
