/* ============================================================
   BakeCalc Club — Baking Cost Calculator
   Zero dependencies. All data stays in localStorage.
   ============================================================ */

(function () {
  'use strict';

  /* ---- Preset Ingredient Database ---- */
  var PRESETS = [
    { name: '',                               unit: 'g',    price: 0 },
    { name: 'All-Purpose Flour',              unit: 'g',    price: 0.002 },
    { name: 'Bread Flour',                    unit: 'g',    price: 0.0025 },
    { name: 'Cake Flour',                     unit: 'g',    price: 0.003 },
    { name: 'Granulated Sugar',               unit: 'g',    price: 0.0015 },
    { name: 'Brown Sugar',                    unit: 'g',    price: 0.002 },
    { name: 'Powdered Sugar',                 unit: 'g',    price: 0.0025 },
    { name: 'Butter (unsalted)',              unit: 'g',    price: 0.008 },
    { name: 'Eggs (large)',                   unit: 'pcs',  price: 0.25 },
    { name: 'Milk (whole)',                   unit: 'mL',   price: 0.003 },
    { name: 'Heavy Cream',                    unit: 'mL',   price: 0.008 },
    { name: 'Vegetable Oil',                  unit: 'mL',   price: 0.004 },
    { name: 'Vanilla Extract',                unit: 'tsp',  price: 0.30 },
    { name: 'Baking Powder',                  unit: 'g',    price: 0.01 },
    { name: 'Baking Soda',                    unit: 'g',    price: 0.005 },
    { name: 'Salt',                           unit: 'g',    price: 0.001 },
    { name: 'Cocoa Powder',                   unit: 'g',    price: 0.015 },
    { name: 'Chocolate Chips',                unit: 'g',    price: 0.015 },
    { name: 'Cream Cheese',                   unit: 'g',    price: 0.01 },
    { name: 'Honey',                          unit: 'g',    price: 0.012 },
    { name: 'Yeast (dry)',                    unit: 'g',    price: 0.05 },
    { name: 'Cornstarch',                     unit: 'g',    price: 0.008 },
    { name: 'Cinnamon (ground)',              unit: 'g',    price: 0.04 },
    { name: 'Almonds (sliced)',               unit: 'g',    price: 0.02 },
    { name: 'Frozen Berries',                 unit: 'g',    price: 0.008 },
    { name: 'Lemon Juice',                    unit: 'mL',   price: 0.005 }
  ];

  /* ---- Default state ---- */
  var DEFAULT_INGREDIENTS = [
    { name: 'All-Purpose Flour',    qty: 500, unit: 'g',   price: 0.002 },
    { name: 'Granulated Sugar',     qty: 200, unit: 'g',   price: 0.0015 },
    { name: 'Butter (unsalted)',    qty: 250, unit: 'g',   price: 0.008 },
    { name: 'Eggs (large)',         qty: 3,   unit: 'pcs', price: 0.25 },
    { name: 'Milk (whole)',         qty: 240, unit: 'mL',  price: 0.003 },
    { name: 'Vanilla Extract',      qty: 2,   unit: 'tsp', price: 0.30 },
    { name: 'Baking Powder',        qty: 10,  unit: 'g',   price: 0.01 },
    { name: 'Salt',                 qty: 3,   unit: 'g',   price: 0.001 }
  ];

  var DEFAULT_SETTINGS = {
    recipeName: '',
    servings: 12,
    laborRate: 15,
    laborHours: 1,
    packaging: 3,
    overheadPct: 10,
    profitPct: 30
  };

  var STORAGE_KEY = 'bakecalc_cost_state';

  /* ---- DOM refs ---- */
  var $ = function (id) { return document.getElementById(id); };

  /* ---- State ---- */
  var state = loadState();

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var s = JSON.parse(raw);
        // Validate both ingredients and settings exist
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

  /* ---- Preset data-lists ---- */
  function buildPresetOptions(selectedName) {
    var html = '';
    for (var i = 0; i < PRESETS.length; i++) {
      var sel = PRESETS[i].name === selectedName ? ' selected' : '';
      var label = PRESETS[i].name || '— Custom —';
      html += '<option value="' + PRESETS[i].name + '"'
           + ' data-unit="' + PRESETS[i].unit + '"'
           + ' data-price="' + PRESETS[i].price.toFixed(6) + '"'
           + sel + '>' + label + '</option>';
    }
    return html;
  }

  /* ---- Render ingredient row ---- */
  function renderIngredientRow(ing, idx) {
    var options = buildPresetOptions(ing.name);
    return '<tr class="ingredient-row" data-idx="' + idx + '">'
      + '<td class="cell-name">'
      + '<select class="ing-select" onchange="CostCalc.onSelectChange(this)">' + options + '</select>'
      + '</td>'
      + '<td class="cell-qty">'
      + '<input type="number" class="ing-qty" value="' + ing.qty + '" min="0" step="any" oninput="CostCalc.onQtyChange(this)" placeholder="0">'
      + '</td>'
      + '<td class="cell-unit">' + ing.unit + '</td>'
      + '<td class="cell-price">'
      + '<input type="number" class="ing-price" value="' + ing.price + '" step="0.0001" min="0" oninput="CostCalc.onPriceChange(this)">'
      + '</td>'
      + '<td class="cell-subtotal">$<span class="row-subtotal">' + (ing.qty * ing.price).toFixed(2) + '</span></td>'
      + '<td class="cell-del">'
      + '<button class="btn-row-del" onclick="CostCalc.removeRow(' + idx + ')" title="Remove">&times;</button>'
      + '</td>'
      + '</tr>';
  }

  function renderAllRows() {
    var tbody = $('ingredients-body');
    var html = '';
    for (var i = 0; i < state.ingredients.length; i++) {
      html += renderIngredientRow(state.ingredients[i], i);
    }
    tbody.innerHTML = html;
  }

  /* ---- Public API (exposed to onclick handlers) ---- */
  window.CostCalc = {

    init: function () {
      // Populate settings
      $('recipe-name').value = state.settings.recipeName;
      $('servings').value = state.settings.servings;
      $('labor-rate').value = state.settings.laborRate;
      $('labor-hours').value = state.settings.laborHours;
      $('packaging').value = state.settings.packaging;
      $('overhead-pct').value = state.settings.overheadPct;
      $('profit-pct').value = state.settings.profitPct;

      renderAllRows();
      this.recalc();

      // Attach input listeners to settings
      var ids = ['recipe-name','servings','labor-rate','labor-hours','packaging','overhead-pct','profit-pct'];
      var self = this;
      for (var i = 0; i < ids.length; i++) {
        var el = $(ids[i]);
        if (el) {
          el.addEventListener('input', function () { self.onSettingsChange(); });
        }
      }
    },

    onSelectChange: function (sel) {
      var row = sel.closest('.ingredient-row');
      var idx = parseInt(row.getAttribute('data-idx'), 10);
      var opt = sel.options[sel.selectedIndex];
      var name = opt.value;
      var unit = opt.getAttribute('data-unit');
      var price = parseFloat(opt.getAttribute('data-price')) || 0;

      state.ingredients[idx].name = name;
      state.ingredients[idx].unit = unit;
      // Always adopt the preset price — user can override afterward
      if (price > 0) {
        state.ingredients[idx].price = price;
      }

      row.querySelector('.cell-unit').textContent = unit;
      row.querySelector('.ing-price').value = state.ingredients[idx].price;
      saveState();
      this.recalc();
    },

    onQtyChange: function (input) {
      var row = input.closest('.ingredient-row');
      var idx = parseInt(row.getAttribute('data-idx'), 10);
      state.ingredients[idx].qty = parseFloat(input.value) || 0;
      saveState();
      this.recalc();
    },

    onPriceChange: function (input) {
      var row = input.closest('.ingredient-row');
      var idx = parseInt(row.getAttribute('data-idx'), 10);
      state.ingredients[idx].price = parseFloat(input.value) || 0;
      saveState();
      this.recalc();
    },

    onSettingsChange: function () {
      state.settings.recipeName   = $('recipe-name').value;
      state.settings.servings     = parseInt($('servings').value, 10) || 1;
      state.settings.laborRate    = parseFloat($('labor-rate').value) || 0;
      state.settings.laborHours   = parseFloat($('labor-hours').value) || 0;
      state.settings.packaging    = parseFloat($('packaging').value) || 0;
      state.settings.overheadPct  = parseFloat($('overhead-pct').value) || 0;
      state.settings.profitPct    = parseFloat($('profit-pct').value) || 0;
      saveState();
      this.recalc();
    },

    addRow: function () {
      state.ingredients.push({ name: '', qty: 0, unit: 'g', price: 0 });
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
      var s = state.settings;

      // Ingredient subtotals
      var ingCost = 0;
      var rows = document.querySelectorAll('.ingredient-row');
      for (var i = 0; i < rows.length; i++) {
        var ing = state.ingredients[i];
        var sub = ing.qty * ing.price;
        var subEl = rows[i].querySelector('.row-subtotal');
        if (subEl) subEl.textContent = sub.toFixed(2);
        ingCost += sub;
      }

      var laborCost    = s.laborRate * s.laborHours;
      var packaging    = s.packaging;
      var subtotal     = ingCost + laborCost + packaging;
      var overhead     = subtotal * (s.overheadPct / 100);
      var totalCost    = subtotal + overhead;
      var servings     = Math.max(s.servings, 1);
      var costPerSrv   = totalCost / servings;
      var profitPct    = s.profitPct;
      var margin       = totalCost * (profitPct / 100);
      var suggested    = totalCost + margin;
      var profit       = suggested - totalCost;

      $('val-ing-cost').textContent    = ingCost.toFixed(2);
      $('val-labor').textContent       = laborCost.toFixed(2);
      $('val-packaging').textContent   = packaging.toFixed(2);
      $('val-overhead').textContent    = overhead.toFixed(2);
      $('val-total').textContent       = totalCost.toFixed(2);
      $('val-per-serving').textContent = costPerSrv.toFixed(2);
      $('val-suggested').textContent   = suggested.toFixed(2);
      $('val-profit').textContent      = profit.toFixed(2);
      $('profit-pct-label').textContent = profitPct;

      // Visual emphasis — highlight total
      $('result-total').classList.toggle('has-profit', profit > 0);
    },

    resetAll: function () {
      if (!confirm('Clear all data and restore defaults?')) return;
      state = {
        ingredients: JSON.parse(JSON.stringify(DEFAULT_INGREDIENTS)),
        settings:   JSON.parse(JSON.stringify(DEFAULT_SETTINGS))
      };
      localStorage.removeItem(STORAGE_KEY);
      $('recipe-name').value = '';
      $('servings').value = 12;
      $('labor-rate').value = 15;
      $('labor-hours').value = 1;
      $('packaging').value = 3;
      $('overhead-pct').value = 10;
      $('profit-pct').value = 30;
      renderAllRows();
      this.recalc();
    },

    printCard: function () {
      var s = state.settings;
      var ings = state.ingredients.filter(function (ing) { return ing.name && ing.qty > 0; });
      var ingCost = 0;
      for (var i = 0; i < ings.length; i++) { ingCost += ings[i].qty * ings[i].price; }
      var labor  = s.laborRate * s.laborHours;
      var subtotal = ingCost + labor + s.packaging;
      var overhead = subtotal * (s.overheadPct / 100);
      var total    = subtotal + overhead;
      var perSrv   = total / Math.max(s.servings, 1);
      var margin   = total * (s.profitPct / 100);
      var suggested = total + margin;

      var ingRows = '';
      for (var j = 0; j < ings.length; j++) {
        ingRows += '<tr><td>' + ings[j].name + '</td><td>' + ings[j].qty + ' ' + ings[j].unit + '</td><td>$' + (ings[j].qty * ings[j].price).toFixed(2) + '</td></tr>';
      }

      var card = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>'
        + (s.recipeName || 'Recipe Card') + ' — BakeCalc Club</title>'
        + '<style>'
        + 'body{font-family:Georgia,serif;color:#2c1e0f;max-width:600px;margin:40px auto;padding:0 20px;line-height:1.6}'
        + 'h1{color:#c7733e;border-bottom:2px solid #f0e4d4;padding-bottom:8px;margin-bottom:4px}'
        + 'h2{color:#9e4f28;font-size:1.1rem;margin:24px 0 8px}'
        + 'table{width:100%;border-collapse:collapse;margin:12px 0}'
        + 'th,td{padding:8px 10px;text-align:left;border-bottom:1px solid #f0e4d4}'
        + 'th{color:#7a6a5c;font-size:0.85rem;font-weight:600;text-transform:uppercase}'
        + '.total-row td{font-weight:bold;border-top:2px solid #c7733e;padding-top:10px}'
        + '.meta{color:#7a6a5c;font-size:0.9rem;margin:4px 0}'
        + '.footer{text-align:center;color:#a89888;font-size:0.8rem;margin-top:40px;border-top:1px solid #f0e4d4;padding-top:16px}'
        + '@media print{body{margin:20px auto}}'
        + '</style></head><body>'
        + '<h1>' + (s.recipeName || 'Recipe Card') + '</h1>'
        + '<p class="meta">Servings: ' + s.servings + ' &nbsp;|&nbsp; Cost per serving: <strong>$' + perSrv.toFixed(2) + '</strong></p>'
        + '<h2>Ingredients</h2>'
        + '<table><thead><tr><th>Ingredient</th><th>Qty</th><th>Cost</th></tr></thead><tbody>'
        + ingRows
        + '</tbody></table>'
        + '<h2>Cost Breakdown</h2>'
        + '<table>'
        + '<tr><td>Ingredients</td><td>$' + ingCost.toFixed(2) + '</td></tr>'
        + '<tr><td>Labor (' + s.laborHours + 'h @ $' + s.laborRate.toFixed(0) + '/hr)</td><td>$' + labor.toFixed(2) + '</td></tr>'
        + '<tr><td>Packaging</td><td>$' + s.packaging.toFixed(2) + '</td></tr>'
        + '<tr><td>Overhead (' + s.overheadPct + '%)</td><td>$' + overhead.toFixed(2) + '</td></tr>'
        + '<tr class="total-row"><td>Total Cost</td><td>$' + total.toFixed(2) + '</td></tr>'
        + '<tr><td>Suggested Price (+' + s.profitPct + '%)</td><td style="color:#c7733e;font-weight:bold">$' + suggested.toFixed(2) + '</td></tr>'
        + '</table>'
        + '<p class="footer">Generated by BakeCalc Club &mdash; bakecalc.club</p>'
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
    CostCalc.init();
  });

})();
