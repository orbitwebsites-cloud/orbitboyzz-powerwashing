/* =========================================================================
   Orbit PowerWash — site behaviour
   Vanilla JS, no dependencies. Mobile menu, service preselect,
   interactive price estimator, quote form (FormSubmit AJAX).
   ========================================================================= */

const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/quote@orbitpowerwash.com';
const PHONE_LINK = 'tel:+16092977412';

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
   Interactive price estimator
   Public-safe ranges mapped from the internal pricing guide. Bundle
   discounts (2 svc ≈ 10%, 3+ ≈ 15%) shown as an informational note;
   $150 job minimum; trash bins are an undiscounted add-on that never
   counts toward a bundle. Ranges only — never a final quote.
   ------------------------------------------------------------------------- */
const estimator = document.querySelector('#estimator');

if (estimator) {
  /* Bundle services (bins are excluded). Tier ranges are public-safe. */
  const TIERS = {
    'Driveway Washing': {
      name: 'opt-driveway',
      options: {
        '2car': { label: '2-car (~600 sq ft)', low: 130, high: 180 },
        '3car': { label: '3-car', low: 180, high: 260 },
        long: { label: 'Long / extended', low: 280, high: 425 },
      },
    },
    'House Washing': {
      name: 'opt-house',
      options: {
        ranch: { label: 'Ranch / 1-story', low: 250, high: 375 },
        colonial: { label: '2-story colonial', low: 375, high: 550 },
        larger: { label: 'Larger 2-story', low: 550, high: 775 },
      },
    },
    'Patio & Deck Washing': {
      name: 'opt-patio',
      options: {
        small: { label: 'Small (≤200 sq ft)', low: 110, high: 160 },
        medium: { label: 'Medium', low: 160, high: 260 },
        large: { label: 'Large', low: 260, high: 425 },
      },
    },
  };

  /* Service order used for "first selected service" + line ordering. */
  const SERVICE_ORDER = [
    'Driveway Washing',
    'House Washing',
    'Patio & Deck Washing',
    'Fence Washing',
    'Trash Bin Cleaning',
  ];
  const JOB_MINIMUM = 150;

  const totalEl = estimator.querySelector('#est-total');
  const linesEl = estimator.querySelector('#est-lines');
  const minNoteEl = estimator.querySelector('#est-min-note');
  const bundleNoteEl = estimator.querySelector('#est-bundle-note');
  const foundingNoteEl = estimator.querySelector('#est-founding-note');
  const ctaButton = estimator.querySelector('#est-cta');
  const fenceInput = estimator.querySelector('#est-fence-ft');
  const binInput = estimator.querySelector('#est-bin-count');

  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const rangeText = (low, high) =>
    Math.round(low) === Math.round(high) ? money(low) : `${money(low)}–${money(high)}`;

  function binPrice(count) {
    if (count <= 0) return 0;
    if (count === 1) return 25;
    if (count === 2) return 40;
    return count * 20;
  }

  function checkFor(service) {
    return estimator.querySelector(`.est-check[data-est-service="${service}"]`);
  }

  /* Reveal / hide a service's option panel when its checkbox toggles. */
  estimator.querySelectorAll('.est-check').forEach((check) => {
    const panel = document.getElementById(check.getAttribute('aria-controls'));
    const service = check.closest('.est-service');
    const sync = () => {
      if (panel) panel.hidden = !check.checked;
      if (service) service.classList.toggle('is-selected', check.checked);
    };
    check.addEventListener('change', sync);
    sync();
  });

  function collectServices() {
    const lines = [];
    let realLow = 0;
    let realHigh = 0;
    let realCount = 0;

    for (const service of ['Driveway Washing', 'House Washing', 'Patio & Deck Washing']) {
      const check = checkFor(service);
      if (!check || !check.checked) continue;
      const tier = TIERS[service];
      const picked = estimator.querySelector(`input[name="${tier.name}"]:checked`);
      const opt = tier.options[picked ? picked.value : ''];
      if (!opt) continue;
      lines.push({ service, detail: opt.label, low: opt.low, high: opt.high });
      realLow += opt.low;
      realHigh += opt.high;
      realCount += 1;
    }

    const fenceCheck = checkFor('Fence Washing');
    if (fenceCheck && fenceCheck.checked) {
      const ft = Math.max(0, Math.round(Number(fenceInput.value) || 0));
      const low = Math.round(ft * 1.5);
      const high = Math.round(ft * 2.5);
      lines.push({
        service: 'Fence Washing',
        detail: `${ft.toLocaleString('en-US')} linear ft`,
        low,
        high,
      });
      realLow += low;
      realHigh += high;
      realCount += 1;
    }

    return { lines, realLow, realHigh, realCount };
  }

  function render() {
    const { lines, realLow, realHigh, realCount } = collectServices();

    const binCheck = checkFor('Trash Bin Cleaning');
    let binCount = 0;
    let binTotal = 0;
    if (binCheck && binCheck.checked) {
      binCount = Math.max(1, Math.round(Number(binInput.value) || 1));
      binTotal = binPrice(binCount);
    }

    /* Bundle discount applies to the summed real-service range only. */
    let discount = 0;
    if (realCount >= 3) discount = 0.15;
    else if (realCount >= 2) discount = 0.1;
    const discLow = Math.round(realLow * (1 - discount));
    const discHigh = Math.round(realHigh * (1 - discount));

    const grandLow = discLow + binTotal;
    const grandHigh = discHigh + binTotal;

    /* ---- Headline total ---- */
    if (realCount === 0 && binCount === 0) {
      totalEl.innerHTML = '<span class="est-total-empty">Pick a service to see your range.</span>';
    } else {
      totalEl.textContent = rangeText(grandLow, grandHigh);
    }

    /* ---- Breakdown lines ---- */
    linesEl.innerHTML = '';
    const addLine = (label, value, kind = '') => {
      const li = document.createElement('li');
      li.className = 'est-line' + (kind ? ` est-line--${kind}` : '');
      const l = document.createElement('span');
      l.className = 'est-line-label';
      l.textContent = label;
      const v = document.createElement('span');
      v.className = 'est-line-value';
      v.textContent = value;
      li.append(l, v);
      linesEl.append(li);
    };

    lines.forEach((line) =>
      addLine(`${line.service} · ${line.detail}`, rangeText(line.low, line.high))
    );

    if (realCount >= 2) {
      addLine('Services subtotal', rangeText(realLow, realHigh), 'subtotal');
    }
    if (binCount >= 1) {
      addLine(`Trash bins (${binCount})`, `+${money(binTotal)}`, 'bins');
    }

    /* ---- Bundle note ---- */
    if (realCount >= 2) {
      const pct = discount === 0.15 ? '15%' : '10%';
      const word = realCount >= 3 ? `${realCount} services` : '2 services';
      bundleNoteEl.hidden = false;
      bundleNoteEl.innerHTML = `<strong>Bundle savings:</strong> book ${word} together for about ${pct} off — roughly <strong>${rangeText(
        discLow,
        discHigh
      )}</strong> on the services above.`;
    } else {
      bundleNoteEl.hidden = true;
      bundleNoteEl.textContent = '';
    }

    /* ---- $150 minimum note ---- */
    if (realCount === 0 && binCount >= 1) {
      minNoteEl.hidden = false;
      minNoteEl.innerHTML =
        'A <strong>$150 job minimum</strong> applies to standalone visits — trash bins are usually an easy add-on to a wash, so bins on their own don’t quite meet it.';
    } else if (realCount >= 1 && discHigh < JOB_MINIMUM) {
      minNoteEl.hidden = false;
      minNoteEl.innerHTML =
        'A <strong>$150 job minimum</strong> applies to standalone visits, so a small job like this is quoted at $150 — or bundle it in to skip the floor.';
    } else {
      minNoteEl.hidden = true;
      minNoteEl.textContent = '';
    }

    /* ---- Founding-customer note ---- */
    foundingNoteEl.hidden = !(realCount >= 1 || binCount >= 1);
  }

  /* Recompute on any input within the estimator. */
  estimator.addEventListener('input', render);
  estimator.addEventListener('change', render);

  /* CTA: preselect the quote dropdown + smooth-scroll to the form. */
  ctaButton.addEventListener('click', () => {
    const selected = SERVICE_ORDER.filter((service) => {
      const check = checkFor(service);
      return check && check.checked;
    });

    if (selected.length === 1) {
      const match = Array.from(serviceSelect.options).some((opt) => opt.value === selected[0]);
      if (match) serviceSelect.value = selected[0];
    } else if (selected.length >= 2) {
      serviceSelect.value = 'Multiple / not sure';
    }

    const quote = document.querySelector('#quote');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    quote.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    try {
      serviceSelect.focus({ preventScroll: true });
    } catch {
      serviceSelect.focus();
    }
  });

  render();
}

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

    form.reset();
    status.textContent =
      'Thanks! Your request was sent to Orbit PowerWash — we’ll be in touch shortly to confirm your exact price.';
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
