/* Font loading checks, user-font injection and the CLI used by the workflow */
const fs = require('fs'), path = require('path');
async function injectUserFonts(page, fonts, root) {
  if (!fonts.length) return;
  const css = fonts.map((f, i) => "@font-face{font-family:'UserFont';src:url('./" + f.replace(/'/g, '') + "');font-display:block;" + (/bold/i.test(f) ? 'font-weight:700;' : '') + '}').join('\n');
  await page.addStyleTag({ content: css });
}
async function checkFonts(page, sample, log = console.log) {
  const res = await page.evaluate(async (txt) => {
    const fams = ['SolaimanLipi', 'UserFont', 'Noto Serif', 'Noto Serif Bengali', 'Noto Sans Bengali', 'Noto Naskh Arabic'];
    for (const f of fams) { try { await document.fonts.load('40px "' + f + '"', txt); } catch (e) { /* ignore */ } }
    await document.fonts.ready;
    const faces = []; document.fonts.forEach(ff => faces.push(ff.family.replace(/["']/g, '') + ' ' + ff.weight + ': ' + ff.status));
    return { faces, check: fams.map(f => f + '=' + document.fonts.check('40px "' + f + '"', txt)) };
  }, sample || 'A');
  log('Fonts (@font-face): ' + (res.faces.join('; ') || 'none'));
  log('Font check: ' + res.check.join(', '));
  return res;
}
/* CLI: node tool-fonts.js --which  -> prints "solaiman" when the workflow must download SolaimanLipi */
function whichFont(root) {
  const pj = JSON.parse(fs.readFileSync(path.join(root, 'project.json'), 'utf8')), main = (pj.fonts && pj.fonts.main) || 'auto';
  const raw = fs.readFileSync(path.join(root, 'timestamps.txt'), 'utf8');
  const bn = (raw.match(/\p{Script=Bengali}/gu) || []).length, other = (raw.match(/\p{L}/gu) || []).length - bn;
  const userFont = fs.readdirSync(root).some(n => /\.(ttf|otf)$/i.test(n) && !/^SolaimanLipi/.test(n));
  if (main === 'SolaimanLipi') return 'solaiman';
  if (main === 'auto' && !userFont && bn > other) return 'solaiman';
  return 'none';
}
if (require.main === module && process.argv.includes('--which')) console.log(whichFont(__dirname));
module.exports = { injectUserFonts, checkFonts, whichFont };
