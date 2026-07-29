/* ============================================================
   BakeCalc Club — Core Conversion Engine v4
   "Precision Baking Math" — exact-density algorithms
   Module map:
     ┃ SECTION A — Cups → Grams (butter / flour / sugar)
     ┃ SECTION B — Grams → Cups (butter / flour / sugar)
     ┃ SECTION C — Tbsp → Grams (butter / flour / sugar)
     ┃ SECTION D — Tsp  → Grams (baking powder, leaveners)
     ┃ SECTION E — Fluid Oz → mL (water, milk, cream, oil)
     ┃ SECTION F — DOM auto-detect initial calc
   All density values are research-backed per-cup gram weights.
   ============================================================ */

/* ============================================================
   SHARED HELPERS
   ============================================================ */

/**
 * Round a gram value to the nearest integer, but bias .5 DOWN
 * so that 0.5 × 227 = 113.5 → 113 (matches real-world 113.4 g),
 * not 114 as standard Math.round would produce.
 */
function bakerRound(value) {
  // Subtract 1e-9 to nudge exact .5 cases down; harmless otherwise
  return Math.round(value - 1e-9);
}

/**
 * Map a decimal-cups value to a human-readable fraction string.
 */
function cupsToFraction(decimalCups, ingredientLabel) {
  var r = Math.round(decimalCups * 100) / 100;
  var label = ingredientLabel || '';

  if (r <= 0) return '0 cups';

  // --- near-exact fractions ---
  if (r >= 0.23 && r <= 0.27) return '¼ cup';
  if (r >= 0.31 && r <= 0.35) return '⅓ cup';
  if (r >= 0.36 && r <= 0.41) return 'scant ½ cup';
  if (r >= 0.45 && r <= 0.55) return '½ cup';
  if (r >= 0.58 && r <= 0.63) return '⅔ cup';
  if (r >= 0.71 && r <= 0.79) return '¾ cup';
  if (r >= 0.96 && r <= 1.05) return '1 cup';

  // --- 1.x cups ---
  if (r >= 1.06 && r <= 1.20) return '1 ⅛ cups';
  if (r >= 1.21 && r <= 1.30) return '1 ¼ cups';
  if (r >= 1.31 && r <= 1.40) return '1 ⅓ cups';
  if (r >= 1.45 && r <= 1.55) return '1 ½ cups';
  if (r >= 1.56 && r <= 1.63) return '1 ⅔ cups';
  if (r >= 1.71 && r <= 1.79) return '1 ¾ cups';
  if (r >= 1.96 && r <= 2.05) return '2 cups';

  // --- 2.x cups ---
  if (r >= 2.06 && r <= 2.20) return '2 ⅛ cups';
  if (r >= 2.21 && r <= 2.30) return '2 ¼ cups';
  if (r >= 2.36 && r <= 2.55) return '2 ½ cups';
  if (r >= 2.56 && r <= 2.75) return '2 ⅔ cups';
  if (r >= 2.76 && r <= 2.90) return '2 ¾ cups';
  if (r >= 2.91 && r <= 3.10) return '3 cups';

  // --- 3.x+ — use decimal with ingredient label for context ---
  return '≈ ' + r.toFixed(2) + ' cups' + (label ? ' (' + label + ')' : '');
}


/* ============================================================
   SECTION A — Cups → Grams  (forward: volume → weight)
   ============================================================ */

function calculateCupsToGrams(buttonElement) {
  var card    = buttonElement.closest('.calculator-card');
  var defCups = parseFloat(card.getAttribute('data-default-cups')) || 1;
  var raw     = parseFloat(card.querySelector('#cups-input').value);
  var cups    = isNaN(raw) ? defCups : raw;

  if (cups <= 0) {
    card.querySelector('#grams-output').innerText      = '0';
    card.querySelector('#grams-output-frac').innerText  = '0 g';
    return;
  }

  var density   = parseFloat(card.querySelector('#ingredient-type').value) || 120;
  var exactG    = cups * density;                     // unrounded grams
  var gramsInt  = bakerRound(exactG);                 // baker-friendly integer (113.5→113)
  var grams1dp  = exactG.toFixed(1);                  // one-decimal for display

  card.querySelector('#grams-output').innerText = gramsInt;

  // Build a friendly fraction description
  var fracDesc = gramsInt + ' g';
  if (cups === 1)                   fracDesc = gramsInt + ' grams';
  else if (cups === 0.5)            fracDesc = '≈ ' + gramsInt + ' g (half cup)';
  else if (cups === 0.25)           fracDesc = '≈ ' + gramsInt + ' g (quarter cup)';
  else if (cups === 0.333)          fracDesc = '≈ ' + gramsInt + ' g (third cup)';
  else if (cups === 0.75)           fracDesc = '≈ ' + gramsInt + ' g (three-quarter cup)';
  else if (cups === 2)              fracDesc = gramsInt + ' grams (2 cups)';
  else                              fracDesc = '≈ ' + gramsInt + ' g';

  card.querySelector('#grams-output-frac').innerText = fracDesc;
}


