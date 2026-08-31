/* BakeCalc Club — site search
 *
 * Backs /search and the WebSite SearchAction in the home page schema. The whole
 * index ships in search-index.js (~32 KB), so results appear as you type with no
 * network round trip and no server.
 *
 * Matching is prefix-based on words: "coco" finds "cocoa", "convert" finds
 * "conversions". Every term must match somewhere (AND), and matches in a title
 * outrank matches in keywords.
 */
(function () {
  'use strict';

  var INDEX = window.BAKECALC_INDEX || [];
  var GROUP_ORDER = ['Calculators', 'Ingredient conversions', 'Baking know-how', 'About BakeCalc'];
  var MAX_RESULTS = 60;

  /* Stopwords are stripped from the index keywords, so they have to be stripped
     from the query too — otherwise "cup OF flour" matches nothing, because no
     entry contains the word "of". Must stay in sync with build_search_index.py. */
  var STOP = ('a an the to of in for is are and or with your you my how many much ' +
              'does do can i what when why from on at it its be we us').split(' ');
  var STOPSET = {};
  for (var si = 0; si < STOP.length; si++) { STOPSET[STOP[si]] = true; }

  var input = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  var status = document.getElementById('search-status');
  var chips = document.getElementById('search-chips');
  if (!input || !results) { return; }

  /* Pre-split the index once so typing stays cheap. */
  var entries = INDEX.map(function (e) {
    return {
      url: e[0],
      title: e[1],
      cat: e[2],
      words: (e[1] + ' ' + e[2] + ' ' + e[3]).toLowerCase().split(/\s+/),
      titleWords: e[1].toLowerCase().split(/\s+/),
      catWords: e[2].toLowerCase().split(/\s+/)
    };
  });

  function prefixHit(words, term) {
    for (var i = 0; i < words.length; i++) {
      if (words[i].indexOf(term) === 0) { return true; }
    }
    return false;
  }

  function score(entry, terms) {
    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      var s = 0;
      if (prefixHit(entry.titleWords, t)) { s = 8; }
      else if (prefixHit(entry.catWords, t)) { s = 3; }
      else if (prefixHit(entry.words, t)) { s = 2; }
      if (s === 0) { return -1; }          /* every term must land somewhere */
      total += s;
    }
    /* Nudge exact-ish titles up, and keep calculators ahead of long-tail pages. */
    if (entry.title.toLowerCase().indexOf(terms.join(' ')) === 0) { total += 10; }
    return total;
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function render(matches, query) {
    if (!query) {
      results.innerHTML = '';
      status.textContent = '';
      if (chips) { chips.hidden = false; }
      return;
    }
    if (!matches.length) {
      results.innerHTML = '';
      status.textContent = 'No pages match “' + query + '”. Try a shorter word — “flour”, “altitude”, “cost”.';
      if (chips) { chips.hidden = false; }
      return;
    }

    matches.sort(function (a, b) { return b.score - a.score; });
    var shown = matches.slice(0, MAX_RESULTS);

    var buckets = {};
    shown.forEach(function (m) {
      (buckets[m.entry.cat] = buckets[m.entry.cat] || []).push(m.entry);
    });

    var html = '';
    GROUP_ORDER.concat(Object.keys(buckets).filter(function (k) {
      return GROUP_ORDER.indexOf(k) === -1;
    })).forEach(function (cat) {
      var list = buckets[cat];
      if (!list || !list.length) { return; }
      html += '<section class="search-group"><h2>' + escapeHtml(cat) + '</h2><ul class="search-list">';
      list.forEach(function (e) {
        html += '<li><a href="' + escapeHtml(e.url) + '">' +
                '<span class="search-title">' + escapeHtml(e.title) + '</span>' +
                '<span class="search-url">' + escapeHtml(e.url) + '</span></a></li>';
      });
      html += '</ul></section>';
    });
    results.innerHTML = html;

    status.textContent = matches.length + (matches.length === 1 ? ' page' : ' pages') +
      ' match' + (matches.length === 1 ? 'es' : '') + ' “' + query + '”' +
      (matches.length > MAX_RESULTS ? ' — showing the first ' + MAX_RESULTS : '');
    if (chips) { chips.hidden = true; }
  }

  function meaningful(terms) {
    var kept = terms.filter(function (t) { return !STOPSET[t]; });
    return kept.length ? kept : terms;   /* never let filtering empty the query */
  }

  function run() {
    var raw = input.value.trim();
    var terms = meaningful(raw.toLowerCase().split(/\s+/).filter(Boolean));
    if (!terms.length) {
      render([], '');
      syncUrl('');
      return;
    }
    var matches = [];
    for (var i = 0; i < entries.length; i++) {
      var s = score(entries[i], terms);
      if (s > 0) { matches.push({ entry: entries[i], score: s }); }
    }
    render(matches, raw);
    syncUrl(raw);
  }

  var lastPushed = null;
  function syncUrl(q) {
    if (q === lastPushed) { return; }
    lastPushed = q;
    if (!window.history || !window.history.replaceState) { return; }
    var url = q ? location.pathname + '?q=' + encodeURIComponent(q) : location.pathname;
    window.history.replaceState(null, '', url);
  }

  var timer = null;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(run, 90);
  });

  input.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') {
      input.value = '';
      run();
    }
  });

  if (chips) {
    chips.addEventListener('click', function (ev) {
      var btn = ev.target.closest ? ev.target.closest('button') : null;
      if (!btn) { return; }
      input.value = btn.getAttribute('data-q') || '';
      run();
      input.focus();
    });
  }

  /* Honour /search?q=... — this is the entry point Google uses for the
     sitelinks searchbox declared in the home page schema. */
  var params = new URLSearchParams(location.search);
  var initial = params.get('q') || '';
  if (initial) {
    input.value = initial;
    run();
  } else {
    render([], '');
  }
})();
