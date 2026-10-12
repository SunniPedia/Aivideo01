/* Logo card (ONE image element, transformed and moved, never cloned), ripple ring and pulse helpers */
(function () {
  var PV = window.PV, L = PV.logo = {};
  L.build = function (parent, opts, cfg, project) {
    var o = { cfg: cfg, h: cfg.w * 0.8 };
    o.ripple = PV.h('div', 'abs', parent, { left: 0, top: 0, width: cfg.w + 'px', height: o.h + 'px', borderRadius: cfg.radius + 'px', border: '5px solid var(--hl)', opacity: 0, willChange: 'transform' });
    o.card = PV.h('div', 'abs', parent, { left: 0, top: 0, width: cfg.w + 'px', borderRadius: cfg.radius + 'px', border: cfg.ring + 'px solid var(--hl)', overflow: 'hidden', willChange: 'transform', opacity: 0 });
    o.img = PV.h('img', null, o.card, { display: 'block', width: '100%', height: 'auto' });
    o.img.src = opts.logo;
    o.img.alt = '';
    L.layout(o, project);
    return o;
  };
  /* size and background once the image dimensions are known */
  L.layout = function (o, project) {
    var info = PV.logoInfo, cfg = o.cfg, bgMode = (project.logo && project.logo.background) || 'auto';
    if (info && info.w) o.h = cfg.w * info.h / info.w;
    var bg = 'var(--bg-deep)';
    if (bgMode === 'white') bg = '#ffffff';
    else if (bgMode === 'auto' && info && info.corner && info.corner.a > 128) bg = 'rgb(' + info.corner.r + ',' + info.corner.g + ',' + info.corner.b + ')';
    o.card.style.background = bg;
    o.card.style.height = o.h + 'px';
    o.ripple.style.height = o.h + 'px';
    var ay = cfg.mode === 'top' ? 0 : o.h / 2;
    o.card.style.transformOrigin = (cfg.w / 2) + 'px ' + ay + 'px';
    o.ripple.style.transformOrigin = (cfg.w / 2) + 'px ' + ay + 'px';
    o.ay = ay;
  };
  /* st = {x,y,scale,op,ripple (0..1 or -1 for none)}; (x,y) is the anchor point (top-center or center) */
  L.apply = function (o, st, lv, t) {
    var cfg = o.cfg, pulse = (1 + 0.012 * Math.sin(2.2 * t)) * (1 + 0.016 * lv), s = Math.max(0.001, PV.num(st.scale, 1) * pulse);
    var tx = PV.num(st.x) - cfg.w / 2, ty = PV.num(st.y) - o.ay;
    o.card.style.opacity = PV.clamp(st.op).toFixed(3);
    o.card.style.transform = 'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px) scale(' + s.toFixed(4) + ')';
    o.card.style.boxShadow = '0 0 ' + (30 + 90 * lv).toFixed(1) + 'px rgba(var(--mood),' + (0.30 + 0.25 * lv).toFixed(3) + ')';
    if (st.ripple >= 0 && st.ripple < 1) {
      var k = PV.easeOut(st.ripple), rs = s * (1 + 0.7 * k);
      o.ripple.style.opacity = (0.8 * (1 - k) * PV.clamp(st.op)).toFixed(3);
      o.ripple.style.transform = 'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px) scale(' + rs.toFixed(4) + ')';
    } else o.ripple.style.opacity = 0;
  };
})();
