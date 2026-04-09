/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navOverlay = document.querySelector('.nav-overlay');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('open');
  navOverlay.classList.toggle('show');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

navOverlay.addEventListener('click', closeMenu);

function closeMenu() {
  hamburger.classList.remove('active');
  navMenu.classList.remove('open');
  navOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* Active nav link on scroll */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < bottom) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

/* ===== HERO SLIDER ===== */
const slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

function nextSlide() {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}

setInterval(nextSlide, 5000);

/* ===== SCROLL PROGRESS BAR ===== */
const scrollProgress = document.getElementById('scroll-progress');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + '%';
  if (backToTop) {
    if (scrollTop > 400) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  }
  heroParallax(scrollTop);
}, { passive: true });

if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ===== HERO PARALLAX ===== */
const heroSlider = document.querySelector('.hero-slider');
function heroParallax(scrollY) {
  if (!heroSlider) return;
  const speed = 0.38;
  heroSlider.style.transform = `translateY(${scrollY * speed}px)`;
}

/* ===== SCROLL ANIMATIONS ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => observer.observe(el));

/* ===== GALLERY FILTER ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = '';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 10);
      } else {
        item.style.display = 'none';
      }
    });
  });
});

/* ===== LIGHTBOX ===== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let galleryImages = [];
let currentIndex = 0;

function buildGalleryImages() {
  galleryImages = [];
  document.querySelectorAll('.gallery-item:not([style*="display: none"])').forEach(item => {
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-title');
    const label = item.querySelector('.gallery-label');
    if (img) {
      galleryImages.push({
        src: img.src,
        caption: (label ? label.textContent + ' — ' : '') + (title ? title.textContent : '')
      });
    }
  });
}

document.querySelectorAll('.gallery-item').forEach((item) => {
  item.addEventListener('click', () => {
    buildGalleryImages();
    const img = item.querySelector('img');
    currentIndex = galleryImages.findIndex(i => i.src === img.src);
    openLightbox(currentIndex);
  });
});

function openLightbox(index) {
  currentIndex = index;
  lightboxImg.src = galleryImages[index].src;
  lightboxCaption.textContent = galleryImages[index].caption;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

lightboxPrev.addEventListener('click', (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  openLightbox(currentIndex);
});

lightboxNext.addEventListener('click', (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % galleryImages.length;
  openLightbox(currentIndex);
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    openLightbox(currentIndex);
  }
  if (e.key === 'ArrowRight') {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    openLightbox(currentIndex);
  }
});

/* Contact form handled by Formspree */

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===== COUNTER ANIMATION ===== */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const suffix = counter.dataset.suffix || '';
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const update = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(update);
      } else {
        counter.textContent = target + suffix;
      }
    };
    update();
  });
}

const aboutSection = document.getElementById('about');
if (aboutSection) {
  let counted = false;
  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      animateCounters();
    }
  }, { threshold: 0.4 });
  counterObserver.observe(aboutSection);
}
