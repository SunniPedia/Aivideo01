/* Audio level: envelope from the renderer (never looped) or a synthetic pulse when there is no audio */
(function () {
  var PV = window.PV, A = PV.audio = { env: null, fps: 30 };
  window.setAudio = function (envelope, fps) { A.env = envelope && envelope.length ? Array.prototype.slice.call(envelope) : null; A.fps = fps || 30; };
  A.level = function (t) {
    if (A.env) { var i = Math.floor(t * A.fps + 1e-6); return i >= 0 && i < A.env.length ? PV.clamp(A.env[i]) : 0; }
    return PV.clamp(0.38 + 0.20 * Math.sin(3.1 * t) + 0.12 * Math.sin(7.7 * t + 1));
  };
})();
