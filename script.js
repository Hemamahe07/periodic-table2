let tools = [];
const activeCategories = new Set();
let searchTerm = "";
let viewMode = "all";

const table = document.getElementById("table");
const legend = document.getElementById("legend");
const search = document.getElementById("search");
const viewModeSelect = document.getElementById("viewMode");

const modal = document.getElementById("detailModal");
const closeModal = document.getElementById("closeModal");
const detailTitle = document.getElementById("detailTitle");
const detailCategory = document.getElementById("detailCategory");
const detailShort = document.getElementById("detailShort");
const detailLink = document.getElementById("detailLink");

const normalize = s => (s || "").toString().toLowerCase().trim();

function renderLegend() {
  const cats = [...new Map(tools.map(t => [t.category, t.color])).entries()];
  legend.innerHTML = cats.map(([category, color]) => `
    <div class="legend-item ${activeCategories.has(category) ? "active" : ""}" data-category="${category}">
      <span class="swatch" style="background:${color}"></span>
      <span>${category}</span>
    </div>
  `).join("");

  legend.querySelectorAll(".legend-item").forEach(item => {
    item.addEventListener("click", () => {
      const cat = item.dataset.category;
      if (activeCategories.has(cat)) activeCategories.delete(cat);
      else activeCategories.add(cat);
      renderLegend();
      renderTable();
    });
  });
}

function isMatch(tool) {
  const q = normalize(searchTerm);
  const text = normalize(`${tool.name} ${tool.short} ${tool.category}`);
  const searchOk = !q || text.includes(q);
  const categoryOk = activeCategories.size === 0 || activeCategories.has(tool.category);
  return searchOk && categoryOk;
}

function renderTable() {
  table.innerHTML = tools.map(tool => {
    const selected = activeCategories.has(tool.category);
    const match = isMatch(tool);
    const dimClass = (viewMode === "dim" && activeCategories.size > 0 && !selected) ? "dimmed" : "";
    const hideClass = (viewMode === "selected" && activeCategories.size > 0 && !selected) ? "hidden" : "";
    const shouldShow = searchTerm ? match : true;
    const finalHidden = !shouldShow ? "hidden" : hideClass;

    return `
      <article
        class="element ${finalHidden} ${dimClass} ${selected ? "selected" : ""}"
        style="grid-column:${tool.col}; grid-row:${tool.row}; background:${tool.color};"
        data-id="${tool.id}"
        data-category="${tool.category}"
      >
        <div class="atomic">${tool.id}</div>
        <div class="symbol">${tool.short}</div>
        <div class="name">${tool.name}</div>
        <div class="badge">${tool.category}</div>
      </article>
    `;
  }).join("");

  table.querySelectorAll(".element").forEach(el => {
    el.addEventListener("click", () => {
      const tool = tools.find(t => String(t.id) === el.dataset.id);
      if (!tool) return;
      detailTitle.textContent = tool.name;
      detailCategory.textContent = tool.category;
      detailShort.textContent = `${tool.short} • Tile ${tool.id}`;
      detailLink.href = tool.url;
      modal.classList.remove("hidden");
    });
  });
}

function closeDetail() {
  modal.classList.add("hidden");
}

search.addEventListener("input", e => {
  searchTerm = e.target.value;
  renderTable();
});

viewModeSelect.addEventListener("change", e => {
  viewMode = e.target.value;
  renderTable();
});

closeModal.addEventListener("click", closeDetail);
modal.addEventListener("click", e => {
  if (e.target === modal) closeDetail();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeDetail();
});

fetch("elements.json")
  .then(r => r.json())
  .then(data => {
    tools = data;
    renderLegend();
    renderTable();
  });
