$ErrorActionPreference = "Continue"
$base = $PSScriptRoot

# ---------------------------------------------------------------
# HELPER: Build a <section> of related links
# ---------------------------------------------------------------
function Section($links, $title) {
    $h = "`r`n            <section class=`"related-conversions`">`r`n"
    $h += "                <h3>$title</h3>`r`n"
    $h += "                <ul class=`"related-links`">`r`n"
    foreach ($pair in $links) {
        $file = $pair[0]
        $label = $pair[1]
        if ($file.StartsWith("/")) {
            $href = $file
        } else {
            $href = "/$file"
        }
        $h += "                    <li><a href=`"$href`">$label</a></li>`r`n"
    }
    $h += "                </ul>`r`n"
    $h += "            </section>`r`n"
    return $h
}

# ---------------------------------------------------------------
# DATA: Ingredient groups (ALL ASCII - no Unicode fractions!)
# ---------------------------------------------------------------
$Flour = @(
    ,@("1-cup-flour-to-grams.html","1 Cup Flour to Grams")
    ,@("1-2-cup-flour-to-grams.html","1/2 Cup Flour to Grams")
    ,@("1-3-cup-flour-to-grams.html","1/3 Cup Flour to Grams")
    ,@("1-4-cup-flour-to-grams.html","1/4 Cup Flour to Grams")
    ,@("1-cup-almond-flour-to-grams.html","Almond Flour")
    ,@("1-cup-cocoa-powder-to-grams.html","Cocoa Powder")
    ,@("1-cup-cornstarch-to-grams.html","Cornstarch")
    ,@("100g-grams-to-cups-flour","100g Flour to Cups")
    ,@("/articles/how-to-measure-flour-correctly","How to Measure Flour")
)
$Sugar = @(
    ,@("1-cup-sugar-to-grams.html","1 Cup Sugar to Grams")
    ,@("1-2-cup-sugar-to-grams.html","1/2 Cup Sugar to Grams")
    ,@("1-3-cup-sugar-to-grams.html","1/3 Cup Sugar to Grams")
    ,@("1-4-cup-sugar-to-grams.html","1/4 Cup Sugar to Grams")
    ,@("1-cup-brown-sugar-to-grams.html","Brown Sugar")
    ,@("1-cup-powdered-sugar-to-grams.html","Powdered Sugar")
    ,@("1-cup-honey-to-grams.html","Honey")
    ,@("100g-grams-to-cups-sugar","100g Sugar to Cups")
)
$BrownSugar = @(
    ,@("1-cup-brown-sugar-to-grams.html","1 Cup Brown Sugar")
    ,@("1-2-cup-brown-sugar-to-grams.html","1/2 Cup Brown Sugar")
    ,@("1-3-cup-brown-sugar-to-grams.html","1/3 Cup Brown Sugar")
    ,@("1-4-cup-brown-sugar-to-grams.html","1/4 Cup Brown Sugar")
    ,@("1-cup-sugar-to-grams.html","Granulated Sugar")
    ,@("1-cup-powdered-sugar-to-grams.html","Powdered Sugar")
    ,@("1-tbsp-brown-sugar-to-grams.html","1 Tbsp Brown Sugar")
    ,@("/articles/how-to-soften-brown-sugar","How to Soften Brown Sugar")
)
$PowderedSugar = @(
    ,@("1-cup-powdered-sugar-to-grams.html","1 Cup Powdered Sugar")
    ,@("1-2-cup-powdered-sugar-to-grams.html","1/2 Cup Powdered Sugar")
    ,@("1-4-cup-powdered-sugar-to-grams.html","1/4 Cup Powdered Sugar")
    ,@("1-cup-sugar-to-grams.html","Granulated Sugar")
    ,@("1-cup-brown-sugar-to-grams.html","Brown Sugar")
    ,@("100g-powdered-sugar-to-cups.html","100g Powdered Sugar to Cups")
)
$Butter = @(
    ,@("1-cup-butter-to-grams.html","1 Cup Butter to Grams")
    ,@("1-2-cup-butter-to-grams.html","1/2 Cup Butter to Grams")
    ,@("1-3-cup-butter-to-grams.html","1/3 Cup Butter to Grams")
    ,@("1-4-cup-butter-to-grams.html","1/4 Cup Butter to Grams")
    ,@("1-cup-coconut-oil-to-grams.html","Coconut Oil")
    ,@("1-cup-vegetable-oil-to-grams.html","Vegetable Oil")
    ,@("1-tbsp-butter-to-grams.html","1 Tbsp Butter to Grams")
    ,@("/articles/room-temperature-butter-vs-cold","Room Temp Butter vs Cold")
)
$CoconutOil = @(
    ,@("1-cup-coconut-oil-to-grams.html","1 Cup Coconut Oil")
    ,@("1-2-cup-coconut-oil-to-grams.html","1/2 Cup Coconut Oil")
    ,@("1-4-cup-coconut-oil-to-grams.html","1/4 Cup Coconut Oil")
    ,@("1-cup-butter-to-grams.html","Butter")
    ,@("1-cup-vegetable-oil-to-grams.html","Vegetable Oil")
    ,@("1-tbsp-coconut-oil-to-grams.html","1 Tbsp Coconut Oil")
)
$VegOil = @(
    ,@("1-cup-vegetable-oil-to-grams.html","1 Cup Vegetable Oil")
    ,@("1-2-cup-vegetable-oil-to-grams.html","1/2 Cup Vegetable Oil")
    ,@("1-cup-butter-to-grams.html","Butter")
    ,@("1-cup-coconut-oil-to-grams.html","Coconut Oil")
    ,@("1-tbsp-vegetable-oil-to-grams.html","1 Tbsp Vegetable Oil")
)
$Honey = @(
    ,@("1-cup-honey-to-grams.html","1 Cup Honey to Grams")
    ,@("1-2-cup-honey-to-grams.html","1/2 Cup Honey to Grams")
    ,@("1-4-cup-honey-to-grams.html","1/4 Cup Honey to Grams")
    ,@("1-4-cup-maple-syrup-to-grams.html","Maple Syrup")
    ,@("1-cup-sugar-to-grams.html","Sugar")
    ,@("1-tbsp-honey-to-grams.html","1 Tbsp Honey to Grams")
    ,@("/articles/baking-with-honey-instead-of-sugar","Baking with Honey")
)
$AlmondFlour = @(
    ,@("1-cup-almond-flour-to-grams.html","1 Cup Almond Flour")
    ,@("1-2-cup-almond-flour-to-grams.html","1/2 Cup Almond Flour")
    ,@("1-4-cup-almond-flour-to-grams.html","1/4 Cup Almond Flour")
    ,@("1-cup-almond-meal-to-grams.html","Almond Meal")
    ,@("1-4-cup-coconut-flour-to-grams.html","Coconut Flour")
    ,@("1-cup-flour-to-grams.html","All-Purpose Flour")
)
$Cocoa = @(
    ,@("1-cup-cocoa-powder-to-grams.html","1 Cup Cocoa Powder")
    ,@("1-2-cup-cocoa-powder-to-grams.html","1/2 Cup Cocoa Powder")
    ,@("1-4-cup-cocoa-powder-to-grams.html","1/4 Cup Cocoa Powder")
    ,@("1-cup-flour-to-grams.html","All-Purpose Flour")
    ,@("1-cup-powdered-sugar-to-grams.html","Powdered Sugar")
    ,@("50g-cocoa-powder-to-cups.html","50g Cocoa Powder to Cups")
    ,@("100g-cocoa-powder-to-cups.html","100g Cocoa Powder to Cups")
)
$TbspAll = @(
    ,@("1-tbsp-flour-to-grams.html","1 Tbsp Flour")
    ,@("1-tbsp-sugar-to-grams.html","1 Tbsp Sugar")
    ,@("1-tbsp-brown-sugar-to-grams.html","1 Tbsp Brown Sugar")
    ,@("1-tbsp-butter-to-grams.html","1 Tbsp Butter")
    ,@("1-tbsp-honey-to-grams.html","1 Tbsp Honey")
    ,@("1-tbsp-coconut-oil-to-grams.html","1 Tbsp Coconut Oil")
    ,@("1-tbsp-vegetable-oil-to-grams.html","1 Tbsp Vegetable Oil")
    ,@("1-tbsp-cornstarch-to-grams.html","1 Tbsp Cornstarch")
)
$TspAll = @(
    ,@("1-tsp-baking-powder-to-grams.html","1 Tsp Baking Powder")
    ,@("1-tsp-baking-soda-to-grams.html","1 Tsp Baking Soda")
    ,@("1-tsp-instant-yeast-to-grams.html","1 Tsp Instant Yeast")
    ,@("1-tsp-salt-to-grams.html","1 Tsp Salt")
)
$OzAll = @(
    ,@("1-oz-to-ml.html","1 oz to mL")
    ,@("2-oz-to-ml.html","2 oz to mL")
    ,@("3-oz-to-ml.html","3 oz to mL")
    ,@("4-oz-to-ml.html","4 oz to mL")
    ,@("5-oz-to-ml.html","5 oz to mL")
    ,@("6-oz-to-ml.html","6 oz to mL")
    ,@("8-oz-to-ml.html","8 oz to mL")
    ,@("16-oz-to-ml.html","16 oz to mL")
    ,@("24-oz-to-ml.html","24 oz to mL")
    ,@("32-oz-to-ml.html","32 oz to mL")
)
$OzLiquids = @(
    ,@("10-oz-to-ml-water.html","10 oz Water to mL")
    ,@("10-oz-to-ml-milk.html","10 oz Milk to mL")
    ,@("10-oz-to-ml-oil.html","10 oz Oil to mL")
    ,@("10-oz-to-ml-cream.html","10 oz Cream to mL")
    ,@("12-oz-to-ml-water.html","12 oz Water to mL")
)
$GtoCFlour = @(
    ,@("50g-grams-to-cups-flour","50g Flour to Cups")
    ,@("100g-grams-to-cups-flour","100g Flour to Cups")
    ,@("120g-grams-to-cups-flour","120g Flour to Cups")
    ,@("150g-grams-to-cups-flour","150g Flour to Cups")
    ,@("200g-grams-to-cups-flour","200g Flour to Cups")
    ,@("250g-grams-to-cups-flour","250g Flour to Cups")
    ,@("300g-grams-to-cups-flour","300g Flour to Cups")
    ,@("400g-grams-to-cups-flour","400g Flour to Cups")
    ,@("500g-grams-to-cups-flour","500g Flour to Cups")
)
$GtoCSugar = @(
    ,@("50g-grams-to-cups-sugar","50g Sugar to Cups")
    ,@("100g-grams-to-cups-sugar","100g Sugar to Cups")
    ,@("150g-grams-to-cups-sugar","150g Sugar to Cups")
    ,@("200g-grams-to-cups-sugar","200g Sugar to Cups")
    ,@("250g-grams-to-cups-sugar","250g Sugar to Cups")
    ,@("300g-grams-to-cups-sugar","300g Sugar to Cups")
    ,@("400g-grams-to-cups-sugar","400g Sugar to Cups")
    ,@("500g-grams-to-cups-sugar","500g Sugar to Cups")
)
$GtoCButter = @(
    ,@("50g-grams-to-cups-butter","50g Butter to Cups")
    ,@("100g-grams-to-cups-butter","100g Butter to Cups")
    ,@("150g-grams-to-cups-butter","150g Butter to Cups")
    ,@("200g-grams-to-cups-butter","200g Butter to Cups")
    ,@("250g-grams-to-cups-butter","250g Butter to Cups")
    ,@("300g-grams-to-cups-butter","300g Butter to Cups")
    ,@("400g-grams-to-cups-butter","400g Butter to Cups")
    ,@("500g-grams-to-cups-butter","500g Butter to Cups")
)

# ---------------------------------------------------------------
# FILTER: Remove self-link
# ---------------------------------------------------------------
function Filter($links, $selfFile) {
    $result = @()
    foreach ($pair in $links) {
        if ($pair[0] -ne $selfFile) {
            $result += ,$pair
        }
    }
    return $result
}

# ---------------------------------------------------------------
# CLASSIFY & GET RELATED LINKS
# ---------------------------------------------------------------
function GetRelated($fileName) {
    $bn = [System.IO.Path]::GetFileNameWithoutExtension($fileName)
    $self = "$bn.html"

    # CUPS TO GRAMS
    if ($bn -match "cup-flour-to-grams" -and $bn -notmatch "almond|coconut") {
        return Section (Filter $Flour $self) "More Flour Conversions"
    }
    if ($bn -match "cup-almond-flour-to-grams") {
        return Section (Filter $AlmondFlour $self) "More Almond Flour Conversions"
    }
    if ($bn -match "cup-almond-meal-to-grams") {
        $links = @(, @("1-cup-almond-flour-to-grams.html","Almond Flour"), @("1-4-cup-coconut-flour-to-grams.html","Coconut Flour"), @("1-cup-flour-to-grams.html","All-Purpose Flour"))
        return Section $links "Related Conversions"
    }
    if ($bn -match "cup-coconut-flour-to-grams") {
        $links = @(, @("1-cup-almond-flour-to-grams.html","Almond Flour"), @("1-cup-almond-meal-to-grams.html","Almond Meal"), @("1-cup-flour-to-grams.html","All-Purpose Flour"))
        return Section $links "Related Conversions"
    }
    if ($bn -match "cup-brown-sugar-to-grams") {
        return Section (Filter $BrownSugar $self) "More Brown Sugar Conversions"
    }
    if ($bn -match "cup-powdered-sugar-to-grams") {
        return Section (Filter $PowderedSugar $self) "More Powdered Sugar Conversions"
    }
    if ($bn -match "cup-sugar-to-grams") {
        return Section (Filter $Sugar $self) "More Sugar Conversions"
    }
    if ($bn -match "cup-butter-to-grams") {
        return Section (Filter $Butter $self) "More Butter Conversions"
    }
    if ($bn -match "cup-coconut-oil-to-grams") {
        return Section (Filter $CoconutOil $self) "More Coconut Oil Conversions"
    }
    if ($bn -match "cup-vegetable-oil-to-grams") {
        return Section (Filter $VegOil $self) "More Vegetable Oil Conversions"
    }
    if ($bn -match "cup-honey-to-grams") {
        return Section (Filter $Honey $self) "More Honey Conversions"
    }
    if ($bn -match "cup-cocoa-powder-to-grams") {
        return Section (Filter $Cocoa $self) "More Cocoa Powder Conversions"
    }
    if ($bn -match "cup-cornstarch-to-grams") {
        $links = @(, @("1-cup-flour-to-grams.html","All-Purpose Flour"), @("1-tbsp-cornstarch-to-grams.html","1 Tbsp Cornstarch"), @("1-cup-cocoa-powder-to-grams.html","Cocoa Powder"))
        return Section $links "Related Conversions"
    }
    if ($bn -match "cup-rolled-oats-to-grams") {
        $links = @(, @("1-cup-flour-to-grams.html","All-Purpose Flour"), @("1-cup-almond-flour-to-grams.html","Almond Flour"), @("1-cup-cornstarch-to-grams.html","Cornstarch"))
        return Section $links "Related Conversions"
    }
    if ($bn -match "cup-maple-syrup-to-grams") {
        $links = @(, @("1-cup-honey-to-grams.html","Honey"), @("1-cup-sugar-to-grams.html","Sugar"), @("/articles/baking-with-honey-instead-of-sugar","Baking with Honey"))
        return Section $links "Related Conversions"
    }

    # TBSP
    if ($bn -match "tbsp-.*-to-grams") {
        return Section (Filter $TbspAll $self) "More Tablespoon Conversions"
    }

    # TSP
    if ($bn -match "tsp-") {
        return Section (Filter $TspAll $self) "More Teaspoon Conversions"
    }

    # OZ TO ML
    if ($bn -match "oz-to-ml-water" -or $bn -match "oz-to-ml-milk" -or $bn -match "oz-to-ml-oil" -or $bn -match "oz-to-ml-cream") {
        return Section (Filter $OzLiquids $self) "More Liquid Conversions"
    }
    if ($bn -match "oz-to-ml") {
        return Section (Filter $OzAll $self) "More oz to mL Conversions"
    }

    # GRAMS TO CUPS
    if ($bn -match "grams-to-cups-flour") {
        return Section (Filter $GtoCFlour $bn) "More Grams to Cups (Flour)"
    }
    if ($bn -match "grams-to-cups-sugar") {
        return Section (Filter $GtoCSugar $bn) "More Grams to Cups (Sugar)"
    }
    if ($bn -match "grams-to-cups-butter") {
        return Section (Filter $GtoCButter $bn) "More Grams to Cups (Butter)"
    }

    # Special grams-to-cups without "grams" in name
    if ($bn -match "brown-sugar-to-cups") {
        $links = @(, @("1-cup-brown-sugar-to-grams.html","1 Cup Brown Sugar to Grams"), @("100g-grams-to-cups-sugar","100g Sugar to Cups"), @("100g-grams-to-cups-flour","100g Flour to Cups"))
        return Section $links "Related Conversions"
    }
    if ($bn -match "powdered-sugar-to-cups") {
        $links = @(, @("1-cup-powdered-sugar-to-grams.html","1 Cup Powdered Sugar to Grams"), @("100g-grams-to-cups-sugar","100g Sugar to Cups"))
        return Section $links "Related Conversions"
    }
    if ($bn -match "cocoa-powder-to-cups") {
        $links = @(, @("1-cup-cocoa-powder-to-grams.html","1 Cup Cocoa Powder"), @("100g-grams-to-cups-flour","100g Flour to Cups"))
        return Section $links "Related Conversions"
    }

    # Special standalone
    if ($bn -match "how-many-grams-is-1-egg") {
        $links = @(, @("1-cup-flour-to-grams","1 Cup Flour to Grams"), @("1-cup-butter-to-grams","1 Cup Butter to Grams"), @("/articles/egg-substitutes-for-baking","Egg Substitutes for Baking"))
        return Section $links "Related Conversions"
    }
    if ($bn -match "oven-temperature-conversion") {
        $links = @(, @("1-cup-flour-to-grams","1 Cup Flour to Grams"), @("1-oz-to-ml","1 oz to mL"), @("/articles/high-altitude-baking-adjustments","High-Altitude Baking"))
        return Section $links "Related Conversions"
    }

    return $null
}

# ---------------------------------------------------------------
# PASS 1: Process all converter/tool pages
# ---------------------------------------------------------------
$convCount = 0
$titleCount = 0
$allFiles = Get-ChildItem "$base\*.html" -Exclude "index.html","about.html","contact.html","privacy.html"

foreach ($f in $allFiles) {
    $content = [System.IO.File]::ReadAllText($f.FullName)
    $changed = $false

    # ADD RELATED CONVERSIONS
    if ($content -notmatch "related-conversions") {
        $related = GetRelated $f.Name
        if ($related) {
            # Insert before footer-github
            $content = $content -replace "(<p class=`"footer-github`")", "$related            `$1"
            $changed = $true
            $convCount++
        }
    }

    # FIX TITLE
    if ($content -match '<title>([^<]+)</title>') {
        $oldTitle = $Matches[1]
        $newTitle = $oldTitle
        # Remove existing brand suffix
        $newTitle = $newTitle -replace " \| BakeCalc Club$","" -replace " \| BakeCalc$",""
        # Replace hyphen separators with em dash
        $newTitle = $newTitle -replace " - Free"," -- Free"
        $newTitle = $newTitle -replace " - "," -- "
        # Add brand
        $newTitle = "$newTitle | BakeCalc"

        if ($newTitle -ne $oldTitle) {
            $escOld = [regex]::Escape($oldTitle)
            $content = $content -replace $escOld, $newTitle
            # Fix og:title and twitter:title too
            $content = $content -replace "content=`"$escOld`"", "content=`"$newTitle`""
            $changed = $true
            $titleCount++
        }
    }

    if ($changed) {
        [System.IO.File]::WriteAllText($f.FullName, $content)
    }
}

