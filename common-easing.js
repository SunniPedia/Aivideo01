'use strict';
/**
 * common-easing.js – deterministic easing helpers
 */
(function (global) {
  const PV = global.PV = global.PV || {};

  function clamp(x, a, b) {
    if (a == null) a = 0;
    if (b == null) b = 1;
    return x < a ? a : x > b ? b : x;
  }

  function easeOut(x) {
    x = clamp(x);
    return 1 - Math.pow(1 - x, 3);
  }

  function easeInOut(x) {
    x = clamp(x);
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function easeBack(x) {
    x = clamp(x);
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }

  function prog(t, start, dur) {
    if (dur <= 0) return t >= start ? 1 : 0;
    return clamp((t - start) / dur);
  }

  PV.ease = { clamp, easeOut, easeInOut, easeBack, prog };
})(typeof window !== 'undefined' ? window : global);
