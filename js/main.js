// --- Optional: clear Mailchimp suppression while testing ---
(function () {
  ["MCPopupClosed","MCPopupSubscribed"].forEach(function (name) {
    document.cookie = name+"=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    document.cookie = name+"=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=."+location.hostname+";";
  });
  try {
    ["localStorage","sessionStorage"].forEach(function (store) {
      var s = window[store]; if (!s) return;
      var keys = []; for (var i=0;i<s.length;i++) keys.push(s.key(i));
      keys.forEach(function (k) {
        var kk = (k||"").toLowerCase();
        if (kk.indexOf("mc")>-1 || kk.indexOf("popup")>-1) s.removeItem(k);
      });
    });
  } catch(e){}
})();

var fallback = document.getElementById('fallback');
function hideFallback(){ if (fallback) fallback.style.display = 'none'; }
function showFallback(){ if (fallback) fallback.style.display = ''; }

// If IG/FB/Firefox strict → just keep fallback visible and bail.
(function () {
  var ua = navigator.userAgent || "";
  var blocked = ua.indexOf("Instagram")>-1 || ua.indexOf("FBAN")>-1 || ua.indexOf("FBAV")>-1 || ua.indexOf("Firefox")>-1;
  if (blocked) return; // fallback remains visible
})();

// Try to load Mailchimp popup. If it loads and we detect MC UI → hide fallback.
// If it fails or nothing appears in time → fallback stays.
(function () {
  var mc = document.createElement('script');
  mc.id = 'mcjs';
  mc.async = 1;
  mc.src = 'https://chimpstatic.com/mcjs-connected/js/users/da01e192b9e5c7e47f1697a1b/aee3b1fd5f761d99c97a62e16.js';
  mc.onerror = function(){ showFallback(); };
  document.body.appendChild(mc);

  // Watchdog: if we see MC’s iframe/button → hide fallback; else keep it.
  var CHECK_MS = 2500;
  setTimeout(function(){
    var mcUI = document.querySelector('iframe[src*="chimpstatic.com"], iframe[src*="list-manage.com"], [id*="mc-"], [class*="mc-"]');
    if (mcUI) hideFallback();
    // else: do nothing → fallback already visible
  }, CHECK_MS);
})();
