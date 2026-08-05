
function convertLbs() {
    var lbs = parseFloat(document.getElementById('lbs-input').value);
    if (isNaN(lbs) || lbs <= 0) { document.getElementById('kg-output').textContent = '—'; document.getElementById('g-output').textContent = '—'; return; }
    var kg = lbs * 0.45359237;
    var g = kg * 1000;
    document.getElementById('kg-output').textContent = kg.toFixed(2);
    document.getElementById('g-output').textContent = Math.round(g);
}
function quickConvert(lbs) {
    document.getElementById('lbs-input').value = lbs;
    convertLbs();
}
document.getElementById('lbs-input').addEventListener('input', convertLbs);
convertLbs();

