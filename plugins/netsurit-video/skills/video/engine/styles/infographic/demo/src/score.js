  // SCORE BODY — infographic demo (inside buildScore(); see kit/score-head.js). Bright, tidy corporate pop.
  const T = TIMELINE, q = T.cues;
  to = 'm';
  pad(0.0, 3.1, ['F3', 'A3', 'C4', 'E4'], 0.03, { type: 'triangle', cut: 1600, att: 0.3, rel: 0.3, send: 0.4 });
  pad(3.0, 6.05, ['D3', 'F3', 'A3', 'C4'], 0.03, { type: 'triangle', cut: 1800, att: 0.2, rel: 0.4, send: 0.4 });
  for (let i = 0; i < 12; i++) pluck(i * E8, nz(['F2', 'C3', 'F2', 'A2'][i % 4]), 0.08, 0, 0.3, 900, 0.2);
  for (let i = 0; i < 12; i++) pluck(3 + i * E8, nz(['D2', 'A2', 'D2', 'F2'][i % 4]), 0.08, 0, 0.3, 900, 0.2);
  pluck(q.disc, nz('C5'), 0.12, -0.1, 0.5, 2600, 0.3);
  pluck(q.bars, nz('E5'), 0.1, 0.2, 0.5, 2600, 0.3);
  pluck(q.bubble, nz('G5'), 0.1, -0.2, 0.5, 2600, 0.3);
  chime(q.header, [nz('A5'), nz('E6')], 0.06, 0);
  to = 's';
  for (let i = 0; i < 4; i++) blip(q.bars + i * 0.09, 1200 + i * 200, 900, 0.025, 0.03);
  for (let i = 0; i < 3; i++) blip(q.checks + i * 0.12, 2000 + i * 300, 1600, 0.03, 0.03, i % 2 ? 0.2 : -0.2);
  blip(q.hop, 500, 1100, 0.08, 0.04);
  sweep(2.6, 3.05, 0.008, 600, 2400, 0);
  for (let i = 0; i < 5; i++) blip(q.rows + i * 0.1, 2600, 2200, 0.012, 0.02);
  for (let i = 0; i < 3; i++) blip(q.pills + i * 0.25, 1500 + i * 250, 1300, 0.035, 0.035, (i - 1) * 0.25);
