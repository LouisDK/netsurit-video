// =====================================================================
//  styles/netsurit-soft/kit.js — soft geometric illustration in the Netsurit CI.
//  Friendly flat shapes built from circles, semicircles and rounded rectangles on white: big pale arches behind the
//  subjects, people with circle heads, dot eyes and a small smile, pendant lamps with amber bulbs, pill rows with
//  round icon badges, rounded bar charts. One signature per frame: a red bar or arrow that ends in a 45° flag cut,
//  like the N. Solid fills, no outlines, no shadows, no gradients; the only lines are thin connectors.
//  Motion on 1s: gentle spring pop-ins, idle life (blinks, lamps sway, hands type), diagonal wipes between scenes.
//  Studied from one local reference sheet (four panels); see STYLE.md. Built on kit/core.js.
//  Needs from the piece head: W, H, CX. Optional: NSS_WIPES = [t, ...] (diagonal wipes at those times).
// =====================================================================

// ---- palette (measured from the reference, snapped to the CI where the CI has the colour)
const NSS = {
  white: '#FFFFFF',
  mist: '#EBEBF1', mistD: '#E1E2EA',       // the big arches and pills (ref #e9eaf1, 15% of the sheet)
  fog: '#C5CAD4', fogD: '#B4BAC5',         // skylines, clouds, the far shapes (ref #bdc3cd / #c4c9d4)
  steel: '#A1AAB1', steelD: '#8F98A3',     // chairs, desks, plants, chart bars (ref #9aa3ae / #9099a3)
  badge: '#41484F',                        // the dark icon badges (ref #41484f)
  ink: '#2C2A29',                          // figures, hair, lamp shades, connectors (CI charcoal; ref #2c2827)
  red: '#F4364C', redD: '#D42A3E',         // the one hero shape per frame (CI red; ref #f12b39)
  amber: '#FDB736',                        // the lamp bulbs and one small accent (CI amber; ref #fca837)
  skin: '#FDBD8B', skinD: '#EFA676',       // faces and hands (ref #fdbc89)
  skel: '#D6D8E2',                         // placeholder text lines (ref #d5d7e2)
};
const NSS_FONT = '"Oxygen", "Segoe UI", Helvetica, Arial, sans-serif';
const NSS_LINE = 5;   // connectors and lamp cords: ~2.2px on the 466px reference panel, at 1080 wide

// ---------------------------------------------------------------------
//  motion: closed-form springs (deterministic, no state)
// ---------------------------------------------------------------------
function nssSpring(t0, o = {}) {
  const s = TT - t0; if (s <= 0) return 0;
  const w0 = Math.sqrt(o.k ?? 150), z = Math.min(0.98, o.damp ?? 0.6), wd = w0 * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w0 * s) * (Math.cos(wd * s) + (z * w0 / wd) * Math.sin(wd * s));
}
const nssPop = (t0, o) => nssSpring(t0, { k: 160, damp: 0.58, ...o });      // icons, badges, people: a gentle overshoot
const nssSettle = (t0, o) => nssSpring(t0, { k: 110, damp: 0.85, ...o });   // arches, pills, text: almost none
const nssDraw = (t0, d = 0.6) => EZ.io(clamp((TT - t0) / d));               // lines and bars drawing on
// scale about (x, y) by k, run fn. k <= 0 draws nothing.
function nssAt(x, y, k, fn, alpha = 1) {
  if (k <= 0.001 || alpha <= 0.001) return;
  ctx.save(); ctx.globalAlpha *= clamp(alpha); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); fn(); ctx.restore();
}
// a pop-in about the shape's base: rises 24px and scales from 0.85
const nssIn = (x, y, p, fn) => nssAt(x, y + (1 - p) * 24, 0.85 + 0.15 * p, fn, clamp(p * 2));

