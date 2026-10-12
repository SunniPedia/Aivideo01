/* Scans the repo root for logo, store badge, fonts and audio; ignores every reserved repo file name */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const RESERVED = new Set(['index-infographic.html', 'index-podcast.html', 'render.js', 'package.json', 'package-lock.json', 'timestamps.txt', 'README.md', 'project.json', 'scenes.json',
  'SolaimanLipi-Regular.ttf', 'SolaimanLipi-Bold.ttf']);
const IMG = /\.(png|jpe?g|webp|svg)$/i, AUD = /\.(mp3|wav|m4a|aac)$/i, FNT = /\.(ttf|otf)$/i;
const PREFIX = /^(tool-|common-|a-|b-|b-host-)/;
function isReserved(n) { return RESERVED.has(n) || PREFIX.test(n) || /^video-.*\.mp4$/.test(n) || n.startsWith('.'); }
function mime(n) { const e = path.extname(n).toLowerCase(); return { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' }[e]; }
function cropOf(file) {
  try {
    const probe = JSON.parse(cp.execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,pix_fmt', '-of', 'json', file]).toString()).streams[0];
    if (!probe || /a/.test((probe.pix_fmt || '').replace(/yuv|rgb|gbr|p|le|be/g, '').replace(/[0-9]/g, '')) || /rgba|ya|argb|bgra|pal8/.test(probe.pix_fmt)) return { aspect: probe ? probe.height / probe.width : 0.387, crop: null };
    const r = cp.spawnSync('ffmpeg', ['-hide_banner', '-i', file, '-vf', 'negate,cropdetect=limit=30:round=2:skip=0', '-frames:v', '2', '-f', 'null', '-'], { encoding: 'utf8' });
    const m = [...(r.stderr || '').matchAll(/crop=(\d+):(\d+):(\d+):(\d+)/g)].pop();
    if (!m) return { aspect: probe.height / probe.width, crop: null };
    return { aspect: probe.height / probe.width, crop: { w: +m[1], h: +m[2], x: +m[3], y: +m[4], iw: probe.width, ih: probe.height } };
  } catch (e) { return { aspect: 0.387, crop: null }; }
}
function scan(root = __dirname) {
  const files = fs.readdirSync(root).filter(n => fs.statSync(path.join(root, n)).isFile() && !isReserved(n));
  const images = files.filter(n => IMG.test(n)), audio = files.filter(n => AUD.test(n)).sort(), fonts = files.filter(n => FNT.test(n)).sort();
  const isBadge = n => /(google|play-?store|app-?store|apple|badge|store)/i.test(n);
  const badge = images.find(isBadge) || null;
  const logo = images.find(n => /logo/i.test(n) && n !== badge) || images.find(n => n !== badge) || null;
  const r = { root, logo, badge, audio: audio[0] || null, fonts, extraImages: images.filter(n => n !== logo && n !== badge), logoData: null, badgeCrop: null, badgeAspect: null };
  if (logo) r.logoData = 'data:' + mime(logo) + ';base64,' + fs.readFileSync(path.join(root, logo)).toString('base64');
  if (badge) { const c = cropOf(path.join(root, badge)); r.badgeCrop = c.crop; r.badgeAspect = c.aspect; }
  return r;
}
module.exports = { scan, isReserved, RESERVED };
