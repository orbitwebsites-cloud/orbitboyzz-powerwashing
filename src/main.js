/* =========================================================================
   Orbit PowerWash — site behaviour
   Vanilla JS, no dependencies. Mobile menu, service preselect,
   quote form (FormSubmit AJAX) + preliminary-estimate modal.
   ========================================================================= */

const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/quote@orbitpowerwash.com';

/* Preliminary ranges — kept in sync with the internal pricing guide's
   public-safe spread. These are ranges, never final quotes. */
const ESTIMATE_RANGES = {
  'Driveway Washing': '$130–$325',
  'House Washing': '$250–$775',
  'Patio & Deck Washing': '$110–$425',
  'Fence Washing': 'from $150',
  'Trash Bin Cleaning': 'from $25/bin',
};
const FALLBACK_RANGE = '$150–$400';

/* -------------------------------------------------------------------------
   Mobile menu
   ------------------------------------------------------------------------- */
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  navLinks.classList.remove('open');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  navLinks.classList.toggle('open', !isOpen);
});

navLinks.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', closeMenu)
);

document.addEventListener('click', (event) => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    closeMenu();
  }
});

/* -------------------------------------------------------------------------
   Service links preselect the form dropdown
   ------------------------------------------------------------------------- */
const serviceSelect = document.querySelector('select[name="service"]');

document.querySelectorAll('[data-service]').forEach((link) =>
  link.addEventListener('click', () => {
    const wanted = link.dataset.service;
    const match = Array.from(serviceSelect.options).some((opt) => opt.value === wanted);
    if (match) serviceSelect.value = wanted;
  })
);

/* -------------------------------------------------------------------------
   Placeholder links (socials, Google review) — no destination yet
   ------------------------------------------------------------------------- */
document.querySelectorAll('[data-placeholder]').forEach((link) =>
  link.addEventListener('click', (event) => event.preventDefault())
);

/* -------------------------------------------------------------------------
   Estimate modal (with focus management)
   ------------------------------------------------------------------------- */
const estimateModal = document.querySelector('#estimate-modal');
const estimatePriceEl = document.querySelector('#estimate-price');
const estimateServiceEl = document.querySelector('#estimate-service');
let lastFocused = null;

function getFocusable() {
  return estimateModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
}

function openEstimate(service) {
  const range = ESTIMATE_RANGES[service] || FALLBACK_RANGE;
  estimatePriceEl.textContent = range;
  estimateServiceEl.textContent = `Preliminary range for ${service}`;
  lastFocused = document.activeElement;
  estimateModal.hidden = false;
  document.body.classList.add('modal-open');
  estimateModal.querySelector('.modal-close').focus();
}

function closeEstimate() {
  estimateModal.hidden = true;
  document.body.classList.remove('modal-open');
  if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
}

estimateModal
  .querySelectorAll('.modal-close, .modal-done')
  .forEach((button) => button.addEventListener('click', closeEstimate));

estimateModal.addEventListener('click', (event) => {
  if (event.target === estimateModal) closeEstimate();
});

document.addEventListener('keydown', (event) => {
  if (estimateModal.hidden) return;
  if (event.key === 'Escape') {
    closeEstimate();
  } else if (event.key === 'Tab') {
    const focusable = getFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

/* -------------------------------------------------------------------------
   Quote form — FormSubmit AJAX flow
   ------------------------------------------------------------------------- */
const form = document.querySelector('#quote-form');
const status = form.querySelector('.form-status');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  status.classList.remove('is-error');

  if (!form.checkValidity()) {
    form.reportValidity();
    status.textContent = 'Please complete the required fields above.';
    status.classList.add('is-error');
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(form));
  data._subject = `New ${data.service} quote request from ${data.name}`;
  data._template = 'table';
  data._replyto = data.email;

  button.disabled = true;
  button.textContent = 'Sending…';
  status.textContent = '';

  try {
    const response = await fetch(FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === false || result.success === 'false') {
      throw new Error('Submission failed');
    }

    const submittedService = data.service;
    form.reset();
    status.textContent = 'Thanks! Your request was sent to Orbit PowerWash — we’ll be in touch shortly.';
    openEstimate(submittedService);
  } catch {
    status.innerHTML =
      'We couldn’t send your request. Please call or text <a href="tel:+16092977412">(609) 297-7412</a>.';
    status.classList.add('is-error');
  } finally {
    button.disabled = false;
    button.textContent = 'Request My Free Quote';
  }
});

/* -------------------------------------------------------------------------
   Footer year
   ------------------------------------------------------------------------- */
document.querySelector('#year').textContent = new Date().getFullYear();
