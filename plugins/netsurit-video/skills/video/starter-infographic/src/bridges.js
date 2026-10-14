// =====================================================================
//  ERAS, CAMERAS, BRIDGES — read by kit/morph.js. Each bridge sits in a pause between two voice lines, and
//  its two shapes are the same rectangles the scenes draw (LAY in src/scenes.js), so the morph ends match.
// =====================================================================
const ERA_BG = [IG.white, IG.wash, IG.white];
const rr = (R, r = 26) => rrectPts(R.x, R.y, R.w, R.h, r, 6);
const BRIDGES = [
  { tc: M1, A: () => ({ P: rr(LAY.ask, 40), c: IG.white }), B: () => ({ P: rr(LAY.card), c: IG.white }) },                       // the "?" -> the card
  { tc: M2, d: 0.45, A: () => ({ P: rr(LAY.card), c: IG.white }), B: () => ({ P: igHeadPts(...LAY.headB), c: IG.saffron }) },   // the card -> the head (IG.saffron is charcoal)
];

// ---- cameras: gentle reframes on the words that name things (keys up to 1.07 -> at most ~4.5% zoom, heavy springs),
// so narrated holds keep moving. Every era is back at z = 1 before its bridge. A key = [t, zoom, x, y] in world px.
const C0 = (t) => [t, 1, W / 2, H / 2];
const CAMS = [
  // 0 the problem
  [C0(0), [P0.facts, 1.03, CORE0[0], CORE0[1]], [P0.reach, 1.06, CORE0[0], CORE0[1]], [P0.none, 1.03, W / 2, H / 2], C0(P0.ask)],
  // 1 the sheet (zooms from the top edge, so the title never crops: y unused)
  [C0(M1), [P1.rows[0], 1.05, LAY.card.x + LAY.card.w * 0.4, 0], [P1.rows[2], 1.06, LAY.card.x + LAY.card.w * 0.6, 0], [P1.src, 1.03, W / 2, 0], C0(VL('l2').t1)],
  // 2 the payoff (back to z = 1 before the end card)
  [C0(M2 + 0.5), [P2.remembers, 1.04, COREB[0], COREB[1]], [P2.answer, 1.06, COREB[0], COREB[1]], C0(DURATION - 0.8)],
];
const SHEET_ERAS = [1];
function pieceCam(era, t) {
  const K = CAMS[era]; if (!K) return null;
  const z = 1 + (springTrack(K.map((k) => [k[0], k[1]]), SPRING.heavy) - 1) * 0.62;
  let x = springTrack(K.map((k) => [k[0], k[2]]), SPRING.heavy), y = springTrack(K.map((k) => [k[0], k[3]]), SPRING.heavy);
  const hw = W / 2 / z, hh = H / 2 / z;
  x = clamp(x, hw, W - hw); y = SHEET_ERAS.includes(era) ? hh : clamp(y, hh, H - hh);
  return Math.abs(z - 1) < 1e-4 ? null : camOf({ z, p: [x, y], to: [W / 2, H / 2] });
}
