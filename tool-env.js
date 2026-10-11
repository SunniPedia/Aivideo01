'use strict';
/**
 * tool-env.js – Environment parsing and defaults
 */
const path = require('path');

function parseEnv() {
  const theme = (process.env.THEME || 'podcast').toLowerCase();
  const isInfographic = theme === 'infographic';
  const designW = isInfographic ? 1080 : 1920;
  const designH = isInfographic ? 1920 : 1080;
  const width = parseInt(process.env.WIDTH || String(designW), 10);
  const fps = parseInt(process.env.FPS || '30', 10);
  const out = process.env.OUT || `video-${theme}.mp4`;
  const start = process.env.START ? parseFloat(process.env.START) : 0;
  const end = process.env.END ? parseFloat(process.env.END) : null;
  const audioVolume = parseFloat(process.env.AUDIO_VOLUME || '1.0');
  const endPad = process.env.END_PAD != null ? parseFloat(process.env.END_PAD) : null;
  const audioFadeOut = parseFloat(process.env.AUDIO_FADE_OUT || '0.5');

  return {
    theme,
    isInfographic,
    designW,
    designH,
    width,
    height: Math.round(width * (designH / designW)),
    fps,
    out,
    start,
    end,
    audioVolume,
    endPad,
    audioFadeOut,
    scale: width / designW
  };
}

module.exports = { parseEnv };