/* ============================================================
   SECTION B — Grams → Cups  (reverse: weight → volume)
   ============================================================ */

function calculateFlour(buttonElement) {
  var card        = buttonElement.closest('.calculator-card');
  var defaultMass = parseFloat(card.getAttribute('data-default-mass')) || 50;
  var raw         = parseFloat(card.querySelector('#flour-mass').value);
  var massGrams   = isNaN(raw) ? defaultMass : raw;

  if (massGrams <= 0) {
    card.querySelector('#cups-output-decimal').innerText   = '0.00';
    card.querySelector('#cups-output-fraction').innerText  = '0 cups';
    return;
  }

  var cupDensity  = parseFloat(card.querySelector('#flour-type').value) || 120;
  var decimalCups = massGrams / cupDensity;
  var fractionText = cupsToFraction(decimalCups, 'flour');

  card.querySelector('#cups-output-decimal').innerText  = decimalCups.toFixed(2);
  card.querySelector('#cups-output-fraction').innerText = fractionText;
}

function calculateSugar(buttonElement) {
  var card        = buttonElement.closest('.calculator-card');
  var defaultMass = parseFloat(card.getAttribute('data-default-mass')) || 50;
  var raw         = parseFloat(card.querySelector('#sugar-mass').value);
  var massGrams   = isNaN(raw) ? defaultMass : raw;

  if (massGrams <= 0) {
    card.querySelector('#cups-output-decimal').innerText   = '0.00';
    card.querySelector('#cups-output-fraction').innerText  = '0 cups';
    return;
  }

  var cupDensity  = parseFloat(card.querySelector('#sugar-type').value) || 200;
  var decimalCups = massGrams / cupDensity;
  var fractionText = cupsToFraction(decimalCups, 'sugar');

  card.querySelector('#cups-output-decimal').innerText  = decimalCups.toFixed(2);
  card.querySelector('#cups-output-fraction').innerText = fractionText;
}

function calculateButter(buttonElement) {
  var card        = buttonElement.closest('.calculator-card');
  var defaultMass = parseFloat(card.getAttribute('data-default-mass')) || 50;
  var raw         = parseFloat(card.querySelector('#butter-mass').value);
  var massGrams   = isNaN(raw) ? defaultMass : raw;

  if (massGrams <= 0) {
    card.querySelector('#cups-output-decimal').innerText   = '0.00';
    card.querySelector('#cups-output-fraction').innerText  = '0 cups';
    return;
  }

  var cupDensity  = parseFloat(card.querySelector('#butter-type').value) || 227;
  var decimalCups = massGrams / cupDensity;
  var fractionText = cupsToFraction(decimalCups, 'butter');

  card.querySelector('#cups-output-decimal').innerText  = decimalCups.toFixed(2);
  card.querySelector('#cups-output-fraction').innerText = fractionText;
}


/* ============================================================
   SECTION C — Tbsp → Grams  (volume → weight via cup-density)
   ============================================================ */

function calculateTbspToGrams(buttonElement) {
  var card        = buttonElement.closest('.calculator-card');
  var defaultTbsp = parseFloat(card.getAttribute('data-default-tbsp')) || 1;
  var raw         = parseFloat(card.querySelector('#tbsp-input').value);
  var tbsp        = isNaN(raw) ? defaultTbsp : raw;

  if (tbsp <= 0) {
    card.querySelector('#grams-output').innerText      = '0';
    card.querySelector('#grams-output-frac').innerText  = '0 g';
    return;
  }

  var densityPerCup = parseFloat(card.querySelector('#ingredient-type').value) || 120;
  var gramsPerTbsp  = densityPerCup / 16;
  var grams         = tbsp * gramsPerTbsp;
  // Round to 1 decimal place for practical baking precision
  var rounded       = Math.round(grams * 10) / 10;

  card.querySelector('#grams-output').innerText = rounded.toFixed(1);

  var fracDesc = '≈ ' + rounded.toFixed(1) + ' g';
  if (tbsp === 1)       fracDesc = rounded.toFixed(1) + ' grams';
  else if (tbsp === 0.5) fracDesc = '≈ ' + rounded.toFixed(1) + ' g (half tablespoon)';
  else if (tbsp === 2)   fracDesc = rounded.toFixed(1) + ' grams (2 tbsp)';
  else if (tbsp === 3)   fracDesc = rounded.toFixed(1) + ' grams (3 tbsp)';
  else if (tbsp === 4)   fracDesc = rounded.toFixed(1) + ' grams (4 tbsp = ¼ cup)';
  else if (tbsp === 8)   fracDesc = rounded.toFixed(1) + ' grams (8 tbsp = ½ cup)';

  card.querySelector('#grams-output-frac').innerText = fracDesc;
}


