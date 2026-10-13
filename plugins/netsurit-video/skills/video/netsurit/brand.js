// =====================================================================
//  NETSURIT — the CI over the infographic style (netsurit/ci/Netsurit-CI-Guide.md). Proven on "The Enterprise
//  Brain" (Louis de Klerk, Netsurit Innovate, October 2026) in 16:9 and in 9:16 for WhatsApp.
//  Load it right after the style kit: piece.json "scenes": ["src/brand.js", ...]. It needs from the head:
//  W, H, CX, SAFE, TOTAL (the last frame's time) and BYLINE; and assets/N2026.png (the lockup) for the end card.
//  It remaps IG's roles onto the Netsurit palette, sets Oxygen as the only typeface, swaps the kit's blue shadow
//  and glow for neutral ones, and adds the brand furniture: nsSymbol (the N), nsLowerThird (the opening byline)
//  and nsEndCard (the black back page). On a portrait frame (9:16, the WhatsApp format) it also flattens the
//  look so it survives WhatsApp's re-encode.
//  Colour roles: charcoal = the hero shape and structure; Netsurit Red = the one idea that matters (belief,
//  the answer, the payoff) and emphasis; Azure = the first actor/tool; Steel = the second and secondary lines.
//  Red is the highlight, never the wallpaper (CI: ~60% white/light, 25% black/charcoal, 10% red, 5% accents).
// =====================================================================
const NS = {
  red: '#F4364C', black: '#000000', charcoal: '#2C2A29', steel: '#A1AAB1', steelD: '#7E878E', mist: '#F0EFF4', off: '#F7F7F7', white: '#FFFFFF',
  azure: '#0E75CB', azureD: '#0A5699', teal: '#2EC6B1', orange: '#FB8224', amber: '#FDB736',
  grey: '#6E7378',   // caption grey: Steel is too light for small text on white (2.3:1), so a darker step of it
};
const NS_FONT = '"Oxygen", "Segoe UI", Helvetica, Arial, sans-serif';
const NS_PHONE = H > W;   // a portrait frame: the WhatsApp build
const NS_BYLINE = Object.assign({ title: 'Untitled', name: '', unit: 'Netsurit Innovate', date: '', eyebrow: null, tagline: [] },
  typeof BYLINE !== 'undefined' ? BYLINE : {});

Object.assign(IG, {
  white: NS.white, paper: NS.white,
  wash: NS.mist, washD: '#E3E2E9', washL: NS.off,
  saffron: NS.charcoal, saffronD: '#4A4645',          // the hero head: charcoal, with a lighter grain
  core: NS.red, coreL: '#FBD3D8', cream: NS.red,       // the head's core (the kit's cream disc): red
  peri: NS.azure, lav: NS.steel, indigo: NS.charcoal,
  ink: NS.charcoal,
  navy: NS.charcoal, navyD: NS.black, navyT: NS.black,
  teal: NS.red, tealT: NS.red, cyan: NS.steel,
  text: NS.charcoal, textD: NS.grey, rule: '#E2E1E6', skel: '#DDDCE2',
  pillB: '#E6E5EB', pillBT: NS.charcoal, pillY: '#FFEBC4', pillYT: '#8A5A10', pillG: '#D2F4EF', pillGT: '#127567',
});
STYLE.paper = IG_SHEETMODE ? IG.washL : IG.paper;
STYLE.heroColor = IG.peri;

