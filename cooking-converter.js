/* ============================================================
   BakeCalc Club — Universal Cooking Converter v1
   All-in-one: oz↔ml, tbsp↔ml, cups↔ml, g↔oz, lbs↔kg
   Each conversion type is a self-contained module.
   ============================================================ */

var CookingConverter = (function() {
  'use strict';

  /* ---- shared helpers ---- */
  function round3(n) { return Math.round(n * 1000) / 1000; }
  function round2(n) { return Math.round(n * 100) / 100; }
  function round1(n) { return Math.round(n * 10) / 10; }

  /* ---- fluid oz ↔ ml ---- */
  function flozToMl(oz) {
    return round2(oz * 29.5735);
  }
  function mlToFloz(ml) {
    return round2(ml / 29.5735);
  }

  /* ---- tbsp ↔ ml ---- */
  function tbspToMl(tbsp) {
    return round2(tbsp * 14.7868);
  }
  function mlToTbsp(ml) {
    return round2(ml / 14.7868);
  }

  /* ---- cups ↔ ml ---- */
  function cupsToMl(cups) {
    return Math.round(cups * 236.588);
  }
  function mlToCups(ml) {
    return round3(ml / 236.588);
  }

  /* ---- grams ↔ oz (weight) ---- */
  function gToOz(g) {
    return round2(g / 28.3495);
  }
  function ozToG(oz) {
    return Math.round(oz * 28.3495);
  }

  /* ---- lbs ↔ kg ---- */
  function lbsToKg(lbs) {
    return round2(lbs * 0.453592);
  }
  function kgToLbs(kg) {
    return round2(kg / 0.453592);
  }

  /* ---- cups → grams for common ingredients ---- */
  var CUP_DENSITIES = {
    'all-purpose-flour': 120,
    'bread-flour': 130,
    'cake-flour': 110,
    'granulated-sugar': 200,
    'brown-sugar-packed': 220,
    'powdered-sugar': 120,
    'butter': 227,
    'water': 236,
    'milk': 244,
    'vegetable-oil': 218,
    'honey': 340,
    'maple-syrup': 315,
    'cocoa-powder': 100,
    'rolled-oats': 90,
    'almond-flour': 96,
    'cornstarch': 128,
    'rice-uncooked': 200,
    'cream-cheese': 232,
    'yogurt': 245,
    'sour-cream': 240
  };

  function cupsToGrams(cups, ingredient) {
    var density = CUP_DENSITIES[ingredient] || 236;
    return Math.round(cups * density);
  }

  /* ---- DOM binding ---- */
  function bindFluidOz() {
    var ozIn = document.getElementById('floz-input');
    var mlOut = document.getElementById('floz-ml-out');
    var cupsOut = document.getElementById('floz-cups-out');
    if (!ozIn || !mlOut) return;

    function update() {
      var v = parseFloat(ozIn.value);
      if (isNaN(v) || v <= 0) { mlOut.textContent = '—'; return; }
      mlOut.textContent = flozToMl(v) + ' mL';
      if (cupsOut) cupsOut.textContent = (v / 8).toFixed(2);
    }
    ozIn.addEventListener('input', update);
    update();
  }

  /* ---- reverse-mode input bindings (mL → oz, etc.) ---- */
  function bindMlToFloz() {
    var mlIn = document.getElementById('ml-floz-input');
    var ozOut = document.getElementById('ml-floz-oz-out');
    if (!mlIn || !ozOut) return;
    function update() {
      var v = parseFloat(mlIn.value);
      if (isNaN(v) || v <= 0) { ozOut.textContent = '—'; return; }
      ozOut.textContent = mlToFloz(v) + ' fl oz';
    }
    mlIn.addEventListener('input', update);
    update();
  }

  function bindMlToTbsp() {
    var mlIn = document.getElementById('ml-tbsp-input');
    var tbspOut = document.getElementById('ml-tbsp-out');
    var tbspType = document.getElementById('ml-tbsp-type');
    if (!mlIn || !tbspOut) return;
    function update() {
      var v = parseFloat(mlIn.value);
      if (isNaN(v) || v <= 0) { tbspOut.textContent = '—'; return; }
      var mlPerTbsp = tbspType ? parseFloat(tbspType.value) : 14.7868;
      tbspOut.textContent = (v / mlPerTbsp).toFixed(2) + ' tbsp';
    }
    mlIn.addEventListener('input', update);
    if (tbspType) tbspType.addEventListener('change', update);
    update();
  }

  function bindMlToCups() {
    var mlIn = document.getElementById('ml-cups-input');
    var cupsOut = document.getElementById('ml-cups-out');
    var cupType = document.getElementById('ml-cup-type');
    if (!mlIn || !cupsOut) return;
    function update() {
      var v = parseFloat(mlIn.value);
      if (isNaN(v) || v <= 0) { cupsOut.textContent = '—'; return; }
      var mlPerCup = cupType ? parseFloat(cupType.value) : 236.588;
      cupsOut.textContent = (v / mlPerCup).toFixed(3) + ' cups';
    }
    mlIn.addEventListener('input', update);
    if (cupType) cupType.addEventListener('change', update);
    update();
  }

  function bindOzToGrams() {
    var ozIn = document.getElementById('oz-grams-input');
    var gOut = document.getElementById('oz-grams-out');
    if (!ozIn || !gOut) return;
    function update() {
      var v = parseFloat(ozIn.value);
      if (isNaN(v) || v <= 0) { gOut.textContent = '—'; return; }
      gOut.textContent = ozToG(v) + ' g';
    }
    ozIn.addEventListener('input', update);
    update();
  }

  function bindKgToLbs() {
    var kgIn = document.getElementById('kg-lbs-input');
    var lbsOut = document.getElementById('kg-lbs-out');
    if (!kgIn || !lbsOut) return;
    function update() {
      var v = parseFloat(kgIn.value);
      if (isNaN(v) || v <= 0) { lbsOut.textContent = '—'; return; }
      lbsOut.textContent = kgToLbs(v) + ' lbs';
    }
    kgIn.addEventListener('input', update);
    update();
  }

  function bindGramsToCups() {
    var gIn = document.getElementById('gc-grams-input');
    var ingSel = document.getElementById('gc-ingredient');
    var cupsOut = document.getElementById('gc-cups-out');
    if (!gIn || !ingSel || !cupsOut) return;
    function update() {
      var grams = parseFloat(gIn.value);
      var ing = ingSel.value;
      if (isNaN(grams) || grams <= 0) { cupsOut.textContent = '—'; return; }
      var density = CUP_DENSITIES[ing] || 236;
      cupsOut.textContent = (grams / density).toFixed(3) + ' cups';
    }
    gIn.addEventListener('input', update);
    ingSel.addEventListener('change', update);
    update();
  }

  /* ---- reverse-mode toggling ---- */
  function initToggle(btnId, forwardId, reverseId) {
    var btn = document.getElementById(btnId);
    var fwd = document.getElementById(forwardId);
    var rev = document.getElementById(reverseId);
    if (!btn || !fwd || !rev) return;
    btn.addEventListener('click', function () {
      var isReverse = rev.style.display !== 'none';
      rev.style.display = isReverse ? 'none' : '';
      fwd.style.display = isReverse ? '' : 'none';
      btn.textContent = isReverse ? '⇄ Switch direction' : '⇄ Switch back';
    });
  }

  function init() {
    bindFluidOz();
    bindTbspMl();
    bindCupsMl();
    bindGramsOz();
    bindLbsKg();
    bindCupsToGrams();
    bindMlToFloz();
    bindMlToTbsp();
    bindMlToCups();
    bindOzToGrams();
    bindKgToLbs();
    bindGramsToCups();

    initToggle('toggle-floz', 'floz-forward', 'floz-reverse');
    initToggle('toggle-tbsp', 'tbsp-forward', 'tbsp-reverse');
    initToggle('toggle-cups', 'cups-forward', 'cups-reverse');
    initToggle('toggle-g-oz', 'goz-forward', 'goz-reverse');
    initToggle('toggle-lbs', 'lbs-forward', 'lbs-reverse');
    initToggle('toggle-cg', 'cg-forward', 'cg-reverse');
  }

  return { init: init, flozToMl: flozToMl, mlToFloz: mlToFloz, ozToG: ozToG, lbsToKg: lbsToKg, cupsToGrams: cupsToGrams };
})();

document.addEventListener('DOMContentLoaded', function() {
  CookingConverter.init();
});
