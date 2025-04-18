function updateCountdown() {
  fetch('https://ergast.com/api/f1/current.json')
    .then(response => response.json())
    .then(data => {
      const races = data.MRData.RaceTable.Races;
      const now = new Date();
      let nextRace = null;
      for (let race of races) {
        const raceDate = new Date(`${race.date}T${race.time}`);
        if (raceDate > now) {
          nextRace = race;
          break;
        }
      }
      if (nextRace) {
        const raceDate = new Date(`${nextRace.date}T${race.time}`);
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
    .catch(error => console.error('Error:', error));
}
setInterval(updateCountdown, 60000);
updateCountdown();
