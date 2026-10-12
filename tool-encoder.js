/* FFmpeg process, backpressure and progress */
const cp = require('child_process');
function startEncoder(a) {
  const args = ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(a.fps), '-vcodec', 'mjpeg', '-i', '-', ...a.audio.input,
    ...a.audio.map, '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-r', String(a.fps), ...a.audio.out, '-t', a.duration.toFixed(3), a.out];
  const p = cp.spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => { p.on('error', rej); p.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg exited with code ' + c))); });
  p.stdin.on('error', () => { /* reported through close */ });
  return {
    args,
    write(buf) { return p.stdin.write(buf) ? Promise.resolve() : new Promise(r => p.stdin.once('drain', r)); },
    async finish() { p.stdin.end(); await done; }
  };
}
module.exports = { startEncoder };
