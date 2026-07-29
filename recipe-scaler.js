/* ============================================================
   BakeCalc Club — Recipe Scaler
   Scale any baking recipe up or down. Zero dependencies.
   All data stays in localStorage.
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

  /* ---- Pan Preset Database ---- */
  var PAN_PRESETS = [
    { label: '— Custom (enter manually) —',           factor: 0,   group: '' },
    { label: '6-inch round → 8-inch round',            factor: 1.78, group: 'Round Pans' },
    { label: '8-inch round → 9-inch round',            factor: 1.27, group: 'Round Pans' },
    { label: '8-inch round → 10-inch round',           factor: 1.56, group: 'Round Pans' },
    { label: '9-inch round → 10-inch round',           factor: 1.23, group: 'Round Pans' },
    { label: '6-inch round → 9-inch round',            factor: 2.25, group: 'Round Pans' },
    { label: '6-inch round → 10-inch round',           factor: 2.78, group: 'Round Pans' },
    { label: '8-inch square → 9-inch square',          factor: 1.27, group: 'Square Pans' },
    { label: '8-inch round → 8-inch square',           factor: 1.27, group: 'Round ↔ Square' },
    { label: '9-inch round → 9-inch square',           factor: 1.27, group: 'Round ↔ Square' },
    { label: '8-inch round → 9×13-inch sheet',         factor: 2.33, group: 'Sheet Pans' },
    { label: '9×13-inch → half sheet (13×18-inch)',    factor: 2.0,  group: 'Sheet Pans' },
    { label: '8×8-inch → 9×13-inch',                   factor: 1.83, group: 'Sheet Pans' },
    { label: '8×4-inch loaf → 9×5-inch loaf',          factor: 1.42, group: 'Loaf Pans' }
  ];

  /* ---- Ingredient name suggestions ---- */
  var INGREDIENT_NAMES = [
    'All-Purpose Flour', 'Bread Flour', 'Cake Flour', 'Whole Wheat Flour',
    'Granulated Sugar', 'Brown Sugar (packed)', 'Powdered Sugar',
    'Butter (unsalted)', 'Vegetable Oil', 'Coconut Oil',
    'Eggs (large)', 'Egg Whites', 'Egg Yolks',
    'Milk (whole)', 'Heavy Cream', 'Buttermilk', 'Sour Cream', 'Yogurt (plain)',
    'Vanilla Extract', 'Almond Extract',
    'Baking Powder', 'Baking Soda', 'Salt',
    'Cocoa Powder', 'Chocolate Chips', 'Cornstarch',
    'Honey', 'Maple Syrup',
    'Rolled Oats', 'Almond Flour'
  ];

  /* ---- Default demo recipe: Classic Vanilla Cake (8-inch, 2 layers, ~12 servings) ---- */
  var DEFAULT_INGREDIENTS = [
    { name: 'All-Purpose Flour',    amount: 2.5,  unit: 'cups' },
    { name: 'Granulated Sugar',     amount: 1.5,  unit: 'cups' },
    { name: 'Butter (unsalted)',    amount: 0.75, unit: 'cups' },
    { name: 'Eggs (large)',         amount: 3,    unit: 'pcs'  },
    { name: 'Milk (whole)',         amount: 1,    unit: 'cups' },
    { name: 'Vanilla Extract',      amount: 2,    unit: 'tsp'  },
    { name: 'Baking Powder',        amount: 2.5,  unit: 'tsp'  },
    { name: 'Salt',                 amount: 0.5,  unit: 'tsp'  }
  ];

  var DEFAULT_SETTINGS = {
    recipeName: 'Classic Vanilla Cake (8-inch, 2 layers)',
    originalYield: 12,
    targetYield: 24
  };

  var STORAGE_KEY = 'bakecalc_recipe_scaler_state';

  /* ---- DOM refs ---- */
  var $ = function (id) { return document.getElementById(id); };

  /* ---- State ---- */
  var state = loadState();

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s.ingredients && s.ingredients.length && s.settings) return s;
      }
    } catch (e) { /* ignore */ }
    return {
      ingredients: JSON.parse(JSON.stringify(DEFAULT_INGREDIENTS)),
      settings:   JSON.parse(JSON.stringify(DEFAULT_SETTINGS))
    };
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* ignore */ }
  }

  /* ---- Smart fraction formatting ---- */

  /**
   * Map a decimal cup value to a friendly fraction string.
   * Returns '' if no clean fraction match (caller should fall back to decimal).
   */
  function cupsToFractionStr(decimal) {
    var r = Math.round(decimal * 100) / 100;
    if (r <= 0) return '';

    if (r >= 0.10 && r <= 0.14) return '⅛ cup';
    if (r >= 0.23 && r <= 0.27) return '¼ cup';
    if (r >= 0.31 && r <= 0.35) return '⅓ cup';
    if (r >= 0.36 && r <= 0.42) return 'scant ½ cup';
    if (r >= 0.45 && r <= 0.55) return '½ cup';
    if (r >= 0.58 && r <= 0.63) return '⅔ cup';
    if (r >= 0.71 && r <= 0.79) return '¾ cup';
    if (r >= 0.96 && r <= 1.05) return '1 cup';

    if (r >= 1.06 && r <= 1.20) return '1 ⅛ cups';
    if (r >= 1.21 && r <= 1.30) return '1 ¼ cups';
    if (r >= 1.31 && r <= 1.40) return '1 ⅓ cups';
    if (r >= 1.45 && r <= 1.55) return '1 ½ cups';
    if (r >= 1.56 && r <= 1.63) return '1 ⅔ cups';
    if (r >= 1.71 && r <= 1.79) return '1 ¾ cups';
    if (r >= 1.96 && r <= 2.05) return '2 cups';

    if (r >= 2.06 && r <= 2.20) return '2 ⅛ cups';
    if (r >= 2.21 && r <= 2.30) return '2 ¼ cups';
    if (r >= 2.31 && r <= 2.40) return '2 ⅓ cups';
    if (r >= 2.45 && r <= 2.55) return '2 ½ cups';
    if (r >= 2.56 && r <= 2.75) return '2 ⅔ cups';
    if (r >= 2.76 && r <= 2.90) return '2 ¾ cups';
    if (r >= 2.91 && r <= 3.10) return '3 cups';

    if (r >= 3.21 && r <= 3.30) return '3 ¼ cups';
    if (r >= 3.45 && r <= 3.55) return '3 ½ cups';
    if (r >= 3.71 && r <= 3.79) return '3 ¾ cups';
    if (r >= 3.91 && r <= 4.10) return '4 cups';

    return ''; // no clean fraction — caller should fall back to decimal
  }

  /**
   * Format a tbsp value into a friendlier compound display.
   * e.g. 4 tbsp → "¼ cup", 5 tbsp → "¼ cup + 1 tbsp", 16 tbsp → "1 cup"
   */
  function tbspToCompoundStr(tbsp) {
    var r = Math.round(tbsp * 100) / 100;
    if (r < 0.05) return '0 tbsp';
    if (r < 0.5) return Math.round(r * 10) / 10 + ' tbsp';

    // Below 3 tbsp, keep it simple
    if (r < 3) {
      var wholeTbsp = Math.round(r);
      if (Math.abs(r - wholeTbsp) < 0.1) return wholeTbsp + ' tbsp';
      return r.toFixed(1) + ' tbsp';
    }

    // 3+ tbsp → try to convert to tbsp + tsp or cups
    if (r < 4) return Math.round(r * 10) / 10 + ' tbsp';

    // 4 tbsp = ¼ cup
    var cups = Math.floor(r / 16);
    var remainingTbsp = Math.round((r % 16) * 10) / 10;

    if (cups >= 1 && remainingTbsp < 0.5) {
      return cupsToFractionStr(cups) || (cups + ' cup' + (cups > 1 ? 's' : ''));
    }

    // Try to convert remaining tbsp to cup fractions
    if (remainingTbsp >= 3.7 && remainingTbsp <= 4.3) {
      var cupPart = cups + 0.25;
      return cupsToFractionStr(cupPart) || (cupPart.toFixed(2) + ' cups');
    }
    if (remainingTbsp >= 7.7 && remainingTbsp <= 8.3) {
      var cupPart2 = cups + 0.5;
      return cupsToFractionStr(cupPart2) || (cupPart2.toFixed(2) + ' cups');
    }
    if (remainingTbsp >= 11.7 && remainingTbsp <= 12.3) {
      var cupPart3 = cups + 0.75;
      return cupsToFractionStr(cupPart3) || (cupPart3.toFixed(2) + ' cups');
    }

    if (cups >= 1) {
      var cupStr = cupsToFractionStr(cups) || (cups + ' cup' + (cups > 1 ? 's' : ''));
      if (remainingTbsp < 0.5) return cupStr;
      return cupStr + ' + ' + remainingTbsp + ' tbsp';
    }

    // No full cups — just show tbsp
    return r.toFixed(1) + ' tbsp';
  }

  /**
   * Format a tsp value into a friendlier compound display.
   * 3 tsp = 1 tbsp, so >= 3 convert to tbsp + tsp.
   */
  function tspToCompoundStr(tsp) {
    var r = Math.round(tsp * 100) / 100;
    if (r < 0.05) return '0 tsp';
    if (r < 0.5) {
      // Show fractions for common small amounts
      if (r >= 0.21 && r <= 0.28) return '¼ tsp';
      if (r >= 0.45 && r <= 0.55) return '½ tsp';
      if (r >= 0.71 && r <= 0.78) return '¾ tsp';
      return Math.round(r * 10) / 10 + ' tsp';
    }

    if (r < 3) {
      var whole2 = Math.round(r);
      if (Math.abs(r - whole2) < 0.1) return whole2 + ' tsp';
      return r.toFixed(1) + ' tsp';
    }

    // 3+ tsp → convert to tbsp + tsp
    var tbsp = Math.floor(r / 3);
    var remainingTsp = Math.round((r % 3) * 10) / 10;

    if (remainingTsp < 0.3) return tbsp + ' tbsp';
    return tbsp + ' tbsp + ' + remainingTsp + ' tsp';
  }

  /**
   * Main entry point: format a scaled amount with unit-aware smart display.
   */
  function formatScaledAmount(amount, unit) {
    if (amount <= 0) return '0 ' + unit;

    var u = (unit || '').toLowerCase();

    // --- Eggs / pieces ---
    if (u === 'pcs' || u === 'eggs' || u === 'pc' || u === 'pieces') {
      if (amount < 0.3) return 'use ' + amount.toFixed(1) + ' egg (weigh beaten egg)';
      if (Math.abs(amount - Math.round(amount)) < 0.05) return Math.round(amount) + ' eggs';
      var grams = Math.round(amount * 50); // ~50g per large egg out of shell
      return '≈ ' + amount.toFixed(1) + ' eggs (' + grams + 'g beaten egg)';
    }

    // --- Cups ---
    if (u === 'cups' || u === 'cup') {
      var frac = cupsToFractionStr(amount);
      if (frac) return frac;
      if (amount < 0.5) return '≈ ' + amount.toFixed(2) + ' cups';
      return '≈ ' + amount.toFixed(2) + ' cups';
    }

    // --- Tbsp ---
    if (u === 'tbsp' || u === 'tablespoon' || u === 'tablespoons') {
      return tbspToCompoundStr(amount);
    }

    // --- Tsp ---
    if (u === 'tsp' || u === 'teaspoon' || u === 'teaspoons') {
      return tspToCompoundStr(amount);
    }

    // --- Grams ---
    if (u === 'g' || u === 'grams' || u === 'gram') {
      if (amount < 10) return (Math.round(amount * 10) / 10) + ' g';
      return Math.round(amount) + ' g';
    }

    // --- mL ---
    if (u === 'ml' || u === 'milliliters' || u === 'milliliter') {
      if (amount < 10) return (Math.round(amount * 10) / 10) + ' ml';
      return Math.round(amount) + ' ml';
    }

    // --- oz ---
    if (u === 'oz' || u === 'ounces' || u === 'ounce') {
      if (Math.abs(amount - Math.round(amount)) < 0.1) return Math.round(amount) + ' oz';
      return (Math.round(amount * 10) / 10) + ' oz';
    }

    // --- Generic / fallback ---
    if (Math.abs(amount - Math.round(amount)) < 0.05) return Math.round(amount) + ' ' + unit;
    return (Math.round(amount * 100) / 100) + ' ' + unit;
  }

  /* ---- Build pan preset <option> list ---- */
  function buildPresetOptions(selectedFactor) {
    var html = '';
    var currentGroup = '';
    for (var i = 0; i < PAN_PRESETS.length; i++) {
      var p = PAN_PRESETS[i];
      if (p.group && p.group !== currentGroup) {
        if (currentGroup !== '') html += '</optgroup>';
        html += '<optgroup label="' + p.group + '">';
        currentGroup = p.group;
      }
      var sel = (p.factor > 0 && Math.abs(p.factor - selectedFactor) < 0.005) ? ' selected' : '';
      html += '<option value="' + i + '" data-factor="' + p.factor + '"' + sel + '>' + p.label + '</option>';
    }
    if (currentGroup !== '') html += '</optgroup>';
    return html;
  }

  /* ---- Build ingredient name datalist ---- */
  function buildDatalist() {
    var html = '';
    for (var i = 0; i < INGREDIENT_NAMES.length; i++) {
      html += '<option value="' + INGREDIENT_NAMES[i] + '">';
    }
    return html;
  }

  /* ---- Render a single ingredient row ---- */
  function renderIngredientRow(ing, idx) {
    var scaled = ing.amount * getScaleFactor();
    return '<tr class="ingredient-row" data-idx="' + idx + '">'
      + '<td class="cell-name">'
      + '<input type="text" class="ing-name" value="' + escAttr(ing.name) + '"'
      + ' list="ingredient-names" placeholder="Ingredient name"'
      + ' oninput="RecipeScaler.onIngredientChange(this,' + idx + ",'name')\">"
      + '</td>'
      + '<td class="cell-qty">'
      + '<input type="number" class="ing-amount" value="' + ing.amount + '" min="0" step="any"'
      + ' oninput="RecipeScaler.onIngredientChange(this,' + idx + ",'amount')\" placeholder=\"0\">"
      + '</td>'
      + '<td class="cell-unit">'
      + '<select class="ing-unit" onchange="RecipeScaler.onIngredientChange(this,' + idx + ",'unit')\">"
      + '<option value="cups"'  + (ing.unit === 'cups'  ? ' selected' : '') + '>cups</option>'
      + '<option value="tbsp"'  + (ing.unit === 'tbsp'  ? ' selected' : '') + '>tbsp</option>'
      + '<option value="tsp"'   + (ing.unit === 'tsp'   ? ' selected' : '') + '>tsp</option>'
      + '<option value="g"'     + (ing.unit === 'g'     ? ' selected' : '') + '>grams</option>'
      + '<option value="ml"'    + (ing.unit === 'ml'    ? ' selected' : '') + '>ml</option>'
      + '<option value="oz"'    + (ing.unit === 'oz'    ? ' selected' : '') + '>oz</option>'
      + '<option value="pcs"'   + (ing.unit === 'pcs'   ? ' selected' : '') + '>pcs</option>'
      + '</select>'
      + '</td>'
      + '<td class="cell-scaled">' + formatScaledAmount(scaled, ing.unit) + '</td>'
      + '<td class="cell-del">'
      + '<button class="btn-row-del" onclick="RecipeScaler.removeRow(' + idx + ')" title="Remove">&times;</button>'
      + '</td>'
      + '</tr>';
  }

  function renderAllRows() {
    var tbody = $('ingredients-body');
    if (!tbody) return;

    // Populate datalist on first render (element is in the HTML, empty until now)
    var dl = $('ingredient-names');
    if (dl && !dl.children.length) {
      dl.innerHTML = buildDatalist();
    }

    var html = '';
    for (var i = 0; i < state.ingredients.length; i++) {
      html += renderIngredientRow(state.ingredients[i], i);
    }
    tbody.innerHTML = html;
  }

  function escAttr(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ---- Scale factor ---- */
  function getScaleFactor() {
    var origEl = $('original-yield');
    var targEl = $('target-yield');
    var orig = Math.max(
      (origEl ? parseFloat(origEl.value) : NaN) || state.settings.originalYield || 1,
      0.1
    );
    var target = Math.max(
      (targEl ? parseFloat(targEl.value) : NaN) || state.settings.targetYield || 1,
      0.1
    );
    return target / orig;
  }

  /* ---- Egg detection ---- */
  function hasFractionalEggs(factor) {
    for (var i = 0; i < state.ingredients.length; i++) {
      var ing = state.ingredients[i];
      var u = (ing.unit || '').toLowerCase();
      if (u === 'pcs' || u === 'eggs' || u === 'pc') {
        var name = (ing.name || '').toLowerCase();
        if (name.indexOf('egg') !== -1 || u === 'eggs') {
          var scaled = ing.amount * factor;
          var frac = scaled - Math.floor(scaled);
          if (frac > 0.08 && frac < 0.92) return scaled;
        }
      }
    }
    return 0;
  }

  /* ---- Render results summary ---- */
  function renderSummary() {
    var factor = getScaleFactor();
    var summaryBody = $('summary-body');
    if (!summaryBody) return;
    var html = '';
    for (var i = 0; i < state.ingredients.length; i++) {
      var ing = state.ingredients[i];
      if (!ing.name && ing.amount <= 0) continue;
      var scaled = ing.amount * factor;
      var originalStr = ing.amount + ' ' + ing.unit;
      html += '<tr>'
        + '<td>' + escAttr(ing.name || '—') + '</td>'
        + '<td>' + originalStr + '</td>'
        + '<td style="font-weight:600;color:var(--primary);">' + formatScaledAmount(scaled, ing.unit) + '</td>'
        + '</tr>';
    }
    summaryBody.innerHTML = html;
  }

  /* ---- Update UI displays ---- */
  function updateDisplay() {
    var factor = getScaleFactor();

    // Scale factor badge (inline + summary — both must update)
    var factorText = (factor >= 0.97 && factor <= 1.03) ? '1× (unchanged)' : factor.toFixed(2) + '×';
    var sfInline = $('val-scale-factor-inline');
    if (sfInline) sfInline.textContent = factorText;
    var sfSummary = $('val-scale-factor');
    if (sfSummary) sfSummary.textContent = factorText;

    // Yield summary
    var ysDisplay = $('val-yield-summary');
    if (ysDisplay) {
      var orig = Math.max(parseFloat($('original-yield').value) || state.settings.originalYield || 1, 0.1);
      var target = Math.max(parseFloat($('target-yield').value) || state.settings.targetYield || 1, 0.1);
      ysDisplay.textContent = orig + ' → ' + target + ' servings';
    }

    // Egg warning
    var eggWarn = $('egg-warning');
    if (eggWarn) {
      var fracEggs = hasFractionalEggs(factor);
      if (fracEggs > 0) {
        eggWarn.style.display = '';
        var qtyEl = $('egg-warning-qty');
        if (qtyEl) qtyEl.textContent = fracEggs.toFixed(1) + ' eggs';
        var gramEl = $('egg-warning-grams');
        if (gramEl) gramEl.textContent = Math.round(fracEggs * 50) + 'g';
      } else {
        eggWarn.style.display = 'none';
      }
    }
  }

  /* ---- Public API (exposed to onclick handlers) ---- */
  window.RecipeScaler = {

    init: function () {
      // Populate settings
      $('original-yield').value = state.settings.originalYield;
      $('target-yield').value = state.settings.targetYield;

      // Build pan preset dropdown
      var presetSel = $('pan-preset');
      if (presetSel) {
        presetSel.innerHTML = buildPresetOptions(0);
      }

      renderAllRows();
      this.recalc();

      // Attach input listeners to yield fields
      var self = this;
      var yieldFields = ['original-yield', 'target-yield'];
      for (var i = 0; i < yieldFields.length; i++) {
        var el = $(yieldFields[i]);
        if (el) {
          el.addEventListener('input', function () { self.onYieldChange(); });
        }
      }

      // Pan preset change listener
      var presetEl = $('pan-preset');
      if (presetEl) {
        presetEl.addEventListener('change', function () { self.onPresetChange(); });
      }
    },

    onYieldChange: function () {
      var origEl = $('original-yield');
      var targEl = $('target-yield');
      state.settings.originalYield = parseFloat(origEl.value) || 1;
      state.settings.targetYield = parseFloat(targEl.value) || 1;
      if (state.settings.originalYield < 0.1) state.settings.originalYield = 0.1;
      if (state.settings.targetYield < 0.1) state.settings.targetYield = 0.1;
      saveState();
      this.recalc();
    },

    onPresetChange: function () {
      var sel = $('pan-preset');
      if (!sel) return;
      var idx = parseInt(sel.value, 10);
      if (isNaN(idx)) return;
      var preset = PAN_PRESETS[idx];
      if (!preset || preset.factor <= 0) return;

      var orig = Math.max(state.settings.originalYield || 1, 0.1);
      var newTarget = Math.round(orig * preset.factor * 10) / 10;
      $('target-yield').value = newTarget;
      state.settings.targetYield = newTarget;
      saveState();
      this.recalc();
    },

    onIngredientChange: function (input, idx, field) {
      if (idx < 0 || idx >= state.ingredients.length) return;
      if (field === 'amount') {
        state.ingredients[idx].amount = parseFloat(input.value) || 0;
      } else if (field === 'name') {
        state.ingredients[idx].name = input.value;
      } else if (field === 'unit') {
        state.ingredients[idx].unit = input.value;
      }
      saveState();
      this.recalc();
    },

    quickScale: function (factor) {
      var orig = Math.max(state.settings.originalYield || 1, 0.1);
      state.settings.targetYield = Math.round(orig * factor * 10) / 10;
      $('target-yield').value = state.settings.targetYield;
      saveState();
      this.recalc();
    },

    addRow: function () {
      state.ingredients.push({ name: '', amount: 0, unit: 'cups' });
      renderAllRows();
      saveState();
      this.recalc();
    },

    removeRow: function (idx) {
      if (state.ingredients.length <= 1) return;
      state.ingredients.splice(idx, 1);
      renderAllRows();
      saveState();
      this.recalc();
    },

    recalc: function () {
      var factor = getScaleFactor();

      // Update each visible row's scaled cell
      var rows = document.querySelectorAll('.ingredient-row');
      for (var i = 0; i < rows.length; i++) {
        if (i >= state.ingredients.length) break;
        var ing = state.ingredients[i];
        var scaled = ing.amount * factor;
        var cell = rows[i].querySelector('.cell-scaled');
        if (cell) {
          cell.textContent = formatScaledAmount(scaled, ing.unit);
        }
      }

      updateDisplay();
      renderSummary();
    },

    resetAll: function () {
      if (!confirm('Clear all ingredients and restore the demo recipe?')) return;
      state = {
        ingredients: JSON.parse(JSON.stringify(DEFAULT_INGREDIENTS)),
        settings:   JSON.parse(JSON.stringify(DEFAULT_SETTINGS))
      };
      localStorage.removeItem(STORAGE_KEY);
      $('original-yield').value = DEFAULT_SETTINGS.originalYield;
      $('target-yield').value = DEFAULT_SETTINGS.targetYield;
      renderAllRows();
      this.recalc();
    },

    printRecipe: function () {
      var factor = getScaleFactor();
      var name = state.settings.recipeName || 'Recipe';
      var orig = Math.max(state.settings.originalYield, 1);
      var target = Math.max(state.settings.targetYield, 1);

      var ingRows = '';
      for (var i = 0; i < state.ingredients.length; i++) {
        var ing = state.ingredients[i];
        if (!ing.name && ing.amount <= 0) continue;
        var scaled = ing.amount * factor;
        ingRows += '<tr><td>' + escAttr(ing.name || '—') + '</td>'
          + '<td>' + formatScaledAmount(scaled, ing.unit) + '</td>'
          + '<td style="color:var(--text-muted);font-size:0.85rem;">(was ' + ing.amount + ' ' + ing.unit + ')</td>'
          + '</tr>';
      }

      var card = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>'
        + escAttr(name) + ' (Scaled) — BakeCalc Club</title>'
        + '<style>'
        + 'body{font-family:Georgia,serif;color:#2c1e0f;max-width:600px;margin:40px auto;padding:0 20px;line-height:1.6}'
        + 'h1{color:#c7733e;border-bottom:2px solid #f0e4d4;padding-bottom:8px;margin-bottom:4px}'
        + 'h2{color:#9e4f28;font-size:1.1rem;margin:24px 0 8px}'
        + 'table{width:100%;border-collapse:collapse;margin:12px 0}'
        + 'th,td{padding:8px 10px;text-align:left;border-bottom:1px solid #f0e4d4}'
        + 'th{color:#7a6a5c;font-size:0.85rem;font-weight:600;text-transform:uppercase}'
        + '.meta{color:#7a6a5c;font-size:0.9rem;margin:4px 0}'
        + '.footer{text-align:center;color:#a89888;font-size:0.8rem;margin-top:40px;border-top:1px solid #f0e4d4;padding-top:16px}'
        + '@media print{body{margin:20px auto}}'
        + '</style></head><body>'
        + '<h1>' + escAttr(name) + ' <span style="font-size:0.7em;font-weight:normal;color:#a89888;">(Scaled ' + factor.toFixed(2) + '×)</span></h1>'
        + '<p class="meta">Servings: ' + orig + ' → <strong>' + target + '</strong> &nbsp;|&nbsp; Scale factor: <strong>' + factor.toFixed(2) + '×</strong></p>'
        + '<h2>Ingredients</h2>'
        + '<table><thead><tr><th>Ingredient</th><th>Scaled Amount</th><th>Original</th></tr></thead><tbody>'
        + ingRows
        + '</tbody></table>'
        + '<p class="footer">Generated by BakeCalc Club — bakecalc.club/recipe-scaler</p>'
        + '</body></html>';

      var w = window.open('', '_blank', 'width=700,height=800');
      if (w) {
        w.document.write(card);
        w.document.close();
      }
    }
  };

  /* ---- Boot ---- */
  document.addEventListener('DOMContentLoaded', function () {
    RecipeScaler.init();
  });

})();
