(function () {
  var STORAGE_KEY = 'cookieConsent';
  var banner = document.getElementById('cookieBanner');
  if (!banner) return;

  if (!localStorage.getItem(STORAGE_KEY)) {
    banner.classList.add('open');
  }

  var acceptBtn = document.getElementById('cookieAccept');
  acceptBtn.addEventListener('click', function () {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    banner.classList.remove('open');
  });
})();
