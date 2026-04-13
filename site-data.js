/**
 * site-data.js
 * Reads admin changes from Firebase and applies them to index.html.
 */

(function () {
  const LS_MESSAGES = 'contact_messages';
  const LS_CUSTOM   = 'gallery_custom';
  const LS_HIDDEN   = 'gallery_hidden';
  const LS_CONTENT  = 'site_content';

  /* ===== 1. APPLY CONTENT OVERRIDES ===== */
  async function applyContent() {
    const c = await fbGet(LS_CONTENT);
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
  async function applyHiddenImages() {
    const existing = await fbGet(LS_HIDDEN);
    if (!existing) return;
    const hidden = Array.isArray(existing) ? existing : Object.values(existing);
    if (!hidden.length) return;

    document.querySelectorAll('.gallery-item img').forEach(img => {
      const src = img.getAttribute('src');
      if (hidden.some(h => src && src.endsWith(h.replace(/^\.\//, '')))) {
        const item = img.closest('.gallery-item');
        if (item) item.style.display = 'none';
      }
    });
  }

  /* ===== 3. INJECT CUSTOM GALLERY IMAGES ===== */
  async function applyCustomImages() {
    const existing = await fbGet(LS_CUSTOM);
    if (!existing) return;
    const custom = Array.isArray(existing) ? existing : Object.values(existing);
    if (!custom.length) return;

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

    rewireNewGalleryItems(grid);
  }

  /* ===== 4. SAVE CONTACT FORM TO FIREBASE ===== */
  function wireContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async () => {
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

      const existing = (await fbGet(LS_MESSAGES)) || [];
      const messages = Array.isArray(existing) ? existing : Object.values(existing);
      messages.push(msg);
      await fbSet(LS_MESSAGES, messages);
    });
  }

  /* ===== HELPERS ===== */
  function escHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function rewireNewGalleryItems(grid) {
    grid.querySelectorAll('.gallery-item:not([data-wired])').forEach(item => {
      item.dataset.wired = '1';
      item.addEventListener('click', () => {
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
