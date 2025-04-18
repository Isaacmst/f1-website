// Datos de circuitos (puedes agregar más circuitos aquí)
const circuitData = {
  'Saudi Arabian Grand Prix': {
    image: 'images/jeddah_corniche_circuit.png', // Nueva ruta
    details: {
      length: '6.174 km',
      creation: '2021',
      elevation: '0-10 m (nivel del mar)',
      lapRecord: '1:30.734 (Lewis Hamilton, 2021)'
    },
    history: [
      { year: 2021, winner: 'Lewis Hamilton (Mercedes)', pole: 'Lewis Hamilton' },
      { year: 2022, winner: 'Max Verstappen (Red Bull)', pole: 'Sergio Pérez' },
      { year: 2023, winner: 'Sergio Pérez (Red Bull)', pole: 'Sergio Pérez' },
      { year: 2024, winner: 'Max Verstappen (Red Bull)', pole: 'Max Verstappen' }
    ]
  }

  // Agrega más circuitos aquí, por ejemplo:
  // 'Japanese Grand Prix': { image: '...', details: {...}, history: [...] }
};

function updateCountdown() {
  fetch('https://api.jolpi.ca/ergast/f1/2025.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (!data || !data.MRData || !data.MRData.RaceTable || !Array.isArray(data.MRData.RaceTable.Races)) {
        throw new Error('Datos de carreras no encontrados o no válidos');
      }
      const races = data.MRData.RaceTable.Races;
      const now = new Date();
      let nextRace = null;
      for (let race of races) {
        if (!race.date || !race.time) {
          console.warn('Carrera sin fecha o hora:', race);
          continue;
        }
        const raceDate = new Date(`${race.date}T${race.time}`);
        if (isNaN(raceDate.getTime())) {
          console.warn('Fecha inválida para carrera:', race);
          continue;
        }
        if (raceDate > now) {
          nextRace = race;
          break;
        }
      }
      if (nextRace) {
        const raceDate = new Date(`${nextRace.date}T${nextRace.time}`);
        const diff = raceDate - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById('countdown').innerText = 
          `Faltan ${days} días, ${hours} horas y ${minutes} minutos para ${nextRace.raceName}`;
        // Actualizar datos del circuito
        document.getElementById('race-name').innerText = nextRace.raceName;
        if (circuitData[nextRace.raceName]) {
          const circuit = circuitData[nextRace.raceName];
          // Imagen del circuito
          document.getElementById('circuit-image').src = circuit.image;
          // Detalles del circuito
          let detailsHtml = `
            <p><strong>Longitud:</strong> ${circuit.details.length}</p>
            <p><strong>Fecha de creación:</strong> ${circuit.details.creation}</p>
            <p><strong>Elevación:</strong> ${circuit.details.elevation}</p>
            <p><strong>Récord de vuelta:</strong> ${circuit.details.lapRecord}</p>
          `;
          document.getElementById('circuit-details').innerHTML = detailsHtml;
          // Historial de ganadores y polemans
          let historyHtml = '<table><tr><th>Año</th><th>Ganador</th><th>Pole</th></tr>';
          for (let entry of circuit.history) {
            historyHtml += `<tr>
              <td>${entry.year}</td>
              <td>${entry.winner}</td>
              <td>${entry.pole}</td>
            </tr>`;
          }
          historyHtml += '</table>';
          document.getElementById('race-history').innerHTML = historyHtml;
        } else {
          document.getElementById('circuit-image').src = '';
          document.getElementById('circuit-details').innerHTML = '<p>Datos del circuito no disponibles.</p>';
          document.getElementById('race-history').innerHTML = '<p>Historial no disponible.</p>';
        }
      } else {
        document.getElementById('countdown').innerText = 'No hay carreras programadas.';
        document.getElementById('race-name').innerText = '';
        document.getElementById('circuit-image').src = '';
        document.getElementById('circuit-details').innerHTML = '';
        document.getElementById('race-history').innerHTML = '';
      }
    })
    .catch(error => {
      console.error('Error en updateCountdown:', error);
      document.getElementById('countdown').innerText = 'Error al cargar el temporizador.';
      document.getElementById('race-name').innerText = '';
      document.getElementById('circuit-image').src = '';
      document.getElementById('circuit-details').innerHTML = '';
      document.getElementById('race-history').innerHTML = '';
    });
}
setInterval(updateCountdown, 60000);

// Dentro de updateCountdown, donde se actualiza la imagen
if (circuitData[nextRace.raceName]) {
  const circuit = circuitData[nextRace.raceName];
  const imgElement = document.getElementById('circuit-image');
  imgElement.src = circuit.image;
  imgElement.onerror = () => {
    console.error('Error al cargar la imagen del circuito:', circuit.image);
    imgElement.src = ''; // Limpiar si falla
    imgElement.alt = 'Imagen no disponible';
  };
  // Resto del código para detalles e historial...
}

updateCountdown();
