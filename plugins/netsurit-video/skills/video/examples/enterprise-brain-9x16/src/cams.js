// =====================================================================
//  CAMERAS (9:16) — gentle reframes on the words that name things (at most ~4.5% zoom, heavy springs), so long narrated
//  holds keep moving and the eye goes where George is pointing. Every era is back at z = 1 before its
//  bridge (the bridge object must be in frame). The view is clamped inside the frame: no edge ever shows.
// =====================================================================
const C0 = (t) => [t, 1, W / 2, H / 2];
// 9:16: the sheets (eras 1, 2, 3, 5, 6) zoom from the top edge (SHEET_ERAS), and there is ~220px of empty wash under
// their lowest card, so a <= 4% zoom crops nothing; their keys are the 16:9 ones with x pulled toward the centre (y unused).
const CAMS = [
  // 0 hook
  [C0(0), [VW('h2', 'questions'), 1.05, 760, 420], [VW('h2', 'leave'), 1.04, 700, 520], [VW('h3', 'every'), 1.02, 540, 820],
   [VW('h3', 'company'), 1.05, 560, 900], [VW('h3', 'answer'), 1.03, 540, 900], C0(VL('h4').t0)],
  // 1 the Librarian
  [C0(M_LIB), [VW('l1', 'librarian'), 1.05, 438, 0], [VW('l1', 'key'), 1.06, 408, 0], [VW('l2', 'email'), 1.06, 504, 0], [VW('l2', 'chats'), 1.03, 582, 0], [VW('l2', 'meeting'), 1.07, 462, 0],
   [VW('l2', 'fast'), 1.03, 480, 0], [VW('l3', 'rest'), 1.06, 504, 0], [VW('l4', 'old'), 1.07, 690, 0],
   [VW('l4', 'both'), 1.04, 672, 0], [VW('l5', 'tomorrow'), 1.06, 690, 0], [VW('l5', 'remembers'), 1.04, 522, 0],
   [VW('l5', 'company'), 1.06, 408, 0], [VW('l6', 'words'), 1.02, 540, 0], C0(VL('l6').t1)],
  // 2 the Clerk
  [C0(M_CLK), [VW('c1', 'clerk'), 1.05, 420, 0], [VW('c1', 'crm'), 1.07, 378, 0], [VW('c2', 'writes'), 1.07, 534, 0],
   [VW('c2', 'guesses'), 1.07, 534, 0], [VW('c3', 'hands'), 1.04, 534, 0], [VW('c3', 'twenty'), 1.06, 534, 0],
   [VW('c3', 'email'), 1.07, 690, 0], [VW('c3', 'number'), 1.07, 690, 0], [VW('c4', 'numbers'), 1.02, 540, 0], C0(VL('c4').t1)],
  // 3 the turn (held still through the silence)
  [C0(M_TRN), [VW('t1', 'words'), 1.04, 444, 0], [VW('t1', 'numbers'), 1.04, 636, 0], C0(VW('t2', 'missing'))],
  // 4 the brain arrives
  [C0(M_BRN), [VW('b2', 'watches'), 1.03, 500, 900], [VW('b2', 'notebook'), 1.06, 820, 1200], [VW('b2', 'nobody'), 1.05, 820, 1260], C0(VL('b2').t1)],
  // 5 one email, one claim
  [C0(M_CLM), [VW('b3', 'email'), 1.07, 408, 0], [VW('b3', 'moving'), 1.04, 480, 0], [VW('b3', 'january'), 1.07, 378, 0], [VW('b4', 'claim'), 1.04, 522, 0],
   [VW('b4', 'evidence'), 1.06, 480, 0], [VW('b4', 'sure'), 1.05, 606, 0], [VW('b4', 'true'), 1.06, 594, 0],
   [VW('b4', 'learned'), 1.02, 552, 0], [VW('b5', 'changes'), 1.06, 642, 0], [VW('b5', 'erased'), 1.03, 522, 0], [VW('b5', 'superseded'), 1.05, 558, 0], C0(VL('b5').t1)],
  // 6 silence, doubt, every customer
  [C0(M_SIG), [VW('b6', 'silence'), 1.05, 522, 0], [VW('b6', 'weekly'), 1.07, 612, 0], [VW('b6', 'review'), 1.07, 492, 0],
   [VW('b7', 'trouble'), 1.04, 582, 0], [VW('b7', 'nothing'), 1.07, 684, 0], [VW('b8', 'know'), 1.04, 462, 0],
   [VW('b8', 'possibly'), 1.07, 408, 0], [VW('b8', 'says'), 1.03, 522, 0], [VW('b8', 'missing'), 1.07, 408, 0], [VW('b8', 'cross'), 1.03, 492, 0], [VW('b8', 'task'), 1.06, 420, 0],
   [VW('b9', 'every'), 1.03, 612, 0], [VW('b9', 'working'), 1.06, 672, 0], C0(VL('b9').t1)],
  // 7 the loop and the close
  [C0(M_END), [VW('r1', 'decide'), 1.05, 720, 500], [VW('r1', 'flows'), 1.03, 700, 700], [VW('r1', 'sharpens'), 1.06, 600, 960],
   [VW('r2', 'librarian'), 1.06, 300, 1220], [VW('r2', 'ask'), 1.04, 380, 1060], [VW('e1', 'rented'), 1.06, 820, 420],
   [VW('e1', 'depreciate'), 1.07, 820, 380], [VW('e2', 'owned'), 1.06, 600, 1000], [VW('e2', 'compounds'), 1.04, 600, 960],
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
