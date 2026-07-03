// Load JSON data and initialize
async function loadData() {
  const response = await fetch('elements.json');
  const tools = await response.json();
  buildTable(tools);
  buildLegend(tools);
  buildFilter(tools);
}

// Build the periodic table grid
function buildTable(tools) {
  const table = document.getElementById('periodicTable');
  table.innerHTML = '';

  tools.forEach(tool => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.gridColumn = tool.col;
    card.style.gridRow = tool.row;
    card.style.backgroundColor = tool.color;

    card.innerHTML = `
      <div class="card-symbol">${tool.symbol}</div>
      <div class="card-name">${tool.name}</div>
    `;

    card.addEventListener('click', () => openPopup(tool));
    table.appendChild(card);
  });
}

// Build legend dynamically
function buildLegend(tools) {
  const legend = document.getElementById('legend');
  legend.innerHTML = '';
  const categories = [...new Set(tools.map(t => t.category))];

  categories.forEach(cat => {
    const color = tools.find(t => t.category === cat).color;
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `<div class="legend-color" style="background:${color}"></div>${cat}`;
    legend.appendChild(item);
  });
}

// Build category filter + search
function buildFilter(tools) {
  const filter = document.getElementById('categoryFilter');
  const categories = [...new Set(tools.map(t => t.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  filter.addEventListener('change', () => {
    const value = filter.value;
    const search = document.getElementById('searchBar').value.toLowerCase();
    filterTools(tools, search, value);
  });

  document.getElementById('searchBar').addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    const value = filter.value;
    filterTools(tools, search, value);
  });
}

// Filter logic
function filterTools(tools, search, category) {
  const table = document.getElementById('periodicTable');
  table.innerHTML = '';

  tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(search) || tool.symbol.toLowerCase().includes(search);
    const matchesCategory = category === 'all' || tool.category === category;
    return matchesSearch && matchesCategory;
  }).forEach(tool => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.gridColumn = tool.col;
    card.style.gridRow = tool.row;
    card.style.backgroundColor = tool.color;

    card.innerHTML = `
      <div class="card-symbol">${tool.symbol}</div>
      <div class="card-name">${tool.name}</div>
    `;

    card.addEventListener('click', () => openPopup(tool));
    table.appendChild(card);
  });
}

// Popup logic
function openPopup(tool) {
  document.getElementById('popupSymbol').textContent = tool.symbol;
  document.getElementById('popupName').textContent = tool.name;
  document.getElementById('popupCategory').textContent = tool.category;
  document.getElementById('popupDescription').textContent = tool.description;
  document.getElementById('popupWebsite').href = tool.website;

  document.getElementById('popup').classList.remove('hidden');
}

// Close popup
document.getElementById('closePopup').addEventListener('click', () => {
  document.getElementById('popup').classList.add('hidden');
});

// Close popup when clicking outside
window.addEventListener('click', (e) => {
  if (e.target.id === 'popup') {
    document.getElementById('popup').classList.add('hidden');
  }
});

// Initialize everything
loadData();
