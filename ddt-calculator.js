/* ============================================================
   BakeCalc Club — Desired Dough Temperature (DDT) Calculator v1
   Water temp = (DDT × factor) − Room − Flour − Friction − (Preferment)
   Straight dough: factor 3. With preferment: factor 4.
   All computation runs locally in the browser.
   ============================================================ */

var DDTCalc = (function () {
  'use strict';

  /* ---- Mixing friction presets (°C rise during mix) ----
     Sources: King Arthur Baking measurements, industry references */
  var FRICTION_C = {
    hand: 3,
    kitchenaid: 12,
    spiral: 8,
    custom: 0
  };

  /* ---- DDT presets by dough type (°C) ---- */
  var DDT_PRESETS = [
    { name: 'Sourdough bread',     low: 23, high: 25 },
    { name: 'Lean bread (baguette, pain de mie)', low: 24, high: 26 },
    { name: 'Ciabatta / high-hydration', low: 24, high: 25 },
    { name: 'Enriched bread (milk, egg)', low: 25, high: 27 },
    { name: 'Brioche',             low: 20, high: 22 },
    { name: 'Pizza (long cold ferment)', low: 22, high: 24 },
    { name: 'Pizza (same-day)',    low: 24, high: 26 },
    { name: 'Rye bread',           low: 26, high: 28 }
  ];

  var state = {
    unit: 'C',
    method: 'straight',       // straight | preferment
    friction: 'kitchenaid'
  };

  function toC(f) { return (f - 32) * 5 / 9; }
  function toF(c) { return c * 9 / 5 + 32; }

  function displayTemp(c, decimals) {
    if (state.unit === 'C') return c.toFixed(decimals === undefined ? 1 : decimals);
    return toF(c).toFixed(decimals === undefined ? 1 : decimals);
  }

  /* ---- Core calculation: returns water temp in °C ---- */
  function calculate() {
    var ddt = parseFloat(document.getElementById('ddt-input').value);
    var room = parseFloat(document.getElementById('room-temp').value);
    var flour = parseFloat(document.getElementById('flour-temp').value);
    var frictionC = FRICTION_C[state.friction] || 0;
    if (state.friction === 'custom') {
      frictionC = parseFloat(document.getElementById('friction-custom').value) || 0;
    }

    var preferment = 0;
    if (state.method === 'preferment') {
      preferment = parseFloat(document.getElementById('preferment-temp').value) || 0;
    }

    if (isNaN(ddt) || isNaN(room) || isNaN(flour) || ddt <= 0) return null;

    var factor = state.method === 'preferment' ? 4 : 3;
    var water = ddt * factor - room - flour - frictionC - preferment;
    return {
      waterC: water,
      factor: factor,
      frictionC: frictionC,
      ddt: ddt,
      room: room,
      flour: flour,
      preferment: preferment
    };
  }

  /* ---- Render ---- */
  function render() {
    var r = calculate();
    var res = document.getElementById('ddt-result');
    if (!r) {
      if (res) res.style.display = 'none';
      return;
    }

    var waterEl = document.getElementById('ddt-water');
    var formEl = document.getElementById('ddt-formula');
    var warnEl = document.getElementById('ddt-warning');
    var warnText = document.getElementById('ddt-warning-text');

    res.style.display = 'block';
    waterEl.textContent = displayTemp(r.waterC) + '°' + state.unit;

    /* formula breakdown */
    var parts = [];
    parts.push(state.unit === 'C'
      ? r.ddt.toFixed(1) + ' × ' + r.factor
      : toF(r.ddt).toFixed(1) + ' × ' + r.factor);
    var subs = [];
    if (state.unit === 'C') {
      subs.push(r.room.toFixed(1), r.flour.toFixed(1), r.frictionC.toFixed(1));
      if (state.method === 'preferment') subs.push(r.preferment.toFixed(1));
    } else {
      subs.push(toF(r.room).toFixed(1), toF(r.flour).toFixed(1), toF(r.frictionC).toFixed(1));
      if (state.method === 'preferment') subs.push(toF(r.preferment).toFixed(1));
    }
    formEl.textContent = parts[0] + ' − ' + subs.join(' − ');

    /* warnings */
    var warns = [];
    if (r.waterC < 0) {
      warns.push(state.unit === 'C' ? 'Calculated water temperature is below freezing. Chill your flour or lower your DDT — or the dough will never warm up during mix.'
        : 'Calculated water temperature is below freezing. Chill your flour or lower your DDT.');
    }
    if (r.waterC > 45) {
      warns.push('Water above 45°C (113°F) can kill your yeast. Warm your flour or raise the room temperature instead — never use water hotter than 45°C.');
    }
    if (r.waterC >= 0 && r.waterC <= 45 && state.unit === 'C' && r.waterC > 35) {
      warns.push('Warm water is fine, but watch the rise — high water temperature speeds fermentation significantly.');
    }

    if (warns.length > 0) {
      warnEl.style.display = 'block';
      warnText.innerHTML = warns.join('<br>');
    } else {
      warnEl.style.display = 'none';
    }
  }

  /* ---- Preset fill ---- */
  function fillPreset() {
    var sel = document.getElementById('ddt-preset');
    var name = sel.options[sel.selectedIndex].value;
    for (var i = 0; i < DDT_PRESETS.length; i++) {
      if (DDT_PRESETS[i].name === name) {
        var mid = (DDT_PRESETS[i].low + DDT_PRESETS[i].high) / 2;
        var ddtInput = document.getElementById('ddt-input');
        ddtInput.value = state.unit === 'C' ? mid.toFixed(1) : toF(mid).toFixed(1);
        /* show range hint */
        var hint = document.getElementById('ddt-preset-hint');
        hint.textContent = 'Recommended range: ' + (state.unit === 'C' ? DDT_PRESETS[i].low + '–' + DDT_PRESETS[i].high + '°C' : toF(DDT_PRESETS[i].low).toFixed(0) + '–' + toF(DDT_PRESETS[i].high).toFixed(0) + '°F');
        render();
        return;
      }
    }
  }

  function setMethod(m) {
    state.method = m;
    var preferRow = document.getElementById('preferment-row');
    if (preferRow) preferRow.style.display = m === 'preferment' ? 'flex' : 'none';
    var factorNote = document.getElementById('ddt-factor-note');
    if (factorNote) {
      factorNote.textContent = m === 'preferment'
        ? 'Formula: Water = (DDT × 4) − Room − Flour − Friction − Preferment'
        : 'Formula: Water = (DDT × 3) − Room − Flour − Friction';
    }
    render();
  }

  function setFriction(m) {
    state.friction = m;
    var customRow = document.getElementById('friction-custom-row');
    if (customRow) customRow.style.display = m === 'custom' ? 'flex' : 'none';
    render();
  }

  function setUnit(u) {
    state.unit = u;
    var inputs = ['ddt-input', 'room-temp', 'flour-temp', 'friction-custom', 'preferment-temp'];
    var unitSuffixes = {
      'ddt-input': 'ddt-unit', 'room-temp': 'room-unit', 'flour-temp': 'flour-unit',
      'friction-custom': 'friction-unit', 'preferment-temp': 'preferment-unit'
    };
    for (var i = 0; i < inputs.length; i++) {
      var el = document.getElementById(inputs[i]);
      var suffix = document.getElementById(unitSuffixes[inputs[i]]);
      if (suffix) suffix.textContent = '°' + u;
      if (!el || el.value === '') continue;
      var v = parseFloat(el.value);
      if (isNaN(v)) continue;
      el.value = u === 'C' ? toC(v).toFixed(1) : toF(v).toFixed(1);
    }
    render();
  }

  return {
    init: function () {
      var calcBtn = document.getElementById('ddt-calc-btn');
      if (calcBtn) {
        calcBtn.addEventListener('click', function (e) {
          e.preventDefault();
          render();
        });
      }
      var inputs = ['ddt-input', 'room-temp', 'flour-temp', 'friction-custom', 'preferment-temp'];
      for (var i = 0; i < inputs.length; i++) {
        var el = document.getElementById(inputs[i]);
        if (el) {
          el.addEventListener('input', function () {
            var res = document.getElementById('ddt-result');
            if (res && res.style.display === 'block') render();
          });
        }
      }

      var preset = document.getElementById('ddt-preset');
      if (preset) preset.addEventListener('change', fillPreset);

      var friction = document.getElementById('friction-method');
      if (friction) friction.addEventListener('change', function () { setFriction(friction.value); });

      /* seed defaults */
      var ddtInput = document.getElementById('ddt-input');
      if (ddtInput && ddtInput.value === '') ddtInput.value = '25';
      var roomEl = document.getElementById('room-temp');
      if (roomEl && roomEl.value === '') roomEl.value = '21';
      var flourEl = document.getElementById('flour-temp');
      if (flourEl && flourEl.value === '') flourEl.value = '21';
      var prefEl = document.getElementById('preferment-temp');
      if (prefEl && prefEl.value === '') prefEl.value = '22';

      setMethod('straight');
      setFriction('kitchenaid');
    },
    setMethod: setMethod,
    setUnit: setUnit,
    setFriction: setFriction,
    fillPreset: fillPreset
  };
})();

document.addEventListener('DOMContentLoaded', function () {
  DDTCalc.init();
});
