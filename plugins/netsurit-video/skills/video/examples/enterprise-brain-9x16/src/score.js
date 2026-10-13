  // SCORE BODY — The Enterprise Brain (inside buildScore(); see kit/score-head.js). Sits under the voice
  // (the head's duck lowers the music bus while George speaks). Thin and minor through the keepers, a hard
  // stop after "…and why", the loudest hit when the slot becomes the head, warm major for the brain,
  // a tick motif that stops on "nothing at all", the fullest stretch on "every customer", a resolving close.
  const D = DURATION;
  // chords every 4 s (two bars at 120 BPM); each section names its own progression
  function chords(t0, t1, prog, peak, o = {}) {
    for (let t = t0, i = 0; t < t1 - 0.5; t += 4, i++) pad(t, Math.min(t + 4.15, t1), prog[i % prog.length], peak, { type: 'triangle', cut: o.cut ?? 1500, att: 0.5, rel: 0.4, send: 0.45 });
  }
  function arp(t0, t1, prog, vel, step = E8, o = {}) {
    for (let t = t0, i = 0; t < t1 - 0.05; t += step, i++) {
      const ch = prog[Math.floor((t - t0) / 4) % prog.length];
      pluck(t, nz(ch[i % ch.length]) * (o.oct ?? 2), vel * (i % 4 === 0 ? 1 : 0.7), (i % 2 ? 0.25 : -0.25), 0.3, o.bright ?? 2000, 0.3);
    }
  }
  const MINOR = [['D3', 'F3', 'A3', 'C4'], ['A2', 'D3', 'F3', 'A3'], ['F3', 'A3', 'C4', 'E4'], ['C3', 'E3', 'G3', 'C4']];
  const MAJOR = [['D3', 'Fs3', 'A3', 'D4'], ['B2', 'D3', 'Fs3', 'B3'], ['G3', 'B3', 'D4', 'G4'], ['A2', 'E3', 'A3', 'Cs4']];
  const CLOSE = [['G3', 'B3', 'D4', 'G4'], ['Fs3', 'A3', 'D4', 'Fs4'], ['E3', 'G3', 'B3', 'E4'], ['D3', 'Fs3', 'A3', 'D4']];
  const STOP = VL('t2').t1 + 0.05;   // everything musical ends here: the silence before the hit

  to = 'm';
  // ---- hook: a soft minor pad, sparse plucks on the beat
  chords(0.4, M_LIB, MINOR, 0.018, { cut: 1100 });
  arp(1.0, M_LIB, MINOR, 0.045, BEAT, { bright: 1500 });
  // ---- the keepers: the same minor loop, a touch fuller; plucks on 8ths
  chords(M_LIB, M_TRN, MINOR, 0.022);
  arp(M_LIB, M_TRN, MINOR, 0.05, E8);
  // the deflating figure on "both weigh the same": a falling minor third, slow
  pluck(LB.same, nz('A4'), 0.14, -0.1, 0.6, 2200, 0.4); pluck(LB.same + 0.45, nz('F4'), 0.12, 0.1, 0.9, 1600, 0.4);
  // band hits: WORDS / NUMBERS, NOT BELIEFS
  for (const t of [LB.band, CK.band]) { pluck(t, nz('D4'), 0.16, 0, 0.5, 2400, 0.4); pluck(t, nz('A4'), 0.12, 0, 0.5, 2400, 0.4); bass(t, nz('D2'), 0.14); }
  // ---- the turn: thinner, then a hard stop
  chords(M_TRN, STOP, [['D3', 'F3', 'A3'], ['Bb2', 'D3', 'F3']], 0.02, { cut: 900 });
  // ---- THE HIT: a short chord stab and a sub as the slot becomes the head; then a flat chord
  [nz('D4'), nz('Fs4'), nz('A4'), nz('D5')].forEach((f, i) => pluck(HIT, f, 0.36, (i - 1.5) * 0.2, 0.45, 4200, 0.5));
  bass(HIT, nz('D2'), 0.5);
  pad(HIT + 0.05, HIT + 3.6, ['D3', 'A3', 'D4', 'Fs4'], 0.026, { type: 'triangle', cut: 1600, att: 0.25, rel: 1.2, send: 0.6 });
  // ---- the brain: warm major, the rising fifth on "keeps"
  chords(HIT + 3.4, M_SIG, MAJOR, 0.022, { cut: 1700 });
  arp(HIT + 3.4, M_SIG, MAJOR, 0.045, E8, { bright: 2600 });
  pluck(BR.keeps, nz('D5'), 0.13, -0.15, 0.6, 3000, 0.45); pluck(BR.keeps + 0.3, nz('A5'), 0.13, 0.15, 0.9, 3000, 0.45);
  // ---- signals: the minor loop returns, then the tick motif stops on "nothing at all"
  chords(M_SIG, SG.nothing - 0.1, MINOR, 0.018, { cut: 1100 });
  chords(SG.nothing + 1.4, SG.every - 0.3, MINOR, 0.02, { cut: 1200 });
  // ---- every customer: the fullest stretch — major, 8th bass, 16th plucks
  chords(SG.every - 0.3, M_END, MAJOR, 0.032, { cut: 2400 });
  arp(SG.every - 0.3, M_END, MAJOR, 0.06, E16, { bright: 3200 });
  for (let t = SG.every - 0.3; t < M_END - 0.1; t += E8) bass(t, nz(MAJOR[mod(Math.floor((t - SG.every + 0.3 + 1e-6) / 4), 4)][0]) / 2, 0.09);
  // ---- the close: resolving, ends on a long D major before the frame holds
  chords(M_END, VL('e3').t0, CLOSE, 0.008, { cut: 1100 });
  arp(M_END, VL('r2').t1, CLOSE, 0.016, BEAT, { bright: 1500 });
  pad(VL('e3').t0, D - 0.15, ['D3', 'A3', 'D4', 'Fs4', 'A4'], 0.012, { type: 'triangle', cut: 1500, att: 0.6, rel: 2.5, send: 0.6 });
  pluck(LP.stays + 0.3, nz('D5'), 0.1, 0, 1.2, 2400, 0.6);

  to = 's';
  // the hit's weight stays on the sfx bus (unpitched), so it also lands under a supplied track (Eleven Music pilot)
  sub(HIT, 0.95); noiseHit(HIT, 0.3, 'lowpass', 2200, 0.7, 0.25, 0, 0.4);
  // hook: the stamp, facts popping, the "?" rising
  sub(HK.stamp, 0.06); noiseHit(HK.stamp, 0.08, 'lowpass', 900, 0.8, 0.04);
  HK_FACTS.forEach((_, i) => blip(HK.facts + i * 0.12, 900 + i * 150, 700 + i * 120, 0.05, 0.03, (i - 2) * 0.2));
  blip(HK.ask, 500, 1300, 0.18, 0.04);
  // librarian: sources pop, three light, the calendar flips
  LB_DOCS.forEach((_, i) => blip(LB.docs + i * 0.08, 1500 + i * 60, 1300, 0.03, 0.015, (i % 4 - 1.5) * 0.2));
  LB_LIT.forEach((_, i) => chime(LB.first + i * 0.12, [nz('A5'), nz('E6')], 0.025, (i - 1) * 0.3));
  blip(LB.tomorrow, 1800, 900, 0.07, 0.03);
  // clerk: the query types, twenty rows click, the cut line
  for (let i = 0; i < 16; i++) blip(CK.query + i * 0.1, 2400, 2300, 0.012, 0.012, 0.2);
  for (let i = 0; i < 20; i++) blip(CK.rows + i * 0.06, 1200 + (i % 4) * 100, 1100, 0.015, 0.016, -0.15);
  noiseHit(CK.twenty, 0.05, 'highpass', 3000, 0.7, 0.03);
  // claim: a soft chime per row as it pops
  CL_ROWS(false).forEach(([, , t], i) => blip(t, 2000 + i * 80, 1800, 0.03, 0.014, 0.1));
  sweep(CL.changes - 0.25, CL.changes + 0.15, 0.01, 800, 2600, 0.2);
  // signals: weekly ticks that stop on "nothing at all"
  for (let t = M_SIG + 0.6; t < SG.nothing - 0.2; t += BEAT) blip(t, 1400, 1350, 0.02, 0.022, -0.1);
  chime(SG.task + 0.3, [nz('D5'), nz('A5')], 0.03, 0);
  // close: the outcome flows back, the rings each quarter
  for (let i = 0; i < 4; i++) chime(LP.quarter + i * 0.35, [nz(['D5', 'Fs5', 'A5', 'D6'][i])], 0.02, (i - 1.5) * 0.25);
