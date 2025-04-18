fetch('https://api.jolpi.ca/ergast/f1/2025/driverStandings.json')
  .then(response => response.json())
  .then(data => {
    const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    let table = '<table><tr><th>Posición</th><th>Piloto</th><th>Equipo</th><th>Puntos</th></tr>';
    for (let driver of standings) {
      table += `<tr>
        <td>${driver.position}</td>
        <td>${driver.Driver.givenName} ${driver.Driver.familyName}</td>
        <td>${driver.Constructors[0].name}</td>
        <td>${driver.points}</td>
      </tr>`;
    }
    table += '</table>';
    document.getElementById('driver-standings').innerHTML = table;
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('driver-standings').innerHTML = 'Error al cargar las clasificaciones.';
  });
