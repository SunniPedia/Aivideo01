/* Theme A logo motion: intro, shrink after the brand scene, grow back for the final call-to-action */
(function () {
  var PV = window.PV, M = PV.logoMotionA = {};
  M.CFG = { w: 520, radius: 56, ring: 6, mode: 'top', x: 540, y: 190 };
  M.state = function (t, marks) {
    var intro = 0.2 + 0.8 * PV.easeBack(PV.prog(t, 0, 0.9)), op = PV.easeOut(PV.prog(t, 0, 0.5));
    var pS = PV.easeInOut(PV.prog(t, marks.shrinkAt, 0.7)), grow = Math.max(marks.growAt, marks.shrinkAt + 0.7), pG = PV.easeInOut(PV.prog(t, grow, 0.8));
    var k = pS * (1 - pG), rp = (t >= 0.6 && t <= 2.0) ? (t - 0.6) / 1.4 : -1;
    return { x: M.CFG.x, y: M.CFG.y - 120 * k, scale: intro * (1 - 0.38 * k), op: op, ripple: rp };
  };
})();
