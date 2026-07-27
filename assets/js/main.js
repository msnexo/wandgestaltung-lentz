document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', function () {
    var isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        var el = entry.target;
        setTimeout(function () { el.classList.add('visible'); }, (i % 6) * 90);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(function (el) { io.observe(el); });

  /* Safety net: guarantees content is never stuck invisible (e.g. deep links
     that jump straight to an anchor before the observer/scroll settle, or if
     IntersectionObserver misbehaves) */
  setTimeout(function () {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }, 2000);

  /* ---------- Animated stat counters ---------- */
  var statNums = document.querySelectorAll('.stat-num');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString('de-DE');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('de-DE');
    }
    requestAnimationFrame(step);
  }
  var statIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(function (el) { statIo.observe(el); });

  /* ---------- Service accordions ---------- */
  document.querySelectorAll('.service-toggle').forEach(function (btn) {
    var panel = btn.closest('.service-row').querySelector('.service-panel');
    btn.addEventListener('click', function () {
      var willOpen = !panel.classList.contains('open');
      document.querySelectorAll('.service-panel.open').forEach(function (p) {
        if (p !== panel) {
          p.classList.remove('open');
          var otherBtn = p.closest('.service-row').querySelector('.service-toggle');
          otherBtn.setAttribute('aria-expanded', 'false');
          otherBtn.querySelector('.service-toggle-text').textContent = 'Projektbilder ansehen';
        }
      });
      panel.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', String(willOpen));
      btn.querySelector('.service-toggle-text').textContent = willOpen ? 'Projektbilder ausblenden' : 'Projektbilder ansehen';
    });
  });

  /* ---------- Reviews carousel ---------- */
  var reviewsCarousel = document.getElementById('reviewsCarousel');
  var reviewsPrev = document.getElementById('reviewsPrev');
  var reviewsNext = document.getElementById('reviewsNext');
  if (reviewsCarousel && reviewsPrev && reviewsNext) {
    var scrollByCards = function (dir) {
      var card = reviewsCarousel.querySelector('.review-card');
      var amount = card ? (card.getBoundingClientRect().width + 20) * 2 : 300;
      reviewsCarousel.scrollBy({ left: dir * amount, behavior: 'smooth' });
    };
    reviewsPrev.addEventListener('click', function () { scrollByCards(-1); });
    reviewsNext.addEventListener('click', function () { scrollByCards(1); });
  }

  /* ---------- "Alle Projekte anzeigen" toggle ---------- */
  var galleryMoreToggle = document.getElementById('galleryMoreToggle');
  var galleryAll = document.getElementById('galleryAll');
  galleryMoreToggle.addEventListener('click', function () {
    var willOpen = !galleryAll.classList.contains('open');
    galleryAll.classList.toggle('open', willOpen);
    galleryMoreToggle.setAttribute('aria-expanded', String(willOpen));
    galleryMoreToggle.querySelector('.service-toggle-text').textContent = willOpen ? 'Weniger anzeigen' : 'Alle Projekte anzeigen';
  });

  /* ---------- Gallery lightbox ---------- */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    var item = galleryItems[currentIndex];
    lightboxImg.src = item.getAttribute('data-full');
    lightboxImg.alt = item.querySelector('img').alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function showRelative(delta) {
    currentIndex = (currentIndex + delta + galleryItems.length) % galleryItems.length;
    openLightbox(currentIndex);
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener('click', function () { openLightbox(index); });
  });
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', function () { showRelative(-1); });
  document.getElementById('lightboxNext').addEventListener('click', function () { showRelative(1); });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showRelative(-1);
    if (e.key === 'ArrowRight') showRelative(1);
  });

  /* ---------- Contact form -> mailto ---------- */
  var form = document.getElementById('contactForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var phone = form.phone.value.trim();
    var subject = form.subject.value;
    var message = form.message.value.trim();

    var body = 'Name: ' + name + '\n' +
               'E-Mail: ' + email + '\n' +
               (phone ? 'Telefon: ' + phone + '\n' : '') +
               (subject ? 'Interessiert an: ' + subject + '\n' : '') +
               '\nNachricht:\n' + message;

    var mailto = 'mailto:info@wandgestaltung-lentz.de' +
      '?subject=' + encodeURIComponent('Anfrage über die Website' + (subject ? ' – ' + subject : '')) +
      '&body=' + encodeURIComponent(body);

    window.location.href = mailto;
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});
