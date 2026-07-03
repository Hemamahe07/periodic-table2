async function loadElements() {
  const response = await fetch('elements.json');
  const elements = await response.json();

  const grid = document.getElementById('grid');
  const categoryFilter = document.getElementById('categoryFilter');
  const searchBar = document.getElementById('searchBar');
  const legend = document.getElementById('legend');

  // Populate grid
  elements.forEach(el => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.backgroundColor = el.color;
    card.style.gridColumn = el.col;
    card.style.gridRow = el.row;
    card.textContent = el.symbol;

    card.addEventListener('click', () => {
      document.getElementById('popupTitle').textContent = el.name;
      document.getElementById('popupDescription').textContent = el.description;
      document.getElementById('popupLink').href = el.website;
      document.getElementById('popup').classList.remove('hidden');
    });

    grid.appendChild(card);
  });

  // Close popup
  document.getElementById('closePopup').addEventListener('click', () => {
    document.getElementById('popup').classList.add('hidden');
  });

  // Categories
  const categories = [...new Set(elements.map(el => el.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Legend
  categories.forEach(cat => {
    const color = elements.find(el => el.category === cat).color;
    const item = document.createElement('div');
    item.innerHTML = `<span style="display:inline-block;width:20px;height:20px;background:${color};margin-right:5px;"></span>${cat}`;
    legend.appendChild(item);
  });

  // Search + Filter
  searchBar.addEventListener('input', () => filterElements(elements));
  categoryFilter.addEventListener('change', () => filterElements(elements));
}

function filterElements(elements) {
  const search = document.getElementById('searchBar').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  elements.filter(el => {
    const matchesSearch = el.name.toLowerCase().includes(search) || el.symbol.toLowerCase().includes(search);
    const matchesCategory = category === 'all' || el.category === category;
    return matchesSearch && matchesCategory;
  }).forEach(el => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.backgroundColor = el.color;
    card.style.gridColumn = el.col;
    card.style.gridRow = el.row;
    card.textContent = el.symbol;

    card.addEventListener('click', () => {
      document.getElementById('popupTitle').textContent = el.name;
      document.getElementById('popupDescription').textContent = el.description;
      document.getElementById('popupLink').href = el.website;
      document.getElementById('popup').classList.remove('hidden');
    });

    grid.appendChild(card);
  });
}

loadElements();
