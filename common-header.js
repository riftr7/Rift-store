// Shared top-bar for all static pages (checkout / status / payment / orders)
// Keeps the same look as the main app header and provides a single EN/AR toggle.

(function () {
  const LANG_KEY = 'siteLanguage';

  function getStoredLang() {
    // First: infer from filename (these pages exist in AR/EN pairs)
    try {
      const file = (location.pathname.split('/').pop() || '').toLowerCase();
      if (file.includes('-ar')) return 'ar';
      if (file === 'status-ar.html' || file === 'payment-ar.html' || file === 'orders-ar.html') return 'ar';
      if (file === 'status.html' || file === 'payment.html' || file === 'orders.html') return 'en';
    } catch (_) {}

    try {
      const l = localStorage.getItem(LANG_KEY);
      if (l === 'ar' || l === 'en') return l;
    } catch (_) {}
    // Fallback: infer from document or browser
    const docLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (docLang.startsWith('ar')) return 'ar';
    const nav = (typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'en').toLowerCase();
    return nav.startsWith('ar') ? 'ar' : 'en';
  }

  function setDocLang(l) {
    document.documentElement.setAttribute('lang', l);
    document.documentElement.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
  }

  function otherLangUrl(currentLang) {
    const file = (location.pathname.split('/').pop() || '').toLowerCase();
    const map = {
      'checkout-ar.html': 'checkout-en.html',
      'checkout-en.html': 'checkout-ar.html',
      'checkout.html': 'checkout-ar.html',
      'status-ar.html': 'status.html',
      'status.html': 'status-ar.html',
      'payment-ar.html': 'payment.html',
      'payment.html': 'payment-ar.html',
      'orders-ar.html': 'orders.html',
      'orders.html': 'orders-ar.html',
      'index-ar.html': 'index.html',
      'index.html': 'index-ar.html'
    };

    // If we know the pair, return it.
    if (map[file]) return map[file];

    // Otherwise: best-effort based on suffix
    if (file.endsWith('-ar.html')) return file.replace('-ar.html', '.html');
    if (file.endsWith('-en.html')) return file.replace('-en.html', '-ar.html');
    return currentLang === 'ar' ? 'index.html' : 'index-ar.html';
  }

  function homeHref(lang) {
    // Keep hash links for the SPA home page
    return lang === 'ar' ? 'index-ar.html#home' : 'index.html#home';
  }
  function cartHref(lang) {
    return lang === 'ar' ? 'index-ar.html#cart' : 'index.html#cart';
  }

  function injectHeader() {
    const lang = getStoredLang();
    setDocLang(lang);

    const mount = document.getElementById('common-header');
    if (!mount) return;

    mount.innerHTML = `
      <header class="header" style="background: rgba(11,14,19,.7); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,.06);">
        <div class="header-inner container">
          <a class="brand" href="${homeHref(lang)}" aria-label="Home">
            <img class="brand-logo" src="assets/riftlogo.png" alt="RIFT logo">
            <div style="color: #8a2be2;">RIFT</div>
          </a>
          <div class="right">
            <a class="btn ghost badge-btn" href="${cartHref(lang)}" id="cart-btn" aria-label="Cart" style="color: #8a2be2;">🛒<span id="cart-count" class="badge"></span></a>
            <button class="btn ghost" id="lang-toggle" type="button" style="color: #8a2be2;">EN / العربية</button>
          </div>
        </div>
      </header>
    `;

    // Cart count badge
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((s, it) => s + (Number(it?.qty) || 0), 0);
      const badge = document.getElementById('cart-count');
      if (badge) {
        badge.textContent = count ? String(count) : '';
        badge.style.display = count ? 'inline-block' : 'none';
      }
    } catch (_) {}

    const btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.addEventListener('click', () => {
        const current = getStoredLang();
        const next = current === 'ar' ? 'en' : 'ar';
        try { localStorage.setItem(LANG_KEY, next); } catch (_) {}
        // Go to the paired page
        const dest = otherLangUrl(current);
        window.location.href = dest;
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHeader);
  } else {
    injectHeader();
  }
})();
