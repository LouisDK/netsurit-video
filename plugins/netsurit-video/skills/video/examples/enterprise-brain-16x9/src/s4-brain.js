// =====================================================================
//  ERA 4 — THE BRAIN ARRIVES (illustration on white). Opens on the hit: the slot has become the saffron head.
//  "It watches the work you already do": the same five facts as the hook return, and this time their flow
//  lines reach the head (drawn behind it, arrowheads travelling in); checks pop in the cream disc as they
//  land. "Like a good notebook…": a notebook beside the head fills its own pages — nobody holds the pen.
// =====================================================================
const BR = {
  keeps: VW('b1', 'keeps'), watches: VW('b2', 'watches'), already: VW('b2', 'already'),
  notebook: VW('b2', 'notebook'), richer: VW('b2', 'richer'), nobody: VW('b2', 'nobody'),
};
const HEADB = [860, 485, 680];
const DISCB = [HEADB[0] + 0.053 * HEADB[2], HEADB[1] - 0.066 * HEADB[2], 0.224 * HEADB[2]];
const BR_FACTS = [[170, 250, 'mail'], [120, 520, 'people'], [220, 800, 'db'], [1330, 160, 'doc'], [1390, 430, 'ticket']];
function sceneBrain() {
  fillAll(IG.white);
  igFlow([[70, GROUND], [1850, GROUND]], 1, { arrows: 3, speed: 0.05 });
  // the facts arrive and their flows reach the disc (drawn first, so they pass behind the head)
  BR_FACTS.forEach(([x, y, ic], i) => {
    const t = BR.watches + i * 0.25, fp = igDraw(t + 0.2, 0.9);
    const mx = lerp(x, DISCB[0], 0.5), my = lerp(y, DISCB[1], 0.5) + (i % 2 ? -50 : 50);
    igFlow([[x, y], [mx, my], [DISCB[0], DISCB[1]]], fp, { arrows: 2, speed: 0.25, phase: i * 0.2 });
  });
  // the head, with grain; a slow breath
  const br = 1 + Math.sin(TT * 1.1) * 0.004;
  igAt(HEADB[0], HEADB[1] + HEADB[2] * 0.66, br, () => igHead(HEADB[0], HEADB[1], HEADB[2], { dir: -0.25 }));
  // the cream disc: a donut of what it holds grows as each fact lands, checks pop round it
  ctx.beginPath(); ctx.arc(DISCB[0], DISCB[1], DISCB[2], 0, TAU); ctx.fillStyle = IG.core; ctx.fill();
  const held = clamp((TT - BR.watches - 0.8) / 2.2);
  if (held > 0) igDonut(DISCB[0], DISCB[1], 62, 112, [[0.28, IG.white], [0.14, IG.coreL], [0.2, NS.charcoal], [0.12, IG.white], [0.26, IG.coreL]], held, -Math.PI / 2 + TT * 0.2);
  [[-150, -90, IG.core], [-165, 40, IG.peri], [150, -120, IG.core]].forEach(([dx, dy, c], i) => igCheck(DISCB[0] + dx, DISCB[1] + dy, 24, c, igPop(BR.watches + 1.0 + i * 0.25)));
  BR_FACTS.forEach(([x, y, ic], i) => ebFact(x, y, ic, igPop(BR.watches + i * 0.25 - 0.4), i));
  // gears turning at the back of the head
  const gp = igPop(BR.keeps);
  igAt(1180, 640, gp, () => { igGear(1180, 640, 54, 9, TT * 0.9, { fill: IG.peri }); igGear(1250, 700, 32, 7, -TT * 1.5, { fill: IG.lav }); });
  // the notebook: a periwinkle book on the ground that fills its own pages; no hand, no pen
  const np = igSettle(BR.notebook - 0.3);
  if (np > 0.001) {
    const x = 1420, y = 640 + (1 - np) * 60, w = 360, h = 250;
    ctx.save(); ctx.globalAlpha *= clamp(np * 2);
    igFill(rrectPts(x - 10, y - 10, w + 20, h + 20, 14, 3), IG.indigo);
    igFill(rrectPts(x, y, w / 2 - 6, h, 8, 3), IG.white); igFill(rrectPts(x + w / 2 + 6, y, w / 2 - 6, h, 8, 3), IG.white);
    const fill = clamp((TT - BR.richer + 0.3) / 2.6);
    for (let i = 0; i < 14; i++) {
      const k = clamp(fill * 14 - i); if (k <= 0) break;
      const col = i < 7 ? 0 : 1, row = i % 7, lx = x + 18 + col * (w / 2 + 6), ly = y + 26 + row * 32;
      igFill(rrectPts(lx, ly, (w / 2 - 42) * [1, 0.8, 0.9, 0.6, 1, 0.7, 0.85][row] * EZ.o3(k), 10, 5, 2), i % 5 === 3 ? IG.core : IG.lav);
    }
    ctx.restore();
  }
  // "nobody has to write it": the pen lies idle on the ground beside the book
  const pp = igPop(BR.nobody);
  igAt(1600, 915, pp, () => { ctx.save(); ctx.translate(1600, 915); ctx.rotate(-0.12); igFill(rrectPts(-80, -8, 150, 16, 8, 3), IG.ink); igFill([[70, -8], [96, 0], [70, 8]], IG.cream); ctx.restore(); });
  igCaption([{ s: 'An enterprise brain keeps ' }, { s: 'beliefs.', c: IG.tealT, weight: 700 }], { y: CAP_Y, at: BR.keeps - E0 - 0.2 });
}
