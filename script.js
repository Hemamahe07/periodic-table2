const categories = {
  Planning: "#3b82f6",
  "Source Control": "#6366f1",
  "CI/CD": "#22c55e",
  "Code Quality": "#f59e0b",
  "Security Testing": "#ef4444",
  Deployment: "#a855f7",
  IaC: "#14b8a6",
  Automation: "#0ea5e9",
  Containers: "#f97316",
  "Secrets Management": "#ec4899",
  Monitoring: "#84cc16"
};

const table = document.getElementById("table");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const legend = document.getElementById("legend");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

let elements = [];

function buildLegend() {
  const uniqueCategories = [...new Set(elements.map(el => el.category))];
  legend.innerHTML = "";
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  uniqueCategories.forEach(category => {
    const legendItem = document.createElement("div");
    legendItem.className = "legend-item";
    legendItem.innerHTML = `
      <span class="swatch" style="background:${categories[category] || "#999"}"></span>
      <span>${category}</span>
    `;
    legend.appendChild(legendItem);

    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function openModal(el) {
  modalContent.innerHTML = `
    <h2>${el.name}</h2>
    <p class="meta"><strong>Symbol:</strong> ${el.symbol}</p>
    <p class="meta"><strong>Atomic No:</strong> ${el.atomic}</p>
    <p class="meta"><strong>Category:</strong> ${el.category}</p>
    <p class="meta"><strong>Position:</strong> Row ${el.row}, Col ${el.col}</p>
    <p class="meta">${el.details || ""}</p>
    ${
      el.website
        ? `<p class="meta"><strong>Website:</strong> <a href="${el.website}" target="_blank" rel="noopener noreferrer">${el.website}</a></p>`
        : ""
    }
  `;
  modalBackdrop.classList.remove("hidden");
}

function renderTable() {
  const q = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  table.innerHTML = "";

  const filtered = elements.filter(el => {
    const textMatch =
      el.name.toLowerCase().includes(q) ||
      el.symbol.toLowerCase().includes(q) ||
      String(el.atomic).includes(q) ||
      (el.category || "").toLowerCase().includes(q) ||
      (el.details || "").toLowerCase().includes(q);

    const categoryMatch =
      selectedCategory === "all" || el.category === selectedCategory;

    return textMatch && categoryMatch;
  });

  filtered.forEach(el => {
    const card = document.createElement("div");
    card.className = "element";
    card.style.gridColumn = el.col;
    card.style.gridRow = el.row;
    card.style.background = categories[el.category] || "#64748b";
    card.innerHTML = `
      <div class="atomic">${el.atomic}</div>
      <div class="symbol">${el.symbol}</div>
      <div class="name">${el.name}</div>
    `;
    card.addEventListener("click", () => openModal(el));
    table.appendChild(card);
  });
}

async function init() {
  try {
    const response = await fetch("elements.json");
    if (!response.ok) {
      throw new Error(`Failed to load elements.json: ${response.status}`);
    }

    elements = await response.json();
    buildLegend();
    renderTable();
  } catch (error) {
    table.innerHTML = `
      <div style="grid-column:1 / -1; color:#fff; padding:20px; background:#b91c1c; border-radius:12px;">
        Could not load elements.json. Make sure the file is in the same folder as index.html or update the fetch path.
      </div>
    `;
    console.error(error);
  }
}

searchInput.addEventListener("input", renderTable);
categoryFilter.addEventListener("change", renderTable);

closeModal.addEventListener("click", () => {
  modalBackdrop.classList.add("hidden");
});

modalBackdrop.addEventListener("click", e => {
  if (e.target === modalBackdrop) {
    modalBackdrop.classList.add("hidden");
  }
});

init();
