/* Thin entry: THEME=infographic|podcast node render.js (see README) */
const fs = require('fs'), path = require('path');
const { parseEnv } = require('./tool-env'), assets = require('./tool-assets'), audio = require('./tool-audio');
const browser = require('./tool-browser'), { startEncoder } = require('./tool-encoder');
async function main() {
  const root = __dirname, env = parseEnv();
  const playwright = require('playwright');
  const raw = fs.readFileSync(path.join(root, 'timestamps.txt'), 'utf8');
  const read = f => { try { return JSON.parse(fs.readFileSync(path.join(root, f), 'utf8')); } catch (e) { return null; } };
  const project = read('project.json') || {}, scenes = read('scenes.json');
  const a = assets.scan(root);
  console.log('Assets: logo=' + a.logo + ' badge=' + a.badge + ' audio=' + a.audio + ' fonts=' + (a.fonts.join(',') || 'none'));
  if (!a.logo) console.warn('WARNING no logo image found in the repo root');
  const audioDuration = a.audio ? audio.probeDuration(path.join(root, a.audio)) : 0;
  if (!a.audio) console.log('No audio file: rendering a silent video.');
  let endPad = env.endPad; if (endPad == null && typeof project.endPad === 'number') endPad = project.endPad;
  if (endPad == null) endPad = a.audio ? 2.0 : 0.5;
  const opts = { project, scenes: Array.isArray(scenes) ? scenes : (scenes && scenes.scenes) || null, badge: a.badge, badgeCrop: a.badgeCrop, badgeAspect: a.badgeAspect, logo: a.logo, logoData: a.logoData,
    audioDuration, tailPad: endPad, hasUserFont: a.fonts.length > 0, fontFiles: a.fonts };
  const { browser: br, page } = await browser.openPage(playwright, env, root);
  try {
    const sample = raw.replace(/[|\d.:]/g, ' ').slice(0, 400);
    const { total, fit, info } = await browser.initPage(page, raw, opts, sample);
    console.log('Duration ' + total.toFixed(3) + ' s (' + info.reason + '); palette from ' + info.source);
    (info.warnings || []).forEach(w => console.warn(/^WARNING/.test(w) ? w : 'WARNING ' + w));
    if (require('./tool-fonts').whichFont(root) === 'solaiman' && !fs.existsSync(path.join(root, 'SolaimanLipi-Regular.ttf'))) console.warn('WARNING main font SolaimanLipi is missing (the workflow downloads it; locally upload SolaimanLipi-Regular.ttf and SolaimanLipi-Bold.ttf to the root). Using the installed Noto fonts for now.');
    if (a.audio) { await page.evaluate(([e, f]) => window.setAudio(e, f), [audio.analyze(path.join(root, a.audio), env.fps), env.fps]); }
    const end = Math.min(total, env.end == null ? total : env.end), start = env.start, duration = end - start;
    if (!(duration > 0)) throw new Error('empty render range');
    const mux = audio.muxArgs(a.audio ? path.join(root, a.audio) : null, { start, fadeOut: env.fadeOut, volume: env.volume, audioDuration, duration });
    const enc = startEncoder({ fps: env.fps, audio: mux, duration, out: path.resolve(root, env.out) });
    const count = await browser.frameLoop(page, enc, { start, end, fps: env.fps });
    await enc.finish();
    console.log('Done: ' + env.out + ' (' + count + ' frames, ' + duration.toFixed(2) + ' s, ' + env.width + 'x' + env.height + ')');
  } finally { await br.close(); }
}
main().catch(e => { console.error('ERROR', e && e.stack || e); process.exit(1); });
