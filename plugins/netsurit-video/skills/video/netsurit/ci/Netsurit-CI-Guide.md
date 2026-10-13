# Netsurit Corporate Identity Guide (Basic)

*Version 0.1. Compiled 2 October 2026 from netsurit.com (US site Elementor theme tokens) and the logo files in this folder. Use it for brochures, proposals, one-pagers and other documents. Items marked **[confirm]** are inferred and should be checked with Netsurit Marketing before final print.*

---

## 1. Brand at a glance

| | |
|---|---|
| **Name** | Netsurit. Capital N only. Never "NetSurit" or "NETSURIT" in running text (the logo wordmark is the only all-caps use). |
| **What we do** | Managed IT services, cybersecurity, cloud, AI and automation, productivity enablement, professional services |
| **Positioning line (web)** | *Break free from ordinary IT.* |
| **Supporting lines (web)** | *What if your IT just works?* · *We're here to help you scale, not settle.* · *Imagine the possibilities.* · *IT without fuss* (client-quoted ethos) |
| **Personality** | Confident, direct, energetic, human. Bold red on black or white. Lots of clean space. |

---

## 2. Logo

### Files available (`ci/`)

| File | What it is | Use for |
|---|---|---|
| `N2026.png` | **Primary lockup (2026):** red N symbol above the white "NETSURIT" wordmark, on a solid black square. 422 × 405 px. | Covers, title slides, back pages, dark headers. **Current logo.** |
| `N.png` | **Symbol only:** red N on white. 1214 × 1214 px. | Favicons, social avatars, small spaces, page footers and graphic devices. |

### The symbol
The N is built from two mirrored vertical bars, each with an angled "flag" (top-left pointing up, bottom-right pointing down), like an arrow up and an arrow down. That shape suggests movement and exchange, and you can echo it in layouts (see §6).

