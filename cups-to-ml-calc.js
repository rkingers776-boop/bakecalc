
function convertCupsToMl() {
    var cups = parseFloat(document.getElementById('cups-input').value);
    var mlPerCup = parseFloat(document.getElementById('cup-type').value);
    if (isNaN(cups) || cups <= 0) {
        document.getElementById('ml-output').textContent = '—';
        document.getElementById('floz-output').textContent = '—';
        document.getElementById('tbsp-output').textContent = '—';
        return;
    }
    var ml = cups * mlPerCup;
    document.getElementById('ml-output').textContent = ml.toFixed(1);
    document.getElementById('floz-output').textContent = (ml / 29.5735).toFixed(1);
    document.getElementById('tbsp-output').textContent = (ml / 14.7868).toFixed(1);
}
document.getElementById('cups-input').addEventListener('input', convertCupsToMl);
document.getElementById('cup-type').addEventListener('change', convertCupsToMl);
convertCupsToMl();

