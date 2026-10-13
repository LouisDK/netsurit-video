// =====================================================================
//  NETSURIT — the CI applied over the infographic style, for this piece only (ci/Netsurit-CI-Guide.md).
//  Loaded right after the style kit: it remaps IG's roles onto the Netsurit palette, sets Oxygen as the
//  only typeface, swaps the kit's blue shadow and glow for neutral ones, and adds the brand furniture
//  (the N symbol, the opening lower third, the black end card).
//  Roles: charcoal = the head and structure; Netsurit Red = belief (the head's core) and emphasis;
//  Azure = the Librarian; Steel = the Clerk and secondary lines. Red stays the highlight, never the wallpaper.
// =====================================================================
const NS = {
  red: '#F4364C', black: '#000000', charcoal: '#2C2A29', steel: '#A1AAB1', mist: '#F0EFF4', off: '#F7F7F7', white: '#FFFFFF',
  azure: '#0E75CB', azureD: '#0A5699', teal: '#2EC6B1', amber: '#FDB736',
  grey: '#6E7378',   // caption grey: Steel is too light for small text on white (2.3:1), so a darker step of it
};
const NS_FONT = '"Oxygen", "Segoe UI", Helvetica, Arial, sans-serif';
const BYLINE = { name: 'Louis de Klerk', unit: 'Netsurit Innovate', date: 'October 2026', title: 'The Enterprise Brain' };

Object.assign(IG, {
  white: NS.white, paper: NS.white,
  wash: NS.mist, washD: '#E3E2E9', washL: NS.off,
  saffron: NS.charcoal, saffronD: '#4A4645',          // the head: charcoal, with a lighter grain
  core: NS.red, coreL: '#FBD3D8',                      // the head's core: belief (was the cream disc)
  peri: NS.azure, lav: NS.steel, indigo: NS.charcoal,
  ink: NS.charcoal,
  navy: NS.charcoal, navyD: NS.black, navyT: NS.black,
  teal: NS.red, tealT: NS.red, cyan: NS.steel,
  text: NS.charcoal, textD: NS.grey, rule: '#E2E1E6', skel: '#DDDCE2',
  pillB: '#E6E5EB', pillBT: NS.charcoal, pillY: '#FFEBC4', pillYT: '#8A5A10', pillG: '#D2F4EF', pillGT: '#127567',
});
STYLE.paper = IG_SHEETMODE ? IG.washL : IG.paper;
STYLE.heroColor = IG.peri;

