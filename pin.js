/* BakeCalc Club — Pinterest "save" button for article figures
 *
 * Adds a small pill-shaped Save button to every <figure class="article-figure">.
 * Clicking it opens Pinterest's create-pin dialog with the figure's own image,
 * the page it came from, and a description written from the figcaption.
 *
 * Three things this file deliberately does NOT do:
 *
 *   1. It does not load Pinterest's official save-button script. That widget
 *      pulls a third-party bundle onto every page and pings Pinterest on load,
 *      which would break the site's "zero third-party requests until you click"
 *      position that analytics.js and the self-hosted fonts maintain. A plain
 *      <a target="_blank"> costs nothing until the visitor actually clicks.
 *
 *   2. It does not invent an image URL. The page's og:image is a 1200x630 card,
 *      which is the wrong shape for a Pinterest feed (2:3 is what gets shown at
 *      full width). The generator writes a 1000x1500 twin for every page, and
 *      <link rel="pin:media"> points at it. If that tag is missing we fall back
 *      to og:image rather than guessing a filename.
 *
 *   3. It does not run on tool pages. Every figure on this site sits inside an
 *      article; tool pages are full of interactive controls that a hover button
 *      would sit on top of. We select .article-figure and nothing else.
 *
 * Failure mode is graceful: if the DOM API or clipboard-free path is missing,
 * the figure simply keeps rendering the way it did before this file loaded.
 */
(function () {
  'use strict';

  /* Idempotency guard — same pattern as analytics.js. A duplicated <script>
   * tag should not double up the buttons. */
  if (window.__bcPinLoaded) { return; }
  window.__bcPinLoaded = true;

  var ICON =
    '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" ' +
    'focusable="false" fill="currentColor">' +
    '<path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.64 7.86 6.36 9.32-.09-.79-.17-2.01.03-2.88' +
    '.19-.79 1.2-5.06 1.2-5.06s-.31-.61-.31-1.52c0-1.42.82-2.48 1.85-2.48.87 0 1.29.65 1.29 1.44' +
    ' 0 .88-.56 2.19-.85 3.41-.24 1.02.51 1.85 1.52 1.85 1.82 0 3.22-1.92 3.22-4.7 0-2.46-1.77-4.18-4.29-4.18' +
    '-2.92 0-4.64 2.19-4.64 4.46 0 .88.34 1.83.77 2.34.08.1.09.19.07.29-.08.31-.25.98-.28 1.12' +
    '-.04.18-.15.22-.34.13-1.25-.58-2.03-2.4-2.03-3.87 0-3.15 2.29-6.04 6.6-6.04 3.46 0 6.16 2.47 6.16 5.77' +
    ' 0 3.44-2.17 6.21-5.18 6.21-1.01 0-1.96-.53-2.29-1.15l-.62 2.37c-.22.86-.83 1.94-1.24 2.6' +
    '.93.29 1.92.45 2.96.45 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>';

  function metaContent(sel) {
    var el = document.querySelector(sel);
    return el ? (el.getAttribute('content') || '').trim() : '';
  }

  /* The tall twin, if the page was generated with one. */
  function pinMedia() {
    var el = document.querySelector('link[rel="pin:media"]');
    var v = el ? (el.getAttribute('href') || '').trim() : '';
    if (v) { return v; }
    return metaContent('meta[property="og:image"]');
  }

  function pageUrl() {
    var el = document.querySelector('link[rel="canonical"]');
    var v = el ? (el.getAttribute('href') || '').trim() : '';
    return v || location.href;
  }

  /* Build a description from the visible caption: strip the leading "Figure N."
   * label, collapse whitespace, then clamp. Pinterest itself truncates around
   * 500 chars, but a tight 180 keeps the pin readable in the feed. */
  function figureCaption(fig) {
    var cap = fig.querySelector('figcaption');
    if (!cap) { return ''; }
    var t = (cap.textContent || '').replace(/\s+/g, ' ').trim();
    t = t.replace(/^Figure\s*\d+\s*[:.\u2014-]\s*/i, '');
    if (t.length > 180) {
      t = t.slice(0, 180);
      var sp = t.lastIndexOf(' ');
      if (sp > 120) { t = t.slice(0, sp); }
      t = t.replace(/[\s,;:.]+$/, '') + '\u2026';
    }
    return t;
  }

  function buildHref(media, page, desc) {
    var base = 'https://www.pinterest.com/pin/create/button/';
    var parts = ['url=' + encodeURIComponent(page),
                 'media=' + encodeURIComponent(media)];
    if (desc) { parts.push('description=' + encodeURIComponent(desc)); }
    return base + '?' + parts.join('&');
  }

  function attach(fig) {
    if (fig.getAttribute('data-pin-ready') === '1') { return; }
    var svg = fig.querySelector('svg');
    if (!svg) { return; }

    var media = pinMedia();
    if (!media) { return; }

    var page = pageUrl();
    var cap = figureCaption(fig);
    var title = cap || (document.title || '').replace(/\s*\|.*$/, '').trim();
    var desc = title ? (title + ' \u2014 bakecalc.club') : '';

    var a = document.createElement('a');
    a.className = 'pin-save';
    a.href = buildHref(media, page, desc);
    a.target = '_blank';
    a.rel = 'noopener noreferrer nofollow';
    a.setAttribute('aria-label', 'Save this chart to Pinterest');
    a.setAttribute('title', 'Save to Pinterest');
    a.innerHTML = ICON + '<span>Save</span>';

    /* Pinterest's own popup sizing. rel=noopener means the browser ignores
     * window features, but the URL still opens in a new tab either way. */
    a.addEventListener('click', function () {
      try {
        if (window.gtag) {
          window.gtag('event', 'pin_save', {
            event_category: 'engagement',
            event_label: location.pathname
          });
        }
      } catch (e) { /* analytics is optional */ }
    });

    fig.setAttribute('data-pin-ready', '1');
    fig.classList.add('has-pin');
    fig.appendChild(a);
  }

  function run() {
    var figs = document.querySelectorAll('.article-figure');
    for (var i = 0; i < figs.length; i++) {
      try { attach(figs[i]); } catch (e) { /* one bad figure must not kill the rest */ }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
