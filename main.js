// =========================================================
// EMAILJS CONFIGURATION
// =========================================================
// 1. Create a free account at https://www.emailjs.com
// 2. Add an Email Service under "Email Services". Copy the Service ID.
// 3. Create an Email Template using these variables:
//      {{from_name}}  {{from_email}}  {{message}}
//    Copy the Template ID.
// 4. Find your Public Key under Account > General.
//
// These IDs are public by design — EmailJS expects them in client code.
// Restrict usage under Account > Security > "Allowed origins" so the
// template can only be sent from this site's domain.
// =========================================================
const EMAILJS_PUBLIC_KEY  = 'mPFUgaFCFSdk5oPbW';
const EMAILJS_SERVICE_ID  = 'service_4mbklp8';
const EMAILJS_TEMPLATE_ID = 'template_uamxadj';
// =========================================================

const EMAILJS_CONFIGURED = !EMAILJS_PUBLIC_KEY.startsWith('YOUR_') && typeof emailjs !== 'undefined';
if (EMAILJS_CONFIGURED) emailjs.init(EMAILJS_PUBLIC_KEY);

const DESKTOP_BREAKPOINT = 1024;
const isDesktop = () => window.innerWidth >= DESKTOP_BREAKPOINT;

// How long the slide-out runs before the panel is removed from the layout.
// Must stay >= the .page transition duration in styles.css.
const PAGE_TRANSITION_MS = 1000;

// === DOM References ===
const pages             = document.querySelectorAll('.page');
const landing           = document.getElementById('landing');
const profileContainer  = document.getElementById('profile-container');
const projectList       = document.getElementById('project-list');
const projectDetailPage = document.getElementById('project-detail');
const backToProjectsBtn = document.getElementById('back-to-projects');
const projectsPage      = document.getElementById('projects');
const mobileMenuBtn     = document.getElementById('mobile-menu-btn');
const mobileMenu        = document.getElementById('mobile-menu');
const mobileCloseBtn    = document.getElementById('mobile-close-btn');

// Element that had focus before a panel opened, so it can be restored on close.
let lastFocusedElement = null;

// === Project data =========================================
// liveLink / repoLink are both optional — the detail view only renders the
// buttons that actually exist, so nothing ever links to a dead "#".
const projectsData = [
  {
    title: "SETENS",
    role: "Full-stack developer · Client project",
    description:
      "Sistema de Evaluación de Transición Escolar Nivel Secundario — a special education transition platform used by evaluators across Puerto Rico. I migrated a legacy system onto a modern stack while keeping real production data intact, and now maintain it in production.",
    highlights: [
      "Serves records for 800+ students with role-based access per evaluator",
      "Split deployment: React frontend on Netlify, GraphQL API on Railway",
      "Migrated legacy data into PostgreSQL with Prisma, files on Cloudflare R2",
      "Hardened previously unauthenticated API routes and rebuilt the notification pipeline",
    ],
    techStack: ["React", "Node.js", "Express", "GraphQL", "PostgreSQL", "Prisma", "Cloudflare R2"],
    liveLink: "https://setens.org",
  },
  {
    title: "FitBySuárez",
    role: "Full-stack developer",
    description:
      "A personal training platform that runs a coaching business end to end — clients, training programs, nutrition, payments and progress tracking in one private system, built for remote and in-person clients in Puerto Rico.",
    highlights: [
      "JWT auth with role separation for coach and client, hardened with Helmet, CORS and rate limiting",
      "AI meal recommender and text food logging using Claude, with macros verified against a real food database",
      "Progress charts, image uploads via Cloudinary, transactional email via Resend",
      "Companion mobile app in React Native / Expo at feature parity with the web app",
    ],
    techStack: ["Node.js", "Express", "MongoDB", "Mongoose", "JWT", "Tailwind CSS", "Chart.js", "Stripe"],
    liveLink: "https://fitbysuarez.com",
    repoLink: "https://github.com/Suareza1992/FBSv4",
  },
  {
    title: "JM Automotive Academy",
    role: "Full-stack developer · Client project",
    description:
      "A business platform for an automotive coatings company: a public marketing site, an online store, a video course academy, a member portal, and a self-serve admin panel so the owner can run the whole thing without a developer.",
    highlights: [
      "Built on Next.js App Router with React Server Components and TypeScript throughout",
      "Custom CMS so the client edits products, courses and pages himself",
      "Membership tiers gating access to course content",
      "Fully bilingual — English and Spanish",
    ],
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "SQLite"],
  },
  {
    title: "Planet Earth 3D",
    role: "Personal project",
    description:
      "An interactive globe built with three.js — real coastlines and country borders from Natural Earth data, NASA night-lights imagery for the surface, and pins you can drop anywhere on the planet and annotate.",
    highlights: [
      "Geographic data pipeline converting raw Natural Earth sources into render-ready geometry",
      "Ray-cast pin placement that maps screen clicks to latitude and longitude",
      "Custom shaders for the atmosphere and the day/night terminator",
    ],
    techStack: ["three.js", "JavaScript", "Vite", "GLSL", "GeoJSON"],
  },
  {
    title: "Thiago's Planet",
    role: "Personal project",
    description:
      "A hand-drawn 3D world you walk around the outside of a small planet — and dig into. A tiny-planet renderer extended with a voxel-style tile grid, mining, ore and caves. Nothing is downloaded: the whole world is generated from noise at startup.",
    highlights: [
      "Spherical world with gravity and camera-relative movement over curved terrain",
      "Deterministic noise-based generation — the same seed rebuilds the identical planet",
      "Destructible tile grid with mining, ore veins and cave systems",
    ],
    techStack: ["three.js", "JavaScript", "Vite", "Procedural generation"],
  },
];

