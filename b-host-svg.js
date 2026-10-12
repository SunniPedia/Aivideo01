/* Host SVG (original flat illustration). Ids use the prefix host-. Built once. */
(function () {
  var PV = window.PV, H = PV.hostSvg = {};
  H.build = function (parent, cfg) {
    var box = PV.h('div', 'abs', parent, { left: '960px', top: '100px', width: '960px', height: '720px' });
    var svg = PV.s('svg', { width: 960, height: 720, viewBox: '0 0 960 720' }, box), o = {};
    var OUT = '#1a1410', skin = cfg.skin;
    function g(id, parent2) { var e = PV.s('g', { id: id }, parent2 || svg); o[id] = e; return e; }
    function add(parent2, tag, a) { return PV.s(tag, a, parent2); }
    /* mic boom arm and foam (fixed) */
    var mic = g('host-mic');
    add(mic, 'path', { d: 'M20 60 L120 60 L330 262', fill: 'none', stroke: cfg.mic, 'stroke-width': 12, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    add(mic, 'circle', { cx: 120, cy: 60, r: 9, fill: cfg.mic });
    add(mic, 'rect', { x: 322, y: 252, width: 34, height: 60, rx: 15, transform: 'rotate(-35 339 282)', fill: '#222' });
    add(mic, 'ellipse', { cx: 352, cy: 288, rx: 26, ry: 34, transform: 'rotate(-20 352 288)', fill: '#2c2c2c', stroke: OUT, 'stroke-width': 3 });
    /* torso */
    var torso = g('host-torso');
    add(torso, 'path', { d: 'M110 720 C110 540 250 480 460 480 C670 480 810 540 810 720Z', fill: cfg.clothes, stroke: OUT, 'stroke-width': 4 });
    if (cfg.stripes !== 'no') [560, 600, 640, 680].forEach(function (y) { add(torso, 'path', { d: 'M150 ' + y + ' Q460 ' + (y - 40) + ' 770 ' + y, fill: 'none', stroke: cfg.stripes === 'yes' ? '#ffffff' : cfg.stripes, 'stroke-width': 8, opacity: 0.5 }); });
    add(torso, 'rect', { x: 420, y: 400, width: 80, height: 100, rx: 20, fill: skin, stroke: OUT, 'stroke-width': 4 });
    add(torso, 'path', { d: 'M400 480 L460 540 L520 480 L500 470 L460 505 L420 470Z', fill: '#f4f4f4', stroke: OUT, 'stroke-width': 3, 'stroke-linejoin': 'round' });
    /* arms */
    function arm(id, sx, ex, ey, hx, hy) {
      var a = g(id);
      var d = 'M' + sx + ' 530 L' + ex + ' ' + ey + ' L' + hx + ' ' + hy;
      add(a, 'path', { d: d, fill: 'none', stroke: OUT, 'stroke-width': 62, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      add(a, 'path', { d: d, fill: 'none', stroke: cfg.clothes, 'stroke-width': 54, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      add(a, 'circle', { cx: hx, cy: hy + 14, r: 30, fill: skin, stroke: OUT, 'stroke-width': 4 });
      return a;
    }
    arm('host-arm-left', 270, 200, 640, 290, 672);
    arm('host-arm-right', 650, 730, 640, 640, 672);
    /* head */
    var head = g('host-head');
    add(head, 'ellipse', { cx: 372, cy: 250, rx: 16, ry: 30, fill: skin, stroke: OUT, 'stroke-width': 4 });
    add(head, 'ellipse', { cx: 548, cy: 250, rx: 16, ry: 30, fill: skin, stroke: OUT, 'stroke-width': 4 });
    add(head, 'ellipse', { cx: 460, cy: 250, rx: 92, ry: 112, fill: skin, stroke: OUT, 'stroke-width': 4 });
    add(head, 'path', { d: 'M366 215 C360 140 410 122 460 122 C512 122 560 140 554 215 C540 170 500 160 460 160 C420 160 380 170 366 215Z', fill: cfg.hair, stroke: OUT, 'stroke-width': 3 });
    if (cfg.beard !== 'no') add(head, 'path', { d: 'M372 270 C380 350 420 372 460 372 C500 372 540 350 548 270 C530 320 500 330 460 330 C420 330 390 320 372 270Z', fill: cfg.hair, stroke: OUT, 'stroke-width': 3 });
    if (!cfg.faceless) {
      var eb = g('host-eyebrows', head);
      add(eb, 'path', { d: 'M410 205 Q428 196 446 205', fill: 'none', stroke: cfg.hair, 'stroke-width': 7, 'stroke-linecap': 'round' });
      add(eb, 'path', { d: 'M474 205 Q492 196 510 205', fill: 'none', stroke: cfg.hair, 'stroke-width': 7, 'stroke-linecap': 'round' });
      var eyes = g('host-eyes', head);
      add(eyes, 'ellipse', { cx: 428, cy: 228, rx: 15, ry: 11, fill: '#fff', stroke: OUT, 'stroke-width': 2 });
      add(eyes, 'ellipse', { cx: 492, cy: 228, rx: 15, ry: 11, fill: '#fff', stroke: OUT, 'stroke-width': 2 });
      var pu = g('host-pupils', head);
      add(pu, 'circle', { cx: 428, cy: 229, r: 6, fill: '#1c1410' });
      add(pu, 'circle', { cx: 492, cy: 229, r: 6, fill: '#1c1410' });
      var lids = g('host-eyelids', head);
      add(lids, 'rect', { x: 412, y: 216, width: 32, height: 24, fill: skin, id: 'host-lid-l', transform: 'translate(0 216) scale(1 0) translate(0 -216)' });
      add(lids, 'rect', { x: 476, y: 216, width: 32, height: 24, fill: skin, id: 'host-lid-r', transform: 'translate(0 216) scale(1 0) translate(0 -216)' });
      add(head, 'path', { d: 'M458 238 Q450 262 462 266', fill: 'none', stroke: OUT, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.6 });
      var mouth = g('host-mouth', head);
      add(mouth, 'ellipse', { cx: 460, cy: 308, rx: 26, ry: 16, fill: '#5a1f1f', stroke: OUT, 'stroke-width': 3 });
      add(mouth, 'ellipse', { cx: 460, cy: 316, rx: 14, ry: 6, fill: '#c46464' });
    } else {
      var wv = g('host-waves', head);
      [0, 1, 2].forEach(function (k) { add(wv, 'path', { d: 'M' + (352 - 16 * k) + ' ' + (280 - 18 - 6 * k) + ' q-14 18 0 ' + (36 + 12 * k), fill: 'none', stroke: 'var(--hl)', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8 }); });
    }
    if (cfg.glasses !== 'no') { var gl = g('host-glasses', head); add(gl, 'circle', { cx: 428, cy: 228, r: 24, fill: 'none', stroke: OUT, 'stroke-width': 5 }); add(gl, 'circle', { cx: 492, cy: 228, r: 24, fill: 'none', stroke: OUT, 'stroke-width': 5 }); add(gl, 'path', { d: 'M452 228h16', stroke: OUT, 'stroke-width': 5 }); }
    if (cfg.cap !== 'no') add(head, 'path', { d: 'M366 170 C370 100 550 100 554 170 Z M360 172 h200 l30 10 h-250Z', fill: cfg.cap === 'yes' ? '#2d4a8a' : cfg.cap, stroke: OUT, 'stroke-width': 4 });
    var hp = g('host-headphones', head);
    add(hp, 'path', { d: 'M366 240 C350 110 570 110 554 240', fill: 'none', stroke: cfg.headphones, 'stroke-width': 14, 'stroke-linecap': 'round' });
    add(hp, 'rect', { x: 346, y: 218, width: 36, height: 66, rx: 16, fill: cfg.headphones, stroke: OUT, 'stroke-width': 4 });
    add(hp, 'rect', { x: 538, y: 218, width: 36, height: 66, rx: 16, fill: cfg.headphones, stroke: OUT, 'stroke-width': 4 });
    o.svg = svg;
    return o;
  };
})();
