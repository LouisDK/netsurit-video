// =====================================================================
//  ERA 2 — THE CLERK (sheet on wash). An agent wired straight into your CRM and ERP.
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
function sceneClerk() {
  igWash();
  ebTitle('The ', 'Clerk', 'An agent wired straight into your CRM and ERP', CK.title);
  const L = LEDGER;
  // CRM and ERP badges on the far left, cabled into the Clerk
  [['db', 'CRM', 360, CK.crm], ['chart', 'ERP', 560, CK.erp]].forEach(([ic, lab, y, t], i) => {
    const p = igPop(t - 0.35);
    igBadge(110, y, 44, ic, p, { fill: i ? '#7E878E' : IG.navy });
    if (p > 0.01) igText(lab, 110, y + 82, 26, IG.navyT, { align: 'center', weight: 700, font: IGHEAD, track: 2, frac: clamp(p) });
    igConnector([[158, y], [230, y], [230, 640], [300, 640]], igDraw(CK.wired + i * 0.1, 0.5), { dots: 'both', w: 3 });
  });
  // the Clerk settles in
  igAt(340, 880, igSettle(CK.who - 0.4), () => ebClerk(340, 880, 330, { look: 1 }));
  // the ledger (from the morph): header, the query bar, column names, rows
  igCard(L.x, L.y, L.w, L.h, 1, { r: 24 });
  igHeader(L.x, L.y, L.w, 84, igDraw(CK.title + 0.2, 0.4), { r: 24, label: 'QUERY RESULT', icon: 'db' });
  const qp = clamp((TT - CK.query) / 1.6);
  igFill(rrectPts(L.x + 30, L.y + 108, L.w - 60, 56, 12, 3), IG.washL);
  if (qp > 0) monoText('SELECT * FROM accounts WHERE ???', L.x + 52, L.y + 146, 26, IG.navyT, { count: Math.floor(qp * 33), key: 'q', jit: 0 });
  CK_COLS.forEach((c, i) => {
    const x = L.x + 40 + i * 180, p = igDraw(CK.guess + i * 0.12, 0.4);
    igText(c, x, L.y + 214, 24, IG.textD, { weight: 700, frac: p });
    const qb = igPop(CK.cols + i * 0.1);
    igAt(x + igW(c, 24, { weight: 700 }) + 22, L.y + 206, qb, () => { ctx.beginPath(); ctx.arc(x + igW(c, 24, { weight: 700 }) + 22, L.y + 206, 15, 0, TAU); ctx.fillStyle = IG.pillY; ctx.fill(); igText('?', x + igW(c, 24, { weight: 700 }) + 22, L.y + 214, 22, IG.pillYT, { align: 'center', weight: 700 }); });
  });
  // twenty rows fill fast, then stop at a cut line
  const rp = clamp((TT - CK.rows) / 1.2);
  ebGrid(L.x + 30, L.y + 236, L.w - 60, 20, 17, rp);
  if (rp >= 1) {
    const y = L.y + 236 + 20 * 17 + 4, cp = igDraw(CK.twenty, 0.4);
    ebDash([[L.x + 24, y], [L.x + 24 + (L.w - 48) * cp, y]], 1, { c: IG.navy, dash: [12, 8], speed: 0, w: 3 });
    const w = igW('20 rows', 26, { weight: 600 }) + 36;
    igPill('20 rows', L.x + L.w - w - 30, y + 36, 26, 'b', igPop(CK.twenty + 0.1));
    igText('… and nothing past the cut', L.x + 30, y + 40, 24, IG.textD, { weight: 600, frac: igDraw(CK.twenty + 0.3, 0.5) });
  }
  // the email that explains the rows: bumps against the grid's frame and can't get in
  const ep = igSettle(CK.email - 0.5);
  if (ep > 0.001) {
    const bump = Math.max(0, Math.sin(clamp((TT - CK.email) / 0.5) * Math.PI)) * 40, x = 1400 - bump + (1 - ep) * 200, y = 300;
    igCard(x, y, 420, 170, ep, { r: 18 });
    igIcon('mail', x + 56, y + 62, 48, IG.navy, { w: 8 });
    igText('“They’re looking at', x + 104, y + 58, 24, IG.navyT, { weight: 600 });
    igText('other options…”', x + 104, y + 90, 24, IG.navyT, { weight: 600 });
    igText('outside the grid', x + 104, y + 136, 22, IG.textD, { weight: 600 });
  }
  // a count ticks down and nobody can say why
  const np = igSettle(CK.why - 0.6);
  if (np > 0.001) {
    const x = 1400, y = 530, v = Math.round(lerp(212, 188, EZ.io(clamp((TT - CK.why + 0.3) / 1.0))));
    igCard(x, y, 420, 200, np, { r: 18 });
    igText('Active units', x + 36, y + 56, 26, IG.textD, { weight: 600 });
    igText(String(v), x + 36, y + 150, 86, IG.navyT, { weight: 700, font: IGHEAD });
    igAt(x + 340, y + 118, igPop(CK.changed), () => {
      igShadow(() => { ctx.beginPath(); ctx.arc(x + 340, y + 118, 44, 0, TAU); ctx.fillStyle = IG.teal; ctx.fill(); }, { blur: 16, dy: 5 });
      igText('?', x + 340, y + 136, 52, IG.white, { align: 'center', weight: 700, font: IGHEAD });
    });
  }
  ebBand('NUMBERS, NOT BELIEFS', 968, igPop(CK.band, { k: 200, damp: 0.6 }));
}
