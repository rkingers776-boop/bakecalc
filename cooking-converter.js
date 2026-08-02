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
      var oz = parseFloat(ozIn.value);
      if (isNaN(oz) || oz <= 0) { mlOut.textContent = '—'; return; }
      mlOut.textContent = flozToMl(oz) + ' mL';
      if (cupsOut) cupsOut.textContent = (oz / 8).toFixed(2);
    }
    ozIn.addEventListener('input', update);
    update();
  }

  function bindTbspMl() {
    var tbspIn = document.getElementById('tbsp-input');
    var mlOut = document.getElementById('tbsp-ml-out');
    var tbspType = document.getElementById('tbsp-type');
    if (!tbspIn || !mlOut) return;
    function update() {
      var v = parseFloat(tbspIn.value);
      if (isNaN(v) || v <= 0) { mlOut.textContent = '—'; return; }
      var mlPerTbsp = tbspType ? parseFloat(tbspType.value) : 14.7868;
      mlOut.textContent = (v * mlPerTbsp).toFixed(1) + ' mL';
    }
    tbspIn.addEventListener('input', update);
    if (tbspType) tbspType.addEventListener('change', update);
    update();
  }

  function bindCupsMl() {
    var cupsIn = document.getElementById('cups-input');
    var mlOut = document.getElementById('cups-ml-out');
    var cupType = document.getElementById('cup-type');
    if (!cupsIn || !mlOut) return;
    function update() {
      var v = parseFloat(cupsIn.value);
      if (isNaN(v) || v <= 0) { mlOut.textContent = '—'; return; }
      var mlPerCup = cupType ? parseFloat(cupType.value) : 236.588;
      mlOut.textContent = (v * mlPerCup).toFixed(1) + ' mL';
    }
    cupsIn.addEventListener('input', update);
    if (cupType) cupType.addEventListener('change', update);
    update();
  }

  function bindGramsOz() {
    var gIn = document.getElementById('grams-input');
    var ozOut = document.getElementById('grams-oz-out');
    if (!gIn || !ozOut) return;
    function update() {
      var v = parseFloat(gIn.value);
      if (isNaN(v) || v <= 0) { ozOut.textContent = '—'; return; }
      ozOut.textContent = gToOz(v) + ' oz';
    }
    gIn.addEventListener('input', update);
    update();
  }

  function bindLbsKg() {
    var lbsIn = document.getElementById('lbs-input');
    var kgOut = document.getElementById('lbs-kg-out');
    if (!lbsIn || !kgOut) return;
    function update() {
      var v = parseFloat(lbsIn.value);
      if (isNaN(v) || v <= 0) { kgOut.textContent = '—'; return; }
      kgOut.textContent = lbsToKg(v) + ' kg';
    }
    lbsIn.addEventListener('input', update);
    update();
  }

  function bindCupsToGrams() {
    var cupsIn = document.getElementById('cg-cups-input');
    var ingSel = document.getElementById('cg-ingredient');
    var gOut = document.getElementById('cg-grams-out');
    if (!cupsIn || !ingSel || !gOut) return;
    function update() {
      var cups = parseFloat(cupsIn.value);
      var ing = ingSel.value;
      if (isNaN(cups) || cups <= 0) { gOut.textContent = '—'; return; }
      gOut.textContent = cupsToGrams(cups, ing) + ' g';
    }
    cupsIn.addEventListener('input', update);
    ingSel.addEventListener('change', update);
    update();
  }

  function init() {
    bindFluidOz();
    bindTbspMl();
    bindCupsMl();
    bindGramsOz();
    bindLbsKg();
    bindCupsToGrams();
  }

  return { init: init, flozToMl: flozToMl, ozToG: ozToG, lbsToKg: lbsToKg, cupsToGrams: cupsToGrams };
})();

document.addEventListener('DOMContentLoaded', function() {
  CookingConverter.init();
});
