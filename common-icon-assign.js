/* Unique icon assignment (section 3B): global used tracker, deterministic by scene time */
(function () {
  var PV = window.PV, A = PV.iconAssign = {};
  A.reset = function () { A.lastUse = {}; A.cur = {}; A.prev = {}; A.counter = 0; A.fbIndex = 0; };
  A.reset();
  A.score = function (label, lang) {
    var low = String(label).toLowerCase(), out = {};
    var tables = [PV.iconWords.en, PV.iconWords[lang]].filter(Boolean);
    PV.icons.list.forEach(function (name) {
      var s = 0;
      tables.forEach(function (tb) { (tb[name] || []).forEach(function (kw) { if (kw && low.indexOf(kw.toLowerCase()) >= 0) s += kw.length; }); });
      if (s > 0) out[name] = s;
    });
    return out;
  };
  A.beginScene = function () { A.prev = A.cur; A.cur = {}; };
  /* pick an icon for a label. forced: icon name from scenes.json */
  A.pick = function (label, lang, forced) {
    var name = null;
    if (forced && PV.icons.defs[forced] && !A.cur[forced]) name = forced;
    if (!name) {
      var sc = A.score(label, lang), names = Object.keys(sc).filter(function (n) { return PV.icons.fallback.indexOf(n) < 0 || true; });
      names.sort(function (a, b) { return sc[b] - sc[a] || PV.icons.list.indexOf(a) - PV.icons.list.indexOf(b); });
      var ok = names.filter(function (n) { return !A.cur[n] && !A.prev[n]; });
      if (!ok.length) ok = names.filter(function (n) { return !A.cur[n] && !A.lastUse[n]; });
      if (ok.length) name = ok[0];
      else if (names.length) { var cands = names.filter(function (n) { return !A.cur[n]; }); cands.sort(function (a, b) { return (A.lastUse[a] || 0) - (A.lastUse[b] || 0); }); name = cands[0] || null; }
    }
    if (!name) {
      var fb = PV.icons.fallback;
      for (var k = 0; k < fb.length * 2; k++) { var c = fb[(A.fbIndex++) % fb.length]; if (!A.cur[c] && !A.prev[c]) { name = c; break; } }
      if (!name) name = fb.filter(function (c) { return !A.cur[c]; })[0] || fb[0];
    }
    A.cur[name] = true; A.lastUse[name] = ++A.counter;
    return name;
  };
})();
