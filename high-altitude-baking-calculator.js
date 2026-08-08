/* ============================================================
   BakeCalc Club — High Altitude Baking Calculator v1
   Adjustments follow CSU Extension & King Arthur Flour guides
   (same data as the high-altitude baking article).
   All computation runs locally in the browser.
   ============================================================ */

var AltitudeCalc = (function () {
  'use strict';

  /* ---- Adjustment bands by elevation (feet) ----
     Each band: [label, bakingPowder (%), sugar (tbsp/cup), liquid (tbsp/cup),
                flour (tbsp/cup), oven (+°F), time (%), extraEgg (desc), yeast (%)] */
  var BANDS = [
    { min: 0,    max: 3000, label: 'Sea level – 3,000 ft', active: false,
      leaven: 'None', sugar: 'None', liquid: 'None', flour: 'None',
      oven: '+0°F', time: 'None', egg: 'No adjustment needed', yeast: 'None',
      note: 'Below 3,000 ft most recipes bake fine without adjustment.' },
    { min: 3000, max: 5000, label: '3,000 – 5,000 ft', active: true,
      leaven: 'Reduce 10–15%', sugar: '1 Tbsp per cup', liquid: '1–2 Tbsp per cup',
      flour: '0–1 Tbsp per cup', oven: '+15°F', time: 'Reduce 0–5%',
      egg: 'Optional: 1 extra egg per recipe', yeast: 'Reduce 10–15%',
      note: 'Start adjusting here. Cakes are the first thing to notice.' },
    { min: 5000, max: 7500, label: '5,000 – 7,500 ft', active: true,
      leaven: 'Reduce 20–25%', sugar: '1–2 Tbsp per cup', liquid: '2–3 Tbsp per cup',
      flour: '1–2 Tbsp per cup', oven: '+15–25°F', time: 'Reduce 5–10%',
      egg: '1 extra egg per recipe', yeast: 'Reduce 15–25%',
      note: 'Denver (5,280 ft) territory. The classic adjustment zone.' },
    { min: 7500, max: 10000, label: '7,500 – 10,000 ft', active: true,
      leaven: 'Reduce 25–33%', sugar: '2–3 Tbsp per cup', liquid: '3–4 Tbsp per cup',
      flour: '2–3 Tbsp per cup', oven: '+25°F', time: 'Reduce 10%',
      egg: '1–2 extra eggs per recipe', yeast: 'Reduce 25–33%',
      note: 'High mountain baking. Aggressive adjustments needed.' },
    { min: 10000, max: 99999, label: 'Above 10,000 ft', active: true,
      leaven: 'Reduce 33–50%', sugar: '3–4 Tbsp per cup', liquid: '4–5 Tbsp per cup',
      flour: '3–4 Tbsp per cup', oven: '+25–30°F', time: 'Reduce 10–15%',
      egg: '2 extra eggs per recipe', yeast: 'Reduce 33–50%',
      note: 'Extreme altitude. Expect to experiment with every bake.' }
  ];

  /* ---- Bake type focus notes ---- */
  var BAKE_NOTES = {
    cake: 'Cakes are the hardest at altitude — reduce leavening first, then sugar.',
    muffin: 'Muffins/quick breads: reduce leavening ~25%, add 1–2 Tbsp liquid per cup.',
    cookie: 'Cookies are least affected — reduce sugar slightly, add a touch more flour.',
    yeast: 'Yeast bread rises much faster — reduce yeast, shorten rise times, punch down more.',
    breadQuick: 'Quick breads: cut baking powder, add extra liquid, expect shorter bake.'
  };

  function findBand(ft) {
    for (var i = 0; i < BANDS.length; i++) {
      if (ft >= BANDS[i].min && ft < BANDS[i].max) return BANDS[i];
    }
    return BANDS[BANDS.length - 1];
  }

  function render() {
    var ftInput = document.getElementById('altitude-ft');
    var ft = parseFloat(ftInput.value);
    if (isNaN(ft) || ft < 0) {
      document.getElementById('alt-result').style.display = 'none';
      return;
    }
    var bakeType = document.getElementById('bake-type').value;
    var band = findBand(ft);

    document.getElementById('alt-result').style.display = 'block';
    document.getElementById('alt-band').textContent = band.label;
    document.getElementById('alt-leaven').textContent = band.leaven;
    document.getElementById('alt-sugar').textContent = band.sugar;
    document.getElementById('alt-liquid').textContent = band.liquid;
    document.getElementById('alt-flour').textContent = band.flour;
    document.getElementById('alt-oven').textContent = band.oven;
    document.getElementById('alt-time').textContent = band.time;
    document.getElementById('alt-egg').textContent = band.egg;
    document.getElementById('alt-yeast').textContent = band.yeast;
    document.getElementById('alt-note').textContent = band.note;
    document.getElementById('alt-bake-focus').textContent = BAKE_NOTES[bakeType] || '';

    /* show/hide yeast row */
    document.getElementById('alt-yeast-row').style.display = bakeType === 'yeast' ? '' : 'none';
  }

  return {
    init: function () {
      var calcBtn = document.getElementById('alt-calc-btn');
      if (calcBtn) {
        calcBtn.addEventListener('click', function (e) {
          e.preventDefault();
          render();
        });
      }
      var inputs = ['altitude-ft', 'bake-type'];
      for (var i = 0; i < inputs.length; i++) {
        var el = document.getElementById(inputs[i]);
        if (el) {
          el.addEventListener('input', function () {
            var res = document.getElementById('alt-result');
            if (res && res.style.display === 'block') render();
          });
        }
      }
      var ft = document.getElementById('altitude-ft');
      if (ft && ft.value === '') ft.value = '5280';
      var bt = document.getElementById('bake-type');
      if (bt && bt.value === '') bt.value = 'cake';
      render();
    }
  };
})();

document.addEventListener('DOMContentLoaded', function () {
  AltitudeCalc.init();
});
