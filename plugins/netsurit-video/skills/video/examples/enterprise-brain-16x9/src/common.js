// =====================================================================
//  COMMON — shared geometry and piece helpers (prefixed eb). World units = px on the 1920x1080 frame.
//  Every scene reads these; bridges reference the same rectangles, so the morph ends match the scenes.
// =====================================================================
const GROUND = 935;
const CAP_Y = 1018;                                   // caption baseline (inside the 16:9 safe area)
const HEAD0 = [760, 505, 640];                         // the head in profile: centre x, centre y, height (hook + loop)
const DISC0 = [HEAD0[0] + 0.053 * HEAD0[2], HEAD0[1] - 0.066 * HEAD0[2], 0.224 * HEAD0[2]];   // the slot / cream disc inside it
const ASK = { x: 1290, y: 290, w: 300, h: 150 };        // the hook's "?" bubble (bridge -> the Librarian's answer card)
const ANSWER = { x: 1270, y: 245, w: 560, h: 560 };     // the Librarian's answer card
const LEDGER = { x: 560, y: 235, w: 760, h: 640 };      // the Clerk's ledger
const EMAIL = { x: 100, y: 255, w: 480, h: 360 };       // the claim sheet's email card
const CLAIM = { x: 720, y: 220, w: 600, h: 720 };       // the claim card

