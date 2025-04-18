function updateCountdown() {
  fetch('https://api.jolpi.ca/ergast/f1/2025.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Validar la estructura de los datos
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
      } else {
        document.getElementById('countdown').innerText = 'No hay carreras programadas.';
      }
    })
    .catch(error => {
      console.error('Error en updateCountdown:', error);
      document.getElementById('countdown').innerText = 'Error al cargar el temporizador.';
    });
}
setInterval(updateCountdown, 60000);
updateCountdown();
