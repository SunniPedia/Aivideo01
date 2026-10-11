'use strict';
/**
 * common-detect.js – runtime detection of script, language, direction, digits, grouping, brand
 */
(function (global) {
  const PV = global.PV = global.PV || {};

  function detectScript(text) {
    if (!text) return 'Latn';
    const counts = { Beng: 0, Arab: 0, Deva: 0, Latn: 0, other: 0 };
    for (const ch of text) {
      const c = ch.codePointAt(0);
      if (c >= 0x0980 && c <= 0x09FF) counts.Beng++;
      else if (c >= 0x0600 && c <= 0x06FF) counts.Arab++;
      else if (c >= 0x0900 && c <= 0x097F) counts.Deva++;
      else if ((c >= 0x0041 && c <= 0x007A) || (c >= 0x00C0 && c <= 0x024F)) counts.Latn++;
      else if (c > 127) counts.other++;
    }
    let best = 'Latn', max = 0;
    for (const k of Object.keys(counts)) {
      if (counts[k] > max) { max = counts[k]; best = k; }
    }
    return best;
  }

  function scriptToLang(script) {
    const map = { Beng: 'bn', Arab: 'ar', Deva: 'hi', Latn: 'en' };
    return map[script] || 'en';
  }

  function detectDirection(script) {
    return (script === 'Arab' || script === 'Hebr') ? 'rtl' : 'ltr';
  }

  function detectDigits(script, text) {
    // if text has native digits use them, else native for known scripts
    if (/[\u09E6-\u09EF]/.test(text)) return 'bn';
    if (/[\u0660-\u0669]/.test(text)) return 'ar';
    if (/[\u0966-\u096F]/.test(text)) return 'hi';
    if (script === 'Beng') return 'bn';
    if (script === 'Arab') return 'ar';
    if (script === 'Deva') return 'hi';
    return 'latn';
  }

  function detectGrouping(lang) {
    const lakh = new Set(['bn', 'hi', 'ur', 'ne', 'mr', 'gu', 'pa']);
    return lakh.has(lang) ? 'lakh' : 'intl';
  }

  function detectBrandFromMarkers(text) {
    const m = text.match(/❝([^❞]+)❞/);
    return m ? m[1] : null;
  }

  function detectAll(text, project) {
    const script = detectScript(text);
    const lang = (project && project.language && project.language !== 'auto') ? project.language : scriptToLang(script);
    const direction = (project && project.direction && project.direction !== 'auto') ? project.direction : detectDirection(script);
    const digits = (project && project.digits && project.digits !== 'auto') ? project.digits : detectDigits(script, text);
    const grouping = (project && project.grouping && project.grouping !== 'auto') ? project.grouping : detectGrouping(lang);
    let brand = (project && project.brandName && project.brandName !== 'auto') ? project.brandName : detectBrandFromMarkers(text);
    return { script, language: lang, direction, digits, grouping, brandName: brand };
  }

  PV.detect = { detectScript, scriptToLang, detectDirection, detectDigits, detectGrouping, detectBrandFromMarkers, detectAll };
})(typeof window !== 'undefined' ? window : global);
