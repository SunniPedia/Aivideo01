/* Host SVG (original flat illustration): bearded presenter, wrapped white cap, round glasses, white kurta, headphones, mic boom in front. Ids use the prefix host-. Built once. */
(function () {
  var PV = window.PV, H = PV.hostSvg = {};
  H.build = function (parent, cfg) {
    var box = PV.h('div', 'abs', parent, { left: '960px', top: '100px', width: '960px', height: '720px' });
    var svg = PV.s('svg', { width: 960, height: 720, viewBox: '0 0 960 720' }, box), o = {};
    var OUT = '#241a14', SOFT = '#b9b1a1', skin = cfg.skin, GOLD = cfg.accent;
    function g(id, p) { var e = PV.s('g', { id: id }, p || svg); o[id] = e; return e; }
    function add(p, tag, a) { return PV.s(tag, a, p); }
    /* boom stand, behind the body: rises from the lower left */
    var stand = g('host-stand');
    add(stand, 'path', { d: 'M70 720 L170 560 L215 470 L330 392', fill: 'none', stroke: OUT, 'stroke-width': 14, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    add(stand, 'path', { d: 'M70 720 L170 560 L215 470 L330 392', fill: 'none', stroke: cfg.mic, 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    [[170, 560], [215, 470]].forEach(function (p) { add(stand, 'circle', { cx: p[0], cy: p[1], r: 9, fill: GOLD, stroke: OUT, 'stroke-width': 3 }); });
    /* torso: white kurta with a short neck */
    var torso = g('host-torso');
    add(torso, 'path', { d: 'M110 720 C110 480 250 412 460 412 C670 412 810 480 810 720Z', fill: cfg.clothes, stroke: SOFT, 'stroke-width': 4 });
    add(torso, 'path', { d: 'M230 560 Q250 640 240 720 M690 560 Q670 640 680 720 M330 470 Q350 560 340 650', fill: 'none', stroke: SOFT, 'stroke-width': 3, opacity: 0.6, 'stroke-linecap': 'round' });
    add(torso, 'rect', { x: 410, y: 352, width: 100, height: 70, rx: 22, fill: skin, stroke: OUT, 'stroke-width': 4 });
    add(torso, 'path', { d: 'M404 404 L460 484 L516 404 L496 396 L460 448 L424 396Z', fill: skin, stroke: OUT, 'stroke-width': 3, 'stroke-linejoin': 'round' });
    add(torso, 'path', { d: 'M396 394 C420 410 440 418 460 420 C480 418 500 410 524 394 L536 414 C506 432 486 440 460 442 C434 440 414 432 384 414Z', fill: cfg.clothes, stroke: SOFT, 'stroke-width': 3 });
    add(torso, 'path', { d: 'M460 484 L460 640', stroke: SOFT, 'stroke-width': 3 });
    [520, 570, 620].forEach(function (y) { add(torso, 'circle', { cx: 460, cy: y, r: 4, fill: '#8d8474' }); });
    add(torso, 'path', { d: 'M426 410 Q460 540 494 410', fill: 'none', stroke: GOLD, 'stroke-width': 3 });
    add(torso, 'circle', { cx: 460, cy: 526, r: 5, fill: GOLD }); add(torso, 'circle', { cx: 460, cy: 560, r: 4, fill: GOLD });
    /* arms: pivots at the shoulders (y 462) */
    function arm(id, sx, ex, ey, hx, hy) {
      var a = g(id), d = 'M' + sx + ' 462 L' + ex + ' ' + ey + ' L' + hx + ' ' + hy;
      add(a, 'path', { d: d, fill: 'none', stroke: SOFT, 'stroke-width': 62, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      add(a, 'path', { d: d, fill: 'none', stroke: cfg.clothes, 'stroke-width': 54, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      add(a, 'circle', { cx: hx, cy: hy + 14, r: 31, fill: skin, stroke: OUT, 'stroke-width': 4 });
      return a;
    }
    arm('host-arm-left', 250, 190, 630, 285, 672);
    arm('host-arm-right', 670, 735, 630, 640, 672);
    /* head */
    var head = g('host-head');
    add(head, 'ellipse', { cx: 366, cy: 262, rx: 17, ry: 32, fill: skin, stroke: OUT, 'stroke-width': 4 });
    add(head, 'ellipse', { cx: 554, cy: 262, rx: 17, ry: 32, fill: skin, stroke: OUT, 'stroke-width': 4 });
    add(head, 'ellipse', { cx: 460, cy: 252, rx: 96, ry: 114, fill: skin, stroke: OUT, 'stroke-width': 4 });
    if (cfg.age === 'old') add(head, 'path', { d: 'M416 186 Q460 178 504 186 M420 200 Q460 193 500 200', fill: 'none', stroke: OUT, 'stroke-width': 3, opacity: 0.3, 'stroke-linecap': 'round' });
    /* beard: full, from the sideburns to the chin */
    if (cfg.beard !== 'no') add(head, 'path', { d: 'M366 250 C360 350 404 410 460 414 C516 410 560 350 554 250 C548 296 512 322 460 322 C408 322 372 296 366 250Z', fill: cfg.beardColor, stroke: OUT, 'stroke-width': 3, 'stroke-linejoin': 'round' });
    if (!cfg.faceless) {
      var eb = g('host-eyebrows', head);
      add(eb, 'path', { d: 'M404 208 Q427 195 450 206', fill: 'none', stroke: cfg.beardColor, 'stroke-width': 10, 'stroke-linecap': 'round' });
      add(eb, 'path', { d: 'M470 206 Q493 195 516 208', fill: 'none', stroke: cfg.beardColor, 'stroke-width': 10, 'stroke-linecap': 'round' });
      var eyes = g('host-eyes', head);
      add(eyes, 'ellipse', { cx: 428, cy: 232, rx: 14, ry: 10, fill: '#fff', stroke: OUT, 'stroke-width': 2 });
      add(eyes, 'ellipse', { cx: 492, cy: 232, rx: 14, ry: 10, fill: '#fff', stroke: OUT, 'stroke-width': 2 });
      var pu = g('host-pupils', head);
      add(pu, 'circle', { cx: 428, cy: 233, r: 5.5, fill: '#1c1410' });
      add(pu, 'circle', { cx: 492, cy: 233, r: 5.5, fill: '#1c1410' });
      var lids = g('host-eyelids', head);
      add(lids, 'rect', { x: 412, y: 220, width: 32, height: 24, fill: skin, id: 'host-lid-l', transform: 'translate(0 220) scale(1 0) translate(0 -220)' });
      add(lids, 'rect', { x: 476, y: 220, width: 32, height: 24, fill: skin, id: 'host-lid-r', transform: 'translate(0 220) scale(1 0) translate(0 -220)' });
      add(head, 'path', { d: 'M458 238 Q442 276 456 286 Q472 290 480 280', fill: 'none', stroke: OUT, 'stroke-width': 3.5, 'stroke-linecap': 'round', opacity: 0.6 });
      var mouth = g('host-mouth', head);
      add(mouth, 'ellipse', { cx: 460, cy: 316, rx: 24, ry: 14, fill: '#4a1818', stroke: OUT, 'stroke-width': 3 });
      add(mouth, 'ellipse', { cx: 460, cy: 322, rx: 13, ry: 5, fill: '#c46a6a' });
      if (cfg.beard !== 'no') add(head, 'path', { d: 'M410 302 C428 286 452 292 460 300 C468 292 492 286 510 302 C494 314 474 308 460 306 C446 308 426 314 410 302Z', fill: cfg.beardColor, stroke: OUT, 'stroke-width': 2.5, 'stroke-linejoin': 'round' });
    } else {
      var wv = g('host-waves', head);
      [0, 1, 2].forEach(function (k) { add(wv, 'path', { d: 'M' + (352 - 16 * k) + ' ' + (300 - 18 - 6 * k) + ' q-14 18 0 ' + (36 + 12 * k), fill: 'none', stroke: 'var(--hl)', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8 }); });
    }
    if (cfg.glasses !== 'no') {
      var gl = g('host-glasses', head), gc = cfg.glassesColor === 'yes' ? '#8a5a2b' : cfg.glassesColor;
      add(gl, 'circle', { cx: 428, cy: 232, r: 23, fill: 'rgba(255,255,255,0.10)', stroke: gc, 'stroke-width': 5 });
      add(gl, 'circle', { cx: 492, cy: 232, r: 23, fill: 'rgba(255,255,255,0.10)', stroke: gc, 'stroke-width': 5 });
      add(gl, 'path', { d: 'M451 230 Q460 224 469 230 M405 230 L368 224 M515 230 L552 224', fill: 'none', stroke: gc, 'stroke-width': 4, 'stroke-linecap': 'round' });
    }
    /* head covering: wrapped white cap (turban) or a plain cap in the given color */
    if (cfg.cap === 'turban' || cfg.cap === 'yes') {
      var cap = g('host-cap', head);
      add(cap, 'path', { d: 'M364 232 C356 168 392 126 460 124 C528 126 564 168 556 232 C548 200 520 184 460 182 C400 184 372 200 364 232Z', fill: cfg.capColor, stroke: SOFT, 'stroke-width': 3, 'stroke-linejoin': 'round' });
      add(cap, 'path', { d: 'M372 196 Q460 160 548 196 M378 172 Q460 142 542 172 M400 140 L432 184 M470 128 L446 184 M520 142 L488 184', fill: 'none', stroke: SOFT, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.85 });
    } else if (cfg.cap !== 'no') {
      add(head, 'path', { d: 'M366 176 C370 106 550 106 554 176 Z M360 178 h200 l30 10 h-250Z', fill: cfg.cap, stroke: OUT, 'stroke-width': 4 });
    }
    var hp = g('host-headphones', head);
    add(hp, 'path', { d: 'M358 246 C346 108 574 108 562 246', fill: 'none', stroke: cfg.headphones, 'stroke-width': 13, 'stroke-linecap': 'round' });
    add(hp, 'path', { d: 'M366 200 C380 140 540 140 554 200', fill: 'none', stroke: GOLD, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.9 });
    add(hp, 'rect', { x: 338, y: 222, width: 38, height: 68, rx: 16, fill: cfg.headphones, stroke: GOLD, 'stroke-width': 4 });
    add(hp, 'rect', { x: 544, y: 222, width: 38, height: 68, rx: 16, fill: cfg.headphones, stroke: GOLD, 'stroke-width': 4 });
    /* microphone: last segment of the boom and the capsule, drawn LAST so it sits in front of the face */
    var mic = g('host-mic');
    add(mic, 'path', { d: 'M330 392 L398 336', fill: 'none', stroke: OUT, 'stroke-width': 14, 'stroke-linecap': 'round' });
    add(mic, 'path', { d: 'M330 392 L398 336', fill: 'none', stroke: cfg.mic, 'stroke-width': 8, 'stroke-linecap': 'round' });
    add(mic, 'circle', { cx: 330, cy: 392, r: 8, fill: GOLD, stroke: OUT, 'stroke-width': 3 });
    add(mic, 'rect', { x: 384, y: 306, width: 62, height: 30, rx: 14, transform: 'rotate(-30 415 321)', fill: cfg.mic, stroke: OUT, 'stroke-width': 3 });
    add(mic, 'rect', { x: 396, y: 306, width: 9, height: 30, transform: 'rotate(-30 415 321)', fill: GOLD });
    add(mic, 'path', { d: 'M420 304 l18 12 M414 314 l18 12 M408 324 l16 10', stroke: '#555', 'stroke-width': 2, opacity: 0.8 });
    o.svg = svg;
    return o;
  };
})();
