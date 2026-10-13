// =====================================================================
//  ERA 6 — SILENCE, DOUBT, EVERY CUSTOMER (sheet on wash). The title steps with the voice:
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
const SIGCARD = { x: 160, y: 215, w: 1600, h: 300 };
const NET = [1060, 760, 170, 120];
function sgTitle() {
  const steps = [['It hears ', 'silence', SG.title], ['It names ', 'the gap', SG.know], ['It asks ', 'everyone', SG.every - 0.2]];
  let k = 0; for (let i = 0; i < 3; i++) if (TT >= steps[i][2]) k = i;
  const [a, b, t] = steps[k];
  igTitle([{ s: a, c: IG.navyT }, { s: b, c: IG.tealT }], CX, 112, 72, igDraw(t, 0.6));
}
function sceneSignals() {
  igWash();
  sgTitle();
  const S = SIGCARD;
  igCard(S.x, S.y, S.w, S.h, 1, { r: 24 });
  igHeader(S.x, S.y, S.w, 72, igDraw(SG.title + 0.2, 0.4), { r: 24, label: 'SIGNALS · A FREIGHT CUSTOMER', icon: 'clock' });
  // weekly logins: 12 weeks; the last three are expected but never come
  igText('Weekly portal login', S.x + 40, S.y + 140, 26, IG.navyT, { weight: 700 });
  for (let i = 0; i < 12; i++) {
    const x = S.x + 380 + i * 66, y = S.y + 130, gone = i >= 9;
    if (!gone) igCheck(x, y, 22, i % 3 ? IG.peri : IG.indigo, 1);
    else if (TT >= SG.stopped - 0.2 + (i - 9) * 0.15) {
      ctx.save(); ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.arc(x, y, 22, 0, TAU); igLine(IG.navy, 3); ctx.stroke(); ctx.restore();
    }
  }
  // quarterly reviews: Q1, Q2 held; Q3 left blank
  igText('Quarterly review', S.x + 40, S.y + 236, 26, IG.navyT, { weight: 700 });
  ['Q1', 'Q2', 'Q3'].forEach((q, i) => {
    const x = S.x + 380 + i * 170, y = S.y + 200;
    if (i < 2) { igFill(rrectPts(x, y, 140, 52, 12, 3), IG.pillB); igText(q + ' ✓', x + 70, y + 35, 24, IG.pillBT, { align: 'center', weight: 700 }); }
    else if (TT >= SG.booked - 0.3) { ctx.save(); ctx.setLineDash([8, 7]); igPath(rrectPts(x, y, 140, 52, 12, 3), true); igLine(IG.navy, 3); ctx.stroke(); ctx.restore(); igText(q + ' ?', x + 70, y + 35, 24, IG.navy, { align: 'center', weight: 700 }); }
  });
  // "nothing at all": the empties are joined into an alert on the right of the card
  const ap = igSettle(SG.nothing);
  if (ap > 0.001) {
    igConnector([[S.x + 380 + 11 * 66 + 26, S.y + 130], [S.x + 1290, S.y + 130], [S.x + 1290, S.y + 180]], igDraw(SG.nothing, 0.4), { dots: 'none', w: 2.5, dash: [6, 6] });
    igConnector([[S.x + 380 + 2 * 170 + 144, S.y + 226], [S.x + 1290, S.y + 226]], igDraw(SG.nothing, 0.4), { dots: 'none', w: 2.5, dash: [6, 6] });
    igCard(S.x + 1290, S.y + 100, 280, 170, ap, { r: 16, fill: '#fff8e8' });
    igIcon('clock', S.x + 1340, S.y + 150, 44, IG.pillYT, { w: 8 });
    igText('Expected,', S.x + 1380, S.y + 150, 28, IG.pillYT, { weight: 700 });
    igText('not received', S.x + 1380, S.y + 186, 28, IG.pillYT, { weight: 700 });
    igText('silence is a signal', S.x + 1320, S.y + 240, 22, IG.textD, { weight: 600 });
  }
  // doubt: the rule's answer for this customer, then a task
  const dp = igSettle(SG.know - 0.4);
  if (dp > 0.001) {
    const x = 160, y = 570, w = 640, h = 330, tk = igSettle(SG.task);
    igCard(x, y, w, h, dp, { r: 22 });
    igHeader(x, y, w, 72, dp, { r: 22, label: 'NEW RULE · AFFECTED?', icon: 'search' });
    igPill('Possibly affected', x + 36, y + 140, 30, 'y', igPop(SG.possibly));
    igText('Missing: cross-border status', x + 36, y + 206, 28, IG.navyT, { weight: 700, frac: igDraw(SG.missing, 0.6) });
    igText('a stated plan only, no observed lanes', x + 36, y + 246, 22, IG.textD, { weight: 500, frac: igDraw(SG.missing + 0.4, 0.6) });
    if (tk > 0.001) {
      igAt(x + w / 2, y + 296, tk, () => {
        igFill(rrectPts(x + 30, y + 266, w - 60, 52, 14, 3), IG.pillB);
        igCheck(x + 62, y + 292, 16, IG.teal, igPop(SG.task + 0.3));
        igText('Task: confirm US lanes with the account team', x + 90, y + 301, 22, IG.pillBT, { weight: 700 });
      });
    }
  }
  // every customer at once: the network lights, a ranked list resolves with links back to claims
  const ep = igDraw(SG.every - 0.3, 1.0);
  if (ep > 0) {
    igNetwork(NET[0], NET[1], NET[2], NET[3], ep, { key: 'all', n: 30 });
    const R = [['Account 0417', 'Affected', 'b'], ['A freight customer', 'Possibly', 'y'], ['Account 2291', 'Not affected', 'g']];
    R.forEach(([name, st, kind], i) => {
      const y = 600 + i * 104, p = igSettle(SG.every + 0.4 + i * 0.3);
      if (p <= 0.001) return;
      igCard(1290, y, 470, 88, p, { r: 16 });
      igText(`${i + 1}`, 1322, y + 56, 34, IG.tealT, { weight: 700, font: IGHEAD });
      igText(name, 1360, y + 54, 25, IG.navyT, { weight: 700 });
      const w = igW(st, 22, { weight: 600 }) + 30;
      igPill(st, 1740 - w, y + 52, 22, kind, igPop(SG.every + 0.6 + i * 0.3));
      igConnector([[NET[0] + NET[2] * 0.8, NET[1] - 40 + i * 40], [1290, y + 44]], igDraw(SG.working + i * 0.12, 0.4), { dots: 'both', w: 2, c: IG.teal });
    });
  }
}
