/* ============================================================
   Sourdough Hydration Calculator — inline, zero dependencies
   ============================================================ */
(function(){
    'use strict';

    var FLOUR_PRESETS = [
        { name: 'Bread Flour (12-14% protein)', default: true },
        { name: 'All-Purpose Flour', default: false },
        { name: 'Whole Wheat Flour', default: false },
        { name: 'Rye Flour', default: false },
        { name: 'Spelt Flour', default: false },
        { name: 'Tipo 00 Flour', default: false },
        { name: 'Semolina / Durum', default: false },
        { name: 'Einkorn Flour', default: false },
        { name: 'Other / Custom Flour', default: false }
    ];

    var RECIPE_PRESETS = {
        beginner: {
            flours: [{ name: 'Bread Flour (12-14% protein)', grams: 500 }],
            water: 325,
            starter: 100,
            starterHyd: 100
        },
        artisan: {
            flours: [
                { name: 'Bread Flour (12-14% protein)', grams: 450 },
                { name: 'Whole Wheat Flour', grams: 50 }
            ],
            water: 360,
            starter: 100,
            starterHyd: 100
        },
        ciabatta: {
            flours: [{ name: 'Bread Flour (12-14% protein)', grams: 500 }],
            water: 410,
            starter: 80,
            starterHyd: 100
        },
        ww: {
            flours: [
                { name: 'Bread Flour (12-14% protein)', grams: 350 },
                { name: 'Whole Wheat Flour', grams: 150 }
            ],
            water: 375,
            starter: 100,
            starterHyd: 100
        },
        focaccia: {
            flours: [{ name: 'Bread Flour (12-14% protein)', grams: 500 }],
            water: 390,
            starter: 80,
            starterHyd: 100
        },
        baguette: {
            flours: [{ name: 'Bread Flour (12-14% protein)', grams: 500 }],
            water: 340,
            starter: 80,
            starterHyd: 100
        }
    };

    // ---- State ----
    var flourRows = [
        { name: 'Bread Flour (12-14% protein)', grams: 500 }
    ];

    function getWaterGrams() {
        var el = document.getElementById('water-grams');
        return el ? Math.max(parseFloat(el.value) || 0, 0) : 350;
    }

    function getStarterGrams() {
        var el = document.getElementById('starter-grams');
        return el ? Math.max(parseFloat(el.value) || 0, 0) : 100;
    }

    function getStarterHydration() {
        var el = document.getElementById('starter-hydration');
        return el ? parseFloat(el.value) || 100 : 100;
    }

    // ---- Math ----
    function calcStarterContrib() {
        var starterG = getStarterGrams();
        var starterH = getStarterHydration();
        if (starterG <= 0) return { flour: 0, water: 0 };
        // starter water / starter flour = starterH / 100
        // starter = starter_flour + starter_water
        // starter_water = starter_flour * (starterH / 100)
        // starter = starter_flour * (1 + starterH/100)
        // starter_flour = starter / (1 + starterH/100)
        var starterFlour = starterG / (1 + starterH / 100);
        var starterWater = starterFlour * (starterH / 100);
        return {
            flour: Math.round(starterFlour * 100) / 100,
            water: Math.round(starterWater * 100) / 100
        };
    }

    function getTotalFlour() {
        var total = 0;
        for (var i = 0; i < flourRows.length; i++) {
            total += (flourRows[i].grams || 0);
        }
        total += calcStarterContrib().flour;
        return total;
    }

    function getTotalWater() {
        var total = getWaterGrams();
        total += calcStarterContrib().water;
        return total;
    }

    function getHydration() {
        var tf = getTotalFlour();
        if (tf <= 0) return 0;
        return (getTotalWater() / tf) * 100;
    }

    function getTotalDough() {
        var tf = getTotalFlour();
        var tw = getTotalWater();
        var salt = tf * 0.02; // 2% salt
        return tf + tw + salt;
    }

    // ---- Hydration category ----
    function getHydCategory(hyd) {
        if (hyd <= 0) return { label: '—', color: '#999' };
        if (hyd < 58) return { label: 'Very low hydration — bagel territory. Firm, tight crumb, chewy.', color: '#3b82f6' };
        if (hyd < 63) return { label: 'Low hydration — soft sandwich bread. Fine, even crumb.', color: '#2563eb' };
        if (hyd < 68) return { label: 'Moderate hydration — baguettes, everyday loaves. Easy to handle.', color: '#16a34a' };
        if (hyd < 74) return { label: 'Moderate hydration — classic artisan sourdough range. Manageable dough, open crumb.', color: '#65a30d' };
        if (hyd < 80) return { label: 'High hydration — open crumb, irregular holes. Wet hands and bench scraper needed.', color: '#ca8a04' };
        if (hyd < 88) return { label: 'Very high hydration — ciabatta, focaccia. Slack dough, large holes. Handle gently.', color: '#ea580c' };
        return { label: 'Extremely high hydration — pan de cristal territory. Nearly pourable. Challenging.', color: '#dc2626' };
    }

    // ---- Render ----
    function renderFlourRows() {
        var tbody = document.getElementById('flour-rows');
        if (!tbody) return;

        var totalGrams = 0;
        for (var i = 0; i < flourRows.length; i++) {
            totalGrams += (flourRows[i].grams || 0);
        }

        var html = '';
        for (var i = 0; i < flourRows.length; i++) {
            var f = flourRows[i];
            var blendPct = totalGrams > 0 ? Math.round((f.grams / totalGrams) * 100) : 0;
            var tf = getTotalFlour();
            var contribPct = tf > 0 ? Math.round((f.grams / tf) * 100) : 0;

            var options = '';
            for (var j = 0; j < FLOUR_PRESETS.length; j++) {
                var sel = FLOUR_PRESETS[j].name === f.name ? ' selected' : '';
                options += '<option value="' + escAttr(FLOUR_PRESETS[j].name) + '"' + sel + '>' + FLOUR_PRESETS[j].name + '</option>';
            }

            html += '<tr class="hyd-row">'
                + '<td class="cell-flour-type"><select onchange="HydCalc.updateFlourName(' + i + ', this.value)">' + options + '</select></td>'
                + '<td class="cell-flour-grams"><input type="number" value="' + f.grams + '" min="0" step="1" inputmode="decimal" onchange="HydCalc.updateFlourGrams(' + i + ', parseFloat(this.value)||0)"></td>'
                + '<td class="cell-blend-pct cell-flour-blend">' + blendPct + '%</td>'
                + '<td class="cell-contrib cell-flour-contrib">' + contribPct + '% of total flour</td>'
                + '<td class="cell-flour-del">' + (flourRows.length > 1 ? '<button class="btn-row-del" onclick="HydCalc.removeFlour(' + i + ')" title="Remove">&times;</button>' : '') + '</td>'
                + '</tr>';
        }
        tbody.innerHTML = html;
    }

    function renderSummary() {
        var body = document.getElementById('summary-body');
        if (!body) return;

        var tf = getTotalFlour();
        var totalRawGrams = 0;
        for (var i = 0; i < flourRows.length; i++) totalRawGrams += (flourRows[i].grams || 0);
        var sc = calcStarterContrib();
        var waterG = getWaterGrams();

        var html = '';

        // Each flour
        for (var i = 0; i < flourRows.length; i++) {
            var f = flourRows[i];
            var bp = tf > 0 ? Math.round((f.grams / tf) * 1000) / 10 : 0;
            var blendPct = totalRawGrams > 0 ? Math.round((f.grams / totalRawGrams) * 100) : 0;
            html += '<tr>'
                + '<td>' + escAttr(f.name) + '</td>'
                + '<td style="text-align:center;font-weight:600;">' + f.grams + 'g</td>'
                + '<td style="text-align:center;font-weight:600;color:var(--primary);">' + bp.toFixed(1) + '%</td>'
                + '<td style="text-align:center;font-size:0.85rem;color:var(--text-muted);">' + blendPct + '% of blend</td>'
                + '</tr>';
        }

        // Water
        html += '<tr>'
            + '<td>💧 Water (added directly)</td>'
            + '<td style="text-align:center;font-weight:600;">' + waterG + 'g</td>'
            + '<td style="text-align:center;font-weight:600;color:var(--primary);">' + (tf > 0 ? Math.round((waterG / tf) * 1000) / 10 : 0).toFixed(1) + '%</td>'
            + '<td style="text-align:center;font-size:0.85rem;color:var(--text-muted);">—</td>'
            + '</tr>';

        // Starter
        if (getStarterGrams() > 0) {
            html += '<tr>'
                + '<td>🫙 Starter (' + getStarterHydration() + '% hyd, ' + getStarterGrams() + 'g total)</td>'
                + '<td style="text-align:center;font-weight:600;">' + getStarterGrams() + 'g</td>'
                + '<td style="text-align:center;font-weight:600;color:var(--primary);">' + (tf > 0 ? Math.round((getStarterGrams() / tf) * 1000) / 10 : 0).toFixed(1) + '%</td>'
                + '<td style="text-align:center;font-size:0.85rem;color:var(--text-muted);">→ ' + sc.flour.toFixed(1) + 'g flour + ' + sc.water.toFixed(1) + 'g water</td>'
                + '</tr>';
        }

        // Salt
        var saltG = Math.round(tf * 0.02);
        if (saltG > 0) {
            html += '<tr>'
                + '<td>🧂 Salt (suggested 2%)</td>'
                + '<td style="text-align:center;font-weight:600;">' + saltG + 'g</td>'
                + '<td style="text-align:center;font-weight:600;color:var(--primary);">2.0%</td>'
                + '<td style="text-align:center;font-size:0.85rem;color:var(--text-muted);">Adjust to taste</td>'
                + '</tr>';
        }

        body.innerHTML = html;
    }

    function updateResults() {
        var hyd = getHydration();
        var tf = getTotalFlour();
        var tw = getTotalWater();
        var td = Math.round(getTotalDough());
        var cat = getHydCategory(hyd);
        var sc = calcStarterContrib();
        var saltG = Math.round(tf * 0.02);

        document.getElementById('final-hydration').innerHTML = hyd.toFixed(1) + '<span style="font-size:50%;">%</span>';
        document.getElementById('total-flour').textContent = Math.round(tf);
        document.getElementById('total-water').textContent = Math.round(tw);
        document.getElementById('total-salt-display').textContent = saltG + 'g';
        document.getElementById('total-dough').textContent = td;
        document.getElementById('hyd-category').textContent = cat.label;
        document.getElementById('hyd-category').style.color = cat.color;

        // Gauge marker (map 50-95% range to 0-100%)
        var gaugePos = Math.max(0, Math.min(100, ((hyd - 50) / 45) * 100));
        document.getElementById('gauge-marker').style.left = gaugePos + '%';

        // Starter contribution display
        if (getStarterGrams() > 0) {
            document.getElementById('starter-contrib-display').textContent = sc.flour.toFixed(0) + 'g flour + ' + sc.water.toFixed(0) + 'g water';
        } else {
            document.getElementById('starter-contrib-display').textContent = 'No starter added';
        }
    }

    function recalc() {
        renderFlourRows();
        renderSummary();
        updateResults();
    }

    function escAttr(str) {
        return (str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // ---- Public API ----
    window.HydCalc = {
        addFlourRow: function() {
            flourRows.push({ name: 'Bread Flour (12-14% protein)', grams: 100 });
            recalc();
        },

        removeFlour: function(idx) {
            if (flourRows.length <= 1) return;
            flourRows.splice(idx, 1);
            recalc();
        },

        updateFlourName: function(idx, name) {
            if (idx < 0 || idx >= flourRows.length) return;
            flourRows[idx].name = name;
            recalc();
        },

        updateFlourGrams: function(idx, grams) {
            if (idx < 0 || idx >= flourRows.length) return;
            flourRows[idx].grams = Math.max(0, grams || 0);
            recalc();
        },

        loadPreset: function(key) {
            var p = RECIPE_PRESETS[key];
            if (!p) return;
            flourRows = JSON.parse(JSON.stringify(p.flours));
            document.getElementById('water-grams').value = p.water;
            document.getElementById('starter-grams').value = p.starter;
            document.getElementById('starter-hydration').value = p.starterHyd;
            recalc();
        },

        reset: function() {
            flourRows = [{ name: 'Bread Flour (12-14% protein)', grams: 500 }];
            document.getElementById('water-grams').value = 350;
            document.getElementById('starter-grams').value = 100;
            document.getElementById('starter-hydration').value = '100';
            recalc();
        },

        recalc: recalc,

        printCard: function() {
            var hyd = getHydration();
            var tf = Math.round(getTotalFlour());
            var tw = Math.round(getTotalWater());
            var td = Math.round(getTotalDough());
            var sc = calcStarterContrib();
            var saltG = Math.round(tf * 0.02);
            var totalRawGrams = 0;
            for (var i = 0; i < flourRows.length; i++) totalRawGrams += (flourRows[i].grams || 0);
            var cat = getHydCategory(hyd);

            var flourHtml = '';
            for (var i = 0; i < flourRows.length; i++) {
                var bp = tf > 0 ? (flourRows[i].grams / tf * 100).toFixed(1) : '0.0';
                flourHtml += '<tr><td>' + escAttr(flourRows[i].name) + '</td><td>' + flourRows[i].grams + 'g</td><td>' + bp + '%</td></tr>';
            }

            var card = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Sourdough Formula — BakeCalc Club</title>'
                + '<style>'
                + 'body{font-family:Georgia,serif;color:#2c1e0f;max-width:600px;margin:40px auto;padding:0 20px;line-height:1.6}'
                + 'h1{color:#c7733e;border-bottom:2px solid #f0e4d4;padding-bottom:8px;margin-bottom:4px}'
                + 'h2{color:#9e4f28;font-size:1.1rem;margin:24px 0 8px}'
                + 'table{width:100%;border-collapse:collapse;margin:12px 0}'
                + 'th,td{padding:8px 10px;text-align:left;border-bottom:1px solid #f0e4d4}'
                + 'th{color:#7a6a5c;font-size:0.85rem;font-weight:600;text-transform:uppercase}'
                + '.meta{color:#7a6a5c;font-size:0.9rem;margin:4px 0}'
                + '.big-num{font-size:2.4rem;font-weight:700;color:#c7733e;text-align:center;margin:16px 0}'
                + '.footer{text-align:center;color:#a89888;font-size:0.8rem;margin-top:40px;border-top:1px solid #f0e4d4;padding-top:16px}'
                + '@media print{body{margin:20px auto}}'
                + '</style></head><body>'
                + '<h1>Sourdough Bread Formula</h1>'
                + '<div class="big-num">' + hyd.toFixed(1) + '% hydration</div>'
                + '<p class="meta">' + cat.label + '</p>'
                + '<p class="meta"><strong>Total Flour:</strong> ' + tf + 'g &nbsp;|&nbsp; <strong>Total Water:</strong> ' + tw + 'g &nbsp;|&nbsp; <strong>Total Dough:</strong> ' + td + 'g</p>'
                + '<p class="meta"><strong>Salt:</strong> ' + saltG + 'g (2% of flour) &nbsp;|&nbsp; <strong>Starter:</strong> ' + getStarterGrams() + 'g @ ' + getStarterHydration() + '% hyd</p>'
                + '<h2>Flour Blend</h2>'
                + '<table><thead><tr><th>Flour</th><th>Grams</th><th>Baker\'s %</th></tr></thead><tbody>'
                + flourHtml
                + '</tbody></table>'
                + '<h2>Liquids</h2>'
                + '<table><thead><tr><th>Ingredient</th><th>Grams</th><th>Baker\'s %</th></tr></thead><tbody>'
                + '<tr><td>Water (direct)</td><td>' + getWaterGrams() + 'g</td><td>' + (tf > 0 ? (getWaterGrams() / tf * 100).toFixed(1) : '0.0') + '%</td></tr>'
                + '<tr><td>Water (from starter)</td><td>' + sc.water.toFixed(0) + 'g</td><td>' + (tf > 0 ? (sc.water / tf * 100).toFixed(1) : '0.0') + '%</td></tr>'
                + '</tbody></table>'
                + '<p class="footer">Generated by BakeCalc Club &mdash; bakecalc.club/sourdough-hydration-calculator</p>'
                + '</body></html>';

            var w = window.open('', '_blank', 'width=700,height=800');
            if (w) {
                w.document.write(card);
                w.document.close();
            }
        }
    };

    // ---- Boot ----
    document.addEventListener('DOMContentLoaded', function() {
        recalc();
    });

})();