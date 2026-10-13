// =====================================================================
//  styles/infographic/kit.js — corporate flat-vector illustration + clean infographic cards.
//  Two moods on one palette: (1) flat illustration on white — a big saffron mass with speckled grain,
//  periwinkle / navy figures and charts, navy hairline flow loops with hollow arrowheads, gears, speech
//  bubbles, check circles; (2) an infographic sheet on a pale blue wash — white rounded cards with soft
//  shadows, navy header bands, round icon badges, pastel pills, connectors with dots, a glowing node network.
//  Motion on 1s: everything pops in on springs, lines draw on, arrowheads travel, gears turn, then holds.
//  Built on kit/core.js (RNG, EZ, rrectPts, ellipsePts, resample, subPath, pointAt, toScreen, TT / DEFER / E0 / SPARK_AT).
//  Needs from the piece head: W, H, CX (caption centre x). Optional: `const IG_SHEET = true` (pale blue paper).
// =====================================================================

// ---- palette (measured from the references: see STYLE.md)
const IG = {
  white: '#ffffff', paper: '#ffffff',
  wash: '#eaf5fb', washD: '#d6ebf5', washL: '#f8fbfd',      // the infographic sheet's pale blue ground
  saffron: '#fdc35e', saffronD: '#e3952e', cream: '#fbe9df', // the illustration's hero mass and its inner disc
  peri: '#5d6dfd', lav: '#8c99df', indigo: '#4d5aa6',          // periwinkle family: shirts, gears, charts
  ink: '#18293a',                                              // navy ink: hairlines, trousers, hair, dark chart slices
  navy: '#0e4878', navyD: '#08365e', navyT: '#0b2440',         // card headers, icon badges, title text
  teal: '#188a90', tealT: '#0b6a86', cyan: '#6cb0cf',          // second title colour, accent badges, network glow
  text: '#2c3e50', textD: '#6b7c8c', rule: '#d8e3ea', skel: '#d5dee6',
  pillB: '#cfe9f8', pillBT: '#215f8f', pillY: '#f8e0a8', pillYT: '#8a5a10', pillG: '#cdf0d8', pillGT: '#2b7a4b',
};
const IGSANS = '"Segoe UI", "Helvetica Neue", Arial, "Liberation Sans", "Nimbus Sans", sans-serif';
const IGHEAD = '"Bahnschrift", "Avenir Next Condensed", "Arial Narrow", "Liberation Sans Narrow", "Nimbus Sans Narrow", "Roboto Condensed", sans-serif';
const IG_HAIR = 3;   // px at 1080 wide (the illustration's ~1.5px hairlines on a 1280px picture, at our scale)
const IG_SHEETMODE = typeof IG_SHEET !== 'undefined' && !!IG_SHEET;

// ---------------------------------------------------------------------
//  motion: closed-form springs (deterministic, no state)
// ---------------------------------------------------------------------
function igSpring(t0, o = {}) {
  const s = TT - t0; if (s <= 0) return 0;
  const w0 = Math.sqrt(o.k ?? 170), z = Math.min(0.98, o.damp ?? 0.55), wd = w0 * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w0 * s) * (Math.cos(wd * s) + (z * w0 / wd) * Math.sin(wd * s));
}
const igPop = (t0, o) => igSpring(t0, { k: 190, damp: 0.5, ...o });                 // pops: a little overshoot
const igSettle = (t0, o) => igSpring(t0, { k: 120, damp: 0.82, ...o });             // cards, text: barely any
const igDraw = (t0, d = 0.6) => EZ.io(clamp((TT - t0) / d));   // lines drawing on

// scale about (x, y) by k, run fn, restore. k <= 0 draws nothing.
function igAt(x, y, k, fn, alpha = 1) {
  if (k <= 0.001 || alpha <= 0.001) return;
  ctx.save(); ctx.globalAlpha *= clamp(alpha); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); fn(); ctx.restore();
}
function igPath(P, closed) { ctx.beginPath(); if (!P.length) return; ctx.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) ctx.lineTo(P[i][0], P[i][1]); if (closed) ctx.closePath(); }
function igFill(P, c) { igPath(P, true); ctx.fillStyle = c; ctx.fill(); }
function igLine(c = IG.ink, w = IG_HAIR) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; }
// a soft blue drop shadow under whatever fn draws (cards, badges, the morph shape)
function igShadow(fn, o = {}) {
  ctx.save(); ctx.shadowColor = o.c ?? 'rgba(30,80,130,0.16)'; ctx.shadowBlur = o.blur ?? 30; ctx.shadowOffsetY = o.dy ?? 10; fn(); ctx.restore();
}
// cubic bezier outline sampler: segs = [[x0,y0], [c1, c2, p], ...] (each later item: three points, or one point for a line)
function igBez(start, segs, n = 14) {
  const P = [start]; let p0 = start;
  for (const s of segs) {
    if (s.length === 1) { P.push(s[0]); p0 = s[0]; continue; }
    const [c1, c2, p] = s;
    for (let i = 1; i <= n; i++) { const t = i / n, u = 1 - t; P.push([u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p[0], u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p[1]]); }
    p0 = p;
  }
  return P;
}

