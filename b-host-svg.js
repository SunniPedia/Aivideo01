/* Host SVG (original flat illustration): older man, grey beard, short neck, mic boom in front of the mouth. Ids use the prefix host-. Built once. */
(function () {
  var PV = window.PV, H = PV.hostSvg = {};
  H.build = function (parent, cfg) {
    var box = PV.h('div', 'abs', parent, { left: '960px', top: '100px', width: '960px', height: '720px' });
    var svg = PV.s('svg', { width: 960, height: 720, viewBox: '0 0 960 720' }, box), o = {};
    var OUT = '#1a1410', skin = cfg.skin, old = cfg.age !== 'young';
    function g(id, p) { var e = PV.s('g', { id: id }, p || svg); o[id] = e; return e; }
    function add(p, tag, a) { return PV.s(tag, a, p); }
    /* torso with a short neck */
    var torso = g('host-torso');
    add(torso, 'path', { d: 'M100 720 C100 480 250 410 460 410 C670 410 820 480 820 720Z', fill: cfg.clothes, stroke: OUT, 'stroke-width': 4 });
    if (cfg.stripes !== 'no') [520, 560, 600, 640, 680].forEach(function (y) { add(torso, 'path', { d: 'M140 ' + y + ' Q460 ' + (y - 40) + ' 780 ' + y, fill: 'none', stroke: cfg.stripes === 'yes' ? '#ffffff' : cfg.stripes, 'stroke-width': 8, opacity: 0.5 }); });
    add(torso, 'rect', { x: 408, y: 350, width: 104, height: 70, rx: 22, fill: skin, stroke: OUT, 'stroke-width': 4 });
    add(torso, 'path', { d: 'M392 412 L460 474 L528 412 L506 402 L460 440 L414 402Z', fill: '#f4f4f4', stroke: OUT, 'stroke-width': 3, 'stroke-linejoin': 'round' });
    /* arms (shoulder pivots at y 462) */
    function arm(id, sx, ex, ey, hx, hy) {
      var a = g(id), d = 'M' + sx + ' 462 L' + ex + ' ' + ey + ' L' + hx + ' ' + hy;
      add(a, 'path', { d: d, fill: 'none', stroke: OUT, 'stroke-width': 64, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      add(a, 'path', { d: d, fill: 'none', stroke: cfg.clothes, 'stroke-width': 56, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
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
    /* thin grey hair at the temples only (receding) */
    add(head, 'path', { d: 'M366 236 C356 196 366 158 392 144 C384 176 384 206 392 240Z', fill: cfg.hair, stroke: OUT, 'stroke-width': 3 });
    add(head, 'path', { d: 'M554 236 C564 196 554 158 528 144 C536 176 536 206 528 240Z', fill: cfg.hair, stroke: OUT, 'stroke-width': 3 });
    add(head, 'path', { d: 'M398 150 C430 132 490 132 522 150 C490 142 430 142 398 150Z', fill: cfg.hair, opacity: 0.9 });
    if (old) {
      [[416, 182, 504, 182, 175], [420, 196, 500, 196, 190]].forEach(function (l) { add(head, 'path', { d: 'M' + l[0] + ' ' + l[1] + ' Q460 ' + l[4] + ' ' + l[2] + ' ' + l[3], fill: 'none', stroke: OUT, 'stroke-width': 3, opacity: 0.3, 'stroke-linecap': 'round' }); });
      add(head, 'path', { d: 'M394 236 l-12 -6 M394 244 l-14 2 M526 236 l12 -6 M526 244 l14 2', fill: 'none', stroke: OUT, 'stroke-width': 2.5, opacity: 0.4, 'stroke-linecap': 'round' });
    }
    /* beard: full, grey, with side whiskers */
    if (cfg.beard !== 'no') add(head, 'path', { d: 'M366 262 C364 350 404 410 460 414 C516 410 556 350 554 262 C546 300 512 322 460 322 C408 322 374 300 366 262Z', fill: cfg.beardColor, stroke: OUT, 'stroke-width': 3, 'stroke-linejoin': 'round' });
    if (!cfg.faceless) {
      var eb = g('host-eyebrows', head);
      add(eb, 'path', { d: 'M406 208 Q427 195 450 206', fill: 'none', stroke: cfg.hair, 'stroke-width': 11, 'stroke-linecap': 'round' });
      add(eb, 'path', { d: 'M470 206 Q493 195 514 208', fill: 'none', stroke: cfg.hair, 'stroke-width': 11, 'stroke-linecap': 'round' });
      var eyes = g('host-eyes', head);
      add(eyes, 'ellipse', { cx: 428, cy: 232, rx: 14, ry: 10, fill: '#fff', stroke: OUT, 'stroke-width': 2 });
      add(eyes, 'ellipse', { cx: 492, cy: 232, rx: 14, ry: 10, fill: '#fff', stroke: OUT, 'stroke-width': 2 });
      var pu = g('host-pupils', head);
      add(pu, 'circle', { cx: 428, cy: 233, r: 5.5, fill: '#1c1410' });
      add(pu, 'circle', { cx: 492, cy: 233, r: 5.5, fill: '#1c1410' });
      var lids = g('host-eyelids', head);
      add(lids, 'rect', { x: 412, y: 220, width: 32, height: 24, fill: skin, id: 'host-lid-l', transform: 'translate(0 220) scale(1 0) translate(0 -220)' });
      add(lids, 'rect', { x: 476, y: 220, width: 32, height: 24, fill: skin, id: 'host-lid-r', transform: 'translate(0 220) scale(1 0) translate(0 -220)' });
      if (old) add(head, 'path', { d: 'M414 246 Q428 254 442 246 M478 246 Q492 254 506 246', fill: 'none', stroke: OUT, 'stroke-width': 2.5, opacity: 0.35, 'stroke-linecap': 'round' });
      add(head, 'path', { d: 'M458 238 Q440 278 456 288 Q472 292 480 282', fill: 'none', stroke: OUT, 'stroke-width': 3.5, 'stroke-linecap': 'round', opacity: 0.65 });
      var mouth = g('host-mouth', head);
      add(mouth, 'ellipse', { cx: 460, cy: 316, rx: 24, ry: 14, fill: '#4a1818', stroke: OUT, 'stroke-width': 3 });
      add(mouth, 'ellipse', { cx: 460, cy: 322, rx: 13, ry: 5, fill: '#b85a5a' });
      if (cfg.beard !== 'no') add(head, 'path', { d: 'M412 300 C428 286 452 292 460 300 C468 292 492 286 508 300 C494 312 474 306 460 304 C446 306 426 312 412 300Z', fill: cfg.beardColor, stroke: OUT, 'stroke-width': 2.5, 'stroke-linejoin': 'round' });
    } else {
      var wv = g('host-waves', head);
      [0, 1, 2].forEach(function (k) { add(wv, 'path', { d: 'M' + (352 - 16 * k) + ' ' + (300 - 18 - 6 * k) + ' q-14 18 0 ' + (36 + 12 * k), fill: 'none', stroke: 'var(--hl)', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8 }); });
    }
    if (cfg.glasses !== 'no') { var gl = g('host-glasses', head); add(gl, 'circle', { cx: 428, cy: 232, r: 24, fill: 'none', stroke: OUT, 'stroke-width': 5 }); add(gl, 'circle', { cx: 492, cy: 232, r: 24, fill: 'none', stroke: OUT, 'stroke-width': 5 }); add(gl, 'path', { d: 'M452 232h16', stroke: OUT, 'stroke-width': 5 }); }
    if (cfg.cap !== 'no') add(head, 'path', { d: 'M366 176 C370 106 550 106 554 176 Z M360 178 h200 l30 10 h-250Z', fill: cfg.cap === 'yes' ? '#2d4a8a' : cfg.cap, stroke: OUT, 'stroke-width': 4 });
    var hp = g('host-headphones', head);
    add(hp, 'path', { d: 'M360 246 C344 112 576 112 560 246', fill: 'none', stroke: cfg.headphones, 'stroke-width': 14, 'stroke-linecap': 'round' });
    add(hp, 'rect', { x: 340, y: 224, width: 36, height: 66, rx: 16, fill: cfg.headphones, stroke: OUT, 'stroke-width': 4 });
    add(hp, 'rect', { x: 544, y: 224, width: 36, height: 66, rx: 16, fill: cfg.headphones, stroke: OUT, 'stroke-width': 4 });
    /* microphone boom drawn LAST so the mic sits in front of the face, beside the mouth */
    var mic = g('host-mic');
    add(mic, 'path', { d: 'M20 60 L150 60 L392 318', fill: 'none', stroke: OUT, 'stroke-width': 16, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    add(mic, 'path', { d: 'M20 60 L150 60 L392 318', fill: 'none', stroke: cfg.mic, 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    add(mic, 'circle', { cx: 150, cy: 60, r: 11, fill: cfg.mic, stroke: OUT, 'stroke-width': 3 });
    add(mic, 'rect', { x: 384, y: 310, width: 24, height: 40, rx: 9, transform: 'rotate(-38 396 330)', fill: '#222', stroke: OUT, 'stroke-width': 3 });
    add(mic, 'ellipse', { cx: 414, cy: 318, rx: 24, ry: 32, transform: 'rotate(-38 414 318)', fill: '#2c2c2c', stroke: OUT, 'stroke-width': 3 });
    add(mic, 'path', { d: 'M400 304 l28 26 M396 316 l26 24', stroke: '#555', 'stroke-width': 2, opacity: 0.7 });
    o.svg = svg;
    return o;
  };
})();
