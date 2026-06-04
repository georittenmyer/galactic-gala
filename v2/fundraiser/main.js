const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav')) {
    mobileMenu.classList.remove('open');
  }
});
