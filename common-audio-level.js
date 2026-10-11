'use strict';
/**
 * common-audio-level.js – setAudio, level(t), synthetic fallback
 */
(function (global) {
  const PV = global.PV = global.PV || {};

  let _env = null;
  let _fps = 30;
  let _audioDur = 0;

  function setAudio(envelope, fps) {
    _env = envelope;
    _fps = fps || 30;
  }

  function setAudioDuration(d) {
    _audioDur = d || 0;
  }

  function level(t) {
    if (_env && _env.length) {
      const idx = Math.floor(t * _fps);
      if (idx >= 0 && idx < _env.length) return _env[idx];
      // after audio ends → 0 (never wrap)
      return 0;
    }
    // synthetic soft pulse
    return Math.max(0, Math.min(1, 0.38 + 0.20 * Math.sin(3.1 * t) + 0.12 * Math.sin(7.7 * t + 1)));
  }

  PV.audio = { setAudio, setAudioDuration, level };
  // also expose on window for the contract
  global.setAudio = function (env, fps) { setAudio(env, fps); };
})(typeof window !== 'undefined' ? window : global);
