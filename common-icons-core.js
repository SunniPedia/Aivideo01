/* Shared hidden <defs>, ornaments and UI symbols. Every vector is defined ONCE and only referenced with <use>. */
(function () {
  var PV = window.PV, D = PV.defs = {}, I = PV.icons = { list: [], fallback: ['star8', 'diamond', 'floral', 'knot'], defs: {} };
  var svg = null, defs = null;
  D.ensure = function () {
    if (svg) return;
    var ex = document.getElementById('pv-defs');
    if (ex) { svg = ex; defs = ex.querySelector('defs'); return; }
    svg = PV.s('svg', { id: 'pv-defs', width: 0, height: 0, 'aria-hidden': 'true' });
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    defs = PV.s('defs', {}, svg);
    document.body.appendChild(svg);
  };
  D.symbol = function (id, inner, vb) {
    D.ensure();
    if (document.getElementById(id)) return;
    var s = PV.s('symbol', { id: id, viewBox: vb || '0 0 100 100' }, defs);
    s.innerHTML = inner.replace(/class="([SFG])"/g, function (m, c) { return 'class="i' + c.toLowerCase() + '"'; });
  };
  I.add = function (name, inner) { if (I.list.indexOf(name) < 0) I.list.push(name); I.defs[name] = inner; D.symbol('ic-' + name, inner); };
  /* <svg><use/></svg> element of a given pixel size */
  I.make = function (name, size, parent) {
    var e = PV.s('svg', { width: size, height: size, viewBox: '0 0 100 100' }, parent);
    e.style.display = 'block'; e.style.overflow = 'visible';
    PV.s('use', { href: '#ic-' + name }, e);
    return e;
  };
  I.add('star8', '<path class="F" d="M50 8L61 27 82 18 73 39 92 50 73 61 82 82 61 73 50 92 39 73 18 82 27 61 8 50 27 39 18 18 39 27Z"/><circle class="G" cx="50" cy="50" r="6"/>');
  I.add('diamond', '<path class="F" d="M50 10L86 50 50 90 14 50Z"/><path class="S" d="M30 50L50 30 70 50 50 70Z"/>');
  I.add('floral', '<ellipse class="F" cx="50" cy="50" rx="9" ry="36"/><ellipse class="F" cx="50" cy="50" rx="9" ry="36" transform="rotate(45 50 50)"/><ellipse class="F" cx="50" cy="50" rx="9" ry="36" transform="rotate(90 50 50)"/><ellipse class="F" cx="50" cy="50" rx="9" ry="36" transform="rotate(135 50 50)"/><circle class="G" cx="50" cy="50" r="8"/>');
  I.add('knot', '<rect class="S" x="22" y="22" width="56" height="56" rx="10"/><rect class="S" x="22" y="22" width="56" height="56" rx="10" transform="rotate(45 50 50)"/><circle class="F" cx="50" cy="50" r="12"/>');
  I.add('play-arrow', '<path class="F" d="M30 14L84 50 30 86Z"/>');
  I.add('download-arrow', '<path class="F" d="M40 12h20v34h14L50 70 26 46h14Z"/><path class="S" d="M18 84h64"/>');
  /* ornament line used by the caption panels: small star, diamond, small star */
  I.ornamentLine = function (parent, size, gap) {
    var wrap = PV.h('div', null, parent, { display: 'flex', gap: gap + 'px', alignItems: 'center', justifyContent: 'center' });
    ['star8', 'diamond', 'star8'].forEach(function (n, i) { I.make(n, i === 1 ? size : size * 0.78, wrap); });
    return wrap;
  };
})();
