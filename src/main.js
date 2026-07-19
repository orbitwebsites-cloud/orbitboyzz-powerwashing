const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const estimateModal = document.querySelector('#estimate-modal');
const estimatePrices = {
  'Driveway Washing': '$200–$400',
  'House Washing': '$300–$600',
  'Patio Washing': '$150–$350',
};

function closeEstimate() {
  estimateModal.hidden = true;
  document.body.classList.remove('modal-open');
}

function showEstimate(service) {
  document.querySelector('#estimate-price').textContent = estimatePrices[service] || '$200–$400';
  document.querySelector('#estimate-service').textContent = `Preliminary range for ${service}`;
  const confetti = estimateModal.querySelector('.confetti');
  confetti.replaceChildren();
  for (let index = 0; index < 60; index += 1) {
    const piece = document.createElement('i');
    piece.style.setProperty('--x', `${Math.random() * 100}%`);
    piece.style.setProperty('--delay', `${Math.random() * 0.5}s`);
    piece.style.setProperty('--duration', `${1.8 + Math.random() * 1.4}s`);
    piece.style.setProperty('--rotation', `${Math.random() * 720 - 360}deg`);
    piece.style.setProperty('--color', ['#17d4ed', '#0e1f33', '#f6b91d', '#5b6a68'][index % 4]);
    confetti.append(piece);
  }
  estimateModal.hidden = false;
  document.body.classList.add('modal-open');
  estimateModal.querySelector('.modal-close').focus();
}

estimateModal.querySelectorAll('.modal-close, .modal-done').forEach((button) => button.addEventListener('click', closeEstimate));
estimateModal.addEventListener('click', (event) => { if (event.target === estimateModal) closeEstimate(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !estimateModal.hidden) closeEstimate(); });

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navLinks.classList.toggle('open', !isOpen);
});

navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  navLinks.classList.remove('open');
}));

document.querySelectorAll('[data-service]').forEach((link) => link.addEventListener('click', () => {
  document.querySelector('select[name="service"]').value = link.dataset.service;
}));

document.querySelector('#quote-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = form.querySelector('.form-status');
  if (!form.checkValidity()) {
    form.reportValidity();
    status.textContent = 'Please complete the required fields above.';
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
    const response = await fetch('https://formsubmit.co/ajax/quotes@orbitpowerwash.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok || result.success === false) throw new Error('Submission failed');

    const submittedService = data.service;
    form.reset();
    status.textContent = 'Thanks! Your quote request was saved and sent to Orbit PowerWash.';
    showEstimate(submittedService);
  } catch {
    status.innerHTML = 'We couldn\'t save your request. Please call or text <a href="tel:+16092977412">(609) 297-7412</a>.';
  } finally {
    button.disabled = false;
    button.innerHTML = 'Request My Free Quote <span aria-hidden="true">↗</span>';
  }
});

document.querySelectorAll('.socials a').forEach((link) => link.addEventListener('click', (event) => event.preventDefault()));
document.querySelector('#year').textContent = new Date().getFullYear();
