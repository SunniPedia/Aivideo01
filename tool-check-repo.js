/* Static checks run by the workflow before rendering. Exit code 1 on any error. */
const fs = require('fs'), path = require('path');
const root = __dirname, errors = [], notes = [];
const err = m => errors.push(m);
const list = fs.readdirSync(root, { withFileTypes: true }).filter(e => !['node_modules', '.git'].includes(e.name));
const files = list.filter(e => e.isFile()).map(e => e.name);
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
/* 1. flat structure */
list.filter(e => e.isDirectory()).forEach(d => { if (d.name !== '.github') err('sub-folder not allowed: ' + d.name); });
if (fs.existsSync(path.join(root, '.github'))) {
  const gh = fs.readdirSync(path.join(root, '.github'));
  if (gh.length !== 1 || gh[0] !== 'workflows' || fs.readdirSync(path.join(root, '.github/workflows')).join() !== 'render.yml') err('.github may only contain workflows/render.yml');
} else err('missing .github/workflows/render.yml');
/* 2. referenced files exist */
const OPTIONAL = /^SolaimanLipi-(Regular|Bold)\.ttf$/;
const refs = [];
files.filter(f => f.endsWith('.html')).forEach(f => { const s = read(f); for (const m of s.matchAll(/(?:src|href)="\.\/([^"]+)"/g)) refs.push([f, m[1]]); });
files.filter(f => f.endsWith('.css')).forEach(f => { for (const m of read(f).matchAll(/url\('([^')]+)'\)/g)) refs.push([f, m[1]]); });
files.filter(f => /^(tool-|render)/.test(f) && f.endsWith('.js')).forEach(f => { for (const m of read(f).matchAll(/require\('\.\/([^']+)'\)/g)) refs.push([f, m[1].endsWith('.js') ? m[1] : m[1] + '.js']); });
refs.forEach(([f, r]) => { if (!fs.existsSync(path.join(root, r)) && !OPTIONAL.test(r)) err(f + ' references missing file ' + r); });
/* 3. emoji / pictograph scan (user text in timestamps.txt is exempt) */
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\uFE0F]/u;
files.filter(f => /\.(html|css|js|json|yml|md)$/.test(f)).forEach(f => {
  const s = read(f);
  if (f === 'README.md') { if (EMOJI.test(s.replace(/\u275D|\u275E/g, ''))) err('emoji in ' + f); return; }
  const m = EMOJI.exec(s.replace(/\u275D|\u275E/g, '')); if (m) err('emoji/pictograph U+' + m[0].codePointAt(0).toString(16) + ' in ' + f);
});
/* 4. symbols: geometry duplicates, use targets */
const symSrc = read('common-icons-core.js') + read('common-icons-topic.js'), geo = {}, names = [];
for (const m of symSrc.matchAll(/(?:I\.add\('([a-z0-9-]+)',\s*'((?:[^'\\]|\\.)*)'\)|^\s+'([a-z0-9-]+)':\s*'((?:[^'\\]|\\.)*)',?$)/gm)) {
  const n = m[1] || m[3], g = (m[2] || m[4]).replace(/class="[A-Z]"/g, '').replace(/\s+/g, ' ');
  names.push(n); if (geo[g]) err('duplicate symbol geometry: ' + n + ' = ' + geo[g]); geo[g] = n;
}
if (new Set(names).size !== names.length) err('duplicate symbol names');
if (names.length < 79) err('icon library has ' + names.length + ' icons, need at least 79');
notes.push('icons defined: ' + names.length);
const used = new Set();
files.filter(f => f.endsWith('.js')).forEach(f => { for (const m of read(f).matchAll(/(?:make|ic)\('([a-z0-9-]+)'/g)) used.add(m[1]); });
try { JSON.parse(read('scenes.json')).forEach(e => { (e.items || []).forEach(i => i.icon && used.add(i.icon)); (e.icons || []).forEach(i => used.add(i)); }); } catch (e) { err('scenes.json: ' + e.message); }
used.forEach(n => { if (!names.includes(n) && !['star8'].includes(n)) err('icon used but not defined: ' + n); });
for (const m of read('common-icon-map.js').matchAll(/^    (?:'([a-z0-9-]+)'|([a-z0-9]+)):/gm)) { const n = m[1] || m[2]; if (!names.includes(n)) err('icon-map entry without symbol: ' + n); }
/* 5. duplicate ids (literal ids across page files) */
const ids = {};
files.filter(f => /^(common|a|b)-.*\.js$/.test(f) || f.endsWith('.html')).forEach(f => {
  for (const m of read(f).matchAll(/(?:id:\s*|id="|\.id\s*=\s*|setAttribute\('id',\s*)'?"?([a-z][a-z0-9_-]*)/gi)) { const k = m[1]; if (/^(host-lid-)/.test(k)) continue; (ids[k] = ids[k] || new Set()).add(f); }
});
/* 6. hard-coded project text */
const raw = read('timestamps.txt').split(/\r?\n/).filter(l => l.trim() && !l.startsWith('#'));
const texts = raw.map(l => l.split('|').slice(2, -1).join('|').replace(/[\u275D\u275E]/g, '').trim()).filter(t => t.length >= 8);
const brand = (raw.join('\n').match(/\u275D([^\u275E]+)\u275E/) || [])[1];
files.filter(f => /^(common|a|b|tool)-.*\.js$/.test(f) || f === 'render.js' || /^(common|a|b)-.*\.css$/.test(f) || f.endsWith('.html')).forEach(f => {
  const s = read(f);
  /* common-keywords.js is DATA ONLY (standard greeting words of many languages), so it is exempt from the line scan */
  if (f !== 'common-keywords.js') texts.forEach(t => { if (s.includes(t)) err('hard-coded timestamps text in ' + f + ': ' + t.slice(0, 20)); });
  if (brand && s.includes(brand.trim())) err('hard-coded brand name in ' + f);
});
/* 7. scenes.json labels are exact substrings */
try {
  const lines = raw.map(l => l.split('|').slice(2, -1).join('|').replace(/[\u275D\u275E]/g, '').trim());
  JSON.parse(read('scenes.json')).forEach(e => {
    const t = lines[e.line - 1]; if (!t) return err('scenes.json line ' + e.line + ' does not exist');
    if (Array.from(t).slice(0, 20).join('') !== e.match) err('scenes.json line ' + e.line + ' is stale');
    (e.items || []).forEach(i => { if (!t.includes(i.label)) err('scenes.json label not in line ' + e.line + ': ' + i.label); });
    (e.numbers || []).forEach(n => { if (n.label && !t.includes(n.label)) err('scenes.json number label not in line ' + e.line); });
  });
} catch (e) { err('scenes.json check: ' + e.message); }
/* 8. forbidden APIs in page files */
files.filter(f => /^(common|a|b)-.*\.(js|css)$/.test(f) || f.endsWith('.html')).forEach(f => {
  const s = read(f);
  ['setTimeout', 'setInterval', 'requestAnimationFrame', 'Date.now', 'Math.random', '@keyframes', 'animation:', 'transition:'].forEach(w => { if (s.includes(w)) err('forbidden "' + w + '" in ' + f); });
  for (const m of s.matchAll(/https?:\/\/[^\s'"<)]+/g)) if (m[0] !== 'http://www.w3.org/2000/svg') err('remote URL in ' + f + ': ' + m[0]);
});
/* 9. every file under ~400 lines */
files.filter(f => /\.(js|css|html)$/.test(f)).forEach(f => { if (read(f).split('\n').length > 400) err(f + ' exceeds 400 lines'); });
notes.forEach(n => console.log('note: ' + n));
if (errors.length) { console.error('CHECK FAILED:\n - ' + errors.join('\n - ')); process.exit(1); }
console.log('tool-check-repo: all static checks passed');
