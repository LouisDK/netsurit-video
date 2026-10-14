// =====================================================================
//  SCENES — the starter's four eras in the netsurit-soft style (engine/styles/netsurit-soft/STYLE.md has the kit).
//  World units = px on the frame (1080x1920 or 1920x1080). LAY holds every position, one arrangement per shape
//  (9:16 stacks, 16:9 sits side by side); scenes read only LAY. (Not "L": the engine uses that name inside the score.)
//  The team and the desk are drawn on a stage (1080 wide, the 9:16 frame's units) that 16:9 scales and centres, with
//  the wide backdrop drawn natively around it. Cues come from the voice (VW / VE / VL in the head).
// =====================================================================
const LAY = PORTRAIT ? {
  team: { x: 0, y: 0, k: 1 },                            // the team's stage: world = x + k * stage
  desk: { x: 0, y: 0, k: 1 },
  deskTop: 1240, deskBand: 36, deskFront: 290, drawer: [-80, 1340, 420, 226],
  cap: { y: 1650, size: 54 },                            // the caption, alone under the art
  rows: { x: 110, y: 300, w: 820, h: 190, dy: 230 },     // the services sheet
  chart: { x: 170, base: 1460, w: 740, h: 380 },
  rise: {
    domes: [[190, 1580, 250, 'fog'], [590, 1580, 170, 'mist'], [980, 1580, 230, 'fogD']],
    cloud: [300, 540, 175], square: [840, 230, 130], dot: [210, 860, 52], device: [690, 1050, 290, 240],
    arrow: [170, 1400, 1130, 125],
    links: [[[300, 600], [300, 690], [440, 690]], [[840, 295], [640, 295], [640, 440]], [[262, 860], [380, 860], [380, 1060]], [[690, 1170], [560, 1170], [560, 1420]]],
    cam: [540, 900],
  },
} : {
  team: { x: 593, y: -185, k: 0.68 },                    // the floor at 862: clear of the lower third and the caption
  desk: { x: 560, y: -114, k: 0.66 },
  deskTop: 704, deskBand: 22, deskFront: 170, drawer: [200, 780, 330, 116],
  cap: { y: 1000, size: 46 },
  rows: { x: 150, y: 190, w: 700, h: 160, dy: 196 },
  chart: { x: 1060, base: 790, w: 700, h: 520 },
  rise: {
    domes: [[330, 900, 230, 'fog'], [960, 900, 140, 'mist'], [1600, 900, 210, 'fogD']],
    cloud: [420, 330, 140], square: [1430, 110, 110], dot: [250, 600, 42], device: [1250, 470, 260, 200],
    arrow: [620, 880, 840, 104],
    links: [[[420, 370], [420, 470], [560, 470]], [[1430, 165], [1150, 165], [1150, 300]], [[292, 600], [440, 600], [440, 760]], [[1250, 570], [1110, 570], [1110, 690]]],
    cam: [960, 520],
  },
};
// a stage: draw fn in the 9:16 frame's units, scaled and placed by S; at(S, [x, y]) maps a stage point to the world
function stage(S, fn) { ctx.save(); ctx.translate(S.x, S.y); ctx.scale(S.k, S.k); fn(); ctx.restore(); }
const at = (S, [x, y]) => [S.x + x * S.k, S.y + y * S.k];
const caption = (segs, o = {}) => nssCaption(segs, { y: LAY.cap.y, size: LAY.cap.size, ...o });

// the bridge objects (stage units): the right-hand lamp over the team becomes the lamp over the desk
const LAMP_A = { x: 860, top: -20, len: 450, r: 80 };
const LAMP_B = { x: 790, top: -20, len: 330, r: 112 };
const lampPts = (S, L, key) => nssLampShadePts(L.x, L.top, L.len, L.r, key).map((p) => at(S, p));

// ---- era 0: the team at a table (the byline opens the piece)
const P0 = { team: 0.2, chart: VW('l1', 'business') - 0.3 };
const SKY9 = [[30, 90, 220, false, 'fog'], [140, 76, 320, false, 'mistD'], [236, 104, 190, false, 'fog'], [360, 84, 350, true, 'fog'],
  [470, 30, 420, false, 'mistD'], [526, 120, 250, false, 'fog'], [668, 92, 320, false, 'mistD'], [780, 72, 200, false, 'fog'], [870, 112, 290, true, 'fog'], [1000, 70, 230, false, 'mistD']];
