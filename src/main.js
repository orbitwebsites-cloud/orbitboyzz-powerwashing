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

    form.reset();
    status.textContent = 'Thanks! Your quote request was saved and sent to Orbit PowerWash.';
  } catch {
    status.innerHTML = 'We couldn\'t save your request. Please call or text <a href="tel:+16092977412">(609) 297-7412</a>.';
  } finally {
    button.disabled = false;
    button.innerHTML = 'Request My Free Quote <span aria-hidden="true">↗</span>';
  }
});

document.querySelectorAll('.socials a').forEach((link) => link.addEventListener('click', (event) => event.preventDefault()));
document.querySelector('#year').textContent = new Date().getFullYear();
