/* ============================================================
   BakeCalc Club — Ingredient Substitute Engine v1
   Common cooking & baking substitutions with ratios.
   Each entry: [original, substitute, ratio, notes]
   ============================================================ */

var SubEngine = (function() {
  'use strict';

  var SUBSTITUTES = [
    /* ---- Eggs ---- */
    ['egg', 'applesauce (unsweetened)', '1 egg = 1/4 cup applesauce', 'Best in cakes, muffins, quick breads. Adds moisture but reduces chew — your bake will be slightly denser. Not for meringues or angel food cake.'],
    ['egg', 'mashed banana', '1 egg = 1/4 cup mashed banana', 'Works in pancakes, waffles, banana bread. Adds banana flavor — only use when the taste fits. Brownies get fudgier.'],
    ['egg', 'flax egg (ground flax + water)', '1 egg = 1 tbsp ground flax + 3 tbsp water, rest 5 min', 'The most neutral egg substitute. Works in cookies, muffins, pancakes. Adds a nutty undertone. Makes baked goods slightly chewier.'],
    ['egg', 'chia egg (chia seeds + water)', '1 egg = 1 tbsp chia seeds + 3 tbsp water, rest 10 min', 'Similar to flax egg but forms a stronger gel. Good for binding in veggie burgers and dense quick breads.'],
    ['egg', 'yogurt (plain)', '1 egg = 1/4 cup yogurt', 'Adds tenderness. Best in cakes and muffins. Use whole-milk yogurt for richness; nonfat works but texture is slightly drier.'],
    ['egg', 'buttermilk', '1 egg = 1/4 cup buttermilk', 'Extra tender crumb. Good in cakes and biscuits. Reduce other liquid in recipe slightly.'],
    ['egg', 'silken tofu (blended)', '1 egg = 1/4 cup blended silken tofu', 'The best sub for quiches, custards, and dense baked goods. Nearly flavorless. Blend until completely smooth.'],
    ['egg', 'vinegar + baking soda', '1 egg = 1 tbsp vinegar + 1 tsp baking soda', 'Works as a leavening replacement in cakes. The reaction provides lift. Best when eggs are mainly for rising, not binding.'],
    ['egg', 'aquafaba (chickpea liquid)', '1 egg = 3 tbsp aquafaba', 'The liquid from a can of chickpeas. Whips like egg whites. The only sub that works for meringues and macarons. 1 egg white ≈ 2 tbsp aquafaba.'],
    ['egg white', 'aquafaba', '1 egg white = 2 tbsp aquafaba', 'Whips to stiff peaks. Add 1/8 tsp cream of tartar for stability. Used in vegan meringues, macarons, and mousses.'],

    /* ---- Dairy ---- */
    ['butter', 'coconut oil', '1 cup butter = 1 cup coconut oil', 'Works in most baking. Use refined coconut oil if you don\'t want coconut flavor. Butter is ~80% fat + 16% water; coconut oil is 100% fat — your bake will be richer and slightly greasier. Reduce by 2 tbsp per cup for a closer match.'],
    ['butter', 'vegetable oil', '1 cup butter = 3/4 cup vegetable oil', 'Oil is 100% fat, butter is ~80%. Using the full cup of oil makes greasy baked goods. The 3/4 rule accounts for fat content. Texture will be moister, less flaky.'],
    ['butter', 'applesauce', '1 cup butter = 1/2 cup applesauce + 1/2 cup butter or oil', 'Cut half the fat and replace with applesauce. Works in muffins, quick breads. Reduces calories significantly. Texture will be denser.'],
    ['butter', 'margarine', '1 cup butter = 1 cup margarine', 'Stick margarine (80% fat) works 1:1. Tub/spread margarine has more water — avoid for baking.'],
    ['buttermilk', 'milk + lemon juice', '1 cup buttermilk = 1 cup milk + 1 tbsp lemon juice, rest 5 min', 'The acid curdles the milk slightly, mimicking buttermilk\'s tang and thickness. Works in every recipe that calls for buttermilk.'],
    ['buttermilk', 'milk + vinegar', '1 cup buttermilk = 1 cup milk + 1 tbsp white vinegar, rest 5 min', 'Same principle as lemon juice. White vinegar is more neutral-tasting than you\'d expect. Apple cider vinegar works too.'],
    ['buttermilk', 'yogurt + milk', '1 cup buttermilk = 1/2 cup yogurt + 1/2 cup milk', 'Thin yogurt with milk to buttermilk consistency. Plain yogurt only — flavored will ruin your bake.'],
    ['buttermilk', 'kefir', '1 cup buttermilk = 1 cup kefir', 'Nearly identical acidity and consistency. The closest 1:1 sub available.'],
    ['heavy cream', 'milk + butter', '1 cup heavy cream = 3/4 cup milk + 1/4 cup melted butter', 'Heavy cream is ~36% fat. This mix gets you close. Won\'t whip, so only use for cooking/baking where cream is an ingredient, not a topping.'],
    ['heavy cream', 'coconut cream', '1 cup heavy cream = 1 cup coconut cream', 'The thick part from a can of full-fat coconut milk. Chill the can overnight and scoop off the solidified cream. Whips reasonably well. Adds coconut flavor.'],
    ['cream cheese', 'ricotta + yogurt', '1 cup cream cheese = 3/4 cup ricotta + 1/4 cup Greek yogurt', 'Lower fat, higher protein. Works in cheesecakes and spreads. Texture is slightly grainier.'],
    ['sour cream', 'Greek yogurt', '1 cup sour cream = 1 cup Greek yogurt', 'Nearly identical tang and thickness. Works in baking, dips, and toppings. Full-fat Greek yogurt is closest.'],
    ['sour cream', 'cottage cheese (blended)', '1 cup sour cream = 1 cup blended cottage cheese + 1 tbsp lemon juice', 'Blend until completely smooth. Higher protein, lower fat. Good in dips and baked goods.'],
    ['milk', 'plant milk (soy/almond/oat)', '1 cup milk = 1 cup unsweetened plant milk', 'Soy milk is closest nutritionally (similar protein). Oat milk is creamiest. Almond milk is thinnest — add 1 tbsp extra.'],
    ['milk', 'powdered milk + water', '1 cup milk = 1 cup water + 3 tbsp powdered milk', 'Shelf-stable forever. Mix the powder with a little warm water first to dissolve, then add the rest.'],
    ['milk', 'evaporated milk + water', '1 cup milk = 1/2 cup evaporated milk + 1/2 cup water', 'Evaporated milk is milk with ~60% water removed. Reconstitute 1:1 with water.'],

    /* ---- Sweeteners ---- */
    ['sugar (white)', 'honey', '1 cup sugar = 3/4 cup honey', 'Honey is sweeter than sugar and adds liquid. Reduce other liquid in recipe by 2-4 tbsp per cup of honey used. Lower oven temp by 25°F — honey browns faster. Add 1/4 tsp baking soda to neutralize honey\'s acidity.'],
    ['sugar (white)', 'maple syrup', '1 cup sugar = 3/4 cup maple syrup', 'Similar rules as honey. Reduce liquid by 3 tbsp per cup of syrup. Adds maple flavor — great in fall baking but odd in lemon cake.'],
    ['sugar (white)', 'brown sugar', '1 cup white sugar = 1 cup packed brown sugar', 'Brown sugar = white sugar + molasses. Adds moisture and caramel notes. Your baked good will be chewier and darker. Cookies spread less.'],
    ['brown sugar', 'white sugar + molasses', '1 cup brown sugar = 1 cup white sugar + 1 tbsp molasses (light) or 2 tbsp (dark)', 'Mix thoroughly — fork or food processor works. This is literally how commercial brown sugar is made. Way cheaper than buying both.'],
    ['sugar (white)', 'coconut sugar', '1 cup white sugar = 1 cup coconut sugar', 'Lower glycemic index but same calories. Adds caramel-like flavor. Drier than white sugar — baked goods may need +1-2 tbsp liquid.'],
    ['powdered sugar', 'blended white sugar + cornstarch', '1 cup powdered sugar = 1 cup white sugar + 1 tbsp cornstarch, blended to powder', 'Blend in a dry blender or food processor until fine and powdery. Let the dust settle before opening. Works for frostings and dusting.'],
    ['corn syrup (light)', 'honey', '1 cup corn syrup = 1 cup honey', 'Similar viscosity and sweetness. Honey adds its own flavor; corn syrup is neutral. In candy-making, honey may crystallize where corn syrup wouldn\'t.'],
    ['molasses', 'dark treacle or sorghum syrup', '1 cup molasses = 1 cup treacle', 'Very similar. Blackstrap molasses is more bitter than regular — don\'t substitute blackstrap 1:1 for light molasses.'],
    ['honey', 'agave nectar', '1 cup honey = 2/3 cup agave nectar', 'Agave is sweeter but thinner. Reduce other liquid by 2 tbsp per substitution. Agave has a more neutral flavor.'],

    /* ---- Flours ---- */
    ['all-purpose flour', 'whole wheat flour', '1 cup AP flour = 3/4 cup whole wheat flour', 'Whole wheat absorbs more liquid. Replace only half the flour in delicate cakes; you can go 100% in hearty breads and muffins. Texture will be denser.'],
    ['all-purpose flour', 'gluten-free 1:1 blend', '1 cup AP flour = 1 cup GF 1:1 blend + 1/4 tsp xanthan gum if not in blend', 'Bob\'s Red Mill GF 1-to-1 and King Arthur Measure for Measure are the most reliable. Cup4Cup is best for pastry. Results vary wildly between brands.'],
    ['all-purpose flour', 'almond flour', '1 cup AP flour = 1 cup almond flour + 1 extra egg', 'Almond flour has no gluten — you need extra egg for binding. Dense, moist results. Works in cakes and cookies, not bread. Lower oven temp by 25°F.'],
    ['cake flour', 'AP flour + cornstarch', '1 cup cake flour = 1 cup minus 2 tbsp AP flour + 2 tbsp cornstarch', 'Cornstarch dilutes the protein content, mimicking cake flour\'s 8% protein (vs AP\'s 11%). Sift together 3 times for best results.'],
    ['self-rising flour', 'AP flour + baking powder + salt', '1 cup self-rising = 1 cup AP flour + 1.5 tsp baking powder + 1/4 tsp salt', 'The exact formula on the back of every bag of Southern self-rising flour. Mix thoroughly.'],
    ['bread flour', 'AP flour + vital wheat gluten', '1 cup bread flour = 1 cup AP flour + 1 tsp vital wheat gluten', 'Bread flour has ~13% protein. AP has ~11%. The extra gluten gives bread its chew. For pizza dough and bagels, this matters; for sandwich bread, AP alone is fine.'],

    /* ---- Leaveners ---- */
    ['baking powder', 'baking soda + cream of tartar', '1 tsp baking powder = 1/4 tsp baking soda + 1/2 tsp cream of tartar', 'This is single-acting baking powder. Use immediately — the reaction starts when liquid hits. Commercial baking powder is double-acting (second rise in oven).'],
    ['baking powder', 'baking soda + buttermilk', '1 tsp baking powder = 1/4 tsp baking soda + 1/2 cup buttermilk (reduce other liquid)', 'The acid in buttermilk activates the soda. Reduce another liquid in the recipe by 1/2 cup.'],
    ['baking soda', 'baking powder', '1 tsp baking soda = 3 tsp baking powder', 'Baking soda is 3-4× stronger than baking powder. But this swap adds a slight metallic taste if the recipe has no acid — best as a last resort.'],
    ['cream of tartar', 'lemon juice or vinegar', '1 tsp cream of tartar = 2 tsp lemon juice or white vinegar', 'For stabilizing egg whites. The acid does the same job. Lemon juice may add slight flavor.'],
    ['yeast (instant)', 'active dry yeast', '1 tsp instant yeast = 1.25 tsp active dry yeast', 'Active dry needs proofing in warm water first; instant goes straight in the flour. Both work — just adjust the method, not the amount drastically.'],

    /* ---- Fats & oils ---- */
    ['vegetable oil', 'applesauce', '1 cup oil = 1 cup applesauce', 'Works in muffins, quick breads, cakes. Cuts nearly all the fat. Texture is denser and slightly gummier. Bake a few minutes longer.'],
    ['vegetable oil', 'melted butter', '1 cup oil = 1 cup melted butter', 'Butter adds flavor. Baked goods will be slightly less moist (butter is 80% fat, oil is 100%). Cookies spread less with butter.'],
    ['vegetable oil', 'Greek yogurt', '1 cup oil = 3/4 cup Greek yogurt', 'Much lower fat. Works best in quick breads and muffins. Adds protein and tang.'],
    ['shortening', 'butter', '1 cup shortening = 1 cup butter + 2 tbsp', 'Shortening is 100% fat. Butter is ~80% fat + water. The extra 2 tbsp accounts for the water. Cookies made with butter spread more and are thinner/crispier.'],

    /* ---- Condiments & misc ---- */
    ['soy sauce', 'tamari', '1:1', 'Tamari is gluten-free soy sauce. Nearly identical flavor. Coconut aminos is sweeter and less salty — use 1.5× the amount.'],
    ['soy sauce', 'fish sauce + water', '1 tbsp soy sauce = 1/2 tbsp fish sauce + 1/2 tbsp water', 'Fish sauce is much stronger and saltier. Diluting brings it closer to soy sauce intensity. Not for vegetarian use.'],
    ['vinegar (white)', 'lemon juice', '1 tbsp vinegar = 2 tbsp lemon juice', 'Lemon juice is about half as acidic as white vinegar. For canning/pickling, don\'t substitute — acidity levels must be exact for safety.'],
    ['vinegar (white)', 'apple cider vinegar', '1:1', 'Nearly identical acidity. ACV adds a slight fruit note. Fine for cooking; use real white vinegar for canning.'],
    ['breadcrumbs', 'rolled oats (pulsed in blender)', '1 cup breadcrumbs = 1 cup pulsed rolled oats', 'Works for meatloaf, meatballs, veggie burgers. Not for breading/crusting — oats don\'t crisp the same way. Gluten-free if using GF oats.'],
    ['breadcrumbs', 'crushed crackers or cornflakes', '1 cup breadcrumbs = 1 cup crushed crackers', 'Saltines or Ritz work well. Reduce added salt in recipe. Cornflakes give a crispier coating for casseroles.'],
    ['wine (red, cooking)', 'beef broth + red wine vinegar', '1 cup red wine = 1 cup beef broth + 1 tbsp red wine vinegar', 'The broth provides body, the vinegar provides the acidity wine brings. For deglazing and stews.'],
    ['wine (white, cooking)', 'chicken broth + lemon juice', '1 cup white wine = 1 cup chicken broth + 1 tbsp lemon juice', 'Same principle. Crisp white wine\'s acidity and body. Vegetable broth works for vegetarian.'],
    ['cornstarch (thickener)', 'all-purpose flour', '1 tbsp cornstarch = 2 tbsp flour', 'Flour has half the thickening power of cornstarch. Flour-thickened sauces are cloudier and need a few minutes of cooking to lose the raw flour taste.'],
    ['cornstarch (thickener)', 'arrowroot powder', '1:1', 'Arrowroot thickens at lower temperature and works in acidic sauces where cornstarch breaks down. Freezes better. More expensive.'],
    ['mayonnaise', 'Greek yogurt', '1:1', 'Works in tuna salad, chicken salad, dips. Much lower fat. Add a pinch of salt and a drop of vinegar to mimic mayo\'s tang.'],
    ['mayonnaise', 'mashed avocado', '1:1', 'Creamy texture, healthy fats. Works on sandwiches and in chicken salad. Turns brown over time — best for same-day use.'],
    ['ketchup', 'tomato paste + vinegar + sugar', '1 cup ketchup = 1/2 cup tomato paste + 2 tbsp vinegar + 1 tbsp sugar + pinch salt', 'Ketchup is basically sweetened, vinegared tomato paste. Adjust sugar to taste.'],
    ['mustard (prepared)', 'dry mustard powder + water', '1 tbsp prepared mustard = 1 tsp dry mustard + 2 tsp water, rest 10 min', 'Dry mustard needs time to develop its heat. Resting is essential — the chemical reaction that produces mustard\'s sharpness takes ~10 minutes.'],
    ['vanilla extract', 'vanilla bean', '1 tsp vanilla extract = 1/2 vanilla bean (seeds scraped)', 'One whole vanilla bean ≈ 2-3 tsp extract in flavor intensity. Split lengthwise, scrape the seeds. Steep the empty pod in milk or sugar for bonus flavor.'],
    ['vanilla extract', 'maple syrup', '1 tsp vanilla = 1 tsp maple syrup', 'Different flavor but similar aromatic role. Works in pancakes, waffles, oatmeal. Adds sweetness — reduce sugar slightly.'],
    ['lemon zest', 'lemon extract', '1 tsp lemon zest = 1/4 tsp lemon extract', 'Extract is more concentrated and one-note. Zest has aromatic oils that extract lacks. Use extract for intensity, zest for complexity.'],
    ['buttermilk (as meat tenderizer)', 'yogurt', '1 cup buttermilk = 1 cup yogurt', 'Both contain lactic acid that tenderizes meat. Works for fried chicken brine, marinades. Yogurt is thicker — thin with a splash of milk if needed.']
  ];

  /* ---- Search ---- */
  function search(query) {
    var q = query.toLowerCase().trim();
    if (!q) return SUBSTITUTES;
    return SUBSTITUTES.filter(function(s) {
      return s[0].toLowerCase().indexOf(q) !== -1;
    });
  }

  function getSubsFor(ingredient) {
    return SUBSTITUTES.filter(function(s) {
      return s[0].toLowerCase() === ingredient.toLowerCase().trim();
    });
  }

  /* ---- DOM ---- */
  function init() {
    var searchIn = document.getElementById('sub-search');
    var resultsDiv = document.getElementById('sub-results');
    if (!searchIn || !resultsDiv) return;

    function render(query) {
      var subs = query ? getSubsFor(query) : SUBSTITUTES.slice(0, 15);
      if (subs.length === 0) {
        // fuzzy fallback
        var fuzzy = search(query);
        subs = fuzzy.length > 0 ? fuzzy : [];
      }

      resultsDiv.innerHTML = '';
      if (subs.length === 0) {
        resultsDiv.innerHTML = '<p style="color:var(--text-muted);padding:20px;text-align:center;">No substitutes found for "' + query + '". Try a simpler ingredient name (e.g., "egg", "butter", "flour").</p>';
        return;
      }

      // group by substitute
      var groups = {};
      subs.forEach(function(s) {
        var orig = s[0];
        if (!groups[orig]) groups[orig] = [];
        groups[orig].push(s);
      });

      for (var orig in groups) {
        var header = document.createElement('h3');
        header.style.cssText = 'margin:20px 0 10px;color:var(--primary);font-family:var(--font-h);';
        header.textContent = 'Substitutes for ' + orig.charAt(0).toUpperCase() + orig.slice(1);
        resultsDiv.appendChild(header);

        groups[orig].forEach(function(s) {
          var card = document.createElement('div');
          card.className = 'sub-card';
          card.style.cssText = 'background:var(--card-bg);border:1px solid var(--border-light);border-radius:var(--radius);padding:16px 18px;margin-bottom:10px;';
          card.innerHTML =
            '<div style="font-weight:700;color:var(--text);margin-bottom:4px;">→ ' + s[1] + '</div>' +
            '<div style="font-size:0.9rem;color:var(--primary);margin-bottom:6px;font-weight:600;">' + s[2] + '</div>' +
            '<div style="font-size:0.88rem;color:var(--text-secondary);line-height:1.65;">' + s[3] + '</div>';
          resultsDiv.appendChild(card);
        });
      }
    }

    searchIn.addEventListener('input', function() {
      render(searchIn.value);
    });

    // Popular quick-links
    var quickDiv = document.getElementById('sub-quick');
    if (quickDiv) {
      var popular = ['egg', 'butter', 'buttermilk', 'sugar', 'heavy cream', 'flour', 'baking powder', 'sour cream', 'milk'];
      popular.forEach(function(ing) {
        var btn = document.createElement('button');
        btn.textContent = ing;
        btn.style.cssText = 'padding:6px 14px;border:1.5px solid var(--border);border-radius:20px;background:var(--card-bg);color:var(--text-secondary);font-size:0.85rem;font-weight:600;cursor:pointer;font-family:var(--font-body);transition:all var(--ease-fast);margin:0 6px 8px 0;';
        btn.addEventListener('mouseenter', function() {
          btn.style.borderColor = 'var(--primary)';
          btn.style.color = 'var(--primary)';
          btn.style.background = 'var(--primary-light)';
        });
        btn.addEventListener('mouseleave', function() {
          btn.style.borderColor = 'var(--border)';
          btn.style.color = 'var(--text-secondary)';
          btn.style.background = 'var(--card-bg)';
        });
        btn.addEventListener('click', function() {
          searchIn.value = ing;
          render(ing);
          searchIn.scrollIntoView({ behavior: 'smooth' });
        });
        quickDiv.appendChild(btn);
      });
    }

    // initial render
    render('');
  }

  return { init: init, SUBSTITUTES: SUBSTITUTES, search: search, getSubsFor: getSubsFor };
})();

document.addEventListener('DOMContentLoaded', function() {
  SubEngine.init();
});
