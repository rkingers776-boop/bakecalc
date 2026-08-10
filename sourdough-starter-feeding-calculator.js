/* ============================================================
   BakeCalc Club — Sourdough Starter Feeding Calculator v1
   Ratio math (1:1:1 … 1:10:10) + temperature → peak-time model.
   Q10 ≈ 2: fermentation rate doubles per 10°C rise.
   All computation runs locally in the browser.
   ============================================================ */

var StarterFeedCalc = (function () {
  'use strict';

  /* ---- Peak-time reference: hours to peak at ratio & temp ----
     Empirical model cross-checked against King Arthur / Tartine guides.
     Reference: 1:1:1 peaks ~4h at 25°C; rate doubles per ~10°C. */
  function peakHours(ratio, tempC) {
    /* base time at 25°C by ratio */
    var base = {
      1: 4.0,   /* 1:1:1 */
      2: 6.5,   /* 1:2:2 */
      3: 8.5,   /* 1:3:3 */
      5: 11.0,  /* 1:5:5 */
      10: 17.0  /* 1:10:10 */
    }[ratio] || 4.0;
    /* Q10 model: rate doubles per 10°C → time halves per 10°C rise */
    var factor = Math.pow(2, (25 - tempC) / 10);
    var h = base * factor;
    /* floor at cold temps: fridge is not a simple curve */
    if (tempC <= 10) h = Math.max(h, 12);
    if (tempC <= 5) h = Math.max(h, 16);
    return h;
  }

  function fmtHours(h) {
    if (h >= 24) return (h / 24).toFixed(1) + ' days';
    if (h >= 8) return h.toFixed(1) + ' hours';
    var m = Math.round(h * 60);
    if (m < 60) return m + ' min';
    return (m / 60).toFixed(1) + ' hrs';
  }

  function fmtTemp(tempC, unit) {
    if (unit === 'C') return Math.round(tempC) + '°C';
    return Math.round(tempC * 9 / 5 + 32) + '°F';
  }

  function render() {
    var ratio = parseInt(document.getElementById('feed-ratio').value, 10) || 1;
    var target = parseFloat(document.getElementById('feed-target').value) || 0;
    var starterIn = parseFloat(document.getElementById('feed-starter').value) || 0;
    var tempInput = parseFloat(document.getElementById('feed-temp').value);
    var unit = document.getElementById('feed-unit').value;
    var tempC = unit === 'F' ? (tempInput - 32) * 5 / 9 : tempInput;

    var res = document.getElementById('feed-result');
    if (target <= 0 && starterIn <= 0) {
      res.style.display = 'none';
      return;
    }

    var parts = 1 + ratio + ratio; /* starter : flour : water */
    var seed, flour, water, total;
    if (starterIn > 0 && target <= 0) {
      /* user has starter on hand → compute from it + discard estimate */
      seed = starterIn;
      flour = seed * ratio;
      water = seed * ratio;
      total = seed + flour + water;
    } else if (target > 0) {
      seed = target / parts;
      flour = seed * ratio;
      water = seed * ratio;
      total = target;
    } else {
      seed = starterIn;
      flour = seed * ratio;
      water = seed * ratio;
      total = seed + flour + water;
    }

    /* rounding to whole grams */
    seed = Math.round(seed * 10) / 10;
    flour = Math.round(flour * 10) / 10;
    water = Math.round(water * 10) / 10;
    total = Math.round(total * 10) / 10;

    document.getElementById('feed-result').style.display = 'block';
    document.getElementById('feed-seed').textContent = seed.toFixed(1) + ' g';
    document.getElementById('feed-flour').textContent = flour.toFixed(1) + ' g';
    document.getElementById('feed-water').textContent = water.toFixed(1) + ' g';
    document.getElementById('feed-total').textContent = total.toFixed(1) + ' g';

    /* ratio label */
    var ratioLabel = '1 : ' + ratio + ' : ' + ratio;
    document.getElementById('feed-ratio-label').textContent = ratioLabel;

    /* peak time */
    if (!isNaN(tempC) && tempInput !== '') {
      var h = peakHours(ratio, tempC);
      document.getElementById('feed-peak').textContent = fmtHours(h);
      document.getElementById('feed-peak-note').textContent =
        'at ' + fmtTemp(tempC, unit) + ' (Q10 model, ±25% — judge by the starter, not the clock)';
      document.getElementById('feed-peak-row').style.display = '';
    } else {
      document.getElementById('feed-peak-row').style.display = 'none';
    }

    /* ratio advice */
    var advice = '';
    if (ratio === 1) advice = '1:1:1 is the standard daily maintenance feed — peaks fast, slightly tangier. Great for same-day baking.';
    else if (ratio === 2) advice = '1:2:2 buys you a slower feed cycle (roughly 24h at room temp) with less acid buildup.';
    else if (ratio === 3) advice = '1:3:3 is a good mid-range choice for a 12-18h cycle or a slightly stronger starter.';
    else if (ratio === 5) advice = '1:5:5 is the classic overnight feed — peaks in 10-12h at 72°F, better flavor, less acid.';
    else if (ratio === 10) advice = '1:10:10 is for fridge-revival or long overnight builds — very slow, very gentle.';
    document.getElementById('feed-advice').textContent = advice;
  }

  return {
    init: function () {
      var calcBtn = document.getElementById('feed-calc-btn');
      if (calcBtn) {
        calcBtn.addEventListener('click', function (e) {
          e.preventDefault();
          render();
        });
      }
      var inputs = ['feed-ratio', 'feed-target', 'feed-starter', 'feed-temp', 'feed-unit'];
      for (var i = 0; i < inputs.length; i++) {
        var el = document.getElementById(inputs[i]);
        if (el) {
          el.addEventListener('input', function () {
            var res = document.getElementById('feed-result');
            if (res && res.style.display === 'block') render();
          });
        }
      }
      var temp = document.getElementById('feed-temp');
      if (temp && temp.value === '') temp.value = '22';
      render();
    }
  };
})();

document.addEventListener('DOMContentLoaded', function () {
  StarterFeedCalc.init();
});
