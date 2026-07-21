/* =========================================================================
   Orbit PowerWash — town landing page behaviour
   Mobile menu toggle + footer year only. No estimator/quote-form here.
   ========================================================================= */

const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuButton && navLinks) {
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
}

const yearEl = document.querySelector('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
