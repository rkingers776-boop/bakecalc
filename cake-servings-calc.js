/* BakeCalc Club — cake servings calculator.
   Figures come from Wilton's published cake serving chart (4-inch-high cakes,
   two 2-inch layers) and their separate 3-inch-deep pan chart.
   Party cut ~1.5 x 2 in, wedding cut ~1 x 2 in. Under 3 inches tall, halve it.

   {"shapes":[{"key":"round","label":"Round","pans":[{"size":"4 in.","party":8,"wedding":8,"cups":0.75,"temp":"350F","time":"22-26","icing":1.5},{"size":"6 in.","party":12,"wedding":12,"cups":2.25,"temp":"350F","time":"35-40","icing":2.5},{"size":"8 in.","party":20,"wedding":24,"cups":4,"temp":"350F","time":"37-42","icing":3.5},{"size":"9 in.","party":24,"wedding":32,"cups":5,"temp":"350F","time":"40-45","icing":4},{"size":"10 in.","party":28,"wedding":38,"cups":6,"temp":"350F","time":"40-45","icing":5},{"size":"12 in.","party":40,"wedding":56,"cups":8,"temp":"350F","time":"40-45","icing":6},{"size":"14 in.","party":63,"wedding":78,"cups":11.5,"temp":"325F","time":"50-55","icing":8.5},{"size":"16 in.","party":77,"wedding":100,"cups":16,"temp":"325F","time":"55-60","icing":9.5}]},{"key":"square","label":"Square","pans":[{"size":"6 in.","party":12,"wedding":18,"cups":3,"temp":"350F","time":"40-45","icing":3.5},{"size":"8 in.","party":20,"wedding":32,"cups":6,"temp":"350F","time":"45-50","icing":4.5},{"size":"10 in.","party":30,"wedding":50,"cups":9,"temp":"350F","time":"50-55","icing":6},{"size":"12 in.","party":48,"wedding":72,"cups":11.5,"temp":"325F","time":"55-60","icing":7.5},{"size":"14 in.","party":63,"wedding":98,"cups":16,"temp":"325F","time":"55-60","icing":9},{"size":"16 in.","party":80,"wedding":128,"cups":22,"temp":"325F","time":"60-70","icing":11.5}]},{"key":"sheet","label":"Sheet pan","pans":[{"size":"7 x 11 in.","party":24,"wedding":32,"cups":5.5,"temp":"350F","time":"45-50","icing":5},{"size":"9 x 13 in.","party":36,"wedding":50,"cups":10,"temp":"350F","time":"40-45","icing":7},{"size":"11 x 15 in.","party":54,"wedding":74,"cups":11.5,"temp":"325F","time":"50-55","icing":9},{"size":"12 x 18 in.","party":72,"wedding":98,"cups":16,"temp":"325F","time":"55-60","icing":11}]},{"key":"heart","label":"Heart","pans":[{"size":"6 in.","party":8,"wedding":14,"cups":2,"temp":"350F","time":"30-35","icing":3},{"size":"8 in.","party":18,"wedding":22,"cups":4,"temp":"350F","time":"40-45","icing":4},{"size":"9 in.","party":20,"wedding":28,"cups":4.25,"temp":"350F","time":"40-45","icing":5.5},{"size":"10 in.","party":24,"wedding":38,"cups":6.5,"temp":"350F","time":"45-50","icing":7},{"size":"12 in.","party":24,"wedding":56,"cups":9.25,"temp":"325F","time":"55-60","icing":8.5},{"size":"14 in.","party":48,"wedding":72,"cups":13.5,"temp":"325F","time":"55-60","icing":9.5},{"size":"16 in.","party":64,"wedding":94,"cups":17,"temp":"325F","time":"60-65","icing":13}]},{"key":"oval","label":"Oval","pans":[{"size":"7.75 x 5.5 in.","party":9,"wedding":13,"cups":2.75,"temp":"350F","time":"30-35","icing":2.5},{"size":"10.75 x 7.8 in.","party":20,"wedding":26,"cups":5,"temp":"350F","time":"40-45","icing":4},{"size":"13.5 x 9.8 in.","party":30,"wedding":45,"cups":8.25,"temp":"325F","time":"50-55","icing":5.5},{"size":"16.5 x 12.4 in.","party":44,"wedding":70,"cups":13.25,"temp":"325F","time":"50-55","icing":7.5}]},{"key":"petal","label":"Petal","pans":[{"size":"6 in.","party":6,"wedding":8,"cups":1.5,"temp":"350F","time":"30-35","icing":3},{"size":"9 in.","party":14,"wedding":18,"cups":3.75,"temp":"350F","time":"35-40","icing":4.5},{"size":"12 in.","party":38,"wedding":40,"cups":7.25,"temp":"350F","time":"45-50","icing":6},{"size":"15 in.","party":48,"wedding":64,"cups":10.67,"temp":"325F","time":"55-60","icing":8}]},{"key":"hexagon","label":"Hexagon","pans":[{"size":"6 in.","party":10,"wedding":12,"cups":2,"temp":"350F","time":"30-35","icing":2.5},{"size":"9 in.","party":20,"wedding":26,"cups":4.5,"temp":"350F","time":"40-45","icing":4},{"size":"12 in.","party":34,"wedding":40,"cups":8,"temp":"350F","time":"50-55","icing":5.5},{"size":"15 in.","party":48,"wedding":70,"cups":14,"temp":"350F","time":"55-60","icing":7}]},{"key":"paisley","label":"Paisley","pans":[{"size":"9 x 6 in.","party":9,"wedding":13,"cups":2.75,"temp":"350F","time":"35-40","icing":4.5},{"size":"12.5 x 9.5 in.","party":28,"wedding":38,"cups":7,"temp":"350F","time":"45-50","icing":7},{"size":"16.5 x 12.5 in.","party":40,"wedding":56,"cups":10.5,"temp":"325F","time":"55-60","icing":9}]},{"key":"diamond","label":"Diamond","pans":[{"size":"10.25 x 7.4 in.","party":12,"wedding":18,"cups":3,"temp":"350F","time":"30-35","icing":3},{"size":"15 x 11 in.","party":20,"wedding":32,"cups":6,"temp":"350F","time":"45-50","icing":6},{"size":"19.25 x 14.25 in.","party":42,"wedding":66,"cups":11,"temp":"325F","time":"55-60","icing":9.5}]},{"key":"pillow","label":"Pillow","pans":[{"size":"6.75 x 6.75 in.","party":13,"wedding":19,"cups":2.5,"temp":"350F","time":"33-38","icing":3},{"size":"10 x 10 in.","party":30,"wedding":40,"cups":5.5,"temp":"350F","time":"39-44","icing":6.5},{"size":"13.25 x 13.25 in.","party":64,"wedding":72,"cups":10,"temp":"325F","time":"41-46","icing":9.5}]}],"tall":[{"size":"6 in.","party":12,"wedding":12,"cups":3,"temp":"350F","time":"40-45","icing":3.5},{"size":"8 in.","party":20,"wedding":24,"cups":5,"temp":"350F","time":"55-60","icing":4},{"size":"10 in.","party":28,"wedding":38,"cups":8,"temp":"350F","time":"55-60","icing":4.5},{"size":"12 in.","party":40,"wedding":56,"cups":10,"temp":"350F","time":"70-75","icing":5.25},{"size":"14 in.","party":63,"wedding":78,"cups":15,"temp":"325F","time":"60-65","icing":6.25},{"size":"16 in.","party":77,"wedding":100,"cups":18,"temp":"325F","time":"60-70","icing":7},{"size":"18 in. half","party":110,"wedding":146,"cups":12,"temp":"350F","time":"60-65","icing":7.5},{"size":"9 in. contour","party":11,"wedding":17,"cups":5.75,"temp":"350F","time":"55-60","icing":3}]} is replaced at build time from _pins/_cake_data.json so the printed
   tables and the calculator can never disagree. Do not hand-edit the blob. */
