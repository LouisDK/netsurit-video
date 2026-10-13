// =====================================================================
//  ERA 5 — ONE EMAIL, ONE CLAIM (sheet on wash). The email card is there from the morph; its words type
//  as George says them. A chevron, then the CLAIM card: rows pop on the words that name them (belief,
//  evidence, how sure, when true, when learned), callouts connect on the right. "When the plan changes":
//  a second card slides over it and the first stays visible behind, marked superseded.
// =====================================================================
const CL = {
  title: M_CLM + 0.55, l1: VW('b3', 'moving') - 0.1, l2: VW('b3', 'onto') - 0.1, l3: VW('b3', 'january') - 0.1,
  turn: VW('b4', 'turns'), claim: VW('b4', 'claim'), belief: VW('b4', 'belief'), evidence: VW('b4', 'evidence'),
  sure: VW('b4', 'sure'), valid: VW('b4', 'true'), learned: VW('b4', 'learned'),
  changes: VW('b5', 'changes'), erased: VW('b5', 'erased'), superseded: VW('b5', 'superseded'), history: VW('b5', 'history'),
};
const CL_ROWS = (v2) => [
  ['Subject', 'A freight customer', CL.belief],
  ['Statement', v2 ? '40 trucks running US lanes' : '40 trucks on US lanes from Jan', CL.belief + 0.15],
  ['Modality', [v2 ? 'Observed' : 'Intended', 'b'], CL.claim + 0.5],
  ['Evidence', v2 ? 'Telematics · Jan miles' : 'Email · 9 Oct, ¶1', CL.evidence],
  ['Confidence', [v2 ? 'High' : 'Moderate', v2 ? 'g' : 'y'], CL.sure],
  ['Valid from', 'Jan 2027', CL.valid],
  ['Recorded', v2 ? '4 Jan 2027' : '9 Oct 2026', CL.learned],
  ['Status', ['Active', 'g'], CL.claim + 0.7],
];
const CL_ROW_Y = (i) => CLAIM.y + 84 + 50 + i * 76;
function clCard(x, y, p, v2, dim) {
  if (p <= 0.001) return;
  const t0 = v2 ? CL.changes : 0;   // v2's rows are all there as it slides in
  ctx.save(); ctx.globalAlpha *= 1 - 0.45 * dim;
  igCard(x, y, CLAIM.w, CLAIM.h, p, { r: 24 });
  igHeader(x, y, CLAIM.w, 84, v2 ? 1 : igDraw(CL.claim, 0.4), { r: 24, label: v2 ? 'CLAIM · v2' : 'CLAIM', icon: 'brain' });
  CL_ROWS(v2).forEach(([label, val, t], i) => {
    const ry = y + 84 + 50 + i * 76, rp = v2 ? 1 : igDraw(t, 0.45);
    if (rp <= 0) return;
    igText(label, x + 36, ry, 26, IG.navyT, { weight: 700, frac: rp });
    if (typeof val === 'string') igText(val, x + 220, ry, 26, IG.text, { frac: v2 ? 1 : igDraw(t + 0.12, 0.5) });
    else igPill(val[0], x + 220, ry, 24, val[1], v2 ? 1 : igPop(t));
    if (label === 'Evidence') igIcon('link', x + 220 + igW(val, 26) + 30, ry - 9, 30, IG.teal, { w: 10 });
    if (i < 7) { igPath([[x + 32, ry + 30], [x + 32 + (CLAIM.w - 64) * rp, ry + 30]], false); igLine(IG.rule, 2); ctx.stroke(); }
  });
  ctx.restore();
}
function sceneClaim() {
  igWash();
  ebTitle('One email, ', 'one claim', 'A belief, with its evidence, how sure we are, and two dates', CL.title);
  // the email card (from the morph): header, sender, the quote typing on the words
  const E = EMAIL;
  igCard(E.x, E.y, E.w, E.h, 1, { r: 22 });
  igHeader(E.x, E.y, E.w, 80, igDraw(CL.title + 0.1, 0.4), { r: 22, label: 'EMAIL', icon: 'mail' });
  igText('From: fleet manager · 9 Oct', E.x + 32, E.y + 128, 24, IG.textD, { weight: 600, frac: igDraw(CL.title + 0.3, 0.5) });
  const Q = [['“We’re moving forty trucks', CL.l1], ['onto US lanes', CL.l2], ['from January.”', CL.l3]];
  const hi = igDraw(CL.evidence, 0.5);
  Q.forEach(([s, t], i) => {
    const y = E.y + 196 + i * 50;
    if (hi > 0) igFill(rrectPts(E.x + 24, y - 34, (igW(s, 32, { weight: 600 }) + 16) * hi, 46, 8, 3), IG.pillY);
    igText(s, E.x + 32, y, 32, IG.navyT, { weight: 600, frac: igDraw(t, 0.55) });
  });
  igChevron(650, 435, 46, igDraw(CL.turn, 0.5));
  // the claim: v1 settles in on "claim"; when the plan changes it steps back and v2 slides over it
  const back = igSettle(CL.changes), v2 = igSettle(CL.changes + 0.15);
  clCard(CLAIM.x - back * 36, CLAIM.y - back * 30, igSettle(CL.claim - 0.2), false, back);
  if (v2 > 0.001) {
    ctx.save(); ctx.globalAlpha *= clamp(v2 * 2);
    clCard(CLAIM.x + (1 - v2) * 420 + back * 10, CLAIM.y + back * 8, 1, true, 0);
    ctx.restore();
  }
  // "superseded": a tag on the old card's visible edge
  const sp = igPop(CL.superseded);
  if (sp > 0.001) igAt(CLAIM.x + CLAIM.w / 2, 990, sp, () => {
    const lab = 'v1 SUPERSEDED · KEPT BEHIND v2', w = igW(lab, 22, { weight: 700, font: IGHEAD, track: 2 }) + 40, x = CLAIM.x + CLAIM.w / 2 - w / 2;
    igFill(rrectPts(x, 970, w, 40, 20, 4), IG.textD);
    igText(lab, CLAIM.x + CLAIM.w / 2, 998, 22, IG.white, { align: 'center', weight: 700, font: IGHEAD, track: 2 });
  });
  // evidence connector: from the evidence row back to the highlighted words
  igConnector([[CLAIM.x - back * 36, CL_ROW_Y(3) - 9 - back * 30], [640, CL_ROW_Y(3) - 9 - back * 30], [640, E.y + 240], [E.x + E.w, E.y + 240]], igDraw(CL.evidence + 0.2, 0.6) * (1 - v2), { dots: 'both', c: IG.teal, w: 3 });
  // callouts on the right, each joined to the card
  const CO = [['link', 'Evidence-linked', 'One click to the source', CL.evidence + 0.2],
              ['chart', 'Confidence-scored', 'A plan sits below a fact', CL.sure + 0.1],
              ['clock', 'Two dates', 'When true · when learned', CL.valid + 0.2],
              ['gear', 'Never overwritten', 'Old beliefs are kept', CL.history - 0.3]];
  CO.forEach(([ic, a, b, t], i) => {
    const y = 250 + i * 168, p = igSettle(t);
    if (p <= 0.001) return;
    igConnector([[CLAIM.x + CLAIM.w, y + 60], [1400, y + 60]], igDraw(t + 0.1, 0.4), { dots: 'both' });
    igCard(1400, y, 440, 124, p, { r: 18 });
    igBadge(1460, y + 62, 36, ic, igPop(t + 0.05), { fill: i === 3 ? IG.teal : IG.navy });
    igText(a, 1516, y + 56, 30, IG.navyT, { weight: 700, frac: igDraw(t + 0.1, 0.4) });
    igText(b, 1516, y + 92, 23, IG.textD, { weight: 500, frac: igDraw(t + 0.2, 0.4) });
  });
}
