'use strict';
/**
 * common-parse.js – timestamps parsing, markers, overlap trimming
 */
(function (global) {
  const PV = global.PV = global.PV || {};

  const MOODS = new Set(['respectful', 'happy', 'informative', 'excited', 'calm', 'enthusiastic']);

  function parseTime(s) {
    s = String(s).trim().replace(',', '.');
    if (s.includes(':')) {
      const parts = s.split(':');
      if (parts.length === 2) return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
      if (parts.length === 3) return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
    }
    return parseFloat(s);
  }

  function parseTimestamps(raw) {
    if (!raw) return [];
    // strip BOM
    raw = raw.replace(/^\uFEFF/, '');
    const lines = raw.split(/\r?\n/);
    const scenes = [];
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line || line.startsWith('#')) continue;
      const parts = line.split('|').map(p => p.trim());
      if (parts.length < 3) {
        console.warn('[parse] skip bad line', i + 1);
        continue;
      }
      let start = parseTime(parts[0]);
      let end = parseTime(parts[1]);
      let text, mood;
      if (parts.length === 3) {
        text = parts[2];
        mood = 'happy';
      } else {
        // last field mood if known, else text includes it
        const last = parts[parts.length - 1].toLowerCase();
        if (MOODS.has(last)) {
          mood = last;
          text = parts.slice(2, -1).join('|');
        } else {
          mood = 'happy';
          text = parts.slice(2).join('|');
        }
      }
      if (!text) {
        console.warn('[parse] empty text line', i + 1);
        continue;
      }
      if (!(end > start)) {
        console.warn('[parse] end<=start, fixing line', i + 1);
        end = start + 0.5;
      }
      // markers
      const brandMatches = [];
      text = text.replace(/❝([^❞]+)❞/g, (_, name) => {
        brandMatches.push(name);
        return name; // remove markers from displayed text
      });
      scenes.push({
        index: scenes.length,
        start,
        end,
        text,
        mood,
        brandNames: brandMatches,
        originalStart: start,
        originalEnd: end
      });
    }
    // sort
    scenes.sort((a, b) => a.start - b.start);
    // trim overlaps
    for (let i = 1; i < scenes.length; i++) {
      if (scenes[i].start < scenes[i - 1].end) {
        console.warn('[parse] overlap trimmed at scene', i);
        scenes[i - 1].end = scenes[i].start;
      }
    }
    return scenes;
  }

  PV.parse = { parseTimestamps, parseTime };
})(typeof window !== 'undefined' ? window : global);