Write-Host "PASS 1: Related conversions added to $convCount pages, titles fixed on $titleCount"

# ---------------------------------------------------------------
# PASS 2: Article pages - add CTA blocks
# ---------------------------------------------------------------
$articleCTAs = @{
    "why-cake-sinks-in-middle" = @(@("/recipe-scaler","Recipe Scaler"),@("/pan-size-converter","Pan Size Converter"),@("/oven-temperature-conversion","Oven Temperature Conversion"))
    "why-cake-dense-not-fluffy" = @(@("/recipe-scaler","Recipe Scaler"),@("/bakers-percentage-calculator","Baker's Percentage Calculator"),@("/articles/creaming-butter-and-sugar-visual-guide","Creaming Butter & Sugar Guide"))
    "why-bread-didnt-rise" = @(@("/bakers-percentage-calculator","Baker's Percentage Calculator"),@("/sourdough-hydration-calculator","Sourdough Hydration Calculator"),@("/articles/windowpane-test-dough-kneaded-enough","Windowpane Test Guide"))
    "cookie-spread-too-much" = @(@("/recipe-scaler","Recipe Scaler"),@("/1-cup-butter-to-grams","1 Cup Butter to Grams"),@("/articles/room-temperature-butter-vs-cold","Room Temp vs Cold Butter"))
    "how-to-measure-flour-correctly" = @(@("/1-cup-flour-to-grams","1 Cup Flour to Grams Converter"),@("/recipe-scaler","Recipe Scaler"),@("/articles/cups-to-grams-complete-guide","Cups to Grams Complete Guide"))
    "sourdough-starter-feeding-guide" = @(@("/sourdough-hydration-calculator","Sourdough Hydration Calculator"),@("/bakers-percentage-calculator","Baker's Percentage Calculator"))
    "sourdough-troubleshooting" = @(@("/sourdough-hydration-calculator","Sourdough Hydration Calculator"),@("/bakers-percentage-calculator","Baker's Percentage Calculator"))
    "bakers-percentage-explained" = @(@("/bakers-percentage-calculator","Baker's Percentage Calculator"),@("/sourdough-hydration-calculator","Sourdough Hydration Calculator"),@("/recipe-scaler","Recipe Scaler"))
    "cups-to-grams-complete-guide" = @(@("/1-cup-flour-to-grams","1 Cup Flour to Grams"),@("/1-cup-sugar-to-grams","1 Cup Sugar to Grams"),@("/1-cup-butter-to-grams","1 Cup Butter to Grams"),@("/recipe-scaler","Recipe Scaler"))
    "how-to-price-homemade-baked-goods" = @(@("/cost-calculator","Recipe Cost Calculator"),@("/recipe-scaler","Recipe Scaler"))
    "baking-with-honey-instead-of-sugar" = @(@("/1-cup-honey-to-grams","1 Cup Honey to Grams"),@("/1-cup-sugar-to-grams","1 Cup Sugar to Grams"),@("/recipe-scaler","Recipe Scaler"))
    "egg-substitutes-for-baking" = @(@("/how-many-grams-is-1-egg","How Many Grams Is 1 Egg?"),@("/recipe-scaler","Recipe Scaler"))
    "high-altitude-baking-adjustments" = @(@("/oven-temperature-conversion","Oven Temperature Conversion"),@("/recipe-scaler","Recipe Scaler"))
    "baking-powder-vs-baking-soda" = @(@("/1-tsp-baking-powder-to-grams","1 Tsp Baking Powder"),@("/1-tsp-baking-soda-to-grams","1 Tsp Baking Soda"),@("/recipe-scaler","Recipe Scaler"))
    "creaming-butter-and-sugar-visual-guide" = @(@("/1-cup-butter-to-grams","1 Cup Butter to Grams"),@("/1-cup-sugar-to-grams","1 Cup Sugar to Grams"),@("/articles/room-temperature-butter-vs-cold","Room Temp vs Cold Butter"))
    "room-temperature-butter-vs-cold" = @(@("/1-cup-butter-to-grams","1 Cup Butter to Grams"),@("/articles/creaming-butter-and-sugar-visual-guide","Creaming Butter & Sugar Guide"))
    "how-to-soften-brown-sugar" = @(@("/1-cup-brown-sugar-to-grams","1 Cup Brown Sugar to Grams"),@("/recipe-scaler","Recipe Scaler"))
    "how-to-tell-when-cake-is-done" = @(@("/oven-temperature-conversion","Oven Temperature Conversion"),@("/recipe-scaler","Recipe Scaler"))
    "tangzhong-yudane-japanese-milk-bread" = @(@("/bakers-percentage-calculator","Baker's Percentage Calculator"),@("/1-cup-flour-to-grams","1 Cup Flour to Grams"))
    "no-knead-bread-method" = @(@("/bakers-percentage-calculator","Baker's Percentage Calculator"),@("/1-cup-flour-to-grams","1 Cup Flour to Grams"),@("/articles/windowpane-test-dough-kneaded-enough","Windowpane Test"))
    "buttermilk-substitute-baking" = @(@("/recipe-scaler","Recipe Scaler"),@("/1-cup-flour-to-grams","1 Cup Flour to Grams"))
    "windowpane-test-dough-kneaded-enough" = @(@("/bakers-percentage-calculator","Baker's Percentage Calculator"),@("/articles/why-bread-didnt-rise","Why Bread Didn't Rise"))
}

