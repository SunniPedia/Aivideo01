'use strict';
(function (global) {
  const PV = global.PV = global.PV || {};
  let state = { scenes: [], total: 0, project: {}, opts: {}, elements: {}, brandName: '', direction: 'ltr' };

  function buildDOM(opts) {
    const stage = document.getElementById('stage');
    stage.innerHTML = '';
    stage.style.cssText = 'position:relative;width:1080px;height:1920px;overflow:hidden;background:radial-gradient(120% 80% at 50% 30%, #14301c, #0d1f12, #050a07);';

    const logoCard = document.createElement('div');
    logoCard.id = 'logo-card';
    logoCard.style.cssText = 'position:absolute;left:50%;top:190px;width:520px;transform:translateX(-50%) scale(0.2);opacity:0;border-radius:56px;overflow:hidden;box-shadow:0 0 30px rgba(201,162,39,0.5);z-index:20;';
    if (opts.logo) {
      const img = document.createElement('img');
      img.src = opts.logo;
      img.style.cssText = 'width:100%;display:block;background:#fff;';
      logoCard.appendChild(img);
    }
    stage.appendChild(logoCard);

    const visual = document.createElement('div');
    visual.id = 'visual';
    visual.style.cssText = 'position:absolute;left:60px;top:470px;width:960px;height:740px;display:flex;align-items:center;justify-content:center;';
    stage.appendChild(visual);

    const captionPanel = document.createElement('div');
    captionPanel.id = 'caption-panel';
    captionPanel.style.cssText = 'position:absolute;left:50px;top:1230px;width:980px;height:540px;border-radius:64px;background:rgba(10,22,14,0.9);box-shadow:0 0 30px rgba(201,162,39,0.25);z-index:30;';
    stage.appendChild(captionPanel);

    const captionBox = document.createElement('div');
    captionBox.id = 'caption-box';
    captionBox.style.cssText = 'position:absolute;left:56px;top:74px;right:56px;bottom:96px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;font-size:56px;line-height:1.42;text-align:center;';
    captionPanel.appendChild(captionBox);

    const progress = document.createElement('div');
    progress.style.cssText = 'position:absolute;left:70px;bottom:90px;width:940px;height:12px;background:rgba(255,255,255,0.1);border-radius:6px;z-index:40;';
    const progressFill = document.createElement('div');
    progressFill.id = 'progress-fill';
    progressFill.style.cssText = 'height:100%;width:0%;background:linear-gradient(90deg,#c9a227,#e8c547);border-radius:6px;';
    progress.appendChild(progressFill);
    stage.appendChild(progress);

    state.elements = { stage, logoCard, visual, captionPanel, captionBox, progressFill };
  }

  function seek(t) {
    const scene = PV.timeline.activeScene(t, state.scenes, state.total);
    const lv = PV.audio.level(t);
    if (state.elements.progressFill) {
      state.elements.progressFill.style.width = (Math.min(1, t / state.total) * 100) + '%';
    }
    // caption
    const box = state.elements.captionBox;
    if (scene) {
      box.textContent = scene.text;
      box.dir = state.direction;
    } else box.textContent = '';
    // logo
    if (state.elements.logoCard) {
      const show = t > 0.5;
      state.elements.logoCard.style.opacity = show ? '1' : '0';
      state.elements.logoCard.style.transform = show ? 'translateX(-50%) scale(1)' : 'translateX(-50%) scale(0.2)';
    }
    // visual
    if (state.elements.visual && scene) {
      state.elements.visual.innerHTML = '<div style="font-size:48px;color:var(--pv-cream);text-align:center;padding:40px;">' + scene.text + '</div>';
    }
  }

  function fit() { return { captionSize: 56 }; }

  function init(raw, opts) {
    state.opts = opts || {};
    state.project = (opts && opts.project) || {};
    const detected = PV.detect.detectAll(raw, state.project);
    state.direction = detected.direction;
    state.brandName = detected.brandName || state.project.brandName || '';
    state.scenes = PV.parse.parseTimestamps(raw);
    const audioDur = (opts && opts.audioDuration) || 0;
    const tail = (opts && opts.tailPad != null) ? opts.tailPad : 2.0;
    state.total = PV.timeline.computeTotal(state.scenes, audioDur, tail);
    PV.timeline.total = state.total;
    buildDOM(opts);
    return state.total;
  }

  global.init = init;
  global.fit = fit;
  global.seek = seek;
})(typeof window !== 'undefined' ? window : global);
