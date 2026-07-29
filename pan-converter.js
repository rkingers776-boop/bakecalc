/* ============================================================
   BakeCalc Club — Pan Size Converter
   Zero dependencies. Area-based pan math for real bakers.
   ============================================================ */

/* ============================================================
   GA4 — Google Analytics 4 (G-G1GB4E169W)
   ============================================================ */
(function() {
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-G1GB4E169W';
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-G1GB4E169W');
})();

(function () {
  'use strict';

  /* ---- Pan Database ---- */
  var SHAPES = {
    round: {
      label: 'Round',
      icon: '🔵',
      sizes: [
        { label: '4-inch',   dim1: 4 },
        { label: '6-inch',   dim1: 6 },
        { label: '8-inch',   dim1: 8 },
        { label: '9-inch',   dim1: 9 },
        { label: '10-inch',  dim1: 10 },
        { label: '12-inch',  dim1: 12 },
        { label: '14-inch',  dim1: 14 }
      ],
      areaFn: function(d) { return Math.PI * Math.pow(d.dim1 / 2, 2); }
    },
    square: {
      label: 'Square',
      icon: '🟫',
      sizes: [
        { label: '6-inch',    dim1: 6 },
        { label: '8-inch',    dim1: 8 },
        { label: '9-inch',    dim1: 9 },
        { label: '10-inch',   dim1: 10 },
        { label: '12-inch',   dim1: 12 }
      ],
      areaFn: function(d) { return d.dim1 * d.dim1; }
    },
    rectangle: {
      label: 'Rectangle',
      icon: '📐',
      sizes: [
        { label: '7 × 11-inch',   dim1: 7,  dim2: 11 },
        { label: '9 × 13-inch',   dim1: 9,  dim2: 13 },
        { label: '10 × 15-inch',  dim1: 10, dim2: 15 },
        { label: '11 × 15-inch',  dim1: 11, dim2: 15 },
        { label: '13 × 18-inch (half sheet)', dim1: 13, dim2: 18 },
        { label: '18 × 26-inch (full sheet)', dim1: 18, dim2: 26 }
      ],
      areaFn: function(d) { return d.dim1 * d.dim2; }
    },
    loaf: {
      label: 'Loaf',
      icon: '🍞',
      sizes: [
        { label: '8½ × 4½-inch (1 lb)', dim1: 8.5, dim2: 4.5 },
        { label: '9 × 5-inch (1¼ lb)',  dim1: 9,   dim2: 5 },
        { label: '10 × 5-inch (1½ lb)', dim1: 10,  dim2: 5 }
      ],
      areaFn: function(d) { return d.dim1 * d.dim2; }
    },
    springform: {
      label: 'Springform',
      icon: '🔓',
      sizes: [
        { label: '8-inch',  dim1: 8 },
        { label: '9-inch',  dim1: 9 },
        { label: '10-inch', dim1: 10 }
      ],
      areaFn: function(d) { return Math.PI * Math.pow(d.dim1 / 2, 2); }
    },
    cupcake: {
      label: 'Cupcake/Muffin',
      icon: '🧁',
      sizes: [
        { label: 'Mini (1¾-inch)',     dim1: 1.75 },
        { label: 'Standard (2½-inch)', dim1: 2.5 },
        { label: 'Jumbo (3½-inch)',    dim1: 3.5 }
      ],
      areaFn: function(d) { return Math.PI * Math.pow(d.dim1 / 2, 2); }
    },
    bundt: {
      label: 'Bundt / Tube',
      icon: '🎂',
      sizes: [
        { label: '10-inch (10–12 cup)', dim1: 10 },
        { label: '12-inch (12–15 cup)', dim1: 12 }
      ],
      // A bundt pan holds ~70% the batter of a same-diameter round
      // because the central tube displaces volume. We apply 0.70.
      areaFn: function(d) { return Math.PI * Math.pow(d.dim1 / 2, 2) * 0.70; }
    }
  };

  /* ---- Presets: commonly searched pan swaps ---- */
  var PRESETS = [
    { fromShape: 'round', fromSize: 2, fromLabel: '8-inch round',
      toShape: 'round',   toSize: 3,   toLabel: '9-inch round',
      label: '8-inch → 9-inch round', hint: 'Most common swap — need ~25% more batter' },
    { fromShape: 'round', fromSize: 2, fromLabel: '8-inch round',
      toShape: 'round',   toSize: 4,   toLabel: '10-inch round',
      label: '8-inch → 10-inch round', hint: 'NOT 1.25×! Area ratio is 1.56×' },
    { fromShape: 'round', fromSize: 3, fromLabel: '9-inch round',
      toShape: 'round',   toSize: 4,   toLabel: '10-inch round',
      label: '9-inch → 10-inch round', hint: 'Small bump — ~23% more batter' },
    { fromShape: 'round', fromSize: 2, fromLabel: '8-inch round',
      toShape: 'square',  toSize: 2,   toLabel: '9-inch square',
      label: '8-inch round → 9-inch square', hint: 'Round to square — 1.62× factor' },
    { fromShape: 'square', fromSize: 1, fromLabel: '8-inch square',
      toShape: 'round',   toSize: 3,   toLabel: '9-inch round',
      label: '8-inch square → 9-inch round', hint: 'Very close — only 1.12× more batter' },
    { fromShape: 'round', fromSize: 2, fromLabel: '8-inch round',
      toShape: 'rectangle', toSize: 1, toLabel: '9×13-inch',
      label: '8-inch round → 9×13-inch', hint: 'More than double — 2.33× the batter' },
    { fromShape: 'rectangle', fromSize: 1, fromLabel: '9×13-inch',
      toShape: 'rectangle', toSize: 4,   toLabel: '13×18-inch (half sheet)',
      label: '9×13 → half sheet', hint: 'Classic sheet-cake double' }
  ];

  /* ---- DOM refs ---- */
  var fromShapeEl, fromSizeEl, fromCustom1El, fromCustom2El, fromDepthEl;
  var toShapeEl,   toSizeEl,   toCustom1El,   toCustom2El,   toDepthEl;
  var resultEl, resultLabelEl, timeEl, warningEl, presetsEl;

  function $(id) { return document.getElementById(id); }

  /* ---- Initialize ---- */
  function init() {
    fromShapeEl  = $('pan-from-shape');
    fromSizeEl   = $('pan-from-size');
    fromCustom1El = $('pan-from-custom1');
    fromCustom2El = $('pan-from-custom2');
    fromDepthEl  = $('pan-from-depth');
    toShapeEl    = $('pan-to-shape');
    toSizeEl     = $('pan-to-size');
    toCustom1El  = $('pan-to-custom1');
    toCustom2El  = $('pan-to-custom2');
    toDepthEl    = $('pan-to-depth');
    resultEl     = $('pan-result');
    resultLabelEl = $('pan-result-label');
    timeEl       = $('pan-time');
    warningEl    = $('pan-warning');
    presetsEl    = $('pan-presets');

    if (!fromShapeEl) return; // not on pan converter page

    fromShapeEl.addEventListener('change', function() { updateSizes('from'); });
    toShapeEl.addEventListener('change',   function() { updateSizes('to');   });
    fromSizeEl.addEventListener('change',  function() { onSizeChange('from'); });
    toSizeEl.addEventListener('change',    function() { onSizeChange('to');   });

    // Recalculate on any custom dimension or depth change
    var recalcInputs = [fromCustom1El, fromCustom2El, fromDepthEl, toCustom1El, toCustom2El, toDepthEl];
    recalcInputs.forEach(function(el) {
      if (el) el.addEventListener('input', recalc);
    });

    buildPresetButtons();
    updateSizes('from');
    updateSizes('to');
    recalc();
  }

  /* ---- Populate size dropdown for a given shape ---- */
  function updateSizes(side) {
    var shapeEl = side === 'from' ? fromShapeEl : toShapeEl;
    var sizeEl  = side === 'from' ? fromSizeEl  : toSizeEl;
    var shape   = shapeEl.value;
    var data    = SHAPES[shape];
    if (!data) return;

    sizeEl.innerHTML = '';
    data.sizes.forEach(function(s, i) {
      var opt = document.createElement('option');
      opt.value = i;
      opt.textContent = s.label;
      sizeEl.appendChild(opt);
    });

    // Add "Custom" option
    var customOpt = document.createElement('option');
    customOpt.value = 'custom';
    customOpt.textContent = 'Custom size…';
    sizeEl.appendChild(customOpt);

    // Select first real size by default
    sizeEl.value = '0';

    onSizeChange(side);
  }

  /* ---- Show/hide custom dimension fields ---- */
  function onSizeChange(side) {
    var sizeEl    = side === 'from' ? fromSizeEl    : toSizeEl;
    var custom1El = side === 'from' ? fromCustom1El : toCustom1El;
    var custom2El = side === 'from' ? fromCustom2El : toCustom2El;
    var shapeEl   = side === 'from' ? fromShapeEl   : toShapeEl;
    var shape     = shapeEl.value;
    var data      = SHAPES[shape];
    var isCustom  = sizeEl.value === 'custom';

    custom1El.parentElement.style.display = isCustom ? '' : 'none';

    // Show second dimension only for shapes that need it
    if (custom2El) {
      var needsDim2 = (shape === 'rectangle' || shape === 'loaf');
      custom2El.parentElement.style.display = (isCustom && needsDim2) ? '' : 'none';
    }

    recalc();
  }

  /* ---- Get dimensions for a side (from or to) ---- */
  function getDimensions(side) {
    var shapeEl   = side === 'from' ? fromShapeEl   : toShapeEl;
    var sizeEl    = side === 'from' ? fromSizeEl    : toSizeEl;
    var custom1El = side === 'from' ? fromCustom1El : toCustom1El;
    var custom2El = side === 'from' ? fromCustom2El : toCustom2El;
    var depthEl   = side === 'from' ? fromDepthEl   : toDepthEl;
    var shape     = shapeEl.value;
    var data      = SHAPES[shape];
    var isCustom  = sizeEl.value === 'custom';

    var dims;
    if (isCustom) {
      var d1 = parseFloat(custom1El.value) || 0;
      var d2 = custom2El ? (parseFloat(custom2El.value) || 0) : 0;
      dims = { dim1: d1, dim2: d2, custom: true };
    } else {
      var idx = parseInt(sizeEl.value, 10);
      if (isNaN(idx) || idx >= data.sizes.length) idx = 0;
      dims = data.sizes[idx];
      dims.custom = false;
    }

    dims.shape = shape;
    dims.depth = parseFloat(depthEl.value) || 2;
    dims.area  = data.areaFn(dims);
    dims.volume = dims.area * dims.depth;

    return dims;
  }

  /* ---- Main calculation ---- */
  function recalc() {
    var from = getDimensions('from');
    var to   = getDimensions('to');

    if (from.area <= 0 || to.area <= 0) {
      resultEl.textContent = '—';
      resultLabelEl.textContent = 'Enter valid pan dimensions';
      timeEl.textContent = '';
      warningEl.style.display = 'none';
      return;
    }

    var areaFactor   = to.area / from.area;
    var volumeFactor = to.volume / from.volume;
    var depthChange  = to.depth / from.depth;

    // Effective factor: if depths differ, adjust. Default: same depth assumed.

    // For display, use area ratio (what bakers care about)
    var factor = areaFactor;

    // Format factor
    var factorStr;
    if (factor < 0.1) {
      factorStr = (factor * 100).toFixed(0) + '%'; // tiny
    } else if (factor < 1) {
      factorStr = factor.toFixed(2) + '×';
    } else {
      factorStr = factor.toFixed(2) + '×';
    }

    resultEl.textContent = factorStr;

    // Plain English explanation
    var fromName = panName(from);
    var toName   = panName(to);
    var pctDiff   = Math.abs((factor - 1) * 100);

    var label = '';
    if (factor >= 0.99 && factor <= 1.01) {
      label = 'These pans hold essentially the same amount of batter. No scaling needed — use your recipe as written.';
    } else if (factor < 1) {
      label = 'You need ' + pctDiff.toFixed(0) + '% LESS batter for the ' + toName + '. If scaling down from a ' + fromName + ': multiply all ingredients by ' + factor.toFixed(2) + '.';
    } else {
      label = 'You need ' + pctDiff.toFixed(0) + '% MORE batter for the ' + toName + '. Multiply all ingredients by ' + factor.toFixed(2) + '.';
    }

    // Add practical note for very large or small factors
    if (factor > 2.5) {
      label += ' That\'s more than 2½× the original — consider splitting into two pans rather than one very deep one.';
    } else if (factor < 0.4) {
      label += ' That\'s a big reduction. If the original recipe uses a single egg, you may need to beat an egg and weigh out a fraction — see our egg weight guide.';
    }

    resultLabelEl.textContent = label;

    // Bake time estimate
    var timeText = estimateBakeTime(from, to, factor, depthChange);
    timeEl.textContent = timeText;

    // Warning for extreme cases
    if (factor > 3.0 || factor < 0.25) {
      warningEl.style.display = '';
      warningEl.querySelector('span').textContent =
        factor > 3.0
          ? 'This is a very large pan size jump. For best results, split the batter into multiple pans of the original size rather than one mega-pan. A cake baked in a pan 3× too large will be paper-thin and dry out before the center sets.'
          : 'This is a very small target pan. The batter will be deep and take substantially longer to bake. Reduce the oven temperature by 25°F to prevent the top from burning before the center cooks through.';
    } else {
      warningEl.style.display = 'none';
    }
  }

  /* ---- Human-readable pan name ---- */
  function panName(dims) {
    var data = SHAPES[dims.shape];
    if (!data) return 'unknown';
    if (dims.custom) {
      if (dims.dim2 > 0) return dims.dim1 + '×' + dims.dim2 + '-inch ' + data.label.toLowerCase();
      return dims.dim1 + '-inch ' + data.label.toLowerCase();
    }
    return dims.label + ' ' + data.label.toLowerCase();
  }

  /* ---- Bake time estimation ---- */
  function estimateBakeTime(from, to, factor, depthChange) {
    // Batter depth ratio when using the same recipe (not scaled)
    // If we scale the recipe to match area, depth stays the same → same time
    // If we use the SAME recipe in a LARGER pan → shallower → faster
    // If we use the SAME recipe in a SMALLER pan → deeper → slower

    // depthChange compares pan depths (e.g., 3" deep pan vs 2" pan)
    // For same-depth pans: effective depth ∝ 1/factor (same batter in larger area = shallower)
    var effectiveDepthRatio = depthChange / factor;

    if (effectiveDepthRatio >= 0.9 && effectiveDepthRatio <= 1.1) {
      return 'Bake time: roughly the same as the original recipe. Batter depth is similar.';
    } else if (effectiveDepthRatio > 1.1) {
      var pct = ((effectiveDepthRatio - 1) * 100).toFixed(0);
      return 'Bake time: expect it to take LONGER than the original. Batter will be about ' + pct + '% deeper — start checking 5–10 minutes after the original time, and expect it to need 10–25% more time total. Use the toothpick test.';
    } else {
      var shallower = ((1 - effectiveDepthRatio) * 100).toFixed(0);
      return 'Bake time: expect it to be SHORTER than the original. Batter will be about ' + shallower + '% shallower — start checking 5–10 minutes BEFORE the original time. Thin batter bakes fast and can go from done to overbaked in under a minute.';
    }
  }

  /* ---- Quick preset buttons ---- */
  function buildPresetButtons() {
    if (!presetsEl) return;
    presetsEl.innerHTML = '<span class="quick-scale-label">Quick:</span>';
    PRESETS.forEach(function(p, i) {
      var btn = document.createElement('button');
      btn.className = 'btn-scale-quick';
      btn.textContent = p.label;
      btn.title = p.hint;
      btn.addEventListener('click', function() { applyPreset(i); });
      presetsEl.appendChild(btn);
    });
  }

  function applyPreset(idx) {
    var p = PRESETS[idx];
    if (!p) return;

    // Set from shape and size
    fromShapeEl.value = p.fromShape;
    updateSizes('from');
    fromSizeEl.value = String(p.fromSize);
    onSizeChange('from');

    // Set to shape and size
    toShapeEl.value = p.toShape;
    updateSizes('to');
    toSizeEl.value = String(p.toSize);
    onSizeChange('to');

    recalc();

    // Scroll to result on mobile
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ---- Print result ---- */
  function printResult() {
    var from = getDimensions('from');
    var to   = getDimensions('to');
    var factor = to.area / from.area;

    var lines = [];
    lines.push('Pan Size Conversion — BakeCalc Club');
    lines.push('====================================');
    lines.push('');
    lines.push('From: ' + panName(from) + ' (area: ~' + from.area.toFixed(1) + ' sq in)');
    lines.push('To:   ' + panName(to)   + ' (area: ~' + to.area.toFixed(1)   + ' sq in)');
    lines.push('');
    lines.push('Scale Factor: ' + factor.toFixed(2) + '×');

    if (factor >= 0.99 && factor <= 1.01) {
      lines.push('These pans are equivalent — no recipe changes needed.');
    } else {
      lines.push('Multiply every ingredient amount by ' + factor.toFixed(2) + '.');
    }
    lines.push('');
    lines.push(resultLabelEl.textContent);
    lines.push(timeEl.textContent);
    lines.push('');
    lines.push('— Brought to you by BakeCalc Club (bakecalc.club)');

    var blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'pan-conversion-' + panName(from).replace(/[^a-z0-9]+/gi, '-') + '-to-' + panName(to).replace(/[^a-z0-9]+/gi, '-') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ---- Expose public API ---- */
  window.PanConverter = {
    recalc: recalc,
    printResult: printResult,
    applyPreset: applyPreset
  };

  /* ---- Kick off ---- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