// ---------------------------------------------------------------------
//  text
// ---------------------------------------------------------------------
function igFont(size, o = {}) { return `${o.weight ?? 400} ${size}px ${o.font ?? IGSANS}`; }
function igW(str, size, o = {}) { ctx.save(); ctx.font = igFont(size, o); if (o.track) ctx.letterSpacing = o.track + 'px'; const w = ctx.measureText(str).width; ctx.restore(); return w; }
// one line; o.frac (0..1) wipes it on left to right; o.track = letter spacing px
function igText(str, x, y, size, color, o = {}) {
  ctx.save(); ctx.font = igFont(size, o); ctx.fillStyle = color; ctx.textBaseline = 'alphabetic';
  if (o.track) ctx.letterSpacing = o.track + 'px';
  const w = ctx.measureText(str).width, x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x, fr = clamp(o.frac ?? 1);
  if (fr <= 0) { ctx.restore(); return w; }
  if (fr < 1) { ctx.beginPath(); ctx.rect(x0 - 4, y - size * 1.3, w * fr + 4, size * 1.8); ctx.clip(); }
  ctx.textAlign = 'left'; ctx.globalAlpha *= o.alpha ?? 1; ctx.fillText(str, x0, y);
  ctx.restore(); return w;
}
// several coloured runs on one line: segs = [{ s, c, weight }]; returns the width
function igRich(segs, x, y, size, o = {}) {
  const ws = segs.map((g) => igW(g.s, size, { ...o, weight: g.weight ?? o.weight })), w = ws.reduce((a, b) => a + b, 0);
  let cx = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
  const fr = clamp(o.frac ?? 1), edge = cx + w * fr;
  segs.forEach((g, i) => {
    const f = clamp((edge - cx) / ws[i]);
    igText(g.s, cx, y, size, g.c ?? IG.navyT, { ...o, align: 'left', weight: g.weight ?? o.weight, frac: f });
    cx += ws[i];
  });
  return w;
}
// a headline: condensed bold, rises a little and wipes on (p 0..1)
function igTitle(segs, x, y, size, p, o = {}) {
  if (p <= 0) return 0;
  return igRich(segs, x, y + (1 - EZ.o3(clamp(p))) * size * 0.25, size, { font: IGHEAD, weight: 700, align: o.align ?? 'center', frac: EZ.io(clamp(p * 1.15)), alpha: clamp(p * 3) });
}
// grey placeholder lines (the cards' "text"): n lines of decreasing length, drawing on with p
function igSkel(x, y, w, n, p, o = {}) {
  const gap = o.gap ?? 18, h = o.h ?? 9, L = o.lens ?? [1, 0.82, 0.55, 0.7];
  for (let i = 0; i < n; i++) {
    const f = clamp(p * n - i * 0.6), lw = w * L[i % L.length] * EZ.o3(f); if (lw <= 1) continue;
    igFill(rrectPts(x, y + i * gap, lw, h, h / 2, 3), o.c ?? IG.skel);
  }
}

