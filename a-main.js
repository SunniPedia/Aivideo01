/* Theme A main file: defines the contract init / fit / seek / setAudio (setAudio lives in common-audio-level.js) */
(function () {
  var PV = window.PV, S = {};
  var W = 1080, H = 1920;
  window.init = function (raw, opts) {
    PV.warnings = []; S.opts = opts = opts || {};
    var project = S.project = PV.detect.resolve(raw, opts.project, { badgeName: opts.badge });
    var root = document.documentElement.style;
    root.setProperty('--font-main', PV.detect.fontStack(project.script, !!opts.hasUserFont));
    var parsed = PV.parse.run(raw); S.scenes = parsed.scenes;
    var total = PV.timeline.compute(S.scenes, opts.audioDuration || 0, opts.tailPad, (opts.audioDuration || 0) > 0);
    PV.defs.ensure();
    var cls = S.cls = PV.classify.run(S.scenes, project, opts.scenes, !!opts.badge);
    PV.classify.assignIcons(cls, S.scenes, project);
    PV.scenes.setProject(project);
    var n = S.scenes.length, brand = null, store = null;
    cls.forEach(function (c, i) { if (c.type === 'brand' && !brand) brand = S.scenes[i]; if (c.type === 'store' && !store) store = S.scenes[i]; });
    var grow = store ? store.start : (n >= 3 ? S.scenes[n - 2].start : (n ? S.scenes[n - 1].start : 0));
    S.marks = { shrinkAt: brand ? brand.end : Math.min(5.6, n ? S.scenes[0].end : 5.6), growAt: grow };
    PV.timeline.marks = S.marks;
    var stage = document.getElementById('stage'); stage.innerHTML = ''; stage.dir = 'ltr';
    S.bg = PV.background.build(stage, {
      W: W, H: H, gradient: 'radial-gradient(120% 80% at 50% 30%, var(--bg-mid) 0%, var(--bg-deep) 55%, var(--bg-black) 100%)',
      star: { size: 2200, cx: 540, cy: 768 }, progress: { left: 70, right: 70, bottom: 90, height: 12 },
      px: function (i, t) { var x = (i * 97 + Math.sin(0.4 * t + i) * 40) % W; return (x + W) % W; },
      py: function (i, t) { return 1920 - ((t * (20 + (i % 7) * 9) + i * 131) % 1980); }
    });
    var vis = document.getElementById('vis') || PV.h('div', null, stage); vis.id = 'vis'; stage.appendChild(vis); vis.innerHTML = '';
    var area = { el: vis, w: 960, h: 740 };
    S.vis = S.scenes.map(function (sc, i) { return PV.scenes.build(area, sc, cls[i], { theme: 'A', project: project, opts: opts, closeAlign: 'center' }); });
    S.logo = PV.logo.build(stage, opts, PV.logoMotionA.CFG, project);
    S.cap = PV.caption.build(stage, {
      left: 50, top: 1230, w: 980, h: 540, radius: 64, border: 5, box: { l: 56, r: 56, t: 74, b: 96 }, line: 1.42, gapX: 18, gapY: 4, min: 40,
      sizeFn: function (len) { return len <= 40 ? 72 : (len <= 90 ? 66 : (len <= 130 ? 56 : 50)); },
      ornTop: { top: 18, size: 34, gap: 14 }, eq: { n: 30, h: 48, bottom: 30, inset: 90, base: 6, range: 40 }
    }, S.scenes, project);
    PV.ready = PV.palette.derive(opts.logoData, project.colors).then(function (r) {
      PV.logo.layout(S.logo, project);
      S.paletteSource = r.palette.source;
    });
    S.total = total;
    return total;
  };
  window.fit = function () {
    var caps = PV.caption.fit(S.cap), scales = S.vis.map(function (v) { return PV.scenes.fit(v); });
    return { captions: caps, scenes: scales, warnings: PV.warnings.slice() };
  };
  window.seek = function (t) {
    var lv = PV.audio.level(t);
    PV.background.update(S.bg, t, lv, S.total);
    PV.logo.apply(S.logo, PV.logoMotionA.state(t, S.marks), lv, t);
    S.vis.forEach(function (v) { PV.scenes.update(v, t, lv); });
    PV.caption.update(S.cap, t, lv, S.total);
  };
  window.PVState = S;
})();
