/* Store badge scene (official badge file only) or the neutral button. Never draws a third-party logo. */
(function () {
  var PV = window.PV, S = PV.storeBadge = {};
  S.build = function (parent, sz, opts, project, label, dur) {
    var o = { sz: sz, dur: dur, hasBadge: !!opts.badge };
    o.wrap = PV.h('div', null, parent, { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Math.round(sz.badgeW * 0.04) + 'px' });
    var holder = PV.h('div', null, o.wrap, { position: 'relative', willChange: 'transform' });
    o.holder = holder;
    if (opts.badge) {
      var c = opts.badgeCrop, w = sz.badgeW, h, imgW, ml = 0, mt = 0;
      if (c && c.w > 0 && c.h > 0 && c.iw > 0) { h = Math.round(w * c.h / c.w); imgW = w * c.iw / c.w; ml = -c.x * w / c.w; mt = -c.y * w / c.w; }
      else { imgW = w; h = Math.round(w * (opts.badgeAspect || 0.387)); }
      var box = PV.h('div', null, holder, { width: w + 'px', height: h + 'px', overflow: 'hidden', borderRadius: Math.round(h * 0.13) + 'px', position: 'relative', background: '#000' });
      var img = PV.h('img', null, box, { position: 'absolute', left: ml + 'px', top: mt + 'px', width: imgW + 'px', height: 'auto', display: 'block' });
      img.src = opts.badge; img.alt = '';
      o.w = w; o.h = h; o.shadowBox = box;
      box.style.filter = 'drop-shadow(0 12px 24px rgba(0,0,0,0.55))';
    } else {
      var w2 = sz.badgeW, h2 = Math.round(sz.button * 2.3);
      var btn = PV.h('div', null, holder, { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: Math.round(sz.button * 0.35) + 'px', padding: '0 ' + Math.round(sz.button * 0.7) + 'px', minWidth: Math.round(w2 * 0.7) + 'px', height: h2 + 'px', borderRadius: Math.round(h2 / 2) + 'px', background: 'linear-gradient(180deg, var(--hl), var(--hl2))', color: 'var(--bg-deep)', fontWeight: 700, fontSize: sz.button + 'px', lineHeight: 1.2 });
      btn.dir = project.direction;
      PV.icons.make('play-arrow', Math.round(sz.button * 1.1), btn).style.setProperty('--ic-fill', 'var(--bg-deep)');
      var tx = PV.h('span', null, btn); tx.textContent = label || project.brandName || '';
      o.w = w2; o.h = h2; o.shadowBox = btn;
    }
    o.ring = PV.h('div', 'abs', holder, { left: (o.w * 0.72 - sz.tap / 2) + 'px', top: (o.h * 0.58 - sz.tap / 2) + 'px', width: sz.tap + 'px', height: sz.tap + 'px', borderRadius: '50%', border: '5px solid var(--cream)', opacity: 0 });
    if (project.brandName) {
      o.name = PV.h('div', null, o.wrap, { fontSize: sz.appName + 'px', color: 'var(--hl)', fontWeight: 700, textAlign: 'center', lineHeight: 1.25, maxWidth: Math.round(sz.badgeW * 1.15) + 'px', opacity: 0 });
      o.name.dir = project.direction; o.name.textContent = project.brandName;
    }
    return o;
  };
  S.update = function (o, lt, dur, lv) {
    var pop = Math.min(0.4, 0.3 * dur), pe = PV.easeBack(PV.prog(lt, pop, 0.55));
    var fl = Math.sin(2 * lt) * 8;
    o.holder.style.transform = 'translateY(' + fl.toFixed(2) + 'px) scale(' + (0.2 + 0.8 * pe).toFixed(4) + ')';
    o.holder.style.opacity = PV.easeOut(PV.prog(lt, pop, 0.3)).toFixed(3);
    var tap0 = dur < 4 ? 0.45 * dur : 2.0, ph = lt - tap0;
    if (ph >= 0) { var p = (ph % 1.3) / 1.3; o.ring.style.opacity = (0.8 * (1 - p)).toFixed(3); o.ring.style.transform = 'scale(' + (0.4 + 1.0 * PV.easeOut(p)).toFixed(3) + ')'; } else o.ring.style.opacity = 0;
    if (o.name) { var n0 = Math.min(1.2, 0.6 * dur); o.name.style.opacity = PV.easeOut(PV.prog(lt, n0, 0.4)).toFixed(3); }
  };
})();