$artCount = 0
$articleFiles = Get-ChildItem "$base\articles\*.html" -Exclude "index.html"

foreach ($f in $articleFiles) {
    $bn = $f.BaseName
    $content = [System.IO.File]::ReadAllText($f.FullName)
    $changed = $false

    if ($articleCTAs.ContainsKey($bn) -and $content -notmatch "try-these-tools") {
        $ctaLinks = @()
        foreach ($item in $articleCTAs[$bn]) {
            $ctaLinks += ,@($item[0], $item[1])
        }
        $cta = Section $ctaLinks "Try These Free Tools"
        # The Section function uses class="related-conversions", need to change to try-these-tools
        $cta = $cta -replace 'class="related-conversions"', 'class="try-these-tools"'
        $content = $content -replace "(<p class=`"footer-github`")", "$cta            `$1"
        $changed = $true
        $artCount++
    }

    if ($changed) {
        [System.IO.File]::WriteAllText($f.FullName, $content)
    }
}

Write-Host "PASS 2: Article CTAs added to $artCount pages"

# ---------------------------------------------------------------
# PASS 3: Tool pages (cost, recipe-scaler, etc.)
# ---------------------------------------------------------------
$toolRelated = @(
    ,@("1-cup-flour-to-grams","1 Cup Flour to Grams")
    ,@("1-cup-sugar-to-grams","1 Cup Sugar to Grams")
    ,@("1-cup-butter-to-grams","1 Cup Butter to Grams")
    ,@("1-oz-to-ml","1 oz to mL")
    ,@("how-many-grams-is-1-egg","How Many Grams Is 1 Egg?")
    ,@("/oven-temperature-conversion","Oven Temperature Conversion")
)

