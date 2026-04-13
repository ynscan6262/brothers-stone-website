/* ===== CONSTANTS ===== */
const LS_HASH     = 'admin_pw_hash';
const LS_MESSAGES = 'contact_messages';
const LS_CUSTOM   = 'gallery_custom';
const LS_HIDDEN   = 'gallery_hidden';
const LS_CONTENT  = 'site_content';
const SESSION_KEY = 'admin_session';
const DEFAULT_HASH = 'a0fe13050fe87a8940f60c9146b37fb7fb8808e7d8539c5a4c69243179111696';

/* All original gallery images (mirrors index.html) */
const ORIGINAL_IMAGES = [
  { src: 'images/hero2.jpg',           category: 'stone',     label: 'Stone Installation',  title: 'Front Entrance Stone Facade',  wide: true },
  { src: 'images/project4/p4_3.jpg',   category: 'paver',     label: 'Driveways & Pavers',  title: 'Herringbone Paver Driveway' },
  { src: 'images/project3/p3_1.jpg',   category: 'patio',     label: 'Patio',               title: 'Natural Flagstone Patio' },
  { src: 'images/project1/p1_1.jpg',   category: 'stone',     label: 'Stone Installation',  title: 'Garden Stone Feature',         tall: true },
  { src: 'images/project1/p1_2.jpg',   category: 'stone',     label: 'Stone Installation',  title: 'Home Entrance Stonework' },
  { src: 'images/project1/p1_3.jpg',   category: 'stone',     label: 'Stone Installation',  title: 'Stone Feature Detail' },
  { src: 'images/project3/p3_3.jpg',   category: 'patio',     label: 'Patio',               title: 'Flagstone Backyard Patio',     wide: true },
  { src: 'images/project1/p1_4.jpg',   category: 'stone',     label: 'Stone Installation',  title: 'Stone Retaining Feature' },
  { src: 'images/project1/p1_5.jpg',   category: 'stone',     label: 'Stone Installation',  title: 'Custom Stone Detail' },
  { src: 'images/project4/p4_1.jpg',   category: 'paver',     label: 'Driveways & Pavers',  title: 'Paver Driveway Installation' },
  { src: 'images/project4/p4_2.jpg',   category: 'paver',     label: 'Driveways & Pavers',  title: 'Driveway in Progress' },
  { src: 'images/project1/p1_6.jpg',   category: 'stone',     label: 'Stone Installation',  title: 'Stone Walkway' },
  { src: 'images/project2/p2_1.jpg',   category: 'retaining', label: 'Retaining Walls',     title: 'Retaining Wall Build',         wide: true },
  { src: 'images/project2/p2_2.jpg',   category: 'retaining', label: 'Retaining Walls',     title: 'Concrete Retaining Wall' },
  { src: 'images/project2/p2_3.jpg',   category: 'retaining', label: 'Retaining Walls',     title: 'Completed Retaining Wall' },
  { src: 'images/project3/p3_2.jpg',   category: 'patio',     label: 'Patio',               title: 'Patio Stone Laying' },
  { src: 'images/project3/p3_4.jpg',   category: 'patio',     label: 'Patio',               title: 'Flagstone Patio Detail' },
  { src: 'images/project3/p3_5.jpg',   category: 'patio',     label: 'Patio',               title: 'Stone Patio Panoramic',        wide: true },
  { src: 'images/project3/p3_6.jpg',   category: 'patio',     label: 'Patio',               title: 'Completed Flagstone Patio' },
  { src: 'images/project4/p4_4.jpg',   category: 'paver',     label: 'Driveways & Pavers',  title: 'Paver Walkway' },
  { src: 'images/project4/p4_5.jpg',   category: 'paver',     label: 'Driveways & Pavers',  title: 'Paver Driveway Detail' },
  { src: 'images/project4/p4_6.jpg',   category: 'paver',     label: 'Driveways & Pavers',  title: 'Completed Paver Driveway',     wide: true },
  { src: 'images/hero1.jpg',           category: 'masonry',   label: 'Stone Masonry',       title: 'Custom Stone Wall' },
  { src: 'images/hero3.jpg',           category: 'masonry',   label: 'Stone Masonry',       title: 'Stone Masonry Project',        wide: true },
  { src: 'images/hero4.jpg',           category: 'masonry',   label: 'Stone Masonry',       title: 'Masonry Work Detail' },
  { src: 'images/project1/p1_7.jpg',   category: 'stone',     label: 'Stone Installation',  title: 'Stone Beside Entrance' },
  { src: 'images/project1/p1_8.jpg',   category: 'stone',     label: 'Stone Installation',  title: 'Stone Work Detail' },
  { src: 'images/img1.jpg',            category: 'masonry',   label: 'Stone Masonry',       title: 'Masonry Craftsmanship' },
  { src: 'images/img2.jpg',            category: 'masonry',   label: 'Stone Masonry',       title: 'Masonry Project' },
  { src: 'images/img3.jpg',            category: 'masonry',   label: 'Stone Masonry',       title: 'Masonry Work' },
];

