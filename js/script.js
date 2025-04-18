/// Datos de los circuitos (agrega más circuitos aquí si quieres)
const circuitData = {
  'Saudi Arabian Grand Prix': {
    image: 'images/jeddah_corniche_circuit.png', // Imagen local (sube esta imagen al repositorio)
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
  // Puedes agregar más circuitos, por ejemplo:
  // 'Japanese Grand Prix': { image: 'images/suzuka_circuit.png', details: {...}, history: [...] }
};

// Función para actualizar el temporizador y la sección del circuito
function updateCountdown() {
  fetch('https://api.jolpi.ca/ergast/f1/2025.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Validar la estructura de los datos de la API
      if (!data || !data.MRData || !data.MRData.RaceTable || !Array.isArray(data.MRData.RaceTable.Races)) {
        throw new Error('Datos de carreras no encontrados o no válidos');
      }

      const races = data.MRData.RaceTable.Races;
      const now = new Date();
      let nextRace = null;

      // Encontrar la próxima carrera
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

      // Actualizar el temporizador y la sección del circuito
      if (nextRace) {
        // Calcular tiempo restante
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

          // Cargar la imagen del circuito
          const imgElement = document.getElementById('circuit-image');
          imgElement.src = circuit.image;
          imgElement.alt = `Mapa del circuito - ${nextRace.raceName}`;
          imgElement.onerror = () => {
            console.error('Error al cargar la imagen del circuito:', circuit.image);
            imgElement.src = '';
            imgElement.alt = 'Imagen no disponible';
          };

          // Mostrar detalles del circuito
          let detailsHtml = `
            <p><strong>Longitud:</strong> ${circuit.details.length}</p>
            <p><strong>Fecha de creación:</strong> ${circuit.details.creation}</p>
            <p><strong>Elevación:</strong> ${circuit.details.elevation}</p>
            <p><strong>Récord de vuelta:</strong> ${circuit.details.lapRecord}</p>
          `;
          document.getElementById('circuit-details').innerHTML = detailsHtml;

          // Mostrar historial de ganadores y polemans
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
          // Si no hay datos del circuito, mostrar mensaje
          document.getElementById('circuit-image').src = '';
          document.getElementById('circuit-image').alt = 'Imagen no disponible';
          document.getElementById('circuit-details').innerHTML = '<p>Datos del circuito no disponibles.</p>';
          document.getElementById('race-history').innerHTML = '<p>Historial no disponible.</p>';
        }
      } else {
        // Si no hay próxima carrera
        document.getElementById('countdown').innerText = 'No hay carreras programadas.';
        document.getElementById('race-name').innerText = '';
        document.getElementById('circuit-image').src = '';
        document.getElementById('circuit-image').alt = '';
        document.getElementById('circuit-details').innerHTML = '';
        document.getElementById('race-history').innerHTML = '';
      }
    })
    .catch(error => {
      console.error('Error en updateCountdown:', error);
      document.getElementById('countdown').innerText = 'Error al cargar el temporizador.';
      document.getElementById('race-name').innerText = '';
      document.getElementById('circuit-image').src = '';
      document.getElementById('circuit-image').alt = '';
      document.getElementById('circuit-details').innerHTML = '';
      document.getElementById('race-history').innerHTML = '';
    });
}

// Interactividad: Ampliar imagen al hacer clic
document.addEventListener('DOMContentLoaded', () => {
  const imgElement = document.getElementById('circuit-image');
  if (imgElement) {
    imgElement.addEventListener('click', () => {
      if (imgElement.style.maxWidth === '100%' || !imgElement.style.maxWidth) {
        imgElement.style.maxWidth = '1000px'; // Ampliar
      } else {
        imgElement.style.maxWidth = '100%'; // Volver al tamaño normal
      }
    });
  }
});

// Ejecutar la función cada minuto y al cargar la página
setInterval(updateCountdown, 60000);
updateCountdown();
