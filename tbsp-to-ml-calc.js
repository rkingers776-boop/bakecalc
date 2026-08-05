
function convertTbspToMl() {
    var tbsp = parseFloat(document.getElementById('tbsp-input').value);
    var mlPerTbsp = parseFloat(document.getElementById('tbsp-type').value);
    if (isNaN(tbsp) || tbsp <= 0) { document.getElementById('ml-output').textContent = '—'; return; }
    document.getElementById('ml-output').textContent = (tbsp * mlPerTbsp).toFixed(1);
}
document.getElementById('tbsp-input').addEventListener('input', convertTbspToMl);
document.getElementById('tbsp-type').addEventListener('change', convertTbspToMl);
convertTbspToMl();

