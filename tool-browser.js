/* Playwright page setup, init, font wait, fit and the frame loop */
const path = require('path'), { pathToFileURL } = require('url');
const fonts = require('./tool-fonts');
async function openPage(playwright, env, root) {
  const browser = await playwright.chromium.launch({ args: ['--allow-file-access-from-files', '--font-render-hinting=none'] });
  const ctx = await browser.newContext({ viewport: { width: env.design.w, height: env.design.h }, deviceScaleFactor: env.width / env.design.w });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.error('PAGE ERROR:', e.message));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.error('PAGE ' + m.type() + ':', m.text()); });
  await page.goto(pathToFileURL(path.join(root, env.design.html)).href);
  await page.waitForFunction(() => window.PV && typeof window.init === 'function');
  return { browser, page };
}
async function initPage(page, raw, opts, sample, log = console.log) {
  if (opts.fontFiles && opts.fontFiles.length) await fonts.injectUserFonts(page, opts.fontFiles);
  const { fontFiles, ...pageOpts } = opts;
  const total = await page.evaluate(([r, o]) => window.init(r, o), [raw, pageOpts]);
  await page.evaluate(() => window.PV.ready);
  await fonts.checkFonts(page, sample, log);
  const fit = await page.evaluate(() => window.fit());
  const info = await page.evaluate(() => ({ reason: window.PV.timeline.reason, total: window.PV.timeline.total, warnings: window.PV.warnings.slice(), source: window.PVState && window.PVState.paletteSource }));
  return { total, fit, info };
}
async function frameLoop(page, enc, o, log = console.log) {
  const count = Math.ceil((o.end - o.start) * o.fps - 1e-9);
  for (let n = 0; n < count; n++) {
    const t = o.start + n / o.fps;
    await page.evaluate(tt => window.seek(tt), t);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    await enc.write(buf);
    if (n % 60 === 0) log('frame ' + n + '/' + count + '  t=' + t.toFixed(2) + 's');
  }
  return count;
}
module.exports = { openPage, initPage, frameLoop };
