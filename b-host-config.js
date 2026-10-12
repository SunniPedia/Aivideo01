/* Host look values only (from project.json host fields) */
(function () {
  var PV = window.PV;
  PV.hostCfg = function (project) {
    var h = project.host || {};
    function v(k, d) { return h[k] === undefined || h[k] === 'auto' || h[k] === '' ? d : h[k]; }
    return {
      skin: v('skin', '#c98f66'), hair: v('hair', '#1a1410'), beardColor: v('beardColor', '#17110d'), cap: v('cap', 'turban'), capColor: v('capColor', '#f3f1ec'),
      beard: v('beard', 'yes'), glasses: v('glasses', 'yes'), glassesColor: v('glassesColor', '#8a5a2b'), age: v('age', 'adult'),
      clothes: v('clothes', '#f1ede3'), stripes: v('stripes', 'no'), headphones: v('headphones', '#1b1b1b'), accent: v('accent', '#d4a73a'), mic: v('mic', '#222222'),
      faceless: h.faceless === true || h.faceless === 'yes'
    };
  };
})();
