// =====================================================================
//  ERAS, CAMERAS, BRIDGES — netsurit-soft demo (read by kit/morph.js). Era 1 -> 2 and 2 -> 3 are hard cuts under
//  the kit's diagonal wipes (NSS_WIPES); era 0 -> 1 is a shape morph: the right-hand lamp shade becomes the big one.
// =====================================================================
const ERA_BG = ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'];
function pieceCam(era, t) { return era === 3 ? push(t, 9.2, 11.8, { z: 1.03, p: [540, 900], to: [540, 900] }) : null; }
const BRIDGES = [
  { tc: 3.0, A: () => ({ P: nssLampShadePts(LAMP_A.x, LAMP_A.top, LAMP_A.len, LAMP_A.r, 'a2'), c: NSS.ink }),
             B: () => ({ P: nssLampShadePts(LAMP_B.x, LAMP_B.top, LAMP_B.len, LAMP_B.r, 'b'), c: NSS.ink }) },
];