// === Project card rendering ===============================
// Cards are <button>s so they are focusable, reachable by keyboard and
// announced correctly — a click-handled <div> is none of those things.
function renderProjectCards() {
  if (!projectList) return;

  projectsData.forEach((project, index) => {
    const item = document.createElement('li');
    item.className = 'flex-shrink-0 w-[300px] lg:w-[400px] h-full';

    const card = document.createElement('button');
    card.type = 'button';
    card.className =
      'project-card text-left w-full h-full bg-white/10 p-6 rounded-lg ' +
      'transition-transform hover:scale-105 focus-visible:scale-105 flex flex-col';
    card.dataset.projectId = String(index);

    const badgeLabel = project.liveLink ? 'Live' : (project.repoLink ? 'Source' : null);
    const badge = badgeLabel
      ? `<span class="project-badge">${badgeLabel}</span>`
      : '';

    card.innerHTML = `
      <div class="project-placeholder" aria-hidden="true"><span>${escapeHtml(project.title)}</span></div>
      <div class="flex items-start justify-between gap-2 mb-1">
        <h3 class="text-xl lg:text-2xl font-semibold">${escapeHtml(project.title)}</h3>
        ${badge}
      </div>
      <p class="text-xs text-white/60 mb-2">${escapeHtml(project.role)}</p>
      <p class="text-xs lg:text-sm text-white/80">${escapeHtml(truncate(project.description, 150))}</p>
    `;

    card.addEventListener('click', () => openProjectDetail(index));
    item.appendChild(card);
    projectList.appendChild(item);
  });
}

function truncate(text, max) {
  return text.length <= max ? text : text.slice(0, max).trimEnd() + '…';
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));
}

// === Focus helpers ========================================
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusableWithin(container) {
  return [...container.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
}

// Keeps Tab inside the open panel, so keyboard users cannot tab out into the
// page behind it while a modal panel is up.
function trapFocus(e, container) {
  if (e.key !== 'Tab') return;
  const items = focusableWithin(container);
  if (items.length === 0) return;

  const first = items[0];
  const last  = items[items.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

// === Page Helpers =========================================
// Reveals a panel and starts its slide-in. The forced reflow makes the browser
// register the off-screen starting position before .active flips it, so the
// transition actually runs. requestAnimationFrame would read more idiomatically
// here, but browsers pause it in background tabs — a panel opened just before
// the user switched away would stay stuck invisible forever.
function reveal(page) {
  page.classList.remove('hidden');
  void page.offsetWidth; // flush layout — do not remove
  page.classList.add('active');
}

function openPage(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  lastFocusedElement = document.activeElement;

  pages.forEach(p => {
    p.classList.add('hidden');
    p.classList.remove('active');
  });

  reveal(target);
  focusableWithin(target)[0]?.focus();
  updateScrollHints(target);

  if (isDesktop()) {
    profileContainer.classList.add(`active-${sectionId}`);
    landing.classList.add('hidden');
  }

  closeMobileMenu();
}

function closePage(page) {
  if (!page || page.classList.contains('hidden')) return;

  page.classList.remove('active');
  clearProfileState();

  setTimeout(() => {
    page.classList.add('hidden');
    landing.classList.remove('hidden');
  }, PAGE_TRANSITION_MS);

  if (lastFocusedElement && document.contains(lastFocusedElement)) {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
}

function clearProfileState() {
  profileContainer.classList.remove(
    'active-about', 'active-projects', 'active-contact', 'active-project-detail'
  );
}

function activePage() {
  return document.querySelector('.page.active');
}

// === Navigation ===========================================
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => openPage(btn.dataset.section));
});

document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', () => closePage(btn.closest('.page')));
});

