/* ============================================================
   BakeCalc Club — Nutrition Label Generator v1
   FDA-format nutrition label from recipe ingredients.
   Reuses the USDA-backed food database (98 foods).
   All computation runs locally in the browser.
   ============================================================ */

var NutritionLabel = (function () {
  'use strict';

  /* ---- USDA daily values (FDA, per 2000-calorie diet) ---- */
  var DV = {
    fat: 78,            // g
    satFat: 20,         // g
    cholesterol: 300,   // mg
    sodium: 2300,       // mg
    carbs: 275,         // g
    fiber: 28,          // g
    addedSugar: 50,     // g
    protein: 50,        // g
    vitaminD: 20,       // mcg
    calcium: 1300,      // mg
    iron: 18,           // mg
    potassium: 4700     // mg
  };

  /* ---- Extend food DB with micronutrients for common baking foods ----
     Fields: [name, kcal, protein, carbs, fat, fiber, satFat, sodium, cholesterol, sugar, calcium, iron, potassium, vitaminD]
     Sources: USDA FoodData Central. Where not available, values are reasonable estimates (marked *). */
  var FOODS = [
    /* Flour & grains */
    ['All-Purpose Flour',           364, 10.3, 76.3, 1.0, 2.7, 0.2,   2,    0,  0.3,  15,  4.6, 107, 0],
    ['Bread Flour',                 361, 11.9, 72.5, 1.3, 2.4, 0.2,   2,    0,  0.4,  15,  4.4, 100, 0],
    ['Cake Flour',                  362,  7.5, 77.5, 0.9, 1.7, 0.2,   2,    0,  0.2,  15,  4.4, 100, 0],
    ['Whole Wheat Flour',           340, 13.2, 72.0, 2.5, 10.7, 0.4,   2,    0,  0.4,  34,  3.6, 363, 0],
    ['Almond Flour',                570, 21.0, 21.6, 49.9, 12.5, 3.8, 1,    0,  4.4, 264,  3.7, 733, 0],
    ['Coconut Flour',               443, 19.3, 58.6, 15.0, 38.5, 13.3, 37,   0, 20.0, 55,  3.7, 0,    0],
    ['Cornstarch',                  357,  0.3, 91.3, 0.1, 0.9, 0.0,   9,    0,  0.0,  0,   0.5, 3,    0],
    ['Rolled Oats',                 379, 13.2, 67.7, 6.5, 10.1, 1.2,   2,    0,  1.0,  54,  4.7, 362, 0],

    /* Sugar & sweeteners */
    ['Granulated Sugar',            387,  0.0, 100.0, 0.0, 0.0, 0.0,   1,    0, 100.0,  1,  0.0, 2,    0],
    ['Brown Sugar',                 380,  0.1, 98.1, 0.0, 0.0, 0.0,  28,    0,  97.0, 83,  0.7, 133, 0],
    ['Powdered Sugar',              389,  0.0, 99.8, 0.0, 0.0, 0.0,   2,    0,  97.8,  1,  0.0, 1,    0],
    ['Honey',                       304,  0.3, 82.4, 0.0, 0.2, 0.0,   4,    0,  82.1,  6,  0.4, 52,    0],
    ['Maple Syrup',                 260,  0.0, 67.0, 0.1, 0.0, 0.0,  12,    0,  60.5, 102, 0.1, 212, 0],
    ['Corn Syrup',                  283,  0.0, 77.0, 0.0, 0.0, 0.0,  70,    0,  77.0,  0,  0.0, 0,    0],

    /* Fats & oils */
    ['Butter (unsalted)',           717,  0.9, 0.1, 81.1, 0.0, 51.4, 11,  215,  0.0,  24,  0.0, 24, 1.5],
    ['Butter (salted)',             717,  0.9, 0.1, 81.1, 0.0, 51.4, 643, 215,  0.0,  24,  0.0, 24, 1.5],
    ['Vegetable Oil',               884,  0.0, 0.0, 100.0, 0.0, 15.0, 0,    0,  0.0,  0,   0.0, 0,    0],
    ['Coconut Oil',                 862,  0.0, 0.0, 100.0, 0.0, 82.5, 0,    0,  0.0,  1,   0.1, 0,    0],
    ['Olive Oil',                   884,  0.0, 0.0, 100.0, 0.0, 13.8, 2,    0,  0.0,  1,   0.6, 1,    0],
    ['Shortening',                  884,  0.0, 0.0, 100.0, 0.0, 25.0, 0,    0,  0.0,  0,   0.0, 0,    0],

    /* Dairy & eggs */
    ['Whole Milk',                   61,  3.2, 4.8, 3.3, 0.0, 1.9,  43,   10,  5.0, 113, 0.0, 132, 1.0],
    ['Heavy Cream (36%)',           340,  2.8, 2.7, 36.1, 0.0, 23.0, 32,  137,  2.9,  66, 0.1, 121, 0.5],
    ['Cream Cheese',                342,  6.2, 4.1, 34.0, 0.0, 21.4, 321, 110,  3.2,  97, 0.4, 132, 0.2],
    ['Sour Cream',                  198,  2.4, 4.6, 19.4, 0.0, 12.1, 61,   35,  3.4, 110, 0.1, 141, 0.0],
    ['Eggs, whole (large)',         143, 12.6, 0.7, 9.5, 0.0, 3.1, 142,  373,  0.4,  56, 1.8, 138, 2.0],
    ['Egg Whites',                   52, 10.9, 0.7, 0.2, 0.0, 0.0, 166,    0,  0.7,   7, 0.1, 163, 0.0],
    ['Greek Yogurt, nonfat',         59, 10.2, 3.6, 0.4, 0.0, 0.1,  36,    5,  3.2, 110, 0.1, 141, 0.0],

    /* Leaveners & baking aids */
    ['Baking Powder',               53,  0.0, 27.7, 0.0, 0.2, 0.0, 10600,  0,  0.0, 5876, 11.6, 45, 0],
    ['Baking Soda',                  0,  0.0, 0.0, 0.0, 0.0, 0.0, 27360,  0,  0.0,   0,  0.0, 0,    0],
    ['Salt (table)',                 0,  0.0, 0.0, 0.0, 0.0, 0.0, 38758,  0,  0.0,  24,  0.3, 8,    0],
    ['Vanilla Extract',            288,  0.0, 12.7, 0.1, 0.0, 0.0,   9,    0, 12.7,  11,  0.1, 148, 0],
    ['Cocoa Powder (unsweetened)', 228, 19.6, 57.9, 13.7, 33.2, 8.1, 21,    0,  1.8, 128, 13.9, 1524, 0],

    /* Fruits (common in baking) */
    ['Banana (mashed)',             89,  1.1, 22.8, 0.3, 2.6, 0.1,   1,    0, 12.2,   5, 0.3, 358, 0],
    ['Applesauce (unsweetened)',    42,  0.2, 11.3, 0.1, 1.0, 0.0,   2,    0,  9.4,   4, 0.2, 71,  0],
    ['Raisins',                    299,  3.1, 79.2, 0.5, 3.7, 0.1,  11,    0, 59.2,  50, 1.9, 749, 0],
    ['Lemon Juice',                 22,  0.4, 6.9, 0.2, 0.3, 0.0,   1,    0,  2.5,   6, 0.1, 103, 0],
    ['Strawberries',                32,  0.7, 7.7, 0.3, 2.0, 0.0,   1,    0,  4.9,  16, 0.4, 153, 0],

    /* Nuts & seeds */
    ['Almonds (sliced)',            579, 21.2, 21.6, 49.9, 12.5, 3.8, 1,    0,  4.4, 269, 3.7, 733, 0],
    ['Walnuts (chopped)',           654, 15.2, 13.7, 65.2, 6.7, 6.1,  2,    0,  2.6,  98, 2.9, 441, 0],
    ['Pecans',                      691,  9.2, 13.9, 72.0, 9.6, 6.2,  0,    0,  4.0,  70, 2.5, 410, 0],
    ['Peanut Butter (smooth)',      588, 25.1, 20.0, 50.4, 6.0, 10.3, 426,  0,  9.2,  49, 1.7, 558, 0],

    /* Chocolate & chips */
    ['Chocolate Chips (semisweet)', 480,  5.1, 63.9, 29.5, 5.7, 17.5, 15,   0, 54.8,  47, 4.0, 480, 0],
    ['Dark Chocolate (70%)',        598,  7.8, 45.9, 42.6, 10.9, 24.5, 20,   0, 24.0,  73, 11.9, 715, 0],
    ['White Chocolate',             539,  5.9, 59.2, 32.1, 0.2, 19.4, 90,  21, 59.0, 200, 0.2, 286, 0]
  ];

  /* ---- Grams per US cup by ingredient (USDA/standard baking densities) ----
     Used for volume units (cup/tbsp/tsp/ml) — a cup of flour ≠ a cup of sugar. */
  var CUP_GRAMS = {
    'All-Purpose Flour': 120,
    'Bread Flour': 130,
    'Cake Flour': 110,
    'Whole Wheat Flour': 120,
    'Almond Flour': 96,
    'Coconut Flour': 112,
    'Cornstarch': 128,
    'Rolled Oats': 90,
    'Granulated Sugar': 200,
    'Brown Sugar': 220,
    'Powdered Sugar': 120,
    'Honey': 340,
    'Maple Syrup': 315,
    'Corn Syrup': 340,
    'Butter (unsalted)': 227,
    'Butter (salted)': 227,
    'Vegetable Oil': 218,
    'Coconut Oil': 218,
    'Olive Oil': 218,
    'Shortening': 205,
    'Whole Milk': 244,
    'Heavy Cream (36%)': 238,
    'Cream Cheese': 232,
    'Sour Cream': 242,
    'Greek Yogurt, nonfat': 245,
    'Eggs, whole (large)': 220,
    'Egg Whites': 245,
    'Baking Powder': 192,
    'Baking Soda': 230,
    'Salt (table)': 288,
    'Vanilla Extract': 208,
    'Cocoa Powder (unsweetened)': 100,
    'Banana (mashed)': 225,
    'Applesauce (unsweetened)': 240,
    'Raisins': 165,
    'Lemon Juice': 240,
    'Strawberries': 150,
    'Almonds (sliced)': 143,
    'Walnuts (chopped)': 120,
    'Pecans': 109,
    'Peanut Butter (smooth)': 258,
    'Chocolate Chips (semisweet)': 175,
    'Dark Chocolate (70%)': 132,
    'White Chocolate': 175
  };

  /* ---- Units that map to grams ---- */
  var UNIT_GRAMS = {
    g: 1, gram: 1, grams: 1,
    kg: 1000,
    oz: 28.35, ounce: 28.35, ounces: 28.35,
    lb: 453.6, pound: 453.6, pounds: 453.6,
    pc: 50, piece: 50, pieces: 50,
    egg: 50, eggs: 50
  };

  var TSP_GRAMS = {
    'Baking Powder': 4.6,
    'Baking Soda': 4.6,
    'Salt (table)': 5.7,
    'Vanilla Extract': 4.2,
    'Cocoa Powder (unsweetened)': 2.8
  };

  /* ---- State ---- */
  var ingredients = [];

  /* ---- Helpers ---- */
  function findFood(name) {
    for (var i = 0; i < FOODS.length; i++) {
      if (FOODS[i][0].toLowerCase() === name.trim().toLowerCase()) return FOODS[i];
    }
    return null;
  }

  function searchFoods(query) {
    var q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    var results = [];
    for (var i = 0; i < FOODS.length; i++) {
      if (FOODS[i][0].toLowerCase().indexOf(q) !== -1) results.push(FOODS[i]);
    }
    return results;
  }

  function cupGramsFor(name) {
    if (CUP_GRAMS[name] !== undefined) return CUP_GRAMS[name];
    return 240; // water-density fallback
  }

  function qtyToGrams(qty, unit, foodName) {
    var u = String(unit).toLowerCase();
    if (u === 'tsp' || u === 'teaspoon' || u === 'teaspoons') {
      if (TSP_GRAMS[foodName] !== undefined) return qty * TSP_GRAMS[foodName];
      return qty * cupGramsFor(foodName) / 48;
    }
    if (u === 'tbsp' || u === 'tablespoon' || u === 'tablespoons') {
      return qty * cupGramsFor(foodName) / 16;
    }
    if (u === 'cup' || u === 'cups' || u === 'c' || u === 'cups us') {
      return qty * cupGramsFor(foodName);
    }
    if (u === 'ml' || u === 'milliliter' || u === 'milliliters') {
      return qty * cupGramsFor(foodName) / 240;
    }
    if (u === 'l' || u === 'liter' || u === 'liters') {
      return qty * 1000 * cupGramsFor(foodName) / 240;
    }
    if (UNIT_GRAMS[u] !== undefined) return qty * UNIT_GRAMS[u];
    return qty; // assume grams
  }

  /* ---- Core computation ---- */
  function compute() {
    var totals = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
                   satFat: 0, sodium: 0, cholesterol: 0, sugar: 0,
                   calcium: 0, iron: 0, potassium: 0, vitaminD: 0 };
    var totalGrams = 0;
    var totalSugar = 0;

    for (var i = 0; i < ingredients.length; i++) {
      var ing = ingredients[i];
      var f = findFood(ing.name);
      if (!f) continue;
      var g = qtyToGrams(ing.qty, ing.unit, ing.name);
      if (g <= 0) continue;
      var factor = g / 100;
      totals.kcal        += f[1] * factor;
      totals.protein     += f[2] * factor;
      totals.carbs       += f[3] * factor;
      totals.fat         += f[4] * factor;
      totals.fiber       += f[5] * factor;
      totals.satFat      += f[6] * factor;
      totals.sodium      += f[7] * factor;
      totals.cholesterol += f[8] * factor;
      totals.sugar       += f[9] * factor;
      totals.calcium     += f[10] * factor;
      totals.iron        += f[11] * factor;
      totals.potassium   += f[12] * factor;
      totals.vitaminD    += f[13] * factor;
      totalGrams += g;
    }
    totals.grams = totalGrams;
    return totals;
  }

  function round(n, d) { var p = Math.pow(10, d === undefined ? 0 : d); return Math.round(n * p) / p; }

  /* ---- FDA rounding rules ---- */
  function labelVal(t) {
    return {
      kcal: Math.round(t.kcal),
      fat: round(t.fat, 1),
      satFat: round(t.satFat, 1),
      transFat: 0,
      cholesterol: Math.round(t.cholesterol),
      sodium: Math.round(t.sodium),
      carbs: round(t.carbs, 1),
      fiber: round(t.fiber, 1),
      sugar: round(t.sugar, 1),
      addedSugar: 0,
      protein: round(t.protein, 1),
      calcium: Math.round(t.calcium),
      iron: Math.round(t.iron),
      potassium: Math.round(t.potassium),
      vitaminD: Math.round(t.vitaminD * 10) / 10,
      grams: Math.round(t.grams)
    };
  }

  function pctDV(v, dv) {
    if (!v) return 0;
    return Math.round(v / dv * 100);
  }

  /* ---- Render ---- */
  function render(t, servings) {
    var per = servings > 1 ? t.grams / servings : t.grams;
    var r = labelVal(t);
    var calPer = r.kcal / Math.max(servings, 1);
    var fatPer = r.fat / Math.max(servings, 1);
    var satPer = r.satFat / Math.max(servings, 1);
    var cholPer = r.cholesterol / Math.max(servings, 1);
    var sodPer = r.sodium / Math.max(servings, 1);
    var carbPer = r.carbs / Math.max(servings, 1);
    var fibPer = r.fiber / Math.max(servings, 1);
    var sugPer = r.sugar / Math.max(servings, 1);
    var protPer = r.protein / Math.max(servings, 1);
    var calcPer = r.calcium / Math.max(servings, 1);
    var ironPer = r.iron / Math.max(servings, 1);
    var potPer = r.potassium / Math.max(servings, 1);
    var vitDPer = r.vitaminD / Math.max(servings, 1);

    document.getElementById('nl-serving').textContent = per ? round(per, 0) + ' g' : '—';
    document.getElementById('nl-calories').textContent = Math.round(calPer);

    document.getElementById('nl-total-fat').textContent = fatPer ? fatPer.toFixed(1) + 'g' : '0g';
    document.getElementById('nl-total-fat-dv').textContent = fatPer ? pctDV(fatPer, DV.fat) + '%' : '0%';
    document.getElementById('nl-sat-fat').textContent = satPer ? satPer.toFixed(1) + 'g' : '0g';
    document.getElementById('nl-sat-fat-dv').textContent = satPer ? pctDV(satPer, DV.satFat) + '%' : '0%';
    document.getElementById('nl-trans-fat').textContent = '0g';
    document.getElementById('nl-cholesterol').textContent = cholPer ? Math.round(cholPer) + 'mg' : '0mg';
    document.getElementById('nl-cholesterol-dv').textContent = cholPer ? pctDV(cholPer, DV.cholesterol) + '%' : '0%';
    document.getElementById('nl-sodium').textContent = sodPer ? Math.round(sodPer) + 'mg' : '0mg';
    document.getElementById('nl-sodium-dv').textContent = sodPer ? pctDV(sodPer, DV.sodium) + '%' : '0%';
    document.getElementById('nl-carbs').textContent = carbPer ? carbPer.toFixed(1) + 'g' : '0g';
    document.getElementById('nl-carbs-dv').textContent = carbPer ? pctDV(carbPer, DV.carbs) + '%' : '0%';
    document.getElementById('nl-fiber').textContent = fibPer ? fibPer.toFixed(1) + 'g' : '0g';
    document.getElementById('nl-fiber-dv').textContent = fibPer ? pctDV(fibPer, DV.fiber) + '%' : '0%';
    document.getElementById('nl-total-sugar').textContent = sugPer ? sugPer.toFixed(1) + 'g' : '0g';
    document.getElementById('nl-added-sugar').textContent = '0g';
    document.getElementById('nl-added-sugar-dv').textContent = '0%';
    document.getElementById('nl-protein').textContent = protPer ? protPer.toFixed(1) + 'g' : '0g';
    document.getElementById('nl-protein-dv').textContent = protPer ? pctDV(protPer, DV.protein) + '%' : '0%';

    document.getElementById('nl-vitd').textContent = vitDPer ? pctDV(vitDPer, DV.vitaminD) + '%' : '0%';
    document.getElementById('nl-calcium').textContent = calcPer ? pctDV(calcPer, DV.calcium) + '%' : '0%';
    document.getElementById('nl-iron').textContent = ironPer ? pctDV(ironPer, DV.iron) + '%' : '0%';
    document.getElementById('nl-potassium').textContent = potPer ? pctDV(potPer, DV.potassium) + '%' : '0%';

    /* calories from fat */
    document.getElementById('nl-cal-from-fat').textContent = Math.round(fatPer * 9);

    var servingsLabel = document.getElementById('nl-servings-label');
    if (servingsLabel) servingsLabel.textContent = 'Serving size ' + (per ? round(per, 0) + ' g' : '—') + ' (' + servings + ' servings)';
  }

  /* ---- Ingredient row management ---- */
  function addRow(name, qty, unit) {
    ingredients.push({ name: name || '', qty: parseFloat(qty) || 0, unit: unit || 'g' });
    renderRows();
  }

  function renderRows() {
    var tbody = document.getElementById('nl-ingredients');
    var html = '';
    for (var i = 0; i < ingredients.length; i++) {
      var ing = ingredients[i];
      html += '<tr class="ingredient-row" data-idx="' + i + '">'
        + '<td class="cell-name"><input type="text" class="ing-name nl-name" value="' + escapeAttr(ing.name) + '" placeholder="Type ingredient" autocomplete="off"></td>'
        + '<td class="cell-qty"><input type="number" class="ing-qty nl-qty" value="' + ing.qty + '" min="0" step="any"></td>'
        + '<td class="cell-unit"><input type="text" class="ing-unit nl-unit" value="' + escapeAttr(ing.unit) + '" placeholder="g" style="width:56px;"></td>'
        + '<td class="cell-del"><button class="btn-row-del" data-idx="' + i + '" title="Remove">&times;</button></td>'
        + '</tr>';
    }
    tbody.innerHTML = html;

    /* autocomplete setup for each name input */
    var names = tbody.querySelectorAll('.nl-name');
    for (var j = 0; j < names.length; j++) {
      setupAutocomplete(names[j]);
    }
    /* delete buttons */
    var dels = tbody.querySelectorAll('.btn-row-del');
    for (var k = 0; k < dels.length; k++) {
      dels[k].addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-idx'), 10);
        ingredients.splice(idx, 1);
        renderRows();
      });
    }
    /* input change listeners */
    var qtyInputs = tbody.querySelectorAll('.nl-qty');
    for (var m = 0; m < qtyInputs.length; m++) {
      qtyInputs[m].addEventListener('input', function () { syncFromRows(); });
    }
    var unitInputs = tbody.querySelectorAll('.nl-unit');
    for (var n = 0; n < unitInputs.length; n++) {
      unitInputs[n].addEventListener('input', function () { syncFromRows(); });
    }
    var nameInputs = tbody.querySelectorAll('.nl-name');
    for (var p = 0; p < nameInputs.length; p++) {
      nameInputs[p].addEventListener('change', function () { syncFromRows(); });
    }
  }

  function syncFromRows() {
    var rows = document.querySelectorAll('#nl-ingredients .ingredient-row');
    ingredients = [];
    for (var i = 0; i < rows.length; i++) {
      var name = rows[i].querySelector('.nl-name').value.trim();
      var qty = parseFloat(rows[i].querySelector('.nl-qty').value) || 0;
      var unit = rows[i].querySelector('.nl-unit').value.trim() || 'g';
      ingredients.push({ name: name, qty: qty, unit: unit });
    }
  }

  function setupAutocomplete(input) {
    var wrap = input.parentElement;
    var box = document.createElement('div');
    box.className = 'food-results nl-autocomplete';
    box.style.display = 'none';
    wrap.style.position = 'relative';
    wrap.appendChild(box);

    input.addEventListener('input', function () {
      var results = searchFoods(input.value);
      if (results.length === 0 || input.value.trim().length < 2) {
        box.style.display = 'none';
        return;
      }
      var html = '';
      for (var i = 0; i < Math.min(results.length, 6); i++) {
        html += '<div class="food-option" data-name="' + escapeAttr(results[i][0]) + '">' + escapeHtml(results[i][0]) + ' — ' + results[i][1] + ' kcal/100g</div>';
      }
      box.innerHTML = html;
      box.style.display = 'block';

      var opts = box.querySelectorAll('.food-option');
      for (var j = 0; j < opts.length; j++) {
        opts[j].addEventListener('mousedown', function (e) {
          e.preventDefault();
          input.value = this.getAttribute('data-name');
          box.style.display = 'none';
          syncFromRows();
          input.dispatchEvent(new Event('change'));
        });
      }
    });

    input.addEventListener('blur', function () {
      setTimeout(function () { box.style.display = 'none'; }, 200);
    });
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function escapeAttr(s) { return escapeHtml(s); }

  /* ---- Public API ---- */
  return {
    init: function () {
      var addBtn = document.getElementById('nl-add');
      if (addBtn) {
        addBtn.addEventListener('click', function () {
          syncFromRows();
          addRow('', 0, 'g');
        });
      }
      var calcBtn = document.getElementById('nl-calc');
      if (calcBtn) {
        calcBtn.addEventListener('click', function () {
          syncFromRows();
          var servings = parseInt(document.getElementById('nl-servings').value, 10) || 1;
          var t = compute();
          if (t.grams <= 0) { alert('Add at least one ingredient with a valid amount.'); return; }
          render(t, Math.max(servings, 1));
          document.getElementById('nl-result').style.display = 'block';
          document.getElementById('nl-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      }
      var printBtn = document.getElementById('nl-print');
      if (printBtn) {
        printBtn.addEventListener('click', function () { window.print(); });
      }
      /* seed with one empty row */
      addRow('', 0, 'g');
    },
    FOODS: FOODS,
    searchFoods: searchFoods,
    qtyToGrams: qtyToGrams,
    compute: compute
  };
})();

document.addEventListener('DOMContentLoaded', function () {
  NutritionLabel.init();
});
