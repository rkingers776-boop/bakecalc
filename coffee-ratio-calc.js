(function() {
    var method = document.getElementById('brew-method');
    var waterAmount = document.getElementById('water-amount');
    var waterUnit = document.getElementById('water-unit');
    var coffeeGrams = document.getElementById('coffee-grams');
    var waterDisplay = document.getElementById('water-display');
    var ratioDisplay = document.getElementById('ratio-display');
    var coffeeTbsp = document.getElementById('coffee-tbsp');
    var coffeeScoops = document.getElementById('coffee-scoops');
    var brewNote = document.getElementById('brew-note-text');

    function update() {
        var ratio = parseFloat(method.value);
        var unitFactor = parseFloat(waterUnit.value);
        var waterMl = parseFloat(waterAmount.value) * unitFactor;
        var sel = method.options[method.selectedIndex];

        if (isNaN(waterMl) || waterMl <= 0 || isNaN(ratio) || ratio <= 0) {
            coffeeGrams.textContent = '—';
            return;
        }

        var coffee = waterMl / ratio;
        coffeeGrams.textContent = coffee.toFixed(1);

        var unitLabel = waterUnit.options[waterUnit.selectedIndex].text;
        waterDisplay.textContent = Math.round(waterMl) + ' mL';
        ratioDisplay.textContent = '1:' + ratio;
        coffeeTbsp.textContent = Math.round(coffee / 6);
        coffeeScoops.textContent = (coffee / 12).toFixed(1);
        brewNote.textContent = sel.getAttribute('data-note') || '';
    }

    method.addEventListener('change', update);
    waterAmount.addEventListener('input', update);
    waterUnit.addEventListener('change', update);
    document.getElementById('brew-calc-btn').addEventListener('click', function(e) { e.preventDefault(); update(); });

    window.setWater = function(ml) {
        waterAmount.value = ml;
        waterUnit.value = '1';
        update();
    };

    update();
})();