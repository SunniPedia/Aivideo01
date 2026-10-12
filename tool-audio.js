/* Audio: duration probe, envelope analysis and mux arguments (audio plays once, never loops) */
const cp = require('child_process'), path = require('path');
function probeDuration(file) {
  try {
    const out = cp.execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString().trim();
    const d = parseFloat(out); if (Number.isFinite(d) && d > 0) return d;
  } catch (e) { /* fall through */ }
  const buf = cp.execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-f', 's16le', '-ac', '1', '-ar', '22050', '-'], { maxBuffer: 1 << 30 });
  return buf.length / 2 / 22050;
}
/* RMS per video frame, normalised by the 95th percentile, smoothed (attack 0.6, release 0.18) */
function envelopeFromSamples(samples, fps, rate = 22050) {
  const per = rate / fps, n = Math.ceil(samples.length / per), raw = new Array(n).fill(0);
  for (let f = 0; f < n; f++) {
    const a = Math.floor(f * per), b = Math.min(samples.length, Math.floor((f + 1) * per)); let s = 0;
    for (let i = a; i < b; i++) s += samples[i] * samples[i];
    raw[f] = b > a ? Math.sqrt(s / (b - a)) : 0;
  }
  const sorted = raw.slice().sort((x, y) => x - y), p95 = sorted[Math.floor(0.95 * (sorted.length - 1))] || 1e-9;
  const env = []; let prev = 0;
  for (let f = 0; f < n; f++) { const x = Math.min(1, raw[f] / p95); prev = prev + (x - prev) * (x > prev ? 0.6 : 0.18); env.push(+prev.toFixed(4)); }
  return env;
}
function analyze(file, fps) {
  const buf = cp.execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-f', 's16le', '-ac', '1', '-ar', '22050', '-'], { maxBuffer: 1 << 30 });
  const samples = new Float32Array(buf.length >> 1);
  for (let i = 0; i < samples.length; i++) samples[i] = buf.readInt16LE(i * 2) / 32768;
  return envelopeFromSamples(samples, fps);
}
/* returns { input: [...], map: [...], out: [...] } ffmpeg pieces (no -shortest, no -stream_loop) */
function muxArgs(file, o) {
  if (!file) return { input: [], map: ['-map', '0:v'], out: ['-an'] };
  const filters = [];
  if (!(o.start > 0)) filters.push('afade=t=in:st=0:d=1.5');
  if (o.fadeOut > 0 && o.audioDuration > 0) filters.push('afade=t=out:st=' + Math.max(0, o.audioDuration - o.start - o.fadeOut).toFixed(3) + ':d=' + o.fadeOut);
  filters.push('volume=' + o.volume, 'apad=whole_dur=' + o.duration.toFixed(3));
  return { input: ['-ss', String(o.start), '-i', file], map: ['-map', '0:v', '-map', '1:a'], out: ['-af', filters.join(','), '-c:a', 'aac', '-b:a', '192k'] };
}
module.exports = { probeDuration, analyze, envelopeFromSamples, muxArgs };