// Oxygen everywhere (it has 300 / 400 / 700; the kit's 500 and 600 resolve to 400 and 700)
igFont = function (size, o = {}) {
  const f = !o.font || o.font === IGSANS || o.font === IGHEAD ? NS_FONT : o.font;
  return `${o.weight ?? 400} ${size}px ${f}`;
};
// a neutral shadow instead of the kit's blue one
igShadow = function (fn, o = {}) {
  ctx.save(); ctx.shadowColor = o.c ?? 'rgba(20,18,18,0.13)'; ctx.shadowBlur = o.blur ?? 30; ctx.shadowOffsetY = o.dy ?? 10; fn(); ctx.restore();
};
// figures: the far arm a shade darker than the shirt (the kit uses IG.indigo, now charcoal for icons)
{
  const person = igPerson;
  igPerson = function (x, y, s, o) {
    if (IG.peri !== NS.azure) return person(x, y, s, o);   // ebPersonAs already set both colours
    const b = IG.indigo; IG.indigo = NS.azureD;
    try { person(x, y, s, o); } finally { IG.indigo = b; }
  };
}
// the glowing network and the dot streams: the kit's light blue glow, made neutral (o.glow: an 'r,g,b' string)
{
  const net = igNetwork;
  igNetwork = function (cx, cy, rx, ry, p = 1, o = {}) {
    const glow = o.glow ?? '161,170,177', rg = ctx.createRadialGradient;
    ctx.createRadialGradient = function (...a) {
      const g = rg.apply(this, a), add = g.addColorStop.bind(g);
      g.addColorStop = (k, c) => add(k, c.replace(/rgba\((108,176,207|170,214,236),/, `rgba(${glow},`));
      return g;
    };
    try { return net(cx, cy, rx, ry, p, o); } finally { delete ctx.createRadialGradient; }
  };
  const stream = igStream;
  igStream = (P, p, o = {}) => stream(P, p, { line: 'rgba(161,170,177,0.5)', ...o });
}

// ---------------------------------------------------------------------
//  the N symbol, drawn from the logo's geometry (N.png, 1214 px) in the 2026 red. h = its height
//  (the guide: use #F4364C for new work; the PNG symbol is still the older red)
// ---------------------------------------------------------------------
function nsSymbol(x, y, h, c = NS.red) {
  const k = h / 698, X = (v) => x + (v - 328) * k, Y = (v) => y + (v - 257) * k;
  igFill([[328, 257], [470, 257], [586, 432], [470, 432], [470, 955], [328, 955]].map(([a, b]) => [X(a), Y(b)]), c);
  igFill([[819, 257], [960, 257], [960, 955], [819, 955], [703, 780], [819, 780]].map(([a, b]) => [X(a), Y(b)]), c);
  return (960 - 328) * k;   // width
}

// ---------------------------------------------------------------------
//  the opening lower third: the symbol, the title and the byline, under the ground line in the hook
//  (in from 0.4 s, out before the facts arrive). Screen space, so the hook's camera never moves it.
// ---------------------------------------------------------------------
const LT = { in: 0.4, out: 10.6 };
function nsLowerThirdNow() {
  const a = igSettle(LT.in), z = 1 - igDraw(LT.out, 0.5);
  if (a <= 0.001 || z <= 0.001) return;
  ctx.save(); ctx.globalAlpha = clamp(a * 1.4) * z;
  const x = 96, y = 966, sy = (1 - a) * 14;
  const sw = nsSymbol(x, y + sy - 4, 66);
  igText(BYLINE.title, x + sw + 26, y + sy + 26, 34, NS.black, { weight: 700, frac: igDraw(LT.in + 0.15, 0.5) });
  igRich([{ s: BYLINE.name, c: NS.charcoal, weight: 700 }, { s: `  ·  ${BYLINE.unit}  ·  ${BYLINE.date}`, c: NS.grey }],
    x + sw + 26, y + sy + 60, 24, { frac: igDraw(LT.in + 0.35, 0.6) });
  ctx.restore();
}
const nsLowerThird = () => { if (DEFER) DEFER.push(nsLowerThirdNow); else nsLowerThirdNow(); };

// ---------------------------------------------------------------------
//  the end card: black, the 2026 lockup at its clear space, the title, the byline and the back-page lines.
//  Fades up over the close's last frame from t0; the lines arrive in turn through the hold (so it never sits
//  still for more than ~2 s); screen space.
// ---------------------------------------------------------------------
function nsEndCardNow(t0) {
  const f = clamp((TT - t0) / 0.6); if (f <= 0) return;
  ctx.save(); screen();
  ctx.globalAlpha = EZ.io(f); ctx.fillStyle = NS.black; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
  const push = 1 + 0.04 * EZ.io(clamp((TT - t0 - 0.6) / (TOTAL - t0 - 0.6)));   // a slow push-in, so the hold never sits still
  ctx.translate(W / 2, H / 2); ctx.scale(push, push); ctx.translate(-W / 2, -H / 2);
  // the lockup: the PNG carries its own black field, so it sits on the black card with no edge
  const lp = igSettle(t0 + 0.35), L = ASSETS['N2026.png'], lw = 422, lh = 405, lx = 250, ly = (H - lh) / 2 - 10;
  if (lp > 0.001) { ctx.save(); ctx.globalAlpha = clamp(lp * 1.5); ctx.drawImage(L, lx, ly + (1 - lp) * 20, lw, lh); ctx.restore(); }
  // a hairline divider in Steel
  const dv = igDraw(t0 + 0.6, 0.5), dx = 780;
  if (dv > 0) { igPath([[dx, H / 2 - 170], [dx, H / 2 - 170 + 340 * dv]], false); igLine('rgba(161,170,177,0.45)', 2); ctx.stroke(); }
  const tx = 850, P = (d) => igSettle(t0 + d), lift = (p) => (1 - p) * 16;
  let p = P(0.75);
  igText('THE ENTERPRISE BRAIN', tx, 352 + lift(p), 22, NS.red, { weight: 700, track: 2.2, alpha: clamp(p * 1.5) });
  p = P(0.9);
  igText('Memory that compounds.', tx, 440 + lift(p), 76, NS.white, { weight: 700, alpha: clamp(p * 1.5) });
  p = P(1.7);
  igText(BYLINE.name, tx, 560 + lift(p), 40, NS.white, { weight: 700, alpha: clamp(p * 1.5) });
  igText(`${BYLINE.unit}  ·  ${BYLINE.date}`, tx, 610 + lift(p), 32, NS.steel, { alpha: clamp(p * 1.5) });
  p = P(2.5);
  igRich([{ s: 'Break free from ', c: NS.white }, { s: 'ordinary IT.', c: NS.red }], tx, 712 + lift(p), 32, { weight: 700, alpha: clamp(p * 1.5) });
  p = P(3.2);
  igText('netsurit.com', 96, 1010, 22, NS.steel, { alpha: clamp(p * 1.5) });
  igText('© 2026 Netsurit. All rights reserved.', W - 96, 1010, 22, NS.steel, { align: 'right', alpha: clamp(p * 1.5) });
  ctx.restore();
}
const nsEndCard = (t0) => { const f = () => nsEndCardNow(t0); if (DEFER) DEFER.push(f); else f(); };
