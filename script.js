let categories = [];
let tools = [];
let active = new Set();

const legend = document.getElementById("legend");
const board = document.getElementById("board");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const modalContent = document.getElementById("modalContent");
const clearFilters = document.getElementById("clearFilters");
const closeModal = document.getElementById("closeModal");

async function loadData() {
  const res = await fetch("elements.json");
  const data = await res.json();
  categories = data.categories;
  tools = data.tools;
}

function buildLegend() {
  legend.innerHTML = "";
  categories.forEach(cat => {
    const b = document.createElement("button");
    b.className = "legend-item";
    b.type = "button";
    b.textContent = cat;
    b.onclick = () => {
      active.has(cat) ? active.delete(cat) : active.add(cat);
      render();
    };
    legend.appendChild(b);
  });
}

function openModal(tool) {
  modalContent.innerHTML = `
    <h2 id="modalTitle">${tool.name}</h2>
    <p><strong>${tool.s}</strong> — ${tool.cat}</p>
    <p>Tile ${tool.n} placed in the fixed periodic grid at row ${tool.r}, column ${tool.c}.</p>
  `;
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function close() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

overlay.onclick = close;
closeModal.onclick = close;
clearFilters.onclick = () => {
  active.clear();
  render();
};

function render() {
  legend.querySelectorAll(".legend-item").forEach((el, i) => {
    el.classList.toggle("active", active.has(categories[i]));
  });

  board.innerHTML = "";

  tools.forEach(tool => {
    const tile = document.createElement("div");
    tile.className = "tile";
    if (active.size && !active.has(tool.cat)) tile.classList.add("dim");
    if (active.has(tool.cat)) tile.classList.add("active");
    tile.style.gridColumn = tool.c;
    tile.style.gridRow = tool.r;

    tile.innerHTML = `
      <div class="num">${tool.n}</div>
      <div class="sym">${tool.s}</div>
      <div class="name">${tool.name}</div>
      <div class="cat">${tool.cat}</div>
    `;

    tile.onclick = () => openModal(tool);
    board.appendChild(tile);
  });
}

(async function init() {
  await loadData();
  buildLegend();
  render();
})();
