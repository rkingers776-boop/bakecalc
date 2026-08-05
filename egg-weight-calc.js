    function calcEggWeight() {
        var size = parseFloat(document.getElementById('egg-size').value) || 50;
        var count = parseInt(document.getElementById('egg-count').value) || 1;
        if (count < 1) count = 1;
        var total = size * count;
        document.getElementById('egg-total-weight').innerText = total + ' g';
    }
    // Fire once on load
    document.addEventListener('DOMContentLoaded', function() {
        calcEggWeight();
    });