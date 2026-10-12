/* Duration and tail tests (section 1B). Pure logic, no browser needed. */
const vm = require('vm'), fs = require('fs'), path = require('path');
const ctx = { window: {}, console }; vm.createContext(ctx);
['common-easing.js', 'common-parse.js', 'common-timeline.js', 'common-audio-level.js'].forEach(f => vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8'), ctx));
const PV = ctx.window.PV; let fails = 0;
function ok(c, m) { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; }
const near = (a, b, e = 1e-6) => Math.abs(a - b) < e;
function run(raw, audio, pad) { PV.warnings = []; const sc = PV.parse.run(raw).scenes; const total = PV.timeline.compute(sc, audio, pad, audio > 0); return { sc, total }; }
const base = '0 | 3 | one | happy\n3 | 6 | two | calm';
let r = run(base, 10, 2);
ok(near(r.total, 12), '(a) audio 10 s, last end 6 s -> total 12.0 (got ' + r.total + ')');
const last = r.sc[1], v = PV.timeline.vis(last, 11.9);
ok(v.on && near(v.op, 1), '(a) last scene visible and unfaded at t = 11.9');
ok(PV.timeline.sp(6.3) < 0.01 && PV.timeline.sp(11) === 0, '(a) speech presence (mouth drive) is 0 after 6.3 s');
PV.audio.setAudio = undefined; ctx.window.setAudio(new Array(300).fill(0.7), 30);
ok(PV.audio.level(9.9) > 0 && PV.audio.level(10.0) === 0 && PV.audio.level(11) === 0, '(a) audio level is 0 after the audio ended (no loop)');
r = run('0 | 4 | a | happy\n4 | 8 | b | calm', 3, 2);
ok(near(r.total, 8.5) && PV.warnings.some(w => /WARNING/.test(w)), '(b) audio 3 s, last end 8 s -> total 8.5 with WARNING');
r = run(base, 0, 0.5);
ok(near(r.total, 6.5), '(c) no audio -> last end + 0.5 (got ' + r.total + ')');
r = run(base, 10, 0);
ok(near(r.total, 10), '(d) END_PAD 0 -> total = audio length');
r = run(base, 5.5, 0);
ok(near(r.total, 6.5), '(d) END_PAD 0 and short audio -> still last end + 0.5');
r = run('0 | 0.5 | x', 0, 0.5);
ok(near(r.total, 1.0), 'single 0.5 s line, no audio -> 1.0');
r = run('0 | 3 | a\n2 | 5 | b', 0, 0.5);
ok(r.sc[0].end <= r.sc[1].start + 1e-9, 'overlap trimmed');
console.log('(e) ffprobe check after a real render is done by the workflow log step and README test notes.');
process.exit(fails ? 1 : 0);
