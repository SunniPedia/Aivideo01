/* Number detection (digits of any script + spelled-out numbers), formatting and count-up */
(function () {
  var PV = window.PV, N = PV.numbers = {};
  var BREAK = /[,;:.!?\u060C\u061B\u061F\u06D4\u0964\u0965\u3001\u3002\uFF0C\uFF1B\uFF01\uFF1F\u2026]$/;
  var STRIP = /^[\s"'\u201C\u201D\u2018\u2019\u275D\u275E()\[\]{}\-\u2013\u2014]+|[\s"'\u201C\u201D\u2018\u2019\u275D\u275E()\[\]{}\-\u2013\u2014,;:.!?\u060C\u061B\u061F\u06D4\u0964\u0965\u3001\u3002\uFF0C\uFF1B\uFF01\uFF1F\u2026]+$/g;
  function norm(s) { return String(s).normalize('NFC').replace(/[\u200B-\u200D\uFEFF]/g, ''); }
  function digitValue(s) {
    var out = '';
    for (var ch of s) {
      if (/[,\u066C\u060C]/.test(ch)) continue;
      var cp = ch.codePointAt(0), v = -1, z = PV.detect.zeros;
      for (var k in z) if (cp >= z[k] && cp <= z[k] + 9) v = cp - z[k];
      if (v < 0) return NaN; out += v;
    }
    return out ? parseInt(out, 10) : NaN;
  }
  function resolveWord(core, L) {
    core = norm(core);
    var hit = lookup(core, L, false); if (hit) return hit;
    var sfx = L.suffixes.slice().sort(function (a, b) { return b.length - a.length; });
    for (var i = 0; i < sfx.length; i++) {
      var sx = norm(sfx[i]);
      if (core.length > sx.length && core.slice(-sx.length) === sx) {
        var h = lookup(core.slice(0, core.length - sx.length), L, true); if (h) return h;
      }
    }
    return null;
  }
  function lookup(w, L, suffixed) {
    var lw = w.toLowerCase();
    if (L.words[lw] !== undefined) return { v: L.words[lw], kind: 'n', sfx: suffixed };
    if (L.mult[lw] !== undefined) return { v: L.mult[lw], kind: 'm', sfx: suffixed };
    if (L.hundred.indexOf(lw) >= 0) return { v: 100, kind: 'h', sfx: suffixed };
    for (var i = 0; i < L.hundred.length; i++) {
      var hw = norm(L.hundred[i]);
      if (lw.length > hw.length && lw.slice(-hw.length) === hw) {
        var p = L.words[lw.slice(0, lw.length - hw.length)];
        if (p !== undefined && p >= 1 && p <= 99) return { v: p * 100, kind: 'n', sfx: suffixed, compound: true };
      }
    }
    return null;
  }
  /* find numbers in text. ignore = [[a,b],...] character ranges (brand name, markers). */
  N.find = function (text, lang, ignore) {
    var L = PV.numLang[lang] || PV.numLang.en;
    var toks = [], re = /\S+/g, m;
    while ((m = re.exec(text))) {
      var raw = m[0], core = raw.replace(STRIP, ''), a = m.index, b = a + raw.length;
      var ign = (ignore || []).some(function (r) { return a < r[1] && b > r[0]; });
      var t = { raw: raw, core: core, a: a, b: b, brk: BREAK.test(raw), ign: ign, num: null };
      if (!ign && core) {
        var dm = /^([\p{Nd}][\p{Nd},\u066C]*)(.*)$/u.exec(core);
        if (dm) {
          var rest = dm[2], ok = !rest;
          if (!ok) { var sfx = L.suffixes; for (var i = 0; i < sfx.length; i++) if (norm(sfx[i]) === norm(rest)) ok = true; }
          var dv = ok ? digitValue(dm[1]) : NaN;
          if (!isNaN(dv)) t.num = { v: dv, kind: 'n', digits: true, sfx: !!rest };
        } else t.num = resolveWord(core, L);
      }
      toks.push(t);
    }
    var phrases = [], i2 = 0;
    while (i2 < toks.length) {
      if (!toks[i2].num) { i2++; continue; }
      var total = 0, cur = 0, pk = '', pv = 0, first = i2, last = i2, words = 0, hasMult = false, j = i2;
      for (; j < toks.length; j++) {
        var t2 = toks[j]; if (!t2.num) break;
        var n = t2.num;
        if (j > first && n.kind === 'n') {
          var okc = pk === 'm' || pk === 'h' || (pk === 'n' && !n.digits && !toks[j - 1].num.digits && (pv >= 100 || (pv >= 20 && pv % 10 === 0 && n.v < 10)));
          if (!okc) break;
        }
        if (n.kind === 'n') { cur += n.v; pv = n.v; }
        else if (n.kind === 'h') { cur = (cur || 1) * 100; pv = 100; }
        else { total += (cur || 1) * n.v; cur = 0; pv = 0; hasMult = true; }
        pk = n.kind; words++; last = j;
        if (t2.brk) { j++; break; }
      }
      var value = total + cur;
      var lone1 = (last === first) && value === 1 && !toks[first].num.digits;
      if (!lone1 && words > 0) phrases.push({ first: first, last: last, value: value, hasMult: hasMult });
      i2 = Math.max(j, last + 1);
    }
    var res = [];
    phrases.forEach(function (ph, idx) {
      var fi = ph.first, la = ph.last, plus = false, k = la + 1;
      if (!toks[la].brk) {
        while (k < toks.length && L.skip.indexOf(norm(toks[k].core)) >= 0) k++;
        if (k < toks.length && L.plusAfter.indexOf(norm(toks[k].core).toLowerCase()) >= 0) { plus = true; la = k; }
      }
      if (!plus && fi > 0 && L.plusBefore.length) {
        var pb = toks[fi - 1].core.toLowerCase();
        if (L.plusBefore.indexOf(pb) >= 0 && !toks[fi - 1].brk) { plus = true; fi = fi - 1; if (pb === 'than' ) fi--; }
        else if (fi > 1 && toks[fi - 2].core.toLowerCase() + ' ' + pb === 'more than') { plus = true; fi = fi - 2; }
      }
      var nextStart = idx + 1 < phrases.length ? phrases[idx + 1].first : toks.length;
      var lab = [], q = la + 1;
      if (!toks[la].brk) {
        while (q < nextStart && lab.length < 4 && !toks[q].ign) { lab.push(toks[q]); if (toks[q].brk) break; q++; }
      }
      var label = lab.length ? text.slice(lab[0].a, lab[lab.length - 1].b).replace(STRIP, '') : '';
      res.push({ value: ph.value, plus: plus, label: label, start: toks[fi].a, end: toks[la].b, spoken: text.slice(toks[fi].a, toks[la].b) });
    });
    return res;
  };
  N.group = function (s, mode) {
    if (mode === 'none' || s.length <= 3) return s;
    if (mode === 'lakh') {
      var tail = s.slice(-3), head = s.slice(0, -3);
      return head.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + tail;
    }
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  N.toDigits = function (s, zeroCp) { return s.replace(/\d/g, function (d) { return String.fromCodePoint(zeroCp + (d.charCodeAt(0) - 48)); }); };
  N.format = function (v, project, plus) {
    var s = String(Math.max(0, Math.floor(v))), year = v >= 1900 && v <= 2100;
    s = N.group(s, year ? 'none' : project.grouping);
    s = N.toDigits(s, PV.detect.zeros[project.digits] || 0x30);
    var sign = project.direction === 'rtl' ? '\u200F+' : '+';
    return plus ? (project.direction === 'rtl' ? sign + s : s + sign) : s;
  };
  N.count = function (value, t, start, dur) { return Math.round(value * PV.easeOut(PV.prog(t, start, dur))); };
})();
