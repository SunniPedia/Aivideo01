/* Host look values only (from project.json host fields) */
(function () {
  var PV = window.PV;
  PV.hostCfg = function (project) {
    var h = project.host || {};
    function v(k, d) { return h[k] === undefined || h[k] === 'auto' || h[k] === '' ? d : h[k]; }
    return {
      skin: v('skin', '#c68a5e'), hair: v('hair', '#1d1a18'), cap: v('cap', 'no'), beard: v('beard', 'no'), glasses: v('glasses', 'no'),
      clothes: v('clothes', 'var(--accent)'), stripes: v('stripes', 'no'), headphones: v('headphones', '#2b2f36'), mic: v('mic', '#3a3f48'),
      faceless: h.faceless === true || h.faceless === 'yes'
    };
  };
})();
