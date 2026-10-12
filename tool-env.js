/* Environment parsing and defaults */
const DESIGN = { infographic: { w: 1080, h: 1920, html: 'index-infographic.html' }, podcast: { w: 1920, h: 1080, html: 'index-podcast.html' } };
function num(v, d) { if (v === undefined || v === '') return d; const n = Number(v); return Number.isFinite(n) ? n : d; }
function parseEnv(env = process.env) {
  const theme = (env.THEME || 'podcast').trim();
  if (!DESIGN[theme]) throw new Error('THEME must be infographic or podcast, got: ' + theme);
  const d = DESIGN[theme];
  const width = num(env.WIDTH, d.w), fps = num(env.FPS, 30);
  return {
    theme, design: d, width: Math.round(width), height: Math.round(width * d.h / d.w), fps,
    out: env.OUT || ('video-' + theme + '.mp4'), start: num(env.START, 0), end: env.END === undefined || env.END === '' ? null : num(env.END, null),
    volume: num(env.AUDIO_VOLUME, 1.0), endPad: env.END_PAD === undefined || env.END_PAD === '' ? null : num(env.END_PAD, null),
    fadeOut: num(env.AUDIO_FADE_OUT, 0.5)
  };
}
module.exports = { parseEnv, DESIGN };
