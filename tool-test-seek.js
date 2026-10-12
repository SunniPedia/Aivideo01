/* Seek test in a real Chromium page: every frame step, four modes, plus universality cases. Needs playwright. */
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const assets = require('./tool-assets');
const root = __dirname;
const rd = f => fs.readFileSync(path.join(root, f), 'utf8');
const lines = n => Array.from({ length: n }, (_, i) => (i * 2) + ' | ' + (i * 2 + 1.8) + ' | Item ' + (i + 1) + ' alpha beta gamma delta, epsilon and zeta ' + (i % 3 ? '' : '1200 more') + ' | happy').join('\n');
const CASES = {
  current: { raw: rd('timestamps.txt') },
  english: { raw: '0 | 2 | Welcome | happy\n2 | 6 | ❝Acme Studio❞ is here | informative\n6 | 11 | Fast, secure and simple tools | calm\n11 | 15 | more than 500 templates and 12,000 users | excited\n15 | 19 | Download it from the App Store today | enthusiastic\n19 | 22 | Share it with friends | respectful', lang: 'en' },
  single: { raw: '0 | 0.5 | Hi | happy', lang: 'en' },
  rtl: { raw: '0 | 3 | السلام عليكم | respectful\n4 | 8 | تطبيق ❝نور❞ للقرآن الكريم | happy\n7 | 12 | أكثر من ٥٠٠ كتاب، وأذكار، وتفسير | informative\n12 | 15 | شارك التطبيق | calm', lang: 'ar', dir: 'rtl' },
  many: { raw: lines(40) + '\n80 | 82 | S2 4K H2O | calm\n82 | 85 | 5 10 20 | calm', lang: 'en' }
};
function envelope(n) { return Array.from({ length: n }, (_, i) => +(0.5 + 0.5 * Math.sin(i * 0.37)).toFixed(3)); }
async function runCase(page, theme, name, c, mode) {
  const a = assets.scan(root), fps = 30;
  const opts = { project: JSON.parse(rd('project.json')), scenes: name === 'current' ? JSON.parse(rd('scenes.json')) : null, badge: mode.badge ? a.badge : null, badgeCrop: a.badgeCrop, logo: a.logo, logoData: a.logoData, audioDuration: mode.audio ? 20 : 0, tailPad: 2 };
  await page.goto(pathToFileURL(path.join(root, 'index-' + theme + '.html')).href);
  const out = await page.evaluate(async ([raw, o, env, fps]) => {
    const total = window.init(raw, o); await window.PV.ready; const fit = window.fit();
    if (env) window.setAudio(env, fps); else window.setAudio(null, fps);
    const bad = []; let n = 0;
    for (let t = 0; t <= total + 1e-9; t += 1 / fps) { window.seek(t); if (n++ % 10 === 0 && document.getElementById('stage').innerHTML.indexOf('NaN') >= 0) bad.push('NaN near t=' + t.toFixed(2)); }
    const st = window.PVState, ts = [];
    [0.5, total / 2, total - 0.1].forEach(t => { window.seek(t); ts.push([t.toFixed(1), st.logo.card.style.transform]); });
    return { total, fit, bad, ts, det: window.PV.detect.resolve(raw, {}, {}) };
  }, [c.raw, opts, mode.env ? envelope(21 * fps) : null, fps]);
  return out;
}
(async () => {
  const playwright = require('playwright'), browser = await playwright.chromium.launch(); let fails = 0;
  for (const theme of ['infographic', 'podcast']) {
    const size = theme === 'infographic' ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 };
    const page = await browser.newPage({ viewport: size });
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    for (const [name, c] of Object.entries(CASES)) {
      const modes = name === 'current' ? [{}, { badge: 1 }, { audio: 1, env: 1 }, { badge: 1, audio: 1, env: 1 }] : [{ badge: 1, audio: 1, env: 1 }];
      for (const m of modes) {
        const r = await runCase(page, theme, name, c, m);
        const overflow = (r.fit.warnings || []).filter(w => /overflow|does not fit/.test(w));
        const ok = !r.bad.length && !errs.length && !overflow.length && isFinite(r.total);
        if (!ok) fails++;
        console.log((ok ? 'PASS ' : 'FAIL ') + theme + ' ' + name + ' ' + JSON.stringify(m) + ' total=' + r.total.toFixed(2) + ' lang=' + r.det.language + ' dir=' + r.det.direction + ' digits=' + r.det.digits + ' grouping=' + r.det.grouping + ' brand=' + (r.det.brandName || '-') + (ok ? '' : ' ' + JSON.stringify({ bad: r.bad, errs, overflow })));
        if (name === 'current' && !m.badge && !m.audio) console.log('   logo transforms: ' + JSON.stringify(r.ts));
      }
    }
    await page.close();
  }
  await browser.close(); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
