// =====================================================================
//  ERA 1 — THE LIBRARIAN (sheet on wash, 9:16: the sources above, the answer card below). An assistant over your files, email, chats and meetings.
//  The answer card is there from the morph. The Librarian (periwinkle, a key on a ring) settles in; eight
//  sources pop in; it lights the first three and the rest drop below the line; on its answer card a scale
//  weighs an old "happy" note against a new "leaving" ticket and levels: both weigh the same. Tomorrow the
//  calendar flips and the answer empties. "Private to you." Band: WORDS, NOT BELIEFS.
// =====================================================================
const LB = {
  title: M_LIB + 0.55, who: VW('l1', 'librarian'), docs: VW('l1', 'every'),
  email: VW('l2', 'email'), chats: VW('l2', 'chats'), meet: VW('l2', 'meeting'), fast: VW('l2', 'fast'),
  first: VW('l3', 'first'), rest: VW('l3', 'rest'),
  old: VW('l4', 'old'), newer: VW('l4', 'newer'), same: VW('l4', 'both'),
  tomorrow: VW('l5', 'tomorrow'), scratch: VW('l5', 'scratch'), you: VW('l5', 'you'),
  band: VW('l6', 'words'),
};
const LB_DOCS = ['mail', 'doc', 'people', 'ticket', 'doc', 'mail', 'people', 'doc'];
const LB_LIT = [0, 2, 5];
const LB_POS = (i) => [345 + (i % 3) * 228, 470 + Math.floor(i / 3) * 130];   // 3 columns: rows of 3, 3, 2
const LB_DOC = [205, 104];   // a source card's size
const LB_ME = [175, 1090, 380];   // the Librarian: x, feet y, height
function sceneLibrarian() {
  igWash();
  ebTitle('The ', 'Librarian', ['An assistant over your files,', 'email, chats and meetings'], LB.title);
  const reset = igDraw(LB.scratch, 0.6);           // tomorrow: it starts from scratch
  // the Librarian settles in on the left, a key ring at its hand
  const lp = igSettle(LB.who - 0.4);
  const [mx, my, ms] = LB_ME, u = ms / 340;
  igAt(mx, my, lp, () => {
    igPerson(mx, my, ms, { key: 'librarian', look: 1 });
    ebKey(mx + 88 * u, my - 152 * u, 50, Math.sin(TT * 2.2) * 0.12);
  });
  // the sources: pop in, the named kinds pulse, the first three light, the rest drop below the line and dim
  const drop = igSettle(LB.rest), litK = igDraw(LB.first, 0.4) * (1 - reset);
  const pulse = (i) => { const k = LB_DOCS[i]; const t = k === 'mail' ? LB.email : k === 'people' ? LB.meet : k === 'ticket' ? LB.chats : LB.fast; return Math.exp(-Math.max(0, TT - t) * 5) * (TT > t ? 1 : 0); };
  LB_DOCS.forEach((ic, i) => {
    const [x, y0] = LB_POS(i), lit = LB_LIT.includes(i);
    const y = y0 + (lit ? 0 : drop * 290);
    const s = 1 + pulse(i) * 0.06;
    igAt(x + LB_DOC[0] / 2, y + LB_DOC[1] / 2, s, () => ebDoc(x, y, LB_DOC[0], LB_DOC[1], igPop(LB.docs + i * 0.08), ic, { lit: lit ? litK : 0, dim: lit ? 0 : drop }));
  });
  // the line nothing below reaches across
  if (drop > 0.01) {
    ebDash([[335, 738], [335 + 680 * igDraw(LB.rest, 0.6), 738]], 1, { c: IG.textD, dash: [8, 10], speed: 0 });
    igText('the rest never reach the page', 345, 778, 28, IG.textD, { weight: 600, frac: igDraw(LB.rest + 0.3, 0.6) });
  }
  // connectors: the Librarian reaches every source fast, then only the lit three
  const reachAll = igDraw(LB.fast - 0.2, 0.4) * (1 - igDraw(LB.first, 0.3));
  LB_DOCS.forEach((_, i) => {
    const [x, y] = LB_POS(i), lit = LB_LIT.includes(i);
    const k = lit ? Math.max(reachAll, litK) : reachAll;
    const hx = LB_ME[0] + 128, hy = LB_ME[1] - 200, cy = y + LB_DOC[1] / 2;
    if (k > 0.01) igConnector([[hx, hy], [318, hy], [318, cy], [x - 6, cy]], k, { dots: 'end', w: 2.5, c: lit && litK > 0 ? IG.peri : IG.navy });
  });
  // the answer card (from the morph): header, "based on 3 documents", the scale
  igCard(ANSWER.x, ANSWER.y, ANSWER.w, ANSWER.h, 1, { r: 24 });
  igHeader(ANSWER.x, ANSWER.y, ANSWER.w, 84, igDraw(LB.title + 0.2, 0.4), { r: 24, label: 'ANSWER', icon: 'search' });
  ctx.save(); ctx.globalAlpha *= 1 - reset;
  const bp = igDraw(LB.first + 0.3, 0.5);
  if (bp > 0) {
    LB_LIT.forEach((i, j) => igIcon(LB_DOCS[i], ANSWER.x + 62 + j * 62, ANSWER.y + 138, 42, IG.peri, { w: 9 }));
    igText('Based on 3 documents', ANSWER.x + 250, ANSWER.y + 151, 34, IG.text, { weight: 600, frac: bp });
    igPath([[ANSWER.x + 36, ANSWER.y + 186], [ANSWER.x + ANSWER.w - 36, ANSWER.y + 186]], false); igLine(IG.rule, 2); ctx.stroke();
  }
  // the scale: tips toward whichever card lands, then levels — both weigh the same
  const sp = igPop(LB.old - 0.3);
  if (sp > 0.001) {
    const cx = ANSWER.x + ANSWER.w / 2, top = ANSWER.y + 225, base = ANSWER.y + 450;
    const tilt = springTrack([[0, 0], [LB.old, 0.16], [LB.newer, -0.08], [LB.same, 0]], SPRING.playful);
    igAt(cx, base, sp, () => {
      igFill(rrectPts(cx - 7, top, 14, base - top, 6, 2), IG.navy);
      igFill(rrectPts(cx - 70, base - 8, 140, 16, 8, 2), IG.navy);
      ctx.beginPath(); ctx.arc(cx, top, 14, 0, TAU); ctx.fillStyle = IG.navy; ctx.fill();
      const arm = 250, ends = [-1, 1].map((d) => [cx + Math.cos(tilt) * arm * d, top + Math.sin(tilt) * arm * d]);
      igPath(ends, false); igLine(IG.navy, 8); ctx.stroke();
      // the two pans hang from the ends, each with its card
      [[LB.old, 'Note · March', 'Happy', 'g'], [LB.newer, 'Ticket · September', 'Leaving', 'y']].forEach(([t, lab, pill, kind], j) => {
        const [ex, ey] = ends[j], py = ey + 175;
        igPath([[ex - 110, py], [ex, ey], [ex + 110, py]], false); igLine(IG.ink, 2); ctx.stroke();
        igFill(rrectPts(ex - 128, py, 256, 14, 7, 2), IG.indigo);
        const cp = igPop(t);
        igAt(ex, py, cp, () => {
          igCard(ex - 120, py - 112, 240, 110, 1, { r: 14 });
          igText(lab, ex, py - 72, 25, IG.textD, { align: 'center', weight: 600 });
          const w = igW(pill, 28, { weight: 600 }) + 40;
          igPill(pill, ex - w / 2, py - 22, 28, kind, 1);
        });
      });
    });
    igText('Same weight', cx, ANSWER.y + ANSWER.h - 30, 36, IG.navyT, { align: 'center', weight: 700, frac: igDraw(LB.same + 0.2, 0.5) });
  }
  ctx.restore();
  // tomorrow: a calendar flips TUE -> WED and the answer is gone. It straddles the card's top-right corner,
  // over the empty end of the header, so it never covers "Based on 3 documents"
  const cp = igPop(LB.tomorrow - 0.4);
  if (cp > 0.001) {
    const x = ANSWER.x + ANSWER.w - 140, y = ANSWER.y - 58, flip = igDraw(LB.tomorrow, 0.35);
    igAt(x + 60, y + 50, cp, () => {
      igCard(x, y, 120, 104, 1, { r: 14, line: NS.steel, shadow: { blur: 18, dy: 6, c: 'rgba(20,18,18,0.28)' } });
      igFill(rrectPts(x, y, 120, 30, 14, 3), IG.peri);
      const sy = Math.abs(Math.cos(flip * Math.PI));
      ctx.save(); ctx.translate(x + 60, y + 72); ctx.scale(1, Math.max(0.05, sy));
      igText(flip < 0.5 ? 'TUE' : 'WED', 0, 14, 40, IG.navyT, { align: 'center', weight: 700, font: IGHEAD });
      ctx.restore();
    });
  }
  // "it remembers for you, not for the company"
  const yp = igPop(LB.you);
  if (yp > 0.001) { const w = igW('Private to you', 28, { weight: 600 }) + 40; igPill('Private to you', LB_ME[0] - w / 2, LB_ME[1] - LB_ME[2] - 78, 28, 'b', yp); }
  ebBand('WORDS, NOT BELIEFS', 1600, igPop(LB.band, { k: 200, damp: 0.6 }));
}
