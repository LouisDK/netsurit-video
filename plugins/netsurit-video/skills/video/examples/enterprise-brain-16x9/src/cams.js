// =====================================================================
//  CAMERAS — gentle reframes on the words that name things (at most ~4.5% zoom, heavy springs), so long narrated
//  holds keep moving and the eye goes where George is pointing. Every era is back at z = 1 before its
//  bridge (the bridge object must be in frame). The view is clamped inside the frame: no edge ever shows.
// =====================================================================
const C0 = (t) => [t, 1, W / 2, H / 2];
const CAMS = [
  // 0 hook
  [C0(0), [VW('h2', 'questions'), 1.06, 1300, 470], [VW('h2', 'leave'), 1.04, 1150, 560], [VW('h3', 'every'), 1.02, 1000, 540],
   [VW('h3', 'company'), 1.06, 1000, 520], [VW('h3', 'answer'), 1.03, 960, 560], C0(VL('h4').t0)],
  // 1 the Librarian
  [C0(M_LIB), [VW('l1', 'librarian'), 1.05, 620, 600], [VW('l1', 'key'), 1.06, 520, 620], [VW('l2', 'email'), 1.06, 840, 420], [VW('l2', 'chats'), 1.03, 1100, 420], [VW('l2', 'meeting'), 1.07, 700, 460],
   [VW('l2', 'fast'), 1.03, 760, 520], [VW('l3', 'rest'), 1.06, 840, 640], [VW('l4', 'old'), 1.07, 1460, 520],
   [VW('l4', 'both'), 1.04, 1400, 560], [VW('l5', 'tomorrow'), 1.06, 1460, 420], [VW('l5', 'remembers'), 1.04, 900, 540],
   [VW('l5', 'company'), 1.06, 520, 560], [VW('l6', 'words'), 1.02, 960, 700], C0(VL('l6').t1)],
  // 2 the Clerk
  [C0(M_CLK), [VW('c1', 'clerk'), 1.05, 560, 600], [VW('c1', 'crm'), 1.07, 420, 520], [VW('c2', 'writes'), 1.07, 940, 380],
   [VW('c2', 'guesses'), 1.07, 940, 440], [VW('c3', 'hands'), 1.04, 940, 600], [VW('c3', 'twenty'), 1.06, 940, 680],
   [VW('c3', 'email'), 1.07, 1460, 440], [VW('c3', 'number'), 1.07, 1460, 620], [VW('c4', 'numbers'), 1.02, 960, 700], C0(VL('c4').t1)],
  // 3 the turn (held still through the silence)
  [C0(M_TRN), [VW('t1', 'words'), 1.04, 640, 540], [VW('t1', 'numbers'), 1.04, 1280, 540], C0(VW('t2', 'missing'))],
  // 4 the brain arrives
  [C0(M_BRN), [VW('b2', 'watches'), 1.03, 820, 540], [VW('b2', 'notebook'), 1.06, 1300, 640], [VW('b2', 'nobody'), 1.05, 1400, 700], C0(VL('b2').t1)],
  // 5 one email, one claim
  [C0(M_CLM), [VW('b3', 'email'), 1.07, 520, 440], [VW('b3', 'moving'), 1.04, 760, 440], [VW('b3', 'january'), 1.07, 420, 480], [VW('b4', 'claim'), 1.04, 900, 560],
   [VW('b4', 'evidence'), 1.06, 760, 520], [VW('b4', 'sure'), 1.05, 1180, 560], [VW('b4', 'true'), 1.06, 1140, 680],
   [VW('b4', 'learned'), 1.02, 1000, 560], [VW('b5', 'changes'), 1.06, 1300, 560], [VW('b5', 'erased'), 1.03, 900, 560], [VW('b5', 'superseded'), 1.05, 1020, 700], C0(VL('b5').t1)],
  // 6 silence, doubt, every customer
  [C0(M_SIG), [VW('b6', 'silence'), 1.05, 900, 380], [VW('b6', 'weekly'), 1.07, 1200, 360], [VW('b6', 'review'), 1.07, 800, 440],
   [VW('b7', 'trouble'), 1.04, 1100, 420], [VW('b7', 'nothing'), 1.07, 1440, 400], [VW('b8', 'know'), 1.04, 700, 640],
   [VW('b8', 'possibly'), 1.07, 520, 720], [VW('b8', 'says'), 1.03, 900, 640], [VW('b8', 'missing'), 1.07, 520, 760], [VW('b8', 'cross'), 1.03, 800, 760], [VW('b8', 'task'), 1.06, 560, 820],
   [VW('b9', 'every'), 1.03, 1200, 720], [VW('b9', 'working'), 1.06, 1400, 740], C0(VL('b9').t1)],
  // 7 the loop and the close
  [C0(M_END), [VW('r1', 'decide'), 1.05, 1400, 480], [VW('r1', 'flows'), 1.03, 1100, 400], [VW('r1', 'sharpens'), 1.06, 820, 520],
   [VW('r2', 'librarian'), 1.06, 520, 640], [VW('r2', 'ask'), 1.04, 640, 580], [VW('e1', 'rented'), 1.06, 1320, 360],
   [VW('e1', 'depreciate'), 1.07, 1380, 320], [VW('e2', 'owned'), 1.06, 860, 480], [VW('e2', 'compounds'), 1.04, 820, 520],
   C0(VW('e3', 'move'))],
];
const SHEET_ERAS = [1, 2, 3, 5, 6];   // sheets zoom from the top edge, so the title never crops
function pieceCam(era, t) {
  const K = CAMS[era]; if (!K) return null;
  const z = 1 + (springTrack(K.map((k) => [k[0], k[1]]), SPRING.heavy) - 1) * 0.62;   // keys up to 1.07 -> at most ~4.5%
  let x = springTrack(K.map((k) => [k[0], k[2]]), SPRING.heavy), y = springTrack(K.map((k) => [k[0], k[3]]), SPRING.heavy);
  const hw = W / 2 / z, hh = H / 2 / z;
  x = clamp(x, hw, W - hw); y = SHEET_ERAS.includes(era) ? hh : clamp(y, hh, H - hh);
  return Math.abs(z - 1) < 1e-4 ? null : camOf({ z, p: [x, y], to: [W / 2, H / 2] });
}