### Rules
- **Clear space:** keep a margin around the logo at least the width of one N bar (about ¼ of the symbol's width) on every side.
- **Minimum size:** full lockup 25 mm / 100 px wide. Symbol alone 8 mm / 24 px.
- **Backgrounds:** the full lockup has a white wordmark, so use it only on black or very dark backgrounds (`#000000`, `#2C2A29`). The symbol alone works on white, light grey or black.
- **Don't** recolour, stretch, rotate, add shadows or outlines, put the red N on a red or busy photo background, or retype the wordmark in another font.

### Gaps to close **[confirm]**
1. **No full lockup for light backgrounds yet.** A version with a black or charcoal wordmark on a transparent background is needed for white-page documents. Until then, put `N2026.png` inside a black block (e.g. a black header band or cover panel).
2. **No vector files.** Ask for SVG/EPS/PDF for print. The PNGs are too small for A4 covers at 300 dpi; `N2026.png` prints sharp only up to about 35 mm wide.
3. **Two reds.** `N.png` uses an older red (`#EF3F4A`). `N2026.png` uses `#F4364C`. Use the 2026 red for new work, and request an updated symbol file.

---

## 3. Colour

### Primary

| Swatch | Name | HEX | RGB | CMYK (indicative) | Use |
|---|---|---|---|---|---|
| 🟥 | **Netsurit Red** | `#F4364C` | 244 54 76 | 0 78 69 4 | Logo, key headlines, accents, CTAs, graphic devices |
| ⬛ | **Black** | `#000000` | 0 0 0 | 0 0 0 100 (rich black for large areas: 60 40 40 100) | Backgrounds, body text, logo field |
| ⬜ | **White** | `#FFFFFF` | 255 255 255 | 0 0 0 0 | Backgrounds, text on dark |

> The website's primary token is `#EF3B50`, a near-identical red. Treat `#F4364C` (the 2026 logo) as the master for print and documents. `#EF3B50` is fine for web.
> CMYK values are straight conversions. Get a Pantone match from the printer **[confirm]**. Pantone 1788 C is close.

### Neutrals

| Name | HEX | Use |
|---|---|---|
| Charcoal | `#2C2A29` | Body text alternative to black, dark panels |
| Steel Grey | `#A1AAB1` | Captions, rules, secondary text on dark backgrounds |
| Mist | `#F0EFF4` | Section backgrounds, call-out boxes |
| Off-white | `#F7F7F7` | Page tints, table striping |

### Secondary accents (sparingly: charts, icons, category coding)

| Name | HEX |
|---|---|
| Azure Blue | `#0E75CB` |
| Teal | `#2EC6B1` |
| Orange | `#FB8224` |
| Amber | `#FDB736` |

### Proportion guide
About **60% white/light neutrals, 25% black/charcoal, 10% red, 5% accents**. Red is the highlight, not the wallpaper. If a page feels red, it has too much.

### Accessibility
- White text on Netsurit Red passes only for **large text** (≥ 18 pt, or ≥ 14 pt bold). Contrast is about 3.8 : 1.
- Black text on Netsurit Red, about 5.5 : 1, is fine at any size.
- Don't set body copy in red. Use it for headings, numbers and highlights.

---

## 4. Typography

**Brand typeface: Oxygen** (free Google Font, [fonts.google.com/specimen/Oxygen](https://fonts.google.com/specimen/Oxygen)). It comes in Light 300, Regular 400 and Bold 700. The site uses 400 and 500, which renders as 400/700.

| Fallback order | Oxygen → Segoe UI → Helvetica → Arial → sans-serif |
|---|---|
| **Office documents** (when Oxygen can't be installed or embedded) | Use **Segoe UI** or **Arial** |

> The wordmark in the logo is a geometric sans, not Oxygen. It is artwork: never retype it.

### Type scale

| Style | Web (site) | Print (A4 brochure) | Weight | Notes |
|---|---|---|---|---|
| Display / H1 | 72 px | 36–44 pt | Bold | Short, punchy, sentence case. Can mix black + red words |
| H2 | 55 px | 24–28 pt | Bold | |
| H3 | 25 px | 16–18 pt | Bold | |
| Subheading / lead | 20 px | 12–14 pt | Regular | Line height 1.3 |
| Body | 16 px | 9.5–11 pt | Regular | Line height 1.4–1.5, left-aligned, ragged right |
| Caption / small | 14 px | 7.5–8 pt | Regular | Steel Grey or Charcoal |
| Eyebrow / label | 13 px | 8 pt | Bold, ALL CAPS, +5% tracking | Red, above headings |

- Use **sentence case** for headings ("Break free from ordinary IT."), not Title Case.
- Don't justify text, and limit lines to about 70 characters.

---

## 5. Tone of voice

Taken from the website copy:

- **Bold and direct.** Short sentences. Say the outcome. *"You move fast. Your IT should, too."*
- **Client-first.** Write "you/your" more than "we". Start with the client's problem (downtime, complexity, unresponsive providers) and then the result.
- **Energetic verbs.** *crush, unlock, scale, plug in, break free.*
- **Human, not jargon.** *"The benefits of AI, with real people in your corner."* Explain the tech in business terms.
- **Proof over promises.** Name clients, quote them and give numbers (e.g. Inc. 5000 Fastest Growing).
- **Avoid:** passive voice, buzzword stacks, over-promising, exclamation marks in body copy.
- **Spelling:** match the market. Use UK/SA English for South Africa (optimise, centre) and US English for US material (optimize, center).

---

## 6. Layout and graphic elements

- **Grid:** A4 with 15–20 mm margins. Use 2 columns for brochures and 12 columns for web/slides. Give it generous white space.
- **Colour blocking:** bold black or red panels set against white pages. Covers work best as full-black with the `N2026` lockup and a red headline.
- **The N device:** a red vertical bar with an angled end, cropped from the symbol, can be used as a page edge, section divider or bullet. Use one per spread.
- **Photography:** real people at work, with natural light and a confident, collaborative feel. Avoid cheesy stock and blue "binary code" clichés. Photos can sit in black or charcoal frames.
- **Icons:** simple line icons, 2 px stroke, in red or black. Don't mix filled and outline styles.
- **Charts:** red for the key series, Charcoal/Steel Grey for comparison series, and accents only when more than 3 series are needed.
- **Buttons/CTAs:** red fill with white bold text, or a black outline. Square or slightly rounded corners (≤ 4 px).

### Standard document furniture
- **Header:** small symbol (`N.png`) top-left, or black band with `N2026` lockup on covers.
- **Footer:** "netsurit.com" · page number · document title, in Steel Grey at 8 pt.
- **Back page:** black, with the lockup, the line *"Break free from ordinary IT."*, website and regional contact details.
- **Legal line:** `© 2026 Netsurit. All rights reserved.`

---

## 7. Quick tokens (for HTML/CSS documents)

```css
:root {
  --ns-red:      #F4364C;  /* Netsurit Red (2026 logo) */
  --ns-red-web:  #EF3B50;  /* website primary */
  --ns-black:    #000000;
  --ns-charcoal: #2C2A29;
  --ns-steel:    #A1AAB1;
  --ns-mist:     #F0EFF4;
  --ns-offwhite: #F7F7F7;
  --ns-white:    #FFFFFF;
  --ns-blue:     #0E75CB;
  --ns-teal:     #2EC6B1;
  --ns-orange:   #FB8224;
  --ns-amber:    #FDB736;
  --ns-font: "Oxygen", "Segoe UI", Helvetica, Arial, sans-serif;
}
/* <link href="https://fonts.googleapis.com/css2?family=Oxygen:wght@300;400;700&display=swap" rel="stylesheet"> */
```

---

## 8. Open items for Netsurit Marketing **[confirm]**
1. Vector logo files (SVG/EPS/PDF), plus a full lockup for light backgrounds and a mono (all-white / all-black) version.
2. An official Pantone/CMYK for Netsurit Red.
3. Whether Oxygen is the official print typeface, or only the web font.
4. Any official brand guide, photography library or icon set already in use.