// ---------------------------------------------------------------------
//  infographic pieces
// ---------------------------------------------------------------------
// the sheet: a pale blue wash with slow soft white waves (fills the whole frame)
function igWash(o = {}) {
  ctx.save(); screen();
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, o.top ?? IG.wash); g.addColorStop(0.45, IG.washL); g.addColorStop(1, o.bottom ?? IG.white);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (let k = 0; k < 3; k++) {   // soft bands of white drifting very slowly
    const y0 = H * (0.18 + k * 0.17), A = 40 + k * 18, ph = TT * 0.25 + k * 1.7;
    const P = []; for (let i = 0; i <= 40; i++) { const x = i / 40 * W; P.push([x, y0 + Math.sin(i / 40 * TAU * 0.9 + ph) * A]); }
    P.push([W, y0 + 160], [0, y0 + 160]);
    ctx.globalAlpha = 0.35 - k * 0.08; igFill(P, IG.white);
  }
  ctx.restore();
}
// a card: white rounded rect, a hairline border, a soft shadow; pops in from p (0..1, a spring value)
function igCard(x, y, w, h, p = 1, o = {}) {
  if (p <= 0.001) return;
  const k = 0.9 + 0.1 * p, cx = x + w / 2, cy = y + h / 2 + (1 - p) * 30;
  igAt(cx, cy, k, () => {
    const P = rrectPts(x, y + (1 - p) * 30, w, h, o.r ?? 22, 6);
    igShadow(() => igFill(P, o.fill ?? IG.white), o.shadow);
    igPath(P, true); igLine(o.line ?? IG.rule, 2); ctx.stroke();
  }, clamp(p * 1.6));
}
// a dark header band on top of a card (rounded top corners), gradient navy; o.label, o.icon
function igHeader(x, y, w, h, p = 1, o = {}) {
  if (p <= 0.001) return;
  const r = o.r ?? 22, P = igBez([x, y + h], [[[x, y + r]], [[x, y + r * 0.45], [x + r * 0.45, y], [x + r, y]], [[x + w - r, y]], [[x + w - r * 0.45, y], [x + w, y + r * 0.45], [x + w, y + r]], [[x + w, y + h]]], 6);
  ctx.save(); ctx.globalAlpha *= clamp(p * 1.5);
  const g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, o.c ?? IG.navy); g.addColorStop(1, o.c2 ?? IG.navyD);
  igPath(P, true); ctx.fillStyle = g; ctx.fill();
  if (o.icon) igIcon(o.icon, x + 58, y + h / 2, h * 0.5, IG.white, { p });
  if (o.label) igText(o.label, x + (o.icon ? 100 : 36), y + h / 2 + h * 0.15, h * 0.42, IG.white, { weight: 700, font: IGHEAD, track: h * 0.05, frac: EZ.io(clamp(p * 1.4 - 0.3)) });
  ctx.restore();
}
// a round badge with a white icon (o.fill navy | teal | IG.peri); p = pop spring
function igBadge(x, y, r, icon, p = 1, o = {}) {
  igAt(x, y, p, () => {
    igShadow(() => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = o.fill ?? IG.navy; ctx.fill(); }, { blur: 16, dy: 5 });
    if (o.ring) { ctx.beginPath(); ctx.arc(x, y, r + 7, 0, TAU); igLine(o.ring, 3); ctx.stroke(); }
    if (typeof icon === 'number' || /^\d$/.test(icon)) igText(String(icon), x, y + r * 0.36, r * 1.05, IG.white, { weight: 700, align: 'center', font: IGHEAD });
    else igIcon(icon, x, y, r * 1.05, IG.white, { p: 1 });
  });
}
// a pill: kind 'b' | 'y' | 'g' (blue / yellow / green); pops with p; anchored at its left edge, baseline y
function igPill(str, x, y, size, kind = 'b', p = 1) {
  const bg = { b: IG.pillB, y: IG.pillY, g: IG.pillG }[kind], fg = { b: IG.pillBT, y: IG.pillYT, g: IG.pillGT }[kind];
  const w = igW(str, size, { weight: 600 }) + size * 1.4, h = size * 1.55;
  igAt(x + w / 2, y - size * 0.35, p, () => {
    igFill(rrectPts(x, y - size * 0.35 - h / 2, w, h, size * 0.35, 4), bg);
    igText(str, x + size * 0.7, y, size, fg, { weight: 600 });
  });
  return w;
}
// a step tag: a numbered circle and an uppercase label (like "1  SOURCE EVENT")
function igStep(n, label, x, y, size, p = 1, o = {}) {
  igBadge(x + size * 0.8, y - size * 0.35, size * 0.8, n, igPop(o.t0 ?? 0) * p || p, { fill: o.fill ?? IG.teal });
  igText(label.toUpperCase(), x + size * 2.0, y, size, o.c ?? IG.navyT, { weight: 700, font: IGHEAD, track: size * 0.06, frac: EZ.io(clamp(p * 1.3 - 0.2)) });
}
// a connector: a hairline along P that draws on with p, with a dot at each end (o.dots: 'both' | 'end' | 'none')
function igConnector(P, p, o = {}) {
  if (p <= 0) return;
  const S = subPath(P, clamp(p)), c = o.c ?? IG.navy;
  ctx.save(); if (o.dash) ctx.setLineDash(o.dash);
  igPath(S, false); igLine(c, o.w ?? 2.5); ctx.stroke(); ctx.restore();
  const dot = (q, k) => { if (k <= 0) return; ctx.beginPath(); ctx.arc(q[0], q[1], (o.r ?? 7) * k, 0, TAU); ctx.fillStyle = c; ctx.fill(); ctx.beginPath(); ctx.arc(q[0], q[1], (o.r ?? 7) * k * 0.45, 0, TAU); ctx.fillStyle = IG.white; ctx.fill(); };
  if ((o.dots ?? 'both') === 'both') dot(P[0], clamp(p * 4));
  if ((o.dots ?? 'both') !== 'none') dot(S[S.length - 1], clamp(p * 4 - 3));
}
// the big solid chevron arrow (navy gradient) pointing right (dir 1) or left (-1); p slides it in
function igChevron(x, y, s, p = 1, dir = 1) {
  if (p <= 0) return;
  const dx = (1 - EZ.o3(clamp(p))) * -40 * dir;
  ctx.save(); ctx.globalAlpha *= clamp(p * 2); ctx.translate(x + dx, y); ctx.scale(dir * s / 100, s / 100);
  const g = ctx.createLinearGradient(-50, 0, 50, 0); g.addColorStop(0, IG.navy + '00'); g.addColorStop(0.35, IG.navy); g.addColorStop(1, IG.navyD);
  igPath([[-60, -14], [10, -14], [10, -42], [50, 0], [10, 42], [10, 14], [-60, 14]], true); ctx.fillStyle = g; ctx.fill();
  ctx.restore();
}
// the glowing node network (the infographic's "brain"): nodes in an outline, near ones joined, a pulse travels
function igNetwork(cx, cy, rx, ry, p = 1, o = {}) {
  const key = o.key ?? 'net', R = RNG(key), N = o.n ?? 34, nodes = [];
  for (let i = 0; i < N * 3 && nodes.length < N; i++) {
    const x = R.f() * 2 - 1, y = R.f() * 2 - 1, lobe = Math.min((x * x) / 1 + (y * y) / 1, ((x - 0.15) ** 2) / 0.9 + ((y + 0.15) ** 2) / 0.9);
    if (lobe < 1 && !(Math.abs(x) < 0.04 && y < 0.2)) nodes.push([cx + x * rx, cy + y * ry, R.f()]);
  }
  ctx.save();
  // a soft glow behind
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry) * 1.25);
  g.addColorStop(0, `rgba(108,176,207,${0.42 * p})`); g.addColorStop(0.6, `rgba(170,214,236,${0.25 * p})`); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx, cy, rx * 1.25, ry * 1.25, 0, 0, TAU); ctx.fill();
  // links
  igLine('rgba(255,255,255,0.9)', 2);
  let li = 0;
  for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
    const d = Math.hypot(nodes[i][0] - nodes[j][0], nodes[i][1] - nodes[j][1]);
    if (d > Math.max(rx, ry) * 0.42) continue;
    const f = clamp(p * 1.6 - (li++ % 13) * 0.05); if (f <= 0) continue;
    ctx.globalAlpha = 0.85 * f; ctx.beginPath(); ctx.moveTo(nodes[i][0], nodes[i][1]); ctx.lineTo(lerp(nodes[i][0], nodes[j][0], f), lerp(nodes[i][1], nodes[j][1], f)); ctx.stroke();
  }
  // nodes, twinkling on a slow wave across the network
  for (const [x, y, s] of nodes) {
    const k = clamp(p * 2 - s), tw = 0.5 + 0.5 * Math.sin(TT * 2.4 - (x - cx) / rx * 3 + s * 6);
    if (k <= 0) continue;
    ctx.globalAlpha = k; ctx.shadowColor = IG.cyan; ctx.shadowBlur = 14 + tw * 14;
    ctx.beginPath(); ctx.arc(x, y, (3 + s * 4) * (0.85 + tw * 0.3), 0, TAU); ctx.fillStyle = IG.white; ctx.fill();
  }
  ctx.restore();
  return nodes;
}
// a stream of dots flowing along P (dispersed information flowing in, structured knowledge flowing out)
function igStream(P, p, o = {}) {
  const n = o.n ?? 6, sp = o.speed ?? 0.35, c = o.c ?? IG.cyan;
  ctx.save(); igPath(P, false); igLine(o.line ?? 'rgba(108,176,207,0.45)', 2); if (p < 1) { ctx.restore(); ctx.save(); igPath(subPath(P, p), false); igLine(o.line ?? 'rgba(108,176,207,0.45)', 2); } ctx.stroke();
  for (let i = 0; i < n; i++) {
    const u = mod(TT * sp + i / n, 1); if (u > p) continue;
    const q = pointAt(P, u), a = Math.sin(u * Math.PI);
    ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(q[0], q[1], o.r ?? 7, 0, TAU); ctx.fillStyle = c; ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------------
//  illustration pieces
// ---------------------------------------------------------------------
// a flow line: a navy hairline along P with hollow triangular arrowheads travelling along it
function igFlow(P, p = 1, o = {}) {
  if (p <= 0) return;
  igPath(subPath(P, clamp(p)), false); igLine(o.c ?? IG.ink, o.w ?? IG_HAIR); ctx.stroke();
  const n = o.arrows ?? 2, L = pathLen(P);
  for (let i = 0; i < n; i++) {
    const u = mod((o.speed ?? 0.06) * TT + i / n + (o.phase ?? 0), 1); if (u > p - 0.02) continue;
    const a = pointAt(P, u), b = pointAt(P, Math.min(1, u + 6 / L)), ang = Math.atan2(b[1] - a[1], b[0] - a[0]), s = o.size ?? 13;
    ctx.save(); ctx.translate(a[0], a[1]); ctx.rotate(ang);
    igPath([[s, 0], [-s * 0.8, -s * 0.75], [-s * 0.8, s * 0.75]], true); ctx.fillStyle = IG.white; ctx.fill(); igLine(o.c ?? IG.ink, IG_HAIR * 0.85); ctx.stroke();
    ctx.restore();
  }
}
// a gear: filled (o.fill) or outline (o.line), teeth n, rotation rot
function igGear(x, y, r, n, rot, o = {}) {
  const P = []; for (let i = 0; i < n * 4; i++) { const a = rot + (i / (n * 4)) * TAU, tooth = (i % 4 === 1 || i % 4 === 2); P.push([x + Math.cos(a) * r * (tooth ? 1 : 0.78), y + Math.sin(a) * r * (tooth ? 1 : 0.78)]); }
  ctx.save();
  igPath(P, true); ctx.moveTo(x + r * 0.42, y); ctx.arc(x, y, r * 0.42, 0, TAU, true);
  if (o.fill) { ctx.fillStyle = o.fill; ctx.fill('evenodd'); }
  if (o.line || !o.fill) { igLine(o.line ?? IG.ink, o.w ?? IG_HAIR * 0.7); ctx.stroke(); }
  ctx.restore();
}
// a speech bubble with three dots that type; tail at bottom-left (o.tail = -1) or bottom-right (1)
function igBubble(x, y, w, h, p = 1, o = {}) {
  igAt(x + w / 2, y + h, p, () => {
    const r = h * 0.28, tl = o.tail ?? -1, tx = tl < 0 ? x + w * 0.3 : x + w * 0.7;
    const P = rrectPts(x, y, w, h, r, 5);
    igFill(P, o.fill ?? IG.white); igPath(P, true); igLine(o.line ?? IG.ink, IG_HAIR * 0.75); ctx.stroke();
    igPath([[tx - 10, y + h - 1], [tx + tl * 4, y + h + 18], [tx + 10, y + h - 1]], false); ctx.fillStyle = o.fill ?? IG.white; ctx.fill(); ctx.stroke();
    for (let i = 0; i < 3; i++) {
      const b = Math.max(0, Math.sin(TT * 6 - i * 0.9)) * h * 0.08;
      ctx.beginPath(); ctx.arc(x + w / 2 + (i - 1) * h * 0.26, y + h / 2 - b, h * 0.075, 0, TAU); ctx.fillStyle = o.dot ?? IG.ink; ctx.fill();
    }
  });
}
// a check circle (filled colour c, white tick that draws on)
function igCheck(x, y, r, c, p = 1) {
  igAt(x, y, p, () => {
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = c; ctx.fill();
    igPath(subPath([[x - r * 0.42, y + r * 0.02], [x - r * 0.1, y + r * 0.36], [x + r * 0.45, y - r * 0.35]], clamp(p * 1.4 - 0.3)), false); igLine(IG.white, r * 0.2); ctx.stroke();
  });
}
// a bar chart standing on (x, y): vals 0..1, bars grow in turn with p; colours cycle lav / peri / indigo
function igBars(x, y, w, h, vals, p = 1, o = {}) {
  const n = vals.length, bw = w / n * 0.62, cols = o.colors ?? [IG.saffron, IG.lav, IG.peri, IG.indigo];
  vals.forEach((v, i) => {
    const k = igPop((o.t0 ?? 0) + i * 0.09, { k: 160, damp: 0.6 }) * (o.t0 == null ? p : 1), bh = h * v * k;
    if (bh <= 0.5) return;
    ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(x + i * (w / n), y - bh, bw, bh);
  });
  if (o.base !== false) { igPath([[x - 20, y], [x + w + (o.baseExt ?? 60), y]], false); igLine(IG.ink, IG_HAIR * 0.8); ctx.stroke(); }
}
// a donut chart: segs = [[fraction, colour], ...], swept on with p (0..1), slowly turning with rot
function igDonut(x, y, r0, r1, segs, p = 1, rot = -Math.PI / 2) {
  let a = rot; const tot = segs.reduce((s, g) => s + g[0], 0), end = rot + TAU * clamp(p);
  for (const [f, c] of segs) {
    const b = a + TAU * f / tot, e = Math.min(b, end); if (e <= a) break;
    ctx.beginPath(); ctx.arc(x, y, r1, a, e); ctx.arc(x, y, r0, e, a, true); ctx.closePath(); ctx.fillStyle = c; ctx.fill();
    a = b;
  }
}
// circuit traces: lines rising from (x, y) with a bend, each ending in a hollow ring (an "idea" / data feed)
function igCircuit(x, y, lens, p = 1, o = {}) {
  lens.forEach((L, i) => {
    const dx = (i - (lens.length - 1) / 2) * (o.gap ?? 26), bend = (o.bend ?? 0) * (i - (lens.length - 1) / 2);
    const P = [[x + dx, y], [x + dx, y - L * 0.55], [x + dx + bend, y - L * 0.75], [x + dx + bend, y - L]];
    const f = clamp(p * 1.4 - i * 0.12), S = subPath(P, f); if (f <= 0) return;
    igPath(S, false); igLine(o.c ?? IG.ink, IG_HAIR * 0.7); ctx.stroke();
    if (f >= 1) { ctx.beginPath(); ctx.arc(P[3][0], P[3][1] - 6, 6, 0, TAU); ctx.fillStyle = IG.white; ctx.fill(); ctx.stroke(); }
  });
}
// a light bulb outline with rays that blink (an idea)
function igBulb(x, y, s, p = 1) {
  igAt(x, y, p, () => {
    igLine(IG.ink, IG_HAIR * 0.75);
    ctx.beginPath(); ctx.arc(x, y, s * 0.5, Math.PI * 0.78, Math.PI * 2.22); ctx.lineTo(x + s * 0.2, y + s * 0.6); ctx.lineTo(x - s * 0.2, y + s * 0.6); ctx.closePath(); ctx.fillStyle = IG.white; ctx.fill(); ctx.stroke();
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(x - s * 0.2, y + s * (0.7 + i * 0.1)); ctx.lineTo(x + s * 0.2, y + s * (0.7 + i * 0.1)); ctx.stroke(); }
    igPath([[x - s * 0.15, y + s * 0.55], [x - s * 0.1, y], [x, y + s * 0.12], [x + s * 0.1, y], [x + s * 0.15, y + s * 0.55]], false); ctx.stroke();
    const on = 0.5 + 0.5 * Math.sin(TT * 3);
    for (let i = 0; i < 5; i++) { const a = Math.PI * (1.1 + i * 0.2), r0 = s * 0.68, r1 = s * (0.82 + on * 0.08); ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
  });
}
// a ladder from (x0, y0) (foot) to (x1, y1) (top): two rails and rungs; o.c colour
function igLadder(x0, y0, x1, y1, w, p = 1, o = {}) {
  const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy * w / 2, ny = ux * w / 2, len = L * clamp(p);
  igLine(o.c ?? IG.indigo, o.w ?? 9); ctx.lineCap = 'butt';
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x0 + nx * s, y0 + ny * s); ctx.lineTo(x0 + nx * s + ux * len, y0 + ny * s + uy * len); ctx.stroke(); }
  ctx.lineWidth = (o.w ?? 9) * 0.7;
  for (let d = 40; d < len - 10; d += o.step ?? 58) { ctx.beginPath(); ctx.moveTo(x0 - nx + ux * d, y0 - ny + uy * d); ctx.lineTo(x0 + nx + ux * d, y0 + ny + uy * d); ctx.stroke(); }
}
// speckled grain clipped to outline P, denser toward the side `dir` (radians): the illustration's print texture
function igGrain(P, c, o = {}) {
  const b = bbox(P), bb = [b.x0, b.y0, b.x1, b.y1], R = RNG(o.key ?? 'grain'), n = o.n ?? 2600, dir = o.dir ?? 0, cx = (bb[0] + bb[2]) / 2, cy = (bb[1] + bb[3]) / 2;
  const reach = Math.hypot(bb[2] - bb[0], bb[3] - bb[1]) / 2;
  ctx.save(); igPath(P, true); ctx.clip(); ctx.fillStyle = c;
  for (let i = 0; i < n; i++) {
    const x = lerp(bb[0], bb[2], R.f()), y = lerp(bb[1], bb[3], R.f()), s = R.f(), r = 0.8 + R.f() * 1.6;
    const along = ((x - cx) * Math.cos(dir) + (y - cy) * Math.sin(dir)) / reach;   // -1 .. 1 toward dir
    if (s > clamp((along - (o.from ?? 0.05)) * 1.8) * (o.max ?? 0.9)) continue;
    ctx.fillRect(x, y, r, r);
  }
  ctx.restore();
}
// the illustration's big hero mass: a head in profile facing left, centre (x, y), height s
function igHeadPts(x, y, s, n = 12) {
  const S = (p) => [x + p[0] * s, y + p[1] * s];
  const sg = (a) => a.map(S);
  return igBez(S([-0.30, -0.40]), [
    sg([[-0.36, -0.30], [-0.40, -0.18], [-0.40, -0.08]]),
    sg([[-0.40, -0.02], [-0.50, 0.05], [-0.50, 0.10]]),
    sg([[-0.43, 0.14]]),
    sg([[-0.45, 0.16], [-0.42, 0.19], [-0.45, 0.215]]),
    sg([[-0.42, 0.24], [-0.45, 0.265], [-0.42, 0.285]]),
    sg([[-0.42, 0.33], [-0.38, 0.36], [-0.30, 0.37]]),
    sg([[-0.22, 0.38], [-0.14, 0.38], [-0.12, 0.42]]),
    sg([[-0.12, 0.66]]), sg([[0.24, 0.66]]),
    sg([[0.22, 0.55], [0.22, 0.46], [0.28, 0.38]]),
    sg([[0.44, 0.22], [0.52, 0.05], [0.50, -0.12]]),
    sg([[0.48, -0.42], [0.25, -0.62], [-0.02, -0.62]]),
    sg([[-0.16, -0.62], [-0.26, -0.52], [-0.30, -0.40]]),
  ], n);
}
function igHead(x, y, s, o = {}) {
  const P = igHeadPts(x, y, s);
  igFill(P, o.fill ?? IG.saffron);
  if (o.grain !== false) igGrain(P, o.grainC ?? IG.saffronD, { key: o.key ?? 'head', dir: o.dir ?? 0.35, n: o.n ?? 14000, from: -0.1 });
  return P;
}

