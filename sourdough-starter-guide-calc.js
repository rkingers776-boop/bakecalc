
                (function(){
                    var ratioSel = document.getElementById('sc-ratio');
                    var starterIn = document.getElementById('sc-starter');
                    function updateCalc() {
                        var r = parseInt(ratioSel.value);
                        var s = parseFloat(starterIn.value) || 0;
                        if (s <= 0) s = 0;
                        var f = Math.round(s * r);
                        var w = f;
                        var t = s + f + w;
                        document.getElementById('sc-starter-out').textContent = s;
                        document.getElementById('sc-flour').textContent = f;
                        document.getElementById('sc-water').textContent = w;
                        document.getElementById('sc-total').textContent = t;
                    }
                    ratioSel.addEventListener('change', updateCalc);
                    starterIn.addEventListener('input', updateCalc);
                    updateCalc();
                })();
                
