'use strict';
/**
 * tool-audio.js – Audio discovery, duration probe, envelope analysis, mux args
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function probeDuration(audioPath) {
  return new Promise((resolve, reject) => {
    const args = ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', audioPath];
    const p = spawn('ffprobe', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '', err = '';
    p.stdout.on('data', d => out += d);
    p.stderr.on('data', d => err += d);
    p.on('close', code => {
      if (code !== 0) {
        // fallback: try to decode
        return resolve(0);
      }
      const d = parseFloat(out.trim());
      resolve(isFinite(d) ? d : 0);
    });
  });
}

function analyzeEnvelope(audioPath, fps) {
  return new Promise((resolve, reject) => {
    // Decode to mono 22050 Hz s16le and compute RMS per frame
    const args = [
      '-i', audioPath,
      '-ac', '1', '-ar', '22050', '-f', 's16le',
      '-v', 'error', '-'
    ];
    const p = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    const samples = [];
    p.stdout.on('data', chunk => {
      for (let i = 0; i < chunk.length; i += 2) {
        const s = chunk.readInt16LE(i);
        samples.push(s / 32768);
      }
    });
    let err = '';
    p.stderr.on('data', d => err += d);
    p.on('close', code => {
      if (code !== 0 && samples.length === 0) {
        console.warn('[tool-audio] envelope analysis failed, using synthetic');
        return resolve(null);
      }
      const sampleRate = 22050;
      const samplesPerFrame = sampleRate / fps;
      const frameCount = Math.ceil(samples.length / samplesPerFrame);
      const rms = new Float32Array(frameCount);
      for (let f = 0; f < frameCount; f++) {
        const start = Math.floor(f * samplesPerFrame);
        const end = Math.min(samples.length, Math.floor((f + 1) * samplesPerFrame));
        let sum = 0;
        for (let i = start; i < end; i++) sum += samples[i] * samples[i];
        rms[f] = Math.sqrt(sum / Math.max(1, end - start));
      }
      // Normalize by 95th percentile
      const sorted = Array.from(rms).sort((a, b) => a - b);
      const p95 = sorted[Math.floor(sorted.length * 0.95)] || 1;
      const norm = p95 > 1e-6 ? 1 / p95 : 1;
      // Smooth attack 0.6 / release 0.18
      const env = new Float32Array(frameCount);
      let prev = 0;
      for (let i = 0; i < frameCount; i++) {
        const v = Math.min(1, rms[i] * norm);
        if (v > prev) prev = prev * 0.4 + v * 0.6;
        else prev = prev * 0.82 + v * 0.18;
        env[i] = prev;
      }
      resolve(env);
    });
  });
}

function buildMuxArgs(opts) {
  // opts: { audioPath, start, duration, audioDuration, audioVolume, audioFadeOut, outPath }
  const { audioPath, start, duration, audioDuration, audioVolume, audioFadeOut, outPath } = opts;
  const afParts = [];
  if (start === 0) afParts.push('afade=t=in:st=0:d=1.5');
  if (audioFadeOut > 0 && audioDuration > audioFadeOut) {
    afParts.push(`afade=t=out:st=${(audioDuration - audioFadeOut).toFixed(3)}:d=${audioFadeOut}`);
  }
  afParts.push(`volume=${audioVolume}`);
  afParts.push(`apad=whole_dur=${duration}`);
  const af = afParts.join(',');

  return {
    videoArgs: [], // filled by encoder
    audioInput: ['-ss', String(start), '-i', audioPath],
    map: ['-map', '0:v', '-map', '1:a'],
    audioFilter: ['-af', af],
    audioCodec: ['-c:a', 'aac', '-b:a', '192k'],
    duration: ['-t', String(duration)]
  };
}

module.exports = { probeDuration, analyzeEnvelope, buildMuxArgs };
