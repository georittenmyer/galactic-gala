// ── Starfield ──────────────────────────────
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
function initStars() {
  stars = Array.from({ length: 220 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.4 + 0.2,
    alpha: Math.random() * 0.7 + 0.3,
    speed: Math.random() * 0.003 + 0.001,
    phase: Math.random() * Math.PI * 2,
  }));
}
function drawStars(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    const a = s.alpha * (0.7 + 0.3 * Math.sin(t * s.speed * 60 + s.phase));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 212, 232, ${a})`;
    ctx.fill();
  });
  stars.forEach((s, i) => {
    if (i % 18 === 0) {
      const a = s.alpha * (0.5 + 0.5 * Math.sin(t * s.speed * 40 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232, 200, 122, ${a * 0.6})`;
      ctx.fill();
    }
  });
}
function animate(t) {
  drawStars(t / 1000);
  requestAnimationFrame(animate);
}
resize();
initStars();
requestAnimationFrame(animate);
window.addEventListener('resize', () => { resize(); initStars(); });

// ── Mobile menu ────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

// ── Donor ticker — loads from donors.txt ──
// donors.txt: one donor name per line, blank lines ignored
async function loadDonors() {
  const track = document.getElementById('ticker-track');
  if (!track) return;
  let names = [];
  try {
    const res = await fetch('data/donors.txt');
    if (res.ok) {
      const text = await res.text();
      names = text.split('\n').map(n => n.trim()).filter(Boolean);
    }
  } catch(e) { /* file not found or running locally */ }

  // Fallback names if file isn't available yet
  if (names.length === 0) {
    names = [
      'Wheelie Pop', "Ray's Boathouse", 'New Roots Organics',
      'Beast & Cleaver', 'Sail Sand Point', 'Mainstay Provisions',
      'Sunny Hill', 'Edgeworks Climbing', 'Collins Family Orchards'
    ];
  }

  // Build ticker HTML — duplicated for seamless loop
  const makeItems = () => names.map(n =>
    `<span class="ticker-item">${n}</span><span class="ticker-sep">✦</span>`
  ).join('');
  track.innerHTML = makeItems() + makeItems();
}
loadDonors();
