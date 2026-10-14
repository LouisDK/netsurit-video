  // SCORE BODY — netsurit-soft demo (inside buildScore(); see kit/score-head.js). A light bed, blips on pop-ins,
  // a soft sweep under each wipe, the hit as the arrow lands.
  const cu = TIMELINE.cues;
  to = 'm';
  pad(0.0, 6.1, ['D3', 'A3', 'Fs4'], 0.03, { type: 'triangle', cut: 1200, att: 0.4, rel: 0.4, send: 0.4 });
  pad(6.0, 9.1, ['B2', 'Fs3', 'D4'], 0.03, { type: 'triangle', cut: 1300, att: 0.3, rel: 0.4, send: 0.4 });
  pad(9.4, 12.0, ['G3', 'B3', 'D4', 'A4'], 0.036, { type: 'triangle', cut: 1800, att: 0.2, rel: 0.6, send: 0.5 });
  pad(11.7, TOTAL, ['G3', 'D4', 'B4'], 0.01, { type: 'triangle', cut: 1100, att: 0.6, rel: 2.5, send: 0.6 });
  to = 's';
  [0.1, 0.3, 0.5].forEach((d, i) => pluck(cu.team + d, nz(['D4', 'Fs4', 'A4'][i]) * 2, 0.12, (i - 1) * 0.3, 0.3, 2400, 0.3));
  for (let i = 0; i < 10; i++) blip(cu.desk + 0.6 + i * E16, 1500 + (i % 3) * 250, 1300, 0.02, 0.025);
  [5.65, 8.65].forEach((t) => sweep(t, t + 0.7, 0.008, 500, 2600, 0));
  [0, 0.2, 0.4].forEach((d, i) => blip(cu.rows + d, 2200 + i * 250, 1900, 0.03, 0.03));
  [nz('D4'), nz('Fs4'), nz('A4'), nz('D5')].forEach((f, i) => pluck(cu.arrow + 0.6, f, 0.3, (i - 1.5) * 0.2, 0.45, 4200, 0.5));
