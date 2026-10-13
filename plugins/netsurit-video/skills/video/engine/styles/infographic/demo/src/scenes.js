// =====================================================================
//  SCENES — infographic demo. World units = px (1080x1920); time TT on 1s; every pop settles on a spring.
//  Content kept inside x 40-940, y 250-1500 (SAFE).
// =====================================================================
const cu = TIMELINE.cues;
const HEAD = [520, 900, 760];          // the head in profile: centre x, centre y, height
const DISC = [560, 850, 170];          // the cream disc inside it (the bridge object)
const CARD = { x: 230, y: 690, w: 600, h: 700 };   // the knowledge card (the bridge's other end)
const GROUND = 1410;

// ---- era 1: a head full of knowledge (flat illustration on white)
function sceneMind() {
  fillAll(IG.white);
  igTag(1, 'What a team knows');
  const fl = igDraw(cu.flows, 0.9);
  // flow loops behind the head: hairlines with hollow arrowheads travelling along them
  igFlow([[430, 610], [210, 610], ...ellipsePts(210, 780, 170, 170, 0, 40, -Math.PI / 2, -Math.PI * 1.5).slice(1), [210, 950], [400, 950]], fl, { arrows: 2, speed: 0.12 });
  igFlow([[60, GROUND], [940, GROUND]], fl, { arrows: 3, speed: 0.08, phase: 0.1 });
  // the head rises in on a settle; speckled grain toward the back of the skull
  const hs = igSettle(cu.head), hy = HEAD[1] + (1 - hs) * 260;
  if (hs > 0.001) { ctx.save(); ctx.globalAlpha = clamp(hs * 2); igHead(HEAD[0], hy, HEAD[2], { dir: -0.25 }); ctx.restore(); }
  // the cream disc and its donut chart, turning slowly
  const dp = igPop(cu.disc);
  igAt(DISC[0], DISC[1], dp, () => {
    ctx.beginPath(); ctx.arc(DISC[0], DISC[1], DISC[2], 0, TAU); ctx.fillStyle = IG.cream; ctx.fill();
    igDonut(DISC[0], DISC[1], 70, 122, [[0.28, IG.peri], [0.14, IG.lav], [0.2, IG.ink], [0.12, IG.peri], [0.26, IG.indigo]], igDraw(cu.donut, 0.9), -Math.PI / 2 + TT * 0.25);
  });
  // circuit traces off the crown, the bar chart top right on its own flow line
  igCircuit(560, 470, [90, 130, 110, 70], igDraw(cu.flows + 0.2, 0.8), { gap: 28, bend: 10 });
  igFlow([[660, 470], [920, 470]], fl, { arrows: 1, speed: 0.15, phase: 0.4 });
  igBars(700, 470, 200, 160, [0.35, 0.55, 0.78, 1.0], 1, { t0: cu.bars, base: false });
  // gears: filled periwinkle pair bottom left; outline pair right
  const gp = igPop(cu.flows + 0.3);
  igAt(170, 1180, gp, () => { igGear(170, 1180, 62, 9, TT * 0.9, { fill: IG.peri }); igGear(250, 1250, 36, 7, -TT * 1.55, { fill: IG.indigo }); });
  igAt(870, 680, gp, () => { igGear(860, 690, 40, 8, -TT * 0.7, { line: IG.ink }); igGear(912, 640, 26, 7, TT * 1.1, { line: IG.ink }); });
  // check circles inside the left loop, a bulb, speech bubbles
  [IG.peri, IG.saffron, IG.indigo].forEach((c, i) => igCheck(120, 700 + i * 80, 22, c, igPop(cu.checks + i * 0.12)));
  igBulb(150, 1330, 64, igPop(cu.bubble + 0.3));
  igBubble(250, 450, 120, 70, igPop(cu.bubble), { tail: 1 });
  igBubble(600, 1150, 110, 64, igPop(cu.bubble + 0.35), { tail: -1 });
  // a ladder against the back of the head; the hero at its foot, looking up, hops once
  igLadder(935, GROUND, 805, 930, 64, igDraw(cu.flows + 0.4, 0.7), { c: IG.indigo });
  igPerson(860, GROUND, 230, { key: 'hero', look: -1, hop: cu.hop });
  igCaption([{ s: 'Knowledge lives in ' }, { s: 'people’s heads.', c: IG.indigo, weight: 700 }], { y: 1490 });
}

// ---- era 2: the knowledge card (infographic sheet on a pale blue wash)
const ROWS = [
  ['Subject', 'Northwind Co.'],
  ['Statement', 'Opens a Lisbon office'],
  ['Modality', ['Intended', 'b']],
  ['Confidence', ['Moderate', 'y']],
  ['Status', ['Active', 'g']],
];
function sceneCard() {
  igWash();
  // title and subtitle
  igTitle([{ s: 'One Claim,', c: IG.navyT }, { s: ' Many Uses', c: IG.tealT }], CX, 330, 80, igDraw(cu.title, 0.7));
  igText('How one belief is stored, checked and reused', CX, 392, 32, IG.textD, { align: 'center', frac: igDraw(cu.title + 0.3, 0.7) });
  // the network glows above the card; information streams in from the left and out to the right
  const np = igDraw(cu.net, 1.2);
  igStream([[30, 470], [150, 500], [260, 560], [330, 545]], np, { n: 5, speed: 0.4 });
  igStream([[670, 545], [760, 520], [860, 480], [930, 470]], np, { n: 4, speed: 0.4 });
  igNetwork(CX, 548, 190, 105, np, { key: 'net', n: 34 });
  // the card: its frame is there from the morph; the header band, then rows, then pills
  igCard(CARD.x, CARD.y, CARD.w, CARD.h, 1, { r: 26 });
  igHeader(CARD.x, CARD.y, CARD.w, 104, igDraw(cu.header, 0.4), { r: 26, label: 'CLAIM', icon: 'brain' });
  ROWS.forEach(([label, val], i) => {
    const y = CARD.y + 104 + 64 + i * 112, p = igDraw(cu.rows + i * 0.1, 0.5);
    if (p <= 0) return;
    igText(label, CARD.x + 40, y, 30, IG.navyT, { weight: 700, frac: p });
    if (typeof val === 'string') igText(val, CARD.x + 240, y, 30, IG.text, { frac: igDraw(cu.rows + i * 0.1 + 0.15, 0.5) });
    else igPill(val[0], CARD.x + 240, y, 28, val[1], igPop(cu.pills + (i - 2) * 0.25));
    if (i < ROWS.length - 1) { igPath([[CARD.x + 36, y + 46], [CARD.x + 36 + (CARD.w - 72) * p, y + 46]], false); igLine(IG.rule, 2); ctx.stroke(); }
  });
  // sources: badges on the left, joined into one bus and an arrow into the card
  const SRC = [['mail', 820], ['db', 1000], ['people', 1180]];
  SRC.forEach(([ic, y], i) => {
    const p = igPop(cu.sources + i * 0.12);
    igBadge(100, y, 36, ic, p, { fill: i === 1 ? IG.teal : IG.navy });
    igConnector([[140, y], [180, y], [180, 1000]], igDraw(cu.sources + 0.2 + i * 0.1, 0.4), { dots: 'none', w: 3 });
  });
  igChevron(198, 1000, 34, igDraw(cu.sources + 0.6, 0.4));
  // the hero beside the card, waving
  igPerson(885, CARD.y + CARD.h, 220, { key: 'hero', look: -1, wave: cu.wave });
  igCaption([{ s: 'Every fact keeps ' }, { s: 'its source.', c: IG.tealT, weight: 700 }], { y: 1490 });
}
