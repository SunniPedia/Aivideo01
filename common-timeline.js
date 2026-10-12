/* Total duration, visibility windows and speech presence (section 1B) */
(function () {
  var PV = window.PV, T = PV.timeline = { total: 0 };
  T.compute = function (scenes, audioDuration, tailPad, hasAudio) {
    var lastEnd = scenes.length ? scenes[scenes.length - 1].end : 0;
    for (var i = 0; i < scenes.length; i++) lastEnd = Math.max(lastEnd, scenes[i].end);
    audioDuration = audioDuration > 0 ? audioDuration : 0;
    var pad = tailPad == null || isNaN(tailPad) ? (audioDuration > 0 ? 2.0 : 0.5) : tailPad, total, reason;
    if (audioDuration > 0) {
      total = Math.max(audioDuration + pad, lastEnd + 0.5);
      reason = total === lastEnd + 0.5 && audioDuration + pad < lastEnd + 0.5 ? 'last scene end + 0.5 s (audio is shorter than the scenes)' : 'audio ' + audioDuration.toFixed(2) + ' s + tail ' + pad + ' s';
      if (Math.abs(audioDuration - lastEnd) > 1) PV.warn('WARNING audio ' + audioDuration.toFixed(2) + ' s differs from last timestamp end ' + lastEnd.toFixed(2) + ' s; chosen duration ' + total.toFixed(2) + ' s');
    } else { total = lastEnd + pad; reason = 'no audio: last scene end ' + lastEnd.toFixed(2) + ' s + ' + pad + ' s'; }
    T.total = total; T.lastEnd = lastEnd; T.audioDuration = audioDuration; T.reason = reason; T.pad = pad; T.scenes = scenes;
    scenes.forEach(function (s, i) { s.last = i === scenes.length - 1; s.vend = s.last ? total : s.end; });
    /* spoken segments: merge touching windows */
    var segs = [];
    scenes.forEach(function (s) {
      var g = segs[segs.length - 1];
      if (g && s.start - g.e < 0.12) g.e = Math.max(g.e, s.end); else segs.push({ s: s.start, e: s.end });
    });
    T.segs = segs;
    return total;
  };
  /* scene opacity / translateY at time t */
  T.vis = function (sc, t) {
    var dur = sc.dur, e = Math.min(0.45, 0.4 * dur), x = Math.min(0.3, 0.3 * dur);
    var on = t >= sc.start - 0.01 && t <= sc.vend + 0.01;
    if (!on) return { on: false, op: 0, ty: 40, lt: t - sc.start };
    var pe = PV.easeOut(PV.prog(t, sc.start, e)), op = pe;
    if (!sc.last) op *= 1 - PV.easeOut(PV.prog(t, sc.end - x, x));
    return { on: true, op: op, ty: 40 * (1 - pe), lt: t - sc.start, pe: pe };
  };
  /* speech presence 0..1 (eases in/out over 0.3 s, 0 in gaps and in the tail) */
  T.sp = function (t) {
    var v = 0;
    for (var i = 0; i < (T.segs || []).length; i++) {
      var g = T.segs[i], a = PV.easeOut(PV.prog(t, g.s, 0.3));
      if (t >= g.e) a *= 1 - PV.easeOut(PV.prog(t, g.e, 0.3));
      if (t < g.s) a = 0;
      v = Math.max(v, a);
    }
    return v;
  };
  /* index of the scene that is current at t (last started scene), -1 before the first */
  T.active = function (t) {
    var idx = -1, sc = T.scenes || [];
    for (var i = 0; i < sc.length; i++) if (t >= sc[i].start - 0.01) idx = i;
    return idx;
  };
})();