/* ===== HELPERS ===== */
async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function show(el) { if (el) el.style.display = ''; }
function hide(el) { if (el) el.style.display = 'none'; }

/* ===== AUTH ===== */
function checkSession() {
  return sessionStorage.getItem(SESSION_KEY) === 'ok';
}

async function init() {
  if (checkSession()) {
    openDashboard();
  }
}

async function doLogin() {
  const pw  = document.getElementById('login-pw').value;
  const err = document.getElementById('login-error');
  hide(err);

  const hash = await sha256(pw);

  if (hash === DEFAULT_HASH) {
    sessionStorage.setItem(SESSION_KEY, 'ok');
    openDashboard();
  } else {
    show(err);
    document.getElementById('login-pw').value = '';
  }
}

function doLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
}

function openDashboard() {
  hide(document.getElementById('login-screen'));
  document.getElementById('dashboard').style.display = 'flex';
  loadMessages();
  loadGallery();
  loadContent();
}

/* ===== TABS ===== */
function showTab(name, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  if (btn) btn.classList.add('active');
}

/* ===== MESSAGES ===== */
let currentMsgId = null;

async function loadMessages() {
  const messages = (await fbGet(LS_MESSAGES)) || [];
  const arr = Array.isArray(messages) ? messages : Object.values(messages);
  const container = document.getElementById('messages-container');
  const badge     = document.getElementById('msg-badge');
  const unread    = arr.filter(m => !m.read).length;

  if (unread > 0) { badge.textContent = unread; show(badge); }
  else { hide(badge); }

  if (arr.length === 0) {
    container.innerHTML = `
      <div class="no-messages">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        <p>No messages yet. They'll appear here when visitors contact you.</p>
      </div>`;
    return;
  }

  container.innerHTML = arr.slice().reverse().map(msg => `
    <div class="message-card ${msg.read ? '' : 'unread'}" onclick="openMessage('${msg.id}')">
      <div class="msg-body">
        <div class="msg-name">${esc(msg.name)}</div>
        <div class="msg-meta">${esc(msg.email)} · ${esc(msg.phone || '—')} · ${esc(msg.service || '—')} · <span>${new Date(msg.date).toLocaleString()}</span></div>
        <div class="msg-preview">${esc(msg.message || 'No message.')}</div>
      </div>
      <div class="msg-actions">
        <button class="btn-icon view" onclick="event.stopPropagation(); openMessage('${msg.id}')" title="View">
          <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="btn-icon delete" onclick="event.stopPropagation(); deleteMessage('${msg.id}')" title="Delete">
          <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

async function openMessage(id) {
  const messages = (await fbGet(LS_MESSAGES)) || [];
  const arr = Array.isArray(messages) ? messages : Object.values(messages);
  const idx = arr.findIndex(m => m.id === id);
  if (idx === -1) return;
  const msg = arr[idx];

  if (!msg.read) {
    arr[idx].read = true;
    await fbSet(LS_MESSAGES, arr);
    loadMessages();
  }

  currentMsgId = id;
  document.getElementById('msg-modal-content').innerHTML = `
    <div class="msg-detail-row"><span class="msg-detail-label">Name</span><span class="msg-detail-value">${esc(msg.name)}</span></div>
    <div class="msg-detail-row"><span class="msg-detail-label">Email</span><span class="msg-detail-value">${esc(msg.email)}</span></div>
    <div class="msg-detail-row"><span class="msg-detail-label">Phone</span><span class="msg-detail-value">${esc(msg.phone || '—')}</span></div>
    <div class="msg-detail-row"><span class="msg-detail-label">Service</span><span class="msg-detail-value">${esc(msg.service || '—')}</span></div>
    <div class="msg-detail-row"><span class="msg-detail-label">Date</span><span class="msg-detail-value">${new Date(msg.date).toLocaleString()}</span></div>
    <div class="msg-detail-row"><span class="msg-detail-label">Message</span><div style="flex:1"><div class="msg-detail-message">${esc(msg.message || 'No message.')}</div></div></div>
  `;
  show(document.getElementById('msg-modal'));
}

function closeMsgModal() {
  hide(document.getElementById('msg-modal'));
  currentMsgId = null;
}

async function deleteMessage(id) {
  let messages = (await fbGet(LS_MESSAGES)) || [];
  let arr = Array.isArray(messages) ? messages : Object.values(messages);
  arr = arr.filter(m => m.id !== id);
  await fbSet(LS_MESSAGES, arr);
  loadMessages();
}

function deleteCurrentMessage() {
  if (!currentMsgId) return;
  deleteMessage(currentMsgId);
  closeMsgModal();
}

async function clearAllMessages() {
  if (!confirm('Delete ALL messages? This cannot be undone.')) return;
  await fbRemove(LS_MESSAGES);
  loadMessages();
}

/* ===== GALLERY ===== */
let pendingFiles = [];

function handleFileSelect(input) {
  const files = Array.from(input.files);
  if (!files.length) return;

  pendingFiles = [];
  const previews = document.getElementById('upload-previews');
  previews.innerHTML = '';

  const readers = files.map(file => new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      pendingFiles.push({ dataUrl: e.target.result, name: file.name });
      const img = document.createElement('img');
      img.src = e.target.result;
      img.className = 'upload-preview-img';
      previews.appendChild(img);
      resolve();
    };
    reader.readAsDataURL(file);
  }));

  Promise.all(readers).then(() => {
    show(document.getElementById('upload-panel'));
  });

  input.value = '';
}

async function saveUpload() {
  if (!pendingFiles.length) return;

  const category = document.getElementById('upload-category').value;
  const label    = document.getElementById('upload-label').value || categoryLabel(category);
  const title    = document.getElementById('upload-title').value || 'Custom Photo';

  const existing = (await fbGet(LS_CUSTOM)) || [];
  const custom = Array.isArray(existing) ? existing : Object.values(existing);
  pendingFiles.forEach(f => {
    custom.push({ id: Date.now() + Math.random(), src: f.dataUrl, category, label, title });
  });
  await fbSet(LS_CUSTOM, custom);

  pendingFiles = [];
  hide(document.getElementById('upload-panel'));
  document.getElementById('upload-label').value = '';
  document.getElementById('upload-title').value = '';
  loadGallery();
}

function cancelUpload() {
  pendingFiles = [];
  hide(document.getElementById('upload-panel'));
}

function categoryLabel(val) {
  const map = { stone: 'Stone Installation', masonry: 'Stone Masonry', retaining: 'Retaining Walls', patio: 'Patios', paver: 'Driveways & Pavers' };
  return map[val] || val;
}

function loadGallery() {
  loadCustomGallery();
  loadOriginalGallery();
}

async function loadCustomGallery() {
  const existing = (await fbGet(LS_CUSTOM)) || [];
  const custom   = Array.isArray(existing) ? existing : Object.values(existing);
  const grid     = document.getElementById('custom-gallery');
  const empty    = document.getElementById('custom-empty');
  const count    = document.getElementById('custom-count');

  count.textContent = custom.length ? `${custom.length} photo${custom.length !== 1 ? 's' : ''}` : '';

  if (!custom.length) { grid.innerHTML = ''; show(empty); return; }
  hide(empty);

  grid.innerHTML = custom.map(img => `
    <div class="admin-thumb">
      <img src="${img.src}" alt="${esc(img.title)}" />
      <div class="thumb-info">
        <div class="thumb-label">${esc(img.label)}</div>
        <div class="thumb-title">${esc(img.title)}</div>
      </div>
      <button class="thumb-delete" onclick="deleteCustomImage('${img.id}')" title="Remove">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  `).join('');
}

async function deleteCustomImage(id) {
  if (!confirm('Remove this photo from the gallery?')) return;
  const existing = (await fbGet(LS_CUSTOM)) || [];
  const custom = (Array.isArray(existing) ? existing : Object.values(existing)).filter(i => String(i.id) !== String(id));
  await fbSet(LS_CUSTOM, custom);
  loadCustomGallery();
}

async function loadOriginalGallery() {
  const existing = (await fbGet(LS_HIDDEN)) || [];
  const hidden   = Array.isArray(existing) ? existing : Object.values(existing);
  const grid     = document.getElementById('original-gallery');

  grid.innerHTML = ORIGINAL_IMAGES.map(img => {
    const isHidden = hidden.includes(img.src);
    return `
      <div class="admin-thumb ${isHidden ? 'hidden-img' : ''}" onclick="toggleOriginal('${img.src}')" title="${isHidden ? 'Click to show on site' : 'Click to hide from site'}">
        ${isHidden ? '<div class="hidden-badge">HIDDEN</div>' : ''}
        <img src="${img.src}" alt="${esc(img.title)}" />
        <div class="thumb-info">
          <div class="thumb-label">${esc(img.label)}</div>
          <div class="thumb-title">${esc(img.title)}</div>
        </div>
      </div>
    `;
  }).join('');
}

async function toggleOriginal(src) {
  const existing = (await fbGet(LS_HIDDEN)) || [];
  let hidden = Array.isArray(existing) ? existing : Object.values(existing);
  if (hidden.includes(src)) {
    hidden = hidden.filter(s => s !== src);
  } else {
    hidden.push(src);
  }
  await fbSet(LS_HIDDEN, hidden);
  loadOriginalGallery();
}

/* ===== CONTENT ===== */
const CONTENT_DEFAULTS = {
  heroTitle:   'Expert Stone Masonry\nBuilt to Last a Lifetime',
  heroSub:     'Premium Stone Masonry & Custom Stonework — Precision craftsmanship, enduring quality, exceptional results.',
  heroBadge:   'Licensed & Insured',
  aboutP1:     'Brothers Custom Stone & Landscaping Inc is a family-owned business dedicated to transforming outdoor spaces with quality craftsmanship and lasting materials. From driveways to full landscape designs, we bring your vision to life — one stone at a time.',
  aboutP2:     'Every project we undertake is treated with the same care and attention to detail as if it were our own home. We believe in doing the job right the first time, using premium materials and time-tested techniques that deliver results you\'ll be proud of for decades.',
  statProjects: 500,
  statYears:    15,
  statSatisfy:  100,
  phone:       '(647) 467-7381',
  email:       'Brotherscustomstone@outlook.com',
  area:        'Greater Toronto Area & Surrounding Regions',
};

async function loadContent() {
  const saved = (await fbGet(LS_CONTENT)) || {};
  const c = { ...CONTENT_DEFAULTS, ...saved };

  document.getElementById('c-hero-title').value = c.heroTitle;
  document.getElementById('c-hero-sub').value   = c.heroSub;
  document.getElementById('c-hero-badge').value = c.heroBadge;
  document.getElementById('c-about-p1').value   = c.aboutP1;
  document.getElementById('c-about-p2').value   = c.aboutP2;
  document.getElementById('c-stat-projects').value     = c.statProjects;
  document.getElementById('c-stat-years').value        = c.statYears;
  document.getElementById('c-stat-satisfaction').value = c.statSatisfy;
  document.getElementById('c-phone').value = c.phone;
  document.getElementById('c-email').value = c.email;
  document.getElementById('c-area').value  = c.area;
}

async function saveContent() {
  const content = {
    heroTitle:    document.getElementById('c-hero-title').value,
    heroSub:      document.getElementById('c-hero-sub').value,
    heroBadge:    document.getElementById('c-hero-badge').value,
    aboutP1:      document.getElementById('c-about-p1').value,
    aboutP2:      document.getElementById('c-about-p2').value,
    statProjects: parseInt(document.getElementById('c-stat-projects').value) || 500,
    statYears:    parseInt(document.getElementById('c-stat-years').value)    || 15,
    statSatisfy:  parseInt(document.getElementById('c-stat-satisfaction').value) || 100,
    phone:        document.getElementById('c-phone').value,
    email:        document.getElementById('c-email').value,
    area:         document.getElementById('c-area').value,
  };
  await fbSet(LS_CONTENT, content);

  const status = document.getElementById('save-status');
  status.textContent = '✓ Saved successfully!';
  setTimeout(() => { status.textContent = ''; }, 3000);
}

async function resetContent() {
  if (!confirm('Reset all content to original defaults?')) return;
  await fbRemove(LS_CONTENT);
  loadContent();
  const status = document.getElementById('save-status');
  status.textContent = '✓ Reset to defaults.';
  setTimeout(() => { status.textContent = ''; }, 3000);
}

/* ===== UTILS ===== */
function esc(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ===== BOOT ===== */
init();
