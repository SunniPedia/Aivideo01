/* timestamps.txt parser: start | end | text | mood */
(function () {
  var PV = window.PV, P = PV.parse = {};
  PV.moods = { respectful: [233, 196, 106], happy: [255, 190, 90], informative: [60, 200, 170], excited: [170, 230, 80], calm: [110, 170, 255], enthusiastic: [255, 160, 70] };
  function time(s) {
    s = String(s).trim().replace(',', '.');
    var m = /^(\d+):(\d+(?:\.\d+)?)$/.exec(s);
    if (m) return parseInt(m[1], 10) * 60 + parseFloat(m[2]);
    return /^\d+(?:\.\d+)?$/.test(s) ? parseFloat(s) : NaN;
  }
  P.time = time;
  P.run = function (raw) {
    var warns = [], scenes = [];
    var lines = String(raw || '').replace(/^\uFEFF/, '').split(/\r?\n/), n = 0;
    lines.forEach(function (ln) {
      if (!ln.trim() || /^\s*#/.test(ln)) return;
      n++;
      var f = ln.split('|');
      if (f.length < 3) { warns.push('line ' + n + ': needs start | end | text'); return; }
      var a = time(f[0]), b = time(f[1]);
      if (isNaN(a) || isNaN(b)) { warns.push('line ' + n + ': bad time'); return; }
      var last = f[f.length - 1].trim().toLowerCase(), mood = 'happy', body;
      if (PV.moods[last] && f.length >= 4) { mood = last; body = f.slice(2, -1).join('|'); }
      else if (PV.moods[last] && f.length === 3) { warns.push('line ' + n + ': empty text, skipped'); return; }
      else body = f.slice(2).join('|');
      body = body.trim();
      if (!body) { warns.push('line ' + n + ': empty text, skipped'); return; }
      var text = '', hl = [], open = -1;
      for (var i = 0; i < body.length; i++) {
        var ch = body.charAt(i);
        if (ch === '\u275D') open = text.length;
        else if (ch === '\u275E') { if (open >= 0 && text.length > open) hl.push([open, text.length]); open = -1; }
        else text += ch;
      }
      if (b <= a) { warns.push('line ' + n + ': end <= start, set to start + 0.5'); b = a + 0.5; }
      scenes.push({ line: n, start: a, end: b, text: text, mood: mood, hl: hl });
    });
    scenes.sort(function (x, y) { return x.start - y.start; });
    for (var k = 0; k < scenes.length - 1; k++) {
      if (scenes[k].end > scenes[k + 1].start + 1e-9) {
        warns.push('line ' + scenes[k].line + ': overlaps the next line, end trimmed');
        scenes[k].end = Math.max(scenes[k].start + 0.05, scenes[k + 1].start);
      }
    }
    scenes.forEach(function (s, i) { s.i = i; s.dur = s.end - s.start; });
    warns.forEach(function (w) { PV.warn(w); });
    return { scenes: scenes, warnings: warns };
  };
})();
