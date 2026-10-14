// =====================================================================
//  styles/netsurit-soft/brand.js — the Netsurit furniture for the soft style (the infographic look has its own in the
//  plugin's netsurit/brand.js, which patches that kit and can't load here). List it first in piece.json "scenes":
//  ["styles/netsurit-soft/brand.js", "src/scenes.js", ...]. Needs from the head: W, H, CX, SAFE, TOTAL (the last
//  frame's time), BYLINE; and assets/N2026.png (the lockup) for the end card.
//  nssSymbol (the N, drawn in the 2026 red), nssLowerThird (the opening byline), nssEndCard (the black back page).
// =====================================================================
const NSS_PHONE = H > W;
const NSS_BYLINE = Object.assign({ title: 'Untitled', name: '', unit: 'Netsurit Innovate', date: '', eyebrow: null, tagline: [] },
  typeof BYLINE !== 'undefined' ? BYLINE : {});

// the N symbol from the logo's geometry (N.png, 1214 px), in the 2026 red. h = its height; returns its width.
function nssSymbol(x, y, h, c = NSS.red) {
  const k = h / 698, X = (v) => x + (v - 328) * k, Y = (v) => y + (v - 257) * k;
  nssFill([[328, 257], [470, 257], [586, 432], [470, 432], [470, 955], [328, 955]].map(([a, b]) => [X(a), Y(b)]), c);
  nssFill([[819, 257], [960, 257], [960, 955], [819, 955], [703, 780], [819, 780]].map(([a, b]) => [X(a), Y(b)]), c);
  return (960 - 328) * k;
}

// the opening lower third: the N, the title and the byline, bottom left inside the safe area, in at 0.4 s, out at
// 10.6 s (o.in / o.out). Call it from the first scene and keep that corner clear (it sits where the caption goes:
// start the first caption after o.out). Screen space, so the camera never moves it.
function nssLowerThirdNow(o) {
  const tin = o.in ?? 0.4, tout = o.out ?? 10.6, a = nssSettle(tin), z = 1 - nssDraw(tout, 0.5);
  if (a <= 0.001 || z <= 0.001) return;
  ctx.save(); ctx.globalAlpha = clamp(a * 1.4) * z;
  const B = NSS_BYLINE, sy = (1 - a) * 14;
  if (NSS_PHONE) {
    const x = o.x ?? 80, y = o.y ?? H - SAFE.bottom - 152, sw = nssSymbol(x, y + sy - 4, 84);
    nssText(B.title, x + sw + 30, y + sy + 34, 44, NSS.ink, { frac: nssDraw(tin + 0.15, 0.5) });
    nssText(B.name, x + sw + 30, y + sy + 80, 30, NSS.ink, { frac: nssDraw(tin + 0.35, 0.6) });
    nssText([B.unit, B.date].filter(Boolean).join('  ·  '), x + sw + 30, y + sy + 120, 28, '#6E7378', { weight: 400, frac: nssDraw(tin + 0.45, 0.6) });
  } else {
    const x = o.x ?? 96, y = o.y ?? H - SAFE.bottom - 4, sw = nssSymbol(x, y + sy - 4, 66);
    nssText(B.title, x + sw + 26, y + sy + 26, 34, NSS.ink, { frac: nssDraw(tin + 0.15, 0.5) });
    nssRich([{ s: B.name, c: NSS.ink }, { s: ['', B.unit, B.date].filter((s, i) => !i || s).join('  ·  '), c: '#6E7378', weight: 400 }],
      x + sw + 26, y + sy + 60, 24, { frac: nssDraw(tin + 0.35, 0.6) });
  }
  ctx.restore();
}
const nssLowerThird = (o = {}) => { const f = () => nssLowerThirdNow(o); if (DEFER) DEFER.push(f); else f(); };

