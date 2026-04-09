/**
 * site-data.js
 * Reads admin changes from localStorage and applies them to index.html.
 * Loaded at the end of <body> in index.html.
 */

(function () {
  const LS_MESSAGES = 'contact_messages';
  const LS_CUSTOM   = 'gallery_custom';
  const LS_HIDDEN   = 'gallery_hidden';
  const LS_CONTENT  = 'site_content';

  function ls(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  }

  /* ===== 1. APPLY CONTENT OVERRIDES ===== */
  function applyContent() {
    const c = ls(LS_CONTENT);
    if (!c) return;

    if (c.heroTitle) {
      const el = document.querySelector('.hero-title');
      if (el) el.innerHTML = c.heroTitle.replace(/\n/g, '<br>');
    }

    if (c.heroSub) {
      const el = document.querySelector('.hero-sub');
      if (el) el.textContent = c.heroSub;
    }

    if (c.heroBadge) {
      const badge = document.querySelector('.hero-badge');
      if (badge) {
        const svg = badge.querySelector('svg');
        badge.textContent = c.heroBadge;
        if (svg) badge.prepend(svg);
      }
    }

    if (c.aboutP1) {
      const paras = document.querySelectorAll('#about .about-text > p');
      if (paras[0]) paras[0].textContent = c.aboutP1;
    }

    if (c.aboutP2) {
      const paras = document.querySelectorAll('#about .about-text > p');
      if (paras[1]) paras[1].textContent = c.aboutP2;
    }

    if (c.statProjects) {
      const counters = document.querySelectorAll('.stat-num');
      if (counters[0]) { counters[0].dataset.target = c.statProjects; }
    }
    if (c.statYears) {
      const counters = document.querySelectorAll('.stat-num');
      if (counters[1]) { counters[1].dataset.target = c.statYears; }
    }
    if (c.statSatisfy) {
      const counters = document.querySelectorAll('.stat-num');
      if (counters[2]) { counters[2].dataset.target = c.statSatisfy; }
    }

    if (c.phone) {
      const el = document.querySelector('.contact-item-value a[href^="tel"]');
      if (el) { el.textContent = c.phone; el.href = 'tel:' + c.phone.replace(/\D/g, ''); }
    }

    if (c.email) {
      const el = document.querySelector('.contact-item-value a[href^="mailto"]');
      if (el) { el.textContent = c.email; el.href = 'mailto:' + c.email; }
    }

    if (c.area) {
      const items = document.querySelectorAll('.contact-item .contact-item-value');
      items.forEach(item => {
        if (item.textContent.includes('Toronto') || item.textContent.includes('Area')) {
          item.textContent = c.area;
        }
      });
    }
  }

  /* ===== 2. HIDE ORIGINAL IMAGES ===== */
  function applyHiddenImages() {
    const hidden = ls(LS_HIDDEN);
    if (!hidden || !hidden.length) return;

    document.querySelectorAll('.gallery-item img').forEach(img => {
      const src = img.getAttribute('src');
      if (hidden.some(h => src && src.endsWith(h.replace(/^\.\//, '')))) {
        const item = img.closest('.gallery-item');
        if (item) item.style.display = 'none';
      }
    });
  }

  /* ===== 3. INJECT CUSTOM GALLERY IMAGES ===== */
  function applyCustomImages() {
    const custom = ls(LS_CUSTOM);
    if (!custom || !custom.length) return;

    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;

    const zoomSvg = '<svg viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';

    custom.forEach(img => {
      const div = document.createElement('div');
      div.className = 'gallery-item';
      div.dataset.category = img.category;
      div.innerHTML = `
        <img src="${img.src}" alt="${escHtml(img.title)}" loading="lazy" />
        <div class="gallery-overlay">
          <span class="gallery-label">${escHtml(img.label)}</span>
          <span class="gallery-title">${escHtml(img.title)}</span>
        </div>
        <div class="gallery-zoom">${zoomSvg}</div>
      `;
      grid.appendChild(div);
    });

    // Re-attach gallery interactions for new items (lightbox + filter)
    rewireNewGalleryItems(grid);
  }

  /* ===== 4. SAVE CONTACT FORM TO localStorage ===== */
  function wireContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', () => {
      const msg = {
        id:      Date.now() + '_' + Math.random().toString(36).slice(2),
        date:    new Date().toISOString(),
        name:    form.querySelector('[name="name"]')?.value    || '',
        email:   form.querySelector('[name="email"]')?.value   || '',
        phone:   form.querySelector('[name="phone"]')?.value   || '',
        service: form.querySelector('[name="service"]')?.value || '',
        message: form.querySelector('[name="message"]')?.value || '',
        read:    false,
      };

      const messages = JSON.parse(localStorage.getItem(LS_MESSAGES) || '[]');
      messages.push(msg);
      localStorage.setItem(LS_MESSAGES, JSON.stringify(messages));
    });
  }

  /* ===== HELPERS ===== */
  function escHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function rewireNewGalleryItems(grid) {
    // Filter buttons still work because they use data-category selectors on the grid
    // Lightbox needs new items registered — done lazily via event delegation if script.js
    // already set up delegation; otherwise trigger a custom event for script.js to pick up.
    grid.querySelectorAll('.gallery-item:not([data-wired])').forEach(item => {
      item.dataset.wired = '1';
      item.addEventListener('click', () => {
        // Rebuild gallery images array and open lightbox
        const evt = new CustomEvent('gallery:rewire');
        document.dispatchEvent(evt);
      });
    });
  }

  /* ===== BOOT ===== */
  document.addEventListener('DOMContentLoaded', () => {
    applyContent();
    applyHiddenImages();
    applyCustomImages();
    wireContactForm();
  });
})();
