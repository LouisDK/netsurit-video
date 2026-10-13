// =====================================================================
//  ERA 0 — THE HOOK (illustration on white, 9:16). "It's Tuesday. A new regulation lands."
//  The hollow head (the company's memory, empty) fills the middle of the frame from frame 0, "you" stand on
//  the right. The rule drops onto the ground under the chin and stamps; two questions pop over the head;
//  the facts appear around the head, reach for it with dashed links that never arrive; "So who do you ask?"
//  swells into the bubble that becomes the Librarian's answer card.
// =====================================================================
const HK = {
  rule: VW('h1', 'regulation') - 0.15, stamp: VW('h1', 'lands'),
  q1: VW('h2', 'which', 1), q2: VW('h2', 'which', 2),
  facts: VW('h3', 'every'), reach: VW('h3', 'already'), none: VW('h3', 'no'),
  ask: VW('h4', 'who') - 0.2,
};
const HK_FACTS = [   // [x, y, icon] around the head: mail, meetings, CRM, docs, tickets
  [150, 500, 'mail'], [130, 800, 'people'], [150, 1130, 'db'], [930, 600, 'doc'], [965, 900, 'ticket'],
];
const HK_YOU = 958;
function sceneHook() {
  fillAll(IG.white);
  nsLowerThird();
  // the ground: a hairline with arrowheads drifting along it (there from frame 0)
  igFlow([[50, GROUND], [1030, GROUND]], 1, { arrows: 2, speed: 0.03 });
  // the hollow head breathes very slightly
  const br = 1 + Math.sin(TT * 1.1) * 0.004;
  igAt(HEAD0[0], HEAD0[1] + HEAD0[2] * 0.66, br, () => ebHollowHead(HEAD0[0], HEAD0[1], HEAD0[2]));
  // the facts pop in staggered; each reaches for the slot with a dashed link that stops short
  HK_FACTS.forEach(([x, y, ic], i) => {
    const p = igPop(HK.facts + i * 0.12);
    const q = ebFact(x, y, ic, p, i);
    if (p > 0.5) {
      const tx = DISC0[0], ty = DISC0[1], dx = tx - q[0], dy = ty - q[1], L = Math.hypot(dx, dy);
      const a = [q[0] + dx / L * 62, q[1] + dy / L * 62], b = [q[0] + dx * 0.55, q[1] + dy * 0.55];
      const reach = igDraw(HK.reach + i * 0.1, 1.0), fade = 1 - 0.6 * igDraw(HK.none, 0.8);
      ebDash([a, b], reach, { c: IG.lav, alpha: fade });
      // where the link gives up: a small hollow end
      if (reach > 0.98) { ctx.save(); ctx.globalAlpha = fade; ctx.beginPath(); ctx.arc(b[0], b[1], 7, 0, TAU); igLine(IG.lav, IG_HAIR); ctx.stroke(); ctx.restore(); }
    }
  });
  // "you": a figure on the right, looking at the head; hops a little when the rule lands
  igPerson(HK_YOU, GROUND, 300, { key: 'you', look: -1, hop: HK.stamp + 0.05 });
  // the rule: a page drops in from above and settles on the ground under the chin; a seal stamps it
  const rp = igSettle(HK.rule), ry = lerp(-560, 0, rp);
  if (rp > 0.001) {
    const x = 90, y = 1215 + ry, w = 170, h = 225;
    ctx.save(); ctx.translate(x + w / 2, y + h); ctx.rotate((1 - rp) * 0.25 + 0.04); ctx.translate(-x - w / 2, -y - h);
    igFill(rrectPts(x, y, w, h, 10, 3), IG.lav);
    igFill(rrectPts(x, y, w, 48, 10, 3), IG.indigo);
    igText('NEW RULE', x + w / 2, y + 33, 25, IG.white, { align: 'center', weight: 700, font: IGHEAD, track: 2 });
    for (let i = 0; i < 4; i++) igFill(rrectPts(x + 22, y + 72 + i * 26, (w - 44) * [1, 0.8, 0.9, 0.5][i], 10, 4, 2), IG.white);
    const sp = igPop(HK.stamp, { k: 260, damp: 0.42 });
    igAt(x + w - 40, y + h - 46, sp, () => {
      ctx.beginPath(); ctx.arc(x + w - 40, y + h - 46, 36, 0, TAU); ctx.fillStyle = IG.ink; ctx.fill();
      igIcon('check', x + w - 40, y + h - 46, 46, IG.white, { w: 9 });
    });
    ctx.restore();
  }
  // the two questions over the head (tails toward "you")
  // "So who do you ask?": the two questions shrink away and one big "?" bubble pops (the bridge object)
  const gone = 1 - igDraw(HK.ask - 0.1, 0.3);
  ebBubble(560, 240, 400, 100, igPop(HK.q1) * gone, 'Who’s affected?', 40, { tail: 1 });
  ebBubble(470, 380, 520, 100, igPop(HK.q2) * gone, 'Who’s about to leave?', 40, { tail: 1 });
  ebBubble(ASK.x, ASK.y, ASK.w, ASK.h, igPop(HK.ask), '?', 120, { tail: 1, font: IGHEAD });
  if (TT >= HK.none - 0.3) ebCaption2([[{ s: 'Every fact exists.' }], [{ s: 'No document holds the answer.', c: IG.tealT, weight: 700 }]], { at: HK.none - 0.3 - E0 });
}
