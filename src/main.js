const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

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

document.querySelector('#quote-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = form.querySelector('.form-status');
  if (!form.checkValidity()) {
    form.reportValidity();
    status.textContent = 'Please complete the required fields above.';
    return;
  }
  const data = new FormData(form);
  const message = [
    'Hi OrbitBoyzz, I would like a free quote.',
    '',
    `Name: ${data.get('name')}`,
    `Phone: ${data.get('phone')}`,
    `Address: ${data.get('address')}`,
    `Service: ${data.get('service')}`,
    `Details: ${data.get('message') || 'None provided'}`,
  ].join('\n');

  status.textContent = 'Opening your text message app…';
  window.location.href = `sms:+16092977412?&body=${encodeURIComponent(message)}`;
});

document.querySelectorAll('.socials a').forEach((link) => link.addEventListener('click', (event) => event.preventDefault()));
document.querySelector('#year').textContent = new Date().getFullYear();
