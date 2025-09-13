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

// Detect strict environments
const ua = navigator.userAgent || "";
const shouldSkipMcjs =
  ua.includes("Instagram") || ua.includes("FBAN") || ua.includes("FBAV") || ua.includes("Firefox");

// Inject fallback (hidden initially)
document.getElementById('fallback-root').innerHTML = fallbackHTML;
const fallback = document.getElementById('fallback');

// If strict env → show fallback and stop
if (shouldSkipMcjs) {
  fallback.classList.remove('hidden');
  return;
}

// Inject modal
document.getElementById('modal-root').innerHTML = modalHTML;

const overlay = document.getElementById('overlay');
const close   = document.getElementById('close');

function openModal() {
  overlay?.setAttribute('data-open','1');
}

function closeModal() {
  overlay?.removeAttribute('data-open');
  // now reveal fallback so there’s still a form on the page
  fallback?.classList.remove('hidden');
}

// Wire events
close?.addEventListener('click', closeModal);
overlay?.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// Open our modal quickly
setTimeout(openModal, 300);

// (Optional) Load mcjs for connected-site/analytics; it won’t create a second modal here
const s = document.createElement("script");
s.id = "mcjs"; s.async = 1;
s.src = "https://chimpstatic.com/mcjs-connected/js/users/da01e192b9e5c7e47f1697a1b/aee3b1fd5f761d99c97a62e16.js";
document.body.appendChild(s);

