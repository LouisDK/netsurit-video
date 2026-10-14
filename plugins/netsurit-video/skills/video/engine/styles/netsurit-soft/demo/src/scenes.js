// =====================================================================
//  SCENES — netsurit-soft demo. World coordinates 1080x1920; motion on 1s; springs from the kit (nssPop / nssSettle).
// =====================================================================
const LAMP_A = { x: 860, top: -20, len: 450, r: 80 };    // the right-hand lamp over the team (the morph's start)
const LAMP_B = { x: 790, top: -20, len: 330, r: 112 };   // the lamp over the desk (the morph's end)

function sceneTeam() {
  const t0 = TIMELINE.cues.team;
  nssIn(540, 1010, nssSettle(t0 - 0.25), () => {
    nssArch(-40, 240, 1160, 770, NSS.mist);
    nssSkyline(1010, [[30, 90, 220, false, NSS.fog], [140, 76, 320, false, NSS.mistD], [236, 104, 190, false, NSS.fog], [360, 84, 350, true, NSS.fog],
      [470, 30, 420, false, NSS.mistD], [526, 120, 250, false, NSS.fog], [668, 92, 320, false, NSS.mistD], [780, 72, 200, false, NSS.fog], [870, 112, 290, true, NSS.fog], [1000, 70, 230, false, NSS.mistD]]);
  });
  nssLamp(200, -20, 500, 78, 'a1');
  nssLamp(LAMP_A.x, LAMP_A.top, LAMP_A.len, LAMP_A.r, 'a2');
  nssPlant(60, 1535, 1.2, 'pl1');
  nssChair(210, 1330, 1, { floor: 1540 });
  nssChair(880, 1330, -1, { floor: 1540 });
  // the middle person sits behind the table
  nssIn(620, 1330, nssPop(t0 + 0.3), () => nssPerson(620, 1330, 58, { pose: 'sit', f: 0, noLegs: true, hair: 'short', key: 'mid', hands: [[580, 1218], [662, 1218]] }));
  nssRR(280, 1225, 560, 24, 12, NSS.fogD);
  nssRR(548, 1249, 24, 270, 6, NSS.ink); nssRR(470, 1520, 180, 20, 10, NSS.ink);
  nssLaptop(380, 1099, 170, { chart: true, p: nssDraw(t0 + 0.9, 1.0) });
  // the man pointing at the chart, the woman in red trousers
  nssIn(210, 1540, nssPop(t0 + 0.1), () => nssPerson(210, 1330, 62, { pose: 'sit', f: 1, floor: 1540, key: 'left', hands: [[428, 1146], [340, 1222]], point: [480, 1120] }));
  nssIn(880, 1540, nssPop(t0 + 0.5), () => nssPerson(880, 1330, 62, { pose: 'sit', f: -1, floor: 1540, legs: NSS.red, hair: 'bun', key: 'right', hands: [[748, 1218], [805, 1222]] }));
  nssLowerThird({ out: 2.6, y: 1575 });   // the byline stands in for the first caption
}

function sceneDesk() {
  const t0 = TIMELINE.cues.desk;
  nssIn(540, 1290, nssSettle(t0 - 0.4), () => nssArch(60, 330, 960, 960, NSS.mist));
  nssArch(150, 880, 300, 420, NSS.fog);   // the chair's back
  nssLamp(LAMP_B.x, LAMP_B.top, LAMP_B.len, LAMP_B.r, 'b');
  nssPlant(985, 1240, 1.25, 'pl2');
  // typing: the hands tap in turn
  const tap = (i) => (mod(TT * 7 + i * 0.5, 1) < 0.5 ? -6 : 0) * nssSettle(t0 + 0.6);
  nssPerson(470, 1420, 150, { pose: 'sit', f: 1, noLegs: true, key: 'desk', hands: [[655, 1212 + tap(0)], [740, 1218 + tap(1)]] });
  // the red laptop, seen from behind, its lid tilted
  nssIn(800, 1240, nssPop(t0 + 0.15), () => {
    nssFill([[690, 975], [985, 975], [915, 1236], [620, 1236]], NSS.red);
    nssCirc(802, 1105, 24, NSS.white);
    nssRR(596, 1226, 370, 18, 9, NSS.redD);
  });
  // the desk
  nssRR(-20, 1240, 1120, 36, 0, NSS.mistD);
  nssRR(-20, 1276, 1120, 290, 0, NSS.steel);
  nssRR(-80, 1340, 420, 226, [0, 80, 0, 0], NSS.mist);
  // a mug
  nssIn(232, 1240, nssPop(t0 + 0.45), () => {
    ctx.save(); ctx.lineWidth = 12; ctx.strokeStyle = NSS.fog; ctx.beginPath(); ctx.arc(278, 1188, 26, -Math.PI / 2, Math.PI / 2); ctx.stroke(); ctx.restore();
    nssRR(190, 1150, 88, 90, [6, 6, 18, 18], NSS.white);
  });
  nssCaption([['One person, '], ['the right tools', 1], ['.']]);
}

function sceneSheet() {
  const t = TIMELINE.cues.rows, tc = TIMELINE.cues.chart;
  nssRow(110, 300, 820, 190, 'Cloud', 'cloud', nssSettle(t), { hero: true, t });
  nssRow(110, 530, 820, 190, 'Secure', 'shield', nssSettle(t + 0.2), { t: t + 0.2 });
  nssRow(110, 760, 820, 190, 'Manage', 'bars', nssSettle(t + 0.4), { t: t + 0.4 });
  nssChart(170, 1460, 740, 380, [0.32, 0.5, 0.72, 1.0], nssDraw(tc, 1.0), { trend: tc + 0.7 });
  nssSkel(170, 1500, 740, 2, nssDraw(tc + 0.5, 0.6));
  nssCaption([['Everything you run, '], ['handled', 1], ['.']]);
}

function sceneRise() {
  const t = TIMELINE.cues.arrow;
  nssDome(190, 1580, 250, NSS.fog); nssDome(590, 1580, 170, NSS.mist); nssDome(980, 1580, 230, NSS.fogD);
  nssIn(300, 560, nssSettle(t - 0.3), () => nssCloud(300, 540, 175, NSS.fog));
  nssIn(905, 360, nssPop(t - 0.2), () => nssRR(840, 230, 130, 130, 26, NSS.fogD));
  nssCirc(210, 860, 52 * nssPop(t), NSS.amber);
  nssDevice(690, 1050, 290, 240, nssPop(t + 0.15));
  nssConnector([[300, 600], [300, 690], [440, 690]], nssDraw(t + 0.1, 0.5), { t1: t + 0.6 });
  nssConnector([[840, 295], [640, 295], [640, 440]], nssDraw(t + 0.2, 0.5), { t1: t + 0.7 });
  nssConnector([[262, 860], [380, 860], [380, 1060]], nssDraw(t + 0.3, 0.5), { t1: t + 0.8 });
  nssConnector([[690, 1170], [560, 1170], [560, 1420]], nssDraw(t + 0.4, 0.5), { t1: t + 0.9 });
  const p = nssSettle(t + 0.35, { k: 80, damp: 0.78 });
  nssArrow(170, 1400, 1130, 125, p);
  if (p > 0.5) SPARK_AT = toScreen(170 + 799 * p, 1400 - 799 * p);
  nssCaption([['Built to '], ['scale', 1], ['.']]);
  nssEndCard(DURATION - 0.3);
}
