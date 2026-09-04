// =========================================
// COZY CAFÉ — SCRIPT
// =========================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- MOBILE HAMBURGER MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // close mobile nav when a link is clicked
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  /* ---------- MENU CATEGORY FILTER ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.filter;

      menuItems.forEach(item => {
        const match = category === 'all' || item.dataset.category === category;
        item.classList.toggle('hide', !match);
      });
    });
  });

  /* ---------- GALLERY LIGHTBOX ---------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      lightboxImg.src = item.dataset.full;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ---------- REVIEW SLIDER ---------- */
  const track = document.getElementById('reviewTrack');
  const dotsWrap = document.getElementById('reviewDots');
  const slides = track.children;
  let current = 0;
  let autoTimer;

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  }
  const dots = dotsWrap.children;

  function goToSlide(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    Array.from(dots).forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }

  function startAutoSlide() {
    autoTimer = setInterval(nextSlide, 5000);
  }

  startAutoSlide();

  dotsWrap.addEventListener('click', () => {
    clearInterval(autoTimer);
    startAutoSlide();
  });

  /* ---------- RESERVATION FORM VALIDATION ---------- */
  const form = document.getElementById('reserveForm');
  const successMsg = document.getElementById('formSuccess');

  const fields = {
    name: { el: document.getElementById('name'), err: document.getElementById('err-name') },
    email: { el: document.getElementById('email'), err: document.getElementById('err-email') },
    phone: { el: document.getElementById('phone'), err: document.getElementById('err-phone') },
    people: { el: document.getElementById('people'), err: document.getElementById('err-people') },
    date: { el: document.getElementById('date'), err: document.getElementById('err-date') },
    time: { el: document.getElementById('time'), err: document.getElementById('err-time') }
  };

  function setError(field, message) {
    fields[field].el.classList.add('invalid');
    fields[field].err.textContent = message;
  }

  function clearError(field) {
    fields[field].el.classList.remove('invalid');
    fields[field].err.textContent = '';
  }

  function validate() {
    let valid = true;
    Object.keys(fields).forEach(clearError);

    if (!fields.name.el.value.trim()) {
      setError('name', 'Please enter your name.');
      valid = false;
    }

    const emailVal = fields.email.el.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      setError('email', 'Please enter your email.');
      valid = false;
    } else if (!emailPattern.test(emailVal)) {
      setError('email', 'Please enter a valid email.');
      valid = false;
    }

    const phoneVal = fields.phone.el.value.trim();
    if (!phoneVal) {
      setError('phone', 'Please enter your phone number.');
      valid = false;
    } else if (phoneVal.replace(/\D/g, '').length < 7) {
      setError('phone', 'Please enter a valid phone number.');
      valid = false;
    }

    const peopleVal = fields.people.el.value;
    if (!peopleVal || Number(peopleVal) < 1) {
      setError('people', 'Please enter number of guests.');
      valid = false;
    }

    if (!fields.date.el.value) {
      setError('date', 'Please choose a date.');
      valid = false;
    }

    if (!fields.time.el.value) {
      setError('time', 'Please choose a time.');
      valid = false;
    }

    return valid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validate()) {
      successMsg.classList.add('show');
      form.reset();
      setTimeout(() => {
        successMsg.classList.remove('show');
      }, 6000);
    } else {
      successMsg.classList.remove('show');
    }
  });

  /* ---------- SCROLL REVEAL ANIMATION ---------- */
  const revealTargets = document.querySelectorAll(
    '.feature-card, .menu-item, .gallery-item, .about-image, .about-content, .review-slider, .location-info, .map-placeholder, .reserve-form'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => observer.observe(el));

});