// Oxygen everywhere (it has 300 / 400 / 700; the kit's 500 and 600 resolve to 400 and 700).
// The build can't embed fonts: Oxygen must be installed on the machine (scripts/install-fonts.mjs).
igFont = function (size, o = {}) {
  const f = !o.font || o.font === IGSANS || o.font === IGHEAD ? NS_FONT : o.font;
  return `${o.weight ?? 400} ${size}px ${f}`;
};
// a neutral shadow instead of the kit's blue one
igShadow = function (fn, o = {}) {
  ctx.save(); ctx.shadowColor = o.c ?? 'rgba(20,18,18,0.13)'; ctx.shadowBlur = o.blur ?? 30; ctx.shadowOffsetY = o.dy ?? 10; fn(); ctx.restore();
};
// figures: the far arm a shade darker than the shirt (the kit uses IG.indigo, which is charcoal here)
{
  const person = igPerson;
  igPerson = function (x, y, s, o) {
    if (IG.peri !== NS.azure) return person(x, y, s, o);   // nsPersonAs already set both colours
    const b = IG.indigo; IG.indigo = NS.azureD;
    try { person(x, y, s, o); } finally { IG.indigo = b; }
  };
}
// a figure in another shirt: igPerson reads IG.peri (shirt) and IG.indigo (far arm), so swap them for one draw.
// nsPersonAs(NS.steel, NS.steelD, ...) = the second actor in Steel.
function nsPersonAs(top, far, x, y, s, o) {
  const a = IG.peri, b = IG.indigo; IG.peri = top; IG.indigo = far;
  try { igPerson(x, y, s, o); } finally { IG.peri = a; IG.indigo = b; }
}
// the glowing network and the dot streams: the kit's light blue glow, made neutral (o.glow: an 'r,g,b' string,
// e.g. '244,54,76' for a red glow on the payoff)
{
  const net = igNetwork;
  igNetwork = function (cx, cy, rx, ry, p = 1, o = {}) {
    const glow = o.glow ?? '161,170,177', rg = ctx.createRadialGradient;   // looked up now: ctx is null when this file loads
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
//  the N symbol, drawn from the logo's geometry (N.png, 1214 px) in the 2026 red. h = its height; returns its width.
//  (The CI: use #F4364C for new work; the PNG symbol is still the older red, so draw it rather than embed it.)
// ---------------------------------------------------------------------
function nsSymbol(x, y, h, c = NS.red) {
  const k = h / 698, X = (v) => x + (v - 328) * k, Y = (v) => y + (v - 257) * k;
  igFill([[328, 257], [470, 257], [586, 432], [470, 432], [470, 955], [328, 955]].map(([a, b]) => [X(a), Y(b)]), c);
  igFill([[819, 257], [960, 257], [960, 955], [819, 955], [703, 780], [819, 780]].map(([a, b]) => [X(a), Y(b)]), c);
  return (960 - 328) * k;
}

// ---------------------------------------------------------------------
//  the opening lower third: the N, the title and the byline, bottom left inside the safe area, in from 0.4 s and
//  out at 10.6 s (o.in / o.out to change). Call it from the first scene; keep that corner clear while it shows.
//  Screen space (deferred), so the camera never moves it. 16:9: one byline row; 9:16: name and unit on two rows.
// ---------------------------------------------------------------------
function nsLowerThirdNow(o) {
  const tin = o.in ?? 0.4, tout = o.out ?? 10.6;
  const a = igSettle(tin), z = 1 - igDraw(tout, 0.5);
  if (a <= 0.001 || z <= 0.001) return;
  ctx.save(); ctx.globalAlpha = clamp(a * 1.4) * z;
  const B = NS_BYLINE, sy = (1 - a) * 14;
  if (NS_PHONE) {
    const x = o.x ?? 80, y = o.y ?? H - SAFE.bottom - 152;
    const sw = nsSymbol(x, y + sy - 4, 84);
    igText(B.title, x + sw + 30, y + sy + 34, 44, NS.black, { weight: 700, frac: igDraw(tin + 0.15, 0.5) });
    igText(B.name, x + sw + 30, y + sy + 80, 30, NS.charcoal, { weight: 700, frac: igDraw(tin + 0.35, 0.6) });
    igText([B.unit, B.date].filter(Boolean).join('  ·  '), x + sw + 30, y + sy + 120, 28, NS.grey, { frac: igDraw(tin + 0.45, 0.6) });
  } else {
    const x = o.x ?? 96, y = o.y ?? H - SAFE.bottom - 4;
    const sw = nsSymbol(x, y + sy - 4, 66);
    igText(B.title, x + sw + 26, y + sy + 26, 34, NS.black, { weight: 700, frac: igDraw(tin + 0.15, 0.5) });
    igRich([{ s: B.name, c: NS.charcoal, weight: 700 }, { s: ['', B.unit, B.date].filter((s, i) => !i || s).join('  ·  '), c: NS.grey }],
      x + sw + 26, y + sy + 60, 24, { frac: igDraw(tin + 0.35, 0.6) });
  }
  ctx.restore();
}
const nsLowerThird = (o = {}) => { const f = () => nsLowerThirdNow(o); if (DEFER) DEFER.push(f); else f(); };

// ---------------------------------------------------------------------
//  the end card (the CI's back page): black, the 2026 lockup, a Steel divider, the eyebrow (red caps), the
//  tagline (white), the byline, "Break free from ordinary IT.", netsurit.com and the legal line.
//  Fades up from t0 over the last scene (call it at the end of the last scene: nsEndCard(DURATION - 0.3));
//  the lines arrive in turn and the card pushes in slowly, so the hold never reads as a dead beat. ~5.5 s.
// ---------------------------------------------------------------------
function nsEndCardNow(t0) {
  const f = clamp((TT - t0) / 0.6); if (f <= 0) return;
  const B = NS_BYLINE, eyebrow = (B.eyebrow ?? B.title).toUpperCase(), tag = [].concat(B.tagline || []);
  ctx.save(); screen();
  ctx.globalAlpha = EZ.io(f); ctx.fillStyle = NS.black; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
  const push = 1 + 0.04 * EZ.io(clamp((TT - t0 - 0.6) / Math.max(0.1, TOTAL - t0 - 0.6)));
  ctx.translate(W / 2, H / 2); ctx.scale(push, push); ctx.translate(-W / 2, -H / 2);
  const L = ASSETS['N2026.png'], lw = 422, lh = 405, P = (d) => igSettle(t0 + d), lift = (p) => (1 - p) * 16;
  const lp = P(0.35), dv = igDraw(t0 + 0.6, 0.5), A = (p) => clamp(p * 1.5);
  const legal = '© ' + (B.year ?? 2026) + ' Netsurit. All rights reserved.';
  if (NS_PHONE) {
    // stacked and centred
    const lx = (W - lw) / 2, ly = 300;
    if (lp > 0.001) { ctx.save(); ctx.globalAlpha = A(lp); ctx.drawImage(L, lx, ly + (1 - lp) * 20, lw, lh); ctx.restore(); }
    if (dv > 0) { igPath([[CX - 200 * dv, 800], [CX + 200 * dv, 800]], false); igLine('rgba(161,170,177,0.45)', 2); ctx.stroke(); }
    const C = { align: 'center' };
    let p = P(0.75);
    igText(eyebrow, CX, 900 + lift(p), 28, NS.red, { ...C, weight: 700, track: 3, alpha: A(p) });
    p = P(0.9);
    tag.forEach((s, i) => igText(s, CX, 1010 + i * 102 + lift(p), 92, NS.white, { ...C, weight: 700, alpha: A(p) }));
    const by = 1010 + Math.max(1, tag.length) * 102 + 46;
    p = P(1.7);
    igText(B.name, CX, by + lift(p), 46, NS.white, { ...C, weight: 700, alpha: A(p) });
    igText([B.unit, B.date].filter(Boolean).join('  ·  '), CX, by + 56 + lift(p), 34, NS.steel, { ...C, alpha: A(p) });
    p = P(2.5);
    igRich([{ s: 'Break free from ', c: NS.white }, { s: 'ordinary IT.', c: NS.red }], CX, by + 180 + lift(p), 38, { align: 'center', weight: 700, alpha: A(p) });
    p = P(3.2);
    igText('netsurit.com', CX, H - SAFE.bottom - 104, 28, NS.steel, { ...C, alpha: A(p) });
    igText(legal, CX, H - SAFE.bottom - 60, 24, NS.steel, { ...C, alpha: A(p) });
  } else {
    // lockup left, a vertical divider, the words right
    const lx = 250, ly = (H - lh) / 2 - 10;
    if (lp > 0.001) { ctx.save(); ctx.globalAlpha = A(lp); ctx.drawImage(L, lx, ly + (1 - lp) * 20, lw, lh); ctx.restore(); }
    const dx = 780;
    if (dv > 0) { igPath([[dx, H / 2 - 170], [dx, H / 2 - 170 + 340 * dv]], false); igLine('rgba(161,170,177,0.45)', 2); ctx.stroke(); }
    const tx = 850;
    let p = P(0.75);
    igText(eyebrow, tx, 352 + lift(p), 22, NS.red, { weight: 700, track: 2.2, alpha: A(p) });
    p = P(0.9);
    igText(tag.join(' '), tx, 440 + lift(p), 76, NS.white, { weight: 700, alpha: A(p) });
    p = P(1.7);
    igText(B.name, tx, 560 + lift(p), 40, NS.white, { weight: 700, alpha: A(p) });
    igText([B.unit, B.date].filter(Boolean).join('  ·  '), tx, 610 + lift(p), 32, NS.steel, { alpha: A(p) });
    p = P(2.5);
    igRich([{ s: 'Break free from ', c: NS.white }, { s: 'ordinary IT.', c: NS.red }], tx, 712 + lift(p), 32, { weight: 700, alpha: A(p) });
    p = P(3.2);
    igText('netsurit.com', 96, H - SAFE.bottom + 40, 22, NS.steel, { alpha: A(p) });
    igText(legal, W - 96, H - SAFE.bottom + 40, 22, NS.steel, { align: 'right', alpha: A(p) });
  }
  ctx.restore();
}
const nsEndCard = (t0) => { const f = () => nsEndCardNow(t0); if (DEFER) DEFER.push(f); else f(); };

// ---------------------------------------------------------------------
//  PHONE (9:16, the WhatsApp build): made to survive WhatsApp's re-encode (720p, a low bitrate). Flat fills
//  that hold still compress well; moving noise and soft gradients don't. So the head is flat (no grain, which
//  also crawls as it breathes), the sheet wash is flat Mist (no drifting waves) and every line is a third thicker.
// ---------------------------------------------------------------------
if (NS_PHONE) {
  const head = igHead;
  igHead = (x, y, s, o = {}) => head(x, y, s, { ...o, grain: false });
  igWash = function () { fillAll(IG.wash); };
  igLine = function (c = IG.ink, w = IG_HAIR) { ctx.strokeStyle = c; ctx.lineWidth = w * 1.35; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; };
}
