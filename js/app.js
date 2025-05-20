async function buscarPraia() {
  const nome = document.getElementById("searchInput").value.trim();
  const container = document.getElementById("resultados");
  container.innerHTML = "";

  try {
    const response = await fetch(`https://surf-backend.onrender.com/api/spots`);
    if (!response.ok) {
      throw new Error("Erro na resposta da API");
    }

    const data = await response.json();

    // Filtro local por nome
    const praiasFiltradas = data.filter(praia =>
      praia.nome.toLowerCase().includes(nome.toLowerCase())
    );

    if (praiasFiltradas.length === 0) {
      container.innerHTML = "<p>Nenhuma praia encontrada.</p>";
      return;
    }

    praiasFiltradas.forEach((praia, index) => {
      const bloco = document.createElement("div");
      bloco.className = "resultado-item";
      bloco.setAttribute("data-aos", "fade-up");

      bloco.innerHTML = `
        <h3>${praia.nome}</h3>
        <p><strong>Estado:</strong> ${praia.estado}</p>
        <p><strong>Latitude:</strong> ${praia.latitude}</p>
        <p><strong>Longitude:</strong> ${praia.longitude}</p>
        <div id="map-${index}" class="mapa"></div>
      `;
      container.appendChild(bloco);

      // Mapa com Leaflet
      const map = L.map(`map-${index}`).setView([praia.latitude, praia.longitude], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);

      L.marker([praia.latitude, praia.longitude]).addTo(map)
        .bindPopup(`${praia.nome}`)
        .openPopup();

      // Condições climáticas
      const climaDiv = document.createElement("div");
      climaDiv.className = "condicoes";
      bloco.appendChild(climaDiv);

      buscarCondicoes(praia.latitude, praia.longitude, climaDiv);
    });

  } catch (err) {
    console.error("Erro na busca:", err);
    container.innerHTML = "<p>❌ Erro ao buscar dados da API.</p>";
  }
}

// StormGlass API
async function buscarCondicoes(latitude, longitude, div) {
  const apiKey = '2bafb89a-34c4-11f0-a0f4-0242ac130003-2bafb8f4-34c4-11f0-a0f4-0242ac130003'; // ⬅️ Sua chave válida StormGlass

  const agora = new Date();
  const hoje = agora.toISOString().split('T')[0];

  const url = `https://api.stormglass.io/v2/weather/point?lat=${latitude}&lng=${longitude}&params=waveHeight,waterTemperature,windSpeed&source=noaa&start=${hoje}&end=${hoje}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': apiKey
      }
    });

    if (!response.ok) {
      throw new Error("Erro na StormGlass");
    }

    const data = await response.json();
    const hora = data.hours[0];

    const alturaOnda = hora.waveHeight.noaa;
    const vento = hora.windSpeed.noaa;
    const tempAgua = hora.waterTemperature.noaa;

    div.innerHTML = `
      <p>🌊 <strong>Ondas:</strong> ${alturaOnda?.toFixed(1) ?? 'N/A'} m</p>
      <p>💨 <strong>Vento:</strong> ${vento?.toFixed(1) ?? 'N/A'} km/h</p>
      <p>🌡️ <strong>Água:</strong> ${tempAgua?.toFixed(1) ?? 'N/A'} °C</p>
    `;

  } catch (err) {
    console.error("Erro ao buscar clima:", err);
    div.innerHTML = "<p>⚠️ Sem dados climáticos disponíveis no momento.</p>";
  }
}












