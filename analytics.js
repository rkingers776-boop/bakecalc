/* BakeCalc Club — shared Google Analytics (GA4) loader
 *
 * Loaded once per page, deferred, from every HTML page on the site.
 *
 * Three safeguards live here on purpose:
 *   1. Idempotency guard — if this file is ever injected twice (a copy-pasted
 *      snippet, a CDN inject, a second <script> tag), the second run exits
 *      instead of firing a duplicate page_view and inflating session counts.
 *   2. Privacy signals — visitors who send Global Privacy Control (GPC) or an
 *      enabled Do Not Track setting get no analytics at all. This is what makes
 *      the "you can opt out" paragraph in the privacy policy true.
 *   3. Secure cookie flags — the GA cookies are restricted to HTTPS + SameSite
 *      so they are never sent cross-site.
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
})();
