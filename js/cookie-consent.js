(function () {
  function getCookie(name) {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/;SameSite=Lax';
  }

  function showBanner() {
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.style.display = 'block';
  }

  function hideBanner() {
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.style.display = 'none';
  }

  function showModal() {
    const modal = document.getElementById('cookieModal');
    if (modal) modal.style.display = 'flex';
  }

  function hideModal() {
    const modal = document.getElementById('cookieModal');
    if (modal) modal.style.display = 'none';
  }

  function applyConsent(analytics, marketing) {
    setCookie('vd_cookie_consent', 'set', 365);
    setCookie('vd_analytics', analytics ? '1' : '0', 365);
    setCookie('vd_marketing', marketing ? '1' : '0', 365);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const consent = getCookie('vd_cookie_consent');
    if (!consent) {
      setTimeout(showBanner, 800);
    }

    const acceptBtn = document.getElementById('cookieAccept');
    const rejectBtn = document.getElementById('cookieReject');
    const customizeBtn = document.getElementById('cookieCustomize');
    const savePrefsBtn = document.getElementById('cookieSavePrefs');
    const modalCloseBtn = document.getElementById('cookieModalClose');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        applyConsent(true, true);
        hideBanner();
        hideModal();
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', function () {
        applyConsent(false, false);
        hideBanner();
        hideModal();
      });
    }

    if (customizeBtn) {
      customizeBtn.addEventListener('click', function () {
        hideBanner();
        showModal();
      });
    }

    if (savePrefsBtn) {
      savePrefsBtn.addEventListener('click', function () {
        const analyticsCb = document.getElementById('analyticsCookies');
        const marketingCb = document.getElementById('marketingCookies');
        const analytics = analyticsCb ? analyticsCb.checked : false;
        const marketing = marketingCb ? marketingCb.checked : false;
        applyConsent(analytics, marketing);
        hideModal();
      });
    }

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', function () {
        hideModal();
        showBanner();
      });
    }
  });
})();