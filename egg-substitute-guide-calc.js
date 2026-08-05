
(function() {
    var eggCount = document.getElementById('egg-count');
    var subChoice = document.getElementById('sub-choice');
    var amountOut = document.getElementById('egg-sub-amount');
    var noteOut = document.getElementById('egg-sub-note');

    var subs = {
        applesauce:  { unit: 'cup applesauce', factor: 0.25, note: 'Best for: cakes, muffins, quick breads. Bake will be slightly denser and moister. Reduce other liquid by 2 tbsp per 1/4 cup applesauce.' },
        flax:        { unit: 'tbsp ground flax + ', factor: 1, note: 'Best for: cookies, brownies, pancakes. Nutty flavor complements chocolate and whole grains. Use golden flax for lighter bakes.' },
        banana:      { unit: 'cup mashed banana', factor: 0.25, note: 'Best for: pancakes, banana bread, spice cakes. Adds noticeable banana flavor — only use when it fits the recipe.' },
        yogurt:      { unit: 'cup yogurt', factor: 0.25, note: 'Best for: cakes, muffins. Tender, fine crumb. Use whole milk yogurt for richness.' },
        tofu:        { unit: 'cup blended silken tofu', factor: 0.25, note: 'Best for: quiches, custards, cheesecakes. Blend until completely smooth — any lumps turn rubbery.' },
        vinegar:     { unit: 'tbsp vinegar + ', factor: 1, note: 'ONLY replaces leavening. Combine with applesauce or yogurt for binding and moisture. Mix and bake immediately.' },
        aquafaba:    { unit: 'tbsp aquafaba', factor: 3, note: 'The ONLY sub for meringues and macarons. Use canned chickpea liquid. Reduce by simmering for best results.' },
        buttermilk:  { unit: 'cup buttermilk', factor: 0.25, note: 'Best for: cakes, pancakes, biscuits. Reduce other liquid in recipe. For multi-egg recipes, combine with flax egg.' },
        chia:        { unit: 'tbsp chia seeds + ', factor: 1, note: 'Best for: dense bakes, muffins, veggie burgers. Stronger gel than flax. Visible specks in light bakes. Rest 10 min.' },
        oil:         { unit: '', factor: 0, note: 'Emergency only. For 2+ eggs: 2 tbsp oil + 1 tsp baking powder + 1 tbsp water per 2 eggs. Crumbly, greasy result. Last resort.' }
    };

    function formatFraction(decimal) {
        if (decimal >= 0.48 && decimal <= 0.52) return '1/2';
        if (decimal >= 0.23 && decimal <= 0.27) return '1/4';
        if (decimal >= 0.31 && decimal <= 0.35) return '1/3';
        if (decimal >= 0.65 && decimal <= 0.68) return '2/3';
        if (decimal >= 0.73 && decimal <= 0.77) return '3/4';
        if (decimal >= 0.98 && decimal <= 1.02) return '1';
        if (decimal >= 1.23 && decimal <= 1.27) return '1 1/4';
        if (decimal >= 1.48 && decimal <= 1.52) return '1 1/2';
        if (decimal >= 1.73 && decimal <= 1.77) return '1 3/4';
        if (decimal >= 1.98 && decimal <= 2.02) return '2';
        if (decimal >= 2.23 && decimal <= 2.27) return '2 1/4';
        if (decimal >= 2.48 && decimal <= 2.52) return '2 1/2';
        if (decimal >= 2.98 && decimal <= 3.02) return '3';
        return decimal.toFixed(2);
    }

    function update() {
        var eggs = parseInt(eggCount.value) || 1;
        var sub = subChoice.value;
        var info = subs[sub];

        if (sub === 'oil') {
            amountOut.textContent = '2 tbsp oil + 1 tsp baking powder + 1 tbsp water (per 2 eggs)';
            noteOut.textContent = info.note;
            return;
        }

        if (sub === 'vinegar') {
            var tbsp = info.factor * eggs;
            amountOut.textContent = tbsp + ' tbsp vinegar + ' + eggs + ' tsp baking soda';
            noteOut.textContent = info.note;
            return;
        }

        if (sub === 'flax' || sub === 'chia') {
            var tbsp = info.factor * eggs;
            var water = 3 * eggs;
            amountOut.textContent = tbsp + ' ' + info.unit + water + ' tbsp water (rest ' + (sub === 'flax' ? '5' : '10') + ' min)';
            noteOut.textContent = info.note;
            return;
        }

        if (sub === 'aquafaba') {
            amountOut.textContent = (info.factor * eggs) + ' tbsp aquafaba';
            noteOut.textContent = info.note;
            return;
        }

        // cup-based subs
        var cups = info.factor * eggs;
        amountOut.textContent = formatFraction(cups) + ' ' + info.unit;
        noteOut.textContent = info.note;
    }

    eggCount.addEventListener('input', update);
    subChoice.addEventListener('change', update);
    update();
})();

