// =====================================================================
//  ERAS, CAMERAS, BRIDGES — read by kit/morph.js. Each bridge sits in a pause between two chapters.
// =====================================================================
const ERA_BG = [IG.white, IG.wash, IG.wash, IG.wash, IG.white, IG.wash, IG.wash, IG.white];
// pieceCam: src/cams.js
const rr = (R, r = 24) => rrectPts(R.x, R.y, R.w, R.h, r, 6);
const disc = (d) => ellipsePts(d[0], d[1], d[2], d[2], 0, 72);
const BRIDGES = [
  { tc: M_LIB, A: () => ({ P: rr(ASK, 40), c: IG.white }), B: () => ({ P: rr(ANSWER), c: IG.white }) },      // the "?" -> the answer card
  { tc: M_CLK, A: () => ({ P: rrectPts(...LB_POS(0), 170, 96, 16, 6), c: IG.white }), B: () => ({ P: rr(LEDGER), c: IG.white }) },   // a document -> the ledger
  { tc: M_TRN, A: () => ({ P: rr(LEDGER), c: IG.white }), B: () => ({ P: rr(TURN_R), c: IG.white }) },       // the ledger -> its room
  { tc: M_BRN, d: 0.45, A: () => ({ P: disc(SLOT), c: IG.washD }), B: () => ({ P: igHeadPts(HEADB[0], HEADB[1], HEADB[2]), c: IG.saffron }) },   // the empty slot -> the head (IG.saffron is charcoal here)
  { tc: M_CLM, A: () => ({ P: disc(DISCB), c: IG.core }), B: () => ({ P: rr(EMAIL, 22), c: IG.white }) },   // the cream disc -> the email
  { tc: M_SIG, A: () => ({ P: rr(CLAIM), c: IG.white }), B: () => ({ P: rr(SIGCARD), c: IG.white }) },       // the claim -> the rhythm strip
  { tc: M_END, A: () => ({ P: ellipsePts(NET[0], NET[1], NET[2], NET[3], 0, 72), c: IG.washD }), B: () => ({ P: disc(DISC0), c: IG.core }) },   // the network -> the disc in the head
];
