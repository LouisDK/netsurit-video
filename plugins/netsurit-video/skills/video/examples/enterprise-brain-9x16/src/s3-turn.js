// =====================================================================
//  ERA 3 — THE TURN (sheet on wash, 9:16: the two rooms stacked, the slot between them). "Words in one room. Numbers in another."
//  Two rooms side by side: the Librarian's documents and the Clerk's rows, each with its keeper. On "missing"
//  they slide apart and an empty slot glows between them: what we believe, and why. Then the score stops
//  and the picture holds; the slot becomes the saffron head on the hit.
// =====================================================================
const TN = {
  words: VW('t1', 'words'), numbers: VW('t1', 'numbers'), missing: VW('t2', 'missing'),
  believes: VW('t2', 'believes'), why: VW('t2', 'why'),
};
const TURN_L = { x: 110, y: 290, w: 860, h: 400 }, TURN_R = { x: 110, y: 1210, w: 860, h: 400 };   // stacked: words above, numbers below
const SLOT = [540, 900, 120];
function tnRoom(R, dy, kind, t) {
  const x = R.x, y = R.y + dy;
  igCard(x, y, R.w, R.h, 1, { r: 24 });
  igHeader(x, y, R.w, 76, 1, { r: 24, label: kind === 'w' ? 'WORDS' : 'NUMBERS', icon: kind === 'w' ? 'doc' : 'db' });
  if (kind === 'w') {
    for (let i = 0; i < 6; i++) ebDoc(x + 250 + (i % 2) * 290, y + 100 + Math.floor(i / 2) * 96, 260, 82, 1, ['mail', 'doc', 'people', 'ticket', 'doc', 'mail'][i]);
    igPerson(x + 120, y + R.h - 26, 270, { key: 'librarian', look: 1 });
  } else {
    ebGrid(x + 30, y + 100, 580, 14, 20, 1);
    ebClerk(x + R.w - 120, y + R.h - 26, 270, { look: -1 });
  }
  // the room's word pulses when it's spoken
  const k = Math.exp(-Math.max(0, TT - t) * 4) * (TT > t ? 1 : 0);
  if (k > 0.01) { igPath(rrectPts(x - 8, y - 8, R.w + 16, R.h + 16, 30, 5), true); igLine(IG.teal, 5 * k); ctx.stroke(); }
}
function sceneTurn() {
  igWash();
  const apart = igSettle(TN.missing - 0.2);
  tnRoom(TURN_L, -apart * 80, 'w', TN.words);
  tnRoom(TURN_R, apart * 80, 'n', TN.numbers);
  // the empty slot: a soft glow, a dashed ring turning slowly, nothing inside
  const sp = igSettle(TN.missing);
  if (sp > 0.001) {
    const [x, y, r] = SLOT;
    ctx.save(); ctx.globalAlpha *= clamp(sp);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 1.6);
    g.addColorStop(0, 'rgba(244,54,76,0.12)'); g.addColorStop(1, 'rgba(255,255,255,0)');   // the slot glows faintly red: the core to come
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 1.6, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, r * sp, 0, TAU); ctx.fillStyle = IG.washD; ctx.fill();
    ctx.setLineDash([14, 12]); ctx.lineDashOffset = -TT * 10; ctx.beginPath(); ctx.arc(x, y, r * sp + 14, 0, TAU); igLine(IG.navy, 3); ctx.stroke();
    ctx.restore();
  }
  igTitle([{ s: 'What we believe', c: IG.navyT }], CX, 1112, 64, igDraw(TN.believes - 0.3, 0.6));
  igTitle([{ s: 'and why', c: IG.tealT }], CX, 1190, 64, igDraw(TN.why - 0.1, 0.5));
}
