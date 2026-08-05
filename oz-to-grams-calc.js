
function convertOzToGrams() {
    var oz = parseFloat(document.getElementById('oz-input').value);
    if (isNaN(oz) || oz <= 0) { document.getElementById('g-output').textContent = '—'; return; }
    document.getElementById('g-output').textContent = Math.round(oz * 28.3495);
}
document.getElementById('oz-input').addEventListener('input', convertOzToGrams);
convertOzToGrams();

