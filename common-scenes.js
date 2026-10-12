/* Scene visual builders: greeting, cards, numbers, single card, store, closing */
(function () {
  var PV = window.PV, S = PV.scenes = {};
  S.sizes = {
    A: { greeting: 170, icon: 110, label: 62, cIcon: 90, cLabel: 54, boxMin: 700, boxMax: 940, padY: 34, padX: 50, radius: 40, gap: 30, num: 210, num2: 160, numLabel: 62, button: 70, badgeW: 780, tap: 150, appName: 54, closeIcon: 120 },
    B: { greeting: 130, icon: 84, label: 54, cIcon: 70, cLabel: 46, boxMin: 600, boxMax: 840, padY: 20, padX: 40, radius: 32, gap: 20, num: 150, num2: 118, numLabel: 50, button: 48, badgeW: 580, tap: 110, appName: 40, closeIcon: 62 }
  };
  function card(parent, label, icon, sz, compact, rtl, big) {
    var is = compact ? sz.cIcon : (big ? Math.round(sz.icon * 1.15) : sz.icon), fs = compact ? sz.cLabel : (big ? Math.round(sz.label * 1.1) : sz.label);
    var el = PV.h('div', null, parent, { display: 'flex', alignItems: 'center', gap: sz.gap + 'px', padding: sz.padY + 'px ' + sz.padX + 'px', borderRadius: sz.radius + 'px', minWidth: sz.boxMin + 'px', maxWidth: sz.boxMax + 'px', background: 'linear-gradient(135deg, var(--bg-mid), var(--bg-deep))', border: '2px solid var(--hl)', boxShadow: '0 10px 30px rgba(0,0,0,0.45)', willChange: 'transform' });
    el.dir = rtl ? 'rtl' : 'ltr';
    var ic = PV.h('div', null, el, { flex: '0 0 auto', willChange: 'filter' });
    PV.icons.make(icon, is, ic);
    var tx = PV.h('div', null, el, { fontSize: fs + 'px', lineHeight: 1.3, color: 'var(--cream)', flex: '1 1 auto', textAlign: 'center', fontWeight: 600 });
    tx.textContent = label;
    return { el: el, ic: ic };
  }
  function numBlock(parent, n, size, lblSize, project, areaW) {
    var el = PV.h('div', null, parent, { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Math.round(lblSize * 0.15) + 'px', maxWidth: Math.round(areaW * 0.94) + 'px' });
    var holder = PV.h('div', null, el, { position: 'relative', fontSize: size + 'px', lineHeight: 1.1, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--hl)' });
    holder.dir = project.direction;
    var ghost = PV.h('div', null, holder, { visibility: 'hidden', whiteSpace: 'nowrap' }); ghost.textContent = PV.numbers.format(n.value, project, n.plus);
    var vis = PV.h('div', null, holder, { position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center', whiteSpace: 'nowrap' });
    var lab = null;
    if (n.label) { lab = PV.h('div', null, el, { fontSize: lblSize + 'px', color: 'var(--cream)', textAlign: 'center', lineHeight: 1.3 }); lab.dir = project.direction; lab.textContent = n.label; }
    return { el: el, vis: vis, holder: holder, n: n };
  }
  /* returns {root, inner, update, scale} */
  S.build = function (area, sc, cls, ctx) {
    var sz = S.sizes[ctx.theme], project = ctx.project, rtl = project.direction === 'rtl', W = area.w, H = area.h;
    var o = { sc: sc, cls: cls, scale: 1, W: W, H: H, kind: cls.type, items: [], nums: [], icons: [] };
    o.root = PV.h('div', 'abs', area.el, { left: 0, top: 0, width: W + 'px', height: H + 'px', visibility: 'hidden', opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' });
    PV.h('div', 'abs', o.root, { inset: '-6%', background: 'radial-gradient(ellipse at center, rgba(var(--mood),0.20), rgba(0,0,0,0) 68%)' });
    var align = cls.type === 'closing' && ctx.closeAlign === 'bottom' ? 'flex-end' : 'center';
    o.inner = PV.h('div', null, o.root, { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: Math.round(sz.gap * 0.9) + 'px', maxWidth: W + 'px', willChange: 'transform' });
    if (align === 'flex-end') { o.root.style.alignItems = 'flex-end'; o.root.style.paddingBottom = ctx.closePad + 'px'; }
    var t = cls.type, dur = sc.dur;
    if (t === 'greeting') {
      var g = cls.greeting || {}, useAr = g.salaam, txt = sc.text;
      if (useAr) txt = g.ar || (g.full ? PV.kw.salaamAr.full : PV.kw.salaamAr.base);
      var gt = PV.h('div', null, o.inner, { fontSize: Math.round(sz.greeting * (useAr ? 1.1 : 1)) + 'px', lineHeight: 1.35, color: 'var(--hl)', textAlign: 'center', fontWeight: 700, fontFamily: useAr ? 'var(--font-ar)' : 'inherit', whiteSpace: 'nowrap', willChange: 'filter' });
      gt.dir = useAr ? 'rtl' : project.direction; gt.textContent = txt;
      o.greet = gt;
      PV.icons.ornamentLine(PV.h('div', null, o.inner), Math.round(sz.greeting * 0.28), 14);
    } else if (t === 'cards' || t === 'card') {
      var items = (cls.items || []).slice(0, 3), compact = items.length >= 3 && t === 'cards';
      items.forEach(function (it) { o.items.push(card(o.inner, it.label, it.icon, sz, compact, rtl, t === 'card')); });
      (cls.numbers || []).slice(0, 1).forEach(function (n) { o.nums.push(numBlock(o.inner, n, items.length ? sz.num2 : sz.num, sz.numLabel, project, W)); });
    } else if (t === 'numbers') {
      (cls.numbers || []).slice(0, 2).forEach(function (n, i) { o.nums.push(numBlock(o.inner, n, i === 0 ? sz.num : sz.num2, sz.numLabel, project, W)); });
    } else if (t === 'store') {
      o.store = PV.storeBadge.build(o.inner, sz, ctx.opts, project, cls.label, dur);
      if (cls.closing && cls.icons) {
        var row = PV.h('div', null, o.inner, { display: 'flex', gap: Math.round(sz.closeIcon * 0.4) + 'px', marginTop: Math.round(sz.closeIcon * 0.2) + 'px' });
        cls.icons.forEach(function (n) { var w = PV.h('div', null, row, { willChange: 'filter' }); PV.icons.make(n, Math.round(sz.closeIcon * 0.6), w); o.icons.push(w); });
      }
    } else if (t === 'closing') {
      var row2 = PV.h('div', null, o.inner, { display: 'flex', gap: Math.round(sz.closeIcon * 0.6) + 'px' });
      (cls.icons || []).forEach(function (n) { var w = PV.h('div', null, row2, { willChange: 'transform,filter' }); PV.icons.make(n, sz.closeIcon, w); o.icons.push(w); });
    }
    return o;
  };
  S.fit = function (o, ctx) {
    o.root.style.visibility = 'hidden';
    var s = PV.layoutFit.measure(o.inner, o.W * 0.97, o.H * 0.97);
    if (PV.layoutFit.overflow(o.inner, o.W, o.H, s)) PV.warn('WARNING visual of scene ' + (o.sc.i + 1) + ' overflows its area at scale ' + s.toFixed(2));
    o.scale = s;
    return s;
  };
  S.update = function (o, t, lv) {
    var T = PV.timeline, sc = o.sc, v = T.vis(sc, t), lt = t - sc.start, dur = sc.dur;
    o.root.style.visibility = v.on ? 'visible' : 'hidden';
    if (!v.on) return;
    o.root.style.opacity = v.op.toFixed(3);
    var extra = 1, e = Math.min(0.45, 0.4 * dur);
    if (o.kind === 'greeting') extra = 0.85 + 0.15 * PV.easeOut(PV.prog(lt, 0, e));
    o.inner.style.transform = 'translateY(' + v.ty.toFixed(2) + 'px) scale(' + (o.scale * extra).toFixed(4) + ')';
    var rtl = ctx_rtl(o), n = o.items.length, stag = PV.clamp((dur - 1.0) / Math.max(1, n), 0.25, 1.0);
    o.items.forEach(function (it, k) {
      var st = Math.min(0.2 + k * stag, Math.max(0, dur - 0.7)), p = PV.easeBack(PV.prog(lt, st, 0.55)), op = PV.easeOut(PV.prog(lt, st, 0.4));
      var dx = (rtl ? -1 : 1) * 180 * (1 - p);
      it.el.style.opacity = op.toFixed(3);
      it.el.style.transform = 'translateX(' + dx.toFixed(1) + 'px) translateY(' + (Math.sin(1.8 * t + k * 1.1) * 3).toFixed(2) + 'px)';
      it.ic.style.filter = 'drop-shadow(0 0 ' + (6 + 16 * lv).toFixed(1) + 'px rgba(var(--mood),' + (0.5 + 0.4 * lv).toFixed(2) + '))';
      it.ic.style.transform = 'scale(' + (1 + 0.04 * Math.sin(2.4 * t + k * 1.3)).toFixed(4) + ')';
    });
    var s0 = Math.min(0.3, 0.2 * dur), cdur = Math.min(PV.clamp(dur - 0.8, 0.8, 3.2), Math.max(0.3, dur - s0));
    o.nums.forEach(function (nb, k) {
      var c = PV.numbers.count(nb.n.value, lt, s0 + (o.items.length ? 0.4 : 0), cdur);
      nb.vis.textContent = PV.numbers.format(c, ctx_project(o), nb.n.plus);
      nb.el.style.opacity = PV.easeOut(PV.prog(lt, 0.1 + k * 0.2, 0.4)).toFixed(3);
      nb.holder.style.textShadow = '0 0 ' + (18 + 40 * lv).toFixed(1) + 'px rgba(var(--mood),0.55)';
    });
    if (o.store) PV.storeBadge.update(o.store, lt, dur, lv);
    o.icons.forEach(function (w, k) {
      var st = Math.min(0.1 + k * 0.2, Math.max(0, dur - 0.6)), p = PV.easeBack(PV.prog(lt, st, 0.5));
      w.style.opacity = PV.easeOut(PV.prog(lt, st, 0.3)).toFixed(3);
      w.style.transform = 'translateY(' + (Math.sin(2 * t + k * 1.3) * 6).toFixed(2) + 'px) scale(' + ((0.3 + 0.7 * p) * (1 + 0.05 * Math.sin(2.2 * t + k))).toFixed(4) + ')';
      w.style.filter = 'drop-shadow(0 0 ' + (6 + 18 * lv).toFixed(1) + 'px rgba(var(--mood),' + (0.5 + 0.4 * lv).toFixed(2) + '))';
    });
    if (o.greet) o.greet.style.filter = 'drop-shadow(0 0 ' + (16 + 30 * lv).toFixed(1) + 'px rgba(var(--mood),0.6))';
  };
  var _project = null, _rtl = false;
  S.setProject = function (p) { _project = p; _rtl = p.direction === 'rtl'; };
  function ctx_project() { return _project; }
  function ctx_rtl() { return _rtl; }
})();
