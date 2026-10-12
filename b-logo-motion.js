/* Theme B logo motion: appears at the brand scene, parks top-left, returns for the last scene */
(function () {
  var PV = window.PV, M = PV.logoMotionB = {};
  M.CFG = { w: 520, radius: 56, ring: 6, mode: 'center' };
  M.state = function (t, m) {
    if (t < m.brandStart) return { x: 550, y: 535, scale: 0.2, op: 0, ripple: -1 };
    var lt = t - m.brandStart, intro = 0.2 + 0.8 * PV.easeBack(PV.prog(lt, 0, 0.9)), op = PV.easeOut(PV.prog(lt, 0, 0.5));
    var p1 = PV.easeInOut(PV.prog(t, m.shrinkAt, 0.7)), p2 = m.noReturn ? 0 : PV.easeInOut(PV.prog(t, m.finalAt, 0.7));
    var x = PV.lerp(550, 210, p1), y = PV.lerp(535, 145, p1), s = PV.lerp(1, 0.5, p1);
    x = PV.lerp(x, 550, p2); y = PV.lerp(y, 460, p2); s = PV.lerp(s, 0.78, p2);
    return { x: x, y: y, scale: s * intro, op: op, ripple: (lt >= 0.6 && lt <= 2.0) ? (lt - 0.6) / 1.4 : -1 };
  };
})();
