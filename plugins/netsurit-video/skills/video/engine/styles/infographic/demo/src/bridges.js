// =====================================================================
//  ERAS, CAMERAS, BRIDGES — infographic demo (read by kit/morph.js)
// =====================================================================
const ERA_BG = [IG.white, IG.wash];
function pieceCam(era, t) { return era === 0 ? push(t, 0.0, 2.6, { z: 1.03, p: [520, 900], to: [520, 900] }) : null; }
const BRIDGES = [
  // the cream disc inside the head -> the knowledge card
  { tc: 3.0, A: () => ({ P: ellipsePts(DISC[0], DISC[1], DISC[2], DISC[2], 0, 72), c: IG.cream }), B: () => ({ P: rrectPts(CARD.x, CARD.y, CARD.w, CARD.h, 26, 6), c: IG.white }) },
];
