/* BakeCalc Club — the site's only Google Analytics (GA4) surface
 *
 * Every HTML page loads this one file, deferred, and nothing else configures
 * GA. Three calculator scripts used to carry their own gtag snippet: each ran
 * a second `config` call, which fired a second page_view on those tool pages
 * and inflated the numbers. Worse, none of them checked the opt-out signals
 * below, so a visitor with Global Privacy Control or Do Not Track on was
 * still measured on exactly the pages where they were doing real work.
 *
 * Four safeguards live here on purpose:
 *   1. Idempotency guard — a duplicate <script> tag exits instead of firing a
 *      second page_view.
 *   2. Privacy signals — visitors sending GPC or an enabled Do Not Track
 *      setting get no analytics at all: no gtag.js, no cookies, and
 *      bcTrack() is a no-op. This is what makes the "you can opt out"
 *      paragraph in the privacy policy true.
 *   3. Secure cookie flags — GA cookies are restricted to HTTPS + SameSite so
 *      they are never sent cross-site.
 *   4. One event outlet — window.bcTrack(). Tools call it; none of them load
 *      or configure GA.
 *
 * See /privacy for the plain-language version.
 */
(function () {
  'use strict';

  var GA_ID = 'G-G1GB4E169W';

  /* 1. Never load twice. */
  if (window.__bcAnalyticsLoaded) { return; }
  window.__bcAnalyticsLoaded = true;

  /* 2. Honour opt-out signals before we touch anything. */
  var optedOut =
    navigator.globalPrivacyControl === true ||
    navigator.doNotTrack === '1' ||
    navigator.msDoNotTrack === '1' ||
    window.doNotTrack === '1';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: optedOut ? 'denied' : 'granted',
    functionality_storage: 'granted',
    security_storage: 'granted'
  });

  /* 4. The only sanctioned way to send an event. Declared before the opt-out
   *    return so a page that calls it always finds a function. */
  var explicitComplete = false;

  function track(name, params) {
    if (name === 'calculator_complete') { explicitComplete = true; }
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params || {});
    }
  }

  window.bcTrack = optedOut ? function () {} : track;

  if (optedOut) {
    gtag('consent', 'update', { analytics_storage: 'denied' });
    return;
  }

  gtag('js', new Date());
  gtag('config', GA_ID, {
    cookie_flags: 'SameSite=Lax;Secure'
  });

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  /* ============================================================
     Page context
     ============================================================ */

  var PAGE = location.pathname.replace(/^\/+|\/+$/g, '') || 'home';
  var IS_ARTICLE = /^articles\//.test(PAGE);

  /* Pages where an <input> is not a calculator: the search box lives on
   * /search, and nothing on / or /404 takes numeric input. */
  var NOT_A_CALC = { home: 1, search: 1, '404': 1 };

  function closest(el, sel) {
    while (el && el.nodeType === 1) {
      if (el.matches && el.matches(sel)) { return el; }
      el = el.parentNode;
    }
    return null;
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  /* Every print control on the site is one of three shapes: a .btn-print
   * button with an inline onclick, #nl-print in the label generator, or an
   * anchor that calls print() directly. */
  function isPrintControl(el) {
    if (!el) { return false; }
    if (el.className && String(el.className).indexOf('btn-print') !== -1) { return true; }
    var id = (el.id || '').toLowerCase();
    if (id === 'nl-print' || /(^|-)print$/.test(id)) { return true; }
    return /print\s*\(/i.test(el.getAttribute('onclick') || '');
  }

  /* ---- Clicks: affiliate, article -> tool, print ---- */
  document.addEventListener('click', function (e) {
    var a = closest(e.target, 'a');
    var ctrl = closest(e.target, 'button, [role="button"]') || a;

    if (a && /(^|\.)amazon\./i.test(a.hostname || '')) {
      track('affiliate_click', { link_url: a.href, page: PAGE });
    }

    if (a && IS_ARTICLE && a.hostname === location.hostname) {
      var target = a.pathname.replace(/^\/+|\/+$/g, '');
      if (target &&
          !/^articles(\/|$)/.test(target) &&
          !/^(privacy|about|contact|search|404|feed\.xml)$/.test(target)) {
        track('article_to_tool_click', {
          target: target,
          region: closest(a, 'main') ? 'body' : 'chrome'
        });
      }
    }

    if (isPrintControl(ctrl)) {
      track('print_recipe', { tool: PAGE });
    }
  }, true);

  /* ---- Calculator usage ----
   * The 25 calculator scripts share no common structure, so instead of
   * instrumenting each one we watch the page: the first edit counts as a
   * start, and a complete is recorded once the result has rendered and the
   * inputs have gone quiet for 900ms. Pages that call bcTrack() themselves
   * with 'calculator_complete' suppress this observed one. */
  if (!NOT_A_CALC[PAGE]) {
    var started = false, pending = null, mutated = 0;

    function settle() {
      if (mutated > 0 && !explicitComplete) {
        track('calculator_complete', { tool: PAGE, mode: 'observed' });
      }
      pending = null;
      mutated = 0;
    }

    function onEdit() {
      if (!started) {
        started = true;
        track('calculator_start', { tool: PAGE });
      }
      mutated = 0;
      if (pending) { clearTimeout(pending); }
      pending = setTimeout(settle, 900);
    }

    document.addEventListener('input', onEdit, true);
    document.addEventListener('change', onEdit, true);

    onReady(function () {
      if (!window.MutationObserver) { return; }
      new MutationObserver(function (records) {
        if (pending) { mutated += records.length; }
      }).observe(document.querySelector('main') || document.body, {
        childList: true, subtree: true, characterData: true
      });
    });
  }

  /* ---- Site search (the /search page filters a local index) ---- */
  if (PAGE === 'search') {
    onReady(function () {
      var inp = document.getElementById('search-input');
      if (!inp) { return; }
      var t = null, last = '';
      inp.addEventListener('input', function () {
        clearTimeout(t);
        t = setTimeout(function () {
          var q = inp.value.trim();
          if (!q || q === last) { return; }
          last = q;
          track('site_search', {
            search_term: q,
            results: document.querySelectorAll('#search-results > *').length
          });
        }, 800);
      });
    });
  }
})();
