'use strict';
/**
 * common-timeline.js – total duration, spoken windows, last-scene hold
 */
(function (global) {
  const PV = global.PV = global.PV || {};

  function computeTotal(scenes, audioDuration, tailPad) {
    let lastEnd = 0;
    if (scenes && scenes.length) {
      lastEnd = scenes[scenes.length - 1].end;
    }
    let total;
    if (audioDuration > 0) {
      total = Math.max(audioDuration + tailPad, lastEnd + 0.5);
    } else {
      total = lastEnd + (tailPad != null ? tailPad : 0.5);
    }
    return total;
  }

  function speechPresence(t, scenes) {
    // 1 inside original spoken window, ease in/out 0.3s
    if (!scenes || !scenes.length) return 0;
    let maxSp = 0;
    for (const s of scenes) {
      const st = s.originalStart != null ? s.originalStart : s.start;
      const en = s.originalEnd != null ? s.originalEnd : s.end;
      if (t < st - 0.3 || t > en + 0.3) continue;
      let sp = 1;
      if (t < st) sp = PV.ease.easeOut(PV.ease.prog(t, st - 0.3, 0.3));
      else if (t > en) sp = 1 - PV.ease.easeOut(PV.ease.prog(t, en, 0.3));
      if (sp > maxSp) maxSp = sp;
    }
    return maxSp;
  }

  function activeScene(t, scenes, total) {
    if (!scenes || !scenes.length) return null;
    for (let i = 0; i < scenes.length; i++) {
      const s = scenes[i];
      const visStart = s.start - 0.01;
      let visEnd = s.end + 0.01;
      // last scene holds to total
      if (i === scenes.length - 1) visEnd = total + 0.01;
      if (t >= visStart && t <= visEnd) return s;
    }
    return null;
  }

  PV.timeline = {
    computeTotal,
    speechPresence,
    activeScene,
    total: 0
  };
})(typeof window !== 'undefined' ? window : global);
