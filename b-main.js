/* Theme B main file: init / fit / seek contract for the podcast layout */
(function () {
  var PV = window.PV, S = {};
  window.init = function (raw, opts) {
    PV.warnings = []; S.opts = opts = opts || {};
    var project = S.project = PV.detect.resolve(raw, opts.project, { badgeName: opts.badge });
    document.documentElement.style.setProperty('--font-main', PV.detect.fontStack(project.script, !!opts.hasUserFont));
    var parsed = PV.parse.run(raw); S.scenes = parsed.scenes;
    var total = PV.timeline.compute(S.scenes, opts.audioDuration || 0, opts.tailPad, (opts.audioDuration || 0) > 0);
    PV.defs.ensure();
    var cls = S.cls = PV.classify.run(S.scenes, project, opts.scenes, !!opts.badge);
    PV.classify.assignIcons(cls, S.scenes, project);
    PV.scenes.setProject(project);
    var n = S.scenes.length, brand = null, lastIsStore = n && cls[n - 1].type === 'store';
    cls.forEach(function (c, i) { if (c.type === 'brand' && !brand) brand = S.scenes[i]; });
    S.marks = {
      brandStart: brand ? brand.start : 0,
      shrinkAt: brand ? brand.end - 0.4 : Math.min(5.6, n ? S.scenes[0].end : 5.6),
      finalAt: n ? S.scenes[n - 1].start : 0, noReturn: !!lastIsStore
    };
    var stage = document.getElementById('stage'); stage.innerHTML = ''; stage.dir = 'ltr';
    S.bg = PV.background.build(stage, {
      W: 1920, H: 1080, gradient: 'radial-gradient(90% 90% at 70% 35%, var(--bg-mid) 0%, var(--bg-deep) 60%, var(--bg-black) 100%)',
      star: { size: 1700, cx: 1450, cy: 380 }, progress: { left: 60, right: 60, bottom: 22, height: 8 },
      px: function (i, t) { var x = (i * 211 + Math.sin(0.4 * t + i) * 40) % 1920; return (x + 1920) % 1920; },
      py: function (i, t) { return 1080 - ((t * (20 + (i % 7) * 9) + i * 131) % 1140); }
    });
    S.studio = PV.studio.build(stage);
    S.hostCfg = PV.hostCfg(project);
    S.host = PV.hostSvg.build(stage, S.hostCfg);
    S.front = PV.studio.buildFront(stage, opts);
    var area = { el: S.front.area, w: 928, h: 478 };
    S.vis = S.scenes.map(function (sc, i) { return PV.scenes.build(area, sc, cls[i], { theme: 'B', project: project, opts: opts, closeAlign: 'bottom', closePad: 22 }); });
    S.logo = PV.logo.build(stage, opts, PV.logoMotionB.CFG, project);
    S.cap = PV.caption.build(stage, {
      left: 60, top: 836, w: 1800, h: 196, radius: 48, border: 5, box: { l: 76, r: 76, t: 16, b: 44 }, line: 1.25, gapX: 16, gapY: 2, min: 34,
      sizeFn: function (len) { return len <= 50 ? 64 : 56; },
      ornSides: { size: 36, inset: 18 }, eq: { n: 40, h: 26, bottom: 12, inset: 130, base: 4, range: 22 }
    }, S.scenes, project);
    PV.ready = PV.palette.derive(opts.logoData, project.colors).then(function (r) { PV.logo.layout(S.logo, project); S.paletteSource = r.palette.source; });
    S.total = total;
    return total;
  };
  window.fit = function () {
    var caps = PV.caption.fit(S.cap), scales = S.vis.map(function (v) { return PV.scenes.fit(v); });
    return { captions: caps, scenes: scales, warnings: PV.warnings.slice() };
  };
  window.seek = function (t) {
    var lv = PV.audio.level(t), sp = PV.timeline.sp(t);
    PV.background.update(S.bg, t, lv, S.total);
    PV.studio.update(S.studio, S.front, t, sp, lv);
    PV.hostAnim.update(S.host, t, sp, lv, PV.caption.drive(t));
    PV.logo.apply(S.logo, PV.logoMotionB.state(t, S.marks), lv, t);
    S.vis.forEach(function (v) { PV.scenes.update(v, t, lv); });
    PV.caption.update(S.cap, t, lv, S.total);
  };
  window.PVState = S;
})();
