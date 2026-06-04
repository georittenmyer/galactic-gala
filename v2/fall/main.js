// ── Mobile menu ────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileMenu.classList.remove('open'))
  );
}

// ── Fundraiser Thermometer ────────────────────
function initThermometer() {
  const thermoFill = document.getElementById('thermo-fill');
  if (!thermoFill) return;

  // Update these values based on actual fundraising progress
  const raised = 5000; // Current amount raised
  const goal = 25000; // Fundraising goal
  const percentage = Math.min((raised / goal) * 100, 100);

  thermoFill.style.width = percentage + '%';

  const amountText = document.getElementById('thermo-amount');
  if (amountText) {
    amountText.textContent = `$${raised.toLocaleString()} of $${goal.toLocaleString()} raised (${Math.round(percentage)}%)`;
  }
}

initThermometer();
