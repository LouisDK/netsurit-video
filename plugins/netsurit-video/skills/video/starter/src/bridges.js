// =====================================================================
//  ERAS, CAMERAS, BRIDGES — read by kit/morph.js. The team -> desk change is a shape morph in the pause between l1 and
//  l2 (the right-hand lamp shade becomes the big one: both ends are the shades the scenes draw, mapped through each
//  stage). The other two changes are hard cuts under the kit's diagonal wipes (NSS_WIPES in the head).
// =====================================================================
const ERA_BG = [NSS.white, NSS.white, NSS.white, NSS.white];
const BRIDGES = [
  { tc: M1, A: () => ({ P: lampPts(LAY.team, LAMP_A, 'a2'), c: NSS.ink }), B: () => ({ P: lampPts(LAY.desk, LAMP_B, 'b'), c: NSS.ink }) },
];

// ---- cameras: still, or a slow push of 3 % or less (the style's habit). Back to z = 1 before the bridge; the end card
// is drawn in screen space, so the last push can run under it.
function pieceCam(era, t) {
  if (era === 0) return push(t, 0.4, M1 - 0.5, { z: 1.02, p: [CX, H * 0.55], to: [CX, H * 0.55] }, M1 - 0.5, M1 - 0.1);
  if (era === 1) return push(t, M1 + 0.3, W1, { z: 1.025, p: at(LAY.desk, [700, 1150]), to: at(LAY.desk, [700, 1150]) });
  if (era === 3) return push(t, W2 + 0.2, DURATION - 0.3, { z: 1.03, p: LAY.rise.cam, to: LAY.rise.cam });
  return null;
}