// ---------------------------------------------------------------------
//  icons: simple line glyphs drawn in code, centred on (x, y), size s, colour c
//  names: mail db people doc chart link clock bulb search gear check brain ticket
// ---------------------------------------------------------------------
function igIcon(name, x, y, s, c, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100); igLine(c, o.w ?? 8); ctx.fillStyle = c;
  const R = (a, b, w, h, r = 6) => { igPath(rrectPts(a, b, w, h, r, 3), true); };
  switch (name) {
    case 'mail': R(-42, -30, 84, 60, 6); ctx.stroke(); igPath([[-40, -26], [0, 6], [40, -26]], false); ctx.stroke(); break;
    case 'db': for (const yy of [-30, 0, 30]) { ctx.beginPath(); ctx.ellipse(0, yy, 36, 11, 0, 0, Math.PI); ctx.stroke(); } ctx.beginPath(); ctx.ellipse(0, -30, 36, 11, 0, 0, TAU); ctx.stroke(); igPath([[-36, -30], [-36, 30]], false); ctx.stroke(); igPath([[36, -30], [36, 30]], false); ctx.stroke(); break;
    case 'people': for (const [dx, sc] of [[-28, 0.75], [28, 0.75], [0, 1]]) { ctx.beginPath(); ctx.arc(dx, -18 * sc - 8, 13 * sc, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(dx, 32, 24 * sc, 26 * sc, 0, Math.PI, TAU); ctx.fill(); } break;
    case 'doc': igPath([[-28, -40], [12, -40], [30, -22], [30, 40], [-28, 40]], true); ctx.stroke(); for (const yy of [-8, 8, 24]) { igPath([[-14, yy], [16, yy]], false); ctx.stroke(); } break;
    case 'chart': for (const [bx, bh] of [[-30, 30], [-6, 50], [18, 74]]) ctx.fillRect(bx, 38 - bh, 16, bh); break;
    case 'link': ctx.rotate(-Math.PI / 4); R(-44, -15, 50, 30, 15); ctx.stroke(); R(-6, -15, 50, 30, 15); ctx.stroke(); break;
    case 'clock': ctx.beginPath(); ctx.arc(0, 0, 38, 0, TAU); ctx.stroke(); igPath([[0, -22], [0, 0], [18, 10]], false); ctx.stroke(); break;
    case 'bulb': ctx.beginPath(); ctx.arc(0, -10, 28, Math.PI * 0.8, Math.PI * 2.2); ctx.lineTo(12, 22); ctx.lineTo(-12, 22); ctx.closePath(); ctx.stroke(); igPath([[-12, 34], [12, 34]], false); ctx.stroke(); break;
    case 'search': ctx.beginPath(); ctx.arc(-8, -8, 26, 0, TAU); ctx.stroke(); ctx.lineWidth = 12; igPath([[12, 12], [36, 36]], false); ctx.stroke(); break;
    case 'gear': ctx.restore(); igGear(x, y, s * 0.42, 8, TT * 0.8, { line: c, w: s * 0.07 }); return;
    case 'check': ctx.beginPath(); ctx.arc(0, 0, 38, 0, TAU); ctx.stroke(); igPath(subPath([[-18, 0], [-5, 14], [20, -14]], o.p ?? 1), false); ctx.stroke(); break;
    case 'ticket': ctx.rotate(-0.5); R(-40, -22, 80, 44, 8); ctx.stroke(); ctx.setLineDash([6, 8]); igPath([[10, -20], [10, 20]], false); ctx.stroke(); break;
    case 'brain': ctx.beginPath(); ctx.arc(-14, -8, 22, Math.PI * 0.6, Math.PI * 1.8); ctx.arc(14, -8, 22, Math.PI * 1.2, Math.PI * 2.4); ctx.arc(14, 14, 18, -0.2, Math.PI * 0.7); ctx.arc(-14, 14, 18, Math.PI * 0.3, Math.PI * 1.2); ctx.closePath(); ctx.stroke(); igPath([[0, -28], [0, 30]], false); ctx.stroke(); break;
    default: ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------------
//  the hero: a flat corporate figure — periwinkle top, navy trousers and hair, cream face with two tiny
//  navy eyes (the references' faces are blank; ours blink, so the hero reads as alive). Feet at (x, y);
//  s = height in px. o: { key, look: -1 | 1 (faces left / right), hop: t0 of a hop, wave: t0 of a wave, laptop }
// ---------------------------------------------------------------------
function igPerson(x, y, s, o = {}) {
  const key = o.key ?? 'hero', u = s / 200, f = o.look ?? 1;
  let lift = 0, sq = 0;
  if (o.hop != null && TT > o.hop) { const h = TT - o.hop; if (h < 0.45) lift = Math.sin(h / 0.45 * Math.PI) * 40 * u; sq = Math.exp(-Math.max(0, h - 0.45) * 9) * Math.sin(Math.max(0, h - 0.45) * 30) * 0.06; }
  const breathe = Math.sin(TT * TAU * 0.5 + key.length) * 0.012;
  ctx.save(); ctx.translate(x, y - lift); ctx.scale(f * u * (1 + sq), u * (1 - sq + breathe));
  // legs (navy), a small stride
  ctx.fillStyle = IG.ink;
  igFill(rrectPts(-26, -98, 22, 98, 9, 3), IG.ink); igFill(rrectPts(4, -98, 22, 98, 9, 3), IG.ink);
  igFill(rrectPts(-30, -10, 32, 12, 6, 3), IG.navyT); igFill(rrectPts(2, -10, 34, 12, 6, 3), IG.navyT);
  // back arm, torso, front arm (periwinkle; the far arm a shade darker)
  const wave = o.wave != null && TT > o.wave ? Math.sin((TT - o.wave) * 9) * 0.25 * Math.exp(-(TT - o.wave) * 1.5) : 0;
  ctx.save(); ctx.translate(-22, -160); ctx.rotate(0.25); igFill(rrectPts(-11, 0, 22, 74, 11, 3), IG.indigo); ctx.restore();
  igFill(igBez([-34, -92], [[[-36, -150], [-30, -178], [0, -180]], [[30, -178], [36, -150], [34, -92]]], 8), IG.peri);
  ctx.save(); ctx.translate(24, -164); ctx.rotate(-0.35 - (o.wave != null && TT > o.wave ? 2.1 * clamp((TT - o.wave) / 0.3) : 0) + wave); igFill(rrectPts(-11, 0, 22, 74, 11, 3), IG.peri);
  ctx.beginPath(); ctx.arc(0, 78, 10, 0, TAU); ctx.fillStyle = IG.cream; ctx.fill(); ctx.restore();
  // neck, head, hair (a bob with a ponytail tuft)
  igFill(rrectPts(-7, -192, 14, 16, 4, 2), IG.cream);
  ctx.beginPath(); ctx.arc(2, -212, 24, 0, TAU); ctx.fillStyle = IG.cream; ctx.fill();
  ctx.beginPath(); ctx.arc(-2, -216, 25, Math.PI * 0.75, Math.PI * 1.95); ctx.closePath(); ctx.fillStyle = IG.ink; ctx.fill();
  ctx.beginPath(); ctx.ellipse(-26, -206, 9, 15, 0.5, 0, TAU); ctx.fill();
  // eyes: look along f, blink every ~3s
  const blink = mod(TT + key.length * 0.37, 3.1) < 0.12;
  for (const ex of [8, 19]) { ctx.beginPath(); ctx.ellipse(ex, -210, 2.6, blink ? 0.6 : 3.4, 0, 0, TAU); ctx.fillStyle = IG.ink; ctx.fill(); }
  ctx.restore();
  SPARK_AT = toScreen(x + f * 4 * u, y - lift - 212 * u);
}
// the hero's silhouette for bridges: a rounded capsule the size of the figure
const igPersonPts = (x, y, r) => rrectPts(x - r * 0.4, y - r, r * 0.8, r * 2, r * 0.4, 8);

// ---------------------------------------------------------------------
//  captions and tags (through DEFER: drawn after the camera, at screen size)
//  a caption: centred at CX, navy text with teal emphasis runs: segs = [{ s, c? , weight? }] or a string
// ---------------------------------------------------------------------
function igCaptionNow(segs, y, o = {}) {
  const a = igSettle(E0 + (o.at ?? 0.45)); if (a <= 0.001) return;
  const sz = o.size ?? 46, S = typeof segs === 'string' ? [{ s: segs }] : segs;
  ctx.save(); ctx.globalAlpha = clamp(a);
  igRich(S.map((g) => ({ c: IG.navyT, ...g })), CX, y + (1 - a) * 16, sz, { weight: 500, align: 'center' });
  ctx.restore();
}
function igTagNow(n, label, o = {}) {
  const p = igSettle(E0 + 0.15); if (p <= 0.001) return;
  igStep(n, label, o.x ?? 70, o.y ?? 318, o.size ?? 34, clamp(p), { t0: E0 + 0.1, fill: o.fill });
}
const igCaption = (segs, o = {}) => { const f = () => igCaptionNow(segs, o.y ?? 1470, o); if (DEFER) DEFER.push(f); else f(); };
const igTag = (n, label, o = {}) => { const f = () => igTagNow(n, label, o); if (DEFER) DEFER.push(f); else f(); };

// =====================================================================
//  STYLE — the renderer's hooks (see the skill's styles/README.md)
// =====================================================================
const STYLE = {
  name: 'infographic',
  paper: IG_SHEETMODE ? IG.washL : IG.paper,
  backdrop(c) { fillAll(c); },
  // the world seen through outline P, like a card: a soft shadow under it and a thin white rim
  window(P, key, src) {
    igShadow(() => igFill(P, IG.white), { blur: 36, dy: 12 });
    ctx.save(); igPath(P, true); ctx.clip(); ctx.drawImage(src, 0, 0); ctx.restore();
    igPath(P, true); igLine(IG.white, 6); ctx.stroke();
    igPath(P, true); igLine(IG.rule, 2); ctx.stroke();
  },
  // the morphing shape: a flat fill with a soft shadow, no outline (flat vector)
  blob(P, c) { igShadow(() => igFill(P, c), { blur: 30, dy: 10 }); },
  hero(x, y, r, o) { igPerson(x, y + r, r * 2, { key: o?.key ?? 'morph' }); },
  heroColor: IG.peri,
  heroPts: (x, y, r) => igPersonPts(x, y, r),
  post() {},
  ones: true,
};
