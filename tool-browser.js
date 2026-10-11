'use strict';
/**
 * tool-browser.js – Playwright page setup, init, font wait, fit, frame loop
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function createPage(env, htmlFile) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-gpu']
  });
  const context = await browser.newContext({
    viewport: { width: env.designW, height: env.designH },
    deviceScaleFactor: env.scale
  });
  const page = await context.newPage();
  page.on('pageerror', err => console.error('[pageerror]', err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') console.error('[console]', msg.text());
  });

  const htmlPath = path.resolve(htmlFile);
  await page.goto('file://' + htmlPath, { waitUntil: 'domcontentloaded', timeout: 60000 });
  return { browser, context, page };
}

async function runInit(page, timestampsText, opts) {
  const total = await page.evaluate(async ({ ts, o }) => {
    if (typeof window.init !== 'function') throw new Error('window.init not found');
    return window.init(ts, o);
  }, { ts: timestampsText, o: opts });
  return total;
}

async function waitFonts(page) {
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
      const loaded = [];
      for (const f of document.fonts) {
        if (f.status === 'loaded') loaded.push(f.family);
      }
      console.log('[fonts] loaded:', loaded.join(', ') || '(none)');
    }
  });
  // extra settle
  await page.waitForTimeout(300);
}

async function runFit(page) {
  return page.evaluate(() => {
    if (typeof window.fit === 'function') return window.fit();
    return null;
  });
}

async function seekAndScreenshot(page, t) {
  await page.evaluate(t => {
    if (typeof window.seek === 'function') window.seek(t);
  }, t);
  const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
  return buf;
}

module.exports = { createPage, runInit, waitFonts, runFit, seekAndScreenshot };