(function () {
    'use strict';

    var DATA = {"shapes":[{"key":"round","label":"Round","pans":[{"size":"4 in.","party":8,"wedding":8,"cups":0.75,"temp":"350F","time":"22-26","icing":1.5},{"size":"6 in.","party":12,"wedding":12,"cups":2.25,"temp":"350F","time":"35-40","icing":2.5},{"size":"8 in.","party":20,"wedding":24,"cups":4,"temp":"350F","time":"37-42","icing":3.5},{"size":"9 in.","party":24,"wedding":32,"cups":5,"temp":"350F","time":"40-45","icing":4},{"size":"10 in.","party":28,"wedding":38,"cups":6,"temp":"350F","time":"40-45","icing":5},{"size":"12 in.","party":40,"wedding":56,"cups":8,"temp":"350F","time":"40-45","icing":6},{"size":"14 in.","party":63,"wedding":78,"cups":11.5,"temp":"325F","time":"50-55","icing":8.5},{"size":"16 in.","party":77,"wedding":100,"cups":16,"temp":"325F","time":"55-60","icing":9.5}]},{"key":"square","label":"Square","pans":[{"size":"6 in.","party":12,"wedding":18,"cups":3,"temp":"350F","time":"40-45","icing":3.5},{"size":"8 in.","party":20,"wedding":32,"cups":6,"temp":"350F","time":"45-50","icing":4.5},{"size":"10 in.","party":30,"wedding":50,"cups":9,"temp":"350F","time":"50-55","icing":6},{"size":"12 in.","party":48,"wedding":72,"cups":11.5,"temp":"325F","time":"55-60","icing":7.5},{"size":"14 in.","party":63,"wedding":98,"cups":16,"temp":"325F","time":"55-60","icing":9},{"size":"16 in.","party":80,"wedding":128,"cups":22,"temp":"325F","time":"60-70","icing":11.5}]},{"key":"sheet","label":"Sheet pan","pans":[{"size":"7 x 11 in.","party":24,"wedding":32,"cups":5.5,"temp":"350F","time":"45-50","icing":5},{"size":"9 x 13 in.","party":36,"wedding":50,"cups":10,"temp":"350F","time":"40-45","icing":7},{"size":"11 x 15 in.","party":54,"wedding":74,"cups":11.5,"temp":"325F","time":"50-55","icing":9},{"size":"12 x 18 in.","party":72,"wedding":98,"cups":16,"temp":"325F","time":"55-60","icing":11}]},{"key":"heart","label":"Heart","pans":[{"size":"6 in.","party":8,"wedding":14,"cups":2,"temp":"350F","time":"30-35","icing":3},{"size":"8 in.","party":18,"wedding":22,"cups":4,"temp":"350F","time":"40-45","icing":4},{"size":"9 in.","party":20,"wedding":28,"cups":4.25,"temp":"350F","time":"40-45","icing":5.5},{"size":"10 in.","party":24,"wedding":38,"cups":6.5,"temp":"350F","time":"45-50","icing":7},{"size":"12 in.","party":24,"wedding":56,"cups":9.25,"temp":"325F","time":"55-60","icing":8.5},{"size":"14 in.","party":48,"wedding":72,"cups":13.5,"temp":"325F","time":"55-60","icing":9.5},{"size":"16 in.","party":64,"wedding":94,"cups":17,"temp":"325F","time":"60-65","icing":13}]},{"key":"oval","label":"Oval","pans":[{"size":"7.75 x 5.5 in.","party":9,"wedding":13,"cups":2.75,"temp":"350F","time":"30-35","icing":2.5},{"size":"10.75 x 7.8 in.","party":20,"wedding":26,"cups":5,"temp":"350F","time":"40-45","icing":4},{"size":"13.5 x 9.8 in.","party":30,"wedding":45,"cups":8.25,"temp":"325F","time":"50-55","icing":5.5},{"size":"16.5 x 12.4 in.","party":44,"wedding":70,"cups":13.25,"temp":"325F","time":"50-55","icing":7.5}]},{"key":"petal","label":"Petal","pans":[{"size":"6 in.","party":6,"wedding":8,"cups":1.5,"temp":"350F","time":"30-35","icing":3},{"size":"9 in.","party":14,"wedding":18,"cups":3.75,"temp":"350F","time":"35-40","icing":4.5},{"size":"12 in.","party":38,"wedding":40,"cups":7.25,"temp":"350F","time":"45-50","icing":6},{"size":"15 in.","party":48,"wedding":64,"cups":10.67,"temp":"325F","time":"55-60","icing":8}]},{"key":"hexagon","label":"Hexagon","pans":[{"size":"6 in.","party":10,"wedding":12,"cups":2,"temp":"350F","time":"30-35","icing":2.5},{"size":"9 in.","party":20,"wedding":26,"cups":4.5,"temp":"350F","time":"40-45","icing":4},{"size":"12 in.","party":34,"wedding":40,"cups":8,"temp":"350F","time":"50-55","icing":5.5},{"size":"15 in.","party":48,"wedding":70,"cups":14,"temp":"350F","time":"55-60","icing":7}]},{"key":"paisley","label":"Paisley","pans":[{"size":"9 x 6 in.","party":9,"wedding":13,"cups":2.75,"temp":"350F","time":"35-40","icing":4.5},{"size":"12.5 x 9.5 in.","party":28,"wedding":38,"cups":7,"temp":"350F","time":"45-50","icing":7},{"size":"16.5 x 12.5 in.","party":40,"wedding":56,"cups":10.5,"temp":"325F","time":"55-60","icing":9}]},{"key":"diamond","label":"Diamond","pans":[{"size":"10.25 x 7.4 in.","party":12,"wedding":18,"cups":3,"temp":"350F","time":"30-35","icing":3},{"size":"15 x 11 in.","party":20,"wedding":32,"cups":6,"temp":"350F","time":"45-50","icing":6},{"size":"19.25 x 14.25 in.","party":42,"wedding":66,"cups":11,"temp":"325F","time":"55-60","icing":9.5}]},{"key":"pillow","label":"Pillow","pans":[{"size":"6.75 x 6.75 in.","party":13,"wedding":19,"cups":2.5,"temp":"350F","time":"33-38","icing":3},{"size":"10 x 10 in.","party":30,"wedding":40,"cups":5.5,"temp":"350F","time":"39-44","icing":6.5},{"size":"13.25 x 13.25 in.","party":64,"wedding":72,"cups":10,"temp":"325F","time":"41-46","icing":9.5}]}],"tall":[{"size":"6 in.","party":12,"wedding":12,"cups":3,"temp":"350F","time":"40-45","icing":3.5},{"size":"8 in.","party":20,"wedding":24,"cups":5,"temp":"350F","time":"55-60","icing":4},{"size":"10 in.","party":28,"wedding":38,"cups":8,"temp":"350F","time":"55-60","icing":4.5},{"size":"12 in.","party":40,"wedding":56,"cups":10,"temp":"350F","time":"70-75","icing":5.25},{"size":"14 in.","party":63,"wedding":78,"cups":15,"temp":"325F","time":"60-65","icing":6.25},{"size":"16 in.","party":77,"wedding":100,"cups":18,"temp":"325F","time":"60-70","icing":7},{"size":"18 in. half","party":110,"wedding":146,"cups":12,"temp":"350F","time":"60-65","icing":7.5},{"size":"9 in. contour","party":11,"wedding":17,"cups":5.75,"temp":"350F","time":"55-60","icing":3}]};

    var shapeSel = document.getElementById('cs-shape');
    var panSel = document.getElementById('cs-pan');
    var cutSel = document.getElementById('cs-cut');
    var heightSel = document.getElementById('cs-height');
    var guestsInput = document.getElementById('cs-guests');
    if (!shapeSel || !panSel) return;

    var out = {
        servings: document.getElementById('cs-servings'),
        totalLabel: document.getElementById('cs-total-label'),
        other: document.getElementById('cs-other'),
        cups: document.getElementById('cs-cups'),
        cups2: document.getElementById('cs-cups2'),
        icing: document.getElementById('cs-icing'),
        temp: document.getElementById('cs-temp'),
        time: document.getElementById('cs-time'),
        note: document.getElementById('cs-note'),
        pans: document.getElementById('cs-pans'),
        pansNote: document.getElementById('cs-pans-note'),
        plan: document.getElementById('cs-plan')
    };

    var FRAC = { '0.25': '\u00BC', '0.5': '\u00BD', '0.75': '\u00BE', '0.33': '\u2153', '0.67': '\u2154' };

    function fmtCups(n) {
        if (n === null || n === undefined || isNaN(n)) return '\u2014';
        var whole = Math.floor(n + 1e-9);
        var frac = Math.round((n - whole) * 100) / 100;
        var tail = FRAC[String(frac)] || '';
        var body;
        if (frac === 0) body = String(whole);
        else if (tail) body = (whole ? String(whole) : '') + tail;
        else body = (Math.round(n * 100) / 100).toString();
        return body + (n === 1 ? ' cup' : ' cups');
    }

    function currentShape() {
        var key = shapeSel.value;
        for (var i = 0; i < DATA.shapes.length; i++) {
            if (DATA.shapes[i].key === key) return DATA.shapes[i];
        }
        return DATA.shapes[0];
    }

    function currentPan() {
        var shape = currentShape();
        var size = panSel.value;
        for (var i = 0; i < shape.pans.length; i++) {
            if (shape.pans[i].size === size) return shape.pans[i];
        }
        return shape.pans[0];
    }

    function fillPans() {
        var shape = currentShape();
        var keep = panSel.value;
        panSel.innerHTML = '';
        for (var i = 0; i < shape.pans.length; i++) {
            var opt = document.createElement('option');
            opt.value = shape.pans[i].size;
            opt.textContent = shape.pans[i].size;
            panSel.appendChild(opt);
        }
        for (var j = 0; j < shape.pans.length; j++) {
            if (shape.pans[j].size === keep) { panSel.value = keep; return; }
        }
    }

    function servingsFor(pan, cut, factor) {
        return Math.floor((cut === 'wedding' ? pan.wedding : pan.party) * factor);
    }

    /* Smallest single pan in the chart that covers the guest count at this cut. */
    function smallestPanFor(guests, cut, factor) {
        var best = null;
        for (var i = 0; i < DATA.shapes.length; i++) {
            var shape = DATA.shapes[i];
            for (var j = 0; j < shape.pans.length; j++) {
                var n = servingsFor(shape.pans[j], cut, factor);
                if (n >= guests && (best === null || n < best.servings)) {
                    best = { shape: shape.label, size: shape.pans[j].size, servings: n };
                }
            }
        }
        return best;
    }

    function recalc() {
        var shape = currentShape();
        var pan = currentPan();
        var cut = cutSel.value;
        var factor = heightSel.value === 'short' ? 0.5 : 1;

        var party = servingsFor(pan, 'party', factor);
        var wedding = servingsFor(pan, 'wedding', factor);
        var shown = cut === 'wedding' ? wedding : party;
        var otherN = cut === 'wedding' ? party : wedding;
        var otherLabel = cut === 'wedding' ? 'party' : 'wedding';

        out.servings.textContent = shown;
        out.totalLabel.textContent = (cut === 'wedding' ? 'Wedding' : 'Party') + ' servings';
        out.other.textContent = otherN + ' ' + otherLabel;

        out.cups.textContent = fmtCups(pan.cups);
        out.cups2.textContent = fmtCups(Math.round(pan.cups * 2 * 100) / 100);

        if (factor === 0.5) {
            out.icing.textContent = fmtCups(Math.round(pan.icing * 50) / 100) + ' (half)';
        } else {
            out.icing.textContent = fmtCups(pan.icing);
        }

        out.temp.textContent = pan.temp;
        out.time.textContent = pan.time.replace('-', '\u2013') + ' min';
        out.note.textContent = pan.size + ' ' + shape.label.toLowerCase() + ', ' +
            (factor === 0.5 ? 'under 3 in tall' : 'two layers') + ', ' + cut + ' cut.';

        var guests = parseInt(guestsInput.value, 10);
        if (isNaN(guests) || guests < 1) guests = 1;

        var pans = Math.ceil(guests / shown);
        out.pans.textContent = pans;
        out.pansNote.textContent = pans + ' \u00D7 ' + shown + ' servings = ' +
            (pans * shown) + (pans * shown > guests ? ' (you have ' + (pans * shown - guests) + ' spare)' : '');

        var single = smallestPanFor(guests, cut, factor);
        var sheets = Math.ceil(guests / servingsFor({ party: 36, wedding: 50 }, cut, factor));
        var plan;
        if (single && pans <= 1) {
            plan = 'One ' + shape.label.toLowerCase() + ' of this size covers the list.';
        } else if (single) {
            plan = 'Smallest single pan that covers ' + guests + ': a ' + single.shape.toLowerCase() + ' ' +
                single.size + ', at ' + single.servings + ' ' + cut + ' servings.';
        } else {
            plan = 'No single pan covers ' + guests + ' at this cut.';
        }
        plan += ' On sheet pans that would be ' + sheets + ' \u00D7 9 x 13 (36 or 50 each, depending on cut).';
        out.plan.textContent = plan;
    }

    for (var i = 0; i < DATA.shapes.length; i++) {
        var opt = document.createElement('option');
        opt.value = DATA.shapes[i].key;
        opt.textContent = DATA.shapes[i].label;
        shapeSel.appendChild(opt);
    }
    shapeSel.value = 'round';
    panSel.value = '8 in.';
    fillPans();
    panSel.value = '8 in.';

    shapeSel.addEventListener('change', function () {
        fillPans();
        recalc();
    });
    panSel.addEventListener('change', recalc);
    cutSel.addEventListener('change', recalc);
    heightSel.addEventListener('change', recalc);
    guestsInput.addEventListener('input', recalc);
    guestsInput.addEventListener('change', recalc);

    recalc();

    window.CakeServings = { recalc: recalc, data: DATA };
})();
