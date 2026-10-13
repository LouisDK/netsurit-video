// =====================================================================
//  SCENES — the starter's three eras. World units = px on the frame (1080x1920 or 1920x1080).
//  LAY holds every position, one arrangement per shape (9:16 stacks, 16:9 sits side by side); scenes read only LAY. (Not "L": the engine uses that name inside the score.)
//  Cues come from the voice (VW / VE / VL in the head), so re-takes and script edits move the picture with them.
// =====================================================================
const LAY = PORTRAIT ? {
  ground: 1440,
  head0: [560, 1004, 660],                               // the hollow head (problem)
  facts: [[150, 500, 'mail'], [130, 800, 'people'], [150, 1130, 'db'], [930, 600, 'doc'], [965, 900, 'ticket']],
  you: [958, 300],                                       // "you": x, height (stands on the ground)
  ask: { x: 640, y: 250, w: 320, h: 160 },               // the "?" bubble (bridge -> the card)
  card: { x: 90, y: 520, w: 900, h: 760 },               // the sheet's card
  row0: 210, rowH: 128, val: 300, text: 32,              // card rows: first baseline (from the card's top), pitch, value column, size
  src: [[250, 1410, 'mail'], [540, 1410, 'people'], [830, 1410, 'db']],   // source badges under the card
  headB: [520, 960, 720],                                // the filled head (payoff)
  factsB: [[130, 450, 'mail'], [105, 790, 'people'], [125, 1170, 'db'], [900, 420, 'doc'], [960, 760, 'ticket']],
} : {
  ground: 860,                                           // clear of the lower third (y 966) and the caption (y 1018), even zoomed
  head0: [760, 450, 620],
  facts: [[330, 250, 'mail'], [290, 500, 'people'], [360, 730, 'db'], [1190, 260, 'doc'], [1250, 560, 'ticket']],
  you: [1520, 290],
  ask: { x: 1290, y: 250, w: 300, h: 150 },
  card: { x: 660, y: 250, w: 840, h: 640 },
  row0: 196, rowH: 112, val: 280, text: 30,
  src: [[340, 400, 'mail'], [340, 570, 'people'], [340, 740, 'db']],     // source badges left of the card
  headB: [900, 450, 620],
  factsB: [[300, 230, 'mail'], [260, 470, 'people'], [330, 710, 'db'], [1460, 230, 'doc'], [1520, 520, 'ticket']],
};
const CORE0 = nsCore(...LAY.head0), COREB = nsCore(...LAY.headB);

// ---- era 0: the problem (illustration on white). The facts exist; their links never reach the empty core.
const P0 = { facts: VW('l1', 'every'), reach: VW('l1', 'already'), none: VW('l1', 'nothing'), ask: VW('l1', 'nothing') - 0.2 };   // the "?" must be up >= 1 s before the bridge shrinks it (M1 - 0.6)
function sceneProblem() {
  fillAll(IG.white);
  nsLowerThird({ out: M1 - 0.9 });   // the byline opens the piece (keep the bottom-left corner clear while it shows)
  igFlow([[50, LAY.ground], [W - 50, LAY.ground]], 1, { arrows: 2, speed: 0.03 });
  const br = 1 + Math.sin(TT * 1.1) * 0.004;
  igAt(LAY.head0[0], LAY.head0[1] + LAY.head0[2] * 0.66, br, () => nsHollowHead(...LAY.head0));
  LAY.facts.forEach(([x, y, ic], i) => {
    const p = igPop(P0.facts + i * 0.12), q = nsFact(x, y, ic, p, i);
    if (p > 0.5) {
      const dx = CORE0[0] - q[0], dy = CORE0[1] - q[1], d = Math.hypot(dx, dy);
      const a = [q[0] + dx / d * 62, q[1] + dy / d * 62], b = [q[0] + dx * 0.55, q[1] + dy * 0.55];
      const reach = igDraw(P0.reach + i * 0.1, 1.0), fade = 1 - 0.6 * igDraw(P0.none, 0.8);
      nsDash([a, b], reach, { c: IG.lav, alpha: fade });
    }
  });
  igPerson(LAY.you[0], LAY.ground, LAY.you[1], { key: 'you', look: -1, hop: P0.none + 0.1 });
  nsBubble(LAY.ask.x, LAY.ask.y, LAY.ask.w, LAY.ask.h, igPop(P0.ask), '?', PORTRAIT ? 120 : 110, { tail: 1, font: IGHEAD });
}

