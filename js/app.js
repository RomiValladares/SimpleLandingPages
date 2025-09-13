import { fallbackHTML } from './templates.js';

// --- convenience: clear MC suppression while testing ---
(() => {
  ["MCPopupClosed","MCPopupSubscribed"].forEach(name => {
    document.cookie = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    document.cookie = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${location.hostname};`;
  });
  try {
    ["localStorage","sessionStorage"].forEach(store => {
      const s = window[store]; if (!s) return;
      const keys = Array.from({length:s.length}, (_,i)=>s.key(i));
      keys.forEach(k => {
        const kk = (k||"").toLowerCase();
        if (kk.includes("mc") || kk.includes("popup")) s.removeItem(k);
      });
    });
  } catch {}
})();

// 1) Insert fallback (hidden initially)
document.getElementById('fallback-root').innerHTML = fallbackHTML;
const fallback = document.getElementById('fallback');
const showFallback = () => fallback?.classList.remove('hidden');

// 2) Allow manual override for testing: ?fallback=1
if (new URLSearchParams(location.search).get('fallback') === '1') {
  showFallback();
  throw new Error('Forced fallback');
}

// 3) If we’re in environments that usually block third-party JS → show fallback now.
const ua = navigator.userAgent || "";
const blockedEnv =
  ua.includes("Instagram") || ua.includes("FBAN") || ua.includes("FBAV") || ua.includes("Firefox");
if (blockedEnv) {
  showFallback();
} else {
  // 4) Try to load Mailchimp popup
  const s = document.createElement('script');
  s.id = 'mcjs';
  s.async = 1;
  s.src = 'https://chimpstatic.com/mcjs-connected/js/users/da01e192b9e5c7e47f1697a1b/aee3b1fd5f761d99c97a62e16.js';
  s.onerror = showFallback; // hard fail → fallback
  document.body.appendChild(s);

  // 5) Timeout watchdog: if no MC UI appeared, show fallback.
  //    Heuristic: look for common MC popup nodes (iframe/button injected by mcjs).
  const WATCH_MS = 2500;
  setTimeout(() => {
    const maybeMcPopup =
      document.querySelector('iframe[src*="chimpstatic.com"], iframe[src*="list-manage.com"], [id*="mc-"], [class*="mc-"]');
    if (!maybeMcPopup) showFallback();
  }, WATCH_MS);
}