// a centred two-tone title with a grey subtitle (sheet mode)
function ebTitle(a, b, sub, t0) {
  igTitle([{ s: a, c: IG.navyT }, { s: b, c: IG.tealT }], CX, 112, 72, igDraw(t0, 0.7));
  if (sub) igText(sub, CX, 162, 30, IG.textD, { align: 'center', frac: igDraw(t0 + 0.3, 0.7) });
}
// a speech bubble with words in it (illustration line-art: white fill, navy hairline); tail -1 left, 1 right
function ebBubble(x, y, w, h, p, text, size, o = {}) {
  if (p <= 0.001) return;
  igAt(x + w / 2, y + h, p, () => {
    const r = Math.min(h * 0.32, 40), tl = o.tail ?? 1, tx = tl < 0 ? x + w * 0.25 : x + w * 0.75;
    const P = rrectPts(x, y, w, h, r, 5);
    igFill(P, o.fill ?? IG.white); igPath(P, true); igLine(IG.ink, IG_HAIR); ctx.stroke();
    igPath([[tx - 14, y + h - 1], [tx + tl * 10, y + h + 26], [tx + 14, y + h - 1]], false); ctx.fillStyle = o.fill ?? IG.white; ctx.fill(); ctx.stroke();
    igText(text, x + w / 2, y + h / 2 + size * 0.36, size, o.c ?? IG.navyT, { align: 'center', weight: o.weight ?? 700, font: o.font, frac: clamp(p * 1.4 - 0.3) });
  });
}
// a dashed hairline along P, drawing on with p (illustration: a link that never arrives)
function ebDash(P, p, o = {}) {
  if (p <= 0) return;
  ctx.save(); ctx.setLineDash(o.dash ?? [10, 12]); ctx.lineDashOffset = -TT * (o.speed ?? 12);
  igPath(subPath(P, clamp(p)), false); igLine(o.c ?? IG.ink, o.w ?? IG_HAIR); ctx.globalAlpha *= o.alpha ?? 1; ctx.stroke();
  ctx.restore();
}
// the hollow head: the company's memory before it keeps beliefs — a dashed outline, an empty dashed slot
function ebHollowHead(x, y, s, o = {}) {
  const P = igHeadPts(x, y, s);
  igFill(P, o.fill ?? IG.washL);
  ctx.save(); ctx.setLineDash([16, 13]); igPath(P, true); igLine(IG.lav, IG_HAIR * 1.2); ctx.stroke();
  const [dx, dy, dr] = [x + 0.053 * s, y - 0.066 * s, 0.224 * s];
  ctx.setLineDash([12, 12]); ctx.lineDashOffset = -TT * 8; ctx.beginPath(); ctx.arc(dx, dy, dr, 0, TAU); igLine(IG.lav, IG_HAIR); ctx.stroke();
  ctx.restore();
  return P;
}
// a fact token in the illustration: a cream disc with an indigo line icon; bobs gently
function ebFact(x, y, icon, p, key) {
  if (p <= 0.001) return [x, y];
  const by = y + Math.sin(TT * 1.3 + key * 1.7) * 6;
  igAt(x, by, p, () => {
    ctx.beginPath(); ctx.arc(x, by, 50, 0, TAU); ctx.fillStyle = IG.wash; ctx.fill();
    igIcon(icon, x, by, 56, IG.indigo, { w: 7 });
  });
  return [x, by];
}
// a small sheet card holding one source: icon + two skeleton lines; o.lit rings it navy, o.dim greys it
function ebDoc(x, y, w, h, p, icon, o = {}) {
  if (p <= 0.001) return;
  ctx.save(); ctx.globalAlpha *= 1 - 0.55 * (o.dim ?? 0);
  igCard(x, y, w, h, p, { r: 16 });
  const k = clamp(p * 1.5);
  igIcon(icon, x + 42, y + h / 2, 44, o.dim > 0.5 ? IG.textD : IG.navy, { w: 8 });
  igSkel(x + 78, y + h / 2 - 14, w - 100, 2, k, { h: 10, gap: 22 });
  if ((o.lit ?? 0) > 0) { igPath(rrectPts(x - 6, y - 6, w + 12, h + 12, 20, 5), true); igLine(IG.peri, 4 * o.lit); ctx.stroke(); }
  ctx.restore();
}
// a navy refrain band with centred tracked caps ("WORDS, NOT BELIEFS")
function ebBand(label, y, p, o = {}) {
  if (p <= 0.001) return;
  const size = o.size ?? 46, w = igW(label, size, { weight: 700, font: IGHEAD, track: size * 0.08 }) + 120, h = size * 1.9, x = CX - w / 2;
  igAt(CX, y, p, () => {
    igShadow(() => {
      const g = ctx.createLinearGradient(0, y - h / 2, 0, y + h / 2); g.addColorStop(0, IG.navy); g.addColorStop(1, IG.navyD);
      igPath(rrectPts(x, y - h / 2, w, h, h / 2, 5), true); ctx.fillStyle = g; ctx.fill();
    }, { blur: 24, dy: 8 });
    igText(label, CX, y + size * 0.36, size, IG.white, { align: 'center', weight: 700, font: IGHEAD, track: size * 0.08, frac: clamp(p * 1.5 - 0.3) });
  });
}
// a key on a ring (the Librarian's prop), navy flat
function ebKey(x, y, s, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s / 100, s / 100);
  ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); igLine(IG.ink, 7); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 52, 15, 0, TAU); ctx.fillStyle = IG.navy; ctx.fill();
  igFill(rrectPts(-4, 64, 8, 52, 3, 2), IG.navy); igFill(rrectPts(4, 96, 14, 7, 2, 2), IG.navy); igFill(rrectPts(4, 108, 10, 7, 2, 2), IG.navy);
  ctx.restore();
}
// a figure in another shirt colour (the Clerk wears indigo): igPerson reads IG.peri / IG.indigo, so swap them for one draw
function ebPersonAs(top, far, x, y, s, o) {
  const a = IG.peri, b = IG.indigo; IG.peri = top; IG.indigo = far;
  try { igPerson(x, y, s, o); } finally { IG.peri = a; IG.indigo = b; }
}
const ebClerk = (x, y, s, o) => ebPersonAs(NS.steel, '#7E878E', x, y, s, { key: 'clerk', ...o });   // the Clerk wears Steel
// a small grid of rows (the Clerk's ledger in miniature)
function ebGrid(x, y, w, rows, rh, p, o = {}) {
  for (let i = 0; i < rows; i++) {
    const k = clamp(p * rows - i); if (k <= 0) break;
    igFill(rrectPts(x, y + i * rh, w * k, rh - 6, 3, 2), i % 2 ? (o.c2 ?? IG.washL) : (o.c1 ?? IG.wash));
  }
}
