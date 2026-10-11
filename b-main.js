'use strict';
/**
 * b-main.js – Theme B (podcast) main orchestrator
 * Implements window.init, window.fit, window.seek, window.setAudio
 */
(function (global) {
  const PV = global.PV = global.PV || {};

  let state = {
    scenes: [],
    total: 0,
    project: {},
    opts: {},
    elements: {},
    brandName: '',
    direction: 'ltr',
    language: 'bn'
  };

  function buildDOM(opts) {
    const stage = document.getElementById('stage');
    stage.innerHTML = '';
    stage.style.cssText = 'position:relative;width:1920px;height:1080px;overflow:hidden;background:radial-gradient(120% 80% at 50% 30%, #14301c, #0d1f12, #050a07);';

    // Background layer
    const bg = document.createElement('div');
    bg.id = 'bg';
    bg.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
    stage.appendChild(bg);

    // Star pattern SVG
    const stars = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    stars.setAttribute('id', 'stars');
    stars.setAttribute('width', '1700');
    stars.setAttribute('height', '1700');
    stars.style.cssText = 'position:absolute;left:1450px;top:380px;transform:translate(-50%,-50%);opacity:0.13;';
    stars.innerHTML = `
      <defs>
        <pattern id="starPat" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect x="30" y="30" width="20" height="20" transform="rotate(45 40 40)" fill="none" stroke="#e8c547" stroke-width="1.2" opacity="0.35"/>
          <circle cx="40" cy="40" r="3" fill="none" stroke="#e8c547" stroke-width="0.8" opacity="0.25"/>
        </pattern>
      </defs>
      <rect width="1700" height="1700" fill="url(#starPat)"/>
    `;
    bg.appendChild(stars);

    // Particles container
    const particles = document.createElement('div');
    particles.id = 'particles';
    particles.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;';
    for (let i = 0; i < 38; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.dataset.i = i;
      p.style.cssText = `position:absolute;width:4px;height:4px;border-radius:50%;background:#e8c547;opacity:0.25;`;
      particles.appendChild(p);
    }
    bg.appendChild(particles);

    // Studio elements
    // Acoustic panels
    for (let i = 0; i < 8; i++) {
      const panel = document.createElement('div');
      panel.style.cssText = `position:absolute;left:${1000 + i * 110}px;top:${150 + (i % 3) * 40}px;width:90px;height:520px;border-radius:12px;background:#0a160e;border:1px solid #1a2f20;box-shadow:inset 0 0 20px rgba(0,0,0,0.4);`;
      stage.appendChild(panel);
    }

    // Shelf + books
    const shelf = document.createElement('div');
    shelf.style.cssText = 'position:absolute;left:380px;top:230px;width:520px;height:8px;background:#3a2a1a;border-radius:2px;';
    stage.appendChild(shelf);
    for (let i = 0; i < 18; i++) {
      const book = document.createElement('div');
      const h = 40 + (i * 7) % 35;
      const colors = ['#2a4a3a', '#3a2a1a', '#1a3a4a', '#4a3a2a', '#2a3a4a'];
      book.style.cssText = `position:absolute;left:${390 + i * 28}px;top:${230 - h}px;width:22px;height:${h}px;background:${colors[i % 5]};border-radius:2px 2px 0 0;`;
      stage.appendChild(book);
    }

    // ON AIR sign
    const onAir = document.createElement('div');
    onAir.id = 'onair';
    onAir.style.cssText = 'position:absolute;right:40px;top:40px;width:270px;height:74px;background:#1a0a0a;border:3px solid #c9a227;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:700;color:#e8c547;letter-spacing:4px;';
    onAir.innerHTML = '<span style="width:14px;height:14px;border-radius:50%;background:#e74c3c;margin-right:12px;display:inline-block;" id="onair-dot"></span>ON AIR';
    stage.appendChild(onAir);

    // Studio screen (visual area)
    const screen = document.createElement('div');
    screen.id = 'screen';
    screen.style.cssText = 'position:absolute;left:80px;top:290px;width:940px;height:490px;border-radius:30px;border:6px solid #c9a227;background:rgba(10,22,14,0.92);overflow:hidden;box-shadow:0 0 40px rgba(201,162,39,0.3);';
    stage.appendChild(screen);

    const screenContent = document.createElement('div');
    screenContent.id = 'screen-content';
    screenContent.style.cssText = 'position:absolute;inset:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;';
    screen.appendChild(screenContent);

    // Logo card (initially hidden)
    const logoCard = document.createElement('div');
    logoCard.id = 'logo-card';
    logoCard.style.cssText = 'position:absolute;left:550px;top:535px;width:520px;height:auto;transform:translate(-50%,-50%) scale(0.2);opacity:0;border-radius:56px;overflow:hidden;box-shadow:0 0 30px rgba(201,162,39,0.4);z-index:20;';
    if (opts.logo) {
      const img = document.createElement('img');
      img.src = opts.logo;
      img.style.cssText = 'width:100%;display:block;background:#fff;';
      logoCard.appendChild(img);
    }
    stage.appendChild(logoCard);

    // Host SVG container
    const hostWrap = document.createElement('div');
    hostWrap.id = 'host-wrap';
    hostWrap.style.cssText = 'position:absolute;left:960px;top:100px;width:960px;height:720px;z-index:15;';
    hostWrap.innerHTML = getHostSVG(opts.project && opts.project.host);
    stage.appendChild(hostWrap);

    // Desk
    const desk = document.createElement('div');
    desk.style.cssText = 'position:absolute;left:0;top:800px;width:1920px;height:280px;background:linear-gradient(180deg,#5a3a1a 0%,#3a2a12 30%,#2a1a0a 100%);border-top:4px solid #c9a227;z-index:16;';
    stage.appendChild(desk);

    // Caption lower third
    const captionPanel = document.createElement('div');
    captionPanel.id = 'caption-panel';
    captionPanel.style.cssText = 'position:absolute;left:60px;top:836px;width:1800px;height:196px;border-radius:48px;background:rgba(10,22,14,0.88);border:3px solid transparent;background-clip:padding-box;z-index:30;overflow:hidden;';
    // conic border via pseudo is hard; use box-shadow
    captionPanel.style.boxShadow = '0 0 24px rgba(201,162,39,0.22), inset 0 0 40px rgba(201,162,39,0.08)';
    stage.appendChild(captionPanel);

    // Equalizer
    const eq = document.createElement('div');
    eq.id = 'eq';
    eq.style.cssText = 'position:absolute;left:130px;bottom:12px;width:1540px;height:26px;display:flex;align-items:flex-end;gap:3px;';
    for (let i = 0; i < 40; i++) {
      const bar = document.createElement('div');
      bar.className = 'eq-bar';
      bar.dataset.i = i;
      bar.style.cssText = 'flex:1;height:4px;background:#e8c547;border-radius:2px;opacity:0.7;';
      eq.appendChild(bar);
    }
    captionPanel.appendChild(eq);

    // Caption box
    const captionBox = document.createElement('div');
    captionBox.id = 'caption-box';
    captionBox.style.cssText = 'position:absolute;left:76px;top:16px;right:76px;bottom:44px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;font-size:56px;line-height:1.25;text-align:center;';
    captionPanel.appendChild(captionBox);

    // Progress bar
    const progress = document.createElement('div');
    progress.id = 'progress';
    progress.style.cssText = 'position:absolute;left:60px;bottom:22px;width:1800px;height:8px;background:rgba(255,255,255,0.1);border-radius:4px;z-index:40;';
    const progressFill = document.createElement('div');
    progressFill.id = 'progress-fill';
    progressFill.style.cssText = 'height:100%;width:0%;background:linear-gradient(90deg,#c9a227,#e8c547);border-radius:4px;';
    progress.appendChild(progressFill);
    stage.appendChild(progress);

    // Vignette
    const vig = document.createElement('div');
    vig.style.cssText = 'position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%);z-index:50;';
    stage.appendChild(vig);

    state.elements = {
      stage, bg, stars, particles, screen, screenContent, logoCard,
      hostWrap, captionPanel, captionBox, eq, progressFill, onAir,
      onAirDot: document.getElementById('onair-dot')
    };
  }

  function getHostSVG(host) {
    host = host || {};
    const skin = host.skin === 'light' ? '#f0d5b8' : host.skin === 'dark' ? '#8d5524' : '#c68642';
    const hair = '#2c1a0e';
    const shirt = '#1a5f2a';
    const faceless = !!host.faceless;
    return `
<svg viewBox="0 0 960 720" width="960" height="720" xmlns="http://www.w3.org/2000/svg">
  <!-- torso -->
  <g id="torso">
    <rect x="380" y="420" width="200" height="280" rx="20" fill="${shirt}"/>
    <rect x="400" y="440" width="160" height="40" rx="4" fill="#0d3a1a"/>
  </g>
  <!-- head -->
  <g id="head">
    <ellipse cx="480" cy="280" rx="90" ry="100" fill="${skin}"/>
    <!-- hair -->
    <path d="M390 240 Q480 160 570 240 Q560 200 480 190 Q400 200 390 240" fill="${hair}"/>
    <!-- ears -->
    <ellipse cx="390" cy="290" rx="18" ry="28" fill="${skin}"/>
    <ellipse cx="570" cy="290" rx="18" ry="28" fill="${skin}"/>
    ${faceless ? '' : `
    <!-- eyes -->
    <g id="eyes">
      <ellipse cx="445" cy="270" rx="14" ry="10" fill="#fff"/>
      <ellipse cx="515" cy="270" rx="14" ry="10" fill="#fff"/>
      <circle id="pupil-l" cx="445" cy="272" r="6" fill="#1a1a1a"/>
      <circle id="pupil-r" cx="515" cy="272" r="6" fill="#1a1a1a"/>
    </g>
    <!-- eyelids -->
    <g id="eyelids">
      <ellipse cx="445" cy="262" rx="14" ry="4" fill="${skin}" opacity="0"/>
      <ellipse cx="515" cy="262" rx="14" ry="4" fill="${skin}" opacity="0"/>
    </g>
    <!-- eyebrows -->
    <g id="eyebrows">
      <path d="M430 248 Q445 242 460 248" stroke="#2c1a0e" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M500 248 Q515 242 530 248" stroke="#2c1a0e" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>
    <!-- mouth -->
    <g id="mouth" transform-origin="480 340">
      <ellipse cx="480" cy="340" rx="22" ry="8" fill="#5a2a2a"/>
    </g>
    `}
    ${host.beard && host.beard !== 'no' ? `<path d="M420 320 Q480 400 540 320 Q530 360 480 370 Q430 360 420 320" fill="#2c1a0e" opacity="0.85"/>` : ''}
  </g>
  <!-- headphones -->
  <g id="headphones">
    <path d="M390 250 Q480 180 570 250" stroke="#222" stroke-width="14" fill="none" stroke-linecap="round"/>
    <rect x="360" y="250" width="40" height="55" rx="10" fill="#333"/>
    <rect x="560" y="250" width="40" height="55" rx="10" fill="#333"/>
  </g>
  <!-- boom mic -->
  <g id="mic">
    <line x1="320" y1="200" x2="400" y2="310" stroke="#444" stroke-width="6"/>
    <ellipse cx="310" cy="190" rx="28" ry="18" fill="#333" transform="rotate(-20 310 190)"/>
    <ellipse cx="310" cy="190" rx="20" ry="12" fill="#666" transform="rotate(-20 310 190)"/>
  </g>
  <!-- arms -->
  <g id="arm-right" transform-origin="560 460">
    <path d="M560 460 Q620 520 600 620" stroke="${skin}" stroke-width="28" fill="none" stroke-linecap="round"/>
    <circle cx="600" cy="630" r="18" fill="${skin}"/>
  </g>
  <g id="arm-left">
    <path d="M400 460 Q340 520 360 620" stroke="${skin}" stroke-width="28" fill="none" stroke-linecap="round"/>
    <circle cx="360" cy="630" r="18" fill="${skin}"/>
  </g>
</svg>`;
  }

  function renderCaption(scene, t) {
    const box = state.elements.captionBox;
    if (!scene) {
      box.innerHTML = '';
      return;
    }
    const text = scene.text;
    // simple word split for Bengali (space-based; real would use Segmenter)
    const words = text.split(/\s+/).filter(Boolean);
    const dur = scene.originalEnd - scene.originalStart;
    const totalWeight = words.reduce((s, w) => s + w.length + 1, 0);
    let cum = 0;
    const lt = t - scene.originalStart;
    let html = '';
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const weight = w.length + 1;
      const startI = 0.15 + (cum / totalWeight) * Math.max(0.6, dur - 0.55);
      const endI = startI + (weight / totalWeight) * Math.max(0.6, dur - 0.55);
      cum += weight;
      let a = 0;
      if (lt >= startI) {
        a = PV.ease.easeOut(PV.ease.prog(lt, startI, 0.12)) * (1 - PV.ease.easeOut(PV.ease.prog(lt, endI - 0.05, 0.14)));
      }
      const isBrand = state.brandName && w.includes(state.brandName.split(' ')[0]);
      const color = isBrand || a > 0.3 ? 'var(--pv-highlight)' : 'var(--pv-cream)';
      const scale = 1 + 0.07 * a;
      const ty = -6 * a;
      const glow = a > 0 ? `text-shadow:0 0 ${34 * a}px var(--pv-highlight);` : '';
      html += `<span style="display:inline-block;margin:0 6px;color:${color};transform:scale(${scale}) translateY(${ty}px);${glow}opacity:${Math.min(1, 0.4 + a * 0.6)};transition:none;">${w}</span>`;
    }
    box.innerHTML = html;
    box.dir = state.direction;
  }

  function renderVisual(scene, t) {
    const sc = state.elements.screenContent;
    if (!scene) {
      sc.innerHTML = '';
      return;
    }
    // Simple visuals based on type from scenes.json or classifier
    let type = 'caption';
    if (state.opts.scenes) {
      const entry = state.opts.scenes.find(e => e.line === scene.index + 1 || (e.match && scene.text.startsWith(e.match.slice(0, 15))));
      if (entry) type = entry.type;
    }
    // Fallback classify
    if (type === 'caption') {
      if (scene.index === 0) type = 'greeting';
      else if (/স্টোর|প্লে|ইনস্টল|ডাউনলোড/.test(scene.text)) type = 'store';
      else if (scene.index === state.scenes.length - 1) type = 'closing';
      else if (/❝|বিশ্বকোষ|অ্যাপ/.test(scene.text) && scene.index < 3) type = 'brand';
      else if (/\d|হাজার|লক্ষ|শত|টি /.test(scene.text)) type = 'numbers';
      else type = 'cards';
    }

    const lt = t - scene.start;
    const dur = scene.end - scene.start;
    const enter = Math.min(0.45, 0.4 * dur);
    const opacity = lt < enter ? PV.ease.easeOut(lt / enter) : 1;

    if (type === 'greeting') {
      sc.innerHTML = `<div style="font-size:72px;color:var(--pv-highlight);opacity:${opacity};text-align:center;">${scene.text}</div>`;
    } else if (type === 'brand') {
      sc.innerHTML = `<div style="font-size:48px;color:var(--pv-cream);opacity:${opacity};text-align:center;padding:20px;">${scene.text}</div>`;
    } else if (type === 'store') {
      if (state.opts.badge) {
        const scale = lt < 0.5 ? PV.ease.easeBack(lt / 0.5) : 1;
        sc.innerHTML = `<img src="${state.opts.badge}" style="width:420px;transform:scale(${scale});opacity:${opacity};filter:drop-shadow(0 8px 20px rgba(0,0,0,0.4));" />
          <div style="margin-top:24px;font-size:36px;color:var(--pv-highlight);">${state.brandName || ''}</div>`;
      } else {
        sc.innerHTML = `<div style="padding:24px 48px;background:var(--pv-accent);border-radius:16px;font-size:40px;color:#0a160e;opacity:${opacity};">ইনস্টল করুন</div>`;
      }
    } else if (type === 'closing') {
      sc.innerHTML = `<div style="display:flex;gap:60px;opacity:${opacity};">
        <div style="width:100px;height:100px;border:3px solid var(--pv-highlight);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;">B</div>
        <div style="width:100px;height:100px;border:3px solid var(--pv-highlight);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;">S</div>
        <div style="width:100px;height:100px;border:3px solid var(--pv-highlight);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;">*</div>
      </div>
      <div style="margin-top:30px;font-size:36px;color:var(--pv-cream);">${scene.text}</div>`;
      // Note: emoji used temporarily for visibility; will be replaced by SVG in full version
    } else if (type === 'numbers') {
      // Extract rough numbers for display
      sc.innerHTML = `<div style="font-size:42px;color:var(--pv-cream);opacity:${opacity};text-align:center;line-height:1.5;padding:20px;">${scene.text}</div>`;
    } else {
      sc.innerHTML = `<div style="font-size:40px;color:var(--pv-cream);opacity:${opacity};text-align:center;padding:30px;line-height:1.4;">${scene.text}</div>`;
    }
  }

  function animateHost(t, sp, lv) {
    const head = document.getElementById('head');
    const mouth = document.getElementById('mouth');
    const armR = document.getElementById('arm-right');
    const eyelids = document.getElementById('eyelids');
    if (!head) return;

    // head sway
    const hy = Math.sin(1.7 * t) * 1.5 - 3.5 * (mouth ? 0.3 : 0);
    const hr = Math.sin(0.8 * t) * 1.4 + sp * Math.sin(2.3 * t) * 0.9;
    head.setAttribute('transform', `translate(0,${hy}) rotate(${hr} 480 280)`);

    // mouth
    if (mouth) {
      const m = sp * (0.30 + 0.70 * Math.abs(Math.sin(t * 13))) * (0.75 + 0.25 * lv);
      mouth.setAttribute('transform', `scale(1, ${0.10 + 0.90 * m})`);
    }

    // blink
    if (eyelids) {
      const blink1 = Math.max(0, Math.sin((t % 3.4) / 3.4 * Math.PI * 2) * 8 - 7);
      const blink2 = Math.max(0, Math.sin(((t + 1.1) % 5.3) / 5.3 * Math.PI * 2) * 8 - 7);
      const b = Math.max(blink1, blink2);
      eyelids.style.opacity = b > 0.5 ? '1' : '0';
    }

    // arm
    if (armR) {
      const wave = 0.5 + 0.5 * Math.sin(1.1 * t);
      const rot = -(5 + 36 * sp * (0.35 + 0.65 * wave * (0.5 + 0.5 * lv)));
      armR.setAttribute('transform', `rotate(${rot} 560 460)`);
    }
  }

  function seek(t) {
    const { scenes, total, elements } = state;
    const scene = PV.timeline.activeScene(t, scenes, total);
    const sp = PV.timeline.speechPresence(t, scenes);
    const lv = PV.audio.level(t);

    // progress
    if (elements.progressFill) {
      elements.progressFill.style.width = (Math.min(1, t / total) * 100) + '%';
    }

    // stars rotation
    if (elements.stars) {
      const ang = (t * 2.2) % 360;
      elements.stars.style.transform = `translate(-50%,-50%) rotate(${ang}deg)`;
      elements.stars.style.opacity = 0.10 + 0.07 * lv;
    }

    // particles
    if (elements.particles) {
      const ps = elements.particles.children;
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        const x = (i * 211 + Math.sin(0.4 * t + i) * 40) % 1920;
        const y = 1080 - ((t * (20 + (i % 7) * 9) + i * 131) % 1140);
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        p.style.opacity = 0.25 + 0.2 * lv;
      }
    }

    // ON AIR
    if (elements.onAirDot) {
      elements.onAirDot.style.opacity = 0.4 + 0.6 * sp;
      elements.onAir.style.boxShadow = sp > 0.3 ? `0 0 ${20 + 40 * lv}px rgba(231,76,60,0.5)` : 'none';
    }

    // caption & visual
    renderCaption(scene, t);
    renderVisual(scene, t);

    // host
    animateHost(t, sp, lv);

    // logo motion (simplified)
    if (elements.logoCard) {
      // show during brand / last
      const isBrand = scene && scene.index <= 1;
      const isLast = scene && scene.index === scenes.length - 1;
      if (isBrand || isLast) {
        elements.logoCard.style.opacity = '1';
        elements.logoCard.style.transform = isLast
          ? 'translate(-50%,-50%) scale(0.78)'
          : 'translate(-50%,-50%) scale(1)';
        elements.logoCard.style.left = isLast ? '550px' : '550px';
        elements.logoCard.style.top = isLast ? '460px' : '535px';
      } else {
        elements.logoCard.style.opacity = '0';
      }
    }

    // caption glow
    if (elements.captionPanel) {
      const blur = 24 + 80 * lv;
      const spread = 4 + 14 * lv;
      elements.captionPanel.style.boxShadow = `0 0 ${blur}px rgba(201,162,39,${0.22 + 0.45 * lv}), 0 0 ${spread}px rgba(201,162,39,0.3)`;
    }

    // eq bars
    if (elements.eq) {
      const bars = elements.eq.children;
      for (let i = 0; i < bars.length; i++) {
        const wave = 0.5 + 0.5 * Math.abs(Math.sin(6 * t + 0.7 * i));
        const shape = 0.65 + 0.35 * Math.sin(0.45 * i + 1);
        const h = 4 + 22 * Math.min(1, lv * 1.15 * wave * shape + 0.04);
        bars[i].style.height = h + 'px';
      }
    }
  }

  function fit() {
    // simple size reduction
    const box = state.elements.captionBox;
    if (!box) return {};
    let size = 56;
    box.style.fontSize = size + 'px';
    // in real would measure; here just return
    return { captionSize: size };
  }

  function init(rawTimestampsText, opts) {
    state.opts = opts || {};
    state.project = (opts && opts.project) || {};
    const detected = PV.detect.detectAll(rawTimestampsText, state.project);
    state.language = detected.language;
    state.direction = detected.direction;
    state.brandName = detected.brandName || state.project.brandName || '';

    state.scenes = PV.parse.parseTimestamps(rawTimestampsText);
    const audioDur = (opts && opts.audioDuration) || 0;
    const tail = (opts && opts.tailPad != null) ? opts.tailPad : 2.0;
    state.total = PV.timeline.computeTotal(state.scenes, audioDur, tail);
    PV.timeline.total = state.total;
    PV.audio.setAudioDuration(audioDur);

    // apply colors if present
    if (state.project.colors) {
      const c = state.project.colors;
      const root = document.documentElement;
      if (c.primary) root.style.setProperty('--pv-primary', c.primary);
      if (c.accent) root.style.setProperty('--pv-accent', c.accent);
      if (c.highlight) root.style.setProperty('--pv-highlight', c.highlight);
      if (c.background) root.style.setProperty('--pv-bg', c.background);
    }

    buildDOM(opts);
    return state.total;
  }

  // Public contract
  global.init = init;
  global.fit = fit;
  global.seek = seek;
  // setAudio already attached by common-audio-level.js

})(typeof window !== 'undefined' ? window : global);
