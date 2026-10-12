/* Deterministic logo color sampling and palette derivation */
(function () {
  var PV = window.PV, P = PV.palette = {};
  var DEFAULT = { deep: '#04210f', mid: '#0a4a2a', black: '#020a05', accent: '#14804a', hl: '#e9c46a', hl2: '#c9973a', cream: '#fff8e6' };
  function rgb2hsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, h = 0, s = 0, d = mx - mn;
    if (d > 1e-9) {
      s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0)); else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
      h *= 60;
    }
    return [h, s, l];
  }
  function hsl2hex(h, s, l) {
    h = ((h % 360) + 360) % 360 / 360;
    function f(p, q, t) { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; }
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    var c = [f(p, q, h + 1 / 3), f(p, q, h), f(p, q, h - 1 / 3)].map(function (v) { var x = Math.round(v * 255).toString(16); return x.length < 2 ? '0' + x : x; });
    return '#' + c.join('');
  }
  function hex2rgb(x) { x = x.replace('#', ''); if (x.length === 3) x = x.replace(/./g, '$&$&'); return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)]; }
  function lum(c) { var a = c.map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; }
  P.contrast = function (a, b) { var x = lum(hex2rgb(a)), y = lum(hex2rgb(b)); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  P.hex2rgb = hex2rgb; P.hsl2hex = hsl2hex;
  P.fallback = function () { return Object.assign({ source: 'default' }, DEFAULT); };
  /* from raw sampled buckets build the palette */
  P.fromBuckets = function (b1, b2) {
    var a = b1, h = b2;
    if (!h) h = { hsl: [a.hsl[0], Math.min(1, a.hsl[1]), Math.min(0.8, a.hsl[2] + 0.25)] };
    else if (lum(hex2rgb(hsl2hex.apply(null, h.hsl))) < lum(hex2rgb(hsl2hex.apply(null, a.hsl)))) { var t = a; a = h; h = t; }
    var ah = a.hsl, hh = h.hsl;
    var accent = hsl2hex(ah[0], Math.min(0.75, Math.max(0.35, ah[1])), Math.min(0.46, Math.max(0.3, ah[2])));
    var hl = hsl2hex(hh[0], Math.min(0.85, Math.max(0.4, hh[1])), Math.max(0.58, Math.min(0.72, hh[2])));
    var hl2 = hsl2hex(hh[0], Math.min(0.8, Math.max(0.4, hh[1])), Math.max(0.42, Math.min(0.6, hh[2] - 0.12)));
    var sb = Math.min(0.7, ah[1] * 0.8);
    var o = { deep: hsl2hex(ah[0], sb, 0.10), mid: hsl2hex(ah[0], sb, 0.19), black: hsl2hex(ah[0], sb * 0.6, 0.03), accent: accent, hl: hl, hl2: hl2, cream: '#fff8e6', source: 'logo' };
    var L = 0.6;
    while (P.contrast(o.cream, o.mid) < 4.5 && L > 0.05) { o.mid = hsl2hex(ah[0], sb, (L -= 0.1) * 0.19); }
    return o;
  };
  P.sample = function (img) {
    var w = 96, h = Math.max(8, Math.round(96 * img.naturalHeight / img.naturalWidth));
    var cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    var cx = cv.getContext('2d', { willReadFrequently: true }); cx.drawImage(img, 0, 0, w, h);
    var d = cx.getImageData(0, 0, w, h).data, bk = [], total = 0, i;
    P.corner = { r: d[0], g: d[1], b: d[2], a: d[3] };
    for (i = 0; i < 12; i++) bk.push({ n: 0, r: 0, g: 0, b: 0 });
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      i = (y * w + x) * 4;
      var r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3];
      if (a < 128) continue;
      var mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      if (mn > 235 || mx < 40) continue;
      var hsl = rgb2hsl(r, g, b);
      total++;
      if (hsl[1] < 0.28 || hsl[2] < 0.12 || hsl[2] > 0.92) continue;
      var k = bk[Math.floor(hsl[0] / 30) % 12]; k.n++; k.r += r; k.g += g; k.b += b;
    }
    var list = bk.map(function (k, idx) { return { n: k.n, idx: idx, k: k }; }).filter(function (o) { return o.n > 0; }).sort(function (a, b) { return b.n - a.n || a.idx - b.idx; });
    if (!list.length || list[0].n < Math.max(6, total * 0.02)) return null;
    function mk(o) { return { n: o.n, hsl: rgb2hsl(o.k.r / o.n, o.k.g / o.n, o.k.b / o.n) }; }
    var first = mk(list[0]), second = list[1] && list[1].n >= Math.max(6, total * 0.02) ? mk(list[1]) : null;
    return { first: first, second: second };
  };
  function applyVars(p) {
    var st = document.documentElement.style;
    st.setProperty('--bg-deep', p.deep); st.setProperty('--bg-mid', p.mid); st.setProperty('--bg-black', p.black);
    st.setProperty('--accent', p.accent); st.setProperty('--hl', p.hl); st.setProperty('--hl2', p.hl2); st.setProperty('--cream', p.cream);
    PV.pal = p; PV.palRGB = { hl: hex2rgb(p.hl), cream: hex2rgb(p.cream), accent: hex2rgb(p.accent), deep: hex2rgb(p.deep) };
  }
  P.apply = applyVars;
  /* async: resolves with the palette once applied. Fixed grid, no randomness. */
  P.derive = function (dataUrl, colorsCfg) {
    return new Promise(function (resolve) {
      var done = function (p, img) {
        applyVars(p);
        PV.logoInfo = { w: img ? img.naturalWidth : 0, h: img ? img.naturalHeight : 0, corner: P.corner || null };
        resolve({ palette: p, img: img || null });
      };
      if (colorsCfg && colorsCfg !== 'auto' && typeof colorsCfg === 'object') {
        var o = Object.assign(P.fallback(), colorsCfg); o.source = 'override'; return done(o);
      }
      if (!dataUrl) return done(P.fallback());
      var img = new Image();
      img.onload = function () {
        var s = null;
        try { s = P.sample(img); } catch (e) { PV.warn('palette sampling failed: ' + e.message); }
        done(s ? P.fromBuckets(s.first, s.second) : P.fallback(), img);
      };
      img.onerror = function () { PV.warn('logo could not be decoded; fallback palette'); done(P.fallback()); };
      img.src = dataUrl;
    });
  };
})();
