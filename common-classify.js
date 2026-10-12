/* Scene type classifier. Priority: greeting > store > closing (last) > brand > cards > numbers > card > caption */
(function () {
  var PV = window.PV, C = PV.classify = {};
  var PUNCT = /^[\s,;:.!?\u060C\u061B\u061F\u06D4\u0964\u0965\u3001\u3002\uFF0C\uFF1B\uFF01\uFF1F\u2026"'\u201C\u201D\u2018\u2019\u275D\u275E()\-\u2013\u2014]+|[\s,;:.!?\u060C\u061B\u061F\u06D4\u0964\u0965\u3001\u3002\uFF0C\uFF1B\uFF01\uFF1F\u2026"'\u201C\u201D\u2018\u2019\u275D\u275E()\-\u2013\u2014]+$/g;
  function trimP(s) { return s.replace(PUNCT, ''); }
  C.first20 = function (t) { return Array.from(t).slice(0, 20).join(''); };
  C.wordCount = function (t) { return t.trim().split(/\s+/).filter(Boolean).length; };
  C.greeting = function (sc, project) {
    if (project.greetingText && sc.i === 0 && C.wordCount(sc.text) <= 4) return { salaam: /salaam|salam|\u0633\u0644\u0627\u0645/i.test(project.greetingText), full: false, ar: project.greetingText };
    if (sc.i !== 0 || C.wordCount(sc.text) > 4) return null;
    var n = PV.kw.norm(sc.text), list = (PV.kw.greeting[project.language] || []).concat(PV.kw.greeting.en || []);
    for (var i = 0; i < list.length; i++) {
      var g = PV.kw.norm(list[i][0]);
      if (n === g || (n.indexOf(g) === 0 && C.wordCount(sc.text) <= 4)) return { salaam: !!list[i][1], full: list[i][2] === 'full' || /\u0631\u062D\u0645|rahmat|\u0631\u0627\u0647\u0645\u093E|রাহমাতুল্লাহ|রহমাতুল্লাহ/i.test(sc.text) };
    }
    return null;
  };
  C.isStore = function (sc, project, hasBadge) {
    var n = PV.kw.norm(sc.text), names = (PV.kw.storeNames[project.language] || []).concat(PV.kw.storeNames.en);
    for (var i = 0; i < names.length; i++) if (n.indexOf(PV.kw.norm(names[i])) >= 0) return true;
    if (hasBadge) { var v = PV.kw.installVerbs[project.language] || PV.kw.installVerbs.en; for (var j = 0; j < v.length; j++) if (n.indexOf(PV.kw.norm(v[j])) >= 0) return true; }
    return false;
  };
  C.hasBrand = function (sc, project) {
    if (sc.hl && sc.hl.length) return true;
    return !!project.brandName && PV.kw.norm(sc.text).indexOf(PV.kw.norm(project.brandName)) >= 0;
  };
  /* ranges that must never be split or read as numbers: marker ranges and every occurrence of the brand name */
  C.protect = function (sc, project) {
    var r = (sc.hl || []).slice();
    if (project.brandName) {
      var low = sc.text.toLowerCase(), b = project.brandName.toLowerCase(), k = low.indexOf(b);
      while (k >= 0) { r.push([k, k + b.length]); k = low.indexOf(b, k + b.length); }
    }
    return r;
  };
  /* split into list items; returns [{label,start,end}] */
  C.splitList = function (sc, project) {
    var text = sc.text, prot = C.protect(sc, project), cuts = [], conj = (PV.kw.conjunctions[project.language] || PV.kw.conjunctions.en).map(PV.kw.norm);
    function inProt(a, b) { return prot.some(function (r) { return a < r[1] && b > r[0]; }); }
    var re = /\S+/g, m, segStart = 0, segs = [];
    var seps = PV.kw.separators;
    while ((m = re.exec(text))) {
      var w = m[0], a = m.index, b = a + w.length, last = w.charAt(w.length - 1), core = PV.kw.norm(w);
      if (inProt(a, b)) continue;
      if (conj.indexOf(core) >= 0 && core) { segs.push([segStart, a]); segStart = b; continue; }
      if (seps.indexOf(last) >= 0) { segs.push([segStart, b]); segStart = b; }
    }
    segs.push([segStart, text.length]);
    var items = [];
    segs.forEach(function (s) {
      var seg = text.slice(s[0], s[1]), lead = seg.length - seg.replace(/^\s+/, '').length, label = trimP(seg);
      if (!label) return;
      var base = s[0] + seg.indexOf(label);
      var words = label.split(/\s+/);
      if (words.length > 5) { words = words.slice(-4); label = words.join(' '); base = s[0] + seg.lastIndexOf(label); }
      items.push({ label: label, start: base, end: base + label.length });
    });
    return items;
  };
  C.tailPhrase = function (text, n) { var w = trimP(text).split(/\s+/); return w.slice(-n).join(' '); };
  C.numbersOf = function (sc, project) {
    return PV.numbers.find(sc.text, project.language, C.protect(sc, project)).slice(0, 2).map(function (x) { return { value: x.value, label: x.label, plus: x.plus, spoken: x.spoken }; });
  };
  C.auto = function (sc, project, ctx) {
    var g = C.greeting(sc, project);
    if (g) return { type: 'greeting', greeting: g };
    if (C.isStore(sc, project, ctx.hasBadge)) return { type: 'store', closing: sc.last, label: C.tailPhrase(sc.text, 4) };
    if (sc.last) return { type: 'closing' };
    if (!ctx.brandUsed && C.hasBrand(sc, project)) { ctx.brandUsed = true; return { type: 'brand' }; }
    var nums = C.numbersOf(sc, project), items = C.splitList(sc, project);
    if (items.length >= 2) return { type: 'cards', items: items.slice(0, 3), numbers: nums.slice(0, 1) };
    if (nums.length) return { type: 'numbers', numbers: nums };
    var fb = C.tailPhrase(sc.text, 3);
    if (fb && C.wordCount(sc.text) >= 2) return { type: 'card', items: [{ label: fb }] };
    return { type: 'caption' };
  };
  /* returns an array of classification objects, one per scene */
  C.run = function (scenes, project, scenesJson, hasBadge) {
    var ctx = { hasBadge: hasBadge, brandUsed: false }, out = [], byLine = {};
    (Array.isArray(scenesJson) ? scenesJson : (scenesJson && scenesJson.scenes) || []).forEach(function (e) { if (e && e.line) byLine[e.line] = e; });
    scenes.forEach(function (sc) {
      var auto = C.auto(sc, project, ctx), ov = byLine[sc.line], res = auto;
      if (ov) {
        if (ov.match !== C.first20(sc.text)) PV.warn('scenes.json entry for line ' + sc.line + ' is stale (match differs); ignored');
        else {
          res = Object.assign({}, auto, { type: ov.type || auto.type, source: 'scenes.json' });
          if (ov.items) res.items = ov.items.map(function (x) { return { label: x.label, icon: x.icon }; });
          if (ov.numbers) res.numbers = ov.numbers.map(function (x) { return { value: x.value, label: x.label || '', plus: !!x.plus }; });
          if (ov.icons) res.icons = ov.icons.slice();
          if (ov.type === 'brand') ctx.brandUsed = true;
          if (ov.type === 'store' && sc.last) res.closing = true;
          if (!res.label && res.type === 'store') res.label = C.tailPhrase(sc.text, 4);
        }
      }
      res.i = sc.i; res.line = sc.line;
      if (!res.source) res.source = 'auto';
      out.push(res);
    });
    return out;
  };
  /* assign icons in scene time order (cards, single card, closing icons) */
  C.assignIcons = function (cls, scenes, project) {
    PV.iconAssign.reset();
    var fallbackIdx = 0;
    cls.forEach(function (c, i) {
      PV.iconAssign.beginScene();
      if (c.items) c.items.forEach(function (it) { it.icon = PV.iconAssign.pick(it.label, project.language, it.icon); });
      if (c.type === 'closing' || (c.type === 'store' && c.closing)) {
        var forced = c.icons || [], picks = [];
        for (var k = 0; k < 3; k++) picks.push(PV.iconAssign.pick(i === scenes.length - 1 ? scenes[i].text : '', project.language, forced[k]));
        if (!c.icons) {
          picks = []; PV.iconAssign.beginScene();
          var sc = PV.iconAssign.score(scenes[i].text, project.language), names = Object.keys(sc).sort(function (a, b) { return sc[b] - sc[a]; });
          names.slice(0, 3).forEach(function (n) { picks.push(PV.iconAssign.pick(n, project.language, n)); });
          while (picks.length < 3) picks.push(PV.iconAssign.pick('', project.language));
        }
        c.icons = picks;
      }
    });
  };
})();
