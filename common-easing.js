/* Easing helpers, tiny DOM helpers and the global namespace window.PV */
(function () {
  var PV = window.PV = window.PV || {};
  var C = function (x, a, b) { a = a == null ? 0 : a; b = b == null ? 1 : b; return x < a ? a : (x > b ? b : x); };
  PV.clamp = C;
  PV.easeOut = function (x) { x = C(x); return 1 - Math.pow(1 - x, 3); };
  PV.easeInOut = function (x) { x = C(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  PV.easeBack = function (x) { x = C(x); var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  PV.prog = function (t, s, d) { return C((t - s) / Math.max(1e-6, d)); };
  PV.lerp = function (a, b, x) { return a + (b - a) * x; };
  PV.NS = 'http://www.w3.org/2000/svg';
  PV.h = function (tag, cls, parent, css) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (css) Object.assign(e.style, css);
    if (parent) parent.appendChild(e);
    return e;
  };
  PV.s = function (tag, attrs, parent) {
    var e = document.createElementNS(PV.NS, tag);
    for (var k in (attrs || {})) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  PV.warnings = [];
  PV.warn = function (m) { PV.warnings.push(String(m)); };
  PV.num = function (x, d) { return isFinite(x) ? x : (d || 0); };
})();
