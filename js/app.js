import { fallbackHTML, modalHTML } from './templates.js';

/* 0) Clear Mailchimp suppression so you can retest easily */
(() => {
  ["MCPopupClosed","MCPopupSubscribed"].forEach(name => {
    document.cookie = name+"=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    document.cookie = name+"=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=."+location.hostname+";";
  });
  try {
    ["localStorage","sessionStorage"].forEach(store => {
      const s = window[store]; if(!s) return;
      const ks = Array.from({length:s.length}, (_,i)=>s.key(i));
      ks.forEach(k => {
        const kk=(k||"").toLowerCase();
        if(kk.includes("mc")||kk.includes("popup")) s.removeItem(k);
      });
    });
  } catch(e){}
})();

/* 1) Detect environments that block third-party JS (IG/FB webview, Firefox strict) */
const ua = navigator.userAgent || "";
const IN_APP_IG = ua.includes("Instagram");
const IN_APP_FB = ua.includes("FBAN") || ua.includes("FBAV");
const FIREFOX   = ua.includes("Firefox");
const shouldSkipMcjs = IN_APP_IG || IN_APP_FB || FIREFOX;

/* 2) Inject fallback form (always present under the modal) */
document.getElementById('fallback-root').innerHTML = fallbackHTML;

/* 3) Inject modal and wire events (used when mcjs allowed) */
if (!shouldSkipMcjs) {
  document.getElementById('modal-root').innerHTML = modalHTML;

  const overlay = document.getElementById('overlay');
  const close   = document.getElementById('close');

  const openModal = () => {
    overlay?.setAttribute('data-open','1');
    close?.addEventListener('click', () => overlay.removeAttribute('data-open'));
    overlay?.addEventListener('click', e => { if (e.target === overlay) close.click(); });
    window.addEventListener('keydown', e => { if (e.key === 'Escape') close.click(); });
  };

  // Open our modal quickly for smooth UX
  setTimeout(openModal, 300);

  // Optionally load Mailchimp mcjs for “Connected site” analytics (won’t break if blocked)
  const s = document.createElement("script");
  s.id = "mcjs"; s.async = 1;
  s.src = "https://chimpstatic.com/mcjs-connected/js/users/da01e192b9e5c7e47f1697a1b/aee3b1fd5f761d99c97a62e16.js";
  document.body.appendChild(s);
}
