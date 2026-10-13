// =====================================================================
//  ERA 2 — THE CLERK (sheet on wash, 9:16: the ledger on top, the Clerk and what the grid can't hold below). An agent wired straight into your CRM and ERP.
//  The ledger card is there from the morph. CRM and ERP badges wire into the Clerk (indigo shirt); a fresh
//  query types; the column names come up with question marks; twenty rows fill and stop at a cut line;
//  the email that explains them bumps against the grid and can't get in; a count ticks 212 -> 188 with a
//  "?" badge. Band: NUMBERS, NOT BELIEFS.
// =====================================================================
const CK = {
  title: M_CLK + 0.55, who: VW('c1', 'clerk'), wired: VW('c1', 'wired'), crm: VW('c1', 'crm'), erp: VW('c1', 'erp'),
  query: VW('c2', 'writes'), guess: VW('c2', 'guesses'), cols: VW('c2', 'columns'),
  rows: VW('c3', 'hands'), twenty: VW('c3', 'twenty'), email: VW('c3', 'email'), why: VW('c3', 'why'), changed: VW('c3', 'changed'),
  band: VW('c4', 'numbers'),
};
const CK_COLS = ['acct_st', 'u_cnt', 'flg_2', 'dt_x'];
const CK_ME = [270, 1560, 360];   // the Clerk: x, feet y, height (below the ledger, left)
function sceneClerk() {
  igWash();
  ebTitle('The ', 'Clerk', ['An agent wired straight', 'into your CRM and ERP'], CK.title);
  const L = LEDGER, [mx, my, ms] = CK_ME;
  // CRM and ERP badges on the far left, cabled into the Clerk
  [['db', 'CRM', 1250, CK.crm], ['chart', 'ERP', 1440, CK.erp]].forEach(([ic, lab, y, t], i) => {
    const p = igPop(t - 0.35);
    igBadge(100, y, 42, ic, p, { fill: i ? '#7E878E' : IG.navy });
    if (p > 0.01) igText(lab, 100, y + 78, 27, IG.navyT, { align: 'center', weight: 700, font: IGHEAD, track: 2, frac: clamp(p) });
    igConnector([[146, y], [180, y], [180, my - 190], [mx - 40, my - 190]], igDraw(CK.wired + i * 0.1, 0.5), { dots: 'both', w: 3 });
  });
  // the Clerk settles in
  igAt(mx, my, igSettle(CK.who - 0.4), () => ebClerk(mx, my, ms, { look: 1 }));
  // the ledger (from the morph): header, the query bar, column names, rows
  igCard(L.x, L.y, L.w, L.h, 1, { r: 24 });
  igHeader(L.x, L.y, L.w, 84, igDraw(CK.title + 0.2, 0.4), { r: 24, label: 'QUERY RESULT', icon: 'db' });
  const qp = clamp((TT - CK.query) / 1.6);
  igFill(rrectPts(L.x + 30, L.y + 108, L.w - 60, 62, 12, 3), IG.washL);
  if (qp > 0) monoText('SELECT * FROM accounts WHERE ???', L.x + 52, L.y + 150, 30, IG.navyT, { count: Math.floor(qp * 33), key: 'q', jit: 0 });
  CK_COLS.forEach((c, i) => {
    const x = L.x + 40 + i * 212, p = igDraw(CK.guess + i * 0.12, 0.4), cw = igW(c, 28, { weight: 700 });
    igText(c, x, L.y + 226, 28, IG.textD, { weight: 700, frac: p });
    const qb = igPop(CK.cols + i * 0.1);
    igAt(x + cw + 24, L.y + 217, qb, () => { ctx.beginPath(); ctx.arc(x + cw + 24, L.y + 217, 17, 0, TAU); ctx.fillStyle = IG.pillY; ctx.fill(); igText('?', x + cw + 24, L.y + 226, 25, IG.pillYT, { align: 'center', weight: 700 }); });
  });
  // twenty rows fill fast, then stop at a cut line
  const rp = clamp((TT - CK.rows) / 1.2);
  ebGrid(L.x + 30, L.y + 252, L.w - 60, 20, 18, rp);
  if (rp >= 1) {
    const y = L.y + 252 + 20 * 18 + 6, cp = igDraw(CK.twenty, 0.4);
    ebDash([[L.x + 24, y], [L.x + 24 + (L.w - 48) * cp, y]], 1, { c: IG.navy, dash: [12, 8], speed: 0, w: 3 });
    const w = igW('20 rows', 30, { weight: 600 }) + 42;
    igPill('20 rows', L.x + L.w - w - 30, y + 44, 30, 'b', igPop(CK.twenty + 0.1));
    igText('… and nothing past the cut', L.x + 30, y + 48, 28, IG.textD, { weight: 600, frac: igDraw(CK.twenty + 0.3, 0.5) });
  }
  // the email that explains the rows: pushes up against the grid's frame and can't get in
  const ep = igSettle(CK.email - 0.5);
  if (ep > 0.001) {
    const bump = Math.max(0, Math.sin(clamp((TT - CK.email) / 0.5) * Math.PI)) * 40, x = 400, y = 1180 - bump + (1 - ep) * 200;
    igCard(x, y, 590, 170, ep, { r: 18 });
    igIcon('mail', x + 60, y + 66, 52, IG.navy, { w: 8 });
    igText('“They’re looking at', x + 118, y + 60, 30, IG.navyT, { weight: 600 });
    igText('other options…”', x + 118, y + 100, 30, IG.navyT, { weight: 600 });
    igText('outside the grid', x + 118, y + 144, 26, IG.textD, { weight: 600 });
  }
  // a count ticks down and nobody can say why
  const np = igSettle(CK.why - 0.6);
  if (np > 0.001) {
    const x = 400, y = 1370, v = Math.round(lerp(212, 188, EZ.io(clamp((TT - CK.why + 0.3) / 1.0))));
    igCard(x, y, 590, 176, np, { r: 18 });
    igText('Active units', x + 36, y + 56, 30, IG.textD, { weight: 600 });
    igText(String(v), x + 36, y + 150, 88, IG.navyT, { weight: 700, font: IGHEAD });
    igAt(x + 500, y + 112, igPop(CK.changed), () => {
      igShadow(() => { ctx.beginPath(); ctx.arc(x + 500, y + 112, 46, 0, TAU); ctx.fillStyle = IG.teal; ctx.fill(); }, { blur: 16, dy: 5 });
      igText('?', x + 500, y + 131, 56, IG.white, { align: 'center', weight: 700, font: IGHEAD });
    });
  }
  ebBand('NUMBERS, NOT BELIEFS', 1600, igPop(CK.band, { k: 200, damp: 0.6 }));
}