$toolArticles = @{
    "cost-calculator" = @(@("/articles/how-to-price-homemade-baked-goods","How to Price Baked Goods"))
    "recipe-scaler" = @(@("/articles/cups-to-grams-complete-guide","Cups to Grams Complete Guide"),@("/articles/high-altitude-baking-adjustments","High-Altitude Baking"))
    "bakers-percentage-calculator" = @(@("/articles/bakers-percentage-explained","Baker's Percentage Explained"),@("/articles/sourdough-starter-feeding-guide","Sourdough Starter Guide"))
    "pan-size-converter" = @(@("/articles/why-cake-sinks-in-middle","Why Cakes Sink"),@("/articles/how-to-tell-when-cake-is-done","When Cake Is Done"))
    "sourdough-hydration-calculator" = @(@("/articles/sourdough-starter-feeding-guide","Sourdough Starter Guide"),@("/articles/sourdough-troubleshooting","Sourdough Troubleshooting"),@("/articles/no-knead-bread-method","No-Knead Bread Method"))
}

$toolCount = 0
$toolNames = @("cost-calculator.html","recipe-scaler.html","bakers-percentage-calculator.html","pan-size-converter.html","sourdough-hydration-calculator.html")

foreach ($name in $toolNames) {
    $f = Get-Item "$base\$name"
    $bn = $f.BaseName
    $content = [System.IO.File]::ReadAllText($f.FullName)
    $changed = $false

    if ($content -notmatch "related-conversions") {
        $related = Section $toolRelated "Quick Ingredient Converters"
        $content = $content -replace "(<p class=`"footer-github`")", "$related            `$1"
        $changed = $true
    }

    if ($toolArticles.ContainsKey($bn) -and $content -notmatch "try-these-tools") {
        $artLinks = @()
        foreach ($item in $toolArticles[$bn]) {
            $artLinks += ,@($item[0], $item[1])
        }
        $artHtml = (Section $artLinks "Related Guides") -replace 'class="related-conversions"', 'class="try-these-tools"'
        $content = $content -replace "(<p class=`"footer-github`")", "$artHtml            `$1"
        $changed = $true
    }

    if ($changed) {
        [System.IO.File]::WriteAllText($f.FullName, $content)
        $toolCount++
    }
}