// the end card (the CI's back page): black, the 2026 lockup, a Steel rule, the eyebrow (red caps), the tagline, the
// byline, "Break free from ordinary IT.", netsurit.com and the legal line. It opens with a diagonal wipe (the style's
// scene change) at t0 and the lines spring in; call it at the end of the last scene: nssEndCard(DURATION - 0.3).
function nssEndCardNow(t0) {
  const u = clamp((TT - t0) / 0.7); if (u <= 0) return;
  const B = NSS_BYLINE, eyebrow = (B.eyebrow ?? B.title).toUpperCase(), tag = [].concat(B.tagline || []);
  ctx.save(); screen();
  // the wipe in: a red bar leads the black panel across along the N's 45°
  const e = EZ.io(u), S = W + H, rs = 110, c2 = lerp(-H - 10, W + rs + 30, e), c1 = c2 - rs;
  const band = (a, b, col) => nssFill([[a - 200, -200], [b - 200, -200], [b + H + 200, H + 200], [a + H + 200, H + 200]], col);
  band(-S - 400, c1 + 1, '#000000'); if (u < 1) band(c1, c2, NSS.red);
  const push = 1 + 0.04 * EZ.io(clamp((TT - t0 - 0.7) / Math.max(0.1, TOTAL - t0 - 0.7)));
  ctx.translate(W / 2, H / 2); ctx.scale(push, push); ctx.translate(-W / 2, -H / 2);
  const L = asset('N2026.png'), lw = 422, lh = 405, P = (d) => nssSettle(t0 + 0.3 + d), lift = (p) => (1 - p) * 16, A = (p) => clamp(p * 1.5);
  const legal = '© ' + (B.year ?? 2026) + ' Netsurit. All rights reserved.';
  const rule = (P0, P1, p) => { if (p <= 0) return; ctx.save(); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(161,170,177,0.45)'; nssPath([P0, [lerp(P0[0], P1[0], p), lerp(P0[1], P1[1], p)]], false); ctx.stroke(); ctx.restore(); };
  if (NSS_PHONE) {
    const lp = P(0.35); if (L && lp > 0.001) { ctx.save(); ctx.globalAlpha = A(lp); ctx.drawImage(L, (W - lw) / 2, 300 + (1 - lp) * 20, lw, lh); ctx.restore(); }
    rule([CX - 200, 800], [CX + 200, 800], nssDraw(t0 + 0.9, 0.5));
    const C = { align: 'center' };
    let p = P(0.75); nssText(eyebrow, CX, 900 + lift(p), 28, NSS.red, { ...C, alpha: A(p) });
    p = P(0.9); tag.forEach((s, i) => nssText(s, CX, 1010 + i * 102 + lift(p), 92, NSS.white, { ...C, alpha: A(p) }));
    const by = 1010 + Math.max(1, tag.length) * 102 + 46;
    p = P(1.7); nssText(B.name, CX, by + lift(p), 46, NSS.white, { ...C, alpha: A(p) });
    nssText([B.unit, B.date].filter(Boolean).join('  ·  '), CX, by + 56 + lift(p), 34, NSS.steel, { ...C, weight: 400, alpha: A(p) });
    p = P(2.5); nssRich([{ s: 'Break free from ', c: NSS.white }, { s: 'ordinary IT.', c: NSS.red }], CX, by + 180 + lift(p), 38, { align: 'center', alpha: A(p) });
    p = P(3.2); nssText('netsurit.com', CX, H - SAFE.bottom - 104, 28, NSS.steel, { ...C, weight: 400, alpha: A(p) });
    nssText(legal, CX, H - SAFE.bottom - 60, 24, NSS.steel, { ...C, weight: 400, alpha: A(p) });
  } else {
    const lp = P(0.35); if (L && lp > 0.001) { ctx.save(); ctx.globalAlpha = A(lp); ctx.drawImage(L, 250, (H - lh) / 2 - 10 + (1 - lp) * 20, lw, lh); ctx.restore(); }
    rule([780, H / 2 - 170], [780, H / 2 + 170], nssDraw(t0 + 0.9, 0.5));
    const tx = 850;
    let p = P(0.75); nssText(eyebrow, tx, 352 + lift(p), 22, NSS.red, { alpha: A(p) });
    const tl = tag.join(' '), ts = Math.min(76, 76 * (W - SAFE.right - 40 - tx) / nssW(tl, 76));   // shrink to fit: a long tagline runs off the frame
    p = P(0.9); nssText(tl, tx, 440 + lift(p), ts, NSS.white, { alpha: A(p) });
    p = P(1.7); nssText(B.name, tx, 560 + lift(p), 40, NSS.white, { alpha: A(p) });
    nssText([B.unit, B.date].filter(Boolean).join('  ·  '), tx, 610 + lift(p), 32, NSS.steel, { weight: 400, alpha: A(p) });
    p = P(2.5); nssRich([{ s: 'Break free from ', c: NSS.white }, { s: 'ordinary IT.', c: NSS.red }], tx, 712 + lift(p), 32, { alpha: A(p) });
    p = P(3.2); nssText('netsurit.com', 96, H - SAFE.bottom + 40, 22, NSS.steel, { weight: 400, alpha: A(p) });
    nssText(legal, W - 96, H - SAFE.bottom + 40, 22, NSS.steel, { align: 'right', weight: 400, alpha: A(p) });
  }
  ctx.restore();
}
const nssEndCard = (t0) => { NSS_COVER = t0 + 0.7; const f = () => nssEndCardNow(t0); if (DEFER) DEFER.push(f); else f(); };