// === Mobile Menu ==========================================
function openMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('hidden');
  mobileMenuBtn.setAttribute('aria-expanded', 'true');
  focusableWithin(mobileMenu)[0]?.focus();
}

function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.add('hidden');
  mobileMenuBtn?.setAttribute('aria-expanded', 'false');
}

mobileMenuBtn?.addEventListener('click', openMobileMenu);
mobileCloseBtn?.addEventListener('click', () => {
  closeMobileMenu();
  mobileMenuBtn?.focus();
});

// === Project detail =======================================
function openProjectDetail(index) {
  const project = projectsData[index];
  if (!project) return;

  lastFocusedElement = document.activeElement;

  document.getElementById('project-title').textContent       = project.title;
  document.getElementById('project-role').textContent        = project.role;
  document.getElementById('project-description').textContent = project.description;

  const highlights = document.getElementById('project-highlights');
  highlights.innerHTML = '';
  (project.highlights || []).forEach(point => {
    const li = document.createElement('li');
    li.textContent = point;
    highlights.appendChild(li);
  });

  const techStack = document.getElementById('project-tech-stack');
  techStack.innerHTML = '';
  project.techStack.forEach(tech => {
    const li = document.createElement('li');
    li.textContent = tech;
    li.className   = 'bg-white/10 py-1 px-3 rounded-md text-xs';
    techStack.appendChild(li);
  });

  // Only render buttons for links that actually exist.
  const links = document.getElementById('project-links');
  links.innerHTML = '';
  if (project.liveLink) links.appendChild(linkButton(project.liveLink, 'View Live Site', true));
  if (project.repoLink) links.appendChild(linkButton(project.repoLink, 'View Source', !project.liveLink));
  if (!project.liveLink && !project.repoLink) {
    const note = document.createElement('p');
    note.className   = 'text-sm text-white/50 italic';
    note.textContent = 'Private repository — happy to walk through this one on a call.';
    links.appendChild(note);
  }

  // An empty <video src=""> resolves to the page URL and fires a network
  // error, so the element is removed from the flow unless there is real media.
  const media   = document.getElementById('project-media');
  const videoEl = document.getElementById('project-video');
  const grid    = document.getElementById('project-detail-grid');
  if (project.videoSrc) {
    videoEl.src = project.videoSrc;
    media.classList.remove('hidden');
    grid.classList.add('lg:grid-cols-2');
  } else {
    videoEl.removeAttribute('src');
    videoEl.load();
    media.classList.add('hidden');
    // No media, so let the copy use the full panel width instead of
    // squeezing into one half beside an empty column.
    grid.classList.remove('lg:grid-cols-2');
  }

  projectsPage.classList.remove('active');
  setTimeout(() => {
    projectsPage.classList.add('hidden');
    reveal(projectDetailPage);
    focusableWithin(projectDetailPage)[0]?.focus();
    updateScrollHints(projectDetailPage);
    if (isDesktop()) {
      profileContainer.classList.remove('active-projects');
      profileContainer.classList.add('active-project-detail');
    }
  }, PAGE_TRANSITION_MS);
}

function linkButton(href, label, primary) {
  const a = document.createElement('a');
  a.href   = href;
  a.target = '_blank';
  a.rel    = 'noopener noreferrer';
  a.textContent = label;
  a.className = primary
    ? 'bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-[var(--dark-color)] font-bold py-3 px-6 rounded-lg w-fit transition-colors duration-300'
    : 'border border-white/40 hover:bg-white/10 text-white font-bold py-3 px-6 rounded-lg w-fit transition-colors duration-300';
  return a;
}

