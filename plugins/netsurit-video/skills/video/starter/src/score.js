  // SCORE BODY (inside buildScore(); see the engine's kit/score-head.js). A composed bed for previews and for pieces
  // without a track. With a music track (piece.json "music"), export replaces the 'm' bus with it and keeps only the
  // 's' bus (sound effects): so keep every hit you need under a track on 's'.
  // Under a voice, the head's duck lowers the music while the narrator speaks. Light and unresolved for the team and
  // the desk, a hard stop before the last wipe (the silence), the loudest moment as the arrow lands (HIT), a warm
  // resolve to the end card.
  function chords(t0, t1, prog, peak, o = {}) {
    for (let t = t0, i = 0; t < t1 - 0.5; t += 4, i++) pad(t, Math.min(t + 4.15, t1), prog[i % prog.length], peak, { type: 'triangle', cut: o.cut ?? 1400, att: 0.5, rel: 0.4, send: 0.45 });
  }
  function arp(t0, t1, prog, vel, step = E8, o = {}) {
    for (let t = t0, i = 0; t < t1 - 0.05; t += step, i++) {
      const ch = prog[Math.floor((t - t0) / 4) % prog.length];
      pluck(t, nz(ch[i % ch.length]) * 2, vel * (i % 4 === 0 ? 1 : 0.7), (i % 2 ? 0.25 : -0.25), 0.3, o.bright ?? 2000, 0.3);
    }
  }
  const SUS = [['D3', 'A3', 'E4', 'Fs4'], ['B2', 'Fs3', 'D4', 'A4'], ['G2', 'D3', 'A3', 'E4'], ['A2', 'E3', 'B3', 'E4']];
  const MAJOR = [['D3', 'Fs3', 'A3', 'D4'], ['B2', 'D3', 'Fs3', 'B3'], ['G3', 'B3', 'D4', 'G4'], ['A2', 'E3', 'A3', 'Cs4']];
  const STOP = W2 - 0.6;   // the music stops here: the silence before the hit

  to = 'm';
  chords(0.2, STOP, SUS, 0.02, { cut: 1200 });
  arp(0.6, W1, SUS, 0.04, BEAT, { bright: 1600 });
  arp(W1, STOP, SUS, 0.05, E8);
  // the payoff is the fullest stretch; the end card only a quiet tail (review: the gift is the loudest act, the goodbye decays)
  chords(HIT + 1.5, DURATION, MAJOR, 0.026, { cut: 1800 });
  arp(HIT + 1.5, DURATION - 0.5, MAJOR, 0.055, E8, { bright: 2600 });
  pad(DURATION - 0.3, TOTAL, ['D3', 'A3', 'D4', 'Fs4'], 0.008, { type: 'triangle', cut: 1100, att: 0.6, rel: 2.5, send: 0.6 });

  to = 's';
  // the hit: a chord stab and a sub as the arrow lands (on 's', so it survives a supplied track)
  [nz('D4'), nz('Fs4'), nz('A4'), nz('D5')].forEach((f, i) => pluck(HIT, f, 0.36, (i - 1.5) * 0.2, 0.45, 4200, 0.5));
  bass(HIT, nz('D2'), 0.5);
  pad(HIT + 0.05, HIT + 2.6, ['D3', 'A3', 'D4', 'Fs4'], 0.022, { type: 'triangle', cut: 1600, att: 0.25, rel: 1.2, send: 0.6 });
  // small sounds on the things that appear (keep every one well under the hit)
  [0.1, 0.3, 0.5].forEach((d, i) => pluck(P0.team + d, nz(['D4', 'Fs4', 'A4'][i]) * 2, 0.1, (i - 1) * 0.3, 0.3, 2400, 0.3));
  for (let i = 0; i < 10; i++) blip(P1.desk + 0.6 + i * E16, 1500 + (i % 3) * 250, 1300, 0.018, 0.025);
  sweep(W1 - 0.35, W1 + 0.35, 0.007, 500, 2600, 0);   // under the first wipe (the second stays silent: it's the turn)
  P2.rows.forEach((t, i) => blip(t - 0.15, 2200 + i * 250, 1900, 0.026, 0.03));
  chime(P2.chart + 0.7, [nz('A5'), nz('E6')], 0.04, 0);
