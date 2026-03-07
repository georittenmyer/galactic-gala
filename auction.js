// Category emoji map — add more as needed
const CATEGORY_ICONS = {
  Experiences: "🌟",
  "Food & Drink": "🍷",
  Travel: "✈️",
  Art: "🎨",
  "Sports & Entertainment": "🎟️",
  Services: "✨",
  "Kids & Family": "🐟",
};

function formatBid(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function renderCard(item) {
  const icon = CATEGORY_ICONS[item.category] || "✦";
  const hasImage = item.image && item.image.trim() !== "";

  return `
    <a href="${item.givebutter_url}" class="auction-card" target="_blank" rel="noopener" data-category="${item.category}">
      <div class="auction-card-image">
        ${
          hasImage
            ? `<img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
            : ""
        }
        <div class="auction-card-image-placeholder" ${hasImage ? 'style="display:none"' : ""}>${icon}</div>
        <span class="auction-card-category">${item.category}</span>
      </div>
      <div class="auction-card-body">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="auction-card-footer">
          <div class="auction-card-bid">
            <span class="auction-bid-label">Starting Bid</span>
            <span class="auction-bid-amount">${formatBid(item.startingBid)}</span>
          </div>
          <span class="auction-card-cta">Place Bid ✦</span>
        </div>
      </div>
    </a>`;
}

function renderFilters(categories, grid) {
  const bar = document.getElementById("auction-filters");
  if (!bar) return;

  const allBtn = document.createElement("button");
  allBtn.className = "filter-btn active";
  allBtn.textContent = "All Items";
  allBtn.dataset.filter = "all";
  bar.appendChild(allBtn);

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.textContent = cat;
    btn.dataset.filter = cat;
    bar.appendChild(btn);
  });

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    bar
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    grid.querySelectorAll(".auction-card").forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.style.display = show ? "" : "none";
    });

    const visible = grid.querySelectorAll(
      '.auction-card:not([style*="display: none"])',
    );
    let empty = grid.querySelector(".auction-empty");
    if (visible.length === 0) {
      if (!empty) {
        empty = document.createElement("div");
        empty.className = "auction-empty";
        empty.innerHTML =
          "<p>No items in this category yet — check back soon!</p>";
        grid.appendChild(empty);
      }
    } else if (empty) {
      empty.remove();
    }
  });
}

async function loadAuction() {
  const grid = document.getElementById("auction-grid");
  const countEl = document.getElementById("auction-count");
  if (!grid) return;

  let items = [];
  try {
    const res = await fetch("data/auction-items.json");
    if (res.ok) items = await res.json();
  } catch (e) {
    grid.innerHTML =
      '<div class="auction-empty"><p>Could not load auction items. Please try again later.</p></div>';
    return;
  }

  if (items.length === 0) {
    grid.innerHTML =
      '<div class="auction-empty"><p>Auction items coming soon — stay tuned!</p></div>';
    return;
  }

  // Render cards
  grid.innerHTML = items.map(renderCard).join("");

  // Update count
  if (countEl)
    countEl.textContent = `${items.length} item${items.length !== 1 ? "s" : ""}`;

  // Build filter list from unique categories in order of appearance
  const categories = [...new Set(items.map((i) => i.category))];
  renderFilters(categories, grid);
}

// Starfield (shared with main page)
const canvas = document.getElementById("starfield");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let stars = [];
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  function initStars() {
    stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.2,
      alpha: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2,
    }));
  }
  function drawStars(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((s) => {
      const a = s.alpha * (0.7 + 0.3 * Math.sin(t * s.speed * 60 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,212,232,${a})`;
      ctx.fill();
    });
  }
  function animate(t) {
    drawStars(t / 1000);
    requestAnimationFrame(animate);
  }
  resize();
  initStars();
  requestAnimationFrame(animate);
  window.addEventListener("resize", () => {
    resize();
    initStars();
  });
}

// Mobile menu
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () =>
    mobileMenu.classList.toggle("open"),
  );
  mobileMenu
    .querySelectorAll("a")
    .forEach((a) =>
      a.addEventListener("click", () => mobileMenu.classList.remove("open")),
    );
}

loadAuction();
