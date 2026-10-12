/* Reactive caption panel: karaoke words, rotating border, equalizer, fit */
(function () {
  var PV = window.PV, Cap = PV.caption = { scenes: [] };
  /* estimated word timing from the ORIGINAL scene duration */
  Cap.times = function (words, dur, lang) {
    var w = words.map(function (x) { return PV.seg.count(x.text, lang) + 1; }), tot = w.reduce(function (a, b) { return a + b; }, 0) || 1;
    var span = Math.max(0.6, dur - 0.55), cum = 0;
    return words.map(function (x, i) { var st = 0.15 + cum / tot * span; cum += w[i]; return { st: st, en: 0.15 + cum / tot * span }; });
  };
  Cap.active = function (lt, st, en) { return PV.easeOut(PV.prog(lt, st, 0.12)) * (1 - PV.easeOut(PV.prog(lt, en - 0.05, 0.14))); };
  function mix(a, b, k) { return 'rgb(' + [0, 1, 2].map(function (i) { return Math.round(a[i] + (b[i] - a[i]) * k); }).join(',') + ')'; }
  Cap.build = function (parent, cfg, scenes, project) {
    var o = { cfg: cfg, scenes: [] };
    var R = cfg.radius, bw = cfg.border || 5;
    o.panel = PV.h('div', 'abs', parent, { left: cfg.left + 'px', top: cfg.top + 'px', width: cfg.w + 'px', height: cfg.h + 'px', borderRadius: R + 'px' });
    o.border = PV.h('div', 'abs', o.panel, { inset: 0, borderRadius: R + 'px', background: 'conic-gradient(from var(--ang,0deg), var(--hl), var(--accent), var(--hl2), var(--accent), var(--hl))' });
    var fill = PV.h('div', 'abs', o.panel, { inset: bw + 'px', borderRadius: (R - bw) + 'px', overflow: 'hidden', background: 'radial-gradient(80% 60% at 50% 0%, rgba(var(--mood),0.16), rgba(0,0,0,0) 70%), radial-gradient(60% 50% at 50% 100%, rgba(var(--mood),0.10), rgba(0,0,0,0) 70%), linear-gradient(180deg, var(--bg-mid), var(--bg-deep))' });
    PV.h('div', 'abs', fill, { inset: 0, opacity: 0.5, backgroundImage: 'radial-gradient(rgba(255,255,255,0.18) 1.4px, rgba(0,0,0,0) 2px)', backgroundSize: '26px 26px' });
    o.sweep = PV.h('div', 'abs', fill, { top: 0, bottom: 0, width: (cfg.w * 0.18) + 'px', left: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.10), rgba(255,255,255,0))', transform: 'skewX(-18deg)' });
    if (cfg.ornTop) { var ot = PV.h('div', 'abs', o.panel, { left: 0, right: 0, top: cfg.ornTop.top + 'px' }); PV.icons.ornamentLine(ot, cfg.ornTop.size, cfg.ornTop.gap); }
    if (cfg.ornSides) {
      var l = PV.h('div', 'abs', o.panel, { left: cfg.ornSides.inset + 'px', top: (cfg.h / 2 - cfg.ornSides.size / 2) + 'px' }); PV.icons.make('star8', cfg.ornSides.size, l);
      var r = PV.h('div', 'abs', o.panel, { right: cfg.ornSides.inset + 'px', top: (cfg.h / 2 - cfg.ornSides.size / 2) + 'px' }); PV.icons.make('star8', cfg.ornSides.size, r);
    }
    var e = cfg.eq;
    o.eqWrap = PV.h('div', 'abs', o.panel, { left: e.inset + 'px', right: e.inset + 'px', bottom: e.bottom + 'px', height: e.h + 'px', display: 'flex', alignItems: 'flex-end', gap: '4px' });
    o.bars = [];
    for (var i = 0; i < e.n; i++) o.bars.push(PV.h('div', null, o.eqWrap, { flex: '1 1 0', height: e.base + 'px', borderRadius: '4px', background: 'linear-gradient(180deg, var(--hl), var(--hl2))', opacity: 0.9 }));
    o.box = PV.h('div', 'abs', o.panel, { left: cfg.box.l + 'px', right: cfg.box.r + 'px', top: cfg.box.t + 'px', bottom: cfg.box.b + 'px' });
    scenes.forEach(function (sc) {
      var cs = PV.h('div', 'abs', o.box, { inset: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', columnGap: cfg.gapX + 'px', rowGap: cfg.gapY + 'px', lineHeight: cfg.line, visibility: 'hidden', textAlign: 'center' });
      cs.dir = project.direction;
      var words = PV.seg.words(sc.text, project.language), times = Cap.times(words, sc.dur, project.language), spans = [];
      words.forEach(function (w, i) {
        var sp = PV.h('span', null, cs, { display: 'inline-block', whiteSpace: 'nowrap', opacity: 0, willChange: 'transform' });
        sp.textContent = w.text;
        var hl = (sc.hl || []).some(function (r) { return w.start < r[1] && w.end > r[0]; });
        spans.push({ el: sp, st: times[i].st, en: times[i].en, hl: hl });
      });
      var len = Array.from(sc.text).length;
      o.scenes.push({ sc: sc, el: cs, words: spans, size: cfg.sizeFn(len) });
    });
    Cap.scenes = o.scenes; o.fitSizes = [];
    return o;
  };
  /* shrink each caption until it fits its panel; returns the chosen sizes */
  Cap.fit = function (o) {
    var cfg = o.cfg, sizes = [], boxH = o.box.clientHeight, boxW = o.box.clientWidth;
    o.scenes.forEach(function (s, i) {
      var size = s.size, prev = s.el.style.visibility; s.el.style.visibility = 'hidden';
      function over() {
        s.el.querySelectorAll('span').forEach(function (e) { e.style.fontSize = size + 'px'; });
        var top = 1e9, bot = -1e9, wmax = 0;
        s.words.forEach(function (w) { top = Math.min(top, w.el.offsetTop); bot = Math.max(bot, w.el.offsetTop + w.el.offsetHeight); wmax = Math.max(wmax, w.el.offsetWidth); });
        return (bot - top) > boxH + 1 || wmax > boxW + 1;
      }
      while (over() && size > cfg.min) size -= 2;
      if (over()) PV.warn('WARNING caption of scene ' + (i + 1) + ' does not fit at the minimum size ' + size);
      s.size = size; sizes.push(size); s.el.style.visibility = prev;
    });
    o.fitSizes = sizes;
    return sizes;
  };
  /* mouth drive 0..1 for the host (pure function of t) */
  Cap.drive = function (t) {
    var best = 0;
    for (var i = 0; i < Cap.scenes.length; i++) {
      var sc = Cap.scenes[i].sc;
      if (t < sc.start - 0.01 || t > sc.end + 0.01) continue;
      var lt = t - sc.start;
      Cap.scenes[i].words.forEach(function (w, k) {
        var a = Cap.active(lt, w.st, w.en);
        if (a > 0) best = Math.max(best, a * (0.30 + 0.70 * Math.abs(Math.sin(lt * 13 + k * 1.7))));
      });
    }
    return best;
  };
  Cap.update = function (o, t, lv, total) {
    var cfg = o.cfg, T = PV.timeline, ai = T.active(t), sc0 = ai >= 0 ? T.scenes[ai] : null;
    var mood = sc0 ? PV.moods[sc0.mood] || PV.moods.happy : PV.moods.happy;
    document.documentElement.style.setProperty('--mood', mood.join(','));
    o.border.style.setProperty('--ang', (t * 90 % 360).toFixed(2) + 'deg');
    o.panel.style.boxShadow = '0 0 ' + (24 + 80 * lv).toFixed(1) + 'px ' + (4 + 14 * lv).toFixed(1) + 'px rgba(' + mood.join(',') + ',' + (0.22 + 0.45 * lv).toFixed(3) + ')';
    o.sweep.style.transform = 'translateX(' + (((t * 0.22) % 1.6 - 0.3) * cfg.w).toFixed(1) + 'px) skewX(-18deg)';
    var e = cfg.eq;
    for (var i = 0; i < o.bars.length; i++) {
      var wave = 0.5 + 0.5 * Math.abs(Math.sin(6 * t + 0.7 * i)), shape = 0.65 + 0.35 * Math.sin(0.45 * i + 1);
      o.bars[i].style.height = (e.base + e.range * PV.clamp(lv * 1.15 * wave * shape + 0.04)).toFixed(2) + 'px';
    }
    var hl = PV.palRGB ? PV.palRGB.hl : [233, 196, 106], cream = PV.palRGB ? PV.palRGB.cream : [255, 248, 230];
    o.scenes.forEach(function (s) {
      var v = T.vis(s.sc, t);
      s.el.style.visibility = v.on ? 'visible' : 'hidden';
      if (!v.on) return;
      s.el.style.opacity = v.op.toFixed(3);
      s.el.style.transform = 'translateY(' + v.ty.toFixed(2) + 'px)';
      var lt = t - s.sc.start;
      s.words.forEach(function (w) {
        var op = PV.easeOut(PV.prog(lt, w.st, 0.3)), a = Cap.active(lt, w.st, w.en);
        w.el.style.opacity = op.toFixed(3);
        w.el.style.transform = 'translateY(' + (26 * (1 - op) - 6 * a).toFixed(2) + 'px) scale(' + (1 + 0.07 * a).toFixed(4) + ')';
        var k = w.hl ? 1 : a;
        w.el.style.color = mix(cream, hl, k);
        w.el.style.textShadow = '0 0 ' + (34 * Math.max(a, w.hl ? 0.25 : 0)).toFixed(1) + 'px rgba(' + hl.join(',') + ',' + (0.85 * Math.max(a, w.hl ? 0.3 : 0)).toFixed(2) + ')';
      });
    });
  };
})();
