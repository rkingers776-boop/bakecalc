/* ============================================================
   BakeCalc Club — Baker's Percentage Calculator
   Two modes: Recipe → Percentages  |  Percentages → Recipe
   Zero dependencies. All data stays in localStorage.
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

  /* ---- Shortcut ---- */
  var $ = function (id) { return document.getElementById(id); };

  /* ================================================================
     PRESET RECIPES — classic bread formulas, research-backed
     ================================================================ */
  var PRESETS = [
    {
      name: 'Classic Baguette',
      desc: '65% hydration, lean',
      flourWeight: 500,
      ingredients: [
        { name: 'Bread Flour',        amount: 500,  percentage: 100,  isFlour: true,  category: 'flour' },
        { name: 'Water',              amount: 325,  percentage: 65,   isFlour: false, category: 'liquid' },
        { name: 'Salt',               amount: 10,   percentage: 2,    isFlour: false, category: 'other' },
        { name: 'Instant Yeast',      amount: 2.5,  percentage: 0.5,  isFlour: false, category: 'other' }
      ]
    },
    {
      name: 'Sourdough Boule',
      desc: '66% hydration + 20% starter',
      flourWeight: 500,
      ingredients: [
        { name: 'Bread Flour',        amount: 450,  percentage: 90,   isFlour: true,  category: 'flour' },
        { name: 'Whole Wheat Flour',  amount: 50,   percentage: 10,   isFlour: true,  category: 'flour' },
        { name: 'Water',              amount: 330,  percentage: 66,   isFlour: false, category: 'liquid' },
        { name: 'Sourdough Starter',  amount: 100,  percentage: 20,   isFlour: false, category: 'other' },
        { name: 'Salt',               amount: 10,   percentage: 2,    isFlour: false, category: 'other' }
      ]
    },
    {
      name: 'Pizza Dough (Same-Day)',
      desc: '62% hydration, 3% oil',
      flourWeight: 500,
      ingredients: [
        { name: 'Bread Flour',        amount: 500,  percentage: 100,  isFlour: true,  category: 'flour' },
        { name: 'Water',              amount: 310,  percentage: 62,   isFlour: false, category: 'liquid' },
        { name: 'Olive Oil',          amount: 15,   percentage: 3,    isFlour: false, category: 'fat' },
        { name: 'Salt',               amount: 10,   percentage: 2,    isFlour: false, category: 'other' },
        { name: 'Instant Yeast',      amount: 3,    percentage: 0.6,  isFlour: false, category: 'other' },
        { name: 'Sugar',              amount: 5,    percentage: 1,    isFlour: false, category: 'sugar' }
      ]
    },
    {
      name: 'Focaccia',
      desc: '78% hydration, 8% oil',
      flourWeight: 500,
      ingredients: [
        { name: 'Bread Flour',        amount: 500,  percentage: 100,  isFlour: true,  category: 'flour' },
        { name: 'Water',              amount: 390,  percentage: 78,   isFlour: false, category: 'liquid' },
        { name: 'Olive Oil',          amount: 40,   percentage: 8,    isFlour: false, category: 'fat' },
        { name: 'Salt',               amount: 10,   percentage: 2,    isFlour: false, category: 'other' },
        { name: 'Instant Yeast',      amount: 3,    percentage: 0.6,  isFlour: false, category: 'other' }
      ]
    },
    {
      name: 'Brioche',
      desc: '50% butter, 30% egg — rich',
      flourWeight: 500,
      ingredients: [
        { name: 'Bread Flour',        amount: 500,  percentage: 100,  isFlour: true,  category: 'flour' },
        { name: 'Butter (unsalted)',  amount: 250,  percentage: 50,   isFlour: false, category: 'fat' },
        { name: 'Eggs (beaten)',      amount: 150,  percentage: 30,   isFlour: false, category: 'other' },
        { name: 'Milk (whole)',       amount: 150,  percentage: 30,   isFlour: false, category: 'liquid' },
        { name: 'Sugar',              amount: 50,   percentage: 10,   isFlour: false, category: 'sugar' },
        { name: 'Instant Yeast',      amount: 10,   percentage: 2,    isFlour: false, category: 'other' },
        { name: 'Salt',               amount: 8,    percentage: 1.6,  isFlour: false, category: 'other' }
      ]
    },
    {
      name: 'Ciabatta',
      desc: '82% hydration — very wet',
      flourWeight: 500,
      ingredients: [
        { name: 'Bread Flour',        amount: 500,  percentage: 100,  isFlour: true,  category: 'flour' },
        { name: 'Water',              amount: 410,  percentage: 82,   isFlour: false, category: 'liquid' },
        { name: 'Olive Oil',          amount: 15,   percentage: 3,    isFlour: false, category: 'fat' },
        { name: 'Salt',               amount: 10,   percentage: 2,    isFlour: false, category: 'other' },
        { name: 'Instant Yeast',      amount: 1.5,  percentage: 0.3,  isFlour: false, category: 'other' }
      ]
    },
    {
      name: 'Oatmeal Bread',
      desc: 'Honey-sweetened, 11% oats',
      flourWeight: 880,
      ingredients: [
        { name: 'Bread Flour',        amount: 780,  percentage: 88.6, isFlour: true,  category: 'flour' },
        { name: 'Rolled Oats',        amount: 100,  percentage: 11.4, isFlour: true,  category: 'flour' },
        { name: 'Water',              amount: 472,  percentage: 53.6, isFlour: false, category: 'liquid' },
        { name: 'Honey',              amount: 63,   percentage: 7.2,  isFlour: false, category: 'sugar' },
        { name: 'Salt',               amount: 12,   percentage: 1.4,  isFlour: false, category: 'other' },
        { name: 'Instant Yeast',      amount: 7,    percentage: 0.8,  isFlour: false, category: 'other' }
      ]
    }
  ];

  /* ---- Ingredient category options ---- */
  var CATEGORIES = [
    { value: 'flour',  label: 'Flour' },
    { value: 'liquid', label: 'Liquid' },
    { value: 'fat',    label: 'Fat / Oil' },
    { value: 'sugar',  label: 'Sugar / Sweetener' },
    { value: 'other',  label: 'Other' }
  ];

  /* ---- Default state (mode 1: recipe → percentages) ---- */
  var DEFAULT_INGREDIENTS = [
    { name: 'Bread Flour',   amount: 500, percentage: 100, isFlour: true,  category: 'flour' },
    { name: 'Water',         amount: 350, percentage: 70,  isFlour: false, category: 'liquid' },
    { name: 'Salt',          amount: 10,  percentage: 2,   isFlour: false, category: 'other' },
    { name: 'Instant Yeast', amount: 3,   percentage: 0.6, isFlour: false, category: 'other' }
  ];

  var DEFAULT_MODE = 'recipe-to-pct';

  var STORAGE_KEY = 'bakecalc_bakers_pct_state';

  /* ---- State ---- */
  var state = loadState();

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s.ingredients && s.ingredients.length && s.mode) return s;
      }
    } catch (e) { /* ignore */ }
    return {
      mode: DEFAULT_MODE,
      ingredients: JSON.parse(JSON.stringify(DEFAULT_INGREDIENTS)),
      flourWeight: 500
    };
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* ignore */ }
  }

  /* ---- Current mode ---- */
  function getMode() {
    return state.mode || DEFAULT_MODE;
  }

  function isPctToRecipe() {
    return getMode() === 'pct-to-recipe';
  }

  /* ================================================================
     MATH HELPERS
     ================================================================ */

  /**
   * Total flour weight: sum of all ingredients marked isFlour.
   * In mode 1 (recipe→%), this is calculated from ingredient amounts.
   * In mode 2 (%→recipe), this comes from the user's manual input.
   */
  function getTotalFlourWeight() {
    if (isPctToRecipe()) {
      var el = $('total-flour-weight');
      return el ? Math.max(parseFloat(el.value) || 0, 1) : (state.flourWeight || 500);
    }
    var total = 0;
    for (var i = 0; i < state.ingredients.length; i++) {
      if (state.ingredients[i].isFlour) {
        total += (state.ingredients[i].amount || 0);
      }
    }
    return Math.max(total, 1);
  }

  /**
   * Compute percentage for a non-flour ingredient based on its gram amount.
   */
  function calcPercentage(amount, totalFlour) {
    if (totalFlour <= 0) return 0;
    return (amount / totalFlour) * 100;
  }

  /**
   * Compute grams for an ingredient from its percentage and total flour weight.
   */
  function calcGramsFromPct(percentage, totalFlour) {
    return (percentage / 100) * totalFlour;
  }

  /**
   * Calculate total hydration: (sum of all liquids) / (total flour) × 100
   */
  function calcHydration(ingredients, totalFlour) {
    var totalLiquid = 0;
    for (var i = 0; i < ingredients.length; i++) {
      var ing = ingredients[i];
      if (ing.category === 'liquid' && !ing.isFlour) {
        totalLiquid += (ing.amount || 0);
      }
    }
    if (totalFlour <= 0) return 0;
    return (totalLiquid / totalFlour) * 100;
  }

  /**
   * Smart rounding for percentages: whole numbers stay whole,
   * fractions get 1 decimal.
   */
  function fmtPct(val) {
    if (val <= 0) return '0%';
    if (Math.abs(val - Math.round(val)) < 0.05) return Math.round(val) + '%';
    return val.toFixed(1) + '%';
  }

  function fmtGrams(val) {
    if (val <= 0) return '0 g';
    if (val < 10) return val.toFixed(1) + ' g';
    return Math.round(val) + ' g';
  }

  /* ================================================================
     RENDER HELPERS
     ================================================================ */

  function escAttr(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function catOptionsHtml(currentCat) {
    var h = '';
    for (var i = 0; i < CATEGORIES.length; i++) {
      var sel = CATEGORIES[i].value === currentCat ? ' selected' : '';
      h += '<option value="' + CATEGORIES[i].value + '"' + sel + '>' + CATEGORIES[i].label + '</option>';
    }
    return h;
  }

  /**
   * Render a single ingredient row. Adapts columns based on mode.
   * Mode 1 (recipe→%): grams are editable, pct is a read-only span.
   * Mode 2 (%→recipe): pct is editable (non-flour), grams are read-only.
   */
  function renderIngredientRow(ing, idx) {
    var totalFlour = getTotalFlourWeight();
    var displayPct, displayGrams;

    if (isPctToRecipe()) {
      // Mode 2: percentages drive grams (including flour blend shares)
      displayPct = (ing.percentage != null) ? ing.percentage : (ing.isFlour ? 100 : 0);
      displayGrams = calcGramsFromPct(displayPct, totalFlour);
    } else {
      // Mode 1: grams are the input, percentage is calculated
      displayGrams = ing.amount || 0;
      displayPct = ing.isFlour ? 100 : calcPercentage(ing.amount || 0, totalFlour);
    }

    var barWidth = Math.min(displayPct, 100);
    var barClass = 'pct-bar--' + (ing.category || 'other');
    var flourChecked = ing.isFlour ? ' checked' : '';

    var row = '<tr class="ingredient-row" data-idx="' + idx + '">';

    // Ingredient name
    row += '<td class="cell-name">'
      + '<input type="text" class="ing-name" value="' + escAttr(ing.name) + '"'
      + ' placeholder="Ingredient name"'
      + ' oninput="BakersPct.onIngredientChange(this,' + idx + ",'name')\">"
      + '</td>';

    // Grams — editable in mode 1, read-only in mode 2
    if (isPctToRecipe()) {
      // Mode 2: all grams are calculated, not directly editable
      var gramsTitle = ing.isFlour
        ? 'Calculated from total flour weight × blend share.'
        : 'Calculated from percentage. Change the Baker\'s % value to adjust.';
      row += '<td class="cell-qty">'
        + '<input type="number" class="ing-amount" value="' + Math.round(displayGrams) + '"'
        + ' min="0" step="any" readonly'
        + ' style="background:#f5f0eb;color:var(--text-muted);"'
        + ' title="' + gramsTitle + '">'
        + '</td>';
    } else {
      row += '<td class="cell-qty">'
        + '<input type="number" class="ing-amount" value="' + displayGrams + '"'
        + ' min="0" step="any" placeholder="0" inputmode="decimal"'
        + ' oninput="BakersPct.onIngredientChange(this,' + idx + ",'amount')\">"
        + '</td>';
    }

    // Flour checkbox (mode 1) or blend-share indicator (mode 2)
    if (!isPctToRecipe()) {
      row += '<td class="cell-flour">'
        + '<input type="checkbox" class="cb-flour"' + flourChecked
        + ' onchange="BakersPct.onFlourToggle(this,' + idx + ')" title="Check if this is a flour (100% base)">'
        + '</td>';
    } else {
      row += '<td class="cell-flour" style="text-align:center;font-size:0.8rem;color:var(--text-muted);">'
        + (ing.isFlour ? fmtPct(displayPct) : '—')
        + '</td>';
    }

    // Baker's percentage — span in mode 1, input in mode 2 (non-flour)
    if (isPctToRecipe() && !ing.isFlour) {
      row += '<td class="cell-pct">'
        + '<input type="number" class="ing-pct" value="' + displayPct + '"'
        + ' min="0" step="any" placeholder="0" inputmode="decimal"'
        + ' style="width:72px;padding:6px 8px;font-weight:600;color:var(--primary);'
        + 'border:1px solid var(--border);border-radius:var(--radius-sm);text-align:center;"'
        + ' oninput="BakersPct.onIngredientChange(this,' + idx + ",'pct')\">"
        + '</td>';
    } else {
      row += '<td class="cell-pct" style="font-weight:600;color:var(--primary);text-align:center;">'
        + '<span class="pct-value">' + fmtPct(displayPct) + '</span>'
        + '</td>';
    }

    // Bar
    row += '<td class="cell-bar">'
      + '<div class="pct-bar-wrap"><div class="pct-bar ' + barClass + '" style="width:' + barWidth + '%;"></div></div>'
      + '</td>';

    // Category
    row += '<td class="cell-cat">'
      + '<select class="ing-category" onchange="BakersPct.onCategoryChange(this,' + idx + ')">'
      + catOptionsHtml(ing.category)
      + '</select>'
      + '</td>';

    // Delete
    row += '<td class="cell-del">'
      + '<button class="btn-row-del" onclick="BakersPct.removeRow(' + idx + ')" title="Remove">&times;</button>'
      + '</td>';

    row += '</tr>';
    return row;
  }

  function renderAllRows() {
    var tbody = $('ingredients-body');
    if (!tbody) return;
    var html = '';
    for (var i = 0; i < state.ingredients.length; i++) {
      html += renderIngredientRow(state.ingredients[i], i);
    }
    tbody.innerHTML = html;
  }

  function renderPresets() {
    var grid = $('preset-grid');
    if (!grid) return;
    var html = '';
    for (var i = 0; i < PRESETS.length; i++) {
      var p = PRESETS[i];
      html += '<button class="preset-chip" onclick="BakersPct.loadPreset(' + i + ')" title="Load ' + escAttr(p.name) + '">'
        + '<span class="preset-chip-name">' + p.name + '</span>'
        + '<span class="preset-chip-meta">' + p.desc + ' &middot; ' + p.ingredients.length + ' ingredients</span>'
        + '</button>';
    }
    grid.innerHTML = html;
  }

  /* ================================================================
     MODE SWITCHING
     ================================================================ */

  function switchMode(newMode) {
    if (state.mode === newMode) return;

    // Convert ingredients between modes
    if (newMode === 'pct-to-recipe' && state.mode === 'recipe-to-pct') {
      // Going from recipe→% to %→recipe: calculate percentages from current amounts
      var totalFlour = getTotalFlourWeight();
      for (var i = 0; i < state.ingredients.length; i++) {
        var ing = state.ingredients[i];
        ing.percentage = Math.round(calcPercentage(ing.amount, totalFlour) * 10) / 10;
      }
      state.flourWeight = totalFlour;
    } else if (newMode === 'recipe-to-pct' && state.mode === 'pct-to-recipe') {
      // Going from %→recipe to recipe→%: amounts were already computed, keep them
      state.flourWeight = getTotalFlourWeight();
    }

    state.mode = newMode;
    saveState();
    applyModeUI();
    renderAllRows();
    recalcAll();
  }

  function applyModeUI() {
    var isP2R = isPctToRecipe();

    // Tab buttons
    var tabR2P = $('tab-recipe-to-pct');
    var tabP2R = $('tab-pct-to-recipe');
    if (tabR2P) tabR2P.className = 'tab-btn' + (isP2R ? '' : ' active');
    if (tabP2R) tabP2R.className = 'tab-btn' + (isP2R ? ' active' : '');

    // Flour weight section (only visible in mode 2)
    var fwSection = $('flour-weight-section');
    if (fwSection) fwSection.style.display = isP2R ? '' : 'none';

    // Update description
    var desc = $('mode-description');
    if (desc) {
      if (isP2R) {
        desc.innerHTML = 'Enter <strong>baker\'s percentages</strong> for each ingredient below, set your total flour weight above, and we\'ll calculate the grams. Flour ingredients are locked at 100% — everything else is a percentage of flour weight.';
      } else {
        desc.innerHTML = 'Enter your recipe in grams — we\'ll calculate the baker\'s percentage for every ingredient.<br><strong>Check the box</strong> next to flour ingredients (they make up the 100% base). Add all your flours together — they\'re the reference point.';
      }
    }

    // Show/hide flour checkbox column header, adjust grams label, update bar label
    var thFlour = $('th-flour-label');
    var thGrams = $('th-grams-label');
    var thBar   = $('th-bar-label');
    if (thFlour) thFlour.textContent = isP2R ? 'Locked' : 'Flour?';
    if (thGrams) thGrams.textContent = isP2R ? 'Grams (calc)' : 'Grams';

    // Update flour weight input
    var fwInput = $('total-flour-weight');
    if (fwInput && isP2R) {
      fwInput.value = state.flourWeight || getTotalFlourWeight();
    }
  }

  /* ================================================================
     RECALC ENGINE
     ================================================================ */

  /**
   * Update hydration callout without touching the ingredient table.
   * Called from onIngredientChange('pct') for responsive inline updates.
   */
  function updateHydrationDisplay() {
    var ingredients = state.ingredients;
    var totalFlour = getTotalFlourWeight();
    var hydPct;

    if (isPctToRecipe()) {
      var liquidPctSum = 0;
      for (var j = 0; j < ingredients.length; j++) {
        if (ingredients[j].category === 'liquid' && !ingredients[j].isFlour) {
          liquidPctSum += (ingredients[j].percentage || 0);
        }
      }
      hydPct = liquidPctSum;
    } else {
      hydPct = calcHydration(ingredients, totalFlour);
    }

    var vhyd = $('val-hydration');
    if (vhyd) vhyd.textContent = fmtPct(hydPct);

    var hydNote = $('hydration-note');
    if (hydNote) {
      if (hydPct <= 0) {
        hydNote.textContent = 'No liquids detected. Add ingredients with the "Liquid" type to see hydration.';
      } else if (hydPct < 55) {
        hydNote.textContent = 'Very low hydration — firm, tight crumb. Good for bagels and soft pretzels.';
      } else if (hydPct < 60) {
        hydNote.textContent = 'Low hydration — soft, fine crumb. Great for sandwich bread, dinner rolls, and soft pretzels.';
      } else if (hydPct < 65) {
        hydNote.textContent = 'Moderate hydration — classic artisan range. Baguettes, country loaves, most sourdough. Great starting point for beginners.';
      } else if (hydPct < 72) {
        hydNote.textContent = 'Medium-high hydration — open crumb with irregular holes. Sourdough boules, pizza dough. Use stretch & fold.';
      } else if (hydPct < 80) {
        hydNote.textContent = 'High hydration — large holes, slack dough. Ciabatta, focaccia. Expect sticky dough.';
      } else {
        hydNote.textContent = 'Very high hydration — nearly pourable. Pan de cristal territory. Challenging to handle; use a dough scraper.';
      }
    }

    // Update total dough weight in summary
    var totalDough = totalFlour;
    for (var i = 0; i < ingredients.length; i++) {
      if (!ingredients[i].isFlour) {
        if (isPctToRecipe()) {
          totalDough += calcGramsFromPct(ingredients[i].percentage || 0, totalFlour);
        } else {
          totalDough += (ingredients[i].amount || 0);
        }
      }
    }
    var vdough = $('val-total-dough');
    if (vdough) vdough.textContent = fmtGrams(Math.round(totalDough));
  }

  function recalcAll() {
    var totalFlour = getTotalFlourWeight();
    var ingredients = state.ingredients;

    // Update total flour display
    var vflour = $('val-total-flour');
    if (vflour) vflour.textContent = fmtGrams(totalFlour);

    // Update hydration + dough weight (extracted helper)
    updateHydrationDisplay();

    // Update each visible row
    var rows = document.querySelectorAll('.ingredient-row');
    for (var k = 0; k < rows.length; k++) {
      if (k >= ingredients.length) break;
      var ing = ingredients[k];
      var row = rows[k];

      var displayPct, displayGrams;
      if (isPctToRecipe()) {
        // Mode 2: percentages are the source of truth (including blend shares for flour)
        displayPct = (ing.percentage != null) ? ing.percentage : (ing.isFlour ? 100 : 0);
        displayGrams = calcGramsFromPct(displayPct, totalFlour);
      } else {
        displayGrams = ing.amount || 0;
        displayPct = ing.isFlour ? 100 : calcPercentage(ing.amount || 0, totalFlour);
      }

      // Update percentage cell — input in mode 2 (non-flour), span otherwise
      if (isPctToRecipe() && !ing.isFlour) {
        var pctInput = row.querySelector('.ing-pct');
        if (pctInput) {
          // Only overwrite if user isn't actively editing
          if (document.activeElement !== pctInput) {
            pctInput.value = Math.round(displayPct * 10) / 10;
          }
        }
      } else {
        var pctSpan = row.querySelector('.pct-value');
        if (pctSpan) pctSpan.textContent = fmtPct(displayPct);
      }

      // Update bar
      var bar = row.querySelector('.pct-bar');
      if (bar) bar.style.width = Math.min(displayPct, 100) + '%';

      // Update grams input (mode 2: all rows are calculated)
      if (isPctToRecipe()) {
        var amtInput = row.querySelector('.ing-amount');
        if (amtInput && document.activeElement !== amtInput) {
          amtInput.value = Math.round(displayGrams);
        }
      }

      // Sync percentage to state (mode 1 only)
      if (!isPctToRecipe() && !ing.isFlour) {
        ing.percentage = Math.round(displayPct * 10) / 10;
      }
    }

    // Render summary table
    renderSummary(totalFlour);

    // Update flour weight in state (mode 2)
    if (isPctToRecipe()) {
      var fw = $('total-flour-weight');
      if (fw) {
        state.flourWeight = Math.max(parseFloat(fw.value) || 0, 1);
      }
    }

    saveState();
  }

  function renderSummary(totalFlour) {
    var body = $('summary-body');
    if (!body) return;
    var html = '';
    for (var i = 0; i < state.ingredients.length; i++) {
      var ing = state.ingredients[i];
      var grams, pct;
      if (isPctToRecipe()) {
        pct = (ing.percentage != null) ? ing.percentage : (ing.isFlour ? 100 : 0);
        grams = calcGramsFromPct(pct, totalFlour);
      } else {
        grams = ing.amount || 0;
        pct = ing.isFlour ? 100 : calcPercentage(ing.amount || 0, totalFlour);
      }
      var barW = Math.min(pct, 100);
      html += '<tr>'
        + '<td>' + escAttr(ing.name || '—') + '</td>'
        + '<td style="font-weight:600;">' + fmtGrams(Math.round(grams)) + '</td>'
        + '<td style="font-weight:600;color:var(--primary);">' + fmtPct(pct) + '</td>'
        + '<td><div class="pct-bar-wrap"><div class="pct-bar pct-bar--' + (ing.category || 'other') + '" style="width:' + barW + '%;"></div></div></td>'
        + '</tr>';
    }
    body.innerHTML = html;
  }

  /* ================================================================
     PUBLIC API
     ================================================================ */
  window.BakersPct = {

    init: function () {
      renderPresets();
      applyModeUI();
      renderAllRows();
      recalcAll();

      // Tab switcher listeners
      var tabR2P = $('tab-recipe-to-pct');
      var tabP2R = $('tab-pct-to-recipe');
      var self = this;
      if (tabR2P) tabR2P.addEventListener('click', function () { switchMode('recipe-to-pct'); });
      if (tabP2R) tabP2R.addEventListener('click', function () { switchMode('pct-to-recipe'); });

      // Flour weight input listener (mode 2)
      var fwInput = $('total-flour-weight');
      if (fwInput) {
        fwInput.addEventListener('input', function () {
          state.flourWeight = Math.max(parseFloat(fwInput.value) || 0, 1);
          saveState();
          self.recalc();
        });
      }
    },

    onIngredientChange: function (input, idx, field) {
      if (idx < 0 || idx >= state.ingredients.length) return;
      var ing = state.ingredients[idx];

      if (field === 'name') {
        ing.name = input.value;
      } else if (field === 'amount') {
        ing.amount = parseFloat(input.value) || 0;
      } else if (field === 'pct') {
        // Mode 2 only: user typed a new percentage — update grams cell in place
        ing.percentage = parseFloat(input.value) || 0;
        var totalFlour = getTotalFlourWeight();
        var newGrams = Math.round(calcGramsFromPct(ing.percentage, totalFlour));
        var row = input.closest('.ingredient-row');
        if (row) {
          var amtInput = row.querySelector('.ing-amount');
          if (amtInput) amtInput.value = newGrams;
          var bar = row.querySelector('.pct-bar');
          if (bar) bar.style.width = Math.min(ing.percentage, 100) + '%';
        }
        updateHydrationDisplay();
        renderSummary(getTotalFlourWeight());
        saveState();
        return; // skip full recalc — we updated in place
      }
      saveState();
      this.recalc();
    },

    onCategoryChange: function (sel, idx) {
      if (idx < 0 || idx >= state.ingredients.length) return;
      state.ingredients[idx].category = sel.value;
      saveState();
      this.recalc();
    },

    onFlourToggle: function (cb, idx) {
      if (idx < 0 || idx >= state.ingredients.length) return;
      state.ingredients[idx].isFlour = cb.checked;
      saveState();
      this.recalc();
    },

    addRow: function () {
      state.ingredients.push({
        name: '', amount: 0, percentage: 0,
        isFlour: false, category: 'other'
      });
      renderAllRows();
      saveState();
      this.recalc();
    },

    removeRow: function (idx) {
      if (state.ingredients.length <= 1) return;
      // Don't remove if it's the last flour ingredient in mode 2
      if (isPctToRecipe() && state.ingredients[idx].isFlour) {
        var flourCount = 0;
        for (var i = 0; i < state.ingredients.length; i++) {
          if (state.ingredients[i].isFlour) flourCount++;
        }
        if (flourCount <= 1) return; // Need at least one flour
      }
      state.ingredients.splice(idx, 1);
      renderAllRows();
      saveState();
      this.recalc();
    },

    loadPreset: function (presetIdx) {
      if (presetIdx < 0 || presetIdx >= PRESETS.length) return;
      var preset = PRESETS[presetIdx];

      // Switch to recipe→% mode for presets (all presets have gram amounts)
      state.mode = 'recipe-to-pct';
      state.ingredients = JSON.parse(JSON.stringify(preset.ingredients));
      state.flourWeight = preset.flourWeight;
      saveState();
      applyModeUI();
      renderAllRows();
      this.recalc();
    },

    recalc: function () {
      recalcAll();
    },

    resetAll: function () {
      if (!confirm('Clear all ingredients and restore the default sourdough formula?')) return;
      state = {
        mode: DEFAULT_MODE,
        ingredients: JSON.parse(JSON.stringify(DEFAULT_INGREDIENTS)),
        flourWeight: 500
      };
      localStorage.removeItem(STORAGE_KEY);
      applyModeUI();
      renderAllRows();
      recalcAll();
    },

    printCard: function () {
      var totalFlour = getTotalFlourWeight();
      var isP2R = isPctToRecipe();
      var ingRows = '';

      for (var i = 0; i < state.ingredients.length; i++) {
        var ing = state.ingredients[i];
        var grams, pct;
        if (isP2R) {
          pct = (ing.percentage != null) ? ing.percentage : (ing.isFlour ? 100 : 0);
          grams = calcGramsFromPct(pct, totalFlour);
        } else {
          grams = ing.amount || 0;
          pct = ing.isFlour ? 100 : calcPercentage(ing.amount || 0, totalFlour);
        }
        ingRows += '<tr><td>' + escAttr(ing.name || '—') + '</td>'
          + '<td>' + fmtGrams(Math.round(grams)) + '</td>'
          + '<td style="font-weight:600;">' + fmtPct(pct) + '</td></tr>';
      }

      // Compute hydration for print
      var hydPct;
      if (isP2R) {
        var sum = 0;
        for (var j = 0; j < state.ingredients.length; j++) {
          if (state.ingredients[j].category === 'liquid' && !state.ingredients[j].isFlour) {
            sum += (state.ingredients[j].percentage || 0);
          }
        }
        hydPct = sum;
      } else {
        hydPct = calcHydration(state.ingredients, totalFlour);
      }

      // Compute total dough
      var totalDough = totalFlour;
      for (var k = 0; k < state.ingredients.length; k++) {
        if (!state.ingredients[k].isFlour) {
          if (isP2R) {
            totalDough += calcGramsFromPct(state.ingredients[k].percentage || 0, totalFlour);
          } else {
            totalDough += (state.ingredients[k].amount || 0);
          }
        }
      }

      var card = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>'
        + 'Baker\'s Formula — BakeCalc Club</title>'
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
        + '<h1>Baker\'s Formula Card</h1>'
        + '<p class="meta"><strong>Total Flour:</strong> ' + fmtGrams(totalFlour)
        + ' &nbsp;|&nbsp; <strong>Total Dough:</strong> ' + fmtGrams(Math.round(totalDough))
        + ' &nbsp;|&nbsp; <strong>Hydration:</strong> ' + fmtPct(hydPct) + '</p>'
        + '<h2>Ingredients</h2>'
        + '<table><thead><tr><th>Ingredient</th><th>Grams</th><th>Baker\'s %</th></tr></thead><tbody>'
        + ingRows
        + '</tbody></table>'
        + '<p class="meta" style="margin-top:16px;"><strong>How to scale:</strong> decide your new flour weight, multiply each percentage by (new weight ÷ 100). Example for ' + fmtGrams(Math.round(totalFlour * 0.6)) + ' flour: use ' + Math.round(totalFlour * 0.6) + ' ÷ 100 = ' + (totalFlour * 0.6 / 100).toFixed(1) + ' as your multiplier.</p>'
        + '<p class="footer">Generated by BakeCalc Club &mdash; bakecalc.club/bakers-percentage-calculator</p>'
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
    BakersPct.init();
  });

})();