backToProjectsBtn.addEventListener('click', () => {
  projectDetailPage.classList.remove('active');
  setTimeout(() => {
    projectDetailPage.classList.add('hidden');
    reveal(projectsPage);
    focusableWithin(projectsPage)[0]?.focus();
    if (isDesktop()) {
      profileContainer.classList.remove('active-project-detail');
      profileContainer.classList.add('active-projects');
    }
  }, PAGE_TRANSITION_MS);
});

// === Close on outside click ===============================
document.addEventListener('click', e => {
  const page = activePage();
  if (!page) return;

  // The nav buttons and the hamburger open panels — a click on either must not
  // immediately be read as a click "outside" and close what just opened.
  if (e.target.closest('.nav-btn') || e.target.closest('#mobile-menu-btn')) return;
  if (page.contains(e.target)) return;

  closePage(page);
});

// === Escape key ===========================================
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      closeMobileMenu();
      mobileMenuBtn?.focus();
      return;
    }
    const page = activePage();
    if (page) closePage(page);
    return;
  }

  if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
    trapFocus(e, mobileMenu);
    return;
  }
  const page = activePage();
  if (page) trapFocus(e, page);
});

// === Breakpoint changes ===================================
// Crossing 1024px with a panel open used to strand desktop-only state: the
// hero stayed hidden and the portrait kept its slide-over transform, which
// then persisted if the window grew back.
function syncBreakpointState() {
  const page = activePage();

  if (isDesktop()) {
    if (page) {
      landing.classList.add('hidden');
      clearProfileState();
      profileContainer.classList.add(`active-${page.id}`);
    } else {
      landing.classList.remove('hidden');
      clearProfileState();
    }
    closeMobileMenu();
  } else {
    landing.classList.remove('hidden');
    clearProfileState();
  }
}

// matchMedia's change event is the precise signal, but it does not fire in
// every environment (emulated viewports, some embedded webviews), so resize
// backstops it. Both are idempotent.
window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`)
  .addEventListener('change', syncBreakpointState);

// === Scroll affordances ===================================
// Panels can overflow. Without a cue the content just looks truncated, so a
// fade is shown at the bottom of any region that still has more to scroll.
function updateScrollHints(scope) {
  const root = scope || document;
  root.querySelectorAll('[data-scroll-region]').forEach(region => {
    const page = region.closest('.page');
    const hint = page?.querySelector('[data-scroll-hint]');
    if (!hint) return;
    const remaining = region.scrollHeight - region.clientHeight - region.scrollTop;
    hint.classList.toggle('is-visible', remaining > 8);
  });
}

document.querySelectorAll('[data-scroll-region]').forEach(region => {
  region.addEventListener('scroll', () => updateScrollHints(region.closest('.page')), { passive: true });
});

let resizeTimer;
window.addEventListener('resize', () => {
  syncBreakpointState();
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => updateScrollHints(), 120);
});

// === Contact Form =========================================
const form        = document.getElementById('contactForm');
const responseBox = document.getElementById('formResponse');
const submitBtn   = document.getElementById('contact-submit');

form.addEventListener('submit', async e => {
  e.preventDefault();

  // Reset state before each attempt so stale messages never linger
  responseBox.textContent = '';
  responseBox.style.color = '';

  if (!form.checkValidity()) {
    responseBox.textContent = 'Please fill in every field with a valid email address.';
    responseBox.style.color = 'orange';
    form.reportValidity();
    return;
  }

  if (!EMAILJS_CONFIGURED) {
    responseBox.textContent = 'Contact form is not configured yet. Please email me directly instead.';
    responseBox.style.color = 'orange';
    return;
  }

  const templateParams = {
    from_name:  form.elements.name.value,
    from_email: form.elements.email.value,
    message:    form.elements.message.value,
  };

  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending…';

  try {
    const result = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    if (result.status === 200) {
      responseBox.textContent = "Message sent! I'll get back to you soon.";
      responseBox.style.color = 'lightgreen';
      form.reset();
    } else {
      responseBox.textContent = 'Something went wrong. Please try again.';
      responseBox.style.color = 'salmon';
    }
  } catch (err) {
    console.error(err);
    responseBox.textContent = 'Failed to send message. Please try again later.';
    responseBox.style.color = 'salmon';
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send Message';
  }
});

// === Init =================================================
renderProjectCards();
