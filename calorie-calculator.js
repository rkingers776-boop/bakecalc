/* ============================================================
   BakeCalc Club — Calorie & Macro Calculator v1
   Food database with calories, protein, carbs, fat per 100g
   Sources: USDA SR28, NCCDB, common nutrition labels
   ============================================================ */

var CalorieCalc = (function() {
  'use strict';

  /* ---- Food database: [name, kcal/100g, protein/100g, carbs/100g, fat/100g, fiber/100g] ---- */
  var FOODS = [
    /* Proteins — meat, poultry, fish */
    ['Chicken breast, boneless skinless, raw',    120, 22.5, 0,  2.6, 0],
    ['Chicken breast, cooked',                    165, 31.0, 0,  3.6, 0],
    ['Chicken thigh, boneless skinless, raw',     170, 19.0, 0, 10.0, 0],
    ['Beef, ground 85% lean, raw',                250, 17.0, 0, 20.0, 0],
    ['Beef, ground 93% lean, raw',                192, 21.0, 0, 12.0, 0],
    ['Beef steak, sirloin, raw',                  205, 26.0, 0, 11.0, 0],
    ['Salmon, Atlantic, raw',                     208, 20.4, 0, 13.4, 0],
    ['Salmon, Atlantic, cooked',                  206, 22.0, 0, 12.0, 0],
    ['Tuna, canned in water',                     116, 25.5, 0,  0.8, 0],
    ['Shrimp, raw',                                85, 20.1, 0,  0.5, 0],
    ['Pork chop, boneless, raw',                  180, 21.0, 0, 10.0, 0],
    ['Bacon, raw',                                468, 12.0, 1.0, 45.0, 0],
    ['Turkey breast, raw',                        114, 23.6, 0,  1.5, 0],
    ['Eggs, whole, large (per 50g egg)',          143, 12.6, 0.7, 9.5, 0],

    /* Dairy & eggs */
    ['Milk, whole (3.25%)',                        61,  3.2, 4.8, 3.3, 0],
    ['Milk, 2%',                                   50,  3.3, 4.8, 2.0, 0],
    ['Milk, skim',                                 34,  3.4, 5.0, 0.1, 0],
    ['Yogurt, plain, whole milk',                  61,  3.5, 4.7, 3.3, 0],
    ['Greek yogurt, plain, nonfat',                59, 10.2, 3.6, 0.4, 0],
    ['Cheddar cheese',                            403, 24.9, 1.3, 33.1, 0],
    ['Mozzarella, part-skim',                     280, 27.5, 3.1, 17.1, 0],
    ['Cream cheese',                              342,  6.2, 4.1, 34.0, 0],
    ['Butter',                                    717,  0.9, 0.1, 81.1, 0],
    ['Heavy cream (36%)',                         340,  2.8, 2.7, 36.1, 0],
    ['Sour cream',                                198,  2.4, 4.6, 19.4, 0],

    /* Grains, breads, pasta */
    ['White rice, cooked',                        130,  2.7, 28.2, 0.3, 0.4],
    ['Brown rice, cooked',                        123,  2.7, 25.6, 1.0, 1.6],
    ['Pasta, cooked (plain)',                     131,  5.0, 25.0, 1.1, 1.8],
    ['Bread, white',                              265,  8.8, 49.0, 3.3, 2.7],
    ['Bread, whole wheat',                        247, 12.4, 41.3, 3.4, 6.0],
    ['Tortilla, flour (8-inch)',                  304,  8.3, 50.0, 7.4, 2.0],
    ['Oatmeal, cooked with water',                 71,  2.5, 12.0, 1.5, 1.7],
    ['Rolled oats, dry',                          379, 13.2, 67.7, 6.5, 10.1],
    ['Quinoa, cooked',                            120,  4.4, 21.3, 1.9, 2.8],

    /* Vegetables */
    ['Broccoli, raw',                              34,  2.8, 6.6, 0.4, 2.6],
    ['Carrots, raw',                               41,  0.9, 9.6, 0.2, 2.8],
    ['Spinach, raw',                               23,  2.9, 3.6, 0.4, 2.2],
    ['Tomato, raw',                                18,  0.9, 3.9, 0.2, 1.2],
    ['Onion, raw',                                 40,  1.1, 9.3, 0.1, 1.7],
    ['Bell pepper, green, raw',                    20,  0.9, 4.6, 0.2, 1.7],
    ['Potato, raw',                                77,  2.0, 17.5, 0.1, 2.2],
    ['Sweet potato, raw',                          86,  1.6, 20.1, 0.1, 3.0],
    ['Avocado',                                   160,  2.0, 8.5, 14.7, 6.7],
    ['Lettuce, romaine',                           17,  1.2, 3.3, 0.3, 2.1],
    ['Cucumber, with peel',                        15,  0.7, 3.6, 0.1, 0.5],
    ['Mushrooms, white, raw',                      22,  3.1, 3.3, 0.3, 1.0],
    ['Corn, sweet, yellow, raw',                   86,  3.3, 18.7, 1.4, 2.0],
    ['Green beans, raw',                           31,  1.8, 7.0, 0.2, 2.7],
    ['Cabbage, raw',                               25,  1.3, 5.8, 0.1, 2.5],

    /* Fruits */
    ['Apple, with skin',                           52,  0.3, 13.8, 0.2, 2.4],
    ['Banana',                                     89,  1.1, 22.8, 0.3, 2.6],
    ['Orange',                                     47,  0.9, 11.8, 0.1, 2.4],
    ['Strawberries',                               32,  0.7,  7.7, 0.3, 2.0],
    ['Blueberries',                                57,  0.7, 14.5, 0.3, 2.4],
    ['Grapes, red',                                69,  0.7, 18.1, 0.2, 0.9],
    ['Mango',                                      60,  0.8, 15.0, 0.4, 1.6],
    ['Pineapple',                                  50,  0.5, 13.1, 0.1, 1.4],
    ['Watermelon',                                 30,  0.6,  7.6, 0.2, 0.4],
    ['Lemon (juice only)',                         22,  0.4,  6.9, 0.2, 0.3],
    ['Raisins',                                   299,  3.1, 79.2, 0.5, 3.7],

    /* Nuts, seeds, legumes */
    ['Almonds, raw',                              579, 21.2, 21.6, 49.9, 12.5],
    ['Walnuts',                                   654, 15.2, 13.7, 65.2,  6.7],
    ['Peanuts, dry roasted',                      585, 24.4, 21.3, 49.7,  8.0],
    ['Peanut butter, smooth',                     588, 21.9, 20.0, 49.5,  6.0],
    ['Cashews, raw',                              553, 18.2, 30.2, 43.9,  3.3],
    ['Chickpeas, canned, drained',                139,  7.1, 22.5,  2.6,  6.4],
    ['Black beans, canned, drained',              130,  8.3, 22.5,  0.5,  6.9],
    ['Lentils, cooked',                           116,  9.0, 20.1,  0.4,  7.9],
    ['Tofu, firm',                                 76,  8.1,  1.9,  4.8,  0.3],

    /* Oils, fats, sweeteners */
    ['Olive oil',                                 884,  0,   0,  100.0,  0],
    ['Vegetable oil',                             884,  0,   0,  100.0,  0],
    ['Coconut oil',                               862,  0,   0,  100.0,  0],
    ['Honey',                                     304,  0.3, 82.4,  0,     0.2],
    ['Maple syrup',                               260,  0,   67.0,  0.1,   0],
    ['Sugar, white granulated',                   387,  0,  100.0,  0,     0],
    ['Brown sugar',                               380,  0.1, 98.1,  0,     0],

    /* Baked goods & snacks */
    ['Cake, vanilla, with frosting',              380,  3.5, 56.0, 16.0,  1.0],
    ['Chocolate chip cookie',                     488,  5.1, 64.0, 23.0,  1.6],
    ['Croissant, butter',                         406,  8.2, 45.8, 21.0,  2.6],
    ['Muffin, blueberry',                         375,  5.5, 53.0, 16.0,  2.0],
    ['Pizza, cheese, 14-inch slice',              266, 11.4, 33.0, 10.0,  1.8],
    ['Dark chocolate (70-85%)',                   598,  7.8, 45.9, 42.6, 10.9],
    ['Milk chocolate',                            535,  7.6, 59.4, 30.0,  3.4],
    ['Potato chips',                              536,  6.4, 52.9, 34.6,  3.1],
    ['Tortilla chips',                            497,  7.0, 65.0, 22.0,  5.5],

    /* Beverages */
    ['Orange juice',                               45,  0.7, 10.4, 0.2,  0.2],
    ['Apple juice',                                46,  0.1, 11.3, 0.1,  0.2],
    ['Cola (regular)',                             42,  0,   10.6, 0,    0],
    ['Beer, regular (~5% ABV)',                    43,  0.5,  3.6, 0,    0],
    ['Wine, red',                                  85,  0.1,  2.6, 0,    0],
    ['Coffee, black (brewed)',                      2,  0.1,  0,   0,    0],
    ['Latte, whole milk (12 oz)',                  56,  3.0,  5.0, 2.5,  0],

    /* Sauces & condiments */
    ['Mayonnaise',                                700,  1.0,  0.6, 78.0, 0],
    ['Ketchup',                                   101,  1.0, 27.0,  0.2, 0.3],
    ['Soy sauce',                                  53,  8.1,  4.9,  0.6, 0.8],
    ['Mustard, yellow',                            66,  4.0,  5.8,  3.7, 2.7],
    ['BBQ sauce',                                 172,  0.9, 40.0,  0.6, 0.6],
    ['Ranch dressing',                            471,  1.4,  5.4, 49.0, 0.1]
  ];

  /* ---- Search & DOM ---- */
  function searchFoods(query) {
    var q = query.toLowerCase().trim();
    if (!q) return FOODS.slice(0, 20);
    return FOODS.filter(function(f) {
      return f[0].toLowerCase().indexOf(q) !== -1;
    });
  }

  function calc(food, grams) {
    var factor = grams / 100;
    return {
      name: food[0],
      grams: grams,
      kcal: Math.round(food[1] * factor),
      protein: round1(food[2] * factor),
      carbs: round1(food[3] * factor),
      fat: round1(food[4] * factor),
      fiber: round1(food[5] * factor)
    };
  }

  function round1(n) { return Math.round(n * 10) / 10; }

  /* ---- DOM init called from HTML ---- */
  function init() {
    var searchInput = document.getElementById('food-search');
    var resultsList = document.getElementById('food-results');
    var gramsInput = document.getElementById('food-grams');
    var calcBtn = document.getElementById('calc-btn');
    var resultDiv = document.getElementById('calorie-result');
    var selectedFood = null;

    if (!searchInput || !resultsList) return;

    /* Populate initial list */
    function renderResults(foods) {
      resultsList.innerHTML = '';
      var slice = foods.slice(0, 30);
      slice.forEach(function(f) {
        var div = document.createElement('div');
        div.className = 'food-option';
        div.textContent = f[0] + '  (' + f[1] + ' kcal/100g)';
        div.addEventListener('click', function() {
          selectedFood = f;
          searchInput.value = f[0];
          resultsList.style.display = 'none';
          // auto-calc if grams already filled
          if (gramsInput && parseFloat(gramsInput.value) > 0) {
            showResult(calc(f, parseFloat(gramsInput.value)));
          }
        });
        resultsList.appendChild(div);
      });
    }

    renderResults(FOODS.slice(0, 20));

    searchInput.addEventListener('input', function() {
      var matches = searchFoods(searchInput.value);
      resultsList.style.display = 'block';
      renderResults(matches);
    });

    searchInput.addEventListener('focus', function() {
      var matches = searchFoods(searchInput.value);
      resultsList.style.display = 'block';
      renderResults(matches);
    });

    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !resultsList.contains(e.target)) {
        resultsList.style.display = 'none';
      }
    });

    function showResult(r) {
      if (!resultDiv) return;
      resultDiv.style.display = 'block';
      document.getElementById('cr-name').textContent = r.name;
      document.getElementById('cr-grams').textContent = r.grams;
      document.getElementById('cr-kcal').textContent = r.kcal;
      document.getElementById('cr-protein').textContent = r.protein;
      document.getElementById('cr-carbs').textContent = r.carbs;
      document.getElementById('cr-fat').textContent = r.fat;
      document.getElementById('cr-fiber').textContent = r.fiber;

      /* calories from each macro */
      var calProtein = document.getElementById('cr-cal-protein');
      var calFat = document.getElementById('cr-cal-fat');
      var calCarbs = document.getElementById('cr-cal-carbs');
      if (calProtein) calProtein.textContent = Math.round(r.protein * 4);
      if (calFat) calFat.textContent = Math.round(r.fat * 9);
      if (calCarbs) calCarbs.textContent = Math.round(r.carbs * 4);

      /* macro bar visualization */
      var totalMacro = r.protein + r.carbs + r.fat;
      if (totalMacro > 0) {
        document.getElementById('bar-protein').style.width = (r.protein / totalMacro * 100).toFixed(0) + '%';
        document.getElementById('bar-carbs').style.width = (r.carbs / totalMacro * 100).toFixed(0) + '%';
        document.getElementById('bar-fat').style.width = (r.fat / totalMacro * 100).toFixed(0) + '%';
      }
    }

    if (calcBtn) {
      calcBtn.addEventListener('click', function() {
        if (!selectedFood) {
          // try to find the food from search text
          var matches = searchFoods(searchInput.value);
          if (matches.length > 0) selectedFood = matches[0];
        }
        if (!selectedFood) { alert('Please select a food from the list first.'); return; }
        var grams = parseFloat(gramsInput.value);
        if (isNaN(grams) || grams <= 0) { alert('Please enter a valid weight in grams.'); return; }
        showResult(calc(selectedFood, grams));
      });
    }

    /* Enter key in grams field triggers calc */
    if (gramsInput) {
      gramsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          if (calcBtn) calcBtn.click();
        }
      });
    }
  }

  return { init: init, FOODS: FOODS, calc: calc, searchFoods: searchFoods };
})();

document.addEventListener('DOMContentLoaded', function() {
  CalorieCalc.init();
});