Write-Host "PASS 3: Tool pages updated: $toolCount"

# ---------------------------------------------------------------
# PASS 4: Homepage - title + JSON-LD
# ---------------------------------------------------------------
$indexPath = "$base\index.html"
$indexContent = [System.IO.File]::ReadAllText($indexPath)
$indexChanged = $false

if ($indexContent -match '<title>([^<]+)</title>') {
    $old = $Matches[1]
    $new = "BakeCalc -- Free Baking Conversion Calculators & Recipe Tools | BakeCalc"
    if ($old -ne $new) {
        $escOld = [regex]::Escape($old)
        $indexContent = $indexContent -replace $escOld, $new
        $indexContent = $indexContent -replace "content=`"$escOld`"", "content=`"$new`""
        $indexContent = $indexContent -replace "BakeCalc Club -- Free Baking Cost Calculator & Converters", "BakeCalc -- Free Baking Conversion Calculators & Recipe Tools"
        $indexChanged = $true
        Write-Host "Homepage title fixed"
    }
}

if ($indexContent -notmatch "SearchAction") {
    $webSiteLD = '    <script type="application/ld+json">' + "`r`n" +
    '    {' + "`r`n" +
    '      "@context": "https://schema.org",' + "`r`n" +
    '      "@type": "WebSite",' + "`r`n" +
    '      "name": "BakeCalc",' + "`r`n" +
    '      "url": "https://bakecalc.club/",' + "`r`n" +
    '      "potentialAction": {' + "`r`n" +
    '        "@type": "SearchAction",' + "`r`n" +
    '        "target": "https://bakecalc.club/search?q={search_term_string}",' + "`r`n" +
    '        "query-input": "required name=search_term_string"' + "`r`n" +
    '      }' + "`r`n" +
    '    }' + "`r`n" +
    '    </script>'
    $indexContent = $indexContent -replace "(</script>\r?\n</head>)", "$webSiteLD`r`n`$1"
    $indexChanged = $true
    Write-Host "Homepage WebSite+SearchAction JSON-LD added"
}

if ($indexChanged) {
    [System.IO.File]::WriteAllText($indexPath, $indexContent)
}

Write-Host ""
Write-Host "=== ALL DONE ==="
Write-Host "Converter Related Links: $convCount"
Write-Host "Titles Fixed: $titleCount"
Write-Host "Article CTAs: $artCount"
Write-Host "Tool Pages: $toolCount"
