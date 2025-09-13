import { fallbackHTML } from './templates.js';

// (Optional for testing) clear MC suppression cookies/storage so popup can show
(() => {
  ["MCPopupClosed","MCPopupSubscribed"].forEach(name => {
    document.cookie = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    document.cookie = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${location.hostname};`;
  });
  try {
    ["localStorage","sessionStorage"].forEach(store => {
      const s = window[store]; if (!s) return;
      const keys = Array.from({length:s.length}, (_,i) => s.key(i));
      keys.forEach(k => {
        const kk = (k||"").toLowerCase();
        if (kk.includes("mc") || kk.includes("popup")) s.removeItem(k);
      });
    });
  } catch {}
})();

// 1) Always insert (hidden) fallback into DOM
document.getElementById('fallback-root').innerHTML = fallbackHTML;
const fallback = document.getElementById('fallback');

// 2) Decide: can we even try Mailchimp?
const ua = navigator.userAgent || "";
const blockedEnv =
  ua.includes("Instagram") || ua.includes("FBAN") || ua.includes("FBAV") || ua.includes("Firefox");

// Helper to show fallback (one place only)
function showFallback() {
  fallback?.classList.remove('hidden');
}

// 3) If environment is known to block → show fallback and stop.
if (blockedEnv) {
  showFallback();
} else {
  // Try to load Mailchimp popup script
  const s = document.createElement('script');
  s.id = 'mcjs';
  s.async = 1;
  s.src = 'https://chimpstatic.com/mcjs-connected/js/users/da01e192b9e5c7e47f1697a1b/aee3b1fd5f761d99c97a62e16.js';

  // If the script hard-fails to load (network/csp) → fallback.
  s.onerror = showFallback;

  // Optional: if you want a safety net when the script loads but chooses not to show a popup
  // (e.g., frequency rules), add a *manual override* via URL: ?fallback=1
  if (new URLSearchParams(location.search).get('fallback') === '1') {
    showFallback();
  } else {
    document.body.appendChild(s);
    // No other UI from us. If Mailchimp shows its popup — great. If not, user can reload
    // with ?fallback=1 or you can temporarily showFallback() unconditionally while testing.
  }
}
