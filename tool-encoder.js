'use strict';
/**
 * tool-encoder.js – FFmpeg spawn, backpressure, progress
 */
const { spawn } = require('child_process');
const fs = require('fs');

function createEncoder({ width, height, fps, duration, outPath, audioArgs }) {
  const args = [
    '-y',
    '-f', 'image2pipe',
    '-framerate', String(fps),
    '-i', 'pipe:0',
    ...(audioArgs.audioInput || []),
    ...(audioArgs.map || ['-map', '0:v']),
    ...(audioArgs.audioFilter || []),
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    '-r', String(fps),
    ...(audioArgs.audioCodec || []),
    ...(audioArgs.duration || ['-t', String(duration)]),
    outPath
  ];

  console.log('[encoder] ffmpeg', args.join(' '));
  const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'pipe', 'pipe'] });

  let stderr = '';
  ff.stderr.on('data', d => {
    stderr += d.toString();
    // optional progress parse
  });

  const writeFrame = (buf) => new Promise((resolve, reject) => {
    const ok = ff.stdin.write(buf);
    if (ok) return resolve();
    ff.stdin.once('drain', resolve);
    ff.stdin.once('error', reject);
  });

  const finish = () => new Promise((resolve, reject) => {
    ff.stdin.end();
    ff.on('close', code => {
      if (code !== 0) {
        console.error('[encoder] ffmpeg exit', code);
        console.error(stderr.slice(-2000));
        return reject(new Error('ffmpeg failed with code ' + code));
      }
      resolve();
    });
  });

  return { writeFrame, finish, process: ff };
}

module.exports = { createEncoder };
