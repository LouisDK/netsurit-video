// =====================================================================
//  HELPERS — the piece-level pieces proven on "The Enterprise Brain" (prefixed ns), sized per shape.
//  Phone scale (9:16): body text >= 26 px, captions 54 px (two short lines), titles 84 px.
//  16:9: captions 46 px (one line), titles 72 px.
// =====================================================================
const CAP = PORTRAIT ? { y: 1590, dy: 70, size: 54 } : { y: 1018, dy: 0, size: 46 };
const TITLE = PORTRAIT ? { y: 290, size: 84, sub: 36 } : { y: 150, size: 72, sub: 30 };

// a caption: lines = [segs, segs] (each as igCaption takes them). 9:16: two lines, stacked; 16:9: joined on one line.
function nsCaption(lines, o = {}) {
  if (!PORTRAIT) return igCaption(lines.flatMap((segs, i) => i ? [{ s: ' ' }, ...segs] : segs), { size: CAP.size, ...o, y: o.y ?? CAP.y });
  lines.forEach((segs, i) => igCaption(segs, { size: CAP.size, ...o, y: (o.y ?? CAP.y) + i * CAP.dy, at: (o.at ?? 0.45) + i * 0.12 }));
}
// a centred two-tone title (black + red, sentence case) with a grey subtitle (sub: one line or an array of lines)
function nsTitle(a, b, sub, t0) {
  igTitle([{ s: a, c: IG.navyT }, { s: b, c: IG.tealT }], CX, TITLE.y, TITLE.size, igDraw(t0, 0.7));
  (Array.isArray(sub) ? sub : sub ? [sub] : []).forEach((s, i) => igText(s, CX, TITLE.y + TITLE.sub * 1.7 + i * TITLE.sub * 1.28, TITLE.sub, IG.textD, { align: 'center', frac: igDraw(t0 + 0.3 + i * 0.15, 0.7) }));
}
// a speech bubble with words in it (white fill, charcoal hairline); tail -1 left, 1 right
function nsBubble(x, y, w, h, p, text, size, o = {}) {
  if (p <= 0.001) return;
  igAt(x + w / 2, y + h, p, () => {
    const r = Math.min(h * 0.32, 40), tl = o.tail ?? 1, tx = tl < 0 ? x + w * 0.25 : x + w * 0.75;
    const P = rrectPts(x, y, w, h, r, 5);
    igFill(P, o.fill ?? IG.white); igPath(P, true); igLine(IG.ink, IG_HAIR); ctx.stroke();
    igPath([[tx - 14, y + h - 1], [tx + tl * 10, y + h + 26], [tx + 14, y + h - 1]], false); ctx.fillStyle = o.fill ?? IG.white; ctx.fill(); ctx.stroke();
    igText(text, x + w / 2, y + h / 2 + size * 0.36, size, o.c ?? IG.navyT, { align: 'center', weight: o.weight ?? 700, font: o.font, frac: clamp(p * 1.4 - 0.3) });
  });
}
// a dashed hairline along P, drawing on with p (a link that never arrives)
function nsDash(P, p, o = {}) {
  if (p <= 0) return;
  ctx.save(); ctx.setLineDash(o.dash ?? [10, 12]); ctx.lineDashOffset = -TT * (o.speed ?? 12);
  igPath(subPath(P, clamp(p)), false); igLine(o.c ?? IG.ink, o.w ?? IG_HAIR); ctx.globalAlpha *= o.alpha ?? 1; ctx.stroke();
  ctx.restore();
}
// the core inside a head at (x, y, s): [cx, cy, r] (the bridge object between the head and a card)
const nsCore = (x, y, s) => [x + 0.053 * s, y - 0.066 * s, 0.224 * s];
// the hollow head: memory before it keeps anything — a dashed Steel outline and an empty dashed core
function nsHollowHead(x, y, s, o = {}) {
  const P = igHeadPts(x, y, s);
  igFill(P, o.fill ?? IG.washL);
  ctx.save(); ctx.setLineDash([16, 13]); igPath(P, true); igLine(IG.lav, IG_HAIR * 1.2); ctx.stroke();
  const [dx, dy, dr] = nsCore(x, y, s);
  ctx.setLineDash([12, 12]); ctx.lineDashOffset = -TT * 8; ctx.beginPath(); ctx.arc(dx, dy, dr, 0, TAU); igLine(IG.lav, IG_HAIR); ctx.stroke();
  ctx.restore();
  return P;
}
// a fact token: a Mist disc with a charcoal line icon; bobs gently. Returns where it is now.
function nsFact(x, y, icon, p, key, r = PORTRAIT ? 50 : 44) {
  if (p <= 0.001) return [x, y];
  const by = y + Math.sin(TT * 1.3 + key * 1.7) * 6;
  igAt(x, by, p, () => {
    ctx.beginPath(); ctx.arc(x, by, r, 0, TAU); ctx.fillStyle = IG.wash; ctx.fill();
    igIcon(icon, x, by, r * 1.12, IG.indigo, { w: 7 });
  });
  return [x, by];
}
// a refrain band: charcoal, centred tracked caps ("WORDS, NOT BELIEFS")
function nsBand(label, y, p, o = {}) {
  if (p <= 0.001) return;
  const size = o.size ?? (PORTRAIT ? 50 : 44), w = igW(label, size, { weight: 700, font: IGHEAD, track: size * 0.08 }) + 120, h = size * 1.9, x = CX - w / 2;
  igAt(CX, y, p, () => {
    igShadow(() => { igPath(rrectPts(x, y - h / 2, w, h, h / 2, 5), true); ctx.fillStyle = IG.navy; ctx.fill(); }, { blur: 24, dy: 8 });
    igText(label, CX, y + size * 0.36, size, IG.white, { align: 'center', weight: 700, font: IGHEAD, track: size * 0.08, frac: clamp(p * 1.5 - 0.3) });
  });
}
