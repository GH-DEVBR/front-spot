const API_BASE = "http://localhost:8081/api/spots";
const MAP_CENTER = [-23.5489, -46.6388];
let markers = [];

const map = L.map('map').setView(MAP_CENTER, 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

async function carregarSpots() {
  const res = await fetch(API_BASE);
  const spots = await res.json();
  renderizarSpots(spots);
}

function renderizarSpots(spots) {
  const container = document.getElementById('spotsContainer');
  container.innerHTML = '';

  markers.forEach(m => map.removeLayer(m));
  markers = [];

  spots.forEach(spot => {
    const card = document.createElement('div');
    card.className = 'spot-card';
    card.innerHTML = `
      <h3>${spot.nome}</h3>
      <p>Nível: ${spot.nivel}</p>
      <a href="spot.html?id=${spot.id}">Ver Detalhes</a>
    `;
    container.appendChild(card);

    const marker = L.marker([spot.latitude, spot.longitude]).addTo(map);
    marker.bindPopup(`<b>${spot.nome}</b><br>Nível: ${spot.nivel}`);
    markers.push(marker);
  });
}

document.getElementById('searchInput').addEventListener('keyup', async (e) => {
  if (e.key === 'Enter') {
    const termo = e.target.value.trim();
    const res = await fetch(`${API_BASE}/search?nome=${encodeURIComponent(termo)}`);
    const spots = await res.json();
    renderizarSpots(spots);
  }
});

// também funciona em tempo real
document.getElementById('searchInput').addEventListener('input', async (e) => {
  const termo = e.target.value.trim();
  if (termo === "") {
    carregarSpots();
  }
});

carregarSpots();







