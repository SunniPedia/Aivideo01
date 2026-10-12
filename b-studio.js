/* Theme B studio: acoustic panels, shelf with books, plant, ON AIR sign, desk, wall screen */
(function () {
  var PV = window.PV, St = PV.studio = {};
  St.build = function (stage) {
    var o = {};
    var sv = PV.s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080' }, stage); sv.style.cssText = 'position:absolute;left:0;top:0';
    var g = PV.s('g', {}, sv);
    for (var r = 0; r < 2; r++) for (var c = 0; c < 4; c++) {
      var x = 1000 + c * 230, y = 150 + r * 292;
      PV.s('rect', { x: x, y: y, width: 206, height: 268, rx: 18, fill: 'var(--bg-deep)', stroke: 'var(--bg-mid)', 'stroke-width': 3 }, g);
      for (var k = 1; k < 8; k++) PV.s('line', { x1: x + 16, x2: x + 190, y1: y + k * 30, y2: y + k * 30, stroke: 'var(--bg-black)', 'stroke-width': 3, opacity: 0.7 }, g);
    }
    PV.s('rect', { x: 360, y: 228, width: 560, height: 6, rx: 3, fill: 'var(--hl2)', opacity: 0.8 }, g);
    var bx = 380, cols = ['var(--accent)', 'var(--hl2)', 'var(--bg-mid)', 'var(--hl)', 'var(--cream)'];
    for (var i = 0; i < 18; i++) {
      var w = 18 + ((i * 7) % 5) * 4, h = 44 + ((i * 13) % 5) * 8;
      PV.s('rect', { x: bx, y: 228 - h, width: w, height: h, rx: 3, fill: cols[(i * 3) % cols.length], opacity: 0.85, stroke: 'var(--bg-black)', 'stroke-width': 2 }, g);
      bx += w + 4;
    }
    PV.s('path', { d: 'M1790 790 C1760 700 1740 640 1780 560 C1790 640 1810 700 1820 790Z', fill: 'var(--accent)', stroke: 'var(--bg-black)', 'stroke-width': 3 }, g);
    PV.s('path', { d: 'M1815 790 C1830 700 1870 640 1900 590 C1890 680 1860 740 1835 790Z', fill: 'var(--accent)', stroke: 'var(--bg-black)', 'stroke-width': 3 }, g);
    PV.s('path', { d: 'M1800 790 C1800 700 1790 620 1820 520 C1850 620 1840 700 1830 790Z', fill: 'var(--accent)', opacity: 0.8 }, g);
    PV.s('path', { d: 'M1770 760h80l-12 50h-56Z', fill: 'var(--hl2)', stroke: 'var(--bg-black)', 'stroke-width': 3 }, g);
    var onair = PV.h('div', 'abs', stage, { left: '1620px', top: '40px', width: '270px', height: '74px', borderRadius: '16px', border: '4px solid var(--hl)', background: 'var(--bg-black)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' });
    o.dot = PV.h('div', null, onair, { width: '22px', height: '22px', borderRadius: '50%', background: '#ff3b30' });
    var tx = PV.h('div', null, onair, { fontFamily: "'Noto Serif',serif", fontWeight: 700, fontSize: '34px', letterSpacing: '2px', color: 'var(--cream)' }); tx.textContent = 'ON AIR';
    o.onair = onair;
    return o;
  };
  St.buildFront = function (stage, opts) {
    var o = {};
    PV.h('div', null, stage).id = 'desk';
    o.screen = PV.h('div', null, stage); o.screen.id = 'screen';
    o.area = PV.h('div', 'abs', o.screen, { left: 0, top: 0, width: '928px', height: '478px' });
    PV.h('div', null, o.screen).id = 'screen-lines';
    return o;
  };
  St.update = function (o, front, t, sp, lv) {
    var blink = Math.sin(t * 5) > 0 ? 1 : 0.35;
    o.dot.style.opacity = (sp > 0.05 ? (0.35 + 0.65 * blink * sp) : 0.25).toFixed(3);
    o.dot.style.boxShadow = '0 0 ' + (4 + 22 * sp).toFixed(1) + 'px rgba(255,59,48,' + (0.2 + 0.7 * sp).toFixed(2) + ')';
    o.onair.style.boxShadow = '0 0 ' + (6 + 40 * sp * (0.5 + lv)).toFixed(1) + 'px rgba(255,59,48,' + (0.1 + 0.5 * sp).toFixed(2) + ')';
    o.onair.style.opacity = (0.6 + 0.4 * sp).toFixed(3);
    front.screen.style.boxShadow = '0 0 ' + (24 + 70 * lv).toFixed(1) + 'px rgba(var(--mood),' + (0.25 + 0.35 * lv).toFixed(3) + ')';
  };
})();
