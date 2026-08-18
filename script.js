const header = document.querySelector('.site-header');
const menuBtn = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const langBtn = document.getElementById('langBtn');
const year = document.getElementById('year');

year.textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

menuBtn?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

let currentLang = 'en';
langBtn?.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  const isArabic = currentLang === 'ar';
  document.documentElement.lang = currentLang;
  document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  document.body.classList.toggle('rtl', isArabic);
  document.querySelectorAll('[data-en][data-ar]').forEach(el => {
    el.textContent = el.dataset[currentLang];
  });
  langBtn.textContent = isArabic ? 'EN' : 'AR';
});


// Creative portfolio lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.querySelector('.lightbox-close');

document.querySelectorAll('[data-lightbox]').forEach(card => {
  card.addEventListener('click', () => {
    lightboxImage.src = card.dataset.lightbox;
    lightboxImage.alt = card.getAttribute('aria-label') || 'Portfolio design';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox?.classList.remove('open');
  lightbox?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});


// V5 immersive motion: parallax around the central profile.
const orbitStage = document.getElementById('orbitStage');
const centerProfile = document.getElementById('centerProfile');
const orbitCards = [...document.querySelectorAll('.orbit-card')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && orbitStage && window.matchMedia('(pointer:fine)').matches) {
  orbitStage.addEventListener('pointermove', (e) => {
    const rect = orbitStage.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - .5;
    const ny = (e.clientY - rect.top) / rect.height - .5;

    centerProfile.style.marginLeft = `${nx * 10}px`;
    centerProfile.style.marginTop = `${ny * 7}px`;

    orbitCards.forEach((card, i) => {
      const depth = 10 + (i % 3) * 5;
      card.style.marginLeft = `${nx * depth}px`;
      card.style.marginTop = `${ny * depth * .7}px`;
    });
  });

  orbitStage.addEventListener('pointerleave', () => {
    centerProfile.style.marginLeft = '';
    centerProfile.style.marginTop = '';
    orbitCards.forEach(card => {
      card.style.marginLeft = '';
      card.style.marginTop = '';
    });
  });
}

// 3D tilt for gallery and video cards.
document.querySelectorAll('.design-card, .video-card').forEach(card => {
  if (reduceMotion || !window.matchMedia('(pointer:fine)').matches) return;

  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateY(-3px)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

// Soft cursor spotlight on desktop.
if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  document.addEventListener('pointermove', e => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}
