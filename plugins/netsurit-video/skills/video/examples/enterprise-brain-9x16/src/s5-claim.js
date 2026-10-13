// =====================================================================
//  ERA 5 — ONE EMAIL, ONE CLAIM (sheet on wash, 9:16: the email above, the claim below, callouts as row tags). The email card is there from the morph; its words type
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
const CL_ROW_Y = (i) => CLAIM.y + 84 + 52 + i * 76;
// 9:16: the four callouts become tags on the rows they describe (no room for a column of cards beside the claim)
const CL_TAGS = { Evidence: ['link', 'Evidence-linked', () => CL.evidence + 0.2], Confidence: ['chart', 'Confidence-scored', () => CL.sure + 0.1],
  'Valid from': ['clock', 'Two dates', () => CL.valid + 0.2], Status: ['gear', 'Never overwritten', () => CL.history - 0.3] };
function clTag(ic, lab, x1, y, p, red) {
  if (p <= 0.001) return;
  const w = igW(lab, 23, { weight: 700 }) + 74, x = x1 - w;
  igAt(x + w / 2, y - 9, p, () => {
    igFill(rrectPts(x, y - 30, w, 44, 22, 4), red ? '#FDE3E6' : IG.wash);
    ctx.beginPath(); ctx.arc(x + 23, y - 8, 15, 0, TAU); ctx.fillStyle = red ? IG.teal : IG.navy; ctx.fill();
    igIcon(ic, x + 23, y - 8, 18, IG.white, { w: 12 });
    igText(lab, x + 48, y, 23, IG.navyT, { weight: 700 });
  });
}
function clCard(x, y, p, v2, dim) {
  if (p <= 0.001) return;
  ctx.save(); ctx.globalAlpha *= 1 - 0.45 * dim;
  igCard(x, y, CLAIM.w, CLAIM.h, p, { r: 24 });
  igHeader(x, y, CLAIM.w, 84, v2 ? 1 : igDraw(CL.claim, 0.4), { r: 24, label: v2 ? 'CLAIM · v2' : 'CLAIM', icon: 'brain' });
  ctx.save(); ctx.globalAlpha *= 1 - clamp(dim * 2.5);   // v1's rows fade as it steps back: only its card and header stay behind v2
  CL_ROWS(v2).forEach(([label, val, t], i) => {
    const ry = y + 84 + 52 + i * 76, rp = v2 ? 1 : igDraw(t, 0.45);
    if (rp <= 0) return;
    igText(label, x + 36, ry, 29, IG.navyT, { weight: 700, frac: rp });
    if (typeof val === 'string') igText(val, x + 236, ry, 29, IG.text, { frac: v2 ? 1 : igDraw(t + 0.12, 0.5) });
    else igPill(val[0], x + 236, ry, 26, val[1], v2 ? 1 : igPop(t));
    if (label === 'Evidence') igIcon('link', x + 236 + igW(val, 29) + 30, ry - 10, 32, IG.teal, { w: 10 });
    const tag = CL_TAGS[label];
    if (tag) clTag(tag[0], tag[1], x + CLAIM.w - 28, ry, v2 ? 1 : igSettle(tag[2]()), label === 'Status');
    if (i < 7) { igPath([[x + 32, ry + 30], [x + 32 + (CLAIM.w - 64) * rp, ry + 30]], false); igLine(IG.rule, 2); ctx.stroke(); }
  });
  ctx.restore();
  ctx.restore();
}
function sceneClaim() {
  igWash();
  ebTitle('One email, ', 'one claim', ['A belief, with its evidence, how sure', 'we are, and two dates'], CL.title);
  // the email card (from the morph): header, sender, the quote typing on the words
  const E = EMAIL;
  igCard(E.x, E.y, E.w, E.h, 1, { r: 22 });
  igHeader(E.x, E.y, E.w, 80, igDraw(CL.title + 0.1, 0.4), { r: 22, label: 'EMAIL', icon: 'mail' });
  igText('From: fleet manager · 9 Oct', E.x + 36, E.y + 128, 27, IG.textD, { weight: 600, frac: igDraw(CL.title + 0.3, 0.5) });
  const Q = [['“We’re moving forty trucks', CL.l1], ['onto US lanes', CL.l2], ['from January.”', CL.l3]];
  const hi = igDraw(CL.evidence, 0.5);
  Q.forEach(([s, t], i) => {
    const x = E.x + 36 + (i === 0 ? 0 : 0), y = E.y + 184 + i * 46;
    if (hi > 0) igFill(rrectPts(x - 8, y - 33, (igW(s, 34, { weight: 600 }) + 16) * hi, 44, 8, 3), IG.pillY);
    igText(s, x, y, 34, IG.navyT, { weight: 600, frac: igDraw(t, 0.55) });
  });
  // a chevron pointing down, email -> claim
  const cv = igDraw(CL.turn, 0.5);
  if (cv > 0) { ctx.save(); ctx.translate(CX, 790); ctx.rotate(Math.PI / 2); igChevron(0, 0, 50, cv); ctx.restore(); }
  // the claim: v1 settles in on "claim"; when the plan changes it steps back and v2 slides over it
  const back = igSettle(CL.changes), v2 = igSettle(CL.changes + 0.15);
  clCard(CLAIM.x - back * 30, CLAIM.y - back * 34, igSettle(CL.claim - 0.2), false, back);
  if (v2 > 0.001) {
    ctx.save(); ctx.globalAlpha *= clamp(v2 * 2);
    clCard(CLAIM.x + back * 8, CLAIM.y + (1 - v2) * 140 + back * 8, 1, true, 0);   // rises from below: a slide from the side would push its tags past the frame edge
    ctx.restore();
  }
  // "superseded": a tag under the cards
  const sp = igPop(CL.superseded);
  if (sp > 0.001) igAt(CX, 1622, sp, () => {
    const lab = 'v1 SUPERSEDED · KEPT BEHIND v2', w = igW(lab, 25, { weight: 700, font: IGHEAD, track: 2 }) + 44;
    igFill(rrectPts(CX - w / 2, 1598, w, 48, 24, 4), IG.textD);
    igText(lab, CX, 1631, 25, IG.white, { align: 'center', weight: 700, font: IGHEAD, track: 2 });
  });
  // evidence connector: from the evidence row, down the left margin and back up to the highlighted words
  const ey = CL_ROW_Y(3) - 10 - back * 34;
  igConnector([[CLAIM.x - back * 30, ey], [58, ey], [58, E.y + 210], [E.x, E.y + 210]], igDraw(CL.evidence + 0.2, 0.6) * (1 - v2), { dots: 'both', c: IG.teal, w: 3 });
}
