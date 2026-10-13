// =====================================================================
//  ERA 6 — SILENCE, DOUBT, EVERY CUSTOMER (sheet on wash, 9:16: three cards stacked). The title steps with the voice:
//  "It Hears Silence" -> "It Names the Gap" -> "It Asks Everyone".
//  Top: the signals card (from the morph): a weekly login row of checks that turn to dashed empties, the
//  quarterly review slot left blank; the empties gather into an alert. Bottom left: the new rule's answer
//  for this customer — "Possibly affected · missing: cross-border status" — becomes a task. Bottom right:
//  the network lights account by account and a ranked list resolves, each row joined to its claims.
// =====================================================================
const SG = {
  title: M_SIG + 0.5, stopped: VW('b6', 'stopped'), booked: VW('b6', 'booked'), nothing: VW('b7', 'nothing'),
  know: VW('b8', 'know'), possibly: VW('b8', 'possibly'), missing: VW('b8', 'missing'), task: VW('b8', 'task'),
  every: VW('b9', 'every'), working: VW('b9', 'working'),
};
const SIGCARD = { x: 60, y: 420, w: 960, h: 440 };
const NET = [235, 1500, 150, 110];
function sgTitle() {
  const steps = [['It hears ', 'silence', SG.title], ['It names ', 'the gap', SG.know], ['It asks ', 'everyone', SG.every - 0.2]];
  let k = 0; for (let i = 0; i < 3; i++) if (TT >= steps[i][2]) k = i;
  const [a, b, t] = steps[k];
  igTitle([{ s: a, c: IG.navyT }, { s: b, c: IG.tealT }], CX, TITLE_Y, 84, igDraw(t, 0.6));
}
function sceneSignals() {
  igWash();
  sgTitle();
  const S = SIGCARD;
  igCard(S.x, S.y, S.w, S.h, 1, { r: 24 });
  igHeader(S.x, S.y, S.w, 76, igDraw(SG.title + 0.2, 0.4), { r: 24, label: 'SIGNALS · A FREIGHT CUSTOMER', icon: 'clock' });
  // weekly logins: 12 weeks; the last three are expected but never come
  igText('Weekly portal login', S.x + 40, S.y + 136, 30, IG.navyT, { weight: 700 });
  const CY = S.y + 196;
  for (let i = 0; i < 12; i++) {
    const x = S.x + 70 + i * 74, gone = i >= 9;
    if (!gone) igCheck(x, CY, 25, i % 3 ? IG.peri : IG.indigo, 1);
    else if (TT >= SG.stopped - 0.2 + (i - 9) * 0.15) {
      ctx.save(); ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.arc(x, CY, 25, 0, TAU); igLine(IG.navy, 3); ctx.stroke(); ctx.restore();
    }
  }
  // quarterly reviews: Q1, Q2 held; Q3 left blank
  igText('Quarterly review', S.x + 40, S.y + 296, 30, IG.navyT, { weight: 700 });
  const QY = S.y + 326;
  ['Q1', 'Q2', 'Q3'].forEach((q, i) => {
    const x = S.x + 40 + i * 170;
    if (i < 2) { igFill(rrectPts(x, QY, 146, 56, 12, 3), IG.pillB); igText(q + ' ✓', x + 73, QY + 38, 27, IG.pillBT, { align: 'center', weight: 700 }); }
    else if (TT >= SG.booked - 0.3) { ctx.save(); ctx.setLineDash([8, 7]); igPath(rrectPts(x, QY, 146, 56, 12, 3), true); igLine(IG.navy, 3); ctx.stroke(); ctx.restore(); igText(q + ' ?', x + 73, QY + 38, 27, IG.navy, { align: 'center', weight: 700 }); }
  });
  // "nothing at all": the empties are joined into an alert, lower right of the card
  const ap = igSettle(SG.nothing);
  if (ap > 0.001) {
    const AX = S.x + 560, AY = S.y + 250;
    igConnector([[S.x + 70 + 10 * 74, CY + 27], [S.x + 70 + 10 * 74, AY]], igDraw(SG.nothing, 0.4), { dots: 'none', w: 2.5, dash: [6, 6] });
    igConnector([[S.x + 40 + 2 * 170 + 150, QY + 28], [AX, QY + 28]], igDraw(SG.nothing, 0.4), { dots: 'none', w: 2.5, dash: [6, 6] });
    igCard(AX, AY, 370, 166, ap, { r: 16, fill: '#fff8e8' });
    igIcon('clock', AX + 50, AY + 52, 46, IG.pillYT, { w: 8 });
    igText('Expected,', AX + 92, AY + 52, 31, IG.pillYT, { weight: 700 });
    igText('not received', AX + 92, AY + 90, 31, IG.pillYT, { weight: 700 });
    igText('silence is a signal', AX + 32, AY + 140, 25, IG.textD, { weight: 600 });
  }
  // doubt: the rule's answer for this customer, then a task
  const dp = igSettle(SG.know - 0.4);
  if (dp > 0.001) {
    const x = 60, y = 900, w = 960, h = 350, tk = igSettle(SG.task);
    igCard(x, y, w, h, dp, { r: 22 });
    igHeader(x, y, w, 76, dp, { r: 22, label: 'NEW RULE · AFFECTED?', icon: 'search' });
    igPill('Possibly affected', x + 40, y + 146, 32, 'y', igPop(SG.possibly));
    igText('Missing: cross-border status', x + 40, y + 214, 32, IG.navyT, { weight: 700, frac: igDraw(SG.missing, 0.6) });
    igText('a stated plan only, no observed lanes', x + 40, y + 256, 26, IG.textD, { weight: 500, frac: igDraw(SG.missing + 0.4, 0.6) });
    if (tk > 0.001) {
      igAt(x + w / 2, y + 310, tk, () => {
        igFill(rrectPts(x + 30, y + 280, w - 60, 58, 14, 3), IG.pillB);
        igCheck(x + 66, y + 309, 18, IG.teal, igPop(SG.task + 0.3));
        igText('Task: confirm US lanes with the account team', x + 98, y + 318, 26, IG.pillBT, { weight: 700 });
      });
    }
  }
  // every customer at once: the network lights, a ranked list resolves with links back to claims
  const ep = igDraw(SG.every - 0.3, 1.0);
  if (ep > 0) {
    igNetwork(NET[0], NET[1], NET[2], NET[3], ep, { key: 'all', n: 30, glow: '244,54,76' });
    const R = [['Account 0417', 'Affected', 'b'], ['A freight customer', 'Possibly', 'y'], ['Account 2291', 'Not affected', 'g']];
    R.forEach(([name, st, kind], i) => {
      const y = 1300 + i * 120, p = igSettle(SG.every + 0.4 + i * 0.3);
      if (p <= 0.001) return;
      igCard(430, y, 590, 100, p, { r: 16 });
      igText(`${i + 1}`, 462, y + 64, 38, IG.tealT, { weight: 700, font: IGHEAD });
      igText(name, 504, y + 62, 28, IG.navyT, { weight: 700 });
      const w = igW(st, 25, { weight: 600 }) + 34;
      igPill(st, 1000 - w, y + 60, 25, kind, igPop(SG.every + 0.6 + i * 0.3));
      igConnector([[NET[0] + NET[2] * 0.8, NET[1] - 40 + i * 40], [430, y + 50]], igDraw(SG.working + i * 0.12, 0.4), { dots: 'both', w: 2, c: IG.teal });
    });
  }
}