// ---- era 1: the sheet (infographic on Mist). One card per fact: what, where from, how sure, still true?
const ROWS = [
  ['Fact', 'Northwind opens a Lisbon office'],
  ['Source', 'Email, 12 March'],
  ['Confidence', ['Likely', 'y']],
  ['Status', ['Current', 'g']],
];
const P1 = { title: M1 + 0.5, header: M1 + 0.8, rows: [VW('l2', 'card'), VW('l2', 'source'), VW('l2', 'sure'), VE('l2', 'sure') + 0.25], src: VW('l2', 'source') };
function sceneSheet() {
  igWash();
  nsTitle('One fact, ', 'one home', 'Every fact keeps its source', P1.title);
  const C = LAY.card;
  igCard(C.x, C.y, C.w, C.h, 1, { r: 26 });
  igHeader(C.x, C.y, C.w, 110, igDraw(P1.header, 0.4), { r: 26, label: 'FACT CARD', icon: 'brain' });
  ROWS.forEach(([label, val], i) => {
    const y = C.y + LAY.row0 + i * LAY.rowH, p = igDraw(P1.rows[i], 0.5);
    if (p <= 0) return;
    igText(label, C.x + 44, y, LAY.text, IG.navyT, { weight: 700, frac: p });
    if (typeof val === 'string') igText(val, C.x + LAY.val, y, LAY.text, IG.text, { frac: igDraw(P1.rows[i] + 0.15, 0.5) });
    else igPill(val[0], C.x + LAY.val, y, LAY.text - 2, val[1], igPop(P1.rows[i]));
    if (i < ROWS.length - 1) { igPath([[C.x + 40, y + 50], [C.x + 40 + (C.w - 80) * p, y + 50]], false); igLine(IG.rule, 2); ctx.stroke(); }
  });
  // the sources: badges joined into one bus and a chevron into the card (the email badge is the one in use: red)
  LAY.src.forEach(([x, y, ic], i) => {
    const p = igPop(P1.src + i * 0.12);
    igBadge(x, y, PORTRAIT ? 44 : 38, ic, p, { fill: i === 0 ? IG.teal : IG.navy });
    const path = PORTRAIT ? [[x, y - 50], [x, C.y + C.h + 40], [CX, C.y + C.h + 40]] : [[x + 44, y], [x + 150, y], [x + 150, 570], [C.x - 60, 570]];
    igConnector(path, igDraw(P1.src + 0.2 + i * 0.1, 0.4), { dots: 'none', w: 3 });
  });
  const cv = igDraw(P1.src + 0.6, 0.4);
  if (PORTRAIT) { ctx.save(); ctx.translate(CX, C.y + C.h + 22); ctx.rotate(-Math.PI / 2); igChevron(0, 0, 40, cv); ctx.restore(); }
  else igChevron(C.x - 30, 570, 40, cv);
  nsCaption([[{ s: 'One card per fact,' }], [{ s: 'with its ' }, { s: 'source.', c: IG.tealT, weight: 700 }]], { at: P1.header - E0 });
}

// ---- era 2: the payoff (illustration on white). The head arrives charcoal with a red core; the same facts flow in.
const P2 = { remembers: VW('l3', 'remembers'), answer: VW('l3', 'answer'), knows: VW('l3', 'knows') };
function scenePayoff() {
  fillAll(IG.white);
  igFlow([[50, LAY.ground], [W - 50, LAY.ground]], 1, { arrows: 2, speed: 0.05 });
  LAY.factsB.forEach(([x, y], i) => {
    const fp = igDraw(P2.remembers + i * 0.2 + 0.2, 0.9);
    const mx = lerp(x, COREB[0], 0.5), my = lerp(y, COREB[1], 0.5) + (i % 2 ? -50 : 50);
    igFlow([[x, y], [mx, my], [COREB[0], COREB[1]]], fp, { arrows: 2, speed: 0.25, phase: i * 0.2 });
  });
  const br = 1 + Math.sin(TT * 1.1) * 0.004;
  igAt(LAY.headB[0], LAY.headB[1] + LAY.headB[2] * 0.66, br, () => igHead(LAY.headB[0], LAY.headB[1], LAY.headB[2], { dir: -0.25 }));
  ctx.beginPath(); ctx.arc(COREB[0], COREB[1], COREB[2], 0, TAU); ctx.fillStyle = IG.core; ctx.fill();
  const held = clamp((TT - P2.remembers - 0.6) / 2.4);
  if (held > 0) igDonut(COREB[0], COREB[1], COREB[2] * 0.4, COREB[2] * 0.72, [[0.28, IG.white], [0.14, IG.coreL], [0.2, NS.charcoal], [0.12, IG.white], [0.26, IG.coreL]], held, -Math.PI / 2 + TT * 0.2);
  [[-1.0, -0.6, IG.core], [-1.1, 0.3, IG.peri], [1.0, -0.8, IG.core]].forEach(([dx, dy, c], i) =>
    igCheck(COREB[0] + dx * COREB[2] * 0.95, COREB[1] + dy * COREB[2] * 0.95, 24, c, igPop(P2.answer + i * 0.2)));
  LAY.factsB.forEach(([x, y, ic], i) => nsFact(x, y, ic, igPop(P2.remembers + i * 0.2 - 0.3), i));
  // (captions stop once the end card is opaque: text under it still counts as overlapping for the review)
  if (TT < DURATION + 0.3) nsCaption([[{ s: 'Now the company' }], [{ s: 'remembers.', c: IG.tealT, weight: 700 }]], { at: P2.remembers - E0 - 0.2 });
  nsEndCard(DURATION - 0.3);
}