// ---------------------------------------------------------------------
//  drawing basics
// ---------------------------------------------------------------------
function nssPath(P, closed) { ctx.beginPath(); if (!P.length) return; ctx.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) ctx.lineTo(P[i][0], P[i][1]); if (closed) ctx.closePath(); }
function nssFill(P, c) { nssPath(P, true); ctx.fillStyle = c; ctx.fill(); }
function nssCirc(x, y, r, c) { if (r <= 0) return; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = c; ctx.fill(); }
function nssRR(x, y, w, h, r, c) { if (w <= 0 || h <= 0) return; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = c; ctx.fill(); }
// a thick stroke with round ends: arms, legs, cords
function nssLimb(P, w, c) { ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = w; ctx.strokeStyle = c; nssPath(P, false); ctx.stroke(); ctx.restore(); }
// a dome: the top half of a circle on a flat base at by
function nssDome(cx, by, r, c) { ctx.beginPath(); ctx.arc(cx, by, r, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); }
// an arch: a dome on a rectangle (x, y = the top of the dome; w wide; down to y + h)
function nssArch(x, y, w, h, c) {
  const r = w / 2; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x, y + r); ctx.arc(x + r, y + r, r, Math.PI, TAU); ctx.lineTo(x + w, y + h); ctx.closePath();
  ctx.fillStyle = c; ctx.fill();
}
// the signature: a bar with a rounded left end and a 45° flag cut on the right (the bottom edge runs longer)
function nssFlagPts(x, y, w, h) {
  const r = h / 2, P = arcPts(x + r, y + r, r, Math.PI / 2, Math.PI * 1.5, 16);
  return [...P, [x + w - h, y], [x + w, y + h]];
}
// a polyline with rounded corners, sampled (so it can draw on with subPath)
function nssRound(P, r = 26) {
  if (P.length < 3) return P;
  const out = [P[0]];
  for (let i = 1; i < P.length - 1; i++) {
    const [a, b, c] = [P[i - 1], P[i], P[i + 1]], la = dist(a, b), lc = dist(b, c), k = Math.min(r, la / 2, lc / 2);
    const p0 = [b[0] + (a[0] - b[0]) / la * k, b[1] + (a[1] - b[1]) / la * k], p1 = [b[0] + (c[0] - b[0]) / lc * k, b[1] + (c[1] - b[1]) / lc * k];
    for (let j = 0; j <= 8; j++) { const t = j / 8, u = 1 - t; out.push([u * u * p0[0] + 2 * u * t * b[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * b[1] + t * t * p1[1]]); }
  }
  out.push(P[P.length - 1]); return out;
}
// a connector: a thin charcoal line with rounded corners and a dot at each end, drawing on with p
function nssConnector(P, p = 1, o = {}) {
  if (p <= 0.001) return;
  const Q = subPath(nssRound(P, o.r ?? 26), clamp(p)), c = o.c ?? NSS.ink;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = o.w ?? NSS_LINE; ctx.strokeStyle = c; nssPath(Q, false); ctx.stroke(); ctx.restore();
  const d = o.dot ?? 13;
  if (o.dots !== false) { nssCirc(P[0][0], P[0][1], d * clamp(p * 6), o.c0 ?? c); if (p > 0.97) nssCirc(...P[P.length - 1], d * nssPop(o.t1 ?? -9), o.c1 ?? c); }
}

// ---------------------------------------------------------------------
//  text (Oxygen, sentence case)
// ---------------------------------------------------------------------
function nssFont(size, o = {}) { return `${o.weight ?? 700} ${size}px ${o.font ?? NSS_FONT}`; }
function nssW(str, size, o = {}) { ctx.save(); ctx.font = nssFont(size, o); const w = ctx.measureText(str).width; ctx.restore(); return w; }
// one line; o.frac (0..1) wipes it on left to right
function nssText(str, x, y, size, color, o = {}) {
  ctx.save(); ctx.font = nssFont(size, o); ctx.fillStyle = color; ctx.textBaseline = 'alphabetic';
  const w = ctx.measureText(str).width, x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x, fr = clamp(o.frac ?? 1);
  if (fr <= 0) { ctx.restore(); return w; }
  if (fr < 1) { ctx.beginPath(); ctx.rect(x0 - 4, y - size * 1.3, w * fr + 4, size * 1.8); ctx.clip(); }
  ctx.textAlign = 'left'; ctx.globalAlpha *= o.alpha ?? 1; ctx.fillText(str, x0, y);
  ctx.restore(); return w;
}
// coloured runs on one line: segs = [{ s, c, weight }]
function nssRich(segs, x, y, size, o = {}) {
  const ws = segs.map((g) => nssW(g.s, size, { ...o, weight: g.weight ?? o.weight })), w = ws.reduce((a, b) => a + b, 0);
  let cx = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
  const fr = clamp(o.frac ?? 1), edge = cx + w * fr;
  segs.forEach((g, i) => { nssText(g.s, cx, y, size, g.c ?? NSS.ink, { ...o, align: 'left', weight: g.weight ?? o.weight, frac: clamp((edge - cx) / ws[i]) }); cx += ws[i]; });
  return w;
}
// grey placeholder lines: n lines of decreasing length, drawing on with p
function nssSkel(x, y, w, n, p, o = {}) {
  const gap = o.gap ?? 44, h = o.h ?? 22, L = o.lens ?? [1, 0.62, 0.8, 0.5];
  for (let i = 0; i < n; i++) { const f = clamp(p * n - i * 0.6), lw = w * L[i % L.length] * EZ.o3(f); if (lw > 1) nssRR(x, y + i * gap, lw, h, h / 2, o.c ?? NSS.skel); }
}
// the caption: centred under the art, charcoal with red emphasis runs; segs = [['plain'], ['red', 1], ...]
// Captions stop once a full-frame cover (the end card) has landed: brand.js sets NSS_COVER.
let NSS_COVER = 1e9;
function nssCaption(segs, o = {}) {
  const f = () => {
    const p = nssSettle(E0 + (o.at ?? 0.35)); if (p <= 0.001 || TT >= NSS_COVER) return;
    const y = (o.y ?? H - SAFE.bottom - 50) + (1 - p) * 14;
    nssRich(segs.map(([s, red]) => ({ s, c: red ? NSS.red : NSS.ink })), CX, y, o.size ?? 54, { align: 'center', alpha: clamp(p * 1.6), frac: EZ.io(clamp(p * 1.3)) });
  };
  if (DEFER) DEFER.push(f); else f();
}

// ---------------------------------------------------------------------
//  icons (solid): cloud, shield, bars, check, person — centred on (x, y), r = half the size
// ---------------------------------------------------------------------
function nssIcon(kind, x, y, r, c) {
  ctx.save(); ctx.fillStyle = c;
  if (kind === 'cloud') nssCloud(x, y + r * 0.1, r * 0.95, c);
  else if (kind === 'shield') {
    ctx.translate(x, y); ctx.scale(r, r); ctx.beginPath();
    ctx.moveTo(0, -0.95); ctx.lineTo(0.78, -0.66); ctx.lineTo(0.78, -0.02); ctx.quadraticCurveTo(0.78, 0.62, 0, 0.98); ctx.quadraticCurveTo(-0.78, 0.62, -0.78, -0.02); ctx.lineTo(-0.78, -0.66); ctx.closePath(); ctx.fill();
  } else if (kind === 'bars') {
    [[-0.75, 0.25], [-0.2, -0.2], [0.35, -0.75]].forEach(([dx, top]) => nssRR(x + dx * r, y + top * r, r * 0.4, (0.85 - top) * r, r * 0.08, c));
  } else if (kind === 'check') {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = r * 0.32; ctx.strokeStyle = c; nssPath([[x - r * 0.6, y], [x - r * 0.15, y + r * 0.45], [x + r * 0.65, y - r * 0.45]], false); ctx.stroke();
  } else if (kind === 'person') { nssCirc(x, y - r * 0.38, r * 0.38, c); nssDome(x, y + r * 0.85, r * 0.72, c); }
  ctx.restore();
}
// a cloud: three overlapping circles on a flat base (y = the base's middle), s = half its width
function nssCloud(x, y, s, c) {
  ctx.save(); ctx.beginPath(); ctx.rect(x - s * 1.2, y - s * 2, s * 2.4, s * 2.3); ctx.clip();
  nssCirc(x - s * 0.5, y - s * 0.02, s * 0.42, c); nssCirc(x + s * 0.02, y - s * 0.3, s * 0.56, c); nssCirc(x + s * 0.52, y - s * 0.02, s * 0.42, c);
  nssRR(x - s * 0.92, y - s * 0.3, s * 1.84, s * 0.6, s * 0.3, c);
  ctx.restore();
}

// ---------------------------------------------------------------------
//  the world: lamps, plants, skylines, furniture
// ---------------------------------------------------------------------
// the lamp's sway (radians) and the shade's outline (for a lamp-to-lamp morph)
const nssSway = (key) => { const R = RNG('lamp', key); return 0.045 * Math.sin(TT * TAU * R.r(0.22, 0.32) + R.r(0, TAU)); };
function nssLampShadePts(x, top, len, r, key) {
  const a = nssSway(key), cx = x + Math.sin(a) * len, cy = top + Math.cos(a) * len;
  return arcPts(0, 0, r, Math.PI, TAU, 24).map(([u, v]) => [cx + u * Math.cos(a) + v * Math.sin(a), cy - u * Math.sin(a) + v * Math.cos(a)]);   // the same turn as nssLamp's rotate(-a)
}
// a pendant lamp: a cord from (x, top), a charcoal dome shade of radius r at the cord's end, an amber bulb under it; sways
function nssLamp(x, top, len, r, key = 'lamp') {
  const a = nssSway(key);
  ctx.save(); ctx.translate(x, top); ctx.rotate(-a);
  nssLimb([[0, 0], [0, len - r * 0.4]], NSS_LINE, NSS.ink);
  nssDome(0, len + r * 0.02, r * 0.36, NSS.amber);
  ctx.beginPath(); ctx.arc(0, len + r * 0.02, r * 0.36, 0, Math.PI); ctx.fillStyle = NSS.amber; ctx.fill();
  nssDome(0, len, r, NSS.ink);
  ctx.restore();
}
// a plant: a rounded pot and leaf ellipses that sway a little; (x, by) = the pot's base centre, s = scale (1 ≈ 200px tall)
function nssPlant(x, by, s, key = 'plant', o = {}) {
  const sway = 0.03 * Math.sin(TT * TAU * 0.25 + hash(key) % 7);
  const leaves = o.leaves ?? [[-0.62, -1.15, 0.55, -0.6], [0.55, -1.25, 0.6, 0.55], [-0.3, -1.75, 0.6, -0.25], [0.2, -1.95, 0.55, 0.2]];
  ctx.save(); ctx.translate(x, by - 60 * s); ctx.rotate(sway);
  leaves.forEach(([dx, dy, l, rot], i) => {
    ctx.save(); ctx.translate(dx * 60 * s, (dy + 1) * 100 * s); ctx.rotate(rot);
    ctx.beginPath(); ctx.ellipse(0, 0, l * 42 * s, l * 92 * s, 0, 0, TAU); ctx.fillStyle = i % 2 ? (o.c2 ?? NSS.fog) : (o.c ?? NSS.steel); ctx.fill(); ctx.restore();
  });
  ctx.restore();
  nssFill([[x - 52 * s, by - 72 * s], [x + 52 * s, by - 72 * s], [x + 40 * s, by], [x - 40 * s, by]], o.pot ?? NSS.steelD);
}
// a skyline of rectangles and dome tops on a base line; towers = [[x, w, h, dome?, c?], ...]
function nssSkyline(base, towers) {
  towers.forEach(([x, w, h, dome, c]) => {
    const col = c ?? NSS.fog;
    if (dome) nssArch(x, base - h, w, h, col); else nssRR(x, base - h, w, h, 4, col);
  });
}
function nssChair(x, seatY, f, o = {}) {   // a side-on office chair, facing f (its back behind the sitter); o.floor
  const c = o.c ?? NSS.steel, bx = x - f * 70, fl = o.floor ?? seatY + 200;
  nssRR(bx - 32, seatY - 230, 64, 250, 30, c);                 // back
  nssRR(x - 95, seatY - 10, 190, 44, 20, c);                   // seat
  const st = seatY + (fl - seatY) * 0.55;
  nssLimb([[x, seatY + 30], [x, st]], 14, NSS.steelD);
  nssLimb([[x - 80, fl], [x, st], [x + 80, fl]], 12, NSS.steelD);
}
// an open laptop seen from the front, its screen at (x, y) w wide; o.chart draws a little bar chart on it
function nssLaptop(x, y, w, o = {}) {
  const h = w * 0.66;
  nssRR(x, y, w, h, 10, NSS.ink); nssRR(x + 10, y + 10, w - 20, h - 20, 4, NSS.white);
  nssRR(x - w * 0.12, y + h, w * 1.24, 14, 7, NSS.fogD);
  if (o.chart) {
    const p = o.p ?? 1; [0.35, 0.55, 0.7, 1].forEach((k, i) => { const bh = (h - 60) * k * EZ.o3(clamp(p * 4 - i)); nssRR(x + 30 + i * (w - 60) / 4, y + h - 22 - bh, (w - 60) / 4 - 12, bh, 3, i === 3 ? NSS.red : NSS.steel); });
  }
}

// ---------------------------------------------------------------------
//  people: circle heads with dot eyes and a small smile, rounded torsos, thick round limbs
//  (x, y) = the seat (pose 'sit') or the point between the feet (stand); s = the head's radius; o.f = facing 1 / -1 / 0
//  o: top, legs (colours), hair 'short' | 'bun' | 'long', hands [[x, y], [x, y]] (screen points), point (a finger),
//     floor (sit: the floor's y), noLegs (behind a table), key (for the blink)
// ---------------------------------------------------------------------
function nssBlink(key) { const R = RNG('blink', key), per = R.r(2.6, 4.2); return mod(TT + R.r(0, per), per) < 0.13; }
function nssHead(hx, hy, s, f, o = {}) {
  const hair = o.hairC ?? NSS.ink, style = o.hair ?? 'short', b = f === 0 ? 0 : f;
  if (style === 'long') nssRR(hx - s * 1.05 - b * 0.2 * s, hy - s * 0.4, s * 2.1, s * 2.1, s * 0.7, hair);
  if (style === 'bun') nssCirc(b ? hx - b * 0.62 * s : hx, b ? hy - s * 1.0 : hy - s * 1.2, s * 0.5, hair);
  nssCirc(hx - b * 0.2 * s, hy - s * 0.22, s * 1.04, hair);                              // the cap of hair, behind
  nssRR(hx - s * 0.3 + b * 0.05 * s, hy + s * 0.6, s * 0.6, s * 0.75, s * 0.12, o.skin ?? NSS.skin);   // neck
  nssCirc(hx + b * 0.06 * s, hy + s * 0.1, s * 0.92, o.skin ?? NSS.skin);              // the face
  // the fringe: two circles over the forehead
  if (b) { nssCirc(hx + b * 0.28 * s, hy - s * 0.72, s * 0.46, hair); nssCirc(hx - b * 0.3 * s, hy - s * 0.82, s * 0.5, hair); }
  else { nssCirc(hx - s * 0.38, hy - s * 0.74, s * 0.5, hair); nssCirc(hx + s * 0.4, hy - s * 0.7, s * 0.46, hair); }
  // eyes and a smile
  const blink = nssBlink(o.key ?? 'p'), ex = b ? [hx + b * 0.22 * s, hx + b * 0.62 * s] : [hx - 0.32 * s, hx + 0.32 * s], ey = hy + s * 0.08;
  ex.forEach((x) => { ctx.beginPath(); ctx.ellipse(x, ey, s * 0.1, blink ? s * 0.025 : s * 0.12, 0, 0, TAU); ctx.fillStyle = NSS.ink; ctx.fill(); });
  if (o.smile !== false) {
    const mx = b ? hx + b * 0.44 * s : hx, my = hy + s * 0.34;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = s * 0.09; ctx.strokeStyle = NSS.ink; ctx.beginPath(); ctx.arc(mx, my, s * 0.2, 0.18 * Math.PI, 0.82 * Math.PI); ctx.stroke(); ctx.restore();
  }
}
function nssPerson(x, y, s, o = {}) {
  const f = o.f ?? 1, top = o.top ?? NSS.ink, legs = o.legs ?? NSS.ink, skin = o.skin ?? NSS.skin, sit = o.pose === 'sit';
  const hipY = sit ? y : y - 4.6 * s, shY = hipY - 2.9 * s, b = f === 0 ? 0 : f;
  const hx = x + b * 0.25 * s, hy = shY - 1.35 * s;
  const shoe = (fx, fy, d) => { ctx.beginPath(); ctx.ellipse(fx + d * s * 0.35, fy, s * 0.78, s * 0.36, 0, 0, TAU); ctx.fillStyle = NSS.ink; ctx.fill(); };
  // legs
  if (!o.noLegs) {
    if (sit) {
      const fl = o.floor ?? y + 3.4 * s, d = b || 1;
      for (const k of [1, 0]) {
        const dx = (k ? 0.5 : -0.1) * s * d, kx = x + d * 2.4 * s + dx, fx = kx + d * 0.25 * s;
        nssLimb([[x + dx * 0.3, hipY - 0.3 * s], [kx, hipY - 0.25 * s], [fx, fl - 0.45 * s]], 1.3 * s, legs);
        shoe(fx, fl - 0.3 * s, d);
      }
    } else {
      for (const k of [-1, 1]) { const fx = x + k * 0.62 * s; nssLimb([[x + k * 0.55 * s, hipY - 0.3 * s], [fx, y - 0.55 * s]], 1.3 * s, legs); shoe(fx, y - 0.3 * s, b ? b : k); }
    }
  }
  // torso: rounded shoulders, a little narrower at the hips
  const tw = (b ? 3.2 : 3.6) * s, th = hipY - shY + (sit ? 0.15 * s : 0.3 * s);
  nssRR(x - tw / 2, shY, tw, th, [1.5 * s, 1.5 * s, 0.6 * s, 0.6 * s], top);
  nssHead(hx, hy, s, f, { ...o, skin });
  // arms: shoulder -> elbow -> hand, the elbow dropped below the straight line
  const hands = o.hands ?? [[x - 1.2 * s + b * 1.1 * s, hipY - 0.6 * s], [x + 1.2 * s + b * 1.1 * s, hipY - 0.6 * s]];
  hands.forEach(([hx2, hy2], i) => {
    const sx = x + (i ? 1 : -1) * (tw / 2 - 0.6 * s), sy = shY + 0.95 * s;   // low enough that the round cap stays inside the shoulder
    const mx = (sx + hx2) / 2, my = (sy + hy2) / 2, L = Math.hypot(hx2 - sx, hy2 - sy), bend = Math.max(0, 3.0 * s - L) * 0.35 + 0.2 * s;
    const ex = mx + (i ? 1 : -1) * bend * 0.1, ey = my + bend;
    nssLimb([[sx, sy], [ex, ey], [hx2, hy2]], 0.95 * s, top);
    nssCirc(hx2, hy2, 0.42 * s, skin);
    if (o.point && i === (o.pointHand ?? 1)) { const a = Math.atan2(o.point[1] - hy2, o.point[0] - hx2); nssLimb([[hx2, hy2], [hx2 + Math.cos(a) * 0.75 * s, hy2 + Math.sin(a) * 0.75 * s]], 0.26 * s, skin); }
  });
}

// ---------------------------------------------------------------------
//  sheet pieces: pill rows with icon badges, the red flag row, a rounded bar chart, devices, the hero arrow
// ---------------------------------------------------------------------
// a row: a mist pill (or, with o.hero, the red flag), a round badge with an icon, a label. p = a spring value.
function nssRow(x, y, w, h, label, icon, p = 1, o = {}) {
  if (p <= 0.001) return;
  nssIn(x + w / 2, y + h, p, () => {
    if (o.hero) nssFill(nssFlagPts(x, y, w + h * 0.35, h), NSS.red); else nssRR(x, y, w, h, h / 2, NSS.mist);
    const bx = x + h / 2, by = y + h / 2, br = h * 0.43;
    nssCirc(bx, by, br, o.hero ? NSS.white : NSS.badge);
    nssAt(bx, by, nssPop((o.t ?? 0) + 0.12), () => nssIcon(icon, bx, by, br * 0.5, o.hero ? NSS.red : NSS.white));
    nssText(label, x + h + 30, y + h / 2 + h * 0.15, h * 0.42, o.hero ? NSS.white : NSS.ink, { frac: nssDraw((o.t ?? 0) + 0.15, 0.4) });
  });
}
// a rounded bar chart rising from base by; vals 0..1; the last bar is the red one; o.trend draws a line through the tops
function nssChart(x, by, w, h, vals, p, o = {}) {
  const n = vals.length, gap = o.gap ?? 34, bw = (w - gap * (n - 1)) / n, cols = o.cols ?? [NSS.fog, NSS.steel, NSS.steelD, NSS.red];
  const tops = vals.map((v, i) => { const k = EZ.o3(clamp(p * (n + 1) * 0.6 - i * 0.6)), bh = h * v * k, bx = x + i * (bw + gap); nssRR(bx, by - bh, bw, bh, [16, 16, 4, 4], cols[i % cols.length]); return [bx + bw / 2, by - h * v - 60]; });
  if (o.trend) {
    const q = nssDraw(o.trend, 0.8); if (q <= 0) return;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = NSS_LINE; ctx.strokeStyle = NSS.steel; nssPath(subPath(tops, q), false); ctx.stroke(); ctx.restore();
    tops.forEach(([tx, ty], i) => { if (q * (n - 1) >= i - 0.05) nssCirc(tx, ty, (i === n - 1 ? 15 : 12) * nssPop(o.trend + i * 0.2), i === n - 1 ? NSS.red : NSS.steel); });
  }
}
// a dark device card: two pale lines and an amber light that blinks now and then
function nssDevice(x, y, w, h, p = 1) {
  if (p <= 0.001) return;
  nssIn(x + w / 2, y + h, p, () => {
    nssRR(x, y, w, h, h * 0.18, NSS.ink);
    nssRR(x + w * 0.2, y + h * 0.36, w * 0.42, h * 0.1, h * 0.05, NSS.fog); nssRR(x + w * 0.2, y + h * 0.55, w * 0.42, h * 0.1, h * 0.05, NSS.fog);
    nssCirc(x + w * 0.76, y + h * 0.41, h * 0.06 * (mod(TT, 1.6) < 0.8 ? 1 : 0.7), NSS.amber);
  });
}
// the hero arrow: a thick red arrow rising at 45° from its tail (x, y); the tail is cut flat (level with the ground),
// so it reads as the N's flag. len = the full length, th = the shaft's thickness, p = how far it has grown (0..1)
function nssArrowPts(x, y, len, th, p = 1) {
  const L = Math.max(th * 1.2, len * p), hl = th * 1.6, hw = th * 1.25, a = -Math.PI / 4, c = Math.cos(a), s = Math.sin(a);
  const loc = [[-th / 2, -th / 2], [L - hl, -th / 2], [L - hl, -hw], [L, 0], [L - hl, hw], [L - hl, th / 2], [th / 2, th / 2]];
  return loc.map(([u, v]) => [x + u * c - v * s, y + u * s + v * c]);
}
function nssArrow(x, y, len, th, p = 1, c = NSS.red) { if (p > 0.001) nssFill(nssArrowPts(x, y, len, th, p), c); }

// ---------------------------------------------------------------------
//  the diagonal wipe (the scene change): a red bar leads a Mist panel across the frame along the N's 45°, covers it at
//  tc (where the piece hard-cuts between eras), and carries on out. Drawn last, over captions, in screen space.
// ---------------------------------------------------------------------
function nssWipeAt(tc, d = 0.38) {
  const u = (TT - (tc - d)) / (2 * d); if (u <= 0 || u >= 1) return;
  const e = EZ.io(u), rs = 110, body = W + H + 40, c2 = lerp(-H - 10, 2 * W + H + 2 * rs + 50, e), c1 = c2 - rs, c0 = c1 - body;
  const band = (a, b, col) => nssFill([[a - 200, -200], [b - 200, -200], [b + H + 200, H + 200], [a + H + 200, H + 200]], col);
  ctx.save(); screen(); band(c0, c1 + 1, NSS.mist); band(c1, c2, NSS.red); ctx.restore();
}

// =====================================================================
//  STYLE — the renderer's hooks (styles/README.md has the contract)
// =====================================================================
const STYLE = {
  name: 'netsurit-soft',
  paper: NSS.white,
  backdrop(c) { fillAll(c); },
  window(P, key, src) { ctx.save(); nssPath(P, true); ctx.clip(); ctx.drawImage(src, 0, 0); ctx.restore(); },   // flat: no rim, no shadow
  blob(P, c) { nssFill(P, c); },
  hero(x, y, r) { nssCirc(x, y, r * 0.7, NSS.red); SPARK_AT = [x, y]; },
  heroColor: NSS.red,
  heroPts(x, y, r) { return ellipsePts(x, y, r * 0.7, r * 0.7, 0, 64); },
  post() { if (typeof NSS_WIPES !== 'undefined') NSS_WIPES.forEach((tc) => nssWipeAt(tc)); },
  ones: true,
};
