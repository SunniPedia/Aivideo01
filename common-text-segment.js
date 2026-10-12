/* Words and graphemes through Intl.Segmenter (deterministic) and direction helpers */
(function () {
  var PV = window.PV, seg = PV.seg = {};
  var has = typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function';
  var SPACELESS = /[\u0E00-\u0EFF\u1000-\u109F\u1780-\u17FF\u3040-\u30FF\u3400-\u9FFF\uF900-\uFAFF]/;
  seg.graphemes = function (s, lang) {
    if (!has) return Array.from(s);
    var out = [], it = new Intl.Segmenter(lang || undefined, { granularity: 'grapheme' }).segment(s);
    for (var x of it) out.push(x.segment);
    return out;
  };
  seg.count = function (s, lang) { return seg.graphemes(s, lang).length; };
  /* words with attached punctuation: [{text,start,end}] (indices into s) */
  seg.words = function (s, lang) {
    var toks = [], cur = null, pre = null;
    function open(a, b) { cur = { start: pre ? pre.start : a, end: b }; pre = null; toks.push(cur); }
    if (!has) {
      var re = /\S+/g, m;
      while ((m = re.exec(s))) toks.push({ text: m[0], start: m.index, end: m.index + m[0].length });
      return toks;
    }
    var it = new Intl.Segmenter(lang || undefined, { granularity: 'word' }).segment(s);
    for (var x of it) {
      var g = x.segment, a = x.index, b = a + g.length;
      if (/^\s+$/.test(g)) { cur = null; pre = null; continue; }
      if (x.isWordLike) {
        if (cur && !SPACELESS.test(g.charAt(0)) && !SPACELESS.test(s.charAt(cur.end - 1))) cur.end = b; else open(a, b);
      } else if (cur) cur.end = b;
      else if (pre) pre.end = b; else pre = { start: a, end: b };
    }
    if (pre) toks.push({ start: pre.start, end: pre.end });
    toks.forEach(function (t) { t.text = s.slice(t.start, t.end); });
    return toks;
  };
  seg.isRTLLang = function (lang) { return ['ar', 'ur', 'fa', 'he', 'ps', 'ku', 'sd', 'yi'].indexOf(lang) >= 0; };
})();