/* ============================================================
   SECTION D — Tsp → Grams  (leaveners & spices)
   ============================================================ */

function calculateTspToGrams(buttonElement) {
  var card        = buttonElement.closest('.calculator-card');
  var defaultTsp  = parseFloat(card.getAttribute('data-default-tsp')) || 1;
  var raw         = parseFloat(card.querySelector('#tsp-input').value);
  var tsp         = isNaN(raw) ? defaultTsp : raw;

  if (tsp <= 0) {
    card.querySelector('#grams-output').innerText      = '0';
    card.querySelector('#grams-output-frac').innerText  = '0 g';
    return;
  }

  var gramsPerTsp = parseFloat(card.querySelector('#ingredient-type').value) || 4.6;
  var grams       = tsp * gramsPerTsp;
  var rounded     = Math.round(grams * 10) / 10;

  card.querySelector('#grams-output').innerText = rounded.toFixed(1);

  var fracDesc = '≈ ' + rounded.toFixed(1) + ' g';
  if (tsp === 1)       fracDesc = rounded.toFixed(1) + ' grams';
  else if (tsp === 0.5)  fracDesc = '≈ ' + rounded.toFixed(1) + ' g (half teaspoon)';
  else if (tsp === 0.25) fracDesc = '≈ ' + rounded.toFixed(1) + ' g (quarter teaspoon)';
  else if (tsp === 2)    fracDesc = rounded.toFixed(1) + ' grams (2 tsp)';
  else if (tsp === 3)    fracDesc = rounded.toFixed(1) + ' grams (3 tsp = 1 tbsp)';

  card.querySelector('#grams-output-frac').innerText = fracDesc;
}


/* ============================================================
   SECTION E — Fluid Oz → mL  (US customary: 1 fl oz = 29.57353 mL)
   ============================================================ */

function calculateLiquid(buttonElement) {
  var card  = buttonElement.closest('.calculator-card');
  var ozVal = parseFloat(card.querySelector('#oz-input').value);

  if (isNaN(ozVal) || ozVal <= 0) {
    card.querySelector('#ml-output').innerText = '0.00';
    return;
  }

  var mlConversion = ozVal * 29.57353;
  card.querySelector('#ml-output').innerText = mlConversion.toFixed(2);
}


/* ============================================================
   SECTION F — DOM auto-detect & fire initial calculation
   ============================================================ */

function convertOvenTemp() {
  var input = parseFloat(document.getElementById('temp-input').value);
  var from = document.getElementById('temp-from').value;
  if (isNaN(input)) { document.getElementById('temp-output-main').textContent = 'Please enter a number'; return; }

  var result, note, gas, fan;
  if (from === 'F') {
    result = Math.round((input - 32) * 5 / 9);
    gas = input <= 250 ? '½' : input <= 275 ? '1' : input <= 300 ? '2' : input <= 325 ? '3' : input <= 350 ? '4' : input <= 375 ? '5' : input <= 400 ? '6' : input <= 425 ? '7' : input <= 450 ? '8' : input <= 475 ? '9' : '10';
    fan = Math.round(result - 15);
    note = 'Gas Mark ' + gas + '. Fan oven: reduce to ' + fan + '°C.';
  } else {
    result = Math.round(input * 9 / 5 + 32);
    note = 'Standard baking reference. Fan ovens: reduce by 25°F.';
  }
  document.getElementById('temp-output-main').textContent = (from === 'F' ? result + '°C' : result + '°F');
  document.getElementById('temp-output-note').textContent = note;
}

document.addEventListener('DOMContentLoaded', function () {
  var btn = document.querySelector('.calculator-card .btn-calc');
  if (!btn) return;

  // Dispatch to the correct calculator based on which input IDs exist
  if (document.getElementById('flour-mass'))      calculateFlour(btn);
  else if (document.getElementById('sugar-mass')) calculateSugar(btn);
  else if (document.getElementById('butter-mass'))calculateButter(btn);
  else if (document.getElementById('oz-input'))    calculateLiquid(btn);
  else if (document.getElementById('cups-input'))  calculateCupsToGrams(btn);
  else if (document.getElementById('tbsp-input'))  calculateTbspToGrams(btn);
  else if (document.getElementById('tsp-input'))   calculateTspToGrams(btn);
});
