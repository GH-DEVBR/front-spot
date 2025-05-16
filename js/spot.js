const API_URL = 'http://localhost:8081/api/spots';

async function carregarSpot() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    document.body.innerHTML = '<h2>ID do Spot inválido</h2>';
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${id}`);
    const spot = await res.json();

    document.getElementById('spotNome').textContent = spot.nome;
    document.getElementById('spotNivel').textContent = `Nível: ${spot.nivel}`;

    const climaRes = await fetch(`${API_URL}/${id}/weather`);
    const clima = await climaRes.text();

    document.getElementById('climaInfo').textContent = clima;
  } catch (err) {
    document.getElementById('climaInfo').textContent = 'Erro ao carregar o clima.';
    console.error(err);
  }
}

carregarSpot();


