/* BakeCalc Club — pizza dough calculator.
   Method: ball weight (oz) = pan area (in2) x thickness factor (oz/in2).
   Recipe is rebuilt from the ball weight by baker's percentage:
   flour = total dough / (1 + water + salt + oil + sugar + yeast).
   Style factors, ferment schedules and yeast multipliers all live in DATA,
   which _pins/build_pizza_calc.py writes from _pins/_pizza_data.json so the
   printed tables and this script can never disagree. Do not hand-edit DATA. */
(function () {
    'use strict';

var DATA = {"gPerOz":28.3495,"styles":[{"key":"thin","label":"Thin & crispy","tf":0.065,"hyd":58,"salt":2.0,"oil":1.0,"sugar":1.0},{"key":"neapolitan","label":"Neapolitan","tf":0.078,"hyd":60,"salt":2.8,"oil":0,"sugar":0},{"key":"ny","label":"New York","tf":0.09,"hyd":62,"salt":2.5,"oil":2.0,"sugar":1.0},{"key":"detroit","label":"Pan / Detroit","tf":0.135,"hyd":67,"salt":2.5,"oil":3.0,"sugar":1.0},{"key":"sicilian","label":"Sicilian","tf":0.145,"hyd":70,"salt":2.5,"oil":3.0,"sugar":0},{"key":"deepdish","label":"Deep dish (base only)","tf":0.16,"hyd":65,"salt":2.2,"oil":6.0,"sugar":1.0}],"ferments":[{"key":"same","label":"Same day","idy":0.5},{"key":"h24","label":"24 h cold","idy":0.3},{"key":"h48","label":"48 h cold","idy":0.2},{"key":"h72","label":"72 h cold","idy":0.1},{"key":"h96","label":"96 h cold","idy":0.05}],"yeastForms":[{"key":"idy","label":"Instant (IDY)","factor":1.0},{"key":"ady","label":"Active dry (ADY)","factor":1.0},{"key":"fresh","label":"Fresh cake","factor":2.71}]};

    var el = {
        shape: document.getElementById('pd-shape'),
        style: document.getElementById('pd-style'),
        diameter: document.getElementById('pd-diameter'),
        pizzas: document.getElementById('pd-pizzas'),
        length: document.getElementById('pd-length'),
        width: document.getElementById('pd-width'),
        roundRow: document.getElementById('pd-round-row'),
        rectRow: document.getElementById('pd-rect-row'),
        styleNote: document.getElementById('pd-style-note'),

        ball: document.getElementById('pd-ball'),
        ballOz: document.getElementById('pd-balloz'),
        area: document.getElementById('pd-area'),
        tf: document.getElementById('pd-tf'),
        flourInBall: document.getElementById('pd-flour'),
        totalDough: document.getElementById('pd-totaldough'),
        totalFlour: document.getElementById('pd-totalflour'),
        note: document.getElementById('pd-note'),

        ferment: document.getElementById('pd-ferment'),
        yeastForm: document.getElementById('pd-yeastform'),
        hyd: document.getElementById('pd-hyd'),
        salt: document.getElementById('pd-salt'),
        oil: document.getElementById('pd-oil'),
        sugar: document.getElementById('pd-sugar'),

        rFlour: document.getElementById('pd-r-flour'),
        rWater: document.getElementById('pd-r-water'),
        rSalt: document.getElementById('pd-r-salt'),
        rYeast: document.getElementById('pd-r-yeast'),
        rYeastLabel: document.getElementById('pd-r-yeastlabel'),
        rOil: document.getElementById('pd-r-oil'),
        rSugar: document.getElementById('pd-r-sugar'),
        rNote: document.getElementById('pd-rnote'),

        rvWeight: document.getElementById('pd-rv-weight'),
        rvDiameter: document.getElementById('pd-rv-diameter'),
        rvTf: document.getElementById('pd-rv-tf'),
        rvMatch: document.getElementById('pd-rv-match'),
        rvScale: document.getElementById('pd-rv-scale')
    };

    if (!el.shape || !el.style) return;

    var G_PER_OZ = DATA.gPerOz;

    function num(input, fallback) {
        var v = parseFloat(input && input.value);
        return isFinite(v) ? v : fallback;
    }

    function fill(select, items, valueKey, labelKey) {
        select.innerHTML = '';
        for (var i = 0; i < items.length; i++) {
            var opt = document.createElement('option');
            opt.value = items[i][valueKey];
            opt.textContent = items[i][labelKey];
            select.appendChild(opt);
        }
    }

    function findStyle(key) {
        for (var i = 0; i < DATA.styles.length; i++) {
            if (DATA.styles[i].key === key) return DATA.styles[i];
        }
        return DATA.styles[0];
    }

    function currentFerment() {
        var key = el.ferment.value;
        for (var i = 0; i < DATA.ferments.length; i++) {
            if (DATA.ferments[i].key === key) return DATA.ferments[i];
        }
        return DATA.ferments[0];
    }

    function currentYeastForm() {
        var key = el.yeastForm.value;
        for (var i = 0; i < DATA.yeastForms.length; i++) {
            if (DATA.yeastForms[i].key === key) return DATA.yeastForms[i];
        }
        return DATA.yeastForms[0];
    }

    function fmtInt(n) {
        var r = Math.round(n);
        return r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function fmt1(n) {
        return n.toFixed(1);
    }

    /* grams small enough that one decimal hides the number */
    function fmtSmall(n) {
        if (n < 1) return n.toFixed(2);
        return n.toFixed(1);
    }

    function panArea() {
        if (el.shape.value === 'rect') {
            return Math.max(1, num(el.length, 13)) * Math.max(1, num(el.width, 18));
        }
        var d = Math.max(1, num(el.diameter, 12));
        return Math.PI * Math.pow(d / 2, 2);
    }

    function areaText(area) {
        return (Math.round(area * 10) / 10).toString() + ' in\u00B2';
    }

    function compute() {
        var style = findStyle(el.style.value);
        var area = panArea();
        var ballOz = area * style.tf;
        var ballG = ballOz * G_PER_OZ;
        var pizzas = Math.max(1, Math.round(num(el.pizzas, 1)));
        var totalG = ballG * pizzas;

        var hyd = Math.max(0, num(el.hyd, style.hyd));
        var saltPct = Math.max(0, num(el.salt, style.salt));
        var oilPct = Math.max(0, num(el.oil, style.oil));
        var sugarPct = Math.max(0, num(el.sugar, style.sugar));
        var ferment = currentFerment();
        var form = currentYeastForm();
        var yeastPct = ferment.idy;

        /* every percentage is against the flour weight, so the flour is the
           total divided by the sum of all of them plus the 100% for flour */
        var divisor = 1 + hyd / 100 + saltPct / 100 + oilPct / 100 + sugarPct / 100 + yeastPct / 100;
        var flour = totalG / divisor;
        var flourPerBall = flour / pizzas;

        el.ball.textContent = fmtInt(ballG);
        el.ballOz.textContent = fmt1(ballOz) + ' oz';
        el.area.textContent = areaText(area);
        el.tf.textContent = style.tf.toFixed(3);
        el.flourInBall.textContent = fmtInt(flourPerBall) + ' g';
        el.totalDough.textContent = fmtInt(totalG) + ' g';
        el.totalFlour.textContent = fmtInt(flour) + ' g';

        var sizeText = el.shape.value === 'rect'
            ? num(el.length, 13) + ' \u00D7 ' + num(el.width, 18) + '-inch pan'
            : num(el.diameter, 12) + '-inch round';
        el.note.textContent = sizeText + ' at ' + style.label +
            ', ' + pizzas + (pizzas === 1 ? ' pizza' : ' pizzas') + '.';

        el.rFlour.textContent = fmtInt(flour) + ' g';
        el.rWater.textContent = fmtInt(flour * hyd / 100) + ' g';
        el.rSalt.textContent = fmt1(flour * saltPct / 100) + ' g';
        el.rYeast.textContent = fmtSmall(flour * yeastPct / 100 * form.factor) + ' g';
        el.rOil.textContent = fmt1(flour * oilPct / 100) + ' g';
        el.rSugar.textContent = fmt1(flour * sugarPct / 100) + ' g';
        el.rYeastLabel.textContent = form.label;

        el.rNote.textContent = yeastPct + '% instant-equivalent yeast for ' +
            ferment.label.toLowerCase() + '. Percentages are against the flour weight.';

        el.styleNote.textContent = style.label + ': ' + style.blurb;
    }

    function computeReverse() {
        var weight = Math.max(1, num(el.rvWeight, 280));
        var diameter = Math.max(1, num(el.rvDiameter, 12));
        var area = Math.PI * Math.pow(diameter / 2, 2);
        var tf = (weight / G_PER_OZ) / area;

        el.rvTf.textContent = tf.toFixed(3);

        var verdict;
        if (tf < 0.075) verdict = 'Thinner than most published tables. Cracker territory.';
        else if (tf < 0.085) verdict = 'Just under New York. Thin end of a foldable slice.';
        else if (tf <= 0.095) verdict = 'Right in New York territory, where Lehmann\u2019s 12-inch example landed.';
        else if (tf <= 0.11) verdict = 'A thick New York or a light pan pizza.';
        else if (tf <= 0.13) verdict = 'Pan territory. Expect a bready crumb, not a foldable slice.';
        else verdict = 'Detroit or Sicilian loading. Build it in the pan.';
        el.rvMatch.textContent = verdict;

        var sizes = [10, 12, 14, 16];
        var parts = [];
        for (var i = 0; i < sizes.length; i++) {
            var a = Math.PI * Math.pow(sizes[i] / 2, 2);
            parts.push(sizes[i] + ' in. ' + fmtInt(a * tf * G_PER_OZ) + ' g');
        }
        el.rvScale.textContent = 'At that loading: ' + parts.join(' \u00B7 ');
    }

    function applyStyleDefaults() {
        var style = findStyle(el.style.value);
        el.hyd.value = style.hyd;
        el.salt.value = style.salt;
        el.oil.value = style.oil;
        el.sugar.value = style.sugar;
    }

    function toggleShape() {
        var rect = el.shape.value === 'rect';
        el.roundRow.style.display = rect ? 'none' : '';
        el.rectRow.style.display = rect ? '' : 'none';
    }

    fill(el.style, DATA.styles, 'key', 'label');
    fill(el.ferment, DATA.ferments, 'key', 'label');
    fill(el.yeastForm, DATA.yeastForms, 'key', 'label');

    /* default to New York, 48-hour cold ferment */
    el.style.value = 'ny';
    el.ferment.value = 'h48';

    applyStyleDefaults();
    toggleShape();
    compute();
    computeReverse();

    el.shape.addEventListener('change', function () {
        toggleShape();
        compute();
    });

    el.style.addEventListener('change', function () {
        applyStyleDefaults();
        compute();
    });

    [el.diameter, el.pizzas, el.length, el.width, el.hyd, el.salt, el.oil, el.sugar]
        .forEach(function (input) {
            input.addEventListener('input', compute);
            input.addEventListener('change', compute);
        });

    el.ferment.addEventListener('change', compute);
    el.yeastForm.addEventListener('change', compute);

    [el.rvWeight, el.rvDiameter].forEach(function (input) {
        input.addEventListener('input', computeReverse);
        input.addEventListener('change', computeReverse);
    });
})();