const SKY16 = [[420, 80, 150, false, 'fog'], [512, 70, 230, false, 'mistD'], [596, 96, 130, false, 'fog'], [706, 80, 250, true, 'fog'], [800, 30, 290, false, 'mistD'],
  [846, 112, 170, false, 'fog'], [972, 86, 230, false, 'mistD'], [1072, 70, 140, false, 'fog'], [1156, 104, 210, true, 'fog'], [1274, 70, 160, false, 'mistD'], [1358, 96, 240, false, 'fog'], [1468, 60, 130, true, 'mistD']];
const sky = (S) => S.map(([x, w, h, d, c]) => [x, w, h, d, NSS[c]]);
function sceneTeam() {
  const t0 = P0.team, S = LAY.team;
  // the backdrop: a Mist arch and a skyline (natively wide on 16:9)
  if (PORTRAIT) nssIn(540, 1010, nssSettle(t0 - 0.25), () => { nssArch(-40, 240, 1160, 770, NSS.mist); nssSkyline(1010, sky(SKY9)); });
  else nssIn(960, 566, nssSettle(t0 - 0.25), () => { nssArch(380, 40, 1160, 526, NSS.mist); nssSkyline(566, sky(SKY16)); });
  if (!PORTRAIT) { nssLamp(480, -20, 280, 56, 'w1'); nssPlant(1530, 862, 0.95, 'wp1'); nssPlant(400, 862, 0.75, 'wp2'); }
  stage(S, () => {
    nssLamp(200, -20, 500, 78, 'a1');
    nssLamp(LAMP_A.x, LAMP_A.top, LAMP_A.len, LAMP_A.r, 'a2');
    if (PORTRAIT) nssPlant(60, 1535, 1.2, 'pl1');
    nssChair(210, 1330, 1, { floor: 1540 });
    nssChair(880, 1330, -1, { floor: 1540 });
    // the middle person sits behind the table
    nssIn(620, 1330, nssPop(t0 + 0.3), () => nssPerson(620, 1330, 58, { pose: 'sit', f: 0, noLegs: true, hair: 'short', key: 'mid', hands: [[580, 1218], [662, 1218]] }));
    nssRR(280, 1225, 560, 24, 12, NSS.fogD);
    nssRR(548, 1249, 24, 270, 6, NSS.ink); nssRR(470, 1520, 180, 20, 10, NSS.ink);
    nssLaptop(380, 1099, 170, { chart: true, p: nssDraw(P0.chart, 1.0) });
    // one points at the chart; one in red trousers (the frame's one red, with the laptop's bar)
    nssIn(210, 1540, nssPop(t0 + 0.1), () => nssPerson(210, 1330, 62, { pose: 'sit', f: 1, floor: 1540, key: 'left', hands: [[428, 1146], [340, 1222]], point: [480, 1120] }));
    nssIn(880, 1540, nssPop(t0 + 0.5), () => nssPerson(880, 1330, 62, { pose: 'sit', f: -1, floor: 1540, legs: NSS.red, hair: 'bun', key: 'right', hands: [[748, 1218], [805, 1222]] }));
  });
  nssLowerThird(PORTRAIT ? { out: M1 - 0.9, y: 1575 } : { out: M1 - 0.9 });   // the byline stands in for the first caption
}

