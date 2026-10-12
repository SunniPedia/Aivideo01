/* Deterministic host animation (mouth, blink, head, torso, eyebrows, right-arm gesture) */
(function () {
  var PV = window.PV, A = PV.hostAnim = {};
  function tf(el, s) { if (el) el.setAttribute('transform', s); }
  A.update = function (o, t, sp, lv, mouthDrive) {
    var m = PV.clamp(mouthDrive * (0.75 + 0.25 * lv));
    var blinkP = function (per, off) { var x = ((t - off) % per + per) % per; return x < 0.16 ? Math.sin(Math.PI * x / 0.16) : 0; };
    var blink = Math.max(blinkP(3.4, 0), blinkP(5.3, 1.1));
    var hy = Math.sin(1.7 * t) * 1.5 - 3.5 * m, hr = Math.sin(0.8 * t) * 1.4 + sp * Math.sin(2.3 * t) * 0.9;
    tf(o['host-head'], 'translate(0 ' + hy.toFixed(2) + ') rotate(' + hr.toFixed(3) + ' 460 380)');
    tf(o['host-torso'], 'translate(0 ' + (Math.sin(1.6 * t) * 2.2 + 3 * lv * sp).toFixed(2) + ')');
    tf(o['host-mouth'], 'translate(460 316) scale(' + (1 + 0.18 * m).toFixed(3) + ' ' + (0.10 + 0.90 * m).toFixed(3) + ') translate(-460 -316)');
    tf(o['host-eyebrows'], 'translate(0 ' + (-(2 + 6 * lv * sp + 2 * m)).toFixed(2) + ')');
    tf(o['host-pupils'], 'translate(' + (Math.sin(0.5 * t) * 2.5).toFixed(2) + ' ' + (Math.sin(0.37 * t + 1) * 1.2).toFixed(2) + ')');
    var lid = 'translate(0 220) scale(1 ' + blink.toFixed(3) + ') translate(0 -220)';
    ['host-lid-l', 'host-lid-r'].forEach(function (id) { var e = o.svg.querySelector('#' + id); tf(e, lid); });
    var wave = 0.5 + 0.5 * Math.sin(1.1 * t), ang = -(5 + 36 * sp * (0.35 + 0.65 * wave * (0.5 + 0.5 * lv)));
    tf(o['host-arm-right'], 'rotate(' + ang.toFixed(2) + ' 670 462)');
    tf(o['host-arm-left'], 'rotate(' + (Math.sin(0.9 * t) * 1.2).toFixed(2) + ' 250 462)');
    if (o['host-waves']) { o['host-waves'].style.opacity = (0.15 + 0.85 * PV.clamp(lv * sp)).toFixed(3); }
  };
})();
