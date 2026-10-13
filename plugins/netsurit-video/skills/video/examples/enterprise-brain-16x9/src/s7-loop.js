// =====================================================================
//  ERA 7 — THE LOOP AND THE CLOSE (illustration on white). The hook's framing again, changed: the head is
//  saffron, the slot is a cream disc. "You" decide; the outcome flows back over the top of the head; bars
//  rise in the disc. The Librarian and the Clerk walk in and ask the brain first. A model chip on the left
//  loses value; saffron rings grow round the disc each quarter. "You" walk off; the head stays.
// =====================================================================
const LP = {
  decide: VW('r1', 'decide'), happens: VW('r1', 'happens'), flows: VW('r1', 'flows'), sharpens: VW('r1', 'sharpens'),
  librarian: VW('r2', 'librarian'), clerk: VW('r2', 'clerk'), stay: VW('r2', 'stay'), ask: VW('r2', 'ask'),
  rented: VW('e1', 'rented'), depreciate: VW('e1', 'depreciate'),
  owned: VW('e2', 'owned'), quarter: VW('e2', 'quarter'), compounds: VW('e2', 'compounds'),
  move: VW('e3', 'move'), stays: VE('e3', 'stays'),
};
function sceneLoop() {
  fillAll(IG.white);
  igFlow([[70, GROUND], [1850, GROUND]], 1, { arrows: 3, speed: 0.05 });
  const [hx, hy, hs] = HEAD0, [dx, dy, dr] = DISC0;
  // the outcome flows back: over the top of the head from "you" into the disc (behind the head)
  igFlow(igBez([1540, 560], [[[1570, 40], [dx + 260, -30], [dx + 20, dy - dr - 4]]], 40), igDraw(LP.flows, 1.0), { arrows: 3, speed: 0.18 });
  // the Librarian and the Clerk ask the brain: flows from them into the disc (behind the head)
  const ask = igDraw(LP.ask, 0.8);
  igFlow([[180, 650], [dx - dr - 20, dy + 40]], ask, { arrows: 2, speed: 0.2 });
  igFlow([[380, 720], [dx - dr, dy + 110]], ask, { arrows: 2, speed: 0.2, phase: 0.5 });
  // the head, now saffron; the cream disc, a network glowing inside it as memory compounds
  igAt(hx, hy + hs * 0.66, 1 + Math.sin(TT * 1.1) * 0.004, () => igHead(hx, hy, hs, { dir: -0.25 }));
  ctx.beginPath(); ctx.arc(dx, dy, dr, 0, TAU); ctx.fillStyle = IG.core; ctx.fill();
  const bars = clamp((TT - LP.sharpens) / 1.0);
  if (bars > 0) igBars(dx - 80, dy + 70, 160, 130, [0.35, 0.5, 0.72, 0.95], bars, { base: false, colors: [IG.white] });
  // each quarter, a ring: memory compounding
  for (let i = 0; i < 4; i++) {
    const k = igDraw(LP.quarter + i * 0.35, 0.5); if (k <= 0) continue;
    ctx.beginPath(); ctx.arc(dx, dy, dr + 16 + i * 18, -Math.PI / 2, -Math.PI / 2 + TAU * k); igLine(IG.core, 5); ctx.stroke();
  }
  if (TT > LP.owned) { ctx.save(); ctx.beginPath(); ctx.arc(dx, dy, dr - 4, 0, TAU); ctx.clip(); igNetwork(dx, dy - 20, dr * 0.75, dr * 0.45, igDraw(LP.owned, 1.2), { key: 'mem', n: 18, glow: '255,255,255' }); ctx.restore(); }
  // "you" on the right: decide, see what happened, then move on (walks off right)
  const yx = springMove(LP.move, 1600, 2150, SPRING.heavy);
  igPerson(yx, GROUND, 330, { key: 'you', look: TT > LP.move ? 1 : -1 });
  const gone = 1 - igDraw(LP.librarian - 0.3, 0.3);
  ebBubble(1300, 300, 320, 92, igPop(LP.decide) * gone, '✓ Decided', 36, { tail: 1 });
  ebBubble(1560, 410, 300, 92, igPop(LP.happens) * gone, '★ Outcome', 36, { tail: 1 });
  // the Librarian and the Clerk walk in from the left and stay
  const lx = springMove(LP.librarian - 0.2, -200, 160, SPRING.smooth), cx = springMove(LP.clerk - 0.2, -200, 345, SPRING.smooth);
  igPerson(lx, GROUND, 280, { key: 'librarian', look: 1 });
  ebClerk(cx, GROUND, 280, { look: 1 });
  ebBubble(120, 360, 150, 84, igPop(LP.ask) * (1 - igDraw(LP.rented - 0.4, 0.3)), '?', 56, { tail: 1, font: IGHEAD });
  // the model chip: rented, its value bar falls
  const mp = igSettle(LP.rented - 0.3);
  if (mp > 0.001) igAt(1380, 220, mp, () => {
    const x = 1290, y = 140, w = 200, h = 150;
    for (let i = 0; i < 4; i++) { igFill(rrectPts(x + 30 + i * 42, y - 14, 12, 18, 3, 2), IG.lav); igFill(rrectPts(x + 30 + i * 42, y + h - 4, 12, 18, 3, 2), IG.lav); }
    igFill(rrectPts(x, y, w, h, 18, 4), IG.indigo);
    igText('MODEL', x + w / 2, y + 58, 30, IG.white, { align: 'center', weight: 700, font: IGHEAD, track: 3 });
    const v = 1 - 0.75 * EZ.io(clamp((TT - LP.depreciate + 0.2) / 1.2));
    igFill(rrectPts(x + 26, y + 92, w - 52, 18, 9, 3), IG.navyT);
    igFill(rrectPts(x + 26, y + 92, (w - 52) * v, 18, 9, 3), IG.lav);
    igText('rented', x + w / 2, y + h + 44, 26, IG.textD, { align: 'center', weight: 600 });
  });
  if (TT > LP.owned - 0.3) igText('owned', dx, dy + dr + 110, 30, IG.white, { align: 'center', weight: 700, frac: igDraw(LP.owned, 0.5) });
  if (TT >= LP.stays + 0.4 && TT < DURATION) igCaption([{ s: 'The Enterprise Brain', weight: 700 }, { s: '  ·  memory that compounds', c: IG.tealT }], { y: CAP_Y, at: LP.stays + 0.4 - E0, size: 52 });
  if (TT >= DURATION - 0.3) nsEndCard(DURATION - 0.3);
}