// ---- era 1: one person at a red laptop (the lamp morphs in)
const P1 = { desk: M1 + 0.4, cap: VW('l2', 'fixing') };
function sceneDesk() {
  const t0 = P1.desk, S = LAY.desk;
  if (PORTRAIT) nssIn(540, 1290, nssSettle(t0 - 0.4), () => nssArch(60, 330, 960, 960, NSS.mist));
  else nssIn(960, LAY.deskTop, nssSettle(t0 - 0.4), () => nssArch(470, 40, 980, 700, NSS.mist));
  if (!PORTRAIT) nssPlant(400, LAY.deskTop, 1.0, 'wp3');
  stage(S, () => {
    nssArch(150, 880, 300, 420, NSS.fog);   // the chair's back
    nssLamp(LAMP_B.x, LAMP_B.top, LAMP_B.len, LAMP_B.r, 'b');
    nssPlant(985, 1240, 1.25, 'pl2');
    const tap = (i) => (mod(TT * 7 + i * 0.5, 1) < 0.5 ? -6 : 0) * nssSettle(t0 + 0.6);   // typing: the hands tap in turn
    nssPerson(470, 1420, 150, { pose: 'sit', f: 1, noLegs: true, key: 'desk', hands: [[655, 1212 + tap(0)], [740, 1218 + tap(1)]] });
    // the red laptop, seen from behind, its lid tilted
    nssIn(800, 1240, nssPop(t0 + 0.15), () => {
      nssFill([[690, 975], [985, 975], [915, 1236], [620, 1236]], NSS.red);
      nssCirc(802, 1105, 24, NSS.white);
      nssRR(596, 1226, 370, 18, 9, NSS.redD);
    });
  });
  // the desk, full width in both shapes
  nssRR(-20, LAY.deskTop, W + 40, LAY.deskBand, 0, NSS.mistD);
  nssRR(-20, LAY.deskTop + LAY.deskBand, W + 40, LAY.deskFront, 0, NSS.steel);
  const [dx, dy, dw, dh] = LAY.drawer; nssRR(dx, dy, dw, dh, [0, dh * 0.35, 0, 0], NSS.mist);
  stage(S, () => nssIn(232, 1240, nssPop(t0 + 0.45), () => {   // a mug
    ctx.save(); ctx.lineWidth = 12; ctx.strokeStyle = NSS.fog; ctx.beginPath(); ctx.arc(278, 1188, 26, -Math.PI / 2, Math.PI / 2); ctx.stroke(); ctx.restore();
    nssRR(190, 1150, 88, 90, [6, 6, 18, 18], NSS.white);
  }));
  caption([['Run the business, '], ['not the IT', 1], ['.']], { at: P1.cap - E0 - 0.3 });
}

// ---- era 2: the services sheet (a row per service on the words that name them; the red flag row is the hero)
const P2 = { rows: [VW('l3', 'cloud'), VW('l3', 'security'), VW('l3', 'support')], chart: VW('l3', 'one') - 0.2 };
function sceneSheet() {
  const R = LAY.rows, C = LAY.chart, t = P2.rows;
  [['Cloud', 'cloud'], ['Security', 'shield'], ['Support', 'person']].forEach(([label, icon], i) =>
    nssRow(R.x, R.y + i * R.dy, R.w, R.h, label, icon, nssSettle(t[i] - 0.15), { hero: i === 0, t: t[i] - 0.15 }));
  nssChart(C.x, C.base, C.w, C.h, [0.32, 0.5, 0.72, 1.0], nssDraw(P2.chart, 1.0), { trend: P2.chart + 0.7 });
  nssSkel(C.x, C.base + 40, C.w, 2, nssDraw(P2.chart + 0.5, 0.6));
  caption([['Everything you run, '], ['handled', 1], ['.']], { at: P2.chart - E0 });
}

// ---- era 3: the rise (the hit as the arrow lands), then the end card
const P3 = { free: VW('l4', 'free') };
function sceneRise() {
  const t = ARROW, R = LAY.rise;
  R.domes.forEach(([x, y, r, c]) => nssDome(x, y, r, NSS[c]));
  const [cx, cy, cs] = R.cloud; nssIn(cx, cy + 20, nssSettle(t - 0.3), () => nssCloud(cx, cy, cs, NSS.fog));
  const [sx, sy, ss] = R.square; nssIn(sx + ss / 2, sy + ss, nssPop(t - 0.2), () => nssRR(sx, sy, ss, ss, ss * 0.2, NSS.fogD));
  nssCirc(R.dot[0], R.dot[1], R.dot[2] * nssPop(t), NSS.amber);
  nssDevice(...R.device, nssPop(t + 0.15));
  R.links.forEach((P, i) => nssConnector(P, nssDraw(t + 0.1 + i * 0.1, 0.5), { t1: t + 0.6 + i * 0.1 }));
  const [ax, ay, al, ath] = R.arrow, p = nssSettle(t + 0.35, { k: 80, damp: 0.78 }), d = al * Math.SQRT1_2;
  nssArrow(ax, ay, al, ath, p);
  if (p > 0.5) SPARK_AT = toScreen(ax + d * p, ay - d * p);
  caption([['Free to '], ['grow', 1], ['.']], { at: P3.free - E0 - 0.2 });
  nssEndCard(DURATION - 0.3);
}
