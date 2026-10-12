/* Background: gradient wall, rotating star pattern, glow, particles, vignette, progress bar */
(function () {
  var PV = window.PV, B = PV.background = {};
  B.build = function (stage, cfg) {
    var o = { cfg: cfg, parts: [] };
    PV.defs.symbol('bg-star', '<g fill="none" stroke="var(--hl)" stroke-width="0.35"><rect x="18" y="18" width="64" height="64"/><rect x="18" y="18" width="64" height="64" transform="rotate(45 50 50)"/><circle cx="50" cy="50" r="22"/><circle cx="50" cy="50" r="36"/><circle cx="50" cy="50" r="48"/></g>');
    o.base = PV.h('div', 'abs', stage, { left: 0, top: 0, width: cfg.W + 'px', height: cfg.H + 'px', background: cfg.gradient });
    o.starBox = PV.h('div', 'abs', stage, { left: (cfg.star.cx - cfg.star.size / 2) + 'px', top: (cfg.star.cy - cfg.star.size / 2) + 'px', width: cfg.star.size + 'px', height: cfg.star.size + 'px' });
    var sv = PV.s('svg', { width: cfg.star.size, height: cfg.star.size, viewBox: '0 0 100 100' }, o.starBox);
    PV.s('use', { href: '#bg-star' }, sv);
    o.glow = PV.h('div', 'abs', stage, { left: 0, top: 0, width: cfg.W + 'px', height: cfg.H + 'px', background: 'radial-gradient(60% 45% at 50% 38%, rgba(var(--mood),0.20), rgba(0,0,0,0) 70%)' });
    o.pw = PV.h('div', 'abs', stage, { left: 0, top: 0, width: cfg.W + 'px', height: cfg.H + 'px', overflow: 'hidden' });
    for (var i = 0; i < 38; i++) {
      var sz = 5 + (i % 4) * 3;
      o.parts.push(PV.h('div', 'abs', o.pw, { left: 0, top: 0, width: sz + 'px', height: sz + 'px', borderRadius: '50%', background: 'var(--hl)' }));
    }
    PV.h('div', 'abs', stage, { left: 0, top: 0, width: cfg.W + 'px', height: cfg.H + 'px', background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, var(--bg-black) 130%)', opacity: 0.85 });
    var p = cfg.progress;
    o.track = PV.h('div', 'abs', stage, { left: p.left + 'px', right: p.right + 'px', bottom: p.bottom + 'px', height: p.height + 'px', borderRadius: p.height + 'px', background: 'rgba(255,255,255,0.10)' });
    o.fill = PV.h('div', 'abs', o.track, { left: 0, top: 0, bottom: 0, width: '0%', borderRadius: p.height + 'px', background: 'linear-gradient(90deg, var(--hl2), var(--hl))' });
    return o;
  };
  B.update = function (o, t, lv, total) {
    var c = o.cfg;
    o.starBox.style.transform = 'rotate(' + (t * 2.2).toFixed(3) + 'deg)';
    o.starBox.style.opacity = (0.10 + 0.07 * lv).toFixed(4);
    o.base.style.opacity = 1;
    o.glow.style.opacity = (0.72 + 0.28 * lv).toFixed(4);
    for (var i = 0; i < o.parts.length; i++) {
      var x = c.px(i, t), y = c.py(i, t), edge = Math.min(1, Math.min(y, c.H - y) / 160);
      o.parts[i].style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      o.parts[i].style.opacity = (Math.max(0, edge) * (0.32 + 0.2 * lv)).toFixed(3);
    }
    o.fill.style.width = (100 * PV.clamp(t / Math.max(0.001, total))).toFixed(3) + '%';
  };
})();
