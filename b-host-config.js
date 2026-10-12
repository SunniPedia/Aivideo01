/* Host look values only (from project.json host fields) */
(function () {
  var PV = window.PV;
  PV.hostCfg = function (project) {
    var h = project.host || {};
    function v(k, d) { return h[k] === undefined || h[k] === 'auto' || h[k] === '' ? d : h[k]; }
    return {
      skin: v('skin', '#c68a5e'), hair: v('hair', '#d4d4d4'), beardColor: v('beardColor', '#e8e8e8'), cap: v('cap', 'no'), beard: v('beard', 'yes'), glasses: v('glasses', 'no'),
      age: v('age', 'old'), clothes: v('clothes', 'var(--accent)'), stripes: v('stripes', 'no'), headphones: v('headphones', '#2b2f36'), mic: v('mic', '#3a3f48'),
      faceless: h.faceless === true || h.faceless === 'yes'
    };
  };
})();
