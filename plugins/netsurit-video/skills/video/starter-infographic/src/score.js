  // SCORE BODY (inside buildScore(); see the engine's kit/score-head.js). A composed bed for previews and for pieces
  // without a track. With a music track (piece.json "music"), export replaces the 'm' bus with it and keeps only the
  // 's' bus (sound effects): so keep every hit you need under a track on 's'.
  // Under a voice, the head's duck lowers the music while the narrator speaks. Thin and unresolved for the problem,
  // a hard stop before the payoff, the loudest moment as the head arrives (HIT), a warm resolve to the end card.
  function chords(t0, t1, prog, peak, o = {}) {
    for (let t = t0, i = 0; t < t1 - 0.5; t += 4, i++) pad(t, Math.min(t + 4.15, t1), prog[i % prog.length], peak, { type: 'triangle', cut: o.cut ?? 1500, att: 0.5, rel: 0.4, send: 0.45 });
  }
  function arp(t0, t1, prog, vel, step = E8, o = {}) {
    for (let t = t0, i = 0; t < t1 - 0.05; t += step, i++) {
      const ch = prog[Math.floor((t - t0) / 4) % prog.length];
      pluck(t, nz(ch[i % ch.length]) * 2, vel * (i % 4 === 0 ? 1 : 0.7), (i % 2 ? 0.25 : -0.25), 0.3, o.bright ?? 2000, 0.3);
    }
  }
  const MINOR = [['D3', 'F3', 'A3', 'C4'], ['A2', 'D3', 'F3', 'A3'], ['F3', 'A3', 'C4', 'E4'], ['C3', 'E3', 'G3', 'C4']];
  const MAJOR = [['D3', 'Fs3', 'A3', 'D4'], ['B2', 'D3', 'Fs3', 'B3'], ['G3', 'B3', 'D4', 'G4'], ['A2', 'E3', 'A3', 'Cs4']];
  const STOP = M2 - 0.6;   // the music stops here: the silence before the hit

  to = 'm';
  chords(0.3, M1, MINOR, 0.018, { cut: 1100 });
  arp(0.8, M1, MINOR, 0.045, BEAT, { bright: 1500 });
  chords(M1, STOP, MINOR, 0.022);
  arp(M1, STOP, MINOR, 0.05, E8);
  // the payoff is the fullest stretch; the end card only a quiet tail (review: the gift is the loudest act, the goodbye decays)
  chords(HIT + 2.5, DURATION, MAJOR, 0.026, { cut: 1800 });
  arp(HIT + 2.5, DURATION - 0.5, MAJOR, 0.055, E8, { bright: 2600 });
  pad(DURATION - 0.3, TOTAL, ['D3', 'A3', 'D4', 'Fs4'], 0.008, { type: 'triangle', cut: 1100, att: 0.6, rel: 2.5, send: 0.6 });

  to = 's';
  // the hit: a chord stab and a sub as the card becomes the head (on 's', so it survives a supplied track)
  [nz('D4'), nz('Fs4'), nz('A4'), nz('D5')].forEach((f, i) => pluck(HIT, f, 0.36, (i - 1.5) * 0.2, 0.45, 4200, 0.5));
  bass(HIT, nz('D2'), 0.5);
  pad(HIT + 0.05, HIT + 3.0, ['D3', 'A3', 'D4', 'Fs4'], 0.024, { type: 'triangle', cut: 1600, att: 0.25, rel: 1.2, send: 0.6 });
  // small sounds on the things that appear
  LAY.facts.forEach((_, i) => blip(P0.facts + i * 0.12, 1500 + i * 180, 1200, 0.02, 0.03, (i - 2) * 0.2));
  blip(P0.ask, 700, 1400, 0.05, 0.05);
  sweep(M1 - 0.5, M1 + 0.05, 0.006, 600, 2400, 0);
  P1.rows.forEach((t, i) => blip(t, 2400 + i * 200, 2000, 0.014, 0.02));
  chime(P1.header, [nz('A5'), nz('E6')], 0.05, 0);
  [0, 1, 2].forEach((i) => blip(P2.answer + i * 0.2, 1800 + i * 300, 1500, 0.03, 0.03, (i - 1) * 0.25));
