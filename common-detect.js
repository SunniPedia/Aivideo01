/* Runtime detection of script, language, direction, digits, grouping and brand name */
(function () {
  var PV = window.PV, D = PV.detect = {};
  var SCRIPTS = [['Bengali', 'bn'], ['Devanagari', 'hi'], ['Arabic', 'ar'], ['Hebrew', 'he'], ['Cyrillic', 'ru'], ['Greek', 'el'],
    ['Thai', 'th'], ['Han', 'zh'], ['Hiragana', 'ja'], ['Katakana', 'ja'], ['Hangul', 'ko'], ['Tamil', 'ta'], ['Telugu', 'te'],
    ['Gujarati', 'gu'], ['Gurmukhi', 'pa'], ['Kannada', 'kn'], ['Malayalam', 'ml'], ['Sinhala', 'si'], ['Khmer', 'km'],
    ['Myanmar', 'my'], ['Latin', 'en']];
  /* digit systems: name -> code point of zero */
  var ZEROS = { latin: 0x30, arabic: 0x660, persian: 0x6F0, devanagari: 0x966, bengali: 0x9E6, gurmukhi: 0xA66, gujarati: 0xAE6,
    thai: 0xE50, khmer: 0x17E0, myanmar: 0x1040 };
  var NATIVE = { bn: 'bengali', hi: 'devanagari', mr: 'devanagari', ne: 'devanagari', ar: 'arabic', ur: 'persian', fa: 'persian',
    gu: 'gujarati', pa: 'gurmukhi', th: 'thai', km: 'khmer', my: 'myanmar' };
  var LAKH = ['bn', 'hi', 'ur', 'ne', 'mr', 'gu', 'pa', 'ta', 'te', 'kn', 'ml', 'si', 'as', 'or'];
  D.zeros = ZEROS;
  D.script = function (text) {
    var best = null, bestN = 0;
    SCRIPTS.forEach(function (p) {
      var m = text.match(new RegExp('\\p{Script=' + p[0] + '}', 'gu'));
      var n = m ? m.length : 0;
      if (n > bestN) { bestN = n; best = p; }
    });
    return best ? { name: best[0], lang: best[1] } : { name: 'Latin', lang: 'en' };
  };
  D.language = function (text) {
    var s = D.script(text), l = s.lang;
    if (s.name === 'Arabic') {
      if (/[\u0679\u0688\u0691\u06BA\u06BE\u06D2]/.test(text)) l = 'ur';
      else if (/[\u067E\u0686\u0698\u06AF]/.test(text)) l = 'fa';
    } else if (s.name === 'Devanagari') {
      if (/\u0906\u0939\u0947|\u0906\u0923\u093F/.test(text)) l = 'mr';
    } else if (s.name === 'Latin') {
      var low = ' ' + text.toLowerCase().replace(/[^\p{L}\s]/gu, ' ') + ' ';
      var tests = { es: [' el ', ' la ', ' de ', ' que ', ' y ', ' los ', ' una '], fr: [' le ', ' les ', ' des ', ' et ', ' une ', ' est ', ' pour '],
        de: [' der ', ' die ', ' und ', ' das ', ' ist ', ' nicht ', ' mit '], id: [' yang ', ' dan ', ' di ', ' untuk ', ' dengan ', ' ini '],
        tr: [' ve ', ' bir ', ' bu ', ' için ', ' ile ', ' da '], pt: [' o ', ' uma ', ' não ', ' com ', ' para ', ' os '],
        en: [' the ', ' and ', ' of ', ' to ', ' is ', ' in ', ' for '] };
      var best = 'en', bn = 0;
      Object.keys(tests).forEach(function (k) { var n = 0; tests[k].forEach(function (w) { if (low.indexOf(w) >= 0) n++; }); if (n > bn) { bn = n; best = k; } });
      l = best;
    }
    return l;
  };
  D.direction = function (lang) { return PV.seg.isRTLLang(lang) ? 'rtl' : 'ltr'; };
  D.digits = function (text, lang) {
    /* digits glued to letters (S2, 4K, H2O) are not counted */
    var bare = text.split(/\s+/).filter(function (w) { return !/\p{L}/u.test(w); }).join(' ');
    var counts = {}, m = bare.match(/\p{Nd}/gu) || [];
    m.forEach(function (ch) {
      var cp = ch.codePointAt(0);
      Object.keys(ZEROS).forEach(function (k) { if (cp >= ZEROS[k] && cp <= ZEROS[k] + 9) counts[k] = (counts[k] || 0) + 1; });
    });
    var best = null, bn = 0;
    Object.keys(counts).forEach(function (k) { if (counts[k] > bn) { bn = counts[k]; best = k; } });
    return best || NATIVE[lang] || 'latin';
  };
  D.grouping = function (lang) { return LAKH.indexOf(lang) >= 0 ? 'lakh' : 'intl'; };
  D.markerNames = function (text) {
    var re = /\u275D([^\u275E]+)\u275E/g, m, counts = {}, order = [];
    while ((m = re.exec(text))) {
      var n = m[1].replace(/\s+/g, ' ').trim();
      if (!(n in counts)) { counts[n] = 0; order.push(n); }
      counts[n]++;
    }
    var best = null, bn = 0;
    order.forEach(function (n) { if (counts[n] > bn) { bn = counts[n]; best = n; } });
    return best;
  };
  D.fontStack = function (script, userFont) {
    var fam = { Bengali: "'SolaimanLipi','Noto Serif Bengali','Noto Sans Bengali'", Devanagari: "'Noto Serif Devanagari','Noto Sans Devanagari'",
      Arabic: "'Noto Naskh Arabic','Noto Sans Arabic'", Hebrew: "'Noto Serif Hebrew','Noto Sans Hebrew'", Thai: "'Noto Serif Thai','Noto Sans Thai'",
      Tamil: "'Noto Serif Tamil','Noto Sans Tamil'", Telugu: "'Noto Serif Telugu','Noto Sans Telugu'", Gujarati: "'Noto Serif Gujarati','Noto Sans Gujarati'",
      Gurmukhi: "'Noto Serif Gurmukhi','Noto Sans Gurmukhi'", Kannada: "'Noto Serif Kannada','Noto Sans Kannada'",
      Malayalam: "'Noto Serif Malayalam','Noto Sans Malayalam'", Sinhala: "'Noto Serif Sinhala','Noto Sans Sinhala'",
      Khmer: "'Noto Serif Khmer','Noto Sans Khmer'", Myanmar: "'Noto Serif Myanmar','Noto Sans Myanmar'",
      Han: "'Noto Serif CJK SC','Noto Sans CJK SC'", Hiragana: "'Noto Serif CJK JP','Noto Sans CJK JP'", Katakana: "'Noto Serif CJK JP','Noto Sans CJK JP'",
      Hangul: "'Noto Serif CJK KR','Noto Sans CJK KR'", Cyrillic: "'Noto Serif'", Greek: "'Noto Serif'", Latin: "'Noto Serif'" };
    var parts = ["'Noto Serif'"];
    if (userFont) parts.push("'UserFont'");
    parts.push(fam[script] || "'Noto Sans'");
    return parts.join(',') + ',serif';
  };
  /* resolve every 'auto' field of project.json; returns the full project plus a source map */
  D.resolve = function (raw, project, extra) {
    project = project || {}; extra = extra || {};
    var src = {}, p = {};
    var textOnly = String(raw || '').split(/\r?\n/).map(function (l) {
      if (/^\s*#/.test(l)) return '';
      var f = l.split('|'); return f.length >= 3 ? f.slice(2, f.length > 3 ? -1 : undefined).join('|') : '';
    }).join('\n');
    function pick(k, auto, dflt) {
      var v = project[k];
      if (v !== undefined && v !== null && v !== 'auto' && v !== '') { src[k] = 'override'; return v; }
      var a = auto(); if (a !== undefined && a !== null && a !== '') { src[k] = 'detected'; return a; }
      src[k] = 'default'; return dflt;
    }
    p.script = D.script(textOnly).name;
    p.language = pick('language', function () { return D.language(textOnly); }, 'en');
    p.direction = pick('direction', function () { return D.direction(p.language); }, 'ltr');
    p.digits = pick('digits', function () { return D.digits(textOnly, p.language); }, 'latin');
    p.grouping = pick('grouping', function () { return D.grouping(p.language); }, 'intl');
    p.brandName = pick('brandName', function () { return D.markerNames(textOnly); }, '');
    p.tagline = pick('tagline', function () { return ''; }, '');
    p.storeTarget = pick('storeTarget', function () {
      var n = String(extra.badgeName || '').toLowerCase();
      if (/google|play|android/.test(n)) return 'google-play';
      if (/apple|app-?store|ios/.test(n)) return 'app-store';
      return '';
    }, '');
    p.greetingText = pick('greetingText', function () { return ''; }, '');
    p.colors = project.colors && project.colors !== 'auto' ? project.colors : 'auto';
    p.fonts = project.fonts || { main: 'auto' };
    p.logo = project.logo || {};
    p.host = project.host || {};
    p.endPad = project.endPad;
    p.theme = project.theme || 'both';
    p.sources = src;
    return p;
  };
})();
