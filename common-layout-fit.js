/* Uniform scale-to-fit of a scene visual inside its area (minimum 0.6) */
(function () {
  var PV = window.PV, F = PV.layoutFit = {};
  F.measure = function (inner, areaW, areaH) {
    var prev = inner.style.transform; inner.style.transform = 'none';
    var w = inner.offsetWidth, h = inner.offsetHeight;
    inner.style.transform = prev;
    if (!w || !h) return 1;
    var s = Math.min(1, areaW / w, areaH / h);
    return Math.max(0.6, s);
  };
  F.overflow = function (inner, areaW, areaH, s) { return inner.offsetWidth * s > areaW + 1 || inner.offsetHeight * s > areaH + 1; };
})();
