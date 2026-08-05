
function convertMl() {
    var ml = parseFloat(document.getElementById('ml-input').value);
    var density = parseFloat(document.getElementById('ingredient-type').value);
    if (isNaN(ml) || ml <= 0) { document.getElementById('g-output').textContent = '—'; return; }
    var g = ml * density;
    document.getElementById('g-output').textContent = Math.round(g);
    document.getElementById('density-display').textContent = density.toFixed(2);
}
document.getElementById('ml-input').addEventListener('input', convertMl);
document.getElementById('ingredient-type').addEventListener('change', convertMl);
convertMl();

