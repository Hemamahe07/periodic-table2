const categories = [
  "Artifact/Package Management","Collaboration","Configuration Automation","Container Orchestration",
  "Database Management","Deployment","Enterprise Agile Planning","IT Service Management",
  "PaaS/Container Service","Release Management","Security","Source Control Management",
  "Testing","Value Stream Management","Continuous Integration","Public Cloud",
  "Developer Portal","DevOps AI-ML Analytics"
];

const tools = [
  {n:1,s:"Da",name:"Digital.ai",cat:"DevOps AI-ML Analytics",r:1,c:1},
  {n:2,s:"Gh",name:"GitHub",cat:"Source Control Management",r:1,c:2},
  {n:3,s:"Az",name:"Azure DevOps",cat:"Enterprise Agile Planning",r:1,c:3},
  {n:4,s:"Ji",name:"Jira",cat:"Enterprise Agile Planning",r:1,c:4},
  {n:5,s:"Sl",name:"Slack",cat:"Collaboration",r:1,c:5},
  {n:6,s:"So",name:"SonarQube",cat:"Testing",r:1,c:6},
  {n:7,s:"Jf",name:"JFrog Artifactory",cat:"Artifact/Package Management",r:1,c:7},
  {n:8,s:"Do",name:"Docker",cat:"Container Orchestration",r:1,c:8},
  {n:9,s:"Ku",name:"Kubernetes",cat:"Container Orchestration",r:1,c:9},
  {n:10,s:"Aw",name:"AWS",cat:"Public Cloud",r:1,c:10}
];

const legend = document.getElementById("legend");
const board = document.getElementById("board");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const modalContent = document.getElementById("modalContent");
const clearFilters = document.getElementById("clearFilters");
const closeModal = document.getElementById("closeModal");
let active = new Set();

categories.forEach(cat => {
  const b = document.createElement("button");
  b.className = "legend-item";
  b.textContent = cat;
  b.onclick = () => {
    active.has(cat) ? active.delete(cat) : active.add(cat);
    render();
  };
  legend.appendChild(b);
});

function openModal(tool){
  modalContent.innerHTML = `
    <h2>${tool.name}</h2>
    <p><strong>${tool.s}</strong> — ${tool.cat}</p>
    <p>Tile ${tool.n} placed in the fixed periodic grid.</p>
  `;
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function close(){
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

overlay.onclick = close;
closeModal.onclick = close;
clearFilters.onclick = () => { active.clear(); render(); };

function render(){
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

render();
