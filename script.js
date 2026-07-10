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
const status = document.getElementById("status");

function getColor(i) {
  const colors = [
    "#2a74ff","#18a58b","#9b59b6","#e67e22","#e74c3c",
    "#16a085","#f1c40f","#34495e","#1abc9c","#d35400",
    "#8e44ad","#3498db","#27ae60","#c0392b","#7f8c8d",
    "#6c5ce7","#00b894","#fd79a8"
  ];
  return colors[i % colors.length];
}

async function loadData() {
  try {
    const res = await fetch("./elements.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`JSON load failed: ${res.status}`);
    const data = await res.json();
    categories = data.categories || [];
    tools = data.tools || [];
    status.textContent = "";
  } catch (err) {
    status.textContent = "elements.json failed to load. Run this from a local server and keep JSON in the same folder.";
    console.error(err);
    categories = [];
    tools = [];
  }
}

function buildLegend() {
  legend.innerHTML = "";
  categories.forEach((cat, i) => {
    const b = document.createElement("button");
    b.className = "legend-item";
    b.type = "button";
    b.textContent = cat;
    b.dataset.cat = cat;
    b.style.setProperty("--cat-color", getColor(i));
    b.onclick = () => {
      if (active.has(cat)) active.delete(cat);
      else active.add(cat);
      render();
    };
    legend.appendChild(b);
  });
}

function openModal(tool) {
  modalContent.innerHTML = `
    <h2 id="modalTitle">${tool.name}</h2>
    <p><strong>${tool.s}</strong> — ${tool.cat}</p>
    <p>Tile ${tool.n} is placed at row ${tool.r}, column ${tool.c}.</p>
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
    const cat = categories[i];
    const isActive = active.has(cat);
    el.classList.toggle("active", isActive);
    el.style.background = isActive ? getColor(i) : "#fff";
    el.style.color = isActive ? "#fff" : "#102033";
    el.style.borderColor = isActive ? getColor(i) : "var(--line)";
  });

  board.innerHTML = "";

  tools.forEach(tool => {
    const tile = document.createElement("div");
    const isActive = active.has(tool.cat);
    const color = getColor(categories.indexOf(tool.cat));

    tile.className = "tile";
    if (active.size && !isActive) tile.classList.add("dim");

    tile.style.gridColumn = tool.c;
    tile.style.gridRow = tool.r;

    if (isActive) {
      tile.style.background = color;
      tile.style.borderColor = color;
      tile.style.color = "#fff";
    } else {
      tile.style.background = "var(--panel-2)";
      tile.style.borderColor = "var(--line)";
      tile.style.color = "var(--ink)";
    }

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
