'use strict';
/**
 * render.js – thin entry: env → assets → audio → browser → frames → ffmpeg
 */
const fs = require('fs');
const path = require('path');
const { parseEnv } = require('./tool-env');
const { scanAssets, loadLogoDataUrl } = require('./tool-assets');
const { probeDuration, analyzeEnvelope, buildMuxArgs } = require('./tool-audio');
const { createPage, runInit, waitFonts, runFit, seekAndScreenshot } = require('./tool-browser');
const { createEncoder } = require('./tool-encoder');

async function main() {
  const env = parseEnv();
  const root = process.cwd();
  console.log('[render] theme=', env.theme, 'size=', env.width + 'x' + env.height, 'fps=', env.fps);

  // Assets
  const assets = scanAssets(root);
  console.log('[assets] logo=', assets.logo, 'badge=', assets.badge, 'audio=', assets.audio, 'fonts=', assets.fonts.length);

  // Project & scenes
  let project = {};
  if (fs.existsSync(path.join(root, 'project.json'))) {
    project = JSON.parse(fs.readFileSync(path.join(root, 'project.json'), 'utf8'));
  }
  let scenes = null;
  if (fs.existsSync(path.join(root, 'scenes.json'))) {
    try {
      scenes = JSON.parse(fs.readFileSync(path.join(root, 'scenes.json'), 'utf8'));
    } catch (_) { scenes = null; }
  }

  // Timestamps
  const tsPath = path.join(root, 'timestamps.txt');
  if (!fs.existsSync(tsPath)) {
    console.error('timestamps.txt missing');
    process.exit(1);
  }
  const timestampsText = fs.readFileSync(tsPath, 'utf8');

  // Audio
  let audioDuration = 0;
  let envelope = null;
  if (assets.audio) {
    const audioPath = path.join(root, assets.audio);
    audioDuration = await probeDuration(audioPath);
    console.log('[audio] duration=', audioDuration.toFixed(3), 's');
    envelope = await analyzeEnvelope(audioPath, env.fps);
  } else {
    console.log('[audio] no audio file – silent video');
  }

  // END_PAD
  let endPad = env.endPad;
  if (endPad == null) {
    endPad = (project.endPad != null) ? project.endPad : (assets.audio ? 2.0 : 0.5);
  }

  // HTML
  const htmlFile = env.isInfographic ? 'index-infographic.html' : 'index-podcast.html';
  if (!fs.existsSync(path.join(root, htmlFile))) {
    console.error(htmlFile + ' missing');
    process.exit(1);
  }

  const logoData = loadLogoDataUrl(root, assets.logo);

  const opts = {
    project,
    scenes,
    badge: assets.badge,
    logo: assets.logo,
    logoData,
    audioDuration,
    tailPad: endPad
  };

  const { browser, page } = await createPage(env, htmlFile);

  try {
    const total = await runInit(page, timestampsText, opts);
    console.log('[init] total duration=', total.toFixed(3), 's (audio=', audioDuration.toFixed(3), '+ pad=', endPad, ')');

    // WARN if mismatch
    if (assets.audio) {
      // last scene end is inside the page; we approximate from total
      if (Math.abs(audioDuration - (total - endPad)) > 1.0) {
        console.warn('[WARNING] audio length and last timestamp end differ by >1s; chosen total=', total.toFixed(3));
      }
    }

    await waitFonts(page);
    await runFit(page);

    if (envelope) {
      await page.evaluate(({ env, fps }) => {
        if (typeof window.setAudio === 'function') window.setAudio(env, fps);
      }, { env: Array.from(envelope), fps: env.fps });
    }

    const startT = env.start || 0;
    const endT = env.end != null ? env.end : total;
    const duration = Math.max(0.1, endT - startT);
    const frameCount = Math.ceil(duration * env.fps);
    console.log('[render] frames=', frameCount, 'from', startT, 'to', endT);

    const audioArgs = assets.audio
      ? buildMuxArgs({
          audioPath: path.join(root, assets.audio),
          start: startT,
          duration,
          audioDuration,
          audioVolume: env.audioVolume,
          audioFadeOut: env.audioFadeOut,
          outPath: env.out
        })
      : { map: ['-map', '0:v'], duration: ['-t', String(duration)] };

    const encoder = createEncoder({
      width: env.width,
      height: env.height,
      fps: env.fps,
      duration,
      outPath: env.out,
      audioArgs
    });

    for (let i = 0; i < frameCount; i++) {
      const t = startT + i / env.fps;
      const jpeg = await seekAndScreenshot(page, t);
      await encoder.writeFrame(jpeg);
      if (i % 60 === 0) {
        console.log(`[progress] frame ${i}/${frameCount} t=${t.toFixed(2)}`);
      }
    }

    await encoder.finish();
    console.log('[done] wrote', env.out);
